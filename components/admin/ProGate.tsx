'use client';

import { Lock, Crown, Sparkles, MessageCircle } from 'lucide-react';

interface ProGateProps {
    plan?: string;
    featureName: string;
    slug: string;
    children: React.ReactNode;
}

const PRO_FEATURES: Record<string, { title: string; benefits: string[] }> = {
    'Integrations': {
        title: 'Social Media Integrations',
        benefits: [
            'Auto-post products to Facebook',
            'Auto-post to Instagram Business',
            'Social media analytics dashboard',
            'Unified social inbox',
        ]
    },
    'Blog': {
        title: 'Store Blog',
        benefits: [
            'SEO-optimized blog posts',
            'Drive organic traffic to your store',
            'Build customer trust & authority',
            'Custom blog management',
        ]
    }
};

export default function ProGate({ plan, featureName, slug, children }: ProGateProps) {
    if (plan === 'pro') {
        return <>{children}</>;
    }

    const feature = PRO_FEATURES[featureName] || { title: featureName, benefits: [] };
    const phoneNumber = '923224609117';
    const message = encodeURIComponent(`Hi! I want to upgrade my store "${slug}" to PRO plan ($10/month). Feature: ${featureName}`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <div className="relative">
            {/* Blurred preview of the actual content */}
            <div 
                className="pointer-events-none select-none" 
                aria-hidden="true"
                style={{ 
                    filter: 'blur(6px) grayscale(0.3)',
                    opacity: 0.4,
                    maxHeight: '70vh',
                    overflow: 'hidden',
                    maskImage: 'linear-gradient(to bottom, black 20%, transparent 95%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 95%)',
                }}
            >
                {children}
            </div>

            {/* Upgrade overlay floating on top */}
            <div className="absolute inset-0 flex items-start justify-center pt-8 sm:pt-16 z-10">
                <div className="w-full max-w-lg mx-4">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 sm:px-8 py-8 text-center text-white relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                <div className="absolute top-4 left-8 w-20 h-20 rounded-full border-2 border-white" />
                                <div className="absolute bottom-2 right-12 w-14 h-14 rounded-full border-2 border-white" />
                                <div className="absolute top-8 right-24 w-8 h-8 rounded-full bg-white" />
                            </div>

                            <div className="relative">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Lock size={24} className="text-white" />
                                </div>
                                <h1 className="text-xl sm:text-2xl font-extrabold mb-1">
                                    Unlock {feature.title}
                                </h1>
                                <p className="text-white/80 text-sm">
                                    This feature is available on the PRO plan
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8">
                            {/* Plan comparison */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {/* Basic Plan */}
                                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                                    <div className="text-xs font-semibold text-gray-500 mb-1">BASIC</div>
                                    <div className="text-xl font-extrabold text-gray-900 mb-2">Free</div>
                                    <div className="text-xs text-gray-500">Current plan</div>
                                </div>

                                {/* Pro Plan */}
                                <div className="border-2 border-amber-400 rounded-xl p-4 bg-amber-50/50 relative">
                                    <div className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Crown size={9} /> RECOMMENDED
                                    </div>
                                    <div className="text-xs font-semibold text-amber-600 mb-1">PRO</div>
                                    <div className="text-xl font-extrabold text-gray-900 mb-1">$10<span className="text-xs font-medium text-gray-500">/mo</span></div>
                                    <div className="text-xs text-amber-600 font-medium">Everything unlocked</div>
                                </div>
                            </div>

                            {/* Benefits list */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Sparkles size={14} className="text-amber-500" />
                                    What you get with PRO
                                </h3>
                                <ul className="space-y-2.5">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <MessageCircle size={18} />
                                Upgrade via WhatsApp — $10/mo
                            </a>

                            <p className="text-center text-xs text-gray-400 mt-3">
                                Pay via JazzCash, Easypaisa, or PayPal. Activation within minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

