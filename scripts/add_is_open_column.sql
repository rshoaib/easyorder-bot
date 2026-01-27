-- Add is_open column to tenants table
ALTER TABLE tenants 
ADD COLUMN is_open BOOLEAN DEFAULT TRUE;

-- Update existing tenants to be open by default
UPDATE tenants SET is_open = TRUE WHERE is_open IS NULL;
