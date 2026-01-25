
export const PRESET_MENUS = {
    burgers: {
        label: "Burger Joint",
        icon: "🍔",
        products: [
            {
                name: "Classic Cheeseburger",
                description: "Juicy beef patty with cheddar, lettuce, tomato, and our secret sauce.",
                price: 12.99,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
                category: "Burgers"
            },
            {
                name: "Double Bacon Smash",
                description: "Two smashed patties, crispy bacon, caramelized onions, and BBQ sauce.",
                price: 15.99,
                image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80",
                category: "Burgers"
            },
            {
                name: "Crispy Fries",
                description: "Golden shoestring fries seasoned with sea salt.",
                price: 4.99,
                image: "https://images.unsplash.com/photo-1573080496987-a199f8cd4054?auto=format&fit=crop&w=800&q=80",
                category: "Sides"
            },
            {
                name: "Vanilla Milkshake",
                description: "Hand-spun milkshake made with real vanilla bean ice cream.",
                price: 6.99,
                image: "https://images.unsplash.com/photo-1579954115545-a95591f28dfc?auto=format&fit=crop&w=800&q=80",
                category: "Drinks"
            },
            {
                name: "Onion Rings",
                description: "Beer-battered thick cut onion rings.",
                price: 5.99,
                image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80",
                category: "Sides"
            }
        ]
    },
    sushi: {
        label: "Sushi Bar",
        icon: "🍣",
        products: [
            {
                name: "Spicy Tuna Roll",
                description: "Fresh tuna, spicy mayo, and cucumber topped with sesame seeds.",
                price: 8.99,
                image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
                category: "Rolls"
            },
            {
                name: "Salmon Nigiri (2pc)",
                description: "Premium atlantic salmon over seasoned sushi rice.",
                price: 6.50,
                image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=800&q=80",
                category: "Nigiri"
            },
            {
                name: "Dragon Roll",
                description: "Shrimp tempura and cucumber topped with avocado and eel sauce.",
                price: 14.99,
                image: "https://images.unsplash.com/photo-1558985204-41f26a8747a4?auto=format&fit=crop&w=800&q=80",
                category: "Special Rolls"
            },
            {
                name: "Miso Soup",
                description: "Traditional soybean soup with tofu and seaweed.",
                price: 3.50,
                image: "https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&w=800&q=80",
                category: "Appetizers"
            },
            {
                name: "Edamame",
                description: "Steamed young soybeans sprinkled with sea salt.",
                price: 4.99,
                image: "https://images.unsplash.com/photo-1623592506694-a957270b925b?auto=format&fit=crop&w=800&q=80",
                category: "Appetizers"
            }
        ]
    },
    pizza: {
        label: "Pizzeria",
        icon: "🍕",
        products: [
            {
                name: "Margherita",
                description: "San Marzano tomato sauce, fresh mozzarella, basil, and olive oil.",
                price: 14.00,
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
                category: "Classic Pizzas"
            },
            {
                name: "Pepperoni Feast",
                description: "Loaded with crispy pepperoni and double mozzarella.",
                price: 16.50,
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
                category: "Classic Pizzas"
            },
            {
                name: "Garlic Knots",
                description: "Oven-baked dough knots tossed in garlic butter and parsley.",
                price: 5.99,
                image: "https://images.unsplash.com/photo-1573165231977-3f0e27806045?auto=format&fit=crop&w=800&q=80",
                category: "Sides"
            },
            {
                name: "Caesar Salad",
                description: "Romaine lettuce, parmesan, croutons, and house-made dressing.",
                price: 9.99,
                image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
                category: "Salads"
            },
            {
                name: "Tiramisu",
                description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.",
                price: 7.99,
                image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
                category: "Desserts"
            }
        ]
    },
    coffee: {
        label: "Cafe",
        icon: "☕",
        products: [
            {
                name: "Caramel Macchiato",
                description: "Espresso with steamed milk and vanilla syrup, topped with caramel drizzle.",
                price: 4.95,
                image: "https://images.unsplash.com/photo-1485808191679-5f8c7c8606af?auto=format&fit=crop&w=800&q=80",
                category: "Hot Drinks"
            },
            {
                name: "Iced Latte",
                description: "Rich espresso and cold milk served over ice.",
                price: 4.50,
                image: "https://images.unsplash.com/photo-1517701604599-bb29b5c73512?auto=format&fit=crop&w=800&q=80",
                category: "Cold Drinks"
            },
            {
                name: "Almond Croissant",
                description: "Buttery croissant filled with almond paste and topped with sliced almonds.",
                price: 3.95,
                image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80",
                category: "Bakery"
            },
            {
                name: "Avocado Toast",
                description: "Sourdough toast topped with mashed avocado, chili flakes, and sea salt.",
                price: 8.50,
                image: "https://images.unsplash.com/photo-1588137372308-15f75323a399?auto=format&fit=crop&w=800&q=80",
                category: "Food"
            },
            {
                name: "Matcha Latte",
                description: "Premium japanese green tea powder with steamed milk.",
                price: 5.25,
                image: "https://images.unsplash.com/photo-1515823664-b6db13028291?auto=format&fit=crop&w=800&q=80",
                category: "Hot Drinks"
            }
        ]
    }
};

export type PresetType = keyof typeof PRESET_MENUS;
