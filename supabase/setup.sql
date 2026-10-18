-- ════════════════════════════════════════════════════════════════════
--  Portfolio CMS — run this once in Supabase → SQL Editor → New query.
--  1. Change the email on the LAST line to the one you will log in with.
--  2. Click "Run". It is safe to run again.
-- ════════════════════════════════════════════════════════════════════

-- Who may edit. Only emails listed here can save content or upload files.
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
-- (No policies on purpose: nobody can read or change this table from the website.)

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- The whole site's content, stored as one JSON document in row id = 1.
create table if not exists public.site_content (
  id int primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "Anyone can read the site" on public.site_content;
create policy "Anyone can read the site"
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can create the site" on public.site_content;
create policy "Admins can create the site"
  on public.site_content for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update the site" on public.site_content;
create policy "Admins can update the site"
  on public.site_content for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Public bucket for your photo, resume and other uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml', 'application/pdf']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ▼▼▼ Put YOUR login email here ▼▼▼
insert into public.admins (email) values ('sazzadkun@gmail.com') on conflict do nothing;
