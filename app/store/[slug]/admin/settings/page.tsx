import { getTenantRepository } from "@/lib/repository";
import { ArrowLeft, Save, Instagram, Facebook, Banknote, CheckCircle, CreditCard, Wallet } from "lucide-react";
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
        await tenantRepo.updateTenantSettings(id, ownerPhone, instagram, facebook, metaPixelId, currency, undefined, undefined, isOpen, storeType, paypalLink, stripeLink, codEnabled);
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

export default async function SettingsPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { saved, error } = await searchParams;
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    return (
        <main className="container pt-6 pb-10" style={{ maxWidth: '800px' }}>
            <div className="flex justify-between mb-8 items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Store Settings</h1>
                    <p className="text-gray-500 text-sm">Manage your store profile and preferences</p>
                </div>
                <Link href={`/store/${slug}/admin`}>
                    <button className="btn-secondary">
                        <ArrowLeft size={16} />
                        Back to Orders
                    </button>
                </Link>
            </div>

            {saved && (
                <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-xl animate-fade-in">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                    <span className="font-medium">Settings saved successfully!</span>
                </div>
            )}

            {error && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-xl">
                    <span className="font-medium">Error: {decodeURIComponent(error)}</span>
                </div>
            )}

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
                            <span className="text-xl">🏪</span> Store Configuration
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Basic store settings and preferences.</p>
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
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="PKR">PKR (₨)</option>
                                <option value="AED">AED (dh)</option>
                                <option value="SAR">SAR (﷼)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                This symbol will be shown next to all your prices.
                            </p>
                        </div>

                        {/* Store Status Toggle */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                                <h3 className="font-bold text-gray-900">Store Status</h3>
                                <p className="text-sm text-gray-500">Close your store when you&apos;re busy.</p>
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
                    </div>
                </div>

                {/* Save Button */}
                <div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                        <Save size={20} /> Save All Settings
                    </button>
                </div>
            </form>

            {/* Branding */}
            <div className="mt-8">
                <BrandingSettings 
                    tenantId={tenant.id} 
                    slug={slug} 
                    initialThemeColor={tenant.themeColor} 
                    initialLogoUrl={tenant.logoUrl} 
                />
            </div>

            {/* Custom Domain (PRO) */}
            <div className="mt-8">
                <DomainSettings slug={slug} currentDomain={tenant.customDomain} />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-bold text-red-600 mb-2 uppercase tracking-wider">Danger Zone</h3>
                <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-red-900">Delete this store</h4>
                        <p className="text-sm text-red-700 mt-1">Once you delete a store, there is no going back. Please be certain.</p>
                    </div>
                    <DeleteStoreButton slug={slug} tenantId={tenant.id} />
                </div>
            </div>
        </main>
    );
}
