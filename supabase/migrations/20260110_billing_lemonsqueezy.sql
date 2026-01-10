-- Add LemonSqueezy specific fields
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS lemonsqueezy_customer_id text,
ADD COLUMN IF NOT EXISTS lemonsqueezy_subscription_id text,
ADD COLUMN IF NOT EXISTS lemonsqueezy_variant_id text;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenants_ls_customer ON tenants(lemonsqueezy_customer_id);
CREATE INDEX IF NOT EXISTS idx_tenants_ls_subscription ON tenants(lemonsqueezy_subscription_id);
