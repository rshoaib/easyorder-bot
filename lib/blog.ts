
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
    }
];

export async function getPost(slug: string): Promise<BlogPost | undefined> {
    return blogPosts.find(post => post.slug === slug);
}

export async function getAllPosts(): Promise<BlogPost[]> {
    return blogPosts;
}
