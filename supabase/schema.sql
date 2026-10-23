create table if not exists public.testimonials (
  id bigint generated always as identity primary key,
  name text not null check (char_length(trim(name)) between 2 and 80),
  company text not null check (char_length(trim(company)) between 2 and 120),
  role text not null default '' check (char_length(trim(role)) <= 80),
  quote text not null check (char_length(trim(quote)) between 10 and 1000),
  consented_at timestamptz not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.testimonials
  add column if not exists is_approved boolean not null default false;

alter table public.testimonials enable row level security;

grant select, insert on public.testimonials to anon;
grant usage, select on sequence public.testimonials_id_seq to anon;

drop policy if exists "Anyone can read testimonials" on public.testimonials;
drop policy if exists "Anyone can submit testimonials" on public.testimonials;
drop policy if exists "Public can read approved testimonials" on public.testimonials;
drop policy if exists "Public can submit testimonials for review" on public.testimonials;

create policy "Public can read approved testimonials"
  on public.testimonials
  for select
  to anon
  using (is_approved = true);

create policy "Public can submit testimonials for review"
  on public.testimonials
  for insert
  to anon
  with check (is_approved = false);

-- Approve a testimonial in the Supabase dashboard by setting is_approved to true.
