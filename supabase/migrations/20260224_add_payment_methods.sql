-- Add payment method columns to tenants
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS paypal_link TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS stripe_link TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS cod_enabled BOOLEAN DEFAULT true;
