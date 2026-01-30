-- Add store_type to tenants table
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS store_type TEXT DEFAULT 'restaurant';

-- Optional: Add constraint to ensure valid types
-- ALTER TABLE tenants ADD CONSTRAINT check_store_type CHECK (store_type IN ('restaurant', 'retail', 'service', 'digital'));
