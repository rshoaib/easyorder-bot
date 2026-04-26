'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/dictionaries';

interface Props {
    value: Locale;
    onChange: (next: Locale) => void;
    /** Used to scope the localStorage key per-store. */
    slug?: string;
    className?: string;
}

/**
 * Compact flag + chevron picker for the customer-facing storefront.
 *
 * Click → dropdown of supported locales with flags. Clicking one updates
 * the parent's state AND writes to localStorage (`ovc_locale_<slug>`) so
 * the cart page picks up the same choice on navigation.
 *
 * The merchant's per-tenant default (tenant.language) is still the seed;
 * this picker just lets a customer override for their session.
 */
export default function LanguagePicker({ value, onChange, slug, className = '' }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    function pick(next: Locale) {
        onChange(next);
        setOpen(false);
        if (slug) {
            try {
                localStorage.setItem(`ovc_locale_${slug}`, next);
            } catch { /* noop */ }
        }
    }

    const current = SUPPORTED_LOCALES.find((l) => l.code === value) ?? SUPPORTED_LOCALES[0];

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/90 backdrop-blur border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white shadow-sm"
                aria-label="Change language"
            >
                <Globe size={14} className="text-slate-400" />
                <span className="text-base leading-none">{current.flag}</span>
                <span className="hidden sm:inline">{current.label}</span>
                <ChevronDown size={12} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50"
                >
                    {SUPPORTED_LOCALES.map((l) => {
                        const active = l.code === value;
                        return (
                            <button
                                key={l.code}
                                type="button"
                                onClick={() => pick(l.code)}
                                className={`w-full flex items-center justify-between gap-2 px-3 h-9 text-sm transition ${
                                    active
                                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                        : 'text-slate-700 hover:bg-slate-50'
                                }`}
                                role="menuitem"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-base leading-none">{l.flag}</span>
                                    {l.label}
                                </span>
                                {active && <Check size={14} className="text-indigo-600" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
