-- Refresh: online-orders-without-commission-fees — update stale WhatsApp user count (2B → 3B MAU per Meta 2025)
UPDATE blog_posts
SET
    content = REPLACE(
        content,
        'WhatsApp has 2+ billion users',
        'WhatsApp has 3+ billion monthly active users'
    ),
    updated_at = now()
WHERE slug = 'online-orders-without-commission-fees';
