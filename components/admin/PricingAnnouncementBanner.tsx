'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

const DISMISSED_KEY = 'ovc_pricing_announcement_dismissed';

export default function PricingAnnouncementBanner() {
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === 'true');
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-amber-100 transition-colors text-amber-500"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>

      <div className="pr-8">
        <p className="font-bold text-amber-900 text-sm mb-1">
          📢 Pricing Update — Starting April 1, 2026
        </p>
        <p className="text-amber-800 text-sm leading-relaxed">
          OrderViaChat is now <strong>free to start</strong>! Upgrade to Pro for <strong>$10/month</strong> when you need unlimited features.
          As an early adopter, you&apos;ll get <strong>3 months free</strong> before billing starts.
          Questions?{' '}
          <a
            href="https://wa.me/923224609117?text=Hi!%20I%20saw%20the%20pricing%20update%20in%20my%20dashboard.%20Can%20you%20explain%20more%20about%20the%20new%20pricing%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-green-700 hover:text-green-800 underline underline-offset-2"
          >
            <MessageCircle size={14} />
            Chat with us on WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
