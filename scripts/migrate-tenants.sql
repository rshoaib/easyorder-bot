-- 1. Create Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_phone TEXT,
    currency TEXT DEFAULT '$',
    theme_color TEXT DEFAULT 'black',
    password TEXT, -- Simple auth for MVP
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert Default Tenant (The current single store)
-- We use a known ID or capture it in a variable if possible, but pure SQL in Supabase editor is often run as a block.
-- Let's insert and rely on the Slug 'default' to find it later.

INSERT INTO tenants (name, slug, owner_phone, password)
VALUES ('My EasyOrder Store', 'default', '', 'admin123')
ON CONFLICT (slug) DO NOTHING;

-- 3. Add tenant_id to Products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- 4. Add tenant_id to Orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- 5. Migrate Existing Data
-- Update all existing products/orders to belong to the 'default' tenant
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM tenants WHERE slug = 'default' LIMIT 1;
    
    IF default_tenant_id IS NOT NULL THEN
        UPDATE products SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE orders SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    END IF;
END $$;
