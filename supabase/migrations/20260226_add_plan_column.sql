-- Add plan column to tenants table
-- Values: 'free' (default) or 'pro'
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
