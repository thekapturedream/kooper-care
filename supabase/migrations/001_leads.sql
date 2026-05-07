-- Kapture Logistics — Lead Capture Schema
-- Run this once in your Supabase project SQL editor (or via the Supabase CLI).
-- Captures every quote request, contact form, and newsletter signup.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  type         text not null check (type in ('quote', 'contact', 'newsletter', 'partner')),
  name         text,
  email        text not null,
  phone        text,
  company      text,
  origin       text,
  destination  text,
  cargo_type   text,
  weight_kg    numeric,
  mode         text,
  pickup_date  text,
  topic        text,
  service      text,
  message      text,
  source       text,
  status       text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'won', 'lost', 'spam'))
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_type on public.leads (type);
create index if not exists idx_leads_email on public.leads (email);

-- Row Level Security: lock down the table.
-- Inserts come ONLY from the Next.js API route via the service role key,
-- which bypasses RLS. Reads go through the Supabase dashboard or your CRM sync.
alter table public.leads enable row level security;

-- No public access policies. The anon key can not read or write this table.
-- If you later want a public newsletter form to write directly, add a narrow
-- INSERT policy with a strict check.
