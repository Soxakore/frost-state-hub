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

/* ─── All 23 State 4285 alliances from game (default data) ─── */
const STATE_ALLIANCES: R[] = [
  { _static: true, tag: "VIP", name: "LEGENDS", power: "816,693,627", recruiting_status: "Limited" },
  { _static: true, tag: "GOP", name: "GoldenPact", power: "674,841,415", recruiting_status: "Yes" },
  { _static: true, tag: "FOC", name: "FOCUS", power: "569,474,186", recruiting_status: "Yes" },
  { _static: true, tag: "POL", name: "Pozytywni", power: "462,039,907", recruiting_status: "Yes" },
  { _static: true, tag: "FRA", name: "FRACTURE", power: "411,005,856", recruiting_status: "Yes" },
  { _static: true, tag: "SIN", name: "SINS", power: "407,303,069", recruiting_status: "Yes" },
  { _static: true, tag: "CEL", name: "Celestials", power: "326,796,832", recruiting_status: "Yes" },
  { _static: true, tag: "ICE", name: "❄️SNOW❄️", power: "315,778,163", recruiting_status: "Limited" },
  { _static: true, tag: "FZN", name: "FrozenKnights", power: "285,799,349", recruiting_status: "Yes" },
  { _static: true, tag: "ViP", name: "VIPacademy", power: "250,967,692", recruiting_status: "Yes" },
  { _static: true, tag: "DEU", name: "DieKämpfer", power: "232,048,834", recruiting_status: "Yes" },
  { _static: true, tag: "BAD", name: "BANDITS", power: "214,688,181", recruiting_status: "Yes" },
  { _static: true, tag: "SNL", name: "SNL", power: "195,418,299", recruiting_status: "Yes" },
  { _static: true, tag: "MMg", name: "我們一起", power: "189,282,487", recruiting_status: "Yes" },
  { _static: true, tag: "TVE", name: "TVE", power: "157,767,050", recruiting_status: "Yes" },
  { _static: true, tag: "HiH", name: "hornteam", power: "147,649,123", recruiting_status: "Yes" },
  { _static: true, tag: "BUK", name: "BalkanUnion", power: "140,686,409", recruiting_status: "Yes" },
  { _static: true, tag: "FoC", name: "OddBallsOut", power: "138,712,265", recruiting_status: "Yes" },
  { _static: true, tag: "WiC", name: "WinterisComing", power: "129,856,199", recruiting_status: "Yes" },
  { _static: true, tag: "UIA", name: "UltimateAlly", power: "120,214,986", recruiting_status: "Yes" },
  { _static: true, tag: "SLV", name: "Selevkia", power: "112,465,499", recruiting_status: "Yes" },
  { _static: true, tag: "ONE", name: "EMPIRE", power: "106,297,737", recruiting_status: "Yes" },
  { _static: true, tag: "cGm", name: "ChaoticAngels", power: "101,175,164", recruiting_status: "Yes" },
];

function PodiumEmblem({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M20 30v-9c0-4 6-4 6 0v8h2V17c0-4 7-4 7 0v12h2V20c0-4 7-4 7 0v12h2v-7c0-4 7-4 7 0v13c0 8-6 14-15 16v6H25v-7c-7-3-12-9-12-17v-6c0-5 7-5 7 0Z" />
        <circle cx="37" cy="31" r="7" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M37 26v10M32 31h10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  if (rank === 2) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 12c7 7 16 9 16 21 0 11-8 19-16 19s-16-8-16-19c0-12 9-14 16-21Z" />
        <path d="M20 18c-5 8-4 18 4 25M44 18c5 8 4 18-4 25" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 35c8-9 15-13 22-14-2 8-6 15-14 20l9 8c-8 0-15-3-20-9-5 6-12 9-20 9l9-8C10 36 6 29 4 21c7 1 14 5 22 14l6-23 6 23Z" />
    </svg>
  );
}

function PodiumMedal({ rank }: { rank: number }) {
  return (
    <div className={`game-medal game-medal-${rank}`}>
      <svg viewBox="0 0 68 82" aria-hidden="true">
        <path className="medal-ribbon" d="M20 52h28v27L34 70 20 79V52Z" />
        <path className="medal-body" d="M34 5 60 20v30L34 65 8 50V20L34 5Z" />
        <path className="medal-glint" d="M25 16h18l8 6-33 22V23l7-7Z" />
      </svg>
      <span>{rank}</span>
    </div>
  );
}

function GameBanner({ rank }: { rank: number }) {
  return (
    <div className={`game-rank-banner game-rank-${rank}`}>
      <div className="banner-handshake" aria-hidden="true">
        <svg viewBox="0 0 36 26">
          <path d="M3 12 11 4h8l3 3h5l6 6-5 7h-8l-4-4-5 4H6l-3-8Z" />
          <path d="M13 7 21 15M9 12l8 8M20 7l9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="banner-cloth">
        <PodiumEmblem rank={rank} />
      </div>
      <PodiumMedal rank={rank} />
    </div>
  );
}

function TopAlliancePodium({ alliances }: { alliances: R[] }) {
  const top = alliances.slice(0, 3);
  const slots = [
    { rank: 2, alliance: top[1], className: "podium-left" },
    { rank: 1, alliance: top[0], className: "podium-center" },
    { rank: 3, alliance: top[2], className: "podium-right" },
  ].filter((slot) => slot.alliance);

  return (
    <div className="game-podium" aria-label="Alliance Power top ranking podium">
      <div className="podium-blizzard" />
      <div className="podium-aurora" aria-hidden="true" />
      <div className="podium-ice-rim" aria-hidden="true" />
      <div className="podium-header">
        <p>Alliance Power</p>
        <span>Top 3 state rankings</span>
      </div>
      <div className="podium-columns" aria-hidden="true">
        <span className="podium-column podium-column-blue" />
        <span className="podium-column podium-column-gold" />
        <span className="podium-column podium-column-bronze" />
      </div>
      <div className="podium-spotlight podium-spotlight-left" aria-hidden="true" />
      <div className="podium-spotlight podium-spotlight-center" aria-hidden="true" />
      <div className="podium-spotlight podium-spotlight-right" aria-hidden="true" />
      <div className="podium-flame podium-flame-1" aria-hidden="true" />
      <div className="podium-flame podium-flame-2" aria-hidden="true" />
      <div className="podium-flame podium-flame-3" aria-hidden="true" />
      <div className="podium-stage">
        {slots.map(({ rank, alliance, className }) => (
          <article className={`game-podium-slot ${className}`} key={`${rank}-${alliance.tag}-${alliance.name}`}>
            {rank === 1 && <div className="podium-champion-burst" aria-hidden="true" />}
            <GameBanner rank={rank} />
            <div className={`podium-name-card podium-name-${rank}`}>
              <span className="podium-rank-pill">#{rank}</span>
              <p>[{alliance.tag}]{alliance.name}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function GeneratedAlliancePowerBanner({ alliances }: { alliances: R[] }) {
  const top = alliances.slice(0, 3);
  const slots = [
    { rank: 2, alliance: top[1], className: "rank-overlay-left" },
    { rank: 1, alliance: top[0], className: "rank-overlay-center" },
    { rank: 3, alliance: top[2], className: "rank-overlay-right" },
  ].filter((slot) => slot.alliance);

  return (
    <section className="generated-alliance-banner" aria-label="Alliance Power top 3 banner">
      <img src="/wiki/alliance-power-generated.png" alt="Alliance Power top 3: [VIP]LEGENDS, [GOP]GoldenPact, [FOC]FOCUS" />
      <div className="generated-floating-banners" aria-hidden="true">
        <img className="float-banner-image float-banner-left" src="/wiki/alliance-flag-2.png" alt="" />
        <img className="float-banner-image float-banner-center" src="/wiki/alliance-flag-1.png" alt="" />
        <img className="float-banner-image float-banner-right" src="/wiki/alliance-flag-3.png" alt="" />
      </div>
      <div className="generated-rank-overlays" aria-label="Editable top ranked alliances">
        {slots.map(({ rank, alliance, className }) => (
          <div className={`generated-rank-name ${className}`} key={`${rank}-${alliance.tag}-${alliance.name}`}>
            <span>#{rank}</span>
            <b>[{alliance.tag}]{alliance.name}</b>
          </div>
        ))}
      </div>
      <svg className="banner-blaze banner-blaze-left" viewBox="0 0 220 260" aria-hidden="true">
        <path d="M112 245C56 226 27 187 38 138c8-36 37-58 39-104 30 29 48 56 44 94 21-25 26-53 17-91 45 37 67 80 55 128-11 44-42 68-81 80Z" />
      </svg>
      <svg className="banner-blaze banner-blaze-center" viewBox="0 0 260 320" aria-hidden="true">
        <path d="M132 305C65 282 31 235 45 173c10-45 45-75 48-132 37 36 60 70 55 118 27-32 33-66 21-115 55 46 82 100 68 160-14 56-53 87-105 101Z" />
      </svg>
      <svg className="banner-blaze banner-blaze-right" viewBox="0 0 220 260" aria-hidden="true">
        <path d="M112 245C56 226 27 187 38 138c8-36 37-58 39-104 30 29 48 56 44 94 21-25 26-53 17-91 45 37 67 80 55 128-11 44-42 68-81 80Z" />
      </svg>
      <div className="generated-banner-shine" aria-hidden="true" />
    </section>
  );
}

export function AlliancesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const { roles } = useAuth();
  const editable = hasAny(roles, ["owner", "r5_moderator", "r4_moderator", "governor"]);
  const qc = useQueryClient();
  const { data: dbAlliances, isLoading } = useQuery({ queryKey: ["alliances"], queryFn: async () => (await supabase.from("alliances" as any).select("*").order("name")).data as R[] || [] });

  /* ─── Inline edit state ─── */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTag, setEditTag] = useState("");

  const startEdit = (a: R) => { setEditingId(a.id); setEditName(a.name || ""); setEditTag(a.tag || ""); };
  const cancelEdit = () => { setEditingId(null); setEditName(""); setEditTag(""); };
  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("alliances" as any).update({ name: editName, tag: editTag } as any).eq("id", editingId);
    error ? toast.error(error.message) : toast.success("Alliance updated.");
    cancelEdit();
    qc.invalidateQueries({ queryKey: ["alliances"] });
  };
  const removeAlliance = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from the directory?`)) return;
    const { error } = await supabase.from("alliances" as any).delete().eq("id", id);
    error ? toast.error(error.message) : toast.success(`${name} removed.`);
    qc.invalidateQueries({ queryKey: ["alliances"] });
  };

  /* ─── Merge: DB alliances override static ones by tag match ─── */
  const merged = useMemo(() => {
    const db = dbAlliances || [];
    const dbTags = new Set(db.map(a => (a.tag || "").toLowerCase()));
    const fromStatic = STATE_ALLIANCES.filter(s => !dbTags.has(s.tag.toLowerCase())).map((s, i) => ({ ...s, id: `static-${i}` }));
    return [...db, ...fromStatic];
  }, [dbAlliances]);

  /* ─── Sort by power descending, filter ─── */
  const sorted = useMemo(() => {
    const list = merged.filter(a =>
      `${a.name} ${a.tag} ${a.description || ""}`.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || a.recruiting_status === filter)
    );
    return list.sort((a, b) => {
      const pa = parseInt(String(a.power || "0").replace(/\D/g, ""), 10) || 0;
      const pb = parseInt(String(b.power || "0").replace(/\D/g, ""), 10) || 0;
      return pb - pa;
    });
  }, [merged, search, filter]);

  /* ─── Alliance banner icon colors ─── */
  const bannerColors = [
    "hsl(0 70% 55%)", "hsl(210 80% 55%)", "hsl(280 65% 55%)",
    "hsl(150 60% 45%)", "hsl(35 90% 55%)", "hsl(190 80% 50%)",
  ];

  return <>
    <PageHeader eyebrow="Alliance Power" title="Alliance Directory">
      <p>State 4285 alliance rankings, event schedules, and recruitment info. Names can be edited and alliances removed by leadership.</p>
    </PageHeader>

    <section className="container pb-14">
      <GeneratedAlliancePowerBanner alliances={sorted} />

      {/* ─── Search & Filter ─── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input className="field w-full pl-9" placeholder="Search alliance name or tag…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="field" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option><option>Yes</option><option>Limited</option><option>No</option>
        </select>
      </div>

      {isLoading ? <SkeletonGrid /> : <>
        {/* ─── Alliance Cards Grid ─── */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((a, i) => {
            const rank = i + 1;
            const isStatic = !!a._static;
            const isEditing = editingId === a.id;
            const bannerColor = bannerColors[i % bannerColors.length];
            const isTop3 = rank <= 3;
            const medalEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

            return (
              <FrostCard key={a.id} className={isTop3 ? "ring-1 ring-accent/30" : ""}>
                {/* ─── Header: Rank + Banner + Name + Status ─── */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="alliance-rank-badge shrink-0" style={isTop3 ? { background: rank === 1 ? "hsl(38 100% 48% / 0.3)" : rank === 2 ? "hsl(220 15% 65% / 0.3)" : "hsl(25 60% 45% / 0.3)", borderColor: rank === 1 ? "hsl(38 100% 55%)" : rank === 2 ? "hsl(220 15% 72%)" : "hsl(25 60% 50%)" } : {}}>
                      {medalEmoji || rank}
                    </div>
                    <div className="alliance-row-banner shrink-0" style={{ background: bannerColor }}>
                      {isTop3 ? <Crown className="w-5 h-5 text-white" /> : <Shield className="w-5 h-5 text-white/90" />}
                    </div>
                    <div className="min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input className="field w-14 text-xs px-2 py-1" value={editTag} onChange={e => setEditTag(e.target.value)} placeholder="Tag" />
                          <input className="field w-28 text-xs px-2 py-1" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" />
                        </div>
                      ) : (
                        <>
                          <h2 className="font-command text-xl font-bold truncate">{a.name}</h2>
                          <p className="text-primary text-sm">[{a.tag}] · {a.power || "—"}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={a.recruiting_status} />
                </div>

                {/* ─── Edit actions ─── */}
                {isEditing && (
                  <div className="mt-3 flex gap-2">
                    <button className="frost-button text-xs px-3 py-1.5" onClick={saveEdit}>Save</button>
                    <button className="ghost-button text-xs px-3 py-1.5" onClick={cancelEdit}>Cancel</button>
                  </div>
                )}

                {/* ─── Description ─── */}
                {a.description && <p className="mt-3 text-muted-foreground text-sm">{a.description}</p>}

                {/* ─── Alliance Event Times ─── */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="alliance-event-cell">
                    <span className="text-muted-foreground">🐻 Bear Trap</span>
                    <b className="text-primary">{a.bear_trap_time || "TBD"}</b>
                  </div>
                  <div className="alliance-event-cell">
                    <span className="text-muted-foreground">🏗️ Foundry</span>
                    <b className="text-primary">{a.foundry_time || "TBD"}</b>
                  </div>
                  <div className="alliance-event-cell">
                    <span className="text-muted-foreground">🤪 Crazy Joe</span>
                    <b className="text-primary">{a.crazy_joe_time || "TBD"}</b>
                  </div>
                  <div className="alliance-event-cell">
                    <span className="text-muted-foreground">⚔️ Canyon Clash</span>
                    <b className="text-primary">{a.canyon_clash_time || "TBD"}</b>
                  </div>
                  <div className="alliance-event-cell col-span-2">
                    <span className="text-muted-foreground">🏆 Championship</span>
                    <b className="text-primary">{a.alliance_championship_time || "TBD"}</b>
                  </div>
                </div>

                {/* ─── Info ─── */}
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm border-t border-border/40 pt-3">
                  <dt className="text-muted-foreground">Language</dt>
                  <dd>{a.main_language || "—"}</dd>
                  <dt className="text-muted-foreground">Requirements</dt>
                  <dd>{a.requirements || "—"}</dd>
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd className="text-primary">{a.contact || "—"}</dd>
                </dl>

                {/* ─── Footer: Edit / Delete ─── */}
                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                  <span className="text-xs text-muted-foreground">
                    {isStatic ? "From game data" : `Updated ${a.updated_at ? new Date(a.updated_at).toLocaleDateString() : "—"}`}
                  </span>
                  {editable && !isEditing && !isStatic && (
                    <div className="flex gap-2">
                      <button className="ghost-button text-xs px-3 py-1" onClick={() => startEdit(a)}>✏️ Edit</button>
                      <button className="ghost-button text-xs px-3 py-1 hover:!border-destructive/50 hover:!text-destructive" onClick={() => removeAlliance(a.id, a.name)}>✕ Remove</button>
                    </div>
                  )}
                </div>
              </FrostCard>
            );
          })}
        </div>

        {sorted.length === 0 && <EmptyState title="No alliances found" text="Try a different search or filter." />}
      </>}
    </section>
  </>;
}

export function SvsPage() { const { roles } = useAuth(); const allowed = hasAny(roles, ["owner","governor","event_manager"]); const { data } = useQuery({ queryKey: ["svs-notes"], queryFn: async () => (await supabase.from("svs_notes" as any).select("*")).data as R[] || [], enabled: allowed }); const checklist = ["Save speedups before prep phase.","Use construction, research, training, and hero upgrades on correct prep days.","Shield if offline during battle.","Follow rally leader instructions.","Do not waste troops without a plan.","Coordinate healing and reinforcements.","Watch state chat and Discord."]; return <><PageHeader eyebrow="Strategic war room" title="SvS War Room"><p>Public coordination checklist for prep and battle discipline.</p></PageHeader><section className="container grid gap-6 pb-14 lg:grid-cols-2"><FrostCard><h2 className="font-command text-2xl font-bold">SvS Prep Checklist</h2><ul className="mt-4 space-y-3">{checklist.map(x=><li key={x} className="flex gap-3 text-muted-foreground"><Swords className="h-5 w-5 shrink-0 text-primary"/>{x}</li>)}</ul></FrostCard><FrostCard className="border-destructive/40"><h2 className="flex items-center gap-2 font-command text-2xl font-bold"><ShieldAlert className="text-destructive"/>Do-Not-Share Warning</h2><p className="mt-4 text-muted-foreground">Sensitive SvS strategy should not be public. This page is a general checklist. Private tactics should stay in Discord or leadership chat.</p>{allowed && <div className="mt-6 space-y-3">{data?.map(n=><div key={n.id} className="rounded-md border border-border bg-secondary/40 p-3"><b>{n.title}</b><pre className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{n.content}</pre></div>)}</div>}</FrostCard></section></>; }

export function GovernorPage() { const { data: board } = useQuery({ queryKey: ["governor"], queryFn: async () => (await supabase.from("governor_board" as any).select("*").limit(1).maybeSingle()).data as R }); const { data: anns } = useQuery({ queryKey: ["gov-anns"], queryFn: async () => (await supabase.from("announcements" as any).select("*").eq("status","Published").order("published_at", { ascending:false })).data as R[] || [] }); const buffs = board?.buff_schedule || {}; return <><PageHeader eyebrow="Leadership transparency" title="Governor Board"><p>Current Governor / President: {board?.current_governor || "TBD"}</p></PageHeader><section className="container grid gap-5 pb-14 lg:grid-cols-2"><FrostCard><Crown className="mb-3 text-accent"/><h2 className="font-command text-2xl font-bold">Minister Rotation</h2><p className="mt-3 text-muted-foreground">{board?.minister_rotation}</p><h2 className="mt-6 font-command text-2xl font-bold">Castle Rotation</h2><p className="mt-3 text-muted-foreground">{board?.castle_rotation}</p></FrostCard><FrostCard><h2 className="font-command text-2xl font-bold">Buff Schedule</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{["Training buff","Construction buff","Research buff","Healing buff"].map(k=><div className="rounded-md border border-border bg-secondary/35 p-3" key={k}><p className="text-muted-foreground">{k}</p><b>{buffs[k] || "TBD"}</b></div>)}</div></FrostCard><div className="lg:col-span-2 grid gap-4 md:grid-cols-2">{anns?.map(a=><FrostCard key={a.id}><StatusBadge status={a.category}/><h3 className="mt-3 font-command text-xl font-bold">{a.title}</h3><p className="mt-2 text-muted-foreground">{a.message}</p><p className="mt-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()} · Published by command</p></FrostCard>)}</div></section></>; }

export function GuidesPage() { const { data, isLoading } = useQuery({ queryKey: ["guides"], queryFn: async () => (await supabase.from("guides" as any).select("*").order("title")).data as R[] || [] }); return <><PageHeader eyebrow="Field manuals" title="Guides"><p>Short, direct, practical playbooks for every player type.</p></PageHeader><section className="container grid gap-5 pb-14 md:grid-cols-2 xl:grid-cols-3">{isLoading ? <SkeletonGrid/> : data?.map(g=><FrostCard key={g.id}><FileText className="mb-3 text-primary"/><StatusBadge status={g.category}/><h2 className="mt-3 font-command text-xl font-bold">{g.title}</h2><p className="mt-3 text-muted-foreground">{g.content}</p></FrostCard>)}</section></>; }

export function ReportPage() { const [form, setForm] = useState<R>({}); const mutation = useMutation({ mutationFn: async () => { const { error } = await supabase.from("reports" as any).insert(form as any); if (error) throw error; }, onSuccess: () => { toast.success("Report submitted."); setForm({}); }, onError: (e:any)=>toast.error(e.message) }); const fields=["reporter_name","reported_player","alliance","issue_type","description","screenshot_url"]; return <><PageHeader eyebrow="Evidence channel" title="Report a Problem"><p>Include clear screenshots and exact details so leadership can act quickly.</p></PageHeader><section className="container max-w-3xl pb-14"><FrostCard><form onSubmit={(e:FormEvent)=>{e.preventDefault(); mutation.mutate();}} className="grid gap-3">{fields.map(f=> f==="description" ? <textarea required className="field min-h-32" key={f} placeholder="Description" value={form[f]||""} onChange={e=>setForm({...form,[f]:e.target.value})}/> : <input required={f==='reporter_name'} className="field" key={f} placeholder={f.replace(/_/g," ")} value={form[f]||""} onChange={e=>setForm({...form,[f]:e.target.value})}/>)}<button className="gold-button">Submit Report</button></form></FrostCard></section></>; }
