import Link from "next/link";
import { ArrowRight, CheckCircle2, ShoppingBag, Smartphone, Share2, MessageCircle, Sparkles, LayoutDashboard, Palette, Zap, UtensilsCrossed, Home, Cake, Store } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <ShoppingBag strokeWidth={2.5} size={18} />
            </div>
            <span className="tracking-tight">OrderViaChat</span>
          </Link>
          <div className="flex gap-3 items-center">
            <Link href="/store/demo" className="hidden sm:block text-sm text-slate-500 font-medium hover:text-indigo-600 transition-colors px-3 py-2">
              Live Demo
            </Link>
            <Link href="/blog" className="hidden sm:block text-sm text-slate-500 font-medium hover:text-indigo-600 transition-colors px-3 py-2">
              Blog
            </Link>
            <Link href="/login">
              <button className="text-sm text-slate-600 font-medium hover:text-slate-900 transition-colors px-3 py-2">
                Log in
              </button>
            </Link>
            <Link href="/login?view=signup">
              <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition-all text-sm shadow-md shadow-indigo-500/20">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white -z-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100 animate-fade-in">
                <Zap size={12} fill="currentColor" />
                <span>100% Free — No Catch</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 animate-fade-in delay-100">
                Your Menu on WhatsApp —{" "}
                <span className="text-gradient">Ready in 2 Minutes</span>
              </h1>

              <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in delay-200">
                Create a beautiful digital menu, share a link with your customers, and receive
                orders directly on WhatsApp. No app downloads. No commissions. Completely free.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 animate-fade-in delay-300">
                <Link href="/login?view=signup">
                  <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold py-3.5 px-7 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Create Your Free Store <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/store/demo">
                  <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all text-base">
                    See Live Demo
                  </button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-5 text-slate-400 text-sm pt-2 animate-fade-in delay-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-green-500" /> No credit card
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-green-500" /> No commissions
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-green-500" /> 2-min setup
                </div>
              </div>
            </div>

            {/* Right — Hero Visual */}
            <div className="relative flex items-center justify-center animate-fade-in delay-200">
              <div className="absolute inset-0 bg-indigo-200/30 blur-[80px] rounded-full -z-10"></div>
              <div className="relative w-full max-w-sm mx-auto">
                <img
                  src="/images/showcase-store.png"
                  alt="OrderViaChat Store Preview"
                  className="relative z-10 w-full rounded-[2rem] border-[6px] border-slate-900 shadow-2xl shadow-slate-900/20"
                />
                {/* Floating notification */}
                <div className="absolute -right-4 md:-right-10 top-1/3 bg-white p-3.5 rounded-xl shadow-xl border border-slate-100 z-20 hidden md:flex items-center gap-3 animate-float">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">New Order!</div>
                    <div className="text-xs text-green-600 font-medium">via WhatsApp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Get your online store up and running in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-slate-200"></div>

            <StepCard
              number={1}
              icon={<ShoppingBag size={22} />}
              title="Create Your Menu"
              description="Sign up for free and add your products. Use our AI to generate items instantly."
              color="indigo"
            />
            <StepCard
              number={2}
              icon={<Share2 size={22} />}
              title="Share Your Link"
              description="Post your unique store link on Instagram, WhatsApp, or print a QR code."
              color="purple"
            />
            <StepCard
              number={3}
              icon={<MessageCircle size={22} />}
              title="Get Orders on WhatsApp"
              description="Customers browse, order, and you receive a formatted WhatsApp message."
              color="green"
            />
          </div>
        </div>
      </section>

      {/* ─── Features Grid (Compact) ─── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Everything You Need</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              A complete toolkit to run your online store — no technical skills required.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <FeatureCard
              icon={<Smartphone size={22} className="text-blue-600" />}
              title="Mobile-First Storefront"
              description="A fast, beautiful store that works perfectly on any phone — like a real app."
              bgColor="bg-blue-50"
            />
            <FeatureCard
              icon={<Sparkles size={22} className="text-purple-600" />}
              title="AI Menu Generator"
              description="Describe your business and our AI creates your entire product catalog instantly."
              bgColor="bg-purple-50"
            />
            <FeatureCard
              icon={<LayoutDashboard size={22} className="text-emerald-600" />}
              title="Order Dashboard"
              description="Track orders, manage your menu, and see your revenue — all from one place."
              bgColor="bg-emerald-50"
            />
            <FeatureCard
              icon={<Palette size={22} className="text-rose-600" />}
              title="Brand Customization"
              description="Match your store's look to your brand with custom colors, logo, and banner."
              bgColor="bg-rose-50"
            />
          </div>
        </div>
      </section>

      {/* ─── Perfect For (Use Cases) ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Perfect For</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Whether you sell food, crafts, or services — OrderViaChat works for you.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UseCaseCard icon={<UtensilsCrossed size={28} />} title="Restaurants & Cafes" color="orange" />
            <UseCaseCard icon={<Home size={28} />} title="Home Businesses" color="indigo" />
            <UseCaseCard icon={<Cake size={28} />} title="Bakers & Caterers" color="pink" />
            <UseCaseCard icon={<Store size={28} />} title="Small Retailers" color="emerald" />
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 md:py-28 bg-gradient-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.3),transparent_60%)]"></div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Start Selling?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Join hundreds of small businesses already using OrderViaChat.
            Create your free store in minutes — no technical skills needed.
          </p>
          <Link href="/login?view=signup">
            <button className="bg-white text-slate-900 text-lg font-bold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all inline-flex items-center gap-2">
              Create Your Free Store <ArrowRight size={20} />
            </button>
          </Link>
          <div className="flex items-center justify-center gap-6 mt-8 text-slate-400 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" /> Free forever
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" /> No credit card
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" /> 2-min setup
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-lg text-white">
                <ShoppingBag strokeWidth={2.5} size={20} />
                <span>OrderViaChat</span>
              </div>
              <p className="text-sm max-w-xs leading-relaxed">
                The simplest way for small businesses to accept orders on WhatsApp. Free forever.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/store/demo" className="hover:text-white transition-colors">Live Demo</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/login?view=signup" className="hover:text-white transition-colors">Create Store</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800 text-xs text-center text-slate-500">
            &copy; {new Date().getFullYear()} OrderViaChat. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── Sub-components ─── */

function StepCard({ number, icon, title, description, color }: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:border-indigo-200',
    purple: 'bg-purple-50 text-purple-600 group-hover:border-purple-200',
    green: 'bg-green-50 text-green-600 group-hover:border-green-200',
  };

  return (
    <div className="relative text-center group">
      <div className="w-20 h-20 bg-white rounded-2xl border-2 border-slate-100 shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-300">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description, bgColor }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 group">
      <div className={`w-11 h-11 ${bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function UseCaseCard({ icon, title, color }: {
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-100 hover:border-pink-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200',
  };

  return (
    <div className={`p-5 rounded-2xl border text-center transition-all duration-300 hover:shadow-md group ${colorMap[color]}`}>
      <div className="flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
    </div>
  );
}
