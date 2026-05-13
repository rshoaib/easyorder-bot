-- Refresh: whatsapp-business-food-delivery — update stale WhatsApp user count (2B → 3B MAU per Meta 2024)
UPDATE blog_posts
SET
    content = REPLACE(
        REPLACE(
            content,
            '2 Billion Users',
            '3 Billion Users'
        ),
        'WhatsApp is the world''s most used messaging app',
        'WhatsApp reached 3 billion monthly active users — the world''s most used messaging app'
    ),
    updated_at = now()
WHERE slug = 'whatsapp-business-food-delivery';
