'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";

export default function DemoAdminButton() {
    const pathname = usePathname();
    // Match the storefront's locale resolution so the floating widget
    // speaks the same language the customer just chose.
    const [locale, setLocale] = useState<Locale>('en');
    useEffect(() => {
        try {
            const stored = localStorage.getItem('ovc_locale_demo') as Locale | null;
            if (stored) setLocale(stored);
        } catch { /* noop */ }
    }, []);
    const t = getDictionary(locale);

    // Don't show if we are already in the admin section
    if (pathname.includes('/admin')) return null;

    return (
        <a 
          href="/store/demo/admin" 
          className="fixed bottom-24 right-4 z-50 group animate-in slide-in-from-bottom-5 duration-500"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping opacity-75 group-hover:opacity-0 transition-opacity" style={{ animationDuration: '3s' }} />
          
          <div className="relative bg-white/90 backdrop-blur-xl text-slate-900 pl-3.5 pr-4 py-3 rounded-2xl shadow-2xl shadow-indigo-500/15 font-semibold text-sm flex items-center gap-2.5 hover:scale-105 hover:shadow-indigo-500/25 transition-all border border-slate-200/80">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <LayoutDashboard size={16} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-slate-800">{t.seeMerchantView}</span>
              <span className="text-[10px] text-slate-400 font-medium">{t.whatStoreOwnersGet}</span>
            </div>
          </div>
        </a>
    );
}
