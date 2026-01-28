import Link from "next/link";
import { getTenantRepository } from "@/lib/repository";
import { ArrowRight, CheckCircle2, ShoppingBag, Truck, Smartphone, Star, Phone, Mail, Share2, MessageCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // const repo = getTenantRepository();
  // const tenants = await repo.getAllTenants();
  
  const featuredPartners = [
    { id: 'd1', name: 'Sunny Threadz', slug: 'demo', category: 'Fashion', color: 'bg-orange-50 text-orange-600' },
    { id: 'd2', name: 'Crafty Box', slug: 'demo', category: 'Handmade', color: 'bg-rose-50 text-rose-600' },
    { id: 'd3', name: 'Green Bowl', slug: 'demo', category: 'Food', color: 'bg-green-50 text-green-600' },
    { id: 'd4', name: 'Digital Planners', slug: 'demo', category: 'Digital', color: 'bg-yellow-50 text-yellow-600' },
    { id: 'd5', name: 'Coffee House', slug: 'demo', category: 'Cafe', color: 'bg-stone-50 text-stone-600' },
    { id: 'd6', name: 'Luxe Scents', slug: 'demo', category: 'Beauty', color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navbar - Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <ShoppingBag strokeWidth={2.5} size={20} />
            </div>
            <span className="tracking-tight">OrderViaChat</span>
          </div>
          <div className="flex gap-4 items-center">
             <div className="hidden lg:flex flex-col items-end mr-4 border-r border-slate-200 pr-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Mail size={12} className="text-indigo-600" /> segmentibi@gmail.com
                </div>
             </div>
             <Link href="/store/demo" className="hidden md:block text-slate-600 font-medium hover:text-indigo-600 transition-colors">
                View Demo
             </Link>
             <Link href="/register">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 text-sm">
                    Get Started
                </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark & Vibrant */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-mesh text-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-indigo-300 text-sm font-semibold border border-indigo-500/30 animate-fade-in">
                        <Star size={14} fill="currentColor" className="text-yellow-400" />
                        <span>#1 WhatsApp Ordering System</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] animate-fade-in delay-100">
                        Turn Chats into <br/>
                        <span className="text-gradient">Money Machines</span>
                    </h1>
                    
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in delay-200">
                        Stop paying 30% commissions. Create a stunning digital menu and accept orders directly on WhatsApp. 
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-fade-in delay-300">
                        <Link href="/register">
                            <button className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 text-white text-lg font-bold py-4 px-8 rounded-2xl shadow-lg shadow-indigo-500/40 transition-all hover:-translate-y-1">
                                Start Selling Free <ArrowRight className="inline ml-2" />
                            </button>
                        </Link>
                        <Link href="/store/demo">
                            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white glass-dark hover:bg-white/10 transition-all">
                                See Live Demo
                            </button>
                        </Link>
                    </div>

                    <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-slate-400 text-sm animate-fade-in delay-300">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-400" /> No credit card
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-400" /> Free for a limited time
                        </div>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="relative lg:h-[600px] flex items-center justify-center animate-float">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                    {/* Stacked Images Effect */}
                    <div className="relative w-full max-w-md mx-auto perspective-1000">
                        <img 
                            src="/images/showcase-store.png" 
                            alt="App Interface" 
                            className="relative z-20 w-full rounded-[2.5rem] border-8 border-slate-900 shadow-2xl shadow-black/50 transform rotate-y-12 rotate-z-3 hover:rotate-0 transition-all duration-700"
                        />
                         <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-64 glass-dark p-4 rounded-xl shadow-xl z-30 hidden md:block animate-pulse-glow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">New Order #284</div>
                                    <div className="text-xs text-green-300">Paid • $42.50</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-white/20 rounded w-full"></div>
                                <div className="h-2 bg-white/10 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    Get your store running in less than 5 minutes. No technical skills required.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

                {/* Step 1 */}
                <div className="relative text-center group">
                    <div className="w-24 h-24 bg-white rounded-3xl border-2 border-slate-100 shadow-xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:border-indigo-100 transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="font-bold text-xl">1</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Add Products</h3>
                    <p className="text-slate-500 leading-relaxed px-4">
                        Sign up for free and upload your products. Customize your store's look to match your brand.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="relative text-center group">
                    <div className="w-24 h-24 bg-white rounded-3xl border-2 border-slate-100 shadow-xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:border-purple-100 transition-all duration-300">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <Share2 size={24} />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Share Link</h3>
                    <p className="text-slate-500 leading-relaxed px-4">
                        Post your unique store link on Instagram, Facebook, or send it directly to customers.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="relative text-center group">
                    <div className="w-24 h-24 bg-white rounded-3xl border-2 border-slate-100 shadow-xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:border-green-100 transition-all duration-300">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                            <MessageCircle size={24} />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Get WhatsApp Orders</h3>
                    <p className="text-slate-500 leading-relaxed px-4">
                        Customers place orders and you receive a perfectly formatted WhatsApp message.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Product Showcase Section (Bento Grid) */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Complete Toolkit for Growth</h2>
                <p className="text-slate-500 text-xl max-w-2xl mx-auto">
                    Everything you need to run a modern food business, without the technical headache.
                </p>
            </div>

            <div className="grid md:grid-cols-12 gap-6">
                {/* Feature 1: Storefront (Big) */}
                <div className="md:col-span-7 bg-slate-50 rounded-[2rem] p-8 border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <Smartphone size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Stunning Mobile Storefront</h3>
                        <p className="text-slate-500">
                             Give your customers an app-like experience. <span className="text-indigo-600 font-bold">Instant Search</span> lets them find cravings in milliseconds.
                        </p>
                    </div>
                    <div className="relative h-[300px] md:h-[400px] bg-white rounded-t-3xl shadow-lg border border-slate-100 translate-y-8 group-hover:translate-y-4 transition-transform duration-500">
                        <img src="/images/showcase-store.png" className="w-full h-full object-cover object-top rounded-t-3xl opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Feature 2: Admin (Tall) */}
                <div className="md:col-span-5 bg-slate-900 text-white rounded-[2rem] p-8 border border-slate-800 overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 relative">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                            <Star size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Powerful Dashboard</h3>
                        <p className="text-slate-400 mb-8">
                            Track revenue, manage orders, and update your menu in real-time.
                        </p>
                        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                             <img src="/images/showcase-admin.png" className="w-full h-auto" />
                        </div>
                     </div>
                </div>
                
                 {/* Feature 3: Social Marketing (Wide) */}
                 <div className="md:col-span-12 bg-indigo-50 rounded-[2rem] p-8 md:p-12 border border-indigo-100 flex flex-col md:flex-row items-center gap-12 group hover:bg-indigo-100/50 transition-colors duration-500">
                     <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                            <Share2 size={24} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">One-Click Marketing</h3>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Stop struggling with design tools. Generate professional, branded <strong>Instagram Stories</strong> instantly from your dashboard.
                        </p>
                        <ul className="space-y-3">
                             <li className="flex items-center gap-3 text-slate-700 font-medium">
                                <CheckCircle2 size={20} className="text-indigo-600" /> Auto-generates QR Code & Link
                             </li>
                             <li className="flex items-center gap-3 text-slate-700 font-medium">
                                <CheckCircle2 size={20} className="text-indigo-600" /> Perfect 9:16 Aspect Ratio
                             </li>
                        </ul>
                    </div>
                     <div className="flex-1 w-full max-w-2xl">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white group-hover:rotate-1 transition-transform duration-500">
                             <img src="/images/showcase-social.png" className="w-full h-auto" />
                        </div>
                     </div>
                 </div>
            </div>
        </div>
      </section>

      {/* Pricing Section (Refined) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 text-lg">No hidden fees. No commissions. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             {/* Starter Plan */}
             <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-xl transition-all duration-300 relative group">
                <div className="mb-6">
                   <h3 className="text-2xl font-bold text-slate-900">Starter</h3>
                   <p className="text-slate-500 mt-2">For home businesses</p>
                </div>
                <div className="flex items-baseline gap-2 mb-8">
                   <span className="text-5xl font-extrabold text-slate-900 tracking-tight">$8</span>
                   <span className="text-slate-500">/month</span>
                </div>
                
                <Link href="/register" className="block w-full mb-8">
                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-xl transition-colors">
                        Start Free Trial
                    </button>
                </Link>

                <ul className="space-y-4 text-slate-600">
                   <PricingFeature text="Up to 100 Orders/mo" />
                   <PricingFeature text="Digital Menu & QR Code" />
                   <PricingFeature text="WhatsApp Integration" />
                   <PricingFeature text="Basic Analytics" />
                   <PricingFeature text="Multi-Currency Support" />
                </ul>
             </div>

             {/* Pro Plan */}
             <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4 border border-slate-800">
                <div className="absolute top-0 right-0 p-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Most Popular
                    </div>
                </div>
                
                <div className="mb-6">
                   <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Growth</h3>
                   <p className="text-slate-400 mt-2">For serious restaurants</p>
                </div>

                <div className="flex items-baseline gap-2 mb-8">
                   <span className="text-5xl font-extrabold text-white tracking-tight">$24</span>
                   <span className="text-slate-400">/month</span>
                </div>
                
                <Link href="/register" className="block w-full mb-8">
                     <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all">
                        Get Started Now
                    </button>
                </Link>

                <ul className="space-y-4">
                   <PricingFeature text="Unlimited Orders" light />
                   <PricingFeature text="Priority Support" light />
                   <PricingFeature text="Custom Domain" light />
                   <PricingFeature text="Remove Branding" light />
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Clients (Logos) */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-slate-400 font-medium mb-8">TRUSTED BY INNOVATIVE BRANDS</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Mock Logos */}
                 {featuredPartners.slice(0, 4).map(partner => (
                    <div key={partner.id} className="flex items-center gap-2 font-bold text-xl text-slate-800">
                         <div className={`w-8 h-8 rounded-full ${partner.color.split(' ')[0]}`}></div>
                         {partner.name}
                    </div>
                 ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12">
           <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2 font-bold text-2xl text-white">
                <ShoppingBag strokeWidth={2.5} />
                <span>OrderViaChat</span>
              </div>
              <p className="max-w-sm text-lg leading-relaxed">
                  We're on a mission to democratize restaurant technology. No hidden fees, just great software.
              </p>
           </div>
           <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm">
                 <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Showcase</li>
              </ul>
           </div>
           <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                 <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              </ul>
           </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm text-center">
           &copy; {new Date().getFullYear()} OrderViaChat Inc. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function PricingFeature({ text, light = false }: { text: string, light?: boolean }) {
  return (
    <li className="flex items-center gap-3">
       <div className={`p-1 rounded-full ${light ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
         <CheckCircle2 size={14} strokeWidth={3} />
       </div>
       <span className={light ? "text-slate-300" : "text-slate-600"}>{text}</span>
    </li>
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
