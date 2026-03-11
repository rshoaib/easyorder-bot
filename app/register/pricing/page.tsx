'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Loader2,
  Check,
  ShoppingBag,
  Smartphone,
  Globe,
  Headphones,
  Clock,
  Zap,
  Star,
  Shield,
  ArrowRight,
  Sparkles,
  MessageCircle,
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

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Offer ends on the last day of current month
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const updateTimer = () => {
      const diff = endOfMonth.getTime() - new Date().getTime();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 text-xs font-mono">
      {[
        { val: timeLeft.days, label: 'D' },
        { val: timeLeft.hours, label: 'H' },
        { val: timeLeft.minutes, label: 'M' },
        { val: timeLeft.seconds, label: 'S' },
      ].map(({ val, label }) => (
        <div key={label} className="flex items-center gap-0.5">
          <span className="bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5 font-bold text-white tabular-nums">
            {String(val).padStart(2, '0')}
          </span>
          <span className="text-white/70 text-[10px]">{label}</span>
        </div>
      ))}
    </div>
  );
}

function PricingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const tenantId = searchParams.get('tenantId');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubscribe = async () => {
    if (!tenantId) {
      alert('No Store ID found. Please register first.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout: ' + (data.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
      setLoading(false);
    }
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

        {/* Discount Banner */}
        <div
          className={`mx-auto max-w-lg mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3 sm:p-4 text-center shadow-lg shadow-amber-500/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
                Launch Offer — 50% OFF
              </span>
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <p className="text-white/90 text-xs mb-2">Limited time offer. Price goes back to $20/mo soon.</p>
            <CountdownTimer />
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

        {canceled && (
          <div className="mb-6 max-w-lg mx-auto bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-sm text-amber-300 text-center">
            Checkout canceled — no worries, you can try again below.
          </div>
        )}

        {/* Main Content Grid */}
        <div
          className={`grid lg:grid-cols-2 gap-8 items-start transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Features Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Everything included
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

          {/* Pricing Card Column */}
          <div className="lg:sticky lg:top-8">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-cyan-500 rounded-2xl blur-lg opacity-20 animate-pulse" />
              
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>

                <div className="text-center mt-2">
                  <h3 className="text-xl font-bold text-white">Pro Plan</h3>
                  
                  {/* Price with discount */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <span className="text-2xl font-medium text-slate-500 line-through">$20</span>
                    <div className="flex items-baseline">
                      <span className="text-5xl sm:text-6xl font-extrabold text-white">$10</span>
                      <span className="ml-1 text-lg text-slate-400">/mo</span>
                    </div>
                  </div>

                  <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-semibold">50% OFF — Save $120/year</span>
                  </div>

                  <p className="mt-3 text-indigo-400 text-sm font-semibold flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    14-day free trial included
                  </p>
                </div>

                {/* Quick feature checklist */}
                <div className="mt-6 space-y-2.5">
                  {[
                    'Unlimited orders & customers',
                    'Real-time order tracking board',
                    'Custom domain (yourbrand.com)',
                    'WhatsApp-first ordering',
                    'Priority WhatsApp support',
                    'Free store setup by our team',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:via-indigo-400 hover:to-emerald-400 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Start Free Trial
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-slate-500">
                  No credit card required to start • Cancel anytime
                </p>

                {/* Trust badges */}
                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> SSL Secured
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Instant Access
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" /> 4.9★ Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-4 text-center text-xs text-slate-500">
              <p>
                Trusted by <span className="text-emerald-400 font-semibold">200+</span> restaurants worldwide
              </p>
            </div>
          </div>
        </div>

        {/* FAQ / Objection handling */}
        <div
          className={`mt-16 max-w-2xl mx-auto transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h2 className="text-center text-lg font-semibold text-white/80 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Do I need technical skills to set up?',
                a: 'Not at all! We set up your entire store for you — menu, design, WhatsApp integration — all for free.',
              },
              {
                q: 'Can I cancel anytime?',
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
