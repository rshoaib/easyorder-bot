-- Add missing columns for social media and settings
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS meta_pixel_id TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS owner_phone TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS custom_domain TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
