create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'farmer'
    check (role in ('farmer', 'cooperative_admin', 'agro_dealer', 'organization_admin', 'super_admin')),
  preferred_language text not null default 'en'
    check (preferred_language in ('en', 'sw')),
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), new.email, 'Farmer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create table public.farm_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  farm_name text not null check (char_length(farm_name) between 1 and 60),
  county text not null check (char_length(county) between 1 and 80),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  crop text not null check (crop in ('maize', 'coffee', 'horticulture', 'general')),
  activity text not null check (activity in ('planting', 'fertilizer', 'spraying', 'harvest', 'drying', 'general'))
);

alter table public.farm_profiles enable row level security;
revoke all on public.farm_profiles from anon, authenticated;
grant select, insert, update, delete on public.farm_profiles to authenticated;

create policy "Users can read their own farm profile"
  on public.farm_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own farm profile"
  on public.farm_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own farm profile"
  on public.farm_profiles
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own farm profile"
  on public.farm_profiles
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
