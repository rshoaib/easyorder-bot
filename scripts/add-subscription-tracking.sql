-- ============================================================
-- Migration: Add Pro Subscription Tracking
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add subscription date columns to tenants table
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_end_date   TIMESTAMPTZ;

-- 2. Create a dedicated subscriptions table for payment records
CREATE TABLE IF NOT EXISTS subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan            TEXT NOT NULL DEFAULT 'pro',
  amount_pkr      NUMERIC(10,2),
  payment_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  duration_months INTEGER,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Index for fast tenant lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON subscriptions(tenant_id);

-- ============================================================
-- ACTIVATION: Khana Center (run AFTER migration above)
-- This activates Khana Center's 2-year Pro plan from today.
-- Replace the email match if the store was registered differently.
-- ============================================================
-- Step A: Upgrade tenant to Pro with 2-year dates
UPDATE tenants
SET
  plan                   = 'pro',
  status                 = 'active',
  subscription_start_date = '2026-03-25T00:00:00+00:00',
  subscription_end_date   = '2028-03-25T00:00:00+00:00'
WHERE email = 'khanacentermrd@gmail.com';

-- Step B: Insert payment record
INSERT INTO subscriptions (tenant_id, plan, amount_pkr, payment_date, start_date, end_date, duration_months, notes)
SELECT
  id,
  'pro',
  30000.00,
  '2026-03-25',
  '2026-03-25',
  '2028-03-25',
  24,
  '2-year special discount deal. Store: Khana Center. WhatsApp: +923339844224'
FROM tenants
WHERE email = 'khanacentermrd@gmail.com';
