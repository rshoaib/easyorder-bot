-- Add delivery fee columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subtotal NUMERIC,
ADD COLUMN IF NOT EXISTS "deliveryFee" NUMERIC; -- Quoted mixed case if needed, but standard SQL is snake_case.
-- Actually, since we use JSONB for items/customer, we might stick to simple columns.
-- Supabase handles case sensitivity based on creation. 
-- Let's use lower case to be safe, but our code sends `deliveryFee`.
-- If we want to use specific keys in insert object, we should match column names.

-- Let's stick to lower case snake_case for columns usually, but to match the JS object key `deliveryFee` automatically, 
-- we either need a mapping or verify if Supabase client auto-converts.
-- It usually expects exact match or snake_case if configured.

-- SAFEST: Add columns exactly as used in JS or use JSONB.
-- Given previously we defined table in earlier step? We didn't define strict columns for `orders` besides `id`, `date`, `customer` (jsonb), `items` (jsonb), `total` (numeric), `status` (text).

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "deliveryFee" NUMERIC DEFAULT 0;
