import { getTenantRepository } from "@/lib/repository";
import Link from "next/link";
import { createStore } from "./actions";
import { Building2, Plus, ExternalLink, Lock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SuperAdminPage() {
    const repo = getTenantRepository();
    const tenants = await repo.getAllTenants();

    return (
        <main className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600 to-indigo-900 z-0 shadow-xl" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10 pt-12 text-white">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                                <Building2 size={24} className="text-white" />
                             </div>
                             <span className="text-sm font-medium tracking-wider uppercase text-blue-200">System Admin</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Platform Dashboard</h1>
                        <p className="text-blue-200 mt-2 text-lg">Manage your restaurant empire from one command center.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Create New Store Form */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-gray-50 p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Plus size={20} className="text-indigo-600" /> New Restaurant
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Launch a new store in seconds.</p>
                            </div>
                            
                            <div className="p-6">
                                <form action={createStore} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Restaurant Name</label>
                                        <input 
                                            name="name" 
                                            required 
                                            placeholder="e.g. Pizza Palace" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL Slug</label>
                                        <input 
                                            name="slug" 
                                            required 
                                            placeholder="e.g. pizza-palace" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium font-mono text-sm" 
                                        />
                                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                            <ExternalLink size={10} />
                                            <span>accessible at </span>
                                            <span className="font-mono text-indigo-500 bg-indigo-50 px-1 rounded">/store/pizza-palace</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Password</label>
                                        <div className="relative">
                                            <input 
                                                name="password" 
                                                required 
                                                placeholder="Secret123" 
                                                className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium" 
                                            />
                                            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95">
                                            Launch Store <Plus size={20} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Stores List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 bg-white/10 backdrop-blur-sm p-2 rounded-lg inline-block text-white">
                                Active Stores <span className="ml-2 bg-white text-indigo-900 px-2 py-0.5 rounded-md text-sm">{tenants.length}</span>
                            </h2>
                        </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tenants.map(tenant => (
                                <div key={tenant.id} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                <Building2 size={26} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{tenant.name}</h3>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <span className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`}></span>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-xl p-3 mb-4 font-mono text-xs text-gray-500 flex justify-between items-center border border-gray-100">
                                        <span className="truncate max-w-[120px]" title={tenant.slug}>/store/{tenant.slug}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Pass:</span>
                                            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">{tenant.password}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/store/${tenant.slug}`} target="_blank">
                                            <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition-all">
                                                <ExternalLink size={16} /> Visit
                                            </button>
                                        </Link>
                                        <Link href={`/store/${tenant.slug}/admin`} target="_blank">
                                            <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gray-900 hover:bg-black px-4 py-2.5 rounded-xl transition-all shadow-md shadow-gray-200">
                                                <Lock size={16} /> Admin
                                            </button>
                                        </Link>
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
