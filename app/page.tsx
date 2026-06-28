import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Smartphone,
  MessageCircle,
  Sparkles,
  LayoutDashboard,
  Palette,
  Share2,
  UtensilsCrossed,
  Home,
  Cake,
  Store,
  Mail,
  BookOpen,
  Eye,
  Code2,
} from "lucide-react";
import ScrollFadeIn from "@/components/landing/ScrollFadeIn";
import HeroDemo from "@/components/landing/HeroDemo";
import { getAllPosts } from "@/lib/blog";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getTenantRepository } from "@/lib/repository";
import { CONTACT_EMAIL, CONTACT_MAILTO, DEMO_STORE_SLUG } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Existing owners who still have a valid session land on their dashboard,
  // where they'll see the permanent service-closure notice.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const repo = getTenantRepository();
    const tenant = await repo.getTenantByUserId(user.id);
    if (tenant) {
      redirect(`/store/${tenant.slug}/admin`);
    }
  }

  const posts = (await getAllPosts()).slice(0, 4);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "OrderViaChat",
            url: "https://orderviachat.com",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "OrderViaChat is a WhatsApp ordering platform for restaurants and small businesses — now available as an interactive demo and portfolio showcase.",
          }),
        }}
      />

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
              href={`/store/${DEMO_STORE_SLUG}`}
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
            <a href={CONTACT_MAILTO}>
              <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition-all text-sm shadow-md shadow-indigo-500/20 flex items-center gap-2">
                <Mail size={15} /> Contact Us
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] -z-10" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                <Eye size={12} />
                <span>Interactive Demo &amp; Portfolio Showcase</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
                A WhatsApp{" "}
                <span className="text-gradient">Ordering Platform</span>, Built
                End-to-End
              </h1>

              <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                OrderViaChat let small businesses turn WhatsApp into a complete
                ordering system — digital menus, a branded storefront, an order
                dashboard, and more. This site is a <strong>live demo</strong> of
                that product. Explore it freely, then reach out if you&apos;d like
                one built for you.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <Link href={`/store/${DEMO_STORE_SLUG}`}>
                  <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold py-3.5 px-7 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Browse the Demo Store <ArrowRight size={18} />
                  </button>
                </Link>
                <a href={CONTACT_MAILTO}>
                  <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all text-base flex items-center justify-center gap-2">
                    <Mail size={16} /> Contact Us
                  </button>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-slate-400 text-sm pt-2">
                <div className="flex items-center gap-1.5">
                  <Eye size={14} className="text-indigo-500" />
                  <span>Fully browsable demo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LayoutDashboard size={14} className="text-indigo-500" />
                  <span>Live admin dashboard</span>
                </div>
              </div>
            </div>

            {/* Right — Interactive Demo */}
            <div className="relative flex items-center justify-center">
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Closure / Demo Notice ─── */}
      <section className="py-8 border-y border-slate-100 bg-slate-50/60">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Note:</strong> OrderViaChat is no
            longer accepting new sign-ups — the hosted service has been retired.
            What remains is this interactive showcase of the full platform. If you
            want a system like this for your business,{" "}
            <a
              href={CONTACT_MAILTO}
              className="text-indigo-600 font-semibold underline underline-offset-2"
            >
              get in touch
            </a>
            .
          </p>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              How the Product Works
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Three simple steps from menu to order — no app downloads, no
              commissions.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-slate-200" />
            <ScrollFadeIn delay={0}>
              <StepCard
                number={1}
                icon={<ShoppingBag size={22} />}
                title="Build a Digital Menu"
                description="Add products with photos, prices, and categories — or generate an entire catalog with AI in seconds."
                color="indigo"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={150}>
              <StepCard
                number={2}
                icon={<Share2 size={22} />}
                title="Share the Store Link"
                description="Every store gets a clean URL and QR code to share on Instagram, WhatsApp, or in person."
                color="purple"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <StepCard
                number={3}
                icon={<MessageCircle size={22} />}
                title="Orders Arrive on WhatsApp"
                description="Customers browse, tap to order, and the merchant receives a clean, itemized message on WhatsApp."
                color="green"
              />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Try the Demo (Showcase) ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Eye size={20} className="text-indigo-600" />
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide">
                Try It Yourself
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Explore the Live Demo
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Browse a real storefront and peek inside the merchant dashboard.
              Everything is interactive — ordering is disabled in demo mode.
            </p>
          </ScrollFadeIn>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <ScrollFadeIn>
              <Link href={`/store/${DEMO_STORE_SLUG}`} className="group block h-full">
                <div className="bg-white rounded-2xl border border-slate-100 p-7 h-full hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Store size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    The Demo Storefront
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    A restaurant menu with categories, search, photos, and a
                    working cart — exactly what a customer would see.
                  </p>
                  <span className="text-sm font-semibold text-indigo-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open storefront <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </ScrollFadeIn>
            <ScrollFadeIn delay={150}>
              <Link
                href={`/store/${DEMO_STORE_SLUG}/admin`}
                className="group block h-full"
              >
                <div className="bg-white rounded-2xl border border-slate-100 p-7 h-full hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <LayoutDashboard size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    The Admin Dashboard
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    A read-only look at the merchant side — analytics, orders,
                    menu management, and store settings.
                  </p>
                  <span className="text-sm font-semibold text-indigo-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open dashboard <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              What the Platform Includes
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              A complete commerce toolkit — built with Next.js, Supabase, and a
              multi-tenant architecture.
            </p>
          </ScrollFadeIn>

          <div className="grid sm:grid-cols-2 gap-5">
            <ScrollFadeIn>
              <FeatureCard
                icon={<Smartphone size={22} className="text-blue-600" />}
                title="Mobile-First Storefront"
                description="Each store looks like a real app on any phone — fast, beautiful, and built to convert."
                bgColor="bg-blue-50"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <FeatureCard
                icon={<Sparkles size={22} className="text-purple-600" />}
                title="AI Menu Generator"
                description="Describe a business and AI drafts the full product catalog — names, descriptions, and categories."
                bgColor="bg-purple-50"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <FeatureCard
                icon={<LayoutDashboard size={22} className="text-emerald-600" />}
                title="Order Dashboard"
                description="Track revenue, manage orders, and edit the menu — a lightweight POS in the merchant's pocket."
                bgColor="bg-emerald-50"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <FeatureCard
                icon={<Palette size={22} className="text-rose-600" />}
                title="Brand Customization"
                description="Logos, brand colors, banners, custom domains, and multi-language storefronts."
                bgColor="bg-rose-50"
              />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Built For ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Designed For Every Kind of Business
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              The platform was built to fit any small business that takes orders.
            </p>
          </ScrollFadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScrollFadeIn>
              <UseCaseCard icon={<UtensilsCrossed size={28} />} title="Restaurants & Cafes" color="orange" />
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <UseCaseCard icon={<Home size={28} />} title="Home Businesses" color="indigo" />
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <UseCaseCard icon={<Cake size={28} />} title="Bakers & Caterers" color="pink" />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <UseCaseCard icon={<Store size={28} />} title="Small Retailers" color="emerald" />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Latest Guides (Blog) ─── */}
      {posts.length > 0 && (
        <section className="py-20 md:py-24 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-6">
            <ScrollFadeIn className="text-center mb-14">
              <div className="inline-flex items-center gap-2 mb-4">
                <BookOpen size={20} className="text-indigo-600" />
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide">
                  Blog
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Guides &amp; Insights
              </h2>
              <p className="text-slate-500 text-lg max-w-lg mx-auto">
                Articles on WhatsApp commerce and growing a small business online.
              </p>
            </ScrollFadeIn>

            <div className="grid sm:grid-cols-2 gap-6">
              {posts.map((post, i) => (
                <ScrollFadeIn key={post.slug} delay={i * 100}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Guide <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </ScrollFadeIn>
              ))}
            </div>

            <ScrollFadeIn delay={400}>
              <div className="text-center mt-10">
                <Link href="/blog">
                  <button className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                    View All Guides <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </ScrollFadeIn>
          </div>
        </section>
      )}

      {/* ─── Contact CTA ─── */}
      <section className="py-20 md:py-28 bg-gradient-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.3),transparent_60%)]" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <ScrollFadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold border border-white/10 mb-6">
              <Code2 size={12} />
              <span>Want something like this built?</span>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={100}>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Like What You See?
            </h2>
          </ScrollFadeIn>

          <ScrollFadeIn delay={200}>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              This is a real, production-grade platform — multi-tenant storefronts,
              an admin dashboard, payments, and more. If you&apos;d like a custom
              ordering system, web app, or mobile app, let&apos;s talk.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={CONTACT_MAILTO}>
                <button className="bg-white text-slate-900 text-lg font-bold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all inline-flex items-center gap-2">
                  <Mail size={20} /> Contact Us
                </button>
              </a>
              <Link href={`/store/${DEMO_STORE_SLUG}`}>
                <button className="text-white/70 hover:text-white text-base font-medium py-4 px-6 rounded-xl transition-all hover:bg-white/5 inline-flex items-center gap-2">
                  Browse the Demo <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={400}>
            <p className="mt-8 text-slate-400 text-sm">
              Reach us anytime at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-white font-semibold underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
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
                A WhatsApp ordering platform for small businesses — now an
                interactive demo and portfolio showcase.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-3">Explore</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href={`/store/${DEMO_STORE_SLUG}`} className="hover:text-white transition-colors">
                      Live Demo
                    </Link>
                  </li>
                  <li>
                    <Link href={`/store/${DEMO_STORE_SLUG}/admin`} className="hover:text-white transition-colors">
                      Demo Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <a href={CONTACT_MAILTO} className="hover:text-white transition-colors">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">
                      {CONTACT_EMAIL}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800 text-xs text-center text-slate-500">
            &copy; {new Date().getFullYear()} OrderViaChat. Demo &amp; portfolio
            showcase. All rights reserved.
          </div>
        </div>
      </footer>
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
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="absolute top-0 right-1/2 translate-x-10 -translate-y-1 w-6 h-6 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {number}
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
      <div className={`w-11 h-11 ${bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
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
    orange: "bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-200 hover:shadow-lg",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-200 hover:shadow-lg",
    pink: "bg-pink-50 text-pink-600 border-pink-100 hover:border-pink-200 hover:shadow-lg",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200 hover:shadow-lg",
  };

  return (
    <div className={`p-5 rounded-2xl border text-center transition-all duration-300 group ${colorMap[color]}`}>
      <div className="flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
    </div>
  );
}
