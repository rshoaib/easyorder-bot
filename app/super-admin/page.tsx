import { getTenantRepository } from "@/lib/repository";
import Link from "next/link";
import { createStore } from "./actions";
import { Building2, Plus, ExternalLink, Lock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SuperAdminPage() {
    const repo = getTenantRepository();
    const tenants = await repo.getAllTenants();

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Platform Admin</h1>
                        <p className="text-gray-500">Manage all your restaurants from one place.</p>
                    </div>
                    {/* Logout logic mostly client side or cookie clear, for now simple UI */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Create New Store Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Plus size={20} className="text-blue-600" /> New Restaurant
                            </h2>
                            <form action={createStore} className="space-y-4">
                                <div>
                                    <label className="form-label">Restaurant Name</label>
                                    <input name="name" required placeholder="e.g. Pizza Palace" className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">URL Slug</label>
                                    <input name="slug" required placeholder="e.g. pizza-palace" className="form-input" />
                                    <p className="text-xs text-gray-400 mt-1">Will be at /store/pizza-palace</p>
                                </div>
                                <div>
                                    <label className="form-label">Admin Password</label>
                                    <input name="password" required placeholder="Secret123" className="form-input" />
                                </div>
                                <button type="submit" className="btn-primary w-full">
                                    Launch Store 🚀
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Stores List */}
                    <div className="lg:col-span-2">
                         <h2 className="text-xl font-bold mb-4 px-2">Active Stores ({tenants.length})</h2>
                         <div className="space-y-4">
                            {tenants.map(tenant => (
                                <div key={tenant.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{tenant.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded-md inline-block mt-1">
                                                    /store/{tenant.slug}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Link href={`/store/${tenant.slug}`} target="_blank">
                                                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors bg-white border border-gray-200 w-full justify-center">
                                                    <ExternalLink size={14} /> Visit Shop
                                                </button>
                                            </Link>
                                            <Link href={`/store/${tenant.slug}/admin`} target="_blank">
                                                <button className="flex items-center gap-2 text-sm text-white bg-gray-900 hover:bg-black px-3 py-1.5 rounded-lg transition-colors w-full justify-center">
                                                    <Lock size={14} /> Admin
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                                        <span>Pass: <span className="font-mono bg-gray-100 px-1 rounded">{tenant.password}</span></span>
                                        <span>ID: {tenant.id.slice(0,8)}...</span>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
