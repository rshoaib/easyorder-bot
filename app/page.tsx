import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Smartphone,
  Share2,
  MessageCircle,
  Sparkles,
  LayoutDashboard,
  Palette,
  Zap,
  UtensilsCrossed,
  Home,
  Cake,
  Store,
  Send,
  Globe,
  TrendingUp,
  Star,
  Users,
  Clock,
  XCircle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import ScrollFadeIn from "@/components/landing/ScrollFadeIn";
import AnimatedCounter from "@/components/landing/AnimatedCounter";
import HeroDemo from "@/components/landing/HeroDemo";
import FAQ from "@/components/landing/FAQ";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const WHATSAPP_SHARE_URL = `https://wa.me/?text=${encodeURIComponent(
  "Check out OrderViaChat — a free tool to create a digital menu and get orders on WhatsApp! 🚀\nhttps://orderviachat.com"
)}`;

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg text-slate-900"
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <ShoppingBag strokeWidth={2.5} size={18} />
            </div>
            <span className="tracking-tight">OrderViaChat</span>
          </Link>
          <div className="flex gap-3 items-center">
            <Link
              href="/store/demo"
              className="hidden sm:block text-sm text-slate-500 font-medium hover:text-indigo-600 transition-colors px-3 py-2"
            >
              Live Demo
            </Link>
            <Link
              href="/blog"
              className="hidden sm:block text-sm text-slate-500 font-medium hover:text-indigo-600 transition-colors px-3 py-2"
            >
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
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] -z-10" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100 animate-fade-in">
                <Zap size={12} fill="currentColor" />
                <span>100% Free — Forever</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 animate-fade-in delay-100">
                Turn WhatsApp into Your{" "}
                <span className="text-gradient">Order Machine</span>
              </h1>

              <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in delay-200">
                Your customers are already on WhatsApp. Give them a beautiful
                store to order from — no app downloads, no commissions, no
                technical skills needed.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 animate-fade-in delay-300">
                <Link href="/login?view=signup">
                  <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold py-3.5 px-7 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 animate-pulse-subtle">
                    Create Your Free Store <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/store/demo">
                  <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all text-base">
                    See Live Demo
                  </button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-slate-400 text-sm pt-2 animate-fade-in delay-300">
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500" />
                  <span>2-min setup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span>Zero commission</span>
                </div>
              </div>

              {/* WhatsApp Share */}
              <div className="animate-fade-in delay-300">
                <a
                  href={WHATSAPP_SHARE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-green-600 transition-colors group"
                >
                  <Send
                    size={14}
                    className="group-hover:text-green-500 transition-colors"
                  />
                  Know a business owner?{" "}
                  <span className="underline underline-offset-2 font-medium text-slate-500 group-hover:text-green-600">
                    Share via WhatsApp
                  </span>
                </a>
              </div>
            </div>

            {/* Right — Interactive Demo */}
            <div className="relative flex items-center justify-center animate-fade-in delay-200">
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Counter ─── */}
      <section className="py-12 md:py-16 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-6 md:gap-12">
            <AnimatedCounter
              end={120}
              suffix="+"
              label="Stores Created"
              icon={<Store size={22} />}
            />
            <AnimatedCounter
              end={2500}
              suffix="+"
              label="Orders Processed"
              icon={<TrendingUp size={22} />}
            />
            <AnimatedCounter
              end={15}
              suffix="+"
              label="Countries"
              icon={<Globe size={22} />}
            />
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Up and Running in 3 Steps
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              No coding. No downloads. Just you and your products.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-slate-200" />

            <ScrollFadeIn delay={0}>
              <StepCard
                number={1}
                icon={<ShoppingBag size={22} />}
                title="Add Your Products"
                description="Sign up free and add your items. Or let our AI generate your entire menu in seconds."
                color="indigo"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={150}>
              <StepCard
                number={2}
                icon={<Share2 size={22} />}
                title="Share Your Link"
                description="Get your unique store URL instantly. Share it on Instagram, WhatsApp, or print a QR code."
                color="purple"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <StepCard
                number={3}
                icon={<MessageCircle size={22} />}
                title="Orders Hit Your WhatsApp"
                description="Customers browse, tap to order, and you get a clean message on WhatsApp. That's it!"
                color="green"
              />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Before / After ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Stop Losing Orders in Chat
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              See the difference OrderViaChat makes for your business.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <ScrollFadeIn>
              <div className="bg-red-50/80 border border-red-100 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-red-700 font-bold text-lg">
                  <XCircle size={20} />
                  Before
                </div>
                <ul className="space-y-3 text-sm text-red-800/80">
                  <li className="flex items-start gap-2">
                    <XCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-red-400"
                    />
                    <span>
                      Customers send confusing messages — "I want that thing
                      from yesterday"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-red-400"
                    />
                    <span>
                      You type prices manually, make mistakes, lose orders
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-red-400"
                    />
                    <span>No menu to share — customers don&apos;t know what you sell</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-red-400"
                    />
                    <span>
                      Juggling multiple chats, losing track of who ordered what
                    </span>
                  </li>
                </ul>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={200}>
              <div className="bg-green-50/80 border border-green-100 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
                  <CheckCircle size={20} />
                  After
                </div>
                <ul className="space-y-3 text-sm text-green-800/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    <span>
                      Beautiful store link customers can browse and order from
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    <span>
                      Clean WhatsApp message with items, prices, and totals
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    <span>
                      Professional menu with photos that makes your brand shine
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    <span>
                      Dashboard to track all orders and manage everything in one
                      place
                    </span>
                  </li>
                </ul>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Everything You Need to Sell Online
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              A complete toolkit — zero technical skills required.
            </p>
          </ScrollFadeIn>

          <div className="grid sm:grid-cols-2 gap-5">
            <ScrollFadeIn>
              <FeatureCard
                icon={<Smartphone size={22} className="text-blue-600" />}
                title="Mobile-First Storefront"
                description="Your store looks like a real app on any phone. Fast, beautiful, and designed to convert visitors into customers."
                bgColor="bg-blue-50"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <FeatureCard
                icon={<Sparkles size={22} className="text-purple-600" />}
                title="AI Menu Generator"
                description="Just describe your business. Our AI creates your entire product catalog — names, descriptions, and categories — in seconds."
                bgColor="bg-purple-50"
                badge="🔥 Popular"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <FeatureCard
                icon={
                  <LayoutDashboard size={22} className="text-emerald-600" />
                }
                title="Order Dashboard"
                description="See every order, track your revenue, and manage your menu. Like having a POS system in your pocket."
                bgColor="bg-emerald-50"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <FeatureCard
                icon={<Palette size={22} className="text-rose-600" />}
                title="Brand Customization"
                description="Upload your logo, choose brand colors, add a banner. Your store, your identity — no generic templates."
                bgColor="bg-rose-50"
              />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Loved By Small Businesses
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              See why business owners are switching to OrderViaChat.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            <ScrollFadeIn>
              <TestimonialCard
                quote="I set up my bakery menu in literally 2 minutes. Now I just share the link on Instagram and orders come straight to WhatsApp. Game changer!"
                name="Fatima A."
                role="Home Baker"
                color="bg-pink-100"
                emoji="🍰"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={150}>
              <TestimonialCard
                quote="No more typing prices over and over. Customers browse my store, pick what they want, and I get a clean order message. So much easier."
                name="Ahmed K."
                role="Café Owner"
                color="bg-amber-100"
                emoji="☕"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <TestimonialCard
                quote="I was paying 30% to food delivery apps. With OrderViaChat, I keep every dollar and my customers love ordering directly."
                name="Maria L."
                role="Restaurant Owner"
                color="bg-indigo-100"
                emoji="🍕"
              />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Perfect For (Use Cases) ─── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Built For Every Kind of Business
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              If you sell something, OrderViaChat works for you.
            </p>
          </ScrollFadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScrollFadeIn>
              <UseCaseCard
                icon={<UtensilsCrossed size={28} />}
                title="Restaurants & Cafes"
                color="orange"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <UseCaseCard
                icon={<Home size={28} />}
                title="Home Businesses"
                color="indigo"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <UseCaseCard
                icon={<Cake size={28} />}
                title="Bakers & Caterers"
                color="pink"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <UseCaseCard
                icon={<Store size={28} />}
                title="Small Retailers"
                color="emerald"
              />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <HelpCircle size={20} className="text-indigo-600" />
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide">
                FAQ
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Got Questions?
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Everything you need to know before getting started.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn>
            <FAQ />
          </ScrollFadeIn>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 md:py-28 bg-gradient-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.3),transparent_60%)]" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <ScrollFadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold border border-white/10 mb-6">
              <Sparkles size={12} />
              <span>Join our growing community</span>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={100}>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Your Store is Just
              <br />
              <span className="text-indigo-400">2 Minutes Away</span>
            </h2>
          </ScrollFadeIn>

          <ScrollFadeIn delay={200}>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              Be among the first to launch your online store. Early adopters get
              access to upcoming premium features — completely free.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login?view=signup">
                <button className="bg-white text-slate-900 text-lg font-bold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all inline-flex items-center gap-2 animate-pulse-subtle">
                  Create Your Free Store <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/store/demo">
                <button className="text-white/70 hover:text-white text-base font-medium py-4 px-6 rounded-xl transition-all hover:bg-white/5 inline-flex items-center gap-2">
                  See Demo First <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={400}>
            <div className="flex items-center justify-center gap-6 mt-8 text-slate-400 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400" /> Free
                forever
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400" /> No credit
                card
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400" /> 2-min
                setup
              </div>
            </div>
          </ScrollFadeIn>
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
                The simplest way for small businesses to accept orders on
                WhatsApp. Free forever.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/store/demo"
                      className="hover:text-white transition-colors"
                    >
                      Live Demo
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="hover:text-white transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login?view=signup"
                      className="hover:text-white transition-colors"
                    >
                      Create Store
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800 text-xs text-center text-slate-500">
            &copy; {new Date().getFullYear()} OrderViaChat. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ─── Floating WhatsApp Share Button ─── */}
      <a
        href={WHATSAPP_SHARE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group hidden md:flex"
        aria-label="Share on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />
    </main>
  );
}

/* ─── Sub-components ─── */

function StepCard({
  number,
  icon,
  title,
  description,
  color,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="relative text-center group">
      <div className="w-20 h-20 bg-white rounded-2xl border-2 border-slate-100 shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}
        >
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  bgColor,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  badge?: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <div
        className={`w-11 h-11 ${bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function UseCaseCard({
  icon,
  title,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    orange:
      "bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-200 hover:shadow-lg",
    indigo:
      "bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-200 hover:shadow-lg",
    pink: "bg-pink-50 text-pink-600 border-pink-100 hover:border-pink-200 hover:shadow-lg",
    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200 hover:shadow-lg",
  };

  return (
    <div
      className={`p-5 rounded-2xl border text-center transition-all duration-300 group ${colorMap[color]}`}
    >
      <div className="flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  color,
  emoji,
}: {
  quote: string;
  name: string;
  role: string;
  color: string;
  emoji: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className="text-amber-400"
            fill="currentColor"
          />
        ))}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-lg`}
        >
          {emoji}
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm">{name}</div>
          <div className="text-slate-400 text-xs">{role}</div>
        </div>
      </div>
    </div>
  );
}
