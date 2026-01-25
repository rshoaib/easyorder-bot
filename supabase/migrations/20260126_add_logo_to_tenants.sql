-- Add logo_url to tenants table
ALTER TABLE tenants ADD COLUMN logo_url TEXT;

-- Initial branding colors (optional validation)
-- ALTER TABLE tenants ADD CONSTRAINT valid_hex_color CHECK (theme_color ~* '^#[0-9a-f]{6}$');
