
export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    coverImage?: string;
    content: string; // Storing as HTML/JSX string for simplicity in MVP
}

export const blogPosts: BlogPost[] = [
    {
        slug: "how-to-customize-store-branding",
        title: "How to Customize Your Store Branding",
        excerpt: "Learn how to make your OrderViaChat store stand out with your own logo and brand colors.",
        date: "2026-01-25",
        author: "OrderViaChat Team",
        category: "Guide",
        coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2600&auto=format&fit=crop",
        content: `
            <p class="mb-6 text-xl text-slate-600 leading-relaxed">Standing out is crucial for any business. With our new <strong>Branding Features</strong>, you can now personalize your store to match your identity.</p>
            
            <div class="my-10 bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
                <h3 class="font-bold text-indigo-900 mb-2">Why Branding Matters?</h3>
                <p class="text-indigo-700">A consistent brand look builds trust. Stores with logos and custom colors see up to <strong>40% higher conversion rates</strong>.</p>
            </div>

            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">Step 1: Access Store Settings</h2>
            <p class="mb-4 text-lg">Log in to your <strong>Admin Dashboard</strong> and navigate to the <strong>Settings</strong> tab. You'll see a new section called "Brand Identity".</p>
            <div class="my-8 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img src="/images/blog/admin-brand-settings.png" alt="Admin settings showing Brand Identity section" class="w-full h-auto bg-slate-100" />
                <div class="bg-slate-50 p-3 text-center text-sm text-slate-500">Navigate to Settings > Brand Identity</div>
            </div>
            
            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">Step 2: Upload Your Logo</h2>
            <p class="mb-4 text-lg">Click on the file upload area to select your business logo. For best results, use a square image (PNG or JPG) with a transparent background.</p>
            <div class="my-8 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <div class="aspect-video bg-slate-100 flex items-center justify-center text-slate-400">
                    <!-- Re-using the admin screenshot as it shows the upload area, or we can crop it later. For now, referencing the same context. -->
                    <img src="/images/blog/admin-brand-settings.png" alt="Logo Upload Area" class="w-full h-auto object-cover object-left-top h-[300px]" style="object-position: center bottom;" />
                </div>
                <div class="bg-slate-50 p-3 text-center text-sm text-slate-500">The new Brand Identity section</div>
            </div>
            
            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">Step 3: Choose Your Brand Color</h2>
            <p class="mb-4 text-lg">Your primary color will be used for buttons, badges, and accents across your store. You can:</p>
            <ul class="list-disc pl-6 mb-6 space-y-2 text-lg">
                <li>Pick from our curated palette using the color swatches.</li>
                <li>Enter a custom HEX code (e.g., <code class="bg-slate-100 px-2 py-1 rounded">#FF5733</code>) to match your exact brand color.</li>
            </ul>

            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">Step 4: Save & Publish</h2>
            <p class="mb-6 text-lg">Click "Save Branding" and visit your storefront link. You'll see your logo in the header and your colors applied instantly!</p>
            
            <div class="my-8 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img src="/images/blog/storefront-branded.png" alt="Branded Storefront Example" class="w-full h-auto" />
                <div class="bg-slate-50 p-3 text-center text-sm text-slate-500">Your live store with custom logo and colors</div>
            </div>
            
            <div class="flex items-center gap-4 p-6 bg-green-50 rounded-xl border border-green-100">
                <div class="text-3xl">🎉</div>
                <div>
                    <h4 class="font-bold text-green-900">Pro Tip</h4>
                    <p class="text-green-700">Test your new look on mobile! Most customers will order from their phones.</p>
                </div>
            </div>
        `
    },
    {
        slug: "simplify-orders-home-food-business",
        title: "Simplify Orders for Your Home Food Business",
        excerpt: "Stop managing orders manually. Discover how WhatsApp ordering can save you hours every week.",
        date: "2026-01-24",
        author: "Riz",
        category: "Marketing",
        coverImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2900&auto=format&fit=crop",
        content: `
            <p class="mb-6 text-xl text-slate-600 leading-relaxed">Are you a home baker or cloud kitchen owner tired of "DM for price"? You are not alone. Managing orders through chat can be a nightmare.</p>
            
            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">The Problem with DMs</h2>
            <p class="mb-4 text-lg">Taking orders via Instagram DM or WhatsApp chat is:</p>
            <ul class="list-disc pl-6 mb-8 space-y-3 text-lg">
                <li><strong>Messy:</strong> You lose track of who ordered what in a sea of chats.</li>
                <li><strong>Time-consuming:</strong> You repeat the same menu details 100 times a day.</li>
                <li><strong>Prone to Errors:</strong> "Wait, did you want the chocolate or vanilla?" leads to unhappy customers.</li>
            </ul>

            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">The Solution: OrderViaChat</h2>
            <p class="mb-6 text-lg">OrderViaChat gives you a <strong>professional digital menu</strong> link that works like magic.</p>
            
            <div class="grid md:grid-cols-3 gap-6 my-10">
                <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                    <div class="text-4xl mb-4">🔗</div>
                    <h3 class="font-bold mb-2">1. Share Link</h3>
                    <p class="text-sm text-slate-500">Put your store link in your Instagram Bio.</p>
                </div>
                <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                    <div class="text-4xl mb-4">🛒</div>
                    <h3 class="font-bold mb-2">2. Browse & Add</h3>
                    <p class="text-sm text-slate-500">Customers choose items and add variations.</p>
                </div>
                <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                    <div class="text-4xl mb-4">✅</div>
                    <h3 class="font-bold mb-2">3. Auto-Format</h3>
                    <p class="text-sm text-slate-500">You receive a perfect WhatsApp text.</p>
                </div>
            </div>
            
            <p class="mb-6 text-lg"><strong>The Result?</strong> You get a perfectly formatted WhatsApp message with the exact order, total price, and customer details. No more back-and-forth!</p>

            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl text-white my-12 text-center shadow-xl">
                <h3 class="text-2xl font-bold mb-4">Ready to save 10+ hours a week?</h3>
                <p class="mb-8 text-indigo-100">Join thousands of home businesses automating their sales today.</p>
                <a href="/register" class="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-lg">Create your free store &rarr;</a>
            </div>
        `
    },
    {
        slug: "stop-paying-commission-fees",
        title: "Stop Paying 30% Commissions to Delivery Apps",
        excerpt: " Delivery apps are eating your profits. Here is how to take back control with your own direct ordering system.",
        date: "2026-01-29",
        author: "OrderViaChat Team",
        category: "Profitability",
        coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2600&auto=format&fit=crop",
        content: `
            <p class="mb-6 text-xl text-slate-600 leading-relaxed">If you sell $1000 of food on a delivery app, you might only keep $700. For small businesses operating on thin margins, that 30% cut is the difference between survival and success.</p>
            
            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">The "Convenience" Trap</h2>
            <p class="mb-4 text-lg">Apps promise exposure, but they charge for it. They also own <strong>your customer data</strong>. You don't know who ordered, so you can't market to them again.</p>
            
            <div class="my-10 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                <h3 class="font-bold text-red-900 mb-2">The Real Cost</h3>
                <p class="text-red-700">Commission Fees + Marketing Fees + Service Fees = <strong>Bleeding Profits</strong>.</p>
            </div>

            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">The Direct Ordering Alternative</h2>
            <p class="mb-4 text-lg">With <strong>OrderViaChat</strong>, you get your own branded store link. You pay <strong>0% commission</strong> on orders.</p>
            <ul class="list-disc pl-6 mb-6 space-y-2 text-lg">
                <li>Keep 100% of your sales.</li>
                <li>Own your customer relationships.</li>
                <li>Build your own brand, not the app's brand.</li>
            </ul>

            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">How to Switch Customers Over?</h2>
            <p class="mb-4 text-lg">It's easier than you think:</p>
            <ol class="list-decimal pl-6 mb-6 space-y-2 text-lg">
                <li>Put a simplified "Direct Order" menu in your bag staples.</li>
                <li>Offer a "10% OFF" coupon for their next direct order (you still save money vs. commission!).</li>
                <li>Share your OrderViaChat link on Instagram and WhatsApp.</li>
            </ol>
            
            <div class="bg-indigo-900 text-white p-8 rounded-2xl mt-12 text-center">
                <h3 class="text-2xl font-bold mb-4">Calculate Your Savings</h3>
                <p class="mb-6">Switching just 10 customers a day to direct ordering can save you over <strong>$1000/month</strong>.</p>
                <a href="/register" class="inline-block bg-white text-indigo-900 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">Start Saving Today</a>
            </div>
        `
    },
    {
        slug: "build-menu-seconds-ai-generator",
        title: "Build Your Online Menu in 10 Seconds with AI",
        excerpt: "Dreading the setup process? Our new AI Magic Generator creates your entire store from a single sentence.",
        date: "2026-01-30",
        author: "Tech Team",
        category: "Product Update",
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2600&auto=format&fit=crop",
        content: `
            <p class="mb-6 text-xl text-slate-600 leading-relaxed">"I don't have time to type out 50 items." We heard you. That's why we built the <strong>AI Menu Generator</strong>.</p>
            
            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">How it Works</h2>
            <p class="mb-4 text-lg">It's really simple:</p>
            <ol class="list-decimal pl-6 mb-6 space-y-2 text-lg">
                <li>Sign up for a new store.</li>
                <li>Type what you sell (e.g., "Vegan Bakery in Austin").</li>
                <li><strong>Magic happens.</strong></li>
            </ol>
            
            <div class="my-8 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <!-- Placeholder for GIF/Video in future -->
                <div class="bg-slate-100 p-12 text-center font-mono text-slate-400">
                    [AI Generating Menu...]
                </div>
                <div class="bg-indigo-50 p-4 text-center text-sm text-indigo-700 font-bold">
                    🚀 Generates Items, Descriptions, and Prices instantly.
                </div>
            </div>

            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">Why Use AI?</h2>
            <p class="mb-4 text-lg">It's not just about speed. The AI writes <strong>mouth-watering descriptions</strong> that sell better than "Burger - $10".</p>
            <p class="mb-4 text-lg"><em>"Juicy grass-fed beef patty topped with melted cheddar, crisp lettuce, and our secret sauce on a toasted brioche bun."</em> - The AI writes this for you.</p>

            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">Try it Free</h2>
            <p class="mb-6 text-lg">You don't need to be tech-savvy. If you can text, you can build a store. </p>
            
             <a href="/register" class="block w-full text-center bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Try the AI Generator Now &rarr;
            </a>
        `
    },
    {
        slug: "why-cafe-needs-qr-menu",
        title: "Why Your Coffee Shop Needs a QR Menu",
        excerpt: "Physical menus are expensive, dirty, and hard to update. Switch to a dynamic QR code system today.",
        date: "2026-01-30",
        author: "Riz",
        category: "Marketing",
        coverImage: "https://images.unsplash.com/photo-1595079676614-789e02a46b2f?q=80&w=2600&auto=format&fit=crop",
        content: `
            <p class="mb-6 text-xl text-slate-600 leading-relaxed">The paper menu is dying. It's time to embrace the <strong>QR Code Revolution</strong>.</p>
            
            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">1. Instant Updates</h2>
            <p class="mb-4 text-lg">Ran out of Avocados? With a paper menu, you have to tell every waiter or use an ugly marker. With a digital QR menu, you just toggle it "Off" in your dashboard. Boom. Done.</p>
            
            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">2. It's Cleaner</h2>
            <p class="mb-4 text-lg">Post-2020, nobody likes touching a sticky laminated menu. A QR code on the table is contactless and hygienic.</p>
            
            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">3. Faster Ordering</h2>
            <p class="mb-4 text-lg">Customers can browse photos of your food instantly on their phone. Visuals increase appetite and order size.</p>

            <h2 class="text-3xl font-bold mt-12 mb-6 text-slate-900">Get Your Free QR Code</h2>
            <p class="mb-4 text-lg">Our <strong>Marketing Hub</strong> now lets you generate a high-quality QR code for your store in one click.</p>
            <ul class="list-disc pl-6 mb-8 space-y-2 text-lg">
                <li>Log in to your Admin Dashboard.</li>
                <li>Go to <strong>Marketing</strong>.</li>
                <li>Download your Code.</li>
                <li>Print it and stick it on your tables!</li>
            </ul>
            
            <div class="border-2 border-dashed border-indigo-200 bg-indigo-50 p-8 rounded-2xl text-center">
                 <h3 class="font-bold text-indigo-900 mb-2">Need a demo?</h3>
                 <p class="mb-4 text-indigo-700">See how it works at our Journey Cafe.</p>
                 <a href="/store/journey-cafe" class="text-indigo-600 underline font-bold">Visit Demo Store</a>
            </div>
        `
    }
];

export async function getPost(slug: string): Promise<BlogPost | undefined> {
    return blogPosts.find(post => post.slug === slug);
}

export async function getAllPosts(): Promise<BlogPost[]> {
    return blogPosts;
}
