import { getTenantRepository } from "@/lib/repository";
import { ArrowLeft, Save, Instagram, Facebook, Phone } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

async function updateSettings(formData: FormData) {
    'use server';
    
    const tenantRepo = getTenantRepository();
    const id = formData.get('id') as string;
    const slug = formData.get('slug') as string;
    const ownerPhone = formData.get('ownerPhone') as string;
    const instagram = formData.get('instagram') as string;
    const facebook = formData.get('facebook') as string;
    const metaPixelId = formData.get('metaPixelId') as string;

    if (!id || !slug) return;

    await tenantRepo.updateTenantSettings(id, ownerPhone, instagram, facebook, metaPixelId);
    revalidatePath(`/store/${slug}`);
    revalidatePath(`/store/${slug}/admin/settings`);
}

export default async function SettingsPage({ params }: Props) {
    const { slug } = await params;
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    return (
        <main className="container pt-6 pb-10" style={{ maxWidth: '600px' }}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/store/${slug}/admin`}>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ArrowLeft size={24} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Store Settings</h1>
                    <p className="text-gray-500">Manage your store profile and links</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-gray-900">Social Profiles</h2>
                    <p className="text-sm text-gray-500 mt-1">Connect your social media to build trust.</p>
                </div>
                
                <form action={updateSettings} className="p-6 space-y-6">
                    <input type="hidden" name="id" value={tenant.id} />
                    <input type="hidden" name="slug" value={slug} />

                    {/* Owner Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                             <Phone size={16} className="text-green-600" /> WhatsApp Number (Store Owner)
                        </label>
                        <input 
                            name="ownerPhone" 
                            defaultValue={tenant.ownerPhone} 
                            placeholder="+1234567890"
                            disabled={slug === 'demo'}
                            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium font-mono ${slug === 'demo' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {slug === 'demo' ? 'This option is disabled for the demo store.' : 'Orders will be sent to this WhatsApp number. Format: +[CountryCode][Number]'}
                        </p>
                    </div>

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

                    <div className="pt-4 border-t border-gray-100"></div>

                    <div className="mb-2">
                        <h2 className="font-bold text-gray-900">Marketing & Analytics</h2>
                        <p className="text-sm text-gray-500 mt-1">Track your visitors and run ads.</p>
                    </div>

                    {/* Meta Pixel */}
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
                            Find this in your Facebook Events Manager. We'll automatically convert it into a tracking script.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                            <Save size={20} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
