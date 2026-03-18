'use client';

import { registerTenant, checkSlugAvailability } from "@/app/actions/register-actions";
import { useTransition, useState, useCallback, useRef } from "react";
import { Loader2, ArrowRight, Store, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const STORE_PRESETS = [
    { key: 'pizza', icon: '🍕', label: 'Pizza / Restaurant' },
    { key: 'coffee', icon: '☕', label: 'Coffee / Café' },
    { key: 'burger', icon: '🍔', label: 'Burger / Fast Food' },
    { key: 'clothing', icon: '👗', label: 'Fashion / Retail' },
    { key: 'barber', icon: '✂️', label: 'Barber / Salon' },
    { key: 'ebook', icon: '📱', label: 'Digital Products' },
];

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30);
}

const COUNTRY_CODES = [
    { code: '+1', country: '🇺🇸 US/CA' },
    { code: '+44', country: '🇬🇧 UK' },
    { code: '+91', country: '🇮🇳 India' },
    { code: '+92', country: '🇵🇰 PK' },
    { code: '+971', country: '🇦🇪 UAE' },
    { code: '+966', country: '🇸🇦 SA' },
    { code: '+49', country: '🇩🇪 DE' },
    { code: '+33', country: '🇫🇷 FR' },
    { code: '+55', country: '🇧🇷 BR' },
    { code: '+234', country: '🇳🇬 NG' },
];

export default function RegisterForm({ userEmail }: { userEmail: string }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [storeName, setStoreName] = useState('');
    const [slug, setSlug] = useState('');
    const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('pizza');
    const [phone, setPhone] = useState('+');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();

    const checkSlug = useCallback((newSlug: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!newSlug || newSlug.length < 2) { setSlugStatus('idle'); return; }
        setSlugStatus('checking');
        debounceRef.current = setTimeout(async () => {
            try {
                const result = await checkSlugAvailability(newSlug);
                setSlugStatus(result.available ? 'available' : 'taken');
            } catch { setSlugStatus('idle'); }
        }, 500);
    }, []);

    const handleNameChange = (name: string) => {
        setStoreName(name);
        if (!slugManuallyEdited) {
            const generated = slugify(name);
            setSlug(generated);
            checkSlug(generated);
        }
    };

    const handleSlugChange = (value: string) => {
        const cleaned = slugify(value);
        setSlug(cleaned);
        setSlugManuallyEdited(true);
        checkSlug(cleaned);
    };

    const handlePhoneChange = (val: string) => {
        if (val && !val.startsWith('+')) val = '+' + val.replace(/^\++/, '');
        setPhone(val);
    };

    const handleCountrySelect = (code: string) => {
        if (!phone || phone === '+') {
            setPhone(code);
        } else {
            const digits = phone.replace(/[^\d]/g, '');
            setPhone(code + digits.slice(code.replace('+', '').length));
        }
    };

    const phoneDigits = phone.replace(/[^\d]/g, '');
    const phoneValid = phoneDigits.length >= 7 && phoneDigits.length <= 15;

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            try {
                const result = await registerTenant(formData);
                if (result.success) {
                    router.push(`/store/${result.slug}/admin`); 
                } else if (result.error) {
                    setError(result.error);
                }
            } catch (err) {
                setError("Something went wrong");
            }
        });
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">✓</div>
                    <span className="text-xs text-gray-400">Account</span>
                </div>
                <div className="flex-1 h-px bg-indigo-200 mx-3" />
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-xs font-bold text-indigo-600">Store Setup</span>
                </div>
            </div>

            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-200">
                    <Store size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Set up your store</h1>
                <p className="text-gray-500 mt-2 text-sm">Takes less than 30 seconds · We&apos;ll add products for you!</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-2">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            <form action={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input 
                        name="name" type="text" required value={storeName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Riz's Burgers" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-400 text-sm">
                            orderviachat.com/store/
                        </span>
                        <div className="relative flex-1">
                            <input 
                                name="slug" type="text" required value={slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                                placeholder="riz-burgers" 
                                className={`w-full px-4 py-3 rounded-r-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 min-w-0 bg-gray-50 focus:bg-white ${
                                    slugStatus === 'taken' ? 'border-red-300' : 
                                    slugStatus === 'available' ? 'border-green-300' : 'border-gray-200'
                                }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {slugStatus === 'checking' && <Loader2 size={16} className="animate-spin text-gray-400" />}
                                {slugStatus === 'available' && <CheckCircle size={16} className="text-green-500" />}
                                {slugStatus === 'taken' && <XCircle size={16} className="text-red-500" />}
                            </div>
                        </div>
                    </div>
                    {slugStatus === 'taken' && <p className="text-xs text-red-500 mt-1">This URL is already taken. Try another one.</p>}
                    {slugStatus === 'available' && slug && <p className="text-xs text-green-600 mt-1">✨ This URL is available!</p>}
                </div>

                {/* Fix 1: What do you sell? */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What do you sell?</label>
                    <input type="hidden" name="storePreset" value={selectedPreset} />
                    <div className="grid grid-cols-3 gap-2">
                        {STORE_PRESETS.map((preset) => (
                            <button
                                key={preset.key} type="button"
                                onClick={() => setSelectedPreset(preset.key)}
                                className={`p-3 rounded-xl border-2 transition-all text-center ${
                                    selectedPreset === preset.key
                                        ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-200'
                                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="text-2xl mb-1">{preset.icon}</div>
                                <div className={`text-xs font-bold ${selectedPreset === preset.key ? 'text-indigo-700' : 'text-gray-600'}`}>
                                    {preset.label}
                                </div>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Sparkles size={11} className="text-indigo-500" />
                        We&apos;ll auto-fill sample products — you can edit or replace them later.
                    </p>
                </div>

                {/* Fix 7: Country-code phone input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {COUNTRY_CODES.slice(0, 6).map((cc) => (
                            <button key={cc.code} type="button" onClick={() => handleCountrySelect(cc.code)}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all border ${
                                    phone.startsWith(cc.code)
                                        ? 'bg-green-100 text-green-800 border-green-300'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                {cc.country} {cc.code}
                            </button>
                        ))}
                        <select
                            onChange={(e) => { if (e.target.value) handleCountrySelect(e.target.value); e.target.value = ''; }}
                            className="px-2 py-1 rounded-lg text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200 cursor-pointer"
                            defaultValue=""
                        >
                            <option value="" disabled>More...</option>
                            {COUNTRY_CODES.slice(6).map((cc) => (
                                <option key={cc.code} value={cc.code}>{cc.country} {cc.code}</option>
                            ))}
                        </select>
                    </div>
                    <input 
                        name="ownerPhone" type="tel" required value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="+1234567890" 
                        className={`w-full px-4 py-3 rounded-xl border font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
                            phoneDigits.length === 0 ? 'border-gray-200 bg-gray-50' :
                            phoneValid ? 'border-green-300 bg-green-50/30' : 'border-amber-300 bg-amber-50/30'
                        }`}
                    />
                    {phoneValid && <p className="text-xs text-green-600 mt-1">✅ wa.me/{phoneDigits} — looks good!</p>}
                    {!phoneValid && phoneDigits.length > 0 && <p className="text-xs text-amber-600 mt-1">⚠️ Number looks short — include country code + full number</p>}
                    <p className="text-xs text-gray-400 mt-1">Orders will be sent to this number via WhatsApp.</p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-indigo-900 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-indigo-600" />
                            Get Started Free
                        </h3>
                        <span className="text-emerald-700 font-bold text-sm">Free to start</span>
                    </div>
                    <ul className="space-y-1.5 text-sm text-indigo-800">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-500 shrink-0"/> Unlimited Orders</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-500 shrink-0"/> WhatsApp Integration</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-500 shrink-0"/> Pre-filled product catalog</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-500 shrink-0"/> No credit card required</li>
                    </ul>
                </div>

                <button 
                    type="submit" 
                    disabled={isPending || slugStatus === 'taken' || !phoneValid}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : <>🚀 Create My Free Store <ArrowRight size={18} /></>}
                </button>
            </form>
        </div>
    );
}
