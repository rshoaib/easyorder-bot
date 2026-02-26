'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, Code2, Smartphone, Globe, Bot } from 'lucide-react';

export default function CustomDevPopup() {
    const [show, setShow] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Show after 30 seconds of inactivity on the page
        const timer = setTimeout(() => {
            if (!dismissed) setShow(true);
        }, 30000);
        return () => clearTimeout(timer);
    }, [dismissed]);

    if (!show || dismissed) return null;

    const phoneNumber = '923224609117';
    const message = encodeURIComponent('Hi! I visited OrderViaChat and I have a custom app development requirement. Can you help?');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDismissed(true)} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
                {/* Close */}
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 text-white">
                    <div className="flex items-center gap-2 text-white/70 text-xs font-bold mb-2">
                        <Code2 size={14} /> CUSTOM DEVELOPMENT
                    </div>
                    <h2 className="text-xl font-extrabold">
                        Need Something More Custom?
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                        We build tailored solutions at amazingly low rates
                    </p>
                </div>

                {/* Services */}
                <div className="p-6">
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <Globe size={16} className="text-blue-600" />
                            </div>
                            <span>Custom Web Applications & Websites</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                                <Smartphone size={16} className="text-purple-600" />
                            </div>
                            <span>Mobile Apps (iOS & Android)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                <Bot size={16} className="text-green-600" />
                            </div>
                            <span>WhatsApp Bots & Automation</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                <Code2 size={16} className="text-amber-600" />
                            </div>
                            <span>E-commerce & SaaS Solutions</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <MessageCircle size={18} />
                        Chat with Us on WhatsApp
                    </a>

                    <p className="text-center text-xs text-gray-400 mt-3">
                        Discounted rates for early customers • Free consultation
                    </p>
                </div>
            </div>
        </div>
    );
}
