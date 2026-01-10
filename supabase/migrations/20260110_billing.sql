-- Add billing fields to tenants table
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trialing', -- active, past_due, canceled, trialing
ADD COLUMN IF NOT EXISTS plan_id text DEFAULT 'price_starter';

-- Index for faster lookups by customer/subscription
CREATE INDEX IF NOT EXISTS idx_tenants_stripe_customer ON tenants(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_tenants_stripe_subscription ON tenants(stripe_subscription_id);
