import Link from 'next/link';
import { Suspense } from 'react';
import { CheckCircle2, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

/**
 * /register/pricing
 *
 * OrderViaChat is now 100% free. There is no paid tier to subscribe to.
 * The only paid offering is one-on-one customization, handled out-of-band
 * via WhatsApp / the /services page.
 *
 * This route used to host a $10/mo Pro signup flow; it now serves as a
 * friendly landing for anyone who lands here from an old email, bookmark,
 * or in-app upgrade button (now removed) and reassures them that the
 * product is free.
 */
export default function PricingPage() {
    return (
        <Suspense fallback={null}>
            <PricingContent />
        </Suspense>
    );
}

function PricingContent() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/40 flex items-center justify-center px-4 py-16">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
                    <Sparkles size={26} />
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
                    OrderViaChat is free.
                </h1>
                <p className="text-slate-500 leading-relaxed mb-6">
                    Every feature, for every store. No paid plans, no subscriptions, no
                    upgrade walls. Add as many products and orders as you need —
                    forever.
                </p>

                <ul className="text-left space-y-2.5 mb-8">
                    {[
                        'Unlimited products',
                        'Unlimited orders',
                        'Custom branding & logo',
                        'WhatsApp ordering',
                        'Order dashboard & history',
                        'Custom domain support',
                    ].map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            {f}
                        </li>
                    ))}
                </ul>

                <Link href="/login?view=signup">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 mb-3">
                        Create My Free Store <ArrowRight size={18} />
                    </button>
                </Link>

                <div className="border-t border-slate-100 pt-6 mt-6 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Need more?
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        We offer paid one-on-one customization — store setup, custom
                        features, or design tweaks — only when you ask for it.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/services">
                            <button className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors">
                                See customization services
                            </button>
                        </Link>
                        <a
                            href="https://wa.me/923224609117?text=Hi!%20I%27d%20like%20to%20discuss%20customization%20for%20my%20OrderViaChat%20store."
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg transition-colors">
                                <MessageCircle size={12} /> Chat on WhatsApp
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
