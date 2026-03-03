import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dfyBlogPost = {
    slug: 'how-to-launch-whatsapp-store-24-hours',
    title: 'How to Launch Your WhatsApp Store in 24 Hours Without Technical Skills',
    excerpt: 'Learn how our Done-For-You (DFY) service can get your WhatsApp ordering system live in 24 hours without any coding, complex setup, or technical background.',
    author: 'OrderViaChat Team',
    category: 'Guides',
    date: new Date().toISOString().split('T')[0],
    content: `
# The Ultimate Guide to Launching a WhatsApp Store Fast

Selling on WhatsApp is the ultimate cheat code for small businesses in 2026. Whether you're a local restaurant, a home baker, or a boutique retailer, your customers are already spending hours every day on WhatsApp. 

But traditional e-commerce platforms like Shopify or WooCommerce can be overwhelming. They take weeks to learn, require technical skills to design, and cost a fortune in monthly fees and transaction percentages.

What if you could **create a WhatsApp store** in just 24 hours without touching a single line of code?

In this guide, we'll explain how our new **Done-For-You (DFY) E-commerce Setup** works, and how it's helping merchants skip the technical headaches and go straight to selling.

## Why You Need a WhatsApp Ordering System Today

Customer behavior has changed. People don't want to download another app or navigate clunky websites. They want to message you, browse a catalog, and place an order instantly.

Here's why a dedicated WhatsApp store works better for local businesses:
- **Zero Friction:** Customers order without leaving their favorite chat app.
- **Direct Relationships:** Every order starts a conversation, letting you build loyalty naturally.
- **No Middlemen:** Stop paying 30% commissions to food delivery apps or marketplaces.

However, standard WhatsApp Business simply gives you a basic catalog. It doesn't calculate totals, track delivery fees, or organize orders automatically. That's where an automated **WhatsApp ordering system** like OrderViaChat comes in.

## The Problem: Building It Yourself

While OrderViaChat is designed to be user-friendly, setting up any online catalog takes time. You have to:
1. Upload and crop dozens of product photos.
2. Write engaging product descriptions.
3. Configure delivery charges, minimum order amounts, and payment methods.
4. Add your logo and brand colors.

For busy owners managing staff and inventory, finding 5 hours to sit at a computer and configure a store is nearly impossible.

## The Solution: Done-For-You (DFY) Store Setup

To solve this, we've launched our **"We'll Do It For You" setup service**. Instead of learning how to build a store, you simply hand us the ingredients, and we bake the cake.

Here is the exact 3-step process to launch your store with our DFY service:

### Step 1: Send Us Your Menu on WhatsApp
Once you purchase the $15 Quick Setup package, you just send us a WhatsApp message with your products. It can be a PDF of your menu, an Excel sheet, or just photos with prices. No complicated forms required.

### Step 2: We Build Your Store
Our team takes your assets and builds your complete store. We:
- Upload your logo and set your brand colors.
- Add all your products with professional formatting.
- Set up your currency (USD, EUR, EGP, INR, IDR, etc.).
- Configure your delivery zones and fees.
- Test the ordering flow to ensure it works perfectly.

### Step 3: Start Selling in 24 Hours
Within 24 hours, we text you back a live link (e.g., \`orderviachat.com/store/yourbrand\`). You can immediately paste this link in your Instagram bio, Facebook page, or send it to your existing customers. 

When customers click it, they see a beautiful, mobile-optimized catalog. When they check out, the fully formatted order is sent straight to your shop's WhatsApp number.

## Beyond the Basics: Custom Solutions

As your business scales, your needs might change. The DFY service also extends to custom development. If you need a specific feature—like a combo-meal builder, specific opening hours for different days, or even your own branded mobile app—our team builds it for you at deeply discounted rates compared to traditional agencies.

## Ready to Skip the Setup?

Your time is your most valuable asset. Spending hours figuring out software isn't growing your business; serving customers is.

Let our team handle the tech while you handle the sales.

👉 **[Chat with us on WhatsApp](https://wa.me/923224609117)** to claim your $15 DFY store setup today!
`
};

async function insertPost() {
    console.log('Upserting DFY blog post...');

    const { data, error } = await supabase
        .from('blog_posts')
        .upsert({
            slug: dfyBlogPost.slug,
            title: dfyBlogPost.title,
            excerpt: dfyBlogPost.excerpt,
            author: dfyBlogPost.author,
            category: dfyBlogPost.category,
            date: dfyBlogPost.date,
            content: dfyBlogPost.content,
            is_published: true
        }, { onConflict: 'slug' })
        .select()
        .single();

    if (error) {
        console.error('Error inserting post:', error);
    } else {
        console.log('Post successfully inserted/updated:', data.slug);
    }
}

insertPost();
