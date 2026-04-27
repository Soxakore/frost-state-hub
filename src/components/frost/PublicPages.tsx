import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Crown, Flame, Radio, Search, Shield, ShieldAlert, Snowflake, Swords, ThermometerSnowflake, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { hasAny } from "@/lib/frost";
import { EmptyState, FrostCard, PageHeader, SkeletonGrid, StatusBadge } from "./Ui";

type R = Record<string, any>;
const q = (table: string, order = "created_at") => supabase.from(table as any).select("*").order(order, { ascending: false });

/* ─── Wiki-style icon grid config ─── */
const wikiCategories = [
  {
    title: "State Hub",
    items: [
      { label: "Events", icon: "/wiki/icon-events.png", href: "/events" },
      { label: "Alliances", icon: "/wiki/icon-heroes.png", href: "/alliances" },
      { label: "Rules", icon: "/wiki/icon-buildings.png", href: "/rules" },
      { label: "Transfer", icon: "/wiki/icon-items.png", href: "/transfer" },
      { label: "SvS War Room", icon: "/wiki/icon-research.png", href: "/svs" },
      { label: "Guides", icon: "/wiki/icon-guide.png", href: "/guides" },
    ],
  },
  {
    title: "Leadership",
    items: [
      { label: "Governor", icon: "/wiki/icon-chief-gear.png", href: "/governor" },
      { label: "Report", icon: "/wiki/icon-news.png", href: "/report" },
      { label: "Dashboard", icon: "/wiki/icon-calculator.png", href: "/dashboard" },
    ],
  },
  {
    title: "Game Wiki",
    items: [
      { label: "Heroes", icon: "/wiki/icon-heroes.png", href: "https://www.whiteoutsurvival.wiki/heroes", ext: true },
      { label: "Hero Gears", icon: "/wiki/icon-hero-gear.png", href: "https://www.whiteoutsurvival.wiki/hero-gears/hero-gear", ext: true },
      { label: "Pets", icon: "/wiki/icon-pets.png", href: "https://www.whiteoutsurvival.wiki/pets", ext: true },
      { label: "Experts", icon: "/wiki/icon-experts.png", href: "https://www.whiteoutsurvival.wiki/experts/", ext: true },
      { label: "Territory", icon: "/wiki/icon-territory.png", href: "https://www.whiteoutsurvival.wiki/territory/alliance-territory", ext: true },
      { label: "Fortress", icon: "/wiki/icon-fortress.png", href: "https://www.whiteoutsurvival.wiki/alliance-fort/fortress-battles/", ext: true },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "Giftcode", icon: "/wiki/icon-giftcode.png", href: "https://www.whiteoutsurvival.wiki/giftcodes/", ext: true },
      { label: "Fanart", icon: "/wiki/icon-fanart.png", href: "https://www.whiteoutsurvival.wiki/fanarts/", ext: true },
      { label: "Poster", icon: "/wiki/icon-poster.png", href: "https://www.whiteoutsurvival.wiki/official-gallery/", ext: true },
    ],
  },
];

function WikiGridButton({ label, icon, href, ext }: { label: string; icon: string; href: string; ext?: boolean }) {
  if (ext) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="wiki-grid-button">
        <img src={icon} alt={label} loading="lazy" />
        <span>{label}</span>
      </a>
    );
  }
  return (
    <Link to={href} className="wiki-grid-button">
      <img src={icon} alt={label} loading="lazy" />
      <span>{label}</span>
    </Link>
  );
}

export function HomePage() {
  const { data: events, isLoading } = useQuery({ queryKey: ["home-events"], queryFn: async () => (await q("events", "updated_at").limit(3)).data as R[] || [] });
  const { data: announcements } = useQuery({ queryKey: ["home-announcements"], queryFn: async () => (await q("announcements", "published_at").eq("visibility", "Public").eq("status", "Published").limit(3)).data as R[] || [] });
  const { data: alliances } = useQuery({ queryKey: ["home-alliances"], queryFn: async () => (await q("alliances", "updated_at").eq("recruiting_status", "Yes").limit(3)).data as R[] || [] });

  return <>
    {/* ─── Wiki Layout: Banner + Grid + Sidebar ─── */}
    <section className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ─── Main Content ─── */}
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="wiki-banner overflow-hidden">
            <div className="relative">
              <img
                src="/frost/promo-command.png"
                alt="Whiteout Survival Banner"
                className="w-full h-auto max-h-[340px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(240_25%_10%)] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="font-command text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  State 4285 — Whiteout Command
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-200/80 max-w-2xl">
                  Rules, events, alliances, transfers, and SvS coordination for a state built to survive the storm.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link className="frost-button text-sm" to="/events">Event Schedule</Link>
                  <Link className="gold-button text-sm" to="/transfer">Apply to Join</Link>
                  <Link className="ghost-button text-sm" to="/rules">State Rules</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Category Grid Sections */}
          {wikiCategories.map((cat) => (
            <div key={cat.title}>
              <h2 className="wiki-section-title mb-4">{cat.title}</h2>
              <div className="wiki-grid">
                {cat.items.map((item) => (
                  <WikiGridButton key={item.label} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Sidebar ─── */}
        <aside className="space-y-6 animate-fade-up">
          {/* Tips from Greg */}
          <div className="wiki-panel">
            <h3 className="wiki-section-title text-lg mb-3">Tips from Greg</h3>
            <div className="flex gap-4">
              <img src="/wiki/greg.png" alt="Greg" className="w-16 h-16 object-contain shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">
                  "Keep your shelter warm and your alliances aligned. Blizzard pressure is rising — always check event times before going AFK."
                </p>
              </div>
            </div>
          </div>

          {/* State Status */}
          <div className="wiki-panel">
            <h3 className="wiki-section-title text-lg mb-3">State Status</h3>
            <div className="flex items-center gap-3 mb-3">
              <ThermometerSnowflake className="h-7 w-7 text-primary" />
              <div>
                <p className="font-command text-3xl font-bold">-68°C</p>
                <p className="text-xs text-primary">Severe cold</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Shelter Power", "87%", "+5%"],
                ["Troop Ready", "76%", "Hold lines"],
                ["Transfer Gate", "Limited", "Council review"],
              ].map(([k, v, note]) => (
                <div key={k} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <div className="text-right">
                    <b className="font-command">{v}</b>
                    <span className="ml-2 text-xs text-primary">{note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alliance Events */}
          <div className="wiki-panel">
            <div className="flex items-center justify-between mb-3">
              <h3 className="wiki-section-title text-lg">Events</h3>
              <Link className="text-xs text-primary hover:underline" to="/events">View All</Link>
            </div>
            {isLoading ? (
              <div className="h-20 animate-pulse rounded-lg bg-secondary/30" />
            ) : (
              <div className="space-y-2">
                {(events || []).slice(0, 3).map((event) => (
                  <div key={event.id} className="rounded-lg border border-border/50 bg-secondary/20 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <b className="text-sm">{event.name || event.title}</b>
                      <StatusBadge status={event.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{event.utc_time || event.instructions || "Starts soon"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transfer Status */}
          <div className="wiki-panel">
            <h3 className="wiki-section-title text-lg mb-3">Transfers</h3>
            <div className="grid grid-cols-[70px_1fr] gap-3">
              <div className="grid aspect-square place-items-center rounded-full border-[8px] border-primary/60 border-r-accent bg-secondary/40">
                <span className="font-command text-2xl font-bold">14</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="flex justify-between"><span className="text-muted-foreground">Pending</span><b className="text-warning">8</b></p>
                <p className="flex justify-between"><span className="text-muted-foreground">Approved</span><b className="text-success">4</b></p>
                <p className="flex justify-between"><span className="text-muted-foreground">Rejected</span><b className="text-destructive">2</b></p>
              </div>
            </div>
            <Link to="/transfer" className="mt-4 inline-flex frost-button text-sm w-full justify-center">Open Transfer Center</Link>
          </div>

          {/* Play the Game */}
          <div className="wiki-panel">
            <h3 className="wiki-section-title text-lg mb-3">Play the Game</h3>
            <div className="flex gap-3">
              <a href="https://play.google.com/store/apps/details?id=com.gof.global" target="_blank" rel="noopener noreferrer">
                <img src="/wiki/google-play.png" alt="Google Play" className="h-10 rounded transition hover:opacity-80" />
              </a>
              <a href="https://apps.apple.com/app/whiteout-survival/id1661842820" target="_blank" rel="noopener noreferrer">
                <img src="/wiki/app-store.png" alt="App Store" className="h-10 rounded transition hover:opacity-80" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>

    {/* ─── Bottom Panels (existing data sections) ─── */}
    <section className="container grid gap-5 py-8 lg:grid-cols-3">
      <HomePanel title="Upcoming Events" icon={<CalendarClock />} items={events} loading={isLoading} field="utc_time" />
      <HomePanel title="Latest Announcements" icon={<Radio />} items={announcements} field="category" />
      <HomePanel title="Top Recruiting Alliances" icon={<Users />} items={alliances} field="tag" />
    </section>

    <section className="container grid gap-5 pb-14 md:grid-cols-2">
      <FrostCard>
        <h3 className="font-command text-xl font-bold">Transfer Status</h3>
        <p className="mt-3 text-muted-foreground">Open / Limited — leadership is reviewing active players, rally joiners, F2P, dolphins, whales, and full groups.</p>
        <Link to="/transfer" className="mt-5 inline-flex frost-button">Open transfer center</Link>
      </FrostCard>
      <FrostCard>
        <h3 className="font-command text-xl font-bold">State Rules Preview</h3>
        <p className="mt-3 text-muted-foreground">Respect NAP cities, hives, fortress rotations, and protected events. Reports require screenshots.</p>
        <Link to="/rules" className="mt-5 inline-flex ghost-button">Read all rules</Link>
      </FrostCard>
    </section>
  </>;
}

function HomePanel({ title, icon, items = [], loading, field }: any) { return <FrostCard><div className="mb-4 flex items-center gap-3 text-primary">{icon}<h2 className="font-command text-xl font-bold text-foreground">{title}</h2></div>{loading ? <div className="h-24 animate-pulse rounded bg-secondary/40" /> : items.length ? <div className="space-y-3">{items.map((x:R) => <div key={x.id} className="rounded-md border border-border bg-secondary/30 p-3"><div className="flex items-center justify-between gap-3"><b>{x.title || x.name}</b><StatusBadge status={x.status || x.recruiting_status} /></div><p className="text-sm text-muted-foreground">{x[field] || x.message || x.description}</p></div>)}</div> : <EmptyState title="No intel" text="Nothing posted yet." />}</FrostCard> }

export function EventsPage() {
  const [search, setSearch] = useState("");
  const [selectedAllianceId, setSelectedAllianceId] = useState<string | null>(null);
  const { data: events, isLoading: eventsLoading } = useQuery({ queryKey: ["events"], queryFn: async () => (await supabase.from("events" as any).select("*").order("created_at")).data as R[] || [] });
  const { data: alliances, isLoading: alliancesLoading } = useQuery({ queryKey: ["event-alliances"], queryFn: async () => (await supabase.from("alliances" as any).select("*").order("name")).data as R[] || [] });
  const filteredAlliances = useMemo(() => (alliances || []).filter((a) => `${a.name} ${a.tag}`.toLowerCase().includes(search.toLowerCase())), [alliances, search]);
  const selectedAlliance = (alliances || []).find((a) => a.id === selectedAllianceId) || filteredAlliances[0];
  const allianceEvents = selectedAlliance ? [
    { name: "Bear Trap", utc_time: selectedAlliance.bear_trap_time || "TBD", status: selectedAlliance.recruiting_status || "Active", instructions: `${selectedAlliance.tag} Bear Trap schedule. Confirm rally leaders in alliance chat.`, updated_at: selectedAlliance.updated_at, updated_by: selectedAlliance.updated_by },
    { name: "Foundry Battle", utc_time: selectedAlliance.foundry_time || "TBD", status: "Alliance", instructions: `${selectedAlliance.tag} Foundry window. Register early and follow shot-caller lanes.`, updated_at: selectedAlliance.updated_at, updated_by: selectedAlliance.updated_by },
    { name: "Crazy Joe", utc_time: selectedAlliance.crazy_joe_time || "TBD", status: "Alliance", instructions: `${selectedAlliance.tag} Crazy Joe time. Reinforce correctly and follow R4/R5 notes.`, updated_at: selectedAlliance.updated_at, updated_by: selectedAlliance.updated_by },
    { name: "Canyon Clash", utc_time: selectedAlliance.canyon_clash_time || "TBD", status: "Alliance", instructions: `${selectedAlliance.tag} Canyon Clash timing. Confirm lineups, rally leads, and registration in alliance chat.`, updated_at: selectedAlliance.updated_at, updated_by: selectedAlliance.updated_by },
    { name: "Alliance Championship", utc_time: selectedAlliance.alliance_championship_time || "TBD", status: "Alliance", instructions: `${selectedAlliance.tag} Alliance Championship timing. Coordinate matchup notes with R4/R5 leadership.`, updated_at: selectedAlliance.updated_at, updated_by: selectedAlliance.updated_by },
  ] : [];
  const allianceEventNames = ["Bear Trap 1", "Bear Trap 2", "Bear Hunt", "Foundry Battle", "Crazy Joe", "Canyon Clash", "Alliance Championship"];
  const stateEvents = (events || []).filter((event) => !allianceEventNames.includes(event.name));
  const loading = eventsLoading || alliancesLoading;

  return <><PageHeader eyebrow="Alliance UTC command clock" title="Event Schedule"><p>Pick an alliance first to see its Bear Trap, Foundry, Crazy Joe, Canyon Clash, and Alliance Championship times. State-wide events remain listed below.</p></PageHeader>{loading ? <SkeletonGrid /> : <section className="container pb-14"><div className="mb-6 grid gap-4 lg:grid-cols-[320px_1fr]"><FrostCard><h2 className="font-command text-xl font-bold">Choose alliance</h2><div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input className="field w-full pl-9" placeholder="Search alliance name or tag" value={search} onChange={(e)=>setSearch(e.target.value)} /></div><div className="mt-4 grid max-h-[420px] gap-2 overflow-auto pr-1">{filteredAlliances.map((alliance) => <button key={alliance.id} onClick={() => setSelectedAllianceId(alliance.id)} className={`rounded-md border p-3 text-left transition hover:border-primary hover:bg-secondary/60 ${selectedAlliance?.id === alliance.id ? "border-primary bg-primary/15" : "border-border bg-secondary/30"}`}><span className="block font-command font-bold">{alliance.name}</span><span className="text-sm text-muted-foreground">[{alliance.tag}] · Bear {alliance.bear_trap_time || "TBD"}</span></button>)}</div></FrostCard><div><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm uppercase text-primary">Selected alliance</p><h2 className="font-command text-3xl font-black">{selectedAlliance ? `${selectedAlliance.name} [${selectedAlliance.tag}]` : "No alliance selected"}</h2></div>{selectedAlliance && <StatusBadge status={selectedAlliance.recruiting_status} />}</div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{allianceEvents.map((e) => <FrostCard key={e.name}><div className="flex items-start justify-between gap-4"><div><h3 className="font-command text-xl font-bold">{e.name}</h3><p className="mt-1 text-3xl font-bold text-primary">{e.utc_time}</p></div><StatusBadge status={e.status} /></div><p className="mt-4 text-muted-foreground">{e.instructions}</p><div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">Last updated by: {e.updated_by || "Command"} · {e.updated_at ? new Date(e.updated_at).toLocaleDateString() : "TBD"}</div></FrostCard>)}</div></div></div><div className="mt-8"><h2 className="mb-4 font-command text-2xl font-bold">State-wide events</h2><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{stateEvents.map(e => <FrostCard key={e.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-command text-2xl font-bold">{e.name}</h3><p className="mt-1 text-3xl font-bold text-primary">{e.utc_time}</p></div><StatusBadge status={e.status} /></div><p className="mt-4 text-muted-foreground">{e.instructions}</p><div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">Last updated by: {e.updated_by || "Command"} · {new Date(e.updated_at).toLocaleDateString()}</div></FrostCard>)}</div></div><p className="mt-8 text-sm text-muted-foreground">All times are shown in UTC. Always confirm in-game mail before major events.</p></section>}</>;
}

export function RulesPage() { const { data, isLoading } = useQuery({ queryKey: ["rules"], queryFn: async () => (await supabase.from("rules_sections" as any).select("*").order("created_at")).data as R[] || [] }); return <><PageHeader eyebrow="NAP / fair play" title="State Rules"><p>Clear rules keep State 4285 protected, organized, and ready for SvS.</p></PageHeader><section className="container pb-14"><Link to="/report" className="gold-button mb-6 inline-flex">Report a Problem</Link>{isLoading ? <SkeletonGrid /> : <div className="grid gap-5 md:grid-cols-2">{data?.map(r => <FrostCard key={r.id}><h2 className="font-command text-2xl font-bold">{r.title}</h2><ul className="mt-4 space-y-2 text-muted-foreground">{String(r.content).split("\n").map((line, i) => <li key={i} className="flex gap-2"><span className="text-primary">◆</span>{line}</li>)}</ul></FrostCard>)}</div>}</section></>; }

export function TransferPage() { const qc = useQueryClient(); const [form, setForm] = useState<R>({}); const { data: settings } = useQuery({ queryKey: ["transfer-settings"], queryFn: async () => (await supabase.from("transfer_settings" as any).select("*").limit(1).maybeSingle()).data as R }); const mutation = useMutation({ mutationFn: async () => { const { error } = await supabase.from("transfer_applications" as any).insert(form as any); if (error) throw error; }, onSuccess: () => { toast.success("Application submitted. State leadership will review it."); setForm({}); qc.invalidateQueries({ queryKey: ["applications"] }); }, onError: (e:any) => toast.error(e.message) }); const fields = ["in_game_name","current_state","current_alliance","power","furnace_level","time_zone","preferred_alliance","solo_or_group","events_available","message"]; return <><PageHeader eyebrow="Join State 4285" title="Transfer Center"><p>Transfer Status: <StatusBadge status={settings?.status || "Open"} /> Power Cap: {settings?.power_cap || "Editable placeholder"} · Special Invites: {settings?.special_invites || "Available"}</p></PageHeader><section className="container grid gap-6 pb-14 lg:grid-cols-[.85fr_1.15fr]"><FrostCard><h2 className="font-command text-2xl font-bold">Looking For</h2><p className="mt-3 text-muted-foreground">{settings?.looking_for}</p><h3 className="mt-6 font-command text-xl font-bold">Requirements</h3><p className="mt-3 text-muted-foreground">{settings?.requirements}</p></FrostCard><FrostCard><h2 className="font-command text-2xl font-bold">Transfer Application</h2><form onSubmit={(e)=>{e.preventDefault(); mutation.mutate();}} className="mt-5 grid gap-3 sm:grid-cols-2">{fields.map(f => f === "message" ? <textarea key={f} required className="field min-h-28 sm:col-span-2" placeholder="Message to leadership" value={form[f]||""} onChange={e=>setForm({...form,[f]:e.target.value})}/> : <input key={f} required={f==='in_game_name'} className="field" placeholder={f.replace(/_/g," ")} value={form[f]||""} onChange={e=>setForm({...form,[f]:e.target.value})}/>)}<button disabled={mutation.isPending} className="gold-button sm:col-span-2">{mutation.isPending ? "Submitting..." : "Submit Application"}</button></form></FrostCard></section></>; }

export function AlliancesPage() { const [search, setSearch] = useState(""); const [filter, setFilter] = useState("All"); const { data, isLoading } = useQuery({ queryKey: ["alliances"], queryFn: async () => (await supabase.from("alliances" as any).select("*").order("name")).data as R[] || [] }); const filtered = useMemo(() => (data||[]).filter(a => `${a.name} ${a.tag} ${a.description}`.toLowerCase().includes(search.toLowerCase()) && (filter === "All" || a.recruiting_status === filter)), [data, search, filter]); return <><PageHeader eyebrow="Recruitment network" title="Alliance Directory"><p>Search active alliances, event times, requirements, and contacts.</p></PageHeader><section className="container pb-14"><div className="mb-5 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><input className="field w-full pl-9" placeholder="Search alliances" value={search} onChange={e=>setSearch(e.target.value)} /></div><select className="field" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Yes</option><option>Limited</option><option>No</option></select></div>{isLoading ? <SkeletonGrid/> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map(a => <FrostCard key={a.id}><div className="flex items-start justify-between"><div><h2 className="font-command text-2xl font-bold">{a.name}</h2><p className="text-primary">[{a.tag}] · {a.power}</p></div><StatusBadge status={a.recruiting_status}/></div><p className="mt-3 text-muted-foreground">{a.description}</p><dl className="mt-4 grid grid-cols-2 gap-2 text-sm"><dt>Language</dt><dd>{a.main_language}</dd><dt>Bear</dt><dd>{a.bear_trap_time}</dd><dt>Foundry</dt><dd>{a.foundry_time}</dd><dt>Crazy Joe</dt><dd>{a.crazy_joe_time}</dd></dl><p className="mt-4 text-sm text-muted-foreground">Req: {a.requirements}</p><p className="mt-2 text-sm text-primary">Contact: {a.contact}</p><p className="mt-3 text-xs text-muted-foreground">Last updated: {new Date(a.updated_at).toLocaleDateString()}</p></FrostCard>)}</div>}</section></>; }

export function SvsPage() { const { roles } = useAuth(); const allowed = hasAny(roles, ["owner","governor","event_manager"]); const { data } = useQuery({ queryKey: ["svs-notes"], queryFn: async () => (await supabase.from("svs_notes" as any).select("*")).data as R[] || [], enabled: allowed }); const checklist = ["Save speedups before prep phase.","Use construction, research, training, and hero upgrades on correct prep days.","Shield if offline during battle.","Follow rally leader instructions.","Do not waste troops without a plan.","Coordinate healing and reinforcements.","Watch state chat and Discord."]; return <><PageHeader eyebrow="Strategic war room" title="SvS War Room"><p>Public coordination checklist for prep and battle discipline.</p></PageHeader><section className="container grid gap-6 pb-14 lg:grid-cols-2"><FrostCard><h2 className="font-command text-2xl font-bold">SvS Prep Checklist</h2><ul className="mt-4 space-y-3">{checklist.map(x=><li key={x} className="flex gap-3 text-muted-foreground"><Swords className="h-5 w-5 shrink-0 text-primary"/>{x}</li>)}</ul></FrostCard><FrostCard className="border-destructive/40"><h2 className="flex items-center gap-2 font-command text-2xl font-bold"><ShieldAlert className="text-destructive"/>Do-Not-Share Warning</h2><p className="mt-4 text-muted-foreground">Sensitive SvS strategy should not be public. This page is a general checklist. Private tactics should stay in Discord or leadership chat.</p>{allowed && <div className="mt-6 space-y-3">{data?.map(n=><div key={n.id} className="rounded-md border border-border bg-secondary/40 p-3"><b>{n.title}</b><pre className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{n.content}</pre></div>)}</div>}</FrostCard></section></>; }

export function GovernorPage() { const { data: board } = useQuery({ queryKey: ["governor"], queryFn: async () => (await supabase.from("governor_board" as any).select("*").limit(1).maybeSingle()).data as R }); const { data: anns } = useQuery({ queryKey: ["gov-anns"], queryFn: async () => (await supabase.from("announcements" as any).select("*").eq("status","Published").order("published_at", { ascending:false })).data as R[] || [] }); const buffs = board?.buff_schedule || {}; return <><PageHeader eyebrow="Leadership transparency" title="Governor Board"><p>Current Governor / President: {board?.current_governor || "TBD"}</p></PageHeader><section className="container grid gap-5 pb-14 lg:grid-cols-2"><FrostCard><Crown className="mb-3 text-accent"/><h2 className="font-command text-2xl font-bold">Minister Rotation</h2><p className="mt-3 text-muted-foreground">{board?.minister_rotation}</p><h2 className="mt-6 font-command text-2xl font-bold">Castle Rotation</h2><p className="mt-3 text-muted-foreground">{board?.castle_rotation}</p></FrostCard><FrostCard><h2 className="font-command text-2xl font-bold">Buff Schedule</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{["Training buff","Construction buff","Research buff","Healing buff"].map(k=><div className="rounded-md border border-border bg-secondary/35 p-3" key={k}><p className="text-muted-foreground">{k}</p><b>{buffs[k] || "TBD"}</b></div>)}</div></FrostCard><div className="lg:col-span-2 grid gap-4 md:grid-cols-2">{anns?.map(a=><FrostCard key={a.id}><StatusBadge status={a.category}/><h3 className="mt-3 font-command text-xl font-bold">{a.title}</h3><p className="mt-2 text-muted-foreground">{a.message}</p><p className="mt-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()} · Published by command</p></FrostCard>)}</div></section></>; }

export function GuidesPage() { const { data, isLoading } = useQuery({ queryKey: ["guides"], queryFn: async () => (await supabase.from("guides" as any).select("*").order("title")).data as R[] || [] }); return <><PageHeader eyebrow="Field manuals" title="Guides"><p>Short, direct, practical playbooks for every player type.</p></PageHeader><section className="container grid gap-5 pb-14 md:grid-cols-2 xl:grid-cols-3">{isLoading ? <SkeletonGrid/> : data?.map(g=><FrostCard key={g.id}><FileText className="mb-3 text-primary"/><StatusBadge status={g.category}/><h2 className="mt-3 font-command text-xl font-bold">{g.title}</h2><p className="mt-3 text-muted-foreground">{g.content}</p></FrostCard>)}</section></>; }

export function ReportPage() { const [form, setForm] = useState<R>({}); const mutation = useMutation({ mutationFn: async () => { const { error } = await supabase.from("reports" as any).insert(form as any); if (error) throw error; }, onSuccess: () => { toast.success("Report submitted."); setForm({}); }, onError: (e:any)=>toast.error(e.message) }); const fields=["reporter_name","reported_player","alliance","issue_type","description","screenshot_url"]; return <><PageHeader eyebrow="Evidence channel" title="Report a Problem"><p>Include clear screenshots and exact details so leadership can act quickly.</p></PageHeader><section className="container max-w-3xl pb-14"><FrostCard><form onSubmit={(e:FormEvent)=>{e.preventDefault(); mutation.mutate();}} className="grid gap-3">{fields.map(f=> f==="description" ? <textarea required className="field min-h-32" key={f} placeholder="Description" value={form[f]||""} onChange={e=>setForm({...form,[f]:e.target.value})}/> : <input required={f==='reporter_name'} className="field" key={f} placeholder={f.replace(/_/g," ")} value={form[f]||""} onChange={e=>setForm({...form,[f]:e.target.value})}/>)}<button className="gold-button">Submit Report</button></form></FrostCard></section></>; }
