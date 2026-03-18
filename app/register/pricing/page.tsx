'use client';

import { Suspense, useEffect, useState } from 'react';
import {
  Loader2,
  Check,
  ShoppingBag,
  Smartphone,
  Globe,
  Headphones,
  Zap,
  Star,
  MessageCircle,
  Gift,
  Copy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Crown,
} from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Unlimited Orders',
    desc: 'No caps, no limits — handle as many orders as your business needs.',
  },
  {
    icon: Smartphone,
    title: 'Digital Order Board',
    desc: 'Real-time order tracking dashboard so you never miss an order.',
  },
  {
    icon: Globe,
    title: 'Custom Domain',
    desc: 'Use your own domain (e.g., menu.yourstore.com) for a professional brand.',
  },
  {
    icon: Headphones,
    title: 'Priority Support',
    desc: 'Get help fast via WhatsApp — we respond within hours, not days.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Ordering',
    desc: 'Customers order via WhatsApp — the app they already use every day.',
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    desc: 'Go live in under 10 minutes. We even set it up for you — free.',
  },
];

function PricingContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:py-16">

        {/* Free Banner */}
        <div
          className={`mx-auto max-w-lg mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-3 sm:p-4 text-center shadow-lg shadow-emerald-500/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Gift className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
                Start Free — Upgrade Anytime
              </span>
            </div>
            <p className="text-white/90 text-xs">All core features included free. Go Pro for premium support & custom domains.</p>
          </div>
        </div>

        {/* Header */}
        <div
          className={`text-center mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Turn WhatsApp into your
            <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              ordering machine
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            Stop losing orders to expensive delivery apps. Let customers order directly via WhatsApp — zero commissions, zero complexity.
          </p>
        </div>

        {/* Main Content Grid */}
        <div
          className={`grid lg:grid-cols-2 gap-8 items-start transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Features Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Everything you need to grow
            </h2>
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div
                  key={feature.title}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Cards Column */}
          <div className="space-y-6 lg:sticky lg:top-8">

            {/* FREE Plan */}
            <div className="relative bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Free Plan</h3>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                  Free Forever
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-slate-400">/mo</span>
              </div>
              <div className="space-y-2 mb-6">
                {[
                  'Up to 50 orders/month',
                  'Product catalog with images',
                  'WhatsApp ordering',
                  'Basic order tracking',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <a
                href="/register"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* PRO Plan */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-cyan-500 rounded-2xl blur-lg opacity-20 animate-pulse" />
              
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/30 uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Recommended
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="text-lg font-bold text-white">Pro Plan</h3>
                  <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20">
                    Most Popular
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-white">$10</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <p className="text-emerald-400 text-xs font-semibold mb-4 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Everything in Free, plus:
                </p>

                <div className="space-y-2 mb-6">
                  {[
                    'Unlimited orders & customers',
                    'Real-time order tracking board',
                    'Custom domain (yourbrand.com)',
                    'Multi-currency support',
                    'Product sizes & variants',
                    'Promotional tools & coupons',
                    'Store blog for SEO',
                    'Priority WhatsApp support',
                    'Free complete store setup',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>

                {/* WhatsApp Subscribe CTA */}
                <a
                  href="https://wa.me/923224609117?text=Hi!%20I%20want%20to%20subscribe%20to%20OrderViaChat%20Pro%20%28%2410%2Fmo%29.%20Please%20set%20up%20my%20store!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Subscribe via WhatsApp
                </a>

                <p className="mt-3 text-center text-xs text-slate-500">
                  Message us to get started • Cancel anytime
                </p>
              </div>
            </div>

            {/* Bank Transfer Alternative */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-3 text-center">
                💳 Prefer bank transfer? Send payment directly:
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Account Title</span>
                  <span className="text-slate-300 font-medium">RIZWAN SHOAIB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bank</span>
                  <span className="text-slate-300 font-medium text-right">Askari Bank, Johar Town, Lahore</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Account #</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 font-mono text-[11px]">01000100579994</span>
                    <button
                      onClick={() => handleCopy('01000100579994', 'account')}
                      className="text-slate-500 hover:text-emerald-400 transition-colors"
                      title="Copy"
                    >
                      {copied === 'account' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 shrink-0">IBAN</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 font-mono text-[11px]">PK48ASCM0001000100579994</span>
                    <button
                      onClick={() => handleCopy('PK48ASCM0001000100579994', 'iban')}
                      className="text-slate-500 hover:text-emerald-400 transition-colors"
                      title="Copy"
                    >
                      {copied === 'iban' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="text-center text-xs text-slate-500">
              <p>
                Trusted by <span className="text-emerald-400 font-semibold">200+</span> businesses worldwide
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div
          className={`mt-16 max-w-2xl mx-auto transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h2 className="text-center text-lg font-semibold text-white/80 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Is there really a free plan?',
                a: 'Yes! The free plan lets you accept up to 50 orders per month with all the basics. Upgrade to Pro anytime for unlimited orders and premium features.',
              },
              {
                q: 'Do I need technical skills to set up?',
                a: 'Not at all! We set up your entire store for you — menu, design, WhatsApp integration — all for free.',
              },
              {
                q: 'Can I cancel the Pro plan anytime?',
                a: 'Yes! No contracts, no commitments. Cancel with one click whenever you want.',
              },
              {
                q: 'How do my customers order?',
                a: 'They visit your online menu, pick items, and the order goes straight to your WhatsApp — simple!',
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <summary className="px-5 py-3.5 text-sm font-medium text-white cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-slate-500 group-open:rotate-45 transition-transform duration-200 text-lg">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
