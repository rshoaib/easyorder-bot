-- Refresh: whatsapp-ordering-vs-delivery-apps — update stale WhatsApp user count (2B → 3B MAU per Meta 2025)
UPDATE blog_posts
SET
    content = REPLACE(
        content,
        'WhatsApp has 2+ billion users globally',
        'WhatsApp has 3+ billion monthly active users globally'
    ),
    updated_at = now()
WHERE slug = 'whatsapp-ordering-vs-delivery-apps';
