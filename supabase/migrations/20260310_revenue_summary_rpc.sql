-- Create RPC for fast revenue aggregation
CREATE OR REPLACE FUNCTION get_tenant_revenue_summary(t_id TEXT)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'totalOrders', COUNT(id),
    'totalRevenue', COALESCE(SUM(total), 0),
    'recentRevenue', COALESCE(SUM(CASE WHEN date::timestamp > (NOW() - INTERVAL '30 days') THEN total ELSE 0 END), 0)
  ) INTO result
  FROM orders
  WHERE tenant_id = t_id AND status != 'cancelled';
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
