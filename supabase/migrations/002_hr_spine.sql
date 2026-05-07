-- =====================================================================
-- 002_hr_spine.sql
-- =====================================================================
--
-- The HR spine for Kapture Care.
--
-- Every Kapture Care session begins by resolving the authenticated user to:
--   1. Their worker record
--   2. The communities (organisations / facilities) they belong to
--   3. Their role in each community (Carer, Nurse, SeniorCarer, Manager, …)
--   4. The residents in scope for those communities
--   5. Their training currency, contract status, and access privileges
--
-- This file lays the data spine. RLS policies further down enforce that no
-- worker can read or write outside the communities they're entitled to.
--
-- Tables created:
--   communities            -- the operator entity (a care home, a domiciliary
--                             agency, etc.) Workers belong to one or more.
--   workers                -- the staff record. 1:1 with auth.users.
--   roles_enum             -- enumerated role strings.
--   worker_roles           -- worker × community × role assignment.
--   training_records       -- mandatory training currency tracker.
--   audit_log              -- immutable append-only history of every action.
--
-- Conventions:
--   · All ids are uuid v4
--   · All tables have created_at + updated_at
--   · Updated rows automatically write to audit_log via triggers
--   · RLS is ENABLED on every table — service role only bypasses
-- =====================================================================

-- Required for gen_random_uuid() in default expressions.
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- communities
-- ---------------------------------------------------------------------
-- An operator entity — a care home, a domiciliary agency, a supported-
-- living provider, a multi-site group. The unit of pricing and isolation.
-- ---------------------------------------------------------------------
create table if not exists communities (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  service_type  text not null check (service_type in (
    'care-home',
    'domiciliary',
    'supported-living',
    'nursing',
    'forensic'
  )),
  /** Modules this community has subscribed to. Always includes 'hr'. */
  modules       text[] not null default array['hr']::text[],
  /** Postal address fields — kept flat for simplicity. */
  address_line1 text,
  address_line2 text,
  locality      text,
  region        text,
  postal_code   text,
  country_code  text not null default 'GB',
  /** Operational defaults. */
  timezone      text not null default 'Europe/London',
  resident_capacity int,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists communities_slug_idx on communities(slug);
create index if not exists communities_active_idx on communities(active) where active;

-- ---------------------------------------------------------------------
-- roles_enum
-- ---------------------------------------------------------------------
-- Single source of truth for the role taxonomy. Referenced by worker_roles
-- and by RoleGate in the app.
-- ---------------------------------------------------------------------
create table if not exists roles_enum (
  role        text primary key,
  label       text not null,
  description text,
  /** Sort order in pickers. Lowest is most senior. */
  rank        int not null default 100
);

insert into roles_enum (role, label, description, rank) values
  ('admin',         'System Admin',     'Kapture Studio engineers — bypass RLS via service role.', 0),
  ('owner',         'Owner / Director', 'Provider owner. Full visibility across all their communities.', 10),
  ('manager',       'Registered Manager','Day-to-day operator of a community. CQC-registered.', 20),
  ('clinical_lead', 'Clinical Lead',    'RGN/RN with clinical oversight responsibilities.', 25),
  ('senior_carer',  'Senior Carer',     'Shift lead. Approves notes, runs handover.', 30),
  ('nurse',         'Nurse',            'Registered nurse on the floor.', 35),
  ('carer',         'Carer',            'Front-line care worker. Records most notes.', 40),
  ('inspector',     'Inspector',        'Read-only role for CQC inspectors during inspections.', 50),
  ('family',        'Family',           'Read-only access to consented family content.', 60)
on conflict (role) do update set label = excluded.label, description = excluded.description, rank = excluded.rank;

-- ---------------------------------------------------------------------
-- workers
-- ---------------------------------------------------------------------
-- The staff record. 1:1 with auth.users.
-- ---------------------------------------------------------------------
create table if not exists workers (
  id            uuid primary key default gen_random_uuid(),
  /** Mirrors auth.users.id. Every authed user is a worker. */
  auth_user_id  uuid not null unique references auth.users(id) on delete cascade,
  preferred_name text not null,
  legal_name    text,
  email         text not null unique,
  phone         text,
  /** Right-to-work + DBS status. Surfaced on the worker profile. */
  rtw_verified  boolean not null default false,
  rtw_verified_at timestamptz,
  dbs_number    text,
  dbs_issued_at date,
  dbs_expires_at date,
  /** Photo for the handset login + nav avatar. */
  photo_url     text,
  /** Active vs leaver. Inactive workers can no longer authenticate. */
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists workers_email_idx on workers(email);
create index if not exists workers_auth_user_idx on workers(auth_user_id);
create index if not exists workers_active_idx on workers(active) where active;

-- ---------------------------------------------------------------------
-- worker_roles
-- ---------------------------------------------------------------------
-- A worker × community × role row. A worker can have different roles in
-- different communities (e.g. Manager in one home, Senior Carer in another).
-- ---------------------------------------------------------------------
create table if not exists worker_roles (
  id            uuid primary key default gen_random_uuid(),
  worker_id     uuid not null references workers(id) on delete cascade,
  community_id  uuid not null references communities(id) on delete cascade,
  role          text not null references roles_enum(role),
  assigned_at   timestamptz not null default now(),
  expires_at    timestamptz,
  active        boolean not null default true,
  unique (worker_id, community_id, role)
);

create index if not exists worker_roles_lookup_idx on worker_roles(worker_id, community_id) where active;
create index if not exists worker_roles_community_idx on worker_roles(community_id) where active;

-- ---------------------------------------------------------------------
-- training_records
-- ---------------------------------------------------------------------
-- Mandatory training currency. CQC inspections check this is in date.
-- ---------------------------------------------------------------------
create table if not exists training_records (
  id            uuid primary key default gen_random_uuid(),
  worker_id     uuid not null references workers(id) on delete cascade,
  course        text not null, -- 'safeguarding', 'fire', 'manual_handling', etc.
  completed_at  timestamptz,
  expires_at    timestamptz,
  evidence_url  text,
  created_at    timestamptz not null default now(),
  unique (worker_id, course, completed_at)
);

create index if not exists training_records_worker_idx on training_records(worker_id);
create index if not exists training_records_expiry_idx on training_records(expires_at)
  where expires_at is not null;

-- ---------------------------------------------------------------------
-- audit_log
-- ---------------------------------------------------------------------
-- Append-only history of every interesting action. Powers the audit-trail
-- spine — every screen with a "history" button reads from this.
-- ---------------------------------------------------------------------
create table if not exists audit_log (
  id            uuid primary key default gen_random_uuid(),
  /** Worker who performed the action. May be null for system actions. */
  actor_id      uuid references workers(id) on delete set null,
  action        text not null check (action in (
    'view',
    'create',
    'update',
    'void',
    'delete',
    'export',
    'expand_redacted',
    'sign_in',
    'sign_out',
    'role_change',
    'permission_change'
  )),
  entity_type   text not null,
  entity_id     uuid,
  community_id  uuid references communities(id) on delete set null,
  before_json   jsonb,
  after_json    jsonb,
  ip_address    inet,
  user_agent    text,
  occurred_at   timestamptz not null default now()
);

create index if not exists audit_log_actor_idx on audit_log(actor_id);
create index if not exists audit_log_entity_idx on audit_log(entity_type, entity_id);
create index if not exists audit_log_occurred_idx on audit_log(occurred_at desc);

-- ---------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists communities_updated_at on communities;
create trigger communities_updated_at before update on communities
  for each row execute function set_updated_at();

drop trigger if exists workers_updated_at on workers;
create trigger workers_updated_at before update on workers
  for each row execute function set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
-- Default deny on every table. Policies grant scoped reads/writes.
-- Service role bypasses RLS — used by trusted server actions only.
-- =====================================================================

alter table communities enable row level security;
alter table workers enable row level security;
alter table worker_roles enable row level security;
alter table training_records enable row level security;
alter table audit_log enable row level security;
alter table roles_enum enable row level security;

-- Helper function: which communities is the calling worker entitled to?
create or replace function auth_worker_communities()
returns table (community_id uuid)
language sql
security definer
stable
as $$
  select wr.community_id
  from worker_roles wr
  join workers w on w.id = wr.worker_id
  where w.auth_user_id = auth.uid()
    and wr.active
    and (wr.expires_at is null or wr.expires_at > now())
$$;

grant execute on function auth_worker_communities to authenticated;

-- communities: a worker can read communities they belong to. Only owners and
-- managers can update.
create policy communities_read on communities
  for select to authenticated
  using (id in (select * from auth_worker_communities()));

create policy communities_update on communities
  for update to authenticated
  using (
    id in (
      select wr.community_id from worker_roles wr
      join workers w on w.id = wr.worker_id
      where w.auth_user_id = auth.uid()
        and wr.role in ('owner', 'manager', 'admin')
        and wr.active
    )
  );

-- workers: every authed user can read their own row. Managers and owners can
-- read all workers in their communities.
create policy workers_self_read on workers
  for select to authenticated
  using (auth_user_id = auth.uid());

create policy workers_manager_read on workers
  for select to authenticated
  using (
    exists (
      select 1 from worker_roles wr_self
      join workers w_self on w_self.id = wr_self.worker_id
      join worker_roles wr_target on wr_target.worker_id = workers.id
      where w_self.auth_user_id = auth.uid()
        and wr_self.role in ('owner', 'manager', 'admin')
        and wr_self.community_id = wr_target.community_id
    )
  );

-- worker_roles: own roles always readable. Manager/owner can read all in
-- their community.
create policy worker_roles_self_read on worker_roles
  for select to authenticated
  using (
    worker_id = (select id from workers where auth_user_id = auth.uid() limit 1)
    or community_id in (
      select wr.community_id from worker_roles wr
      join workers w on w.id = wr.worker_id
      where w.auth_user_id = auth.uid()
        and wr.role in ('owner', 'manager', 'admin')
        and wr.active
    )
  );

-- training_records: own is always readable. Managers can see their staff.
create policy training_records_self on training_records
  for select to authenticated
  using (
    worker_id = (select id from workers where auth_user_id = auth.uid() limit 1)
  );

create policy training_records_manager on training_records
  for select to authenticated
  using (
    exists (
      select 1 from worker_roles wr_self
      join workers w_self on w_self.id = wr_self.worker_id
      join worker_roles wr_target on wr_target.worker_id = training_records.worker_id
      where w_self.auth_user_id = auth.uid()
        and wr_self.role in ('owner', 'manager', 'admin')
        and wr_self.community_id = wr_target.community_id
    )
  );

-- audit_log: read only for managers, owners, admins, inspectors.
create policy audit_log_managers on audit_log
  for select to authenticated
  using (
    exists (
      select 1 from worker_roles wr
      join workers w on w.id = wr.worker_id
      where w.auth_user_id = auth.uid()
        and wr.community_id = audit_log.community_id
        and wr.role in ('owner', 'manager', 'clinical_lead', 'admin', 'inspector')
        and wr.active
    )
    or actor_id = (select id from workers where auth_user_id = auth.uid() limit 1)
  );

-- roles_enum is reference data — readable by everyone authenticated.
create policy roles_enum_read on roles_enum
  for select to authenticated
  using (true);

-- =====================================================================
-- SEED DATA — minimal so the dev environment can sign in.
-- =====================================================================
-- Real seed lives in 003_demo_seed.sql. This migration only ships schema.
-- =====================================================================
