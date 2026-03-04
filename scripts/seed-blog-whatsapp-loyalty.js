/**
 * Content Pipeline: Insert blog post
 * "5 WhatsApp Tricks to Turn One-Time Buyers into Loyal Repeat Customers"
 * 
 * Run: node scripts/seed-blog-whatsapp-loyalty.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const post = {
    slug: 'whatsapp-loyalty-repeat-customers',
    title: '5 WhatsApp Tricks to Turn One-Time Buyers into Loyal Repeat Customers',
    excerpt: 'Acquiring a new customer costs 5× more than keeping one. Learn how smart restaurant owners use WhatsApp to build loyalty, drive repeat orders, and grow revenue — without spending a dime on ads.',
    date: '2026-03-04',
    author: 'OrderViaChat Team',
    category: 'Growth',
    cover_image: null,
    is_published: true,
    content: `
<p class="text-lg text-slate-600 leading-relaxed mb-8">
Here's a stat that should change how you run your restaurant: <strong>acquiring a new customer costs 5 to 7 times more than retaining an existing one</strong>. Yet most small business owners spend all their energy chasing new customers — while their past buyers quietly disappear.
</p>

<p class="text-slate-600 leading-relaxed mb-8">
The good news? You already have the most powerful customer retention tool on the planet sitting in your pocket: <strong>WhatsApp</strong>. With 2+ billion users worldwide and a 98% message open rate, WhatsApp crushes email (20% open rate) and social media (5% reach) when it comes to actually reaching your customers. Combined with a free tool like <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a>, you can turn every one-time buyer into a loyal regular — without any marketing budget.
</p>

<div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-amber-800 mb-3">📊 Why Repeat Customers Matter More Than You Think</h3>
<ul class="space-y-2 text-amber-700">
<li>• <strong>67% more spending:</strong> Repeat customers spend 67% more per order than first-time buyers</li>
<li>• <strong>5× cheaper:</strong> Retaining a customer costs 1/5th of acquiring a new one</li>
<li>• <strong>80/20 rule:</strong> 80% of your future revenue comes from just 20% of your existing customers</li>
<li>• <strong>Free marketing:</strong> Loyal customers refer friends — the best advertising money can't buy</li>
</ul>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Trick 1: Send a Personalized Thank-You After Every Order</h2>

<p class="text-slate-600 leading-relaxed mb-4">
This is the simplest trick — and the most underused. After a customer places an order through your <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a> store, their order lands directly in your WhatsApp. That means you have their number. Use it.
</p>

<div class="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-indigo-800 mb-3">💬 Example Thank-You Message</h3>
<div class="bg-white rounded-lg p-4 text-slate-700 border border-indigo-100">
<p class="mb-2">Hi [Name]! 😊</p>
<p class="mb-2">Thank you so much for ordering from <strong>[Your Store]</strong>! We really hope you enjoyed the [item they ordered].</p>
<p class="mb-2">Next time, try our [new dish or bestseller] — it's a customer favorite! 🔥</p>
<p>We'd love to serve you again. Just tap your menu link anytime: <strong>[your store link]</strong></p>
</div>
</div>

<p class="text-slate-600 leading-relaxed mb-8">
<strong>Why it works:</strong> A personal touch turns a transaction into a relationship. Customers remember businesses that made them feel valued. This one message alone can boost reorder rates by 20–30%.
</p>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Trick 2: Create WhatsApp-Only Exclusive Deals</h2>

<p class="text-slate-600 leading-relaxed mb-4">
People love feeling special. Create deals that are <strong>only available to your WhatsApp customers</strong> — this gives them a reason to stay connected and makes them feel like VIPs.
</p>

<div class="grid md:grid-cols-2 gap-4 mb-8">
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">🎯 Flash Deal Friday</h3>
<p class="text-green-700 text-sm">Every Friday, send a 15% off code that's only valid for 24 hours. Creates urgency and a weekly habit.</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">🎁 Buy 5, Get 1 Free</h3>
<p class="text-green-700 text-sm">Track orders manually and surprise your 6th-time customer with a free item. They'll tell everyone.</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">🏷️ Secret Menu Items</h3>
<p class="text-green-700 text-sm">Offer special dishes that aren't on the public menu — only WhatsApp subscribers know about them.</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">👥 Referral Bonus</h3>
<p class="text-green-700 text-sm">"Send this menu link to a friend. When they order, you both get 10% off your next order!"</p>
</div>
</div>

<p class="text-slate-600 leading-relaxed mb-8">
With <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a>, you can create promo codes directly from your admin dashboard and share them via WhatsApp — no extra tools needed.
</p>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Trick 3: Announce New Menu Items & Specials First to WhatsApp</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Treat your WhatsApp customers like insiders. Before you post on Instagram or Facebook, send a sneak peek to your WhatsApp list first. This does two things:
</p>

<div class="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
<ol class="space-y-3 text-purple-700">
<li><strong>1. Drives immediate orders</strong> — People who already ordered from you are most likely to try your new items.</li>
<li><strong>2. Creates FOMO</strong> — "WhatsApp subscribers got first access" makes others want to join your list.</li>
</ol>
</div>

<div class="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-indigo-800 mb-3">💬 Example Sneak Peek Message</h3>
<div class="bg-white rounded-lg p-4 text-slate-700 border border-indigo-100">
<p class="mb-2">🚨 FIRST LOOK — just for you!</p>
<p class="mb-2">We just added <strong>Chicken Alfredo Pasta</strong> to our menu 🍝</p>
<p class="mb-2">You're the first to know — it's not even on social media yet!</p>
<p class="mb-2">📱 Order now before everyone finds out: <strong>[your store link]</strong></p>
<p>Only 20 servings today. Don't miss out! 🔥</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Trick 4: Remember Birthdays & Special Occasions</h2>

<p class="text-slate-600 leading-relaxed mb-4">
This is the ultimate "wow" moment. When a regular customer mentions their birthday or anniversary in a chat, <strong>save that date</strong>. Then, when the day comes:
</p>

<div class="space-y-4 mb-8">
<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">🎂</div>
<div>
<h3 class="font-bold text-slate-900">Send a Birthday Surprise</h3>
<p class="text-slate-500 text-sm">"Happy Birthday, Ahmed! 🎉 Here's a free dessert on us with your next order. Use code: BDAY2026. We appreciate you being a loyal customer!"</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">💍</div>
<div>
<h3 class="font-bold text-slate-900">Anniversary Treat</h3>
<p class="text-slate-500 text-sm">"Congratulations on your anniversary! 🥂 Enjoy 20% off a special dinner for two. Your celebration deserves the best food!"</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">🏠</div>
<div>
<h3 class="font-bold text-slate-900">Housewarming / New Baby</h3>
<p class="text-slate-500 text-sm">"We heard about the new house! 🎊 Here's free delivery on your next 3 orders — housewarming meals on us!"</p>
</div>
</div>
</div>

<p class="text-slate-600 leading-relaxed mb-8">
<strong>Why it works:</strong> This costs you almost nothing (a free dessert or a small discount), but the emotional impact is enormous. Customers will never forget — and they'll tell everyone they know about your business.
</p>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Trick 5: Ask for Feedback (Then Actually Use It)</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Most restaurants never ask for feedback. The few that do use generic Google Forms that nobody fills out. On WhatsApp, feedback is natural — it's just a conversation.
</p>

<div class="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-indigo-800 mb-3">💬 Example Feedback Message (Send 2 Hours After Delivery)</h3>
<div class="bg-white rounded-lg p-4 text-slate-700 border border-indigo-100">
<p class="mb-2">Hey [Name]! 😊</p>
<p class="mb-2">Quick question — how was your <strong>[ordered item]</strong>?</p>
<p class="mb-2">Reply with:</p>
<p class="mb-1">🔥 = Loved it!</p>
<p class="mb-1">👍 = It was good</p>
<p class="mb-1">😕 = Could be better</p>
<p class="mt-2">Your honest feedback helps us improve! And if you loved it, we'd really appreciate a quick Google review ⭐</p>
</div>
</div>

<p class="text-slate-600 leading-relaxed mb-4">
<strong>The magic formula:</strong> When someone replies negatively —
</p>

<div class="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
<ol class="space-y-2 text-red-700">
<li><strong>1.</strong> Apologize genuinely (not a template)</li>
<li><strong>2.</strong> Offer a free replacement or discount on next order</li>
<li><strong>3.</strong> Follow up to make sure the fix worked</li>
</ol>
<p class="mt-4 font-semibold text-red-800">A customer whose complaint was resolved well becomes MORE loyal than one who never had an issue.</p>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Putting It All Together: Your Weekly WhatsApp Rhythm</h2>

<p class="text-slate-600 leading-relaxed mb-4">
You don't need to do everything at once. Here's a simple weekly schedule that takes less than 30 minutes:
</p>

<div class="overflow-x-auto mb-8">
<table class="w-full border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
<thead>
<tr class="bg-slate-50">
<th class="text-left p-4 font-bold text-slate-900 border-b">Day</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">Action</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">Time Needed</th>
</tr>
</thead>
<tbody>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">Monday</td>
<td class="p-4 text-slate-600">Send thank-you messages to weekend orders</td>
<td class="p-4 text-indigo-600 font-semibold">5 min</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">Wednesday</td>
<td class="p-4 text-slate-600">Announce a new item or share a behind-the-scenes photo</td>
<td class="p-4 text-indigo-600 font-semibold">5 min</td>
</tr>
<tr class="border-b">
<td class="p-4 text-slate-600 font-semibold">Friday</td>
<td class="p-4 text-slate-600">Send a WhatsApp-only deal (valid 24 hours)</td>
<td class="p-4 text-indigo-600 font-semibold">5 min</td>
</tr>
<tr>
<td class="p-4 text-slate-600 font-semibold">Saturday</td>
<td class="p-4 text-slate-600">Ask for feedback from yesterday's orders + check birthday list</td>
<td class="p-4 text-indigo-600 font-semibold">10 min</td>
</tr>
</tbody>
</table>
</div>

<p class="text-slate-600 leading-relaxed mb-8">
That's <strong>25 minutes per week</strong> for a massive boost in repeat orders. No ad spend. No complicated software. Just genuine human connection through WhatsApp.
</p>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Start Building Customer Loyalty Today</h2>

<p class="text-slate-600 leading-relaxed mb-6">
You don't need a fancy CRM or an expensive marketing team. With WhatsApp and a free <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a> store, you already have everything you need to create a loyal customer base that orders from you again and again.
</p>

<div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8">
<h3 class="text-2xl font-bold mb-3">Your Customers Are on WhatsApp. Are You?</h3>
<p class="text-indigo-100 mb-6">Create your free digital menu, take orders via WhatsApp, and start building real customer relationships today.</p>
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
