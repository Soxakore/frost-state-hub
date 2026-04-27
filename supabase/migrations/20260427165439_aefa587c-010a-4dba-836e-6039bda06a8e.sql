alter table public.alliances
add column if not exists canyon_clash_time text,
add column if not exists alliance_championship_time text;