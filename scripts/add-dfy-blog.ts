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
<h2>The Ultimate Guide to Launching a WhatsApp Store Fast</h2>

<p>Selling on WhatsApp is the ultimate cheat code for small businesses in 2026. Whether you're a local restaurant, a home baker, or a boutique retailer, your customers are already spending hours every day on WhatsApp.</p>

<p>But traditional e-commerce platforms like Shopify or WooCommerce can be overwhelming. They take weeks to learn, require technical skills to design, and cost a fortune in monthly fees and transaction percentages.</p>

<p>What if you could <strong>create a WhatsApp store</strong> in just 24 hours without touching a single line of code?</p>

<p>In this guide, we'll explain how our new <strong>Done-For-You (DFY) E-commerce Setup</strong> works, and how it's helping merchants skip the technical headaches and go straight to selling.</p>

<h2>Why You Need a WhatsApp Ordering System Today</h2>

<p>Customer behavior has changed. People don't want to download another app or navigate clunky websites. They want to message you, browse a catalog, and place an order instantly.</p>

<p>Here's why a dedicated WhatsApp store works better for local businesses:</p>
<ul>
  <li><strong>Zero Friction:</strong> Customers order without leaving their favorite chat app.</li>
  <li><strong>Direct Relationships:</strong> Every order starts a conversation, letting you build loyalty naturally.</li>
  <li><strong>No Middlemen:</strong> Stop paying 30% commissions to food delivery apps or marketplaces.</li>
</ul>

<p>However, standard WhatsApp Business simply gives you a basic catalog. It doesn't calculate totals, track delivery fees, or organize orders automatically. That's where an automated <strong>WhatsApp ordering system</strong> like OrderViaChat comes in.</p>

<h2>The Problem: Building It Yourself</h2>

<p>While OrderViaChat is designed to be user-friendly, setting up any online catalog takes time. You have to:</p>
<ol>
  <li>Upload and crop dozens of product photos.</li>
  <li>Write engaging product descriptions.</li>
  <li>Configure delivery charges, minimum order amounts, and payment methods.</li>
  <li>Add your logo and brand colors.</li>
</ol>

<p>For busy owners managing staff and inventory, finding 5 hours to sit at a computer and configure a store is nearly impossible.</p>

<h2>The Solution: Done-For-You (DFY) Store Setup</h2>

<p>To solve this, we've launched our <strong>"We'll Do It For You" setup service</strong>. Instead of learning how to build a store, you simply hand us the ingredients, and we bake the cake.</p>

<p>Here is the exact 3-step process to launch your store with our DFY service:</p>

<h3>Step 1: Send Us Your Menu on WhatsApp</h3>
<p>Once you purchase the $15 Quick Setup package, you just send us a WhatsApp message with your products. It can be a PDF of your menu, an Excel sheet, or just photos with prices. No complicated forms required.</p>

<h3>Step 2: We Build Your Store</h3>
<p>Our team takes your assets and builds your complete store. We:</p>
<ul>
  <li>Upload your logo and set your brand colors.</li>
  <li>Add all your products with professional formatting.</li>
  <li>Set up your currency (USD, EUR, EGP, INR, IDR, etc.).</li>
  <li>Configure your delivery zones and fees.</li>
  <li>Test the ordering flow to ensure it works perfectly.</li>
</ul>

<h3>Step 3: Start Selling in 24 Hours</h3>
<p>Within 24 hours, we text you back a live link (e.g., <code>orderviachat.com/store/yourbrand</code>). You can immediately paste this link in your Instagram bio, Facebook page, or send it to your existing customers.</p>

<p>When customers click it, they see a beautiful, mobile-optimized catalog. When they check out, the fully formatted order is sent straight to your shop's WhatsApp number.</p>

<h2>Beyond the Basics: Custom Solutions</h2>

<p>As your business scales, your needs might change. The DFY service also extends to custom development. If you need a specific feature—like a combo-meal builder, specific opening hours for different days, or even your own branded mobile app—our team builds it for you at deeply discounted rates compared to traditional agencies.</p>

<h2>Ready to Skip the Setup?</h2>

<p>Your time is your most valuable asset. Spending hours figuring out software isn't growing your business; serving customers is.</p>

<p>Let our team handle the tech while you handle the sales.</p>

<p>👉 <a href="https://wa.me/923224609117"><strong>Chat with us on WhatsApp</strong></a> to claim your $15 DFY store setup today!</p>
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
