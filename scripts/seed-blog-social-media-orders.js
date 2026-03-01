/**
 * Content Pipeline: Insert blog post
 * "How to Use Instagram and Social Media to Drive WhatsApp Orders for Your Business in 2026"
 * 
 * Run: node scripts/seed-blog-social-media-orders.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const post = {
    slug: 'social-media-whatsapp-orders',
    title: 'How to Use Instagram and Social Media to Drive WhatsApp Orders for Your Business in 2026',
    excerpt: 'Your next customer is scrolling Instagram right now. Learn how to turn social media followers into paying WhatsApp orders with proven strategies for Instagram, Facebook, TikTok, and WhatsApp Status.',
    date: '2026-03-01',
    author: 'OrderViaChat Team',
    category: 'Growth',
    cover_image: null,
    is_published: true,
    content: `
<p class="text-lg text-slate-600 leading-relaxed mb-8">
Here's a fact that should change how you think about marketing: <strong>over 70% of consumers discover new restaurants and food businesses on social media.</strong> Not Google. Not word of mouth. Instagram, TikTok, and Facebook are where your next customers are making decisions about what to eat tonight.
</p>

<p class="text-slate-600 leading-relaxed mb-8">
But here's the problem — most small businesses post beautiful food photos and then... nothing happens. Followers like the post, maybe leave a comment, and scroll on. There's no clear path from "wow that looks delicious" to "I just placed an order."
</p>

<p class="text-slate-600 leading-relaxed mb-8">
That's where the <strong>Social Media → WhatsApp ordering</strong> funnel changes everything. In this guide, we'll show you exactly how to turn your social media presence into a 24/7 order-generating machine — without spending a single dollar on ads.
</p>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">The Social Media → WhatsApp Funnel (How It Works)</h2>

<p class="text-slate-600 leading-relaxed mb-4">
The concept is simple but powerful. Instead of hoping followers will somehow find your menu, you create a direct path:
</p>

<div class="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-indigo-800 mb-3">🔄 The 4-Step Conversion Funnel</h3>
<ol class="space-y-3 text-indigo-700">
<li><strong>1. ATTRACT</strong> — Post mouth-watering content on Instagram/TikTok/Facebook</li>
<li><strong>2. DIRECT</strong> — Include your ordering link in bio, stories, and captions</li>
<li><strong>3. CONVERT</strong> — Customer taps link → browses your digital menu → builds a cart</li>
<li><strong>4. ORDER</strong> — Full order details are sent directly to your WhatsApp. Zero commission.</li>
</ol>
<p class="mt-4 font-semibold text-indigo-800">Result: Every social media post becomes a potential sale — not just a vanity metric.</p>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">📸 Instagram Strategy: Your #1 Order Driver</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Instagram is the undisputed king for food businesses. 90% of Instagram users follow at least one business account, and food content consistently gets 3x more engagement than other categories. Here's how to maximize it:
</p>

<div class="space-y-4 mb-8">
<div class="bg-pink-50 border border-pink-200 rounded-xl p-5">
<h3 class="font-bold text-pink-800 mb-2">1. 🔗 Optimize Your Bio Link</h3>
<p class="text-pink-700 text-sm">Your Instagram bio is the most valuable real estate you have. Replace "DM to order" with a direct link to your digital menu: <strong>orderviachat.com/store/yourname</strong>. Add a clear CTA like "📲 Order directly from our menu ⬇️"</p>
</div>

<div class="bg-pink-50 border border-pink-200 rounded-xl p-5">
<h3 class="font-bold text-pink-800 mb-2">2. 📖 Use Stories with "Order Now" Stickers</h3>
<p class="text-pink-700 text-sm">Post daily Stories showing today's specials, kitchen prep, or customer reviews. Add a link sticker pointing to your ordering page. Stories have a 24-hour urgency that drives action — <strong>"Today only: Free delivery on orders over $20!"</strong></p>
</div>

<div class="bg-pink-50 border border-pink-200 rounded-xl p-5">
<h3 class="font-bold text-pink-800 mb-2">3. 🎬 Reels = Free Advertising</h3>
<p class="text-pink-700 text-sm">Short-form video is Instagram's most pushed format. Film 15-second clips: cheese pulls, sizzling pans, plating close-ups, or "packing your order" videos. Add trending audio and end with <strong>"Link in bio to order 👆"</strong>. One viral Reel can bring hundreds of new customers.</p>
</div>

<div class="bg-pink-50 border border-pink-200 rounded-xl p-5">
<h3 class="font-bold text-pink-800 mb-2">4. 📌 Create an "Order" Highlight</h3>
<p class="text-pink-700 text-sm">Pin a Story Highlight called "📲 ORDER" at the front of your profile. Include your menu link, operating hours, delivery area, and payment methods. New visitors can find how to order in one tap.</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">👍 Facebook Strategy: Reach the Locals</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Facebook may not be as trendy, but it's still where local communities are most active. Over 1.8 billion people use Facebook Groups daily — and your neighborhood food group is a goldmine.
</p>

<div class="space-y-4 mb-8">
<div class="bg-blue-50 border border-blue-200 rounded-xl p-5">
<h3 class="font-bold text-blue-800 mb-2">1. 📍 Set Up Your Page CTA</h3>
<p class="text-blue-700 text-sm">Go to your Facebook Business Page and set the main CTA button to "Order Food" or "Shop Now" — link it directly to your digital menu page. Every page visitor sees this button prominently.</p>
</div>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5">
<h3 class="font-bold text-blue-800 mb-2">2. 🏘️ Join Local Community Groups</h3>
<p class="text-blue-700 text-sm">Search for groups like "[Your City] Foodies" or "[Your Neighborhood] Community." Share weekly specials with your ordering link. Be genuine — don't just spam. Share kitchen stories, ask for feedback, and build relationships.</p>
</div>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5">
<h3 class="font-bold text-blue-800 mb-2">3. 📅 Post Consistently</h3>
<p class="text-blue-700 text-sm">Share 3-4 times per week: a photo of your best dish, a behind-the-scenes video, a customer testimonial, or a weekend special announcement. Always end with your ordering link.</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">🎵 TikTok Strategy: Go Viral, Get Orders</h2>

<p class="text-slate-600 leading-relaxed mb-4">
TikTok's algorithm doesn't care how many followers you have — it cares about <em>content quality</em>. A restaurant with 50 followers can get 500,000 views on a single video. That's the power of TikTok for small food businesses.
</p>

<div class="space-y-4 mb-8">
<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-2">🔥 Content Ideas That Go Viral</h3>
<ul class="space-y-2 text-slate-700 text-sm">
<li>• <strong>"POV: You ordered from our menu"</strong> — Show the unboxing/delivery experience</li>
<li>• <strong>"How we make our bestseller"</strong> — Behind-the-scenes kitchen process</li>
<li>• <strong>"Packing orders at 2 AM"</strong> — Show the hustle (audiences love authenticity)</li>
<li>• <strong>"Rating our own menu items"</strong> — Fun, personal, and showcases your products</li>
<li>• <strong>Trending sound + food montage</strong> — Ride the algorithm wave</li>
</ul>
</div>

<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
<h3 class="font-bold text-emerald-800 mb-2">💡 TikTok Pro Tip</h3>
<p class="text-emerald-700 text-sm">Add your ordering link to your TikTok bio and mention it in every video: <strong>"Link in bio to order — we deliver!"</strong> TikTok users are impulse buyers — if they see delicious food at midnight, they want to order it NOW.</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">💬 WhatsApp Status: The Secret Weapon (98% Open Rate)</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Everyone talks about Instagram and TikTok, but <strong>WhatsApp Status is the most underrated marketing channel for small businesses.</strong> Here's why:
</p>

<div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-green-800 mb-3">📊 WhatsApp Status vs Other Channels</h3>
<ul class="space-y-2 text-green-700">
<li>• <strong>WhatsApp Status:</strong> 98% open rate — almost everyone who has your number sees it</li>
<li>• <strong>Instagram Stories:</strong> 5-10% of followers see it</li>
<li>• <strong>Email Newsletter:</strong> 20% open rate on a good day</li>
<li>• <strong>Facebook Post:</strong> 2-5% organic reach</li>
</ul>
<p class="mt-4 font-semibold text-green-800">If you have 500 customer phone numbers, a WhatsApp Status reaches ~490 of them. For free.</p>
</div>

<div class="space-y-4 mb-8">
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">📋 Daily WhatsApp Status Playbook</h3>
<ul class="space-y-2 text-green-700 text-sm">
<li>• <strong>10 AM:</strong> Post today's special with a photo and your ordering link</li>
<li>• <strong>12 PM:</strong> "Lunch orders closing in 30 min! 🔥" — Create urgency</li>
<li>• <strong>5 PM:</strong> Behind-the-scenes prep for dinner + ordering link</li>
<li>• <strong>8 PM:</strong> Customer review screenshot or a "Thank you" to today's customers</li>
</ul>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">📅 The Weekly Content Calendar</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Consistency beats perfection. Here's a simple weekly plan that takes less than 30 minutes per day:
</p>

<div class="overflow-x-auto mb-8">
<table class="w-full border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
<thead>
<tr class="bg-slate-50">
<th class="text-left p-4 font-bold text-slate-900 border-b">Day</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">Content Type</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">Platform</th>
</tr>
</thead>
<tbody>
<tr class="border-b">
<td class="p-4 font-semibold text-slate-700">Monday</td>
<td class="p-4 text-slate-600">Weekly special announcement</td>
<td class="p-4 text-indigo-600 font-medium">All platforms</td>
</tr>
<tr class="border-b bg-slate-50/50">
<td class="p-4 font-semibold text-slate-700">Tuesday</td>
<td class="p-4 text-slate-600">Behind-the-scenes kitchen video</td>
<td class="p-4 text-indigo-600 font-medium">Reels + TikTok</td>
</tr>
<tr class="border-b">
<td class="p-4 font-semibold text-slate-700">Wednesday</td>
<td class="p-4 text-slate-600">Customer review / testimonial</td>
<td class="p-4 text-indigo-600 font-medium">Stories + Facebook</td>
</tr>
<tr class="border-b bg-slate-50/50">
<td class="p-4 font-semibold text-slate-700">Thursday</td>
<td class="p-4 text-slate-600">Food close-up / plating video</td>
<td class="p-4 text-indigo-600 font-medium">Reels + TikTok</td>
</tr>
<tr class="border-b">
<td class="p-4 font-semibold text-slate-700">Friday</td>
<td class="p-4 text-slate-600">Weekend menu + "Order now" CTA</td>
<td class="p-4 text-indigo-600 font-medium">All platforms</td>
</tr>
<tr class="border-b bg-slate-50/50">
<td class="p-4 font-semibold text-slate-700">Saturday</td>
<td class="p-4 text-slate-600">"Packing your orders" time-lapse</td>
<td class="p-4 text-indigo-600 font-medium">Stories + TikTok</td>
</tr>
<tr>
<td class="p-4 font-semibold text-slate-700">Sunday</td>
<td class="p-4 text-slate-600">Thank you post + week ahead teaser</td>
<td class="p-4 text-indigo-600 font-medium">All platforms</td>
</tr>
</tbody>
</table>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">⚡ Quick Wins: Start Getting Orders Today</h2>

<p class="text-slate-600 leading-relaxed mb-4">
You don't need 10,000 followers to start getting social media orders. Here are 5 things you can do <em>right now</em>:
</p>

<div class="space-y-3 mb-8">
<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
<div>
<h3 class="font-bold text-slate-900">Create your free digital menu</h3>
<p class="text-slate-500 text-sm">Sign up at <a href="https://orderviachat.com/register" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a> — it takes 2 minutes. Add your products with photos and prices.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
<div>
<h3 class="font-bold text-slate-900">Put your ordering link in every bio</h3>
<p class="text-slate-500 text-sm">Instagram, TikTok, Facebook, WhatsApp Business profile — your link should be everywhere: orderviachat.com/store/yourname</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
<div>
<h3 class="font-bold text-slate-900">Post one Reel or TikTok today</h3>
<p class="text-slate-500 text-sm">Film a 15-second clip of your best dish. Add a trending sound. Caption: "Order this now — link in bio 👆". Done.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
<div>
<h3 class="font-bold text-slate-900">Post a WhatsApp Status right now</h3>
<p class="text-slate-500 text-sm">Take a photo of what you're cooking, add your menu link, and post it. 98% of your contacts will see it within hours.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">5</div>
<div>
<h3 class="font-bold text-slate-900">Create an "ORDER" Instagram Highlight</h3>
<p class="text-slate-500 text-sm">Save a Story with your menu link as a permanent Highlight on your profile. Every new visitor sees it first.</p>
</div>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">The Bottom Line</h2>

<p class="text-slate-600 leading-relaxed mb-6">
Social media is no longer just about brand awareness — it's a <strong>direct sales channel</strong>. The businesses winning in 2026 are the ones who connect every post to a clear ordering path. No more "DM to order." No more "call us." Just a beautiful digital menu that converts followers into customers in 3 taps.
</p>

<p class="text-slate-600 leading-relaxed mb-6">
<strong>The formula is simple: Great content + Ordering link everywhere + Consistency = More orders, zero commission.</strong>
</p>

<div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8">
<h3 class="text-2xl font-bold mb-3">Turn Your Social Media Into a Sales Machine</h3>
<p class="text-indigo-100 mb-6">Create your free digital menu in 2 minutes. Share the link everywhere. Start getting WhatsApp orders today.</p>
<a href="https://orderviachat.com/register" class="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg">Create Your Free Store →</a>
</div>

<p class="text-slate-500 text-sm italic">
OrderViaChat is a free platform that helps restaurants and small businesses create professional digital menus and receive orders directly via WhatsApp — with zero commissions, zero monthly fees, and zero hidden charges.
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
