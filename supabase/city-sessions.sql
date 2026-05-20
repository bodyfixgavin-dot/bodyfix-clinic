-- BodyFix Clinic V1 | City Sessions schema
-- Purpose: demand registration and city session planning data for Clinic backend.
-- Run this in Supabase SQL Editor before enabling the API endpoints.

create extension if not exists pgcrypto;

create table if not exists city_settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamptz not null default now()
);

insert into city_settings (key, value, description)
values
  ('public_status', 'coming_soon', 'Controls frontend city sessions state: coming_soon, registration_open, session_open')
on conflict (key) do nothing;

alter table city_settings
  drop constraint if exists city_settings_public_status_check;

alter table city_settings
  add constraint city_settings_public_status_check
  check (
    key <> 'public_status'
    or value in ('coming_soon', 'registration_open', 'session_open')
  );

create table if not exists city_profiles (
  city text primary key,
  city_category text not null default '觀察中',
  route_group text not null default '單城',
  priority_rank int not null default 99,
  default_transport_cost int not null default 0,
  default_lodging_cost_per_night int not null default 0,
  default_workspace_cost_per_hour int not null default 0,
  default_min_daily_net_profit int not null default 10000,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into city_profiles (
  city,
  city_category,
  route_group,
  priority_rank,
  default_transport_cost,
  default_lodging_cost_per_night,
  default_workspace_cost_per_hour,
  default_min_daily_net_profit,
  notes
)
values
  ('台中', '目前基礎客源最多', '中部單城或中彰雲嘉', 1, 1600, 2200, 500, 10000, '可吸收嘉義、雲林客群。適合測試三天兩夜。'),
  ('高雄', '南部核心城市', '南部雙城', 2, 3000, 2600, 600, 10000, '適合與台南合併兩天或三天兩夜。'),
  ('台南', '可與高雄合併安排', '南部雙城', 3, 2700, 2400, 600, 10000, '若單城人數不足，優先與高雄合併。'),
  ('新竹', '工程師與高壓族群潛力', '北部延伸', 4, 700, 1800, 500, 10000, '適合測試平日晚間與週末。'),
  ('桃園', '機場與服務業族群潛力', '北部延伸', 5, 500, 1800, 500, 10000, '可測試短場或與新竹串聯。')
on conflict (city) do update set
  city_category = excluded.city_category,
  route_group = excluded.route_group,
  priority_rank = excluded.priority_rank,
  default_transport_cost = excluded.default_transport_cost,
  default_lodging_cost_per_night = excluded.default_lodging_cost_per_night,
  default_workspace_cost_per_hour = excluded.default_workspace_cost_per_hour,
  default_min_daily_net_profit = excluded.default_min_daily_net_profit,
  notes = excluded.notes,
  updated_at = now();

create table if not exists city_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  city text not null,
  city_other text,
  preferred_time_blocks text[] not null default '{}',
  service_interests text[] not null default '{}',
  grooming_interest boolean not null default false,
  high_intent boolean not null default false,
  expected_budget int,
  contact_name text,
  line_id text,
  instagram text,
  phone text,
  email text,
  main_issue text,
  notes text,
  source text not null default 'city_sessions_page',
  status text not null default 'active',
  consent_contact boolean not null default true,
  consent_case boolean not null default false,
  constraint city_waitlist_status_check check (status in ('active', 'contacted', 'converted', 'archived')),
  constraint city_waitlist_contact_hint check (
    coalesce(nullif(line_id, ''), nullif(instagram, ''), nullif(phone, ''), nullif(email, ''), nullif(contact_name, '')) is not null
  ),
  constraint city_waitlist_city_check check (char_length(city) between 1 and 40)
);

create table if not exists city_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  city text not null,
  status text not null default 'coming_soon',
  session_title text,
  planned_start_date date,
  planned_end_date date,
  decision_deadline date,
  location_type text not null default 'tbd',
  district text,
  venue_name text,
  venue_notes text,
  max_slots int not null default 0,
  booked_slots int not null default 0,
  deposit_required boolean not null default false,
  deposit_amount int,
  deposit_due_date date,
  estimated_revenue int not null default 0,
  transport_cost int not null default 0,
  lodging_cost int not null default 0,
  workspace_cost int not null default 0,
  food_misc_cost int not null default 0,
  time_cost int not null default 0,
  notes text,
  constraint city_sessions_status_check check (status in ('coming_soon', 'registration_open', 'session_open')),
  constraint city_sessions_location_type_check check (location_type in ('tbd', 'studio', 'hotel', 'hybrid')),
  constraint city_sessions_nonnegative_check check (
    max_slots >= 0 and booked_slots >= 0 and estimated_revenue >= 0 and transport_cost >= 0
    and lodging_cost >= 0 and workspace_cost >= 0 and food_misc_cost >= 0 and time_cost >= 0
  ),
  constraint city_sessions_deposit_only_when_open check (
    status = 'session_open'
    or (deposit_required = false and deposit_due_date is null)
  )
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_city_waitlist_updated_at on city_waitlist;
create trigger trg_city_waitlist_updated_at
before update on city_waitlist
for each row execute function set_updated_at();

drop trigger if exists trg_city_sessions_updated_at on city_sessions;
create trigger trg_city_sessions_updated_at
before update on city_sessions
for each row execute function set_updated_at();

drop trigger if exists trg_city_profiles_updated_at on city_profiles;
create trigger trg_city_profiles_updated_at
before update on city_profiles
for each row execute function set_updated_at();

create or replace view city_waitlist_summary as
select
  w.city,
  coalesce(p.city_category, '未分類') as city_category,
  coalesce(p.route_group, '未分類') as route_group,
  coalesce(p.priority_rank, 99) as priority_rank,
  count(*)::int as registration_count,
  count(*) filter (where w.high_intent)::int as high_intent_count,
  count(*) filter (where w.grooming_interest)::int as grooming_interest_count,
  array_remove(array_agg(distinct unnest_service.service_name), null) as main_service_demands,
  max(w.created_at) as latest_registration_at
from city_waitlist w
left join city_profiles p on p.city = w.city
left join lateral unnest(w.service_interests) as unnest_service(service_name) on true
where w.status = 'active'
group by w.city, p.city_category, p.route_group, p.priority_rank;

create or replace view city_session_profit_view as
select
  s.*,
  (s.transport_cost + s.lodging_cost + s.workspace_cost + s.food_misc_cost + s.time_cost) as estimated_total_cost,
  (s.estimated_revenue - (s.transport_cost + s.lodging_cost + s.workspace_cost + s.food_misc_cost + s.time_cost)) as estimated_net_profit,
  case
    when s.planned_start_date is not null and s.planned_end_date is not null then
      greatest((s.planned_end_date - s.planned_start_date + 1), 1)
    else null
  end as planned_days,
  case
    when s.planned_start_date is not null and s.planned_end_date is not null then
      round(
        (s.estimated_revenue - (s.transport_cost + s.lodging_cost + s.workspace_cost + s.food_misc_cost + s.time_cost))::numeric
        / greatest((s.planned_end_date - s.planned_start_date + 1), 1),
        0
      )::int
    else null
  end as estimated_net_profit_per_day
from city_sessions s;

create or replace view city_dashboard_summary as
select
  coalesce(w.city, s.city, p.city) as city,
  coalesce(p.city_category, '未分類') as city_category,
  coalesce(p.route_group, '未分類') as route_group,
  coalesce(p.priority_rank, 99) as priority_rank,
  coalesce(w.registration_count, 0)::int as registration_count,
  coalesce(w.high_intent_count, 0)::int as high_intent_count,
  coalesce(w.grooming_interest_count, 0)::int as grooming_interest_count,
  coalesce(w.main_service_demands, '{}') as main_service_demands,
  s.status as latest_session_status,
  s.planned_start_date,
  s.planned_end_date,
  s.estimated_revenue,
  s.estimated_total_cost,
  s.estimated_net_profit,
  s.estimated_net_profit_per_day
from city_profiles p
left join city_waitlist_summary w on w.city = p.city
left join lateral (
  select *
  from city_session_profit_view sp
  where sp.city = p.city
  order by sp.created_at desc
  limit 1
) s on true
union
select
  w.city,
  w.city_category,
  w.route_group,
  w.priority_rank,
  w.registration_count,
  w.high_intent_count,
  w.grooming_interest_count,
  w.main_service_demands,
  s.status as latest_session_status,
  s.planned_start_date,
  s.planned_end_date,
  s.estimated_revenue,
  s.estimated_total_cost,
  s.estimated_net_profit,
  s.estimated_net_profit_per_day
from city_waitlist_summary w
left join city_profiles p on p.city = w.city
left join lateral (
  select *
  from city_session_profit_view sp
  where sp.city = w.city
  order by sp.created_at desc
  limit 1
) s on true
where p.city is null;

alter table city_settings enable row level security;
alter table city_profiles enable row level security;
alter table city_waitlist enable row level security;
alter table city_sessions enable row level security;

-- Keep RLS closed for browser clients. Vercel API uses the Supabase service role key.
