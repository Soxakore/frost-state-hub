create type public.app_role as enum ('owner','governor','r5_moderator','r4_moderator','event_manager','recruiter','viewer');
create type public.content_status as enum ('Active','Open','Limited','Closed','Protected','War Phase','Pending','Published','Draft','Weekly','TBD','Cancelled','New','Reviewing','Accepted','Rejected','Need More Info','Yes','No','Available');
create type public.announcement_category as enum ('State','Event','Transfer','SvS','Alliance');
create type public.announcement_visibility as enum ('Public','Private');

create table public.profiles (
  id uuid primary key,
  email text,
  display_name text,
  in_game_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  last_login timestamptz,
  disabled boolean not null default false
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now(),
  created_by uuid,
  unique (user_id, role)
);

create table public.alliances (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tag text not null,
  power text,
  main_language text,
  bear_trap_time text,
  foundry_time text,
  crazy_joe_time text,
  recruiting_status text not null default 'Yes',
  requirements text,
  contact text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.alliance_moderators (
  id uuid primary key default gen_random_uuid(),
  alliance_id uuid not null references public.alliances(id) on delete cascade,
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  unique (alliance_id, user_id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  utc_time text not null default 'TBD',
  local_note text,
  status text not null default 'TBD',
  description text,
  instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.rules_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.transfer_settings (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'Open',
  power_cap text,
  special_invites text not null default 'Available',
  looking_for text,
  requirements text,
  contact_info text,
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.transfer_applications (
  id uuid primary key default gen_random_uuid(),
  in_game_name text not null,
  current_state text,
  current_alliance text,
  power text,
  furnace_level text,
  time_zone text,
  preferred_alliance text,
  solo_or_group text,
  events_available text,
  message text,
  status text not null default 'New',
  private_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.governor_board (
  id uuid primary key default gen_random_uuid(),
  current_governor text,
  minister_rotation text,
  buff_schedule jsonb not null default '{}'::jsonb,
  castle_rotation text,
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  category public.announcement_category not null default 'State',
  visibility public.announcement_visibility not null default 'Public',
  status text not null default 'Draft',
  created_by uuid,
  approved_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.guides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.svs_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  visibility public.announcement_visibility not null default 'Private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  role text,
  action text not null,
  table_name text not null,
  record_id uuid,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_name text not null,
  reported_player text,
  alliance text,
  issue_type text,
  description text not null,
  screenshot_url text,
  status text not null default 'New',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create or replace function public.has_any_role(_user_id uuid, _roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = any(_roles)
  )
$$;

create or replace function public.can_edit_alliance(_user_id uuid, _alliance_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(_user_id, 'owner')
    or exists (
      select 1 from public.alliance_moderators
      where user_id = _user_id
        and alliance_id = _alliance_id
        and role in ('r5_moderator','r4_moderator')
    )
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.ensure_user_profile(_email text default null, _display_name text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.profiles (id, email, display_name, last_login)
  values (auth.uid(), _email, _display_name, now())
  on conflict (id) do update set
    email = coalesce(excluded.email, profiles.email),
    display_name = coalesce(excluded.display_name, profiles.display_name),
    last_login = now();

  insert into public.user_roles (user_id, role)
  values (auth.uid(), 'viewer')
  on conflict (user_id, role) do nothing;
end;
$$;

create trigger touch_alliances_updated_at before update on public.alliances for each row execute function public.touch_updated_at();
create trigger touch_events_updated_at before update on public.events for each row execute function public.touch_updated_at();
create trigger touch_rules_sections_updated_at before update on public.rules_sections for each row execute function public.touch_updated_at();
create trigger touch_transfer_settings_updated_at before update on public.transfer_settings for each row execute function public.touch_updated_at();
create trigger touch_transfer_applications_updated_at before update on public.transfer_applications for each row execute function public.touch_updated_at();
create trigger touch_governor_board_updated_at before update on public.governor_board for each row execute function public.touch_updated_at();
create trigger touch_announcements_updated_at before update on public.announcements for each row execute function public.touch_updated_at();
create trigger touch_guides_updated_at before update on public.guides for each row execute function public.touch_updated_at();
create trigger touch_svs_notes_updated_at before update on public.svs_notes for each row execute function public.touch_updated_at();
create trigger touch_reports_updated_at before update on public.reports for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.alliances enable row level security;
alter table public.alliance_moderators enable row level security;
alter table public.events enable row level security;
alter table public.rules_sections enable row level security;
alter table public.transfer_settings enable row level security;
alter table public.transfer_applications enable row level security;
alter table public.governor_board enable row level security;
alter table public.announcements enable row level security;
alter table public.guides enable row level security;
alter table public.svs_notes enable row level security;
alter table public.audit_logs enable row level security;
alter table public.reports enable row level security;

create policy "Profiles can be viewed by self and owners" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(), 'owner'));
create policy "Users can update own profile" on public.profiles for update to authenticated using (id = auth.uid() and disabled = false) with check (id = auth.uid());
create policy "Owners can update profiles" on public.profiles for update to authenticated using (public.has_role(auth.uid(), 'owner')) with check (public.has_role(auth.uid(), 'owner'));

create policy "Users can view own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'owner'));
create policy "Owners manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'owner')) with check (public.has_role(auth.uid(), 'owner'));

create policy "Public can read alliances" on public.alliances for select using (true);
create policy "Owners can manage alliances" on public.alliances for all to authenticated using (public.has_role(auth.uid(), 'owner')) with check (public.has_role(auth.uid(), 'owner'));
create policy "Assigned moderators update alliances" on public.alliances for update to authenticated using (public.can_edit_alliance(auth.uid(), id)) with check (public.can_edit_alliance(auth.uid(), id));

create policy "Owners view alliance assignments" on public.alliance_moderators for select to authenticated using (public.has_role(auth.uid(), 'owner') or user_id = auth.uid());
create policy "Owners manage alliance assignments" on public.alliance_moderators for all to authenticated using (public.has_role(auth.uid(), 'owner')) with check (public.has_role(auth.uid(), 'owner'));

create policy "Public can read events" on public.events for select using (true);
create policy "Event leaders manage events" on public.events for all to authenticated using (public.has_any_role(auth.uid(), array['owner','event_manager']::public.app_role[])) with check (public.has_any_role(auth.uid(), array['owner','event_manager']::public.app_role[]));
create policy "Governors update event notes" on public.events for update to authenticated using (public.has_role(auth.uid(), 'governor')) with check (public.has_role(auth.uid(), 'governor'));

create policy "Public can read rules" on public.rules_sections for select using (true);
create policy "Owners and governors manage rules" on public.rules_sections for all to authenticated using (public.has_any_role(auth.uid(), array['owner','governor']::public.app_role[])) with check (public.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));

create policy "Public can read transfer settings" on public.transfer_settings for select using (true);
create policy "Transfer leaders manage settings" on public.transfer_settings for all to authenticated using (public.has_any_role(auth.uid(), array['owner','recruiter']::public.app_role[])) with check (public.has_any_role(auth.uid(), array['owner','recruiter']::public.app_role[]));
create policy "Governors update transfer settings" on public.transfer_settings for update to authenticated using (public.has_role(auth.uid(), 'governor')) with check (public.has_role(auth.uid(), 'governor'));

create policy "Anyone can submit transfer applications" on public.transfer_applications for insert with check (true);
create policy "Transfer leaders view applications" on public.transfer_applications for select to authenticated using (public.has_any_role(auth.uid(), array['owner','governor','recruiter']::public.app_role[]));
create policy "Recruiters update applications" on public.transfer_applications for update to authenticated using (public.has_any_role(auth.uid(), array['owner','recruiter']::public.app_role[])) with check (public.has_any_role(auth.uid(), array['owner','recruiter']::public.app_role[]));
create policy "Owners delete applications" on public.transfer_applications for delete to authenticated using (public.has_role(auth.uid(), 'owner'));

create policy "Public can read governor board" on public.governor_board for select using (true);
create policy "Owners and governors manage governor board" on public.governor_board for all to authenticated using (public.has_any_role(auth.uid(), array['owner','governor']::public.app_role[])) with check (public.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));

create policy "Public can read published public announcements" on public.announcements for select using (visibility = 'Public' and status = 'Published');
create policy "Private roles can read announcements" on public.announcements for select to authenticated using (public.has_any_role(auth.uid(), array['owner','governor','event_manager','recruiter','r5_moderator','r4_moderator']::public.app_role[]));
create policy "Moderators create announcement drafts" on public.announcements for insert to authenticated with check (public.has_any_role(auth.uid(), array['owner','governor','event_manager','r5_moderator','r4_moderator']::public.app_role[]));
create policy "Leadership publishes announcements" on public.announcements for update to authenticated using (public.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[])) with check (public.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[]));
create policy "Owners delete announcements" on public.announcements for delete to authenticated using (public.has_role(auth.uid(), 'owner'));

create policy "Public can read guides" on public.guides for select using (true);
create policy "Owners and governors manage guides" on public.guides for all to authenticated using (public.has_any_role(auth.uid(), array['owner','governor']::public.app_role[])) with check (public.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));
create policy "Event managers update guides" on public.guides for update to authenticated using (public.has_role(auth.uid(), 'event_manager')) with check (public.has_role(auth.uid(), 'event_manager'));

create policy "Public can read public svs notes" on public.svs_notes for select using (visibility = 'Public');
create policy "Svs leaders view private notes" on public.svs_notes for select to authenticated using (visibility = 'Public' or public.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[]));
create policy "Svs leaders manage notes" on public.svs_notes for all to authenticated using (public.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[])) with check (public.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[]));

create policy "Owners view audit logs" on public.audit_logs for select to authenticated using (public.has_role(auth.uid(), 'owner'));
create policy "Authenticated users create audit logs" on public.audit_logs for insert to authenticated with check (user_id = auth.uid() or public.has_role(auth.uid(), 'owner'));

create policy "Anyone can create reports" on public.reports for insert with check (true);
create policy "Leadership can view reports" on public.reports for select to authenticated using (public.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));
create policy "Leadership can update reports" on public.reports for update to authenticated using (public.has_any_role(auth.uid(), array['owner','governor']::public.app_role[])) with check (public.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));

insert into public.events (name, utc_time, status, description, instructions) values
('Bear Trap 1','22:00 UTC','Weekly','Alliance damage event','Join rallies on time and follow alliance markers.'),
('Bear Trap 2','13:00 UTC','Weekly','Alternate Bear Trap window','Confirm with your alliance before spending stamina.'),
('Foundry Battle','02:00 UTC','Weekly','Cross-alliance battlefield event','Register early and follow shot-caller lane assignments.'),
('Crazy Joe','23:00 UTC','Weekly','Alliance defense event','Reinforce correctly and do not overfill weak accounts.'),
('Fortress Battle','TBD','TBD','State rotation objective','Follow posted rotation and avoid stealing turns.'),
('Stronghold Battle','TBD','TBD','State rotation objective','Respect assigned alliance windows.'),
('Sunfire Castle','TBD','TBD','Governor rotation battle','Watch state leadership announcements.'),
('SvS Prep','TBD','TBD','State-vs-State preparation phase','Use upgrades on the correct prep day.'),
('SvS Battle','TBD','War Phase','State-vs-State battle phase','Shield if offline and follow rally leaders.');

insert into public.alliances (name, tag, power, main_language, bear_trap_time, foundry_time, crazy_joe_time, recruiting_status, requirements, contact, description) values
('FRA','FRA','Editable placeholder','International','22:00 UTC and 13:00 UTC','02:00 UTC','23:00 UTC','Yes','Active, respectful players who join events.','Contact R5/R4 in game','One of the hottest alliances in the state. Active, social, and focused on growth, events, and teamwork.'),
('ICE','ICE','Editable placeholder','English','TBD','TBD','TBD','Limited','Event-focused players.','Placeholder','Placeholder alliance card ready for recruitment details.'),
('WLF','WLF','Editable placeholder','Mixed','TBD','TBD','TBD','Yes','Growth-minded players.','Placeholder','Placeholder alliance card ready for leadership updates.');

insert into public.rules_sections (title, category, content) values
('NAP Rules','NAP','Do not attack NAP alliance cities.\nDo not attack alliance hives.\nNo tile hitting unless state leadership announces KE/SvS rules.\nFortress and strongholds follow state rotation.\nDisputes must be reported with screenshots.\nRepeated rule breaking may lead to punishment or removal from NAP protection.'),
('Fair Play Rules','Fair Play','Respect all players.\nNo racism, hate speech, or harassment.\nNo fake diplomacy.\nNo stealing fortress/stronghold turns.\nNo attacking during protected state events unless allowed.'),
('Fortress / Stronghold Rules','Objectives','Fortress and stronghold turns follow the posted rotation. Alliances must respect assigned windows and resolve conflicts through leadership.'),
('Castle Rules','Castle','Sunfire Castle follows state leadership rotation. Buff requests should be made clearly and early.'),
('Punishment Rules','Punishment','Rule breaks may lead to warnings, compensation requests, removal from protection, or state-wide action for repeated violations.'),
('Report Instructions','Reports','Submit screenshots, coordinates, time, attacker name, alliance, and a clear description. Reports without evidence may not be actionable.');

insert into public.transfer_settings (status, power_cap, special_invites, looking_for, requirements, contact_info) values
('Open','Editable placeholder','Available','Active players, rally joiners, event fighters, F2P, dolphins, whales, full groups','Active in events, respectful, follows state rules, willing to join Discord or state communication channel.','Discord contact placeholder');

insert into public.governor_board (current_governor, minister_rotation, buff_schedule, castle_rotation) values
('Editable Governor / President placeholder','Editable minister rotation placeholder','{"Training buff":"TBD","Construction buff":"TBD","Research buff":"TBD","Healing buff":"TBD"}'::jsonb,'Active');

insert into public.announcements (title, message, category, visibility, status, published_at) values
('State 4285 Command Online','Frost State Command is live for rules, events, transfers, alliances, SvS guidance, and leadership updates.','State','Public','Published',now()),
('UTC Time Standard','All times are shown in UTC. Always confirm in-game mail before major events.','Event','Public','Published',now());

insert into public.guides (title, category, content) values
('Bear Trap guide','Events','Save stamina, join the strongest rally leaders, use the right pets/heroes, and be online before trap starts.'),
('Crazy Joe guide','Events','Reinforce alliance members correctly, follow lane assignments, and coordinate protection for weaker accounts.'),
('Foundry guide','Events','Register early, listen to shot-callers, reinforce buildings, and prioritize objectives over solo points.'),
('Fortress guide','Objectives','Check rotation before marching. Do not steal turns. Rally leaders should coordinate timing and reinforcements.'),
('SvS guide','SvS','Save speedups, follow prep days, shield offline, and do not trade troops without a plan.'),
('Transfer guide','Transfer','Apply with accurate power, furnace level, active times, and preferred alliance so recruiters can place you quickly.'),
('Beginner growth guide','Growth','Upgrade furnace steadily, join events, save key speedups for state events, and ask before making costly mistakes.'),
('F2P spending discipline guide','Growth','Avoid impulse spending, focus on event value, save gems for strong returns, and grow consistently.');

insert into public.svs_notes (title, content, visibility) values
('Private SvS Notes','Enemy State Notes\nRally Leader Plan\nBuff Timing\nHealing Strategy\nDo-Not-Share Warning','Private');