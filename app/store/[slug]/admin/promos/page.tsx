import { getPromoCodeRepository, getTenantRepository } from "@/lib/repository";
import Link from 'next/link';
import { ArrowLeft, Plus, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import { createPromoCode, togglePromoAction } from "@/app/actions/promo-actions";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

export default async function AdminPromosPage({ params }: Props) {
  const { slug } = await params;
  const tenantRepo = getTenantRepository();
  const tenant = await tenantRepo.getTenantBySlug(slug);
  
  if (!tenant) return <div>Store not found</div>;

  const repo = getPromoCodeRepository();
  const promos = await repo.getPromos(tenant.id);

  async function create(formData: FormData) {
      'use server';
      await createPromoCode(formData, tenant!.id);
      revalidatePath(`/store/${slug}/admin/promos`);
  }

  async function toggle(id: string, currentState: boolean) {
      'use server';
      await togglePromoAction(id, !currentState);
      revalidatePath(`/store/${slug}/admin/promos`);
  }

  return (
    <main className="container pt-6 pb-10" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div className="flex justify-between mb-8 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
           <h1 className="text-2xl font-bold mb-1">Promo Codes</h1>
           <p className="text-gray-500 text-sm">Create discounts to boost sales</p>
        </div>
        <Link href={`/store/${slug}/admin`}>
           <button className="btn-secondary">
             <ArrowLeft size={16} />
             Back to Dashboard
           </button>
        </Link>
      </div>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-indigo-600"/> Create New Code
        </h3>
        <form action={create} className="flex gap-4 items-end flex-wrap">
           <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-gray-500 mb-1">Code (e.g. SUMMER10)</label>
              <input name="code" required placeholder="SUMMER10" className="form-input uppercase" />
           </div>
           <div className="w-[150px]">
              <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
              <select name="type" className="form-input">
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
              </select>
           </div>
           <div className="w-[120px]">
              <label className="block text-xs font-bold text-gray-500 mb-1">Value</label>
              <input name="value" type="number" required placeholder="10" className="form-input" />
           </div>
           <button type="submit" className="btn-primary h-[48px] px-6">
              Create
           </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Code</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Discount</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Usage</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {promos.map(promo => (
                      <tr key={promo.id} className={!promo.isActive ? 'bg-gray-50 opacity-60' : ''}>
                          <td className="py-4 px-6 font-mono font-bold text-gray-900 flex items-center gap-2">
                              <Tag size={14} className="text-indigo-500" />
                              {promo.code}
                          </td>
                          <td className="py-4 px-6">
                              {promo.discountType === 'percent' ? `${promo.value}% OFF` : `$${promo.value} OFF`}
                          </td>
                          <td className="py-4 px-6 text-gray-500">
                              {promo.usageCount} times
                          </td>
                          <td className="py-4 px-6">
                              {promo.isActive ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">Active</span>
                              ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">Inactive</span>
                              )}
                          </td>
                          <td className="py-4 px-6 text-right">
                              <form action={toggle.bind(null, promo.id, promo.isActive)}>
                                  <button className={`text-sm font-medium ${promo.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}>
                                      {promo.isActive ? 'Deactivate' : 'Activate'}
                                  </button>
                              </form>
                          </td>
                      </tr>
                  ))}
                  {promos.length === 0 && (
                      <tr>
                          <td colSpan={5} className="py-12 text-center text-gray-400">No promo codes yet.</td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>
    </main>
  );
}
