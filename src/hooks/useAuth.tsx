import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppRole, upsertProfileForUser } from "@/lib/frost";

type AuthState = {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  refreshRoles: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({ user: null, session: null, roles: [], loading: true, refreshRoles: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = async (userId?: string) => {
    if (!userId) {
      setRoles([]);
      return;
    }
    const { data } = await supabase.from("user_roles" as any).select("role").eq("user_id", userId);
    const nextRoles = ((data || []) as unknown as { role: AppRole }[]).map((row) => row.role);
    setRoles(nextRoles.length ? nextRoles : ["viewer"]);
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        setTimeout(async () => {
          await upsertProfileForUser();
          await loadRoles(nextSession.user.id);
          setLoading(false);
        }, 0);
      } else {
        setRoles([]);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        await upsertProfileForUser();
        await loadRoles(data.session.user.id);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ user: session?.user ?? null, session, roles, loading, refreshRoles: () => loadRoles(session?.user.id) }),
    [session, roles, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
