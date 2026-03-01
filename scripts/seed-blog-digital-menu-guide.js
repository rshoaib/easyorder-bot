/**
 * Content Pipeline: Insert blog post
 * "How to Create a Digital Menu with QR Code for Your Restaurant in 2026"
 * 
 * Run: node scripts/seed-blog-digital-menu-guide.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const post = {
    slug: 'create-digital-menu-qr-code-restaurant',
    title: 'How to Create a Digital Menu with QR Code for Your Restaurant in 2026',
    excerpt: 'Paper menus are outdated and expensive to reprint. Learn how to create a free digital menu with a QR code in under 5 minutes — no coding or design skills needed.',
    date: '2026-03-01',
    author: 'OrderViaChat Team',
    category: 'Tutorial',
    cover_image: null,
    is_published: true,
    content: `
<p class="text-lg text-slate-600 leading-relaxed mb-8">
Here's a fact that might surprise you: <strong>92% of customers look up a restaurant's menu online before deciding where to eat</strong>. If your menu is a blurry photo on Facebook or a PDF that's impossible to read on mobile, you're losing customers before they even walk through the door.
</p>

<p class="text-slate-600 leading-relaxed mb-8">
The good news? Creating a professional digital menu with a QR code is now <strong>completely free</strong> and takes less than 5 minutes. In this step-by-step guide, we'll show you exactly how to do it using <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a> — and how to turn that menu into an ordering machine that sends orders straight to your WhatsApp.
</p>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">What Is a Digital Menu (And Why You Need One)?</h2>

<p class="text-slate-600 leading-relaxed mb-4">
A digital menu is an online version of your restaurant's menu that customers can access from any smartphone, tablet, or computer. Unlike a paper menu or a static PDF, a digital menu is:
</p>

<div class="grid md:grid-cols-2 gap-4 mb-8">
<div class="bg-blue-50 border border-blue-200 rounded-xl p-5">
<h3 class="font-bold text-blue-800 mb-2">📱 Mobile-Optimized</h3>
<p class="text-blue-700 text-sm">Looks perfect on any phone screen — no pinching or zooming required. Your customers can browse with one thumb.</p>
</div>
<div class="bg-purple-50 border border-purple-200 rounded-xl p-5">
<h3 class="font-bold text-purple-800 mb-2">🔄 Instantly Updatable</h3>
<p class="text-purple-700 text-sm">Change a price, add a seasonal dish, or mark something as "sold out" in seconds. No reprinting costs.</p>
</div>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
<h3 class="font-bold text-emerald-800 mb-2">🛒 Integrated with Ordering</h3>
<p class="text-emerald-700 text-sm">Customers don't just browse — they tap to add items to a cart and place an order directly through WhatsApp.</p>
</div>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-5">
<h3 class="font-bold text-amber-800 mb-2">📊 Trackable</h3>
<p class="text-amber-700 text-sm">See what items get the most views, what's popular, and track every order from your admin dashboard.</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">5 Benefits of Having a QR Code Menu</h2>

<p class="text-slate-600 leading-relaxed mb-4">
QR code menus aren't just a COVID-era trend — they're the new standard. Here's why restaurants around the world are making the permanent switch:
</p>

<div class="space-y-4 mb-8">
<div class="bg-white border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-1">1. 💰 Save Thousands on Printing</h3>
<p class="text-slate-500 text-sm">The average restaurant spends $500–$2,000/year on menu printing. With a digital menu, your printing cost drops to zero. Update your menu 100 times a day if you want — it's always free.</p>
</div>

<div class="bg-white border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-1">2. ⚡ Update Prices and Items Instantly</h3>
<p class="text-slate-500 text-sm">Ingredient prices went up? Out of a dish? Running a weekend special? Update your menu in real-time from your phone — changes appear immediately for all customers.</p>
</div>

<div class="bg-white border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-1">3. 📸 Show Off Your Food with Photos</h3>
<p class="text-slate-500 text-sm">A picture is worth a thousand orders. Digital menus let you add high-quality photos of every dish — something paper menus can never do as beautifully.</p>
</div>

<div class="bg-white border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-1">4. 🧼 More Hygienic & Professional</h3>
<p class="text-slate-500 text-sm">No more sticky, torn menus. Customers scan a QR code with their own phone — cleaner for them, more professional for you.</p>
</div>

<div class="bg-white border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-1">5. 🌍 Accessible 24/7 from Anywhere</h3>
<p class="text-slate-500 text-sm">Your menu lives at a URL anyone can access — from social media, Google search, a shared WhatsApp link, or a flyer in the neighborhood.</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Step-by-Step: Create Your Digital Menu in 5 Minutes</h2>

<p class="text-slate-600 leading-relaxed mb-6">
No coding skills required. No design experience needed. Just follow these 4 steps using <a href="https://orderviachat.com" class="text-indigo-600 font-semibold hover:underline">OrderViaChat</a>:
</p>

<div class="space-y-4 mb-8">
<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
<div>
<h3 class="font-bold text-slate-900">Sign Up for Free</h3>
<p class="text-slate-500 text-sm">Visit <a href="https://orderviachat.com/register" class="text-indigo-600 font-semibold hover:underline">orderviachat.com/register</a> and create your account. No credit card required. No monthly fees. No hidden charges — it's completely free, forever.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
<div>
<h3 class="font-bold text-slate-900">Add Your Menu Items</h3>
<p class="text-slate-500 text-sm">Add your products with photos, prices, and descriptions. Organize them into categories like "Appetizers," "Main Course," "Desserts," and "Drinks." <strong>Pro tip:</strong> Use the AI Menu Generator — just describe your restaurant type and our AI creates your entire menu in seconds.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
<div>
<h3 class="font-bold text-slate-900">Customize Your Store</h3>
<p class="text-slate-500 text-sm">Upload your logo, set your brand colors, add a banner image, and enter your WhatsApp number. Your store will look like a professional mobile app with your own branding — not a generic template.</p>
</div>
</div>

<div class="flex gap-4 items-start bg-white border border-slate-200 rounded-xl p-5">
<div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
<div>
<h3 class="font-bold text-slate-900">Share Your Link & QR Code</h3>
<p class="text-slate-500 text-sm">Your store is instantly live at a URL like <strong>orderviachat.com/store/yourname</strong>. Generate a QR code from your admin dashboard and you're ready to go — print it, post it, share it everywhere.</p>
</div>
</div>
</div>

<div class="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
<h3 class="font-bold text-indigo-800 mb-2">💡 That's it!</h3>
<p class="text-indigo-700 text-sm">When customers scan your QR code or click your link, they see your beautiful digital menu. They browse, add items to their cart, and tap "Order via WhatsApp." You receive a clean, formatted order message — no messy back-and-forth chats.</p>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Where to Put Your QR Code (7 Best Places)</h2>

<p class="text-slate-600 leading-relaxed mb-4">
A QR code is only useful if people actually scan it. Here are the most effective places to display your digital menu QR code:
</p>

<div class="overflow-x-auto mb-8">
<table class="w-full border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
<thead>
<tr class="bg-slate-50">
<th class="text-left p-4 font-bold text-slate-900 border-b">#</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">Location</th>
<th class="text-left p-4 font-bold text-slate-900 border-b">Why It Works</th>
</tr>
</thead>
<tbody>
<tr class="border-b">
<td class="p-4 text-indigo-600 font-bold">1</td>
<td class="p-4 font-semibold text-slate-700">Table Tent Cards</td>
<td class="p-4 text-slate-500 text-sm">Customers scan while seated — perfect for dine-in ordering</td>
</tr>
<tr class="border-b bg-slate-50/50">
<td class="p-4 text-indigo-600 font-bold">2</td>
<td class="p-4 font-semibold text-slate-700">Front Window / Door</td>
<td class="p-4 text-slate-500 text-sm">Passersby can browse your menu before entering</td>
</tr>
<tr class="border-b">
<td class="p-4 text-indigo-600 font-bold">3</td>
<td class="p-4 font-semibold text-slate-700">Instagram Bio</td>
<td class="p-4 text-slate-500 text-sm">Convert social media followers into customers instantly</td>
</tr>
<tr class="border-b bg-slate-50/50">
<td class="p-4 text-indigo-600 font-bold">4</td>
<td class="p-4 font-semibold text-slate-700">Google Business Profile</td>
<td class="p-4 text-slate-500 text-sm">Your menu link shows up when people search for your restaurant</td>
</tr>
<tr class="border-b">
<td class="p-4 text-indigo-600 font-bold">5</td>
<td class="p-4 font-semibold text-slate-700">Delivery Packaging</td>
<td class="p-4 text-slate-500 text-sm">"Scan to reorder directly" — turns one-time buyers into repeat customers</td>
</tr>
<tr class="border-b bg-slate-50/50">
<td class="p-4 text-indigo-600 font-bold">6</td>
<td class="p-4 font-semibold text-slate-700">Flyers & Business Cards</td>
<td class="p-4 text-slate-500 text-sm">Distribute in your neighborhood for local marketing</td>
</tr>
<tr>
<td class="p-4 text-indigo-600 font-bold">7</td>
<td class="p-4 font-semibold text-slate-700">WhatsApp Status</td>
<td class="p-4 text-slate-500 text-sm">Share your menu link with all your contacts — 98% open rate</td>
</tr>
</tbody>
</table>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Pro Tips to Maximize Orders from Your Digital Menu</h2>

<p class="text-slate-600 leading-relaxed mb-4">
Having a digital menu is step one. Here's how to make it a revenue machine:
</p>

<div class="grid md:grid-cols-2 gap-4 mb-8">
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">📸 Use Real Photos</h3>
<p class="text-green-700 text-sm">Menus with photos get <strong>30% more orders</strong> than menus without. Use natural lighting and take photos from above (bird's-eye view) for the most appetizing shots.</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">✨ Write Short Descriptions</h3>
<p class="text-green-700 text-sm">Don't just write "Chicken Burger." Try "Grilled chicken with melted cheddar, house sauce & crispy onions." Descriptive names increase perceived value.</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">🏷️ Organize by Category</h3>
<p class="text-green-700 text-sm">Group items logically: Starters → Mains → Sides → Desserts → Drinks. Make it easy for customers to find what they're craving.</p>
</div>
<div class="bg-green-50 border border-green-200 rounded-xl p-5">
<h3 class="font-bold text-green-800 mb-2">⭐ Highlight Best Sellers</h3>
<p class="text-green-700 text-sm">Mark your most popular items or chef's specials. Social proof drives orders — if other people love it, new customers will try it too.</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Digital Menu vs Paper Menu: The Comparison</h2>

<div class="overflow-x-auto mb-8">
<table class="w-full border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
<thead>
<tr class="bg-slate-50">
<th class="text-left p-4 font-bold text-slate-900 border-b">Feature</th>
<th class="text-left p-4 font-bold text-red-600 border-b">📄 Paper Menu</th>
<th class="text-left p-4 font-bold text-green-600 border-b">📱 Digital Menu</th>
</tr>
</thead>
<tbody>
<tr class="border-b">
<td class="p-4 font-semibold text-slate-700">Cost to update</td>
<td class="p-4 text-red-600">$200–$500+ per reprint</td>
<td class="p-4 text-green-600 font-bold">$0 — update anytime</td>
</tr>
<tr class="border-b bg-slate-50/50">
<td class="p-4 font-semibold text-slate-700">Photos</td>
<td class="p-4 text-red-600">Expensive to print in color</td>
<td class="p-4 text-green-600 font-bold">Unlimited, free</td>
</tr>
<tr class="border-b">
<td class="p-4 font-semibold text-slate-700">Accessibility</td>
<td class="p-4 text-red-600">In-restaurant only</td>
<td class="p-4 text-green-600 font-bold">Anywhere, 24/7</td>
</tr>
<tr class="border-b bg-slate-50/50">
<td class="p-4 font-semibold text-slate-700">Ordering capability</td>
<td class="p-4 text-red-600">No — customer must call/visit</td>
<td class="p-4 text-green-600 font-bold">Yes — orders via WhatsApp</td>
</tr>
<tr class="border-b">
<td class="p-4 font-semibold text-slate-700">Speed to update</td>
<td class="p-4 text-red-600">Days/weeks</td>
<td class="p-4 text-green-600 font-bold">Seconds</td>
</tr>
<tr>
<td class="p-4 font-semibold text-slate-700">Hygiene</td>
<td class="p-4 text-red-600">Shared, hard to clean</td>
<td class="p-4 text-green-600 font-bold">Contactless — customer's own phone</td>
</tr>
</tbody>
</table>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Frequently Asked Questions</h2>

<div class="space-y-4 mb-8">
<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-1">Is it really free?</h3>
<p class="text-slate-500 text-sm">Yes. OrderViaChat is 100% free — no monthly fees, no commission per order, no hidden charges. You keep every dollar of every sale.</p>
</div>
<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-1">Do my customers need to download an app?</h3>
<p class="text-slate-500 text-sm">No. Customers simply scan a QR code or tap a link. Your store opens in their browser — it looks like a native app but requires zero downloads.</p>
</div>
<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-1">Can I update my menu after creating it?</h3>
<p class="text-slate-500 text-sm">Absolutely. You can add, edit, or remove items anytime from your admin dashboard. Changes appear instantly — no need to regenerate or reprint anything.</p>
</div>
<div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
<h3 class="font-bold text-slate-900 mb-1">Does it work for non-restaurant businesses?</h3>
<p class="text-slate-500 text-sm">Yes! Bakeries, grocery stores, flower shops, electronics retailers, clothing boutiques — any business that sells products can use OrderViaChat.</p>
</div>
</div>

<h2 class="text-2xl font-bold text-slate-900 mt-12 mb-4">Ready to Go Digital?</h2>

<p class="text-slate-600 leading-relaxed mb-6">
Paper menus cost money to print, are impossible to update quickly, and don't let customers order remotely. A digital menu with a QR code solves all three problems — and with OrderViaChat, it's completely free to set up.
</p>

<div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8">
<h3 class="text-2xl font-bold mb-3">Create Your Free Digital Menu</h3>
<p class="text-indigo-100 mb-6">Set up your restaurant's digital menu in under 5 minutes. Free forever — no catch.</p>
<a href="https://orderviachat.com/register" class="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg">Get Started Free →</a>
</div>

<p class="text-slate-500 text-sm italic">
OrderViaChat is a free platform that helps restaurants and small businesses create professional digital menus, generate QR codes, and receive orders directly via WhatsApp — with zero commissions, zero monthly fees, and zero hidden charges.
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
