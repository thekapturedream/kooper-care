-- =====================================================================
-- 003_demo_seed.sql
-- =====================================================================
--
-- Bootstraps a Demo community + four demo workers so the local dev
-- environment can sign in with the four roles surfaced in the Hero card:
--   · Sister Anne · Nurse
--   · Craig · Carer
--   · Lola · Manager
--   · Tomas · Inspector
--
-- Idempotent — `on conflict do nothing` makes re-running safe.
--
-- IMPORTANT: this file inserts the worker records but NOT the auth.users
-- rows. Auth users must be created via Supabase Studio Auth → Users (or
-- the API). Once created, copy each auth uid into auth_user_id column.
--
-- For local dev with magic-link auth: sign in once with each demo email,
-- then run a SQL update to backfill auth_user_id.
-- =====================================================================

-- The demo community.
insert into communities (id, name, slug, service_type, modules, locality, region, country_code)
values (
  '00000000-0000-0000-0000-000000000001',
  'Draycott Demo House',
  'draycott-demo',
  'care-home',
  array['hr','care-plans','recording','charts','reports']::text[],
  'London',
  'England',
  'GB'
)
on conflict (id) do nothing;

-- Demo workers (auth_user_id is NULL until backfilled after first sign-in).
insert into workers (id, auth_user_id, preferred_name, legal_name, email, rtw_verified)
values
  ('00000000-0000-0000-0000-000000000a01', null, 'Sister Anne',  'Anne Whitfield',   'anne@kapture-demo.test',  true),
  ('00000000-0000-0000-0000-000000000a02', null, 'Craig',        'Craig Musara',     'craig@kapture-demo.test', true),
  ('00000000-0000-0000-0000-000000000a03', null, 'Lola',         'Lola Okonkwo',     'lola@kapture-demo.test',  true),
  ('00000000-0000-0000-0000-000000000a04', null, 'Tomas',        'Tomas Jankowski',  'tomas@kapture-demo.test', true)
on conflict (id) do nothing;

-- Role assignments.
insert into worker_roles (worker_id, community_id, role)
values
  ('00000000-0000-0000-0000-000000000a01', '00000000-0000-0000-0000-000000000001', 'nurse'),
  ('00000000-0000-0000-0000-000000000a02', '00000000-0000-0000-0000-000000000001', 'carer'),
  ('00000000-0000-0000-0000-000000000a03', '00000000-0000-0000-0000-000000000001', 'manager'),
  ('00000000-0000-0000-0000-000000000a04', '00000000-0000-0000-0000-000000000001', 'inspector')
on conflict (worker_id, community_id, role) do nothing;
