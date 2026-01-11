import { getTenantRepository } from "@/lib/repository";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, Menu, Settings, Tag } from "lucide-react";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const repo = getTenantRepository();
  const tenant = await repo.getTenantBySlug(slug);

  if (!tenant) return <div>Store not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Admin Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={`/store/${slug}/admin`} className="font-bold text-lg flex items-center gap-2">
              <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg">
                {tenant.name.charAt(0)}
              </span>
              <span className="hidden sm:inline">{tenant.name} Admin</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
                <Link href={`/store/${slug}/admin`} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link href={`/store/${slug}/admin/menu`} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-2">
                    <Menu size={16} /> Menu
                </Link>
                <Link href={`/store/${slug}/admin/promos`} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-2">
                    <Tag size={16} /> Promos
                </Link>
                <Link href={`/store/${slug}/admin/settings`} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-2">
                    <Settings size={16} /> Settings
                </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Link href={`/store/${slug}`} target="_blank">
                <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors">
                    View Store <ExternalLink size={14} />
                </button>
             </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav - Removed per user preference */}
      <div className="hidden"></div>

      {children}
    </div>
  );
}
