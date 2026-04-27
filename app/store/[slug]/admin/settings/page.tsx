import { getTenantRepository } from "@/lib/repository";
import { ArrowLeft, Save, Instagram, Facebook, Banknote, CheckCircle, CreditCard, Wallet, Truck, ShoppingBag, Users, Package } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";
import Link from "next/link";
import ServiceStatus from "@/components/admin/ServiceStatus";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
    searchParams: {
        saved?: string;
        error?: string;
    }
}

async function updateSettings(formData: FormData) {
    'use server';
    
    const slug = formData.get('slug') as string;
    const id = formData.get('id') as string;

    if (!id || !slug) return;

    let success = false;

    try {
        const { verifyTenantOwnership } = await import('@/lib/auth/security');
        const { createClient } = await import('@/utils/supabase/server');

        // Security: Verify ownership
        await verifyTenantOwnership(slug);

        let ownerPhone = formData.get('ownerPhone') as string;
        const instagram = formData.get('instagram') as string;
        const facebook = formData.get('facebook') as string;
        const metaPixelId = formData.get('metaPixelId') as string;
        const currency = formData.get('currency') as string;
        const storeType = formData.get('storeType') as string;
        
        // Payment methods
        const paypalLink = formData.get('paypalLink') as string;
        const stripeLink = formData.get('stripeLink') as string;
        const codEnabled = formData.get('codEnabled') === 'true';
        const jazzcashNumber = formData.get('jazzcashNumber') as string;
        const easypaisaNumber = formData.get('easypaisaNumber') as string;
        const deliveryFeeRaw = formData.get('deliveryFee') as string;
        const deliveryFee = deliveryFeeRaw ? parseFloat(deliveryFeeRaw) : 0;
        const minOrderRaw = formData.get('minOrderAmount') as string;
        const minOrderAmount = minOrderRaw ? parseFloat(minOrderRaw) : 0;
        const timezone = formData.get('timezone') as string;

        // Fulfillment methods
        const fulfillmentMethods = formData.getAll('fulfillmentMethods') as string[];
        const validFulfillment = fulfillmentMethods.length > 0 ? fulfillmentMethods : ['delivery'];
        
        // Checkbox is "true" if checked, null if unchecked
        const isOpen = formData.get('isOpen') === 'true';

        // --- Phone number normalization ---
        if (ownerPhone) {
            // Strip everything except digits and +
            ownerPhone = ownerPhone.replace(/[^\d+]/g, '');
            // Ensure single leading +
            if (!ownerPhone.startsWith('+') && ownerPhone.length > 0) {
                ownerPhone = '+' + ownerPhone;
            }
            // Remove any extra + signs after the first
            ownerPhone = '+' + ownerPhone.slice(1).replace(/\+/g, '');
        }
        
        // Security: Prevent modifying demo store
        if (slug === 'demo') {
            return;
        }

        // Use authenticated server client for RLS compliance
        const supabase = await createClient();
        const tenantRepo = getTenantRepository(supabase);
        await tenantRepo.updateTenantSettings(id, {
            ownerPhone, 
            instagramUrl: instagram, 
            facebookUrl: facebook, 
            metaPixelId, 
            currency, 
            isOpen, 
            storeType: storeType as "restaurant" | "retail" | "service" | "digital", 
            paypalLink, 
            stripeLink, 
            codEnabled, 
            jazzcashNumber,
            easypaisaNumber,
            deliveryFee,
            minOrderAmount,
            timezone,
            fulfillmentMethods: validFulfillment
        });
        success = true;
    } catch (err: any) {
        // Re-throw Next.js redirect/notFound errors — they use throw internally
        if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
            throw err;
        }
        console.error('[updateSettings] Error:', err?.message || err);
        // Redirect with error
        revalidatePath(`/store/${slug}/admin/settings`);
        redirect(`/store/${slug}/admin/settings?error=${encodeURIComponent(err?.message || 'Failed to save')}`);
    }

    revalidatePath(`/store/${slug}`);
    revalidatePath(`/store/${slug}/admin/settings`);
    redirect(`/store/${slug}/admin/settings?saved=1`);
}

import BrandingSettings from "./BrandingSettings";
import { DomainSettings } from "@/components/admin/DomainSettings";
import DeleteStoreButton from "@/components/admin/DeleteStoreButton";
import PhoneNumberInput from "@/components/admin/PhoneNumberInput";
import ToastHandler from "@/components/admin/ToastHandler";

export default async function SettingsPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { saved, error } = await searchParams;
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    if (!tenant) return <div>{getDictionary('en').adminStoreNotFound}</div>;
    const t = getDictionary(((tenant.language as Locale) || 'en'));

    return (
        <main className="container pt-1 pb-10" style={{ maxWidth: '800px' }}>
            <ToastHandler />
            <div className="flex justify-between mb-4 items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-1">{t.settingsTitle}</h1>
                    <p className="text-gray-500 text-sm">{t.settingsSubtitle}</p>
                </div>
                <Link href={`/store/${slug}/admin`}>
                    <button className="btn-secondary">
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                </Link>
            </div>

            <ServiceStatus />

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION 1: WhatsApp Number — Most Important Setting   */}
            {/* ═══════════════════════════════════════════════════════ */}
            <form action={updateSettings} className="space-y-8">
                <input type="hidden" name="id" value={tenant.id} />
                <input type="hidden" name="slug" value={slug} />

                <PhoneNumberInput 
                    name="ownerPhone" 
                    defaultValue={tenant.ownerPhone} 
                    disabled={slug === 'demo'}
                    slug={slug}
                />

                {/* ═══════════════════════════════════════════════════════ */}
                {/* SECTION 2: Store Configuration                        */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <span className="text-xl">🏪</span> {t.settingsStoreConfig}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">{t.settingsStoreConfigSub}</p>
                    </div>
                    <div className="p-5 space-y-5">
                        {/* Store Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Store Type (Preset)
                            </label>
                            <select 
                                name="storeType" 
                                defaultValue={tenant.storeType || 'restaurant'} 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium bg-white"
                            >
                                <option value="restaurant">Restaurant (Food & Drinks)</option>
                                <option value="retail">Retail (Physical Goods)</option>
                                <option value="service">Service (Bookings/Appointments)</option>
                                <option value="digital">Digital Products (Downloads)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                This changes the terminology used in your admin panel (e.g. &quot;Kitchen&quot; vs &quot;Fulfillment&quot;).
                            </p>
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Banknote size={16} className="text-gray-600" /> Store Currency
                            </label>
                            <select 
                                name="currency" 
                                defaultValue={tenant.currency || 'USD'} 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium bg-white"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="CAD">CAD (CA$) — Canadian Dollar</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="EGP">EGP (E£)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="PKR">PKR (₨)</option>
                                <option value="AED">AED (dh)</option>
                                <option value="SAR">SAR (﷼)</option>
                                <option value="MRU">MRU (UM)</option>
                                <option value="MUR">MUR (₨)</option>
                                <option value="ZAR">ZAR (R) — South African Rand</option>
                                <option value="NGN">NGN (₦) — Nigerian Naira</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                This symbol will be shown next to all your prices.
                            </p>
                        </div>

                        {/* Timezone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                🕐 Store Timezone
                            </label>
                            <select 
                                name="timezone" 
                                defaultValue={tenant.timezone || ''} 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium bg-white"
                            >
                                <option value="">Auto (UTC)</option>
                                <optgroup label="Africa">
                                    <option value="Africa/Johannesburg">South Africa (SAST, UTC+2)</option>
                                    <option value="Africa/Cairo">Egypt (EET, UTC+2)</option>
                                    <option value="Africa/Lagos">Nigeria (WAT, UTC+1)</option>
                                    <option value="Africa/Nairobi">Kenya (EAT, UTC+3)</option>
                                    <option value="Africa/Casablanca">Morocco (WET, UTC+0/+1)</option>
                                </optgroup>
                                <optgroup label="Americas">
                                    <option value="America/New_York">Eastern US (EST/EDT)</option>
                                    <option value="America/Chicago">Central US (CST/CDT)</option>
                                    <option value="America/Denver">Mountain US (MST/MDT)</option>
                                    <option value="America/Los_Angeles">Pacific US (PST/PDT)</option>
                                    <option value="America/Sao_Paulo">Brazil (BRT, UTC-3)</option>
                                    <option value="America/Mexico_City">Mexico City (CST, UTC-6)</option>
                                    <option value="America/Toronto">Canada Eastern (EST/EDT)</option>
                                </optgroup>
                                <optgroup label="Asia">
                                    <option value="Asia/Dubai">UAE (GST, UTC+4)</option>
                                    <option value="Asia/Riyadh">Saudi Arabia (AST, UTC+3)</option>
                                    <option value="Asia/Karachi">Pakistan (PKT, UTC+5)</option>
                                    <option value="Asia/Kolkata">India (IST, UTC+5:30)</option>
                                    <option value="Asia/Jakarta">Indonesia West (WIB, UTC+7)</option>
                                    <option value="Asia/Singapore">Singapore (SGT, UTC+8)</option>
                                    <option value="Asia/Tokyo">Japan (JST, UTC+9)</option>
                                    <option value="Asia/Shanghai">China (CST, UTC+8)</option>
                                </optgroup>
                                <optgroup label="Europe">
                                    <option value="Europe/London">UK (GMT/BST)</option>
                                    <option value="Europe/Paris">France/Germany (CET/CEST)</option>
                                    <option value="Europe/Istanbul">Turkey (TRT, UTC+3)</option>
                                    <option value="Europe/Moscow">Russia Moscow (MSK, UTC+3)</option>
                                </optgroup>
                                <optgroup label="Oceania">
                                    <option value="Australia/Sydney">Australia Eastern (AEST/AEDT)</option>
                                    <option value="Pacific/Auckland">New Zealand (NZST/NZDT)</option>
                                </optgroup>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                All order timestamps will display in this timezone.
                            </p>
                        </div>

                        {/* Delivery Fee */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                🚚 Delivery Fee
                            </label>
                            <input 
                                name="deliveryFee" 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                defaultValue={tenant.deliveryFee || 0} 
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium bg-white" 
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Set to 0 for free delivery. This fee will be added to every order at checkout.
                            </p>
                        </div>

                        {/* Minimum Order Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                📋 Minimum Order Amount
                            </label>
                            <input 
                                name="minOrderAmount" 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                defaultValue={tenant.minOrderAmount || 0} 
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium bg-white" 
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Set to 0 for no minimum. Customers won&apos;t be able to checkout below this amount.
                            </p>
                        </div>
                        {/* Store Status Toggle */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                                <h3 className="font-bold text-gray-900">{t.settingsStoreStatus}</h3>
                                <p className="text-sm text-gray-500">{t.settingsStoreStatusSub}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="isOpen" 
                                    defaultChecked={tenant.isOpen !== false} 
                                    value="true"
                                    className="sr-only peer" 
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Fix 4: Collapsible Advanced Settings */}
                <details className="group">
                    <summary className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">⚙️</span>
                            <div>
                                <h2 className="font-bold text-gray-900">{t.settingsAdvanced}</h2>
                                <p className="text-sm text-gray-500">{t.settingsAdvancedSub}</p>
                            </div>
                        </div>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200">▼</span>
                    </summary>
                    <div className="mt-4 space-y-6">

                {/* ═══════════════════════════════════════════════════════ */}
                {/* SECTION 3: Social Profiles                            */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <span className="text-xl">📱</span> Social Profiles
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Connect your social media to build trust.</p>
                    </div>
                    <div className="p-5 space-y-5">
                        {/* Instagram */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Instagram size={16} className="text-pink-600" /> Instagram URL
                            </label>
                            <input 
                                name="instagram" 
                                defaultValue={tenant.instagramUrl} 
                                placeholder="https://instagram.com/your-store"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium" 
                            />
                        </div>

                        {/* Facebook */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Facebook size={16} className="text-blue-600" /> Facebook URL
                            </label>
                            <input 
                                name="facebook" 
                                defaultValue={tenant.facebookUrl} 
                                placeholder="https://facebook.com/your-store"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium" 
                            />
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* SECTION 4: Marketing & Analytics                      */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <span className="text-xl">📊</span> Marketing & Analytics
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Track your visitors and run ads.</p>
                    </div>
                    <div className="p-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Meta Pixel ID
                            </label>
                            <input 
                                name="metaPixelId" 
                                defaultValue={tenant.metaPixelId} 
                                placeholder="e.g. 1234567890"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium font-mono" 
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Find this in your Facebook Events Manager. We&apos;ll automatically convert it into a tracking script.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* SECTION: Fulfillment / Shipping Methods               */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <Truck size={18} className="text-indigo-600" /> Shipping / Fulfillment Methods
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Choose how customers can receive their orders.</p>
                    </div>
                    <div className="p-5 space-y-4">
                        {[
                            { id: 'delivery', label: 'Delivery', desc: 'Deliver to customer address', icon: <Truck size={16} className="text-blue-600" /> },
                            { id: 'pickup', label: 'Pick Up', desc: 'Customer picks up from your location', icon: <ShoppingBag size={16} className="text-green-600" /> },
                            { id: 'meetup', label: 'Meet Up', desc: 'Agree on a meeting point with customer', icon: <Users size={16} className="text-orange-600" /> },
                            { id: 'post', label: 'Delivery by Post', desc: 'Ship via postal / courier service', icon: <Package size={16} className="text-purple-600" /> },
                        ].map((method) => (
                            <label key={method.id} className="flex items-center justify-between cursor-pointer">
                                <div className="flex items-center gap-3">
                                    {method.icon}
                                    <div>
                                        <h3 className="font-semibold text-gray-700 text-sm">{method.label}</h3>
                                        <p className="text-xs text-gray-500">{method.desc}</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    name="fulfillmentMethods"
                                    value={method.id}
                                    defaultChecked={(tenant.fulfillmentMethods || ['delivery']).includes(method.id)}
                                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* SECTION 5: Payment Methods                            */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <CreditCard size={18} className="text-indigo-600" /> Payment Methods
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Configure how customers can pay you.</p>
                    </div>
                    <div className="p-5 space-y-5">
                        {/* Cash on Delivery */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                                    💵 Cash on Delivery
                                </h3>
                                <p className="text-xs text-gray-500">Customers pay when they receive their order.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="codEnabled" 
                                    defaultChecked={tenant.codEnabled !== false} 
                                    value="true"
                                    className="sr-only peer" 
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        <div className="border-t border-gray-100"></div>

                        {/* PayPal.Me */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Wallet size={16} className="text-blue-600" /> PayPal.Me Link
                            </label>
                            <input 
                                name="paypalLink" 
                                defaultValue={tenant.paypalLink} 
                                placeholder="paypal.me/YourName"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium" 
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Paste your PayPal.Me link. Customers will be redirected to pay the order total.
                            </p>
                        </div>

                        {/* Stripe Payment Link */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <CreditCard size={16} className="text-purple-600" /> Stripe Payment Link
                            </label>
                            <input 
                                name="stripeLink" 
                                defaultValue={tenant.stripeLink} 
                                placeholder="https://buy.stripe.com/..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium" 
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Create a payment link in your Stripe Dashboard and paste it here.
                            </p>
                        </div>

                        <div className="border-t border-gray-100"></div>

                        {/* JazzCash */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold">JC</span> JazzCash Account Number
                            </label>
                            <input 
                                name="jazzcashNumber" 
                                defaultValue={tenant.jazzcashNumber} 
                                placeholder="03XX-XXXXXXX"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-gray-400 font-medium font-mono" 
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Your JazzCash mobile number. Customers will send payment to this number and can attach a payment slip.
                            </p>
                        </div>

                        {/* EasyPaisa */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-[10px] font-bold">EP</span> EasyPaisa Account Number
                            </label>
                            <input 
                                name="easypaisaNumber" 
                                defaultValue={tenant.easypaisaNumber} 
                                placeholder="03XX-XXXXXXX"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder:text-gray-400 font-medium font-mono" 
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Your EasyPaisa mobile number. Customers will send payment to this number and can attach a payment slip.
                            </p>
                        </div>
                    </div>
                </div>

                    </div>{/* end Advanced Settings inner div */}
                </details>{/* end Fix 4 collapsible */}

                {/* Save Button */}
                <div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                        <Save size={20} /> {t.settingsSaveAll}
                    </button>
                </div>
            </form>

            {/* Branding */}
            <div className="mt-8">
                <BrandingSettings 
                    tenantId={tenant.id} 
                    slug={slug} 
                    initialName={tenant.name}
                    initialThemeColor={tenant.themeColor} 
                    initialLogoUrl={tenant.logoUrl} 
                />
            </div>

            {/* Custom Domain (PRO) */}
            <div className="mt-8">
                <DomainSettings slug={slug} currentDomain={tenant.customDomain} />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-bold text-red-600 mb-2 uppercase tracking-wider">{t.settingsDangerZone}</h3>
                <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-red-900">{t.settingsDeleteStore}</h4>
                        <p className="text-sm text-red-700 mt-1">Once you delete a store, there is no going back. Please be certain.</p>
                    </div>
                    <DeleteStoreButton slug={slug} tenantId={tenant.id} />
                </div>
            </div>
        </main>
    );
}
