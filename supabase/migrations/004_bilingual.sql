-- English copy sits beside the Swahili text already stored on each row.
-- Images stay shared. Run this once in the Supabase SQL editor.

alter table business_settings add column if not exists english jsonb not null default '{}'::jsonb;
alter table services add column if not exists english jsonb not null default '{}'::jsonb;
alter table products add column if not exists english jsonb not null default '{}'::jsonb;
alter table portfolio_projects add column if not exists english jsonb not null default '{}'::jsonb;
