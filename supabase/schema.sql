-- Run this in the Supabase SQL editor for your project.

create table if not exists discoveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  destination text not null,
  interests text not null default '',
  result jsonb not null,
  created_at timestamptz not null default now()
);

alter table discoveries enable row level security;

create policy "Users can view their own discoveries"
  on discoveries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own discoveries"
  on discoveries for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own discoveries"
  on discoveries for delete
  using (auth.uid() = user_id);

create index if not exists discoveries_user_id_created_at_idx
  on discoveries (user_id, created_at desc);
