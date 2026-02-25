'use client';

import { useState, useEffect } from 'react';
import { Phone, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PhoneNumberInputProps {
    name: string;
    defaultValue?: string;
    disabled?: boolean;
    slug?: string;
}

const COUNTRY_CODES = [
    { code: '+1', country: '🇺🇸 US/CA', label: 'United States / Canada' },
    { code: '+44', country: '🇬🇧 UK', label: 'United Kingdom' },
    { code: '+91', country: '🇮🇳 India', label: 'India' },
    { code: '+92', country: '🇵🇰 PK', label: 'Pakistan' },
    { code: '+971', country: '🇦🇪 UAE', label: 'United Arab Emirates' },
    { code: '+966', country: '🇸🇦 SA', label: 'Saudi Arabia' },
    { code: '+49', country: '🇩🇪 DE', label: 'Germany' },
    { code: '+33', country: '🇫🇷 FR', label: 'France' },
    { code: '+34', country: '🇪🇸 ES', label: 'Spain' },
    { code: '+55', country: '🇧🇷 BR', label: 'Brazil' },
    { code: '+52', country: '🇲🇽 MX', label: 'Mexico' },
    { code: '+63', country: '🇵🇭 PH', label: 'Philippines' },
    { code: '+234', country: '🇳🇬 NG', label: 'Nigeria' },
    { code: '+27', country: '🇿🇦 ZA', label: 'South Africa' },
    { code: '+62', country: '🇮🇩 ID', label: 'Indonesia' },
    { code: '+60', country: '🇲🇾 MY', label: 'Malaysia' },
    { code: '+20', country: '🇪🇬 EG', label: 'Egypt' },
    { code: '+90', country: '🇹🇷 TR', label: 'Turkey' },
];

function normalizePhone(raw: string): string {
    // Strip everything except digits and leading +
    let cleaned = raw.replace(/[^\d+]/g, '');
    // Ensure single leading +
    if (cleaned.startsWith('+')) {
        cleaned = '+' + cleaned.slice(1).replace(/\+/g, '');
    } else if (cleaned.length > 0) {
        cleaned = '+' + cleaned;
    }
    return cleaned;
}

function getDigitsOnly(phone: string): string {
    return phone.replace(/[^\d]/g, '');
}

export default function PhoneNumberInput({ name, defaultValue, disabled, slug }: PhoneNumberInputProps) {
    const [phone, setPhone] = useState(defaultValue || '');
    const [isFocused, setIsFocused] = useState(false);

    const normalized = normalizePhone(phone);
    const digits = getDigitsOnly(normalized);
    const isValid = digits.length >= 7 && digits.length <= 15;
    const isEmpty = digits.length === 0;
    const whatsappUrl = `https://wa.me/${digits}?text=Test%20message%20from%20OrderViaChat`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Auto-prepend + if user starts typing digits
        if (val && !val.startsWith('+')) {
            val = '+' + val.replace(/^\++/, '');
        }
        setPhone(val);
    };

    const handleCountrySelect = (code: string) => {
        // If phone is empty or only has +, replace with country code
        if (!phone || phone === '+') {
            setPhone(code);
        } else {
            // Try to detect and replace existing country code
            const currentDigits = getDigitsOnly(phone);
            // If current value matches a known country code prefix, replace it
            const matchedCode = COUNTRY_CODES.find(c => {
                const codeDigits = getDigitsOnly(c.code);
                return currentDigits.startsWith(codeDigits);
            });
            if (matchedCode) {
                const oldCodeDigits = getDigitsOnly(matchedCode.code);
                const rest = currentDigits.slice(oldCodeDigits.length);
                setPhone(code + rest);
            } else {
                // Just prepend the new code to existing digits
                setPhone(code + currentDigits);
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                        <Phone size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg">WhatsApp Number</h2>
                        <p className="text-sm text-gray-600">This is where your orders are sent — <strong>most important setting!</strong></p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Country Code Quick-Pick */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Quick Select Country Code
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                        {COUNTRY_CODES.slice(0, 8).map((cc) => (
                            <button
                                key={cc.code}
                                type="button"
                                onClick={() => handleCountrySelect(cc.code)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                    normalized.startsWith(cc.code)
                                        ? 'bg-green-100 text-green-800 border-green-300 shadow-sm'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                }`}
                                title={cc.label}
                            >
                                {cc.country} {cc.code}
                            </button>
                        ))}
                        {/* Show More dropdown */}
                        <select
                            onChange={(e) => { if (e.target.value) handleCountrySelect(e.target.value); e.target.value = ''; }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200 cursor-pointer hover:bg-gray-100"
                            defaultValue=""
                        >
                            <option value="" disabled>More...</option>
                            {COUNTRY_CODES.slice(8).map((cc) => (
                                <option key={cc.code} value={cc.code}>{cc.country} {cc.code}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Phone Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Number with Country Code
                    </label>
                    <div className="relative">
                        <input
                            name={name}
                            type="tel"
                            value={phone}
                            onChange={handleChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            disabled={disabled}
                            placeholder="+1234567890"
                            className={`w-full px-4 py-3.5 rounded-xl border-2 font-mono text-lg font-medium outline-none transition-all ${
                                disabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                    : isEmpty
                                    ? 'border-amber-300 bg-amber-50/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
                                    : isValid
                                    ? 'border-green-300 bg-green-50/30 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
                                    : 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                            }`}
                        />
                        {/* Status Icon */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {!isEmpty && isValid && (
                                <CheckCircle2 size={22} className="text-green-500" />
                            )}
                            {!isEmpty && !isValid && (
                                <AlertTriangle size={22} className="text-red-400" />
                            )}
                            {isEmpty && (
                                <AlertTriangle size={22} className="text-amber-400" />
                            )}
                        </div>
                    </div>
                    {disabled && slug === 'demo' && (
                        <p className="text-xs text-gray-400 mt-2">This option is disabled for the demo store.</p>
                    )}
                </div>

                {/* Live Preview */}
                {!isEmpty && (
                    <div className={`rounded-xl p-3.5 flex items-center justify-between gap-3 ${
                        isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                        <div className="flex-1 min-w-0">
                            {isValid ? (
                                <>
                                    <p className="text-xs font-semibold text-green-700 mb-0.5">✅ WhatsApp link preview:</p>
                                    <p className="text-sm font-mono text-green-800 truncate">wa.me/{digits}</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs font-semibold text-red-700 mb-0.5">⚠️ Number looks too short</p>
                                    <p className="text-xs text-red-600">Please include your full country code + number (7–15 digits)</p>
                                </>
                            )}
                        </div>
                        {isValid && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                            >
                                Test <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                )}

                {/* Empty State Help */}
                {isEmpty && !disabled && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                        <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ No phone number set</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            Without a WhatsApp number, customers <strong>cannot send you orders</strong>. 
                            Enter your full number with country code (e.g. <code className="bg-amber-100 px-1 rounded">+1</code> for US, 
                            <code className="bg-amber-100 px-1 rounded">+44</code> for UK, 
                            <code className="bg-amber-100 px-1 rounded">+92</code> for PK).
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
