-- TikTok link and per-account visibility for the public footer.
-- Run this once in the Supabase SQL editor.

alter table business_settings add column if not exists tiktok text not null default '';
alter table business_settings add column if not exists social_visible jsonb not null default '{"whatsapp":true,"facebook":true,"instagram":true,"tiktok":true}'::jsonb;
