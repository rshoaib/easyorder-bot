-- Add digital_file_url column to products table
ALTER TABLE products ADD COLUMN digital_file_url TEXT;

-- Security: Ensure products table allows update of this column (RLS should already cover this if enabled)
