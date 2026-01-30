-- PERFORMANCE IMPROVEMENTS
-- Adding indexes to columns used frequently in RLS policies and filtering.
-- This helps Supabase/Postgres execute the security checks much faster.

-- 1. Index for Tenants lookup by User (used in "Owners can..." policies)
CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON tenants(user_id);

-- 2. Indexes for Foreign Keys checking (used in "auth.uid() = ... subqueries")
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_tenant_id ON promo_codes(tenant_id);

-- 3. Index for Order Status (frequently filtered in Admin Board)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 4. Index for Store Slug (public store lookup)
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
