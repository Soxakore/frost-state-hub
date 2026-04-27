import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu, Search, Shield, UserCircle, X } from "lucide-react";
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
    `wiki-nav-link ${isActive ? "active" : ""}`;

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="frost-shell relative">
      <div className="snow-layer fixed inset-0 opacity-20" />

      {/* ─── Navbar ─── */}
      <header className="wiki-navbar">
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/wiki/logo.png"
              alt="Whiteout Command"
              className="h-10 w-auto"
            />
            <span className="hidden sm:block leading-tight">
              <span className="block text-[10px] uppercase tracking-widest text-primary font-semibold">State 4285</span>
              <span className="font-command text-base font-bold text-foreground">Whiteout Command</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {publicNav.map(([href, label]) => (
              <NavLink key={href} to={href} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search icon */}
            <button className="ghost-button !px-2.5 !py-2 hidden lg:flex" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>

            {/* Auth buttons - desktop */}
            <div className="hidden items-center gap-2 lg:flex">
              {user && canModerate(roles) && (
                <Link to="/dashboard" className="gold-button flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" /> Dashboard
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" className="ghost-button flex items-center gap-2 text-sm">
                    <UserCircle className="h-4 w-4" /> {roleLabels[roles[0] || "viewer"]}
                  </Link>
                  <button onClick={logout} className="ghost-button !px-2.5" aria-label="Logout">
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="frost-button text-sm">Login</Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="ghost-button !px-2.5 !py-2 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="container grid gap-1 pb-4 lg:hidden animate-fade-up">
            {publicNav.map(([href, label]) => (
              <NavLink
                key={href}
                to={href}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-2 grid gap-2">
              {user && canModerate(roles) && (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="gold-button text-center text-sm">
                  Dashboard
                </Link>
              )}
              <Link
                to={user ? "/profile" : "/login"}
                onClick={() => setOpen(false)}
                className="frost-button text-center text-sm"
              >
                {user ? "Profile" : "Login"}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <footer className="wiki-footer">
        <div className="container">
          <img src="/wiki/logo-white.png" alt="Century Games" className="mx-auto mb-4 h-8 opacity-60" />
          <p className="mb-3">Whiteout Command — State 4285 © {new Date().getFullYear()}</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <span>·</span>
            <Link to="/terms">Terms of Service</Link>
            <span>·</span>
            <Link to="/privacy">Privacy Policy</Link>
            <span>·</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
