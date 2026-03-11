-- Create atomic increment function for promo codes to prevent race conditions
CREATE OR REPLACE FUNCTION increment_promo_usage(row_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE promo_codes
  SET usage_count = COALESCE(usage_count, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
