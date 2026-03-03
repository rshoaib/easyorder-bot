'use client';

import { useState } from 'react';
import { MessageCircle, Headphones, Package, Settings, Sparkles, X } from 'lucide-react';

const WHATSAPP_URL = `https://wa.me/923224609117?text=${encodeURIComponent("Hi! I need help setting up my store on OrderViaChat. Can you set it up for me?")}`;

interface Props {
    storeName?: string;
    variant?: 'dashboard' | 'empty-menu';
}

export default function SetupHelpBanner({ storeName, variant = 'dashboard' }: Props) {
    const [dismissed, setDismissed] = useState(false);
    
    if (dismissed) return null;

    // Compact banner for the dashboard
    if (variant === 'dashboard') {
        return (
            <div className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-2xl p-5 mb-6 overflow-hidden">
                {/* Dismiss */}
                <button 
                    onClick={() => setDismissed(true)}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/60 transition-colors"
                    aria-label="Dismiss"
                >
                    <X size={16} />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                            <Headphones size={22} className="text-white" />
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-gray-900 text-base mb-0.5">
                            Need Help? We&apos;ll Set Up Everything For You! 🎯
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Just send us your products &amp; logo on WhatsApp — we&apos;ll configure your store, 
                            add products, and get you selling. <strong className="text-emerald-700">Starting at just $15.</strong>
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-5 rounded-xl shadow-md shadow-green-200 transition-all hover:scale-[1.02] active:scale-95 text-sm whitespace-nowrap"
                        >
                            <MessageCircle size={16} />
                            Chat with Us
                        </a>
                    </div>
                </div>

                {/* Quick features row */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-emerald-100">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-white/70 rounded-lg px-2.5 py-1.5 font-medium">
                        <Package size={12} className="text-emerald-500" /> Add Products
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-white/70 rounded-lg px-2.5 py-1.5 font-medium">
                        <Settings size={12} className="text-blue-500" /> Configure Settings
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-white/70 rounded-lg px-2.5 py-1.5 font-medium">
                        <Sparkles size={12} className="text-purple-500" /> Custom Features
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-white/70 rounded-lg px-2.5 py-1.5 font-medium">
                        <Headphones size={12} className="text-orange-500" /> Ongoing Support
                    </span>
                </div>
            </div>
        );
    }

    // Empty menu state — more prominent, like an illustration-based CTA
    return (
        <div className="text-center py-12 px-6">
            <div className="max-w-md mx-auto">
                {/* Visual icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100/50">
                    <Package size={36} className="text-indigo-400" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    No Products Yet
                </h2>
                <p className="text-gray-500 mb-6 leading-relaxed">
                    Add your products to start receiving orders. 
                    Or let our team handle everything for you!
                </p>

                {/* Two options */}
                <div className="space-y-3">
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-5 rounded-xl shadow-md shadow-green-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-sm"
                    >
                        <MessageCircle size={16} />
                        Set Up My Store For Me — From $15
                    </a>
                    <p className="text-xs text-gray-400 mt-2">
                        Just send us your product photos &amp; prices on WhatsApp. We&apos;ll do the rest!
                    </p>
                </div>

                {/* What you get */}
                <div className="mt-8 bg-gray-50 rounded-xl p-4 text-left">
                    <h4 className="font-bold text-gray-700 text-sm mb-3">What&apos;s Included:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                            We add all your products with images &amp; descriptions
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                            Logo, colors, and store branding setup
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                            Currency, delivery fees, and payment options
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                            Ready to share with customers in 24 hours
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
