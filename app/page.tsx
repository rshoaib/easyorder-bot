import Link from "next/link";
import { getTenantRepository } from "@/lib/repository";
import { ArrowRight, CheckCircle2, ShoppingBag, Truck, Smartphone, Star } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const repo = getTenantRepository();
  const tenants = await repo.getAllTenants();

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <ShoppingBag strokeWidth={2.5} />
            <span>EasyOrder</span>
          </div>
          <div className="flex gap-4">
            <Link href="/register">
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm">
                Get Started
            </button>
          </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-white -z-10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 border border-indigo-100">
            <Star size={14} fill="currentColor" />
            <span>Best WhatsApp Ordering System 2026</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Turn WhatsApp into your <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Sales Machine</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create a beautiful digital menu, share the link, and receive orders directly on WhatsApp. 
            No downloads required. No commissions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <button className="btn-primary py-4 px-8 text-lg shadow-xl shadow-indigo-500/20">
                Get Started <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/store/demo">
                <button className="px-8 py-4 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                View Demo Store
                </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to sell online</h2>
            <p className="text-slate-500 text-lg">Powerful features built for modern restaurants and shops.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Smartphone className="text-indigo-600" size={32} />}
              title="Mobile First Design"
              description="Your menu looks stunning on every device. Customers love the app-like experience without installing anything."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="text-green-500" size={32} />}
              title="WhatsApp Integration"
              description="Orders land directly in your WhatsApp chat. Confirm orders and chat with customers instantly."
            />
            <FeatureCard 
              icon={<Truck className="text-blue-500" size={32} />}
              title="Delivery & Tracking"
              description="Built-in location sharing and delivery fee calculation. Keep your logistics simple and efficient."
            />
          </div>
        </div>
      </section>



      {/* Pricing Section */}
      <section className="py-24 bg-white border-y border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-5"></div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Unbeatable Launch Offer</h2>
            <p className="text-slate-500 text-lg">Get premium features for the price of a coffee. Limited time only.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             {/* Starter Plan */}
             <div className="p-8 rounded-3xl border border-gray-200 bg-white hover:border-indigo-100 hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                   70% OFF
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                <div className="flex items-baseline gap-2 mb-6">
                   <span className="text-xl text-gray-400 line-through decoration-red-500">$29</span>
                   <span className="text-5xl font-extrabold text-slate-900">$8</span>
                   <span className="text-slate-500">/month</span>
                </div>
                <p className="text-slate-500 mb-8 border-b border-gray-100 pb-8">
                   Perfect for small cafes and home kitchens starting out.
                </p>
                <ul className="space-y-4 mb-8">
                   <PricingFeature text="Up to 100 Orders/mo" />
                   <PricingFeature text="Digital Menu & QR Code" />
                   <PricingFeature text="WhatsApp Integration" />
                   <PricingFeature text="Basic Analytics" />
                </ul>
                <Link href="/register" className="block w-full">
                    <button className="w-full mt-8 bg-blue-100 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-200 transition-colors">
                        Start Free Trial
                    </button>
                </Link>
             </div>

             {/* Pro Plan */}
             <div className="p-8 rounded-3xl border-2 border-indigo-600 bg-slate-900 text-white relative shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4">
                <div className="absolute top-0 center w-full text-center -mt-3">
                   <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Best Value</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
                <div className="flex items-baseline gap-2 mb-6">
                   <span className="text-xl text-indigo-300 line-through decoration-indigo-400">$79</span>
                   <span className="text-5xl font-extrabold text-white">$24</span>
                   <span className="text-gray-400">/month</span>
                </div>
                <p className="text-indigo-200 mb-8 border-b border-indigo-800 pb-8">
                   For busy restaurants handling high volume.
                </p>
                <ul className="space-y-4 mb-8">
                   <PricingFeature text="Unlimited Orders" light />
                   <PricingFeature text="Priority Support" light />
                   <PricingFeature text="Custom Domain" light />
                   <PricingFeature text="Remove Branding" light />
                </ul>
                <button className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/40">
                   Get Started Now
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Store Owners</h2>
              <p className="text-slate-500 text-lg">Don't just take our word for it.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard 
                 name="Sarah Jenkins"
                 role="Owner, The Daily Grind"
                 text="Since switching to EasyOrder, we've saved over $400/month in delivery commissions. Our customers love ordering via WhatsApp!"
                 initial="S"
                 color="bg-orange-100 text-orange-600"
              />
              <TestimonialCard 
                 name="Mike Chen"
                 role="Manager, Golden Dragon"
                 text="The setup was instant. I created my menu in 10 minutes and started getting orders the same day. Highly recommended!"
                 initial="M"
                 color="bg-blue-100 text-blue-600"
              />
              <TestimonialCard 
                 name="Emma Wilson"
                 role="Founder, Sweet Treats"
                 text="Best investment for my bakery. The digital menu looks professional and the WhatsApp integration is flawless."
                 initial="E"
                 color="bg-pink-100 text-pink-600"
              />
           </div>
        </div>
      </section>

      {/* Featured Clients */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
             <div>
                <h2 className="text-3xl font-bold text-slate-900">Featured Partners</h2>
                <p className="text-slate-500 mt-2">See who is already growing with EasyOrder.</p>
             </div>
             <Link href="/super-admin/login" className="hidden sm:block text-indigo-600 font-semibold hover:underline">
                Become a partner &rarr;
             </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.length > 0 ? (
               tenants.map(tenant => (
                  <Link href={`/store/${tenant.slug}`} key={tenant.id} className="group">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                       <div>
                          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                             <ShoppingBag size={24} />
                          </div>
                          <h3 className="font-bold text-lg text-slate-900 mb-1">{tenant.name}</h3>
                          <p className="text-sm text-slate-500">Review their digital storefront</p>
                       </div>
                       <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Visit Store <ArrowRight size={16} className="ml-1" />
                       </div>
                    </div>
                  </Link>
               ))
            ) : (
                <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400">No active stores yet. Be the first!</p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
           <div className="col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                <ShoppingBag strokeWidth={2.5} />
                <span>EasyOrder</span>
              </div>
              <p className="max-w-xs">Helping small businesses complete with the giants. One WhatsApp order at a time.</p>
           </div>
           <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                 <li>Features</li>
                 <li>Pricing</li>
                 <li>Showcase</li>
              </ul>
           </div>
           <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                 <li>About Us</li>
                 <li>Contact</li>
                 <li>Privacy Policy</li>
              </ul>
           </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
           &copy; {new Date().getFullYear()} EasyOrder Inc. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 bg-slate-50 rounded-3xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingFeature({ text, light = false }: { text: string, light?: boolean }) {
  return (
    <li className="flex items-center gap-3">
       <CheckCircle2 size={18} className={light ? "text-indigo-400" : "text-indigo-600"} />
       <span className={light ? "text-gray-300" : "text-slate-600"}>{text}</span>
    </li>
  );
}

function TestimonialCard({ name, role, text, initial, color }: { name: string, role: string, text: string, initial: string, color: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${color}`}>
          {initial}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed italic">"{text}"</p>
      <div className="flex gap-1 mt-4">
         {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />)}
      </div>
    </div>
  );
}
