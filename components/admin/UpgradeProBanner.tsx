'use client';

import { useState } from 'react';
import { Crown, X, ArrowRight, MessageCircle } from 'lucide-react';

interface Props {
  tenantId: string;
  slug: string;
}

export default function UpgradeProBanner({ tenantId, slug }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
      </div>

      <div className="relative px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl shrink-0">
            <Crown className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base">Upgrade to Pro</h3>
            <p className="text-indigo-100 text-xs sm:text-sm mt-0.5">
              Unlimited products, custom domain &amp; priority support — <span className="font-bold text-white">$10/mo</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://wa.me/923224609117?text=Hi!%20I%20want%20to%20upgrade%20to%20OrderViaChat%20Pro!"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="flex items-center gap-1.5 bg-white text-indigo-700 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm">
              <MessageCircle className="w-3.5 h-3.5" />
              Subscribe via WhatsApp
            </button>
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
