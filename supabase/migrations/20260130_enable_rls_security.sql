-- Enable RLS on Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view products (Storefront)
CREATE POLICY "Public products are viewable" 
ON products FOR SELECT 
USING (true);

-- Policy: Only Store Owners can modify products
CREATE POLICY "Owners can modify their products" 
ON products FOR ALL 
USING (
  auth.uid() = (
    SELECT user_id FROM tenants WHERE id = products.tenant_id
  )
);


-- Enable RLS on Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can place an order (Guest Checkout)
CREATE POLICY "Public can create orders" 
ON orders FOR INSERT 
WITH CHECK (true);

-- Policy: Only Store Owners can view/manage orders
-- Note: 'USING' checks existing rows for Select/Update/Delete
CREATE POLICY "Owners can view and manage orders" 
ON orders FOR ALL 
USING (
  auth.uid() = (
    SELECT user_id FROM tenants WHERE id = orders.tenant_id
  )
);


-- Enable RLS on Promo Codes
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can check promo codes (Cart validation)
CREATE POLICY "Public can view active promo codes" 
ON promo_codes FOR SELECT 
USING (true);

-- Policy: Only Store Owners can manage promo codes
CREATE POLICY "Owners can manage promo codes" 
ON promo_codes FOR ALL 
USING (
  auth.uid() = (
    SELECT user_id FROM tenants WHERE id = promo_codes.tenant_id
  )
);

-- Enable RLS on Tenants (CRITICAL FIX)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view active tenants (Storefront access)
CREATE POLICY "Public can view active tenants" 
ON tenants FOR SELECT 
USING (true);

-- Policy: Owners can update their own tenant settings
CREATE POLICY "Owners can update their own tenant" 
ON tenants FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Owners can verify their own tenant
CREATE POLICY "Owners can view their own tenant" 
ON tenants FOR SELECT 
USING (auth.uid() = user_id);
