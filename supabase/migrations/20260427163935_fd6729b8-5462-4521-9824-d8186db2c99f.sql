create schema if not exists frost_private;

create or replace function frost_private.has_role(_user_id uuid, _role public.app_role)
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

create or replace function frost_private.has_any_role(_user_id uuid, _roles public.app_role[])
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

create or replace function frost_private.can_edit_alliance(_user_id uuid, _alliance_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select frost_private.has_role(_user_id, 'owner')
    or exists (
      select 1 from public.alliance_moderators
      where user_id = _user_id
        and alliance_id = _alliance_id
        and role in ('r5_moderator','r4_moderator')
    )
$$;

alter policy "Profiles can be viewed by self and owners" on public.profiles using (id = auth.uid() or frost_private.has_role(auth.uid(), 'owner'));
alter policy "Owners can update profiles" on public.profiles using (frost_private.has_role(auth.uid(), 'owner')) with check (frost_private.has_role(auth.uid(), 'owner'));
create policy "Users can create own profile" on public.profiles for insert to authenticated with check (id = auth.uid());

alter policy "Users can view own roles" on public.user_roles using (user_id = auth.uid() or frost_private.has_role(auth.uid(), 'owner'));
alter policy "Owners manage roles" on public.user_roles using (frost_private.has_role(auth.uid(), 'owner')) with check (frost_private.has_role(auth.uid(), 'owner'));
create policy "Users can claim viewer role" on public.user_roles for insert to authenticated with check (user_id = auth.uid() and role = 'viewer');

alter policy "Owners can manage alliances" on public.alliances using (frost_private.has_role(auth.uid(), 'owner')) with check (frost_private.has_role(auth.uid(), 'owner'));
alter policy "Assigned moderators update alliances" on public.alliances using (frost_private.can_edit_alliance(auth.uid(), id)) with check (frost_private.can_edit_alliance(auth.uid(), id));

alter policy "Owners view alliance assignments" on public.alliance_moderators using (frost_private.has_role(auth.uid(), 'owner') or user_id = auth.uid());
alter policy "Owners manage alliance assignments" on public.alliance_moderators using (frost_private.has_role(auth.uid(), 'owner')) with check (frost_private.has_role(auth.uid(), 'owner'));

alter policy "Event leaders manage events" on public.events using (frost_private.has_any_role(auth.uid(), array['owner','event_manager']::public.app_role[])) with check (frost_private.has_any_role(auth.uid(), array['owner','event_manager']::public.app_role[]));
alter policy "Governors update event notes" on public.events using (frost_private.has_role(auth.uid(), 'governor')) with check (frost_private.has_role(auth.uid(), 'governor'));

alter policy "Owners and governors manage rules" on public.rules_sections using (frost_private.has_any_role(auth.uid(), array['owner','governor']::public.app_role[])) with check (frost_private.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));

alter policy "Transfer leaders manage settings" on public.transfer_settings using (frost_private.has_any_role(auth.uid(), array['owner','recruiter']::public.app_role[])) with check (frost_private.has_any_role(auth.uid(), array['owner','recruiter']::public.app_role[]));
alter policy "Governors update transfer settings" on public.transfer_settings using (frost_private.has_role(auth.uid(), 'governor')) with check (frost_private.has_role(auth.uid(), 'governor'));
alter policy "Anyone can submit transfer applications" on public.transfer_applications with check (length(trim(in_game_name)) > 0);
alter policy "Transfer leaders view applications" on public.transfer_applications using (frost_private.has_any_role(auth.uid(), array['owner','governor','recruiter']::public.app_role[]));
alter policy "Recruiters update applications" on public.transfer_applications using (frost_private.has_any_role(auth.uid(), array['owner','recruiter']::public.app_role[])) with check (frost_private.has_any_role(auth.uid(), array['owner','recruiter']::public.app_role[]));
alter policy "Owners delete applications" on public.transfer_applications using (frost_private.has_role(auth.uid(), 'owner'));

alter policy "Owners and governors manage governor board" on public.governor_board using (frost_private.has_any_role(auth.uid(), array['owner','governor']::public.app_role[])) with check (frost_private.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));

alter policy "Private roles can read announcements" on public.announcements using (frost_private.has_any_role(auth.uid(), array['owner','governor','event_manager','recruiter','r5_moderator','r4_moderator']::public.app_role[]));
alter policy "Moderators create announcement drafts" on public.announcements with check (frost_private.has_any_role(auth.uid(), array['owner','governor','event_manager','r5_moderator','r4_moderator']::public.app_role[]));
alter policy "Leadership publishes announcements" on public.announcements using (frost_private.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[])) with check (frost_private.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[]));
alter policy "Owners delete announcements" on public.announcements using (frost_private.has_role(auth.uid(), 'owner'));

alter policy "Owners and governors manage guides" on public.guides using (frost_private.has_any_role(auth.uid(), array['owner','governor']::public.app_role[])) with check (frost_private.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));
alter policy "Event managers update guides" on public.guides using (frost_private.has_role(auth.uid(), 'event_manager')) with check (frost_private.has_role(auth.uid(), 'event_manager'));

alter policy "Svs leaders view private notes" on public.svs_notes using (visibility = 'Public' or frost_private.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[]));
alter policy "Svs leaders manage notes" on public.svs_notes using (frost_private.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[])) with check (frost_private.has_any_role(auth.uid(), array['owner','governor','event_manager']::public.app_role[]));

alter policy "Owners view audit logs" on public.audit_logs using (frost_private.has_role(auth.uid(), 'owner'));
alter policy "Authenticated users create audit logs" on public.audit_logs with check (user_id = auth.uid() or frost_private.has_role(auth.uid(), 'owner'));

alter policy "Anyone can create reports" on public.reports with check (length(trim(reporter_name)) > 0 and length(trim(description)) > 0);
alter policy "Leadership can view reports" on public.reports using (frost_private.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));
alter policy "Leadership can update reports" on public.reports using (frost_private.has_any_role(auth.uid(), array['owner','governor']::public.app_role[])) with check (frost_private.has_any_role(auth.uid(), array['owner','governor']::public.app_role[]));

drop function if exists public.ensure_user_profile(text, text);
drop function if exists public.has_role(uuid, public.app_role);
drop function if exists public.has_any_role(uuid, public.app_role[]);
drop function if exists public.can_edit_alliance(uuid, uuid);

revoke all on schema frost_private from public;
revoke all on schema frost_private from anon;
revoke all on schema frost_private from authenticated;