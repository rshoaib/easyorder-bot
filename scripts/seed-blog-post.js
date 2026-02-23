/**
 * Content Pipeline: Insert blog post
 * "How Small Restaurants Can Take Online Orders Without Paying Commission Fees"
 * 
 * Run: node scripts/seed-blog-post.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const post = {
    slug: 'online-orders-without-commission-fees',
    title: 'How Small Restaurants Can Take Online Orders Without Paying Commission Fees',
    excerpt: 'Food delivery apps charge 15-30% per order. Here\'s how smart restaurant owners are switching to commission-free ordering via WhatsApp — and keeping 100% of their revenue.',
    date: '2026-02-23',
    author: 'OrderViaChat Team',
    category: 'Guides',
    cover_image: null,
    is_published: true,
    content: `
<p class="text-lg text-slate-600 leading-relaxed mb-8">
If you run a small restaurant, you know the pain: food delivery platforms like Uber Eats, DoorDash, and Grubhub promise more customers — but they take <strong>15% to 30% of every order</strong>. On a Rs. 1,000 order, you could be losing Rs. 150–300 in fees. Over a month, that adds up to lakhs in lost revenue.
</p>

<p class="text-slate-600 leading-relaxed mb-8">
But what if you could take online orders <strong>without paying a single rupee in commission</strong>? That's exactly what thousands of small restaurant owners are doing with WhatsApp ordering — and tools like <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a> make it free and effortless to set up.
</p>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">The Commission Trap: What Delivery Apps Really Cost You</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Let's break down the real cost of using third-party delivery platforms:
</p>

<div class="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-red-800 mb-3">💸 Typical Platform Fees</h3>
<ul class="space-y-2 text-red-700">
<li>• <strong>Commission per order:</strong> 15–30%</li>
<li>• <strong>Payment processing:</strong> 2–3%</li>
<li>• <strong>Marketing/promotion fees:</strong> 5–15% extra for visibility</li>
<li>• <strong>Monthly subscription:</strong> Rs. 2,000–10,000 on some platforms</li>
</ul>
<p class="mt-4 font-semibold text-red-800">Total cost: Up to 40% of your order value goes to the platform — not to you.</p>
</div>

<p class="text-slate-600 leading-relaxed mb-8">
For a small restaurant making Rs. 200,000/month in delivery orders, that's <strong>Rs. 60,000–80,000 lost to commission fees alone</strong>. That's money that could go toward better ingredients, staff salaries, or your own savings.
</p>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">The WhatsApp Alternative: Zero Commission, Maximum Profit</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Here's the thing: <strong>your customers already use WhatsApp</strong>. In Pakistan, India, the Middle East, and across Asia, WhatsApp has 2+ billion users. Your customers don't want to download yet another app — they want to order through a channel they already trust.
</p>

<p class="text-slate-600 leading-relaxed mb-8">
With WhatsApp ordering, the flow is beautifully simple:
</p>

<div class="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-indigo-800 mb-3">📱 How WhatsApp Ordering Works</h3>
<ol class="space-y-3 text-indigo-700">
<li><strong>1.</strong> Customer opens your digital menu link (shared via social media, flyer, or QR code)</li>
<li><strong>2.</strong> They browse your menu, add items to cart</li>
<li><strong>3.</strong> They tap "Order via WhatsApp" — the order is sent directly to your WhatsApp</li>
<li><strong>4.</strong> You confirm, prepare, and deliver. <strong>Zero commission paid.</strong></li>
</ol>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Set It Up in 5 Minutes (Free)</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Tools like <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a> make this incredibly easy. Here's how:
</p>

<div class="space-y-4 mb-8">
<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
<div>
<h3 class="font-bold text-slate-900">Create Your Free Store</h3>
<p class="text-slate-500 text-sm">Sign up at OrderViaChat.com — no credit card, no monthly fees, completely free.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
<div>
<h3 class="font-bold text-slate-900">Add Your Menu Items</h3>
<p class="text-slate-500 text-sm">Upload photos, set prices, organize by category (Pizza, Burgers, Drinks, etc.)</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
<div>
<h3 class="font-bold text-slate-900">Share Your Link</h3>
<p class="text-slate-500 text-sm">Get a beautiful link like orderviachat.com/store/yourname — share it everywhere.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
<div>
<h3 class="font-bold text-slate-900">Receive Orders on WhatsApp</h3>
<p class="text-slate-500 text-sm">Customers browse, add to cart, and checkout — the order lands in your WhatsApp. Done!</p>
</div>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Commission-Free vs Platform Fees: The Math</h2>

<div class="overflow-x-auto mb-8">
<table class="w-full border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
<thead>
<tr class="bg-slate-50">
<th class="text-left p-4 font-bold text-slate-900 border-b">Monthly Orders</th>
<th class="text-left p-4 font-bold text-red-600 border-b">With Delivery Apps (25%)</th>
<th class="text-left p-4 font-bold text-green-600 border-b">With OrderViaChat (0%)</th>
<th class="text-left p-4 font-bold text-indigo-600 border-b">You Save</th>
</tr>
</thead>
<tbody>
<tr class="border-b">
<td class="p-4 text-slate-600">Rs. 100,000</td>
<td class="p-4 text-red-600 font-semibold">-Rs. 25,000 in fees</td>
<td class="p-4 text-green-600 font-semibold">Rs. 0 in fees</td>
<td class="p-4 text-indigo-600 font-bold">Rs. 25,000/month</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600">Rs. 300,000</td>
<td class="p-4 text-red-600 font-semibold">-Rs. 75,000 in fees</td>
<td class="p-4 text-green-600 font-semibold">Rs. 0 in fees</td>
<td class="p-4 text-indigo-600 font-bold">Rs. 75,000/month</td>
</tr>
<tr>
<td class="p-4 text-slate-600">Rs. 500,000</td>
<td class="p-4 text-red-600 font-semibold">-Rs. 125,000 in fees</td>
<td class="p-4 text-green-600 font-semibold">Rs. 0 in fees</td>
<td class="p-4 text-indigo-600 font-bold">Rs. 125,000/month</td>
</tr>
</tbody>
</table>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Why WhatsApp Ordering Works Better for Small Businesses</h2>

<div class="grid md:grid-cols-2 gap-4 mb-8">
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">✅ Direct Customer Relationship</h3>
<p class="text-green-700 text-sm">You chat directly with customers. Build loyalty, handle special requests, and get repeat orders — no middleman.</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">✅ No App Download Required</h3>
<p class="text-green-700 text-sm">Customers don't need to install anything. WhatsApp is already on their phone.</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">✅ Full Menu Control</h3>
<p class="text-green-700 text-sm">Update prices, add specials, toggle items as "sold out" — all from your admin dashboard in real time.</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">✅ Works for Any Business</h3>
<p class="text-green-700 text-sm">Restaurants, bakeries, grocery stores, flower shops — any business that takes orders.</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Ready to Stop Paying Commission?</h2>

<p class="text-slate-600 leading-relaxed mb-6">
The choice is simple: keep giving away 15-30% of every order to delivery platforms, or keep 100% of your revenue with commission-free WhatsApp ordering.
</p>

<div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8">
<h3 class="text-2xl font-bold mb-3">Start Taking Free Orders Today</h3>
<p class="text-indigo-100 mb-6">Create your digital menu in 5 minutes. No payment required. No commission ever.</p>
<a href="https://orderviachat.com/register" class="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg">Create Your Free Store →</a>
</div>

<p class="text-slate-500 text-sm italic">
OrderViaChat is a free tool that helps small businesses create digital menus and receive orders via WhatsApp. No commissions, no monthly fees, no hidden charges.
</p>
`
};

async function seedBlogPost() {
    console.log('📝 Inserting blog post...');
    
    // Check if post already exists
    const { data: existing } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('slug', post.slug)
        .single();
    
    if (existing) {
        console.log('⚠️ Post already exists, updating...');
        const { error } = await supabase
            .from('blog_posts')
            .update(post)
            .eq('slug', post.slug);
        
        if (error) {
            console.error('❌ Update failed:', error.message);
            process.exit(1);
        }
        console.log('✅ Blog post updated!');
    } else {
        const { error } = await supabase
            .from('blog_posts')
            .insert(post);
        
        if (error) {
            console.error('❌ Insert failed:', error.message);
            process.exit(1);
        }
        console.log('✅ Blog post created!');
    }
    
    console.log(`🔗 Live at: https://orderviachat.com/blog/${post.slug}`);
}

seedBlogPost();
