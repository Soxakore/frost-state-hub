import { ReactNode } from "react";
import { statusTone } from "@/lib/frost";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <section className="container py-10 md:py-14"><div className="max-w-4xl animate-fade-up">{eyebrow && <p className="mb-3 font-command text-sm uppercase text-primary">{eyebrow}</p>}<h1 className="text-balance font-command text-4xl font-black md:text-6xl">{title}</h1>{children && <div className="mt-4 text-lg text-muted-foreground md:text-xl">{children}</div>}</div></section>;
}

export function FrostCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`frost-card frost-card-hover rounded-lg p-5 ${className}`}>{children}</div>;
}

export function StatusBadge({ status }: { status?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide status-${statusTone(status)}`}>{status || "TBD"}</span>;
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return <div className="container grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: count }).map((_, i) => <div key={i} className="frost-card h-36 animate-pulse rounded-lg" />)}</div>;
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="frost-card rounded-lg p-8 text-center"><p className="font-command text-xl font-bold">{title}</p><p className="mt-2 text-muted-foreground">{text}</p></div>;
}

export function AccessDenied() {
  return <section className="container py-20"><div className="frost-card mx-auto max-w-xl rounded-lg p-8 text-center"><h1 className="font-command text-3xl font-bold">Access denied</h1><p className="mt-3 text-muted-foreground">Your current role does not have permission to open this command panel.</p></div></section>;
}
