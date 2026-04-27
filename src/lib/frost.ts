import { supabase } from "@/integrations/supabase/client";

export type AppRole = "owner" | "governor" | "r5_moderator" | "r4_moderator" | "event_manager" | "recruiter" | "viewer";
export type AnyRecord = Record<string, any>;

export const roleLabels: Record<AppRole, string> = {
  owner: "Owner",
  governor: "Governor / President",
  r5_moderator: "R5 Moderator",
  r4_moderator: "R4 Moderator",
  event_manager: "Event Manager",
  recruiter: "Recruiter",
  viewer: "Viewer",
};

export const publicNav = [
  ["/", "Home"],
  ["/events", "Events"],
  ["/rules", "Rules"],
  ["/transfer", "Transfer"],
  ["/alliances", "Alliances"],
  ["/svs", "SvS"],
  ["/governor", "Governor"],
  ["/guides", "Guides"],
] as const;

export const dashboardNav = [
  ["/dashboard", "Dashboard"],
  ["/dashboard/events", "Events Manager"],
  ["/dashboard/alliances", "Alliance Manager"],
  ["/dashboard/rules", "Rules Manager"],
  ["/dashboard/transfer", "Transfer Manager"],
  ["/dashboard/governor", "Governor Manager"],
  ["/dashboard/announcements", "Announcements"],
  ["/dashboard/users", "Users & Roles"],
  ["/dashboard/audit", "Audit Log"],
  ["/profile", "Profile"],
] as const;

export const canModerate = (roles: AppRole[]) => roles.some((r) => r !== "viewer");
export const hasAny = (roles: AppRole[], allowed: AppRole[]) => roles.some((r) => allowed.includes(r));

export function statusTone(status?: string) {
  const value = (status || "").toLowerCase();
  if (["active", "open", "published", "accepted", "yes", "available", "weekly"].some((s) => value.includes(s))) return "success";
  if (["limited", "pending", "reviewing", "need more info", "tbd"].some((s) => value.includes(s))) return "warning";
  if (["closed", "cancelled", "rejected", "war"].some((s) => value.includes(s))) return "danger";
  return "info";
}

export async function recordAudit(action: string, table_name: string, record_id?: string, old_value?: unknown, new_value?: unknown, role?: string) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("audit_logs" as any).insert({
    user_id: data.user.id,
    role,
    action,
    table_name,
    record_id,
    old_value: old_value as any,
    new_value: new_value as any,
  } as any);
}

export async function upsertProfileForUser() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;
  await supabase.from("profiles" as any).upsert({
    id: user.id,
    email: user.email,
    display_name: user.user_metadata?.full_name || user.email?.split("@")[0],
    avatar_url: user.user_metadata?.avatar_url,
    last_login: new Date().toISOString(),
  } as any);
  await supabase.from("user_roles" as any).insert({ user_id: user.id, role: "viewer" } as any);
}
