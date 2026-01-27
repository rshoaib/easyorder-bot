-- Add type column to products table
ALTER TABLE products 
ADD COLUMN type VARCHAR(20) DEFAULT 'physical';

-- Update existing products to be physical by default
UPDATE products SET type = 'physical' WHERE type IS NULL;
