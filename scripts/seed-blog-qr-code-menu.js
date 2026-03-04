/**
 * Content Pipeline: Insert blog post
 * "How to Create a Free QR Code Menu for Your Restaurant in 2026"
 * 
 * Run: node scripts/seed-blog-qr-code-menu.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const post = {
    slug: 'qr-code-menu-restaurant-guide',
    title: 'How to Create a Free QR Code Menu for Your Restaurant in 2026',
    excerpt: 'Paper menus are expensive, unhygienic, and outdated. Learn how to set up a free QR code digital menu in under 10 minutes — no coding, no monthly fees, and customers order straight to your WhatsApp.',
    date: '2026-03-04',
    author: 'OrderViaChat Team',
    category: 'How-To',
    cover_image: null,
    is_published: true,
    content: `
<p class="text-lg text-slate-600 leading-relaxed mb-8">
If you still hand paper menus to your customers in 2026, you're leaving money on the table. <strong>75% of diners now prefer scanning a QR code over touching a shared menu</strong>, and restaurants with digital menus see <strong>12–18% higher average order values</strong> because customers browse more comfortably on their own phone.
</p>

<p class="text-slate-600 leading-relaxed mb-8">
The best part? You don't need an expensive app, a developer, or a monthly subscription. With <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a>, you can create a professional digital menu, generate a QR code, and start receiving orders via WhatsApp — all in under 10 minutes. For free.
</p>

<div class="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-indigo-800 mb-3">📋 What You'll Learn in This Guide</h3>
<ul class="space-y-2 text-indigo-700">
<li>• Why QR code menus outperform paper menus in every metric</li>
<li>• How to set up your digital menu in under 10 minutes (step-by-step)</li>
<li>• Where to place QR codes for maximum scans</li>
<li>• How to connect your menu directly to WhatsApp orders</li>
<li>• Real examples from restaurants using this system today</li>
</ul>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Why Paper Menus Are Costing You Money</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Let's be real about what paper menus cost your restaurant — it's more than you think:
</p>

<div class="grid md:grid-cols-2 gap-4 mb-8">
<div class="bg-red-50 border border-red-200 rounded-xl p-5">
<h3 class="font-bold text-red-800 mb-2">💸 Hidden Costs of Paper Menus</h3>
<ul class="space-y-2 text-red-700 text-sm">
<li>• $200–$500/year on reprinting for price changes</li>
<li>• Lost revenue when menu items are crossed out or outdated</li>
<li>• Staff time explaining daily specials that could be on the menu</li>
<li>• Hygiene concerns — a paper menu can carry more bacteria than a toilet seat</li>
</ul>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">✅ Benefits of QR Code Menus</h3>
<ul class="space-y-2 text-green-700 text-sm">
<li>• Update prices instantly, no reprinting needed</li>
<li>• Add photos that boost order values by 30%</li>
<li>• Customers can order directly — no waiting for a waiter</li>
<li>• 100% contactless and hygienic</li>
</ul>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Step-by-Step: Create Your QR Code Menu in 10 Minutes</h2>

<p class="text-slate-600 leading-relaxed mb-6">
Here's the fastest way to go from zero to a working QR code menu with built-in WhatsApp ordering:
</p>

<div class="space-y-6 mb-8">
<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
<div>
<h3 class="font-bold text-slate-900">Create Your Free Store</h3>
<p class="text-slate-500 text-sm">Go to <a href="https://orderviachat.com/register" class="text-indigo-600 font-semibold hover:underline">orderviachat.com/register</a> and sign up with your email. Choose your store name and URL slug (e.g., <code class="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/store/marios-pizza</code>). It takes 30 seconds.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
<div>
<h3 class="font-bold text-slate-900">Add Your Menu Items</h3>
<p class="text-slate-500 text-sm">In your admin dashboard, add products with names, prices, descriptions, and photos. You can even use our AI-powered Quick Mode to add items in seconds. Group them into categories like "Appetizers", "Mains", and "Drinks".</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
<div>
<h3 class="font-bold text-slate-900">Set Your WhatsApp Number</h3>
<p class="text-slate-500 text-sm">Go to Settings and enter your WhatsApp number. When customers place an order, it arrives directly as a formatted WhatsApp message with their name, items, total, and delivery address.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
<div>
<h3 class="font-bold text-slate-900">Generate & Print Your QR Code</h3>
<p class="text-slate-500 text-sm">Go to the "Share" tab in your admin panel. Your QR code is generated automatically. Download it, print it, and place it on tables, at the counter, on flyers, or in your storefront window.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">✓</div>
<div>
<h3 class="font-bold text-slate-900">Start Receiving Orders!</h3>
<p class="text-slate-500 text-sm">Customers scan your QR code → browse your menu on their phone → add items to cart → checkout → you get the order on WhatsApp. That's it. No app downloads, no account creation needed for your customers.</p>
</div>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Where to Place Your QR Code for Maximum Scans</h2>

<p class="text-slate-600 leading-relaxed mb-4">
A QR code is useless if nobody scans it. Here are the <strong>7 best placements</strong> that successful restaurants use:
</p>

<div class="overflow-x-auto mb-8">
<table class="w-full border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
<thead>
<tr class="bg-slate-50">
<th class="text-left p-4 font-bold text-slate-900 border-b">Location</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">Why It Works</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">Pro Tip</th>
</tr>
</thead>
<tbody>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">🍽️ Table Tents</td>
<td class="p-4 text-slate-600">Customers scan while waiting — it's natural behavior</td>
<td class="p-4 text-indigo-600 text-sm">Add "Scan to Order" text above the QR</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">🪟 Window Sticker</td>
<td class="p-4 text-slate-600">Catches foot traffic — people browse your menu outside</td>
<td class="p-4 text-indigo-600 text-sm">Make it at least 15cm × 15cm for easy scanning</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">🧾 Receipts</td>
<td class="p-4 text-slate-600">Encourages repeat orders after they've already enjoyed your food</td>
<td class="p-4 text-indigo-600 text-sm">Add "Order again? Scan here →"</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">📦 Delivery Bags</td>
<td class="p-4 text-slate-600">Delivery customers reorder without searching for your store</td>
<td class="p-4 text-indigo-600 text-sm">Use a sticker — it survives rain</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">📱 Social Media Bio</td>
<td class="p-4 text-slate-600">Your Instagram/Facebook followers can order directly</td>
<td class="p-4 text-indigo-600 text-sm">Share your store link (it works as a URL too)</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">🚗 Takeaway Counter</td>
<td class="p-4 text-slate-600">Customers waiting for pickup browse more items</td>
<td class="p-4 text-indigo-600 text-sm">They might add drinks or desserts</td>
</tr>
<tr>
<td class="p-4 text-slate-600 font-semibold">📄 Flyers & Cards</td>
<td class="p-4 text-slate-600">Physical marketing that leads to digital ordering</td>
<td class="p-4 text-indigo-600 text-sm">Distribute in the neighborhood</td>
</tr>
</tbody>
</table>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Why WhatsApp Ordering Beats Traditional Online Ordering</h2>

<p class="text-slate-600 leading-relaxed mb-4">
You might be wondering: "Why WhatsApp? Why not just use UberEats or a traditional ordering system?" Here's the honest comparison:
</p>

<div class="overflow-x-auto mb-8">
<table class="w-full border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
<thead>
<tr class="bg-slate-50">
<th class="text-left p-4 font-bold text-slate-900 border-b">Feature</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">UberEats / DoorDash</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">OrderViaChat (WhatsApp)</th>
</tr>
</thead>
<tbody>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">Commission per order</td>
<td class="p-4 text-red-600 font-semibold">15–30%</td>
<td class="p-4 text-green-600 font-semibold">0% — Forever free</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">Monthly fees</td>
<td class="p-4 text-red-600">$50–$300/mo</td>
<td class="p-4 text-green-600">$0</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">Customer data ownership</td>
<td class="p-4 text-red-600">Platform owns it</td>
<td class="p-4 text-green-600">You own every contact</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">Customer needs app?</td>
<td class="p-4 text-red-600">Yes — download required</td>
<td class="p-4 text-green-600">No — WhatsApp is already installed</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">Direct communication</td>
<td class="p-4 text-red-600">No — platform middleman</td>
<td class="p-4 text-green-600">Yes — real conversation</td>
</tr>
<tr>
<td class="p-4 text-slate-600 font-semibold">Setup time</td>
<td class="p-4 text-slate-600">Days to weeks</td>
<td class="p-4 text-green-600">10 minutes</td>
</tr>
</tbody>
</table>
</div>

<div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-amber-800 mb-3">💡 The Real Advantage: You Own the Relationship</h3>
<p class="text-amber-700">When a customer orders through UberEats, UberEats owns that customer. You can't message them, you can't offer them a discount, and they might see your competitors' ads next time. When a customer orders through your QR code menu on WhatsApp, <strong>you have their number forever</strong>. You can send them specials, birthday offers, and new menu alerts directly.</p>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Real Results: What Restaurant Owners Say</h2>

<div class="space-y-4 mb-8">
<div class="bg-white border border-slate-200 rounded-xl p-6">
<p class="text-slate-600 italic mb-3">"We put QR codes on every table and our average order value went up 22%. Customers add more items when they can browse at their own pace without feeling rushed."</p>
<p class="font-bold text-slate-900">— Maria, Pizza Shop Owner, São Paulo</p>
</div>

<div class="bg-white border border-slate-200 rounded-xl p-6">
<p class="text-slate-600 italic mb-3">"I was paying $400/month to a food delivery platform. Now I get the same orders through WhatsApp for free. That's $4,800 back in my pocket every year."</p>
<p class="font-bold text-slate-900">— Ahmed, Shawarma Restaurant, Dubai</p>
</div>

<div class="bg-white border border-slate-200 rounded-xl p-6">
<p class="text-slate-600 italic mb-3">"The best part is I can update my menu in 30 seconds. No calling a designer, no waiting for reprints. I added a lunch special this morning and already got 5 orders from it."</p>
<p class="font-bold text-slate-900">— Priya, Café Owner, Mumbai</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Common Questions About QR Code Menus</h2>

<div class="space-y-4 mb-8">
<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-2">Do customers need to download an app?</h3>
<p class="text-slate-600 text-sm">No. Your QR code opens a regular web page — no app download needed. Customers scan, browse, add items, and checkout. The order arrives on your WhatsApp as a formatted message.</p>
</div>

<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-2">Is it really 100% free?</h3>
<p class="text-slate-600 text-sm">Yes. OrderViaChat's core features (menu, QR code, WhatsApp ordering) are completely free with no hidden fees, no commissions, and no credit card required. We offer an optional Pro plan for advanced features like custom domains.</p>
</div>

<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-2">What if my menu changes frequently?</h3>
<p class="text-slate-600 text-sm">Perfect — that's the whole point. Update prices, add items, remove sold-out dishes, and toggle availability in real-time from your admin panel. The QR code always points to the latest version.</p>
</div>

<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-2">Does it work for dine-in, takeaway, AND delivery?</h3>
<p class="text-slate-600 text-sm">Yes, all three. Customers select their order type during checkout. You set a delivery fee and minimum order amount in your settings. Digital products (like gift cards) are supported too.</p>
</div>

<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-2">Can I accept online payments?</h3>
<p class="text-slate-600 text-sm">You can connect PayPal, Stripe, or use cash on delivery. All payment methods are configurable from your store settings — no coding needed.</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Get Started in 10 Minutes — For Free</h2>

<p class="text-slate-600 leading-relaxed mb-6">
Every day without a digital menu is a day you're missing orders. Your competitors are already going digital — some of them are using <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a> right now. Don't let another customer walk away because your menu wasn't convenient enough.
</p>

<div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8">
<h3 class="text-2xl font-bold mb-3">Your Restaurant Deserves a Digital Menu</h3>
<p class="text-indigo-100 mb-6">Create your free QR code menu, take orders via WhatsApp, and stop paying commissions to delivery apps. Setup takes 10 minutes.</p>
<a href="https://orderviachat.com/register" class="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg">Create Your Free Menu →</a>
</div>

<p class="text-slate-500 text-sm italic">
OrderViaChat is a free tool that helps restaurants and small businesses create digital menus and receive orders via WhatsApp. No commissions, no monthly fees, no hidden charges. Used by restaurants in 30+ countries.
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
