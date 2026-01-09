-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT
);

-- Optional: Seed with initial data (Example)
INSERT INTO products (id, name, price, category, image, description)
VALUES 
('1', 'Artisan Sourdough Bread', 4.50, 'Bakery', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600', 'Freshly baked sourdough.'),
('2', 'Organic Avocados (Pack of 3)', 5.99, 'Produce', 'https://images.unsplash.com/photo-1519162808019-7de137e72a4a?auto=format&fit=crop&q=80&w=600', 'Ripe and creamy organic avocados.'),
('3', 'Extra Virgin Olive Oil', 12.00, 'Pantry', 'https://images.unsplash.com/photo-1474979266404-7caddb59f858?auto=format&fit=crop&q=80&w=600', 'Cold-pressed premium olive oil.'),
('4', 'Dark Roast Coffee Beans', 15.50, 'Beverages', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600', 'Rich and bold dark roast beans.'),
('5', 'Local Honey', 8.75, 'Pantry', 'https://images.unsplash.com/photo-1587049359509-5d884456e5df?auto=format&fit=crop&q=80&w=600', 'Raw wildflower honey.'),
('6', 'Chocolate Croissant', 3.25, 'Bakery', 'https://images.unsplash.com/photo-1555507036-ab1f4039a044?auto=format&fit=crop&q=80&w=600', 'Flaky pastry filled with chocolate.');

