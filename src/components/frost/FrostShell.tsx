import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, Shield, Snowflake, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { canModerate, publicNav, roleLabels } from "@/lib/frost";
import { toast } from "sonner";

export function FrostShell() {
  const [open, setOpen] = useState(false);
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-bold transition ${isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"}`;

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="frost-shell frost-grid relative">
      <div className="snow-layer fixed inset-0 opacity-40" />
      <header className="sticky top-0 z-40 border-b border-border bg-background/78 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 font-command font-bold text-foreground">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-primary/40 bg-primary/15 shadow-command"><Snowflake className="h-5 w-5 text-primary" /></span>
            <span className="leading-tight"><span className="block text-sm text-primary">State 4285</span>Frost State Command</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {publicNav.map(([href, label]) => <NavLink key={href} to={href} className={linkClass}>{label}</NavLink>)}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {user && canModerate(roles) && <Link to="/dashboard" className="gold-button flex items-center gap-2"><Shield className="h-4 w-4" /> Dashboard</Link>}
            {user ? <><Link to="/profile" className="ghost-button flex items-center gap-2"><UserCircle className="h-4 w-4" /> {roleLabels[roles[0] || "viewer"]}</Link><button onClick={logout} className="ghost-button"><LogOut className="h-4 w-4" /></button></> : <Link to="/login" className="frost-button">Login</Link>}
          </div>
          <button className="ghost-button lg:hidden" onClick={() => setOpen(!open)} aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
        </div>
        {open && <div className="container grid gap-2 pb-4 lg:hidden">
          {publicNav.map(([href, label]) => <NavLink key={href} to={href} onClick={() => setOpen(false)} className={linkClass}>{label}</NavLink>)}
          {user && canModerate(roles) && <Link to="/dashboard" onClick={() => setOpen(false)} className="gold-button text-center">Dashboard</Link>}
          <Link to={user ? "/profile" : "/login"} onClick={() => setOpen(false)} className="frost-button text-center">{user ? "Profile" : "Login"}</Link>
        </div>}
      </header>
      <main className="relative z-10"><Outlet /></main>
    </div>
  );
}
