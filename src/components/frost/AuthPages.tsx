import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { FrostCard, PageHeader } from "./Ui";

function AuthBox({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const title = { login: "Login", register: "Register", forgot: "Forgot Password", reset: "Reset Password" }[mode];

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; toast.success("Welcome back to command."); navigate("/dashboard");
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: displayName } } }); if (error) throw error; toast.success("Registration started. Check your email to verify your account."); navigate("/login");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (error) throw error; toast.success("Password reset link sent.");
      } else {
        const { error } = await supabase.auth.updateUser({ password }); if (error) throw error; toast.success("Password updated."); navigate("/login");
      }
    } catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error(String(result.error.message || result.error));
  };

  return <section className="container grid min-h-[70vh] place-items-center py-12"><FrostCard className="w-full max-w-md"><h1 className="font-command text-3xl font-bold">{title}</h1><form onSubmit={submit} className="mt-6 grid gap-3">{mode === "register" && <input className="field" placeholder="Display name" value={displayName} onChange={e=>setDisplayName(e.target.value)} />} {mode !== "reset" && <input className="field" type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />} {mode !== "forgot" && <input className="field" type="password" required minLength={6} placeholder={mode === "reset" ? "New password" : "Password"} value={password} onChange={e=>setPassword(e.target.value)} />}<button disabled={busy} className="frost-button">{busy ? "Working..." : title}</button></form>{(mode === "login" || mode === "register") && <button onClick={google} className="ghost-button mt-3 w-full">Continue with Google</button>}<div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">{mode !== "login" && <Link className="text-primary" to="/login">Login</Link>}{mode !== "register" && <Link className="text-primary" to="/register">Register</Link>}{mode !== "forgot" && <Link className="text-primary" to="/forgot-password">Forgot password?</Link>}</div></FrostCard></section>;
}
export const LoginPage = () => <AuthBox mode="login" />;
export const RegisterPage = () => <AuthBox mode="register" />;
export const ForgotPasswordPage = () => <AuthBox mode="forgot" />;
export const ResetPasswordPage = () => <AuthBox mode="reset" />;

export function ProfilePage() {
  const { user, roles } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [ign, setIgn] = useState("");
  if (!user) return <Navigate to="/login" replace />;
  const save = async () => { const { error } = await supabase.from("profiles" as any).upsert({ id: user.id, email: user.email, display_name: name, in_game_name: ign } as any); error ? toast.error(error.message) : toast.success("Profile saved."); };
  return <><PageHeader eyebrow="Command identity" title="Profile"><p>Your account starts as Viewer. Only an Owner can promote moderator roles.</p></PageHeader><section className="container max-w-2xl pb-14"><FrostCard><p className="text-muted-foreground">Email: {user.email}</p><p className="mt-2 text-primary">Role badge: {roles.join(", ") || "viewer"}</p><div className="mt-5 grid gap-3"><input className="field" placeholder="Display name" value={name} onChange={e=>setName(e.target.value)} /><input className="field" placeholder="In-game name" value={ign} onChange={e=>setIgn(e.target.value)} /><button onClick={save} className="gold-button">Save Profile</button></div></FrostCard></section></>;
}
