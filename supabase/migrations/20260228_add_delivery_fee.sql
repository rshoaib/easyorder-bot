-- Add per-store delivery fee to tenants table
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0;
