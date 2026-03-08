-- Add timezone column to tenants table
-- This allows each store to configure their timezone for correct timestamp display
-- Default is NULL (which falls back to UTC in the app)

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT NULL;

-- For the South African customer reporting the issue, you can set their timezone directly:
-- UPDATE tenants SET timezone = 'Africa/Johannesburg' WHERE slug = 'YOUR_STORE_SLUG';
