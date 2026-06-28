import { getTenantRepository, getProductRepository } from "@/lib/repository";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, Menu, Settings, Tag, QrCode, ShoppingBag, BookOpen } from "lucide-react";
import WhatsAppSupportButton from "@/components/admin/WhatsAppSupportButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";
import { CONTACT_MAILTO } from "@/lib/config";

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

  if (!tenant) return <div>{getDictionary('en').adminStoreNotFound}</div>;
  const t = getDictionary(((tenant.language as Locale) || 'en'));

  // Fix 6: Fetch product count for progressive nav reveal
  const productRepo = getProductRepository();
  const products = await productRepo.getProducts(tenant.id);
  const productCount = products.length;
  const showAdvancedNav = productCount >= 5;

  const isDemo = slug === 'demo';

  // Skip auth for demo store — it's a public showcase
  if (!isDemo) {
    // Supabase Auth Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=/store/${slug}/admin`);
    }

    // Check Ownership
    if (tenant.userId && tenant.userId !== user.id) {
         return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <Settings size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{t.adminAccessDenied}</h2>
                    <p className="text-gray-500 mb-6">{t.adminNoPermission}</p>
                    <Link href="/admin">
                        <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                            {t.adminGoToDashboard}
                        </button>
                    </Link>
                </div>
            </div>
         );
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Admin Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 h-12 flex items-center gap-3 overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c7d2fe transparent' }}>
          <Link href={`/store/${slug}/admin`} className="font-bold flex items-center gap-2 shrink-0">
              <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">
                {tenant.name.charAt(0)}
              </span>
              <span className="hidden sm:inline whitespace-nowrap text-sm font-bold">{tenant.name}</span>
          </Link>

                {/* Nav Links — scrollable row shown on all screen sizes */}
                <div className="flex items-center gap-1 flex-1">
                <Link href={`/store/${slug}/admin`} className="px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-1.5">
                    <LayoutDashboard size={15} /> {t.adminDashboard}
                </Link>
                <Link href={`/store/${slug}/admin/orders`} className="px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-1.5">
                    <ShoppingBag size={15} /> {t.adminOrders}
                </Link>
                <Link href={`/store/${slug}/admin/menu`} className="px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-1.5">
                    <Menu size={15} /> {t.adminProducts}
                </Link>
                {showAdvancedNav && (
                    <Link href={`/store/${slug}/admin/promos`} className="px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-1.5">
                        <Tag size={15} /> {t.adminPromos}
                    </Link>
                )}
                <Link href={`/store/${slug}/admin/settings`} className="px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-1.5">
                    <Settings size={15} /> {t.adminSettings}
                </Link>
                <Link href={`/store/${slug}/admin/share`} className="px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-1.5">
                    <QrCode size={15} /> {t.adminShare}
                </Link>
                {showAdvancedNav && (
                    <>
                    <Link href={`/store/${slug}/admin/integrations`} className="px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-1.5">
                        <Tag size={15} /> {t.adminIntegrations}
                    </Link>
                    <Link href={`/store/${slug}/admin/blog`} className="px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md flex items-center gap-1.5">
                        <BookOpen size={15} /> {t.adminBlog}
                    </Link>
                    </>
                )}
            </div>

          {/* Mobile: Store open/close status pill */}
          <div className="flex items-center gap-2 shrink-0">
              {/* Live Store Status Pill */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  tenant.isOpen !== false 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                  <span className={`w-2 h-2 rounded-full ${tenant.isOpen !== false ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                  {tenant.isOpen !== false ? t.adminOpen : t.adminClosedShort}
              </div>

              {/* Share Link Button */}
              <Link href={`/store/${slug}/admin/share`}>
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors border border-gray-200">
                      <QrCode size={13} /> {t.adminShare}
                  </button>
              </Link>
          </div>

          <div className="flex items-center gap-2">
             <Link href={`/store/${slug}`} target="_blank">
                <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors">
                    <span className="hidden sm:inline">{t.adminViewStore}</span>
                    <span className="sm:hidden">{t.adminStoreShort}</span>
                    <ExternalLink size={14} />
                </button>
             </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          <Link href={`/store/${slug}/admin`} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors px-2 py-1">
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-semibold">{t.adminHome}</span>
          </Link>
          <Link href={`/store/${slug}/admin/orders`} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors px-2 py-1">
            <ShoppingBag size={20} />
            <span className="text-[10px] font-semibold">{t.adminOrders}</span>
          </Link>
          <Link href={`/store/${slug}/admin/menu`} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors px-2 py-1">
            <Menu size={20} />
            <span className="text-[10px] font-semibold">{t.adminProducts}</span>
          </Link>
          <Link href={`/store/${slug}/admin/settings`} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors px-2 py-1">
            <Settings size={20} />
            <span className="text-[10px] font-semibold">{t.adminSettings}</span>
          </Link>
          <Link href={`/store/${slug}/admin/share`} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-indigo-600 transition-colors px-2 py-1">
            <QrCode size={20} />
            <span className="text-[10px] font-semibold">{t.adminShare}</span>
          </Link>
        </div>
      </nav>

      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">👀</span>
              <span className="font-bold">{t.adminDemoMode}</span>
              <span className="hidden sm:inline text-indigo-100">— Read-only showcase of the merchant dashboard.</span>
            </div>
            <a href={CONTACT_MAILTO} className="bg-white text-indigo-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shrink-0">
              Contact Us
            </a>
          </div>
        </div>
      )}

      {/* Content: read-only for demo, interactive for real stores */}
      {isDemo ? (
        <div className="relative">
          <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
            {children}
          </div>
        </div>
      ) : (
        children
      )}

      {/* Floating WhatsApp Support Button */}
      <WhatsAppSupportButton
        storeName={tenant.name}
        labels={{
          title: t.adminSupportTitle,
          help: t.adminSupportHelp,
          helpDesc: t.adminSupportHelpDesc,
          custom: t.adminSupportCustom,
          customDesc: t.adminSupportCustomDesc,
        }}
      />

      <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-400">
        <p>{t.adminNeedHelp}</p>
        <a href="mailto:support@orderviachat.com" className="text-indigo-500 hover:text-indigo-600 font-medium">
          {t.adminContactSupport}
        </a>
      </div>
    </div>
  );
}
