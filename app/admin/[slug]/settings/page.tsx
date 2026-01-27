import { getTenantRepository } from "@/lib/repository";
import { DomainSettings } from "@/components/admin/DomainSettings";

export default async function SettingsPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="border-b border-slate-200 pb-6">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your store configuration and preferences</p>
            </header>

            <div className="grid gap-8">
                {/* General Information */}
                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">General Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                            <input 
                                type="text" 
                                defaultValue={tenant.name} 
                                className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" 
                                disabled 
                            />
                            <p className="text-xs text-slate-400 mt-1">Contact support to change store name</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                            <select disabled className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-500">
                                <option>{tenant.currency}</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Branding (Use reused component logic or placeholder if complex) */}
                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Branding</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Brand Color</label>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full border border-slate-200" style={{ backgroundColor: tenant.themeColor }}></div>
                                <span className="font-mono text-slate-600">{tenant.themeColor}</span>
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Store Logo</label>
                             {tenant.logoUrl ? (
                                 <img src={tenant.logoUrl} className="w-16 h-16 rounded-lg object-contain border border-slate-200" />
                             ) : (
                                 <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                                     No Logo
                                 </div>
                             )}
                        </div>
                    </div>
                </section>
                
                {/* Domain Settings (Reusing Component) */}
                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Custom Domain</h2>
                    <DomainSettings slug={slug} currentDomain={tenant.customDomain} />
                </section>
            </div>
        </div>
    );
}
