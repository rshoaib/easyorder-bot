import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Globe,
  Smartphone,
  Zap,
  ShoppingBag,
  Clock,
  DollarSign,
  Palette,
  Users,
  Star,
  Wrench,
  CalendarCheck,
  Truck,
  CreditCard,
  UtensilsCrossed,
  Scissors,
  Package,
  HelpCircle,
  ChevronDown,
  XCircle,
  CheckCircle,
  Shield,
  Headphones,
} from "lucide-react";
import ScrollFadeIn from "@/components/landing/ScrollFadeIn";

export const metadata: Metadata = {
  title: "Services & Pricing — OrderViaChat | We Build Your Store For You",
  description:
    "Get your complete online store built for you — custom domain, WhatsApp ordering, custom features for your brand. Starting at just $30. Ready in 24-48 hours.",
  keywords: [
    "Online Store Setup Service",
    "WhatsApp Store Builder",
    "Done For You Online Store",
    "Cheap Website For Business",
    "Custom Store Features",
    "Store Setup Service",
  ],
  alternates: {
    canonical: "https://orderviachat.com/services",
  },
  openGraph: {
    title: "Services & Pricing — OrderViaChat",
    description:
      "We build your complete online store with custom features for your brand. Starting at $30. Ready in 24-48 hours.",
    url: "https://orderviachat.com/services",
    type: "website",
  },
};

const WHATSAPP_NUMBER = "923224609117";

function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "OrderViaChat Store Setup Service",
            provider: {
              "@type": "Organization",
              name: "OrderViaChat",
              url: "https://orderviachat.com",
            },
            description:
              "Done-for-you online store setup with custom domain, WhatsApp ordering, and custom features tailored to your brand.",
            url: "https://orderviachat.com/services",
            offers: [
              {
                "@type": "Offer",
                name: "Starter",
                price: "30",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                name: "Pro",
                price: "80",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                name: "Premium",
                price: "150",
                priceCurrency: "USD",
              },
            ],
          }),
        }}
      />

      {/* ─── Navbar ─── */}
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
              href="/"
              className="hidden sm:block text-sm text-slate-500 font-medium hover:text-indigo-600 transition-colors px-3 py-2"
            >
              Home
            </Link>
            <Link
              href="/store/demo"
              className="hidden sm:block text-sm text-slate-500 font-medium hover:text-indigo-600 transition-colors px-3 py-2"
            >
              Live Demo
            </Link>
            <Link href={getWhatsAppUrl("Hi! I'm interested in getting my store set up. Can you help?")}>
              <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition-all text-sm shadow-md shadow-indigo-500/20">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <ScrollFadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100 mb-6">
              <Sparkles size={12} fill="currentColor" />
              <span>Done-For-You Store Setup</span>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 mb-6">
              We&apos;ll Build Your{" "}
              <span className="text-gradient">Complete Store</span>
            </h1>
          </ScrollFadeIn>

          <ScrollFadeIn delay={200}>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
              Your own online store with custom domain, WhatsApp ordering, and{" "}
              <strong className="text-slate-700">
                features built specifically for your brand
              </strong>
              . Ready in 24-48 hours. Starting at just $30.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn delay={300}>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={getWhatsAppUrl(
                  "Hi! I'm interested in getting my online store built. Can we discuss?"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-base font-bold py-3.5 px-7 rounded-xl shadow-lg shadow-green-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Chat With Us on WhatsApp
              </a>
              <a
                href="#pricing"
                className="px-7 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all text-base text-center"
              >
                See Pricing
              </a>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-sm pt-6">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-indigo-500" />
                <span>Ready in 24-48 hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-green-500" />
                <span>Free consultation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Headphones size={14} className="text-purple-500" />
                <span>Ongoing support</span>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              How It Works
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              From idea to live store in 4 simple steps.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-px bg-slate-200" />

            <ScrollFadeIn>
              <ProcessStep
                number={1}
                icon={<MessageCircle size={22} />}
                title="Tell Us About Your Business"
                description="Message us on WhatsApp. Tell us what you sell, your brand name, and any special requirements."
                color="green"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={150}>
              <ProcessStep
                number={2}
                icon={<Wrench size={22} />}
                title="We Build Your Store"
                description="We set up your store, add products, apply your branding, and build custom features for your business."
                color="indigo"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <ProcessStep
                number={3}
                icon={<Globe size={22} />}
                title="Review & Go Live"
                description="You review your store, request any changes, and we connect your custom domain."
                color="purple"
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={450}>
              <ProcessStep
                number={4}
                icon={<Zap size={22} />}
                title="Start Getting Orders"
                description="Share your store link and start receiving orders directly on WhatsApp!"
                color="amber"
              />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-20 md:py-24 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Simple, Affordable Pricing
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              One-time setup fee. No hidden charges. No monthly subscriptions
              required.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Starter */}
            <ScrollFadeIn>
              <PricingCard
                name="Starter"
                price="$30"
                period="one-time"
                description="Perfect for getting started quickly"
                features={[
                  "Complete store setup",
                  "Up to 10 products",
                  "WhatsApp ordering",
                  "Subdomain (store.orderviachat.com)",
                  "Basic branding (logo + colors)",
                  "Mobile-optimized",
                ]}
                ctaMessage="Hi! I'm interested in the Starter plan ($30) for my store. Can you help me set it up?"
                highlight={false}
              />
            </ScrollFadeIn>

            {/* Pro — highlighted */}
            <ScrollFadeIn delay={150}>
              <PricingCard
                name="Pro"
                price="$80"
                period="one-time"
                description="Most popular — everything your business needs"
                features={[
                  "Everything in Starter",
                  "Up to 50 products",
                  "Custom domain (yourstore.com)",
                  "Full brand customization",
                  "1 custom feature for your brand",
                  "Social media assets",
                  "Priority support",
                ]}
                ctaMessage="Hi! I'm interested in the Pro plan ($80) with a custom domain. Can we discuss?"
                highlight={true}
                badge="Most Popular"
              />
            </ScrollFadeIn>

            {/* Premium */}
            <ScrollFadeIn delay={300}>
              <PricingCard
                name="Premium"
                price="$150"
                period="one-time"
                description="The complete package for serious businesses"
                features={[
                  "Everything in Pro",
                  "Unlimited products",
                  "Up to 3 custom features",
                  "Android app (Google Play)",
                  "Social media starter kit",
                  "30 days free support",
                  "Priority feature requests",
                ]}
                ctaMessage="Hi! I'm interested in the Premium plan ($150) with an Android app. Let's discuss!"
                highlight={false}
              />
            </ScrollFadeIn>
          </div>

          <ScrollFadeIn delay={400}>
            <div className="text-center mt-10">
              <p className="text-slate-400 text-sm">
                All plans include free consultation. Need something different?{" "}
                <a
                  href={getWhatsAppUrl(
                    "Hi! I have a custom requirement for my store. Can we discuss a tailored plan?"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2"
                >
                  Let&apos;s talk
                </a>
              </p>
            </div>
          </ScrollFadeIn>

          {/* Monthly Add-on */}
          <ScrollFadeIn delay={500}>
            <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2">
                    <Headphones size={12} />
                    ADD-ON
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Monthly Maintenance
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Product updates, menu changes, feature tweaks, and priority
                    WhatsApp support — we handle everything.
                  </p>
                </div>
                <div className="text-center md:text-right shrink-0">
                  <div className="text-3xl font-extrabold text-slate-900">
                    $10
                    <span className="text-base font-medium text-slate-400">
                      /mo
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ─── Custom Features Showcase ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-4">
              <Sparkles size={12} />
              TAILORED TO YOUR BUSINESS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Custom Features for{" "}
              <span className="text-gradient">YOUR Brand</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              We don&apos;t do generic templates. Tell us how your business
              works — we build features that match exactly that.
            </p>
          </ScrollFadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ScrollFadeIn>
              <CustomFeatureCard
                icon={<UtensilsCrossed size={22} className="text-orange-600" />}
                bgColor="bg-orange-50"
                title="Restaurants & Cafés"
                features={[
                  "AI-powered menu suggestions",
                  "Meal combo builder",
                  "Table reservation system",
                  "Daily specials management",
                ]}
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <CustomFeatureCard
                icon={<Scissors size={22} className="text-pink-600" />}
                bgColor="bg-pink-50"
                title="Salons & Barbers"
                features={[
                  "Appointment booking system",
                  "Service + time slots",
                  "Staff availability calendar",
                  "Before/after gallery",
                ]}
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <CustomFeatureCard
                icon={<Palette size={22} className="text-purple-600" />}
                bgColor="bg-purple-50"
                title="Bakeries & Caterers"
                features={[
                  "Custom cake order form",
                  "Size & flavor picker",
                  "Event catering packages",
                  "Pre-order scheduling",
                ]}
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <CustomFeatureCard
                icon={<Smartphone size={22} className="text-blue-600" />}
                bgColor="bg-blue-50"
                title="Phone & Electronics"
                features={[
                  "Device trade-in estimator",
                  "Installment calculator",
                  "Product comparison tool",
                  "Warranty tracker",
                ]}
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={400}>
              <CustomFeatureCard
                icon={<Package size={22} className="text-emerald-600" />}
                bgColor="bg-emerald-50"
                title="Grocery & Retail"
                features={[
                  "Recurring weekly basket",
                  "Bulk order discounts",
                  "Delivery zone calculator",
                  "Stock availability badge",
                ]}
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={500}>
              <CustomFeatureCard
                icon={<Truck size={22} className="text-indigo-600" />}
                bgColor="bg-indigo-50"
                title="Any Business"
                features={[
                  "Custom order forms",
                  "Loyalty / punch cards",
                  "Multi-language support",
                  "Whatever YOU need",
                ]}
              />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Comparison Table ─── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Why Choose Us?
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              See how we compare to the alternatives.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left py-4 px-5 font-bold text-slate-900">
                      Feature
                    </th>
                    <th className="text-center py-4 px-5 font-bold text-indigo-600 bg-indigo-50/50">
                      OrderViaChat
                    </th>
                    <th className="text-center py-4 px-5 font-bold text-slate-500">
                      Shopify
                    </th>
                    <th className="text-center py-4 px-5 font-bold text-slate-500">
                      Freelancer
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <ComparisonRow
                    feature="Setup Cost"
                    us="$30 – $150"
                    shopify="$0 (but $39/mo)"
                    freelancer="$500 – $2,000+"
                  />
                  <ComparisonRow
                    feature="Monthly Cost"
                    us="$0 – $10/mo"
                    shopify="$39 – $399/mo"
                    freelancer="$50 – $200/mo"
                  />
                  <ComparisonRow
                    feature="Ready In"
                    us="24 – 48 hours"
                    shopify="Days (DIY)"
                    freelancer="2 – 6 weeks"
                  />
                  <ComparisonRow
                    feature="Custom Features"
                    us="✅ Built for your brand"
                    shopify="❌ Generic plugins"
                    freelancer="✅ But expensive"
                  />
                  <ComparisonRow
                    feature="WhatsApp Ordering"
                    us="✅ Built-in"
                    shopify="❌ Needs plugin"
                    freelancer="⚠️ Extra cost"
                  />
                  <ComparisonRow
                    feature="Custom Domain"
                    us="✅ Included (Pro+)"
                    shopify="✅ Included"
                    freelancer="✅ Extra cost"
                  />
                  <ComparisonRow
                    feature="Android App"
                    us="✅ Available"
                    shopify="❌ Not included"
                    freelancer="⚠️ $1,000+"
                  />
                  <ComparisonRow
                    feature="You Do The Work"
                    us="❌ We handle it"
                    shopify="✅ All on you"
                    freelancer="❌ They handle it"
                  />
                </tbody>
              </table>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollFadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <HelpCircle size={20} className="text-indigo-600" />
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide">
                FAQ
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Common Questions
            </h2>
          </ScrollFadeIn>

          <div className="space-y-3">
            <ScrollFadeIn>
              <FAQItem
                question="What exactly do I get?"
                answer="A complete, live online store with your products, branding, WhatsApp ordering, and any custom features your business needs. You send us the details, we deliver a ready-to-use store."
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <FAQItem
                question="Do I need any technical knowledge?"
                answer="Not at all. We handle everything — setup, design, domain connection, and custom features. You just need to tell us about your business and products."
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <FAQItem
                question="What are custom features?"
                answer="Features built specifically for how YOUR business works. For example, a cake customizer for bakeries, an appointment system for salons, or an installment calculator for electronics shops. We tailor the store to match your workflow."
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <FAQItem
                question="Can I make changes after the store is live?"
                answer="Yes! You get access to an easy admin panel to update products and prices yourself. For bigger changes, our $10/mo maintenance add-on covers unlimited updates."
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={400}>
              <FAQItem
                question="How does payment work?"
                answer="Payments go directly between you and your customers (cash, bank transfer, or whatever you prefer). We don't take any commission on your sales — ever."
              />
            </ScrollFadeIn>
            <ScrollFadeIn delay={500}>
              <FAQItem
                question="What if I'm not happy with the result?"
                answer="We work with you until you're satisfied. You review the store before it goes live, and we'll make adjustments based on your feedback at no extra cost."
              />
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 md:py-28 bg-gradient-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.3),transparent_60%)]" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <ScrollFadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold border border-white/10 mb-6">
              <Sparkles size={12} />
              <span>Limited-time launch pricing</span>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={100}>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Ready to Get Your
              <br />
              <span className="text-indigo-400">Store Built?</span>
            </h2>
          </ScrollFadeIn>

          <ScrollFadeIn delay={200}>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              Message us on WhatsApp right now. Tell us about your business
              and we&apos;ll get back to you within hours with a plan.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getWhatsAppUrl(
                  "Hi! I want to get my online store built. Here's what I sell: "
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-lg font-bold py-4 px-10 rounded-xl shadow-xl shadow-green-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all inline-flex items-center gap-2"
              >
                <MessageCircle size={20} />
                Chat With Us Now
              </a>
              <Link href="/">
                <button className="text-white/70 hover:text-white text-base font-medium py-4 px-6 rounded-xl transition-all hover:bg-white/5 inline-flex items-center gap-2">
                  Back to Home <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={400}>
            <div className="flex items-center justify-center gap-6 mt-8 text-slate-400 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400" />
                Free consultation
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400" />
                24-48hr delivery
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400" />
                Zero commission
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
                WhatsApp. We build your store for you.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white transition-colors"
                    >
                      Home
                    </Link>
                  </li>
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
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Services</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#pricing" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href={getWhatsAppUrl("Hi! I need a custom store built.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Get a Store
                    </a>
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
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund"
                      className="hover:text-white transition-colors"
                    >
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <a
                      href="mailto:support@orderviachat.com"
                      className="hover:text-white transition-colors"
                    >
                      Contact Us
                    </a>
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
    </main>
  );
}

/* ─── Sub-components ─── */

function ProcessStep({
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
    green: "bg-green-50 text-green-600",
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
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
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
        {number}
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-[220px] mx-auto">
        {description}
      </p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  ctaMessage,
  highlight,
  badge,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaMessage: string;
  highlight: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
        highlight
          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/25 scale-[1.02]"
          : "bg-white border border-slate-200 hover:shadow-xl"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold bg-amber-400 text-amber-900 px-3 py-1 rounded-full shadow">
          ⭐ {badge}
        </span>
      )}
      <h3
        className={`text-lg font-bold mb-1 ${
          highlight ? "text-white" : "text-slate-900"
        }`}
      >
        {name}
      </h3>
      <p
        className={`text-sm mb-4 ${
          highlight ? "text-indigo-200" : "text-slate-400"
        }`}
      >
        {description}
      </p>
      <div className="mb-6">
        <span className="text-4xl font-extrabold">{price}</span>
        <span
          className={`text-sm ml-1 ${
            highlight ? "text-indigo-200" : "text-slate-400"
          }`}
        >
          {period}
        </span>
      </div>
      <ul className="space-y-2.5 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <CheckCircle2
              size={16}
              className={`shrink-0 mt-0.5 ${
                highlight ? "text-indigo-300" : "text-green-500"
              }`}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={getWhatsAppUrl(ctaMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all active:scale-95 ${
          highlight
            ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
        }`}
      >
        <MessageCircle size={16} />
        Get Started
      </a>
    </div>
  );
}

function CustomFeatureCard({
  icon,
  bgColor,
  title,
  features,
}: {
  icon: React.ReactNode;
  bgColor: string;
  title: string;
  features: string[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div
        className={`w-11 h-11 ${bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-sm text-slate-500"
          >
            <CheckCircle2 size={14} className="text-green-500 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComparisonRow({
  feature,
  us,
  shopify,
  freelancer,
}: {
  feature: string;
  us: string;
  shopify: string;
  freelancer: string;
}) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="py-3.5 px-5 font-medium text-slate-700">{feature}</td>
      <td className="py-3.5 px-5 text-center font-semibold text-indigo-600 bg-indigo-50/30">
        {us}
      </td>
      <td className="py-3.5 px-5 text-center text-slate-500">{shopify}</td>
      <td className="py-3.5 px-5 text-center text-slate-500">{freelancer}</td>
    </tr>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors">
      <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-slate-900 text-sm select-none list-none">
        {question}
        <ChevronDown
          size={18}
          className="text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-4"
        />
      </summary>
      <div className="px-6 pb-4 text-sm text-slate-500 leading-relaxed">
        {answer}
      </div>
    </details>
  );
}
