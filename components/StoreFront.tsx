"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { Plus, ShoppingBag, Search, Check, Clock } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { getDictionary, detectLocale, isRTL, type Locale } from "@/lib/i18n/dictionaries";
import LanguagePicker from "@/components/LanguagePicker";
import { Tenant } from "@/lib/repository/types";
import { Product } from "@/lib/repository/types";
import { formatPrice } from "@/lib/currency";

interface StoreFrontProps {
    initialProducts: Product[];
    tenant: Tenant;
}

export default function StoreFront({ initialProducts, tenant }: StoreFrontProps) {
  const [category, setCategory] = useState<string>("__all__");
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, total } = useCart();
  
  // Locale resolution priority:
  //   1. localStorage (customer's previous choice from the picker)
  //   2. tenant.language (merchant's default for this store)
  //   3. browser-detected language
  //   4. English fallback
  const [locale, setLocale] = useState<Locale>((tenant.language as Locale) || 'en');
  useEffect(() => {
    let initial: Locale | null = null;
    try {
      const stored = localStorage.getItem(`ovc_locale_${tenant.slug}`) as Locale | null;
      if (stored) initial = stored;
    } catch { /* noop */ }
    if (!initial) {
      initial = (tenant.language as Locale) || detectLocale();
      // Persist the auto-resolved locale so navigations to /cart pick up
      // the same language without re-detecting (or worse, defaulting back
      // to English if tenant.language is unset).
      try {
        localStorage.setItem(`ovc_locale_${tenant.slug}`, initial);
      } catch { /* noop */ }
    }
    setLocale(initial);
  }, [tenant.slug, tenant.language]);
  
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  const products = initialProducts;
  const categories: { id: string; label: string }[] = [
    { id: "__all__", label: dict.all },
    ...Array.from(new Set(products.map((p) => p.category))).map((c) => ({ id: c, label: c })),
  ];
  
  const filteredProducts = useMemo(() => {
      return products.filter((p) => {
          const matchesCategory = category === "__all__" || p.category === category;
          const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
      });
  }, [products, category, searchQuery]);

  const isOpen = tenant.isOpen !== false; // default to open

  return (
    <main className="store-container" dir={rtl ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className="store-hero"
        style={{ 
          background: `linear-gradient(135deg, ${tenant.themeColor || '#6366f1'}15 0%, ${tenant.themeColor || '#6366f1'}08 50%, transparent 100%)`,
        }}
      >
        <div className="store-hero-content">
          <div className="flex items-center gap-4">
            {tenant.logoUrl && (
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 shadow-lg shrink-0" style={{ borderColor: `${tenant.themeColor || '#6366f1'}30` }}>
                <ImageWithFallback 
                  src={tenant.logoUrl} 
                  alt={tenant.name} 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-slate-900">{tenant.name}</h1>
              <div className="flex items-center gap-3 mt-1.5">
                {/* Open/Closed badge */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                  isOpen 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  {isOpen ? dict.openNow : dict.closed}
                </span>
                
                {/* Social icons */}
                {tenant.instagramUrl && (
                  <a href={tenant.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                )}
                {tenant.facebookUrl && (
                  <a href={tenant.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Right-side: language picker + cart, aligned horizontally */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguagePicker value={locale} onChange={setLocale} slug={tenant.slug} />
            <div className="cart-btn-wrapper">
              <Link href={`/store/${tenant.slug}/cart`}>
                <button className="cart-btn">
                  <ShoppingBag size={22} />
                  {itemCount > 0 && (
                    <span className="cart-badge animate-in zoom-in duration-300" style={{ backgroundColor: tenant.themeColor || '#000' }}>
                      {itemCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="search-bar">
        <Search size={20} className="mr-3 text-gray-400"/>
        <input 
            type="text" 
            placeholder={dict.searchPlaceholder}
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="category-scroll-wrapper">
        <div className="category-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`category-pill ${category === cat.id ? "active" : ""}`}
              style={category === cat.id ? { backgroundColor: tenant.themeColor || '#000', borderColor: tenant.themeColor || '#000', color: '#fff' } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} tenant={tenant} dict={dict} />
        ))}
      </div>

      {/* Footer */}
      <footer className="store-footer">
        <div className="store-footer-info">
          {(tenant.instagramUrl || tenant.facebookUrl) && (
            <div className="flex items-center justify-center gap-4 mb-3">
              {tenant.instagramUrl && (
                <a href={tenant.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-pink-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {tenant.facebookUrl && (
                <a href={tenant.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
            </div>
          )}
          {!isOpen && (
            <div className="flex items-center justify-center gap-2 text-sm text-amber-600 mb-3">
              <Clock size={14} />
              <span className="font-medium">Currently closed — check back later!</span>
            </div>
          )}
        </div>
        <Link 
            href={`${process.env.NEXT_PUBLIC_BASE_URL || '/'}`} 
            target="_blank" 
            className="powered-by-badge"
        >
            <span className="text-gray-400">{dict.poweredBy}</span>
            <span className="font-bold text-gray-600">OrderViaChat</span>
        </Link>
      </footer>

      {/* Sticky Cart Summary (Mobile Only, Shows when items in cart) */}
      {itemCount > 0 && (
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
              <Link href={`/store/${tenant.slug}/cart`}>
                  <div className="bg-gray-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between border border-gray-800">
                      <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-medium">{itemCount} items</span>
                          <span className="font-bold text-lg leading-none">{formatPrice(total, tenant.currency)}</span>
                      </div>
                      <div 
                        className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold"
                        style={{ color: tenant.themeColor || '#000' }}
                      >
                          {dict.viewCartBtn} <ShoppingBag size={16} />
                      </div>
                  </div>
              </Link>
          </div>
      )}
    </main>
  );
}

function ProductCard({ product, tenant, dict }: { product: Product, tenant: Tenant, dict: any }) {
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [showSizePicker, setShowSizePicker] = useState(false);

    const handleAdd = (e: React.MouseEvent, size?: string) => {
        e.stopPropagation();
        if (!product.isAvailable) return;
        
        // If product has sizes and no size selected yet, show picker
        if (product.sizes && product.sizes.length > 0 && !size) {
            setShowSizePicker(true);
            return;
        }

        addItem({ ...product, price: Number(product.price) }, size);
        setShowSizePicker(false);
        
        // Trigger animation
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div 
          className={`product-card group relative ${product.isAvailable ? 'cursor-pointer' : 'opacity-60 cursor-default'}`}
          onClick={handleAdd}
        >
            <div className="product-image-container">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`product-image ${!product.isAvailable ? 'grayscale opacity-70' : ''}`}
              />
               {!product.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
                      {dict.outOfStock}
                    </span>
                  </div>
                )}
              <button
                disabled={!product.isAvailable}
                onClick={handleAdd}
                className={`fab-add transition-all duration-300 ${isAdded ? '!bg-green-500 !scale-110 !rotate-0' : ''} ${!product.isAvailable ? '!bg-gray-400 !cursor-not-allowed' : ''}`}
              >
                {isAdded ? (
                    <Check size={20} strokeWidth={3} className="text-white animate-in zoom-in duration-200" />
                ) : (
                    <Plus size={18} strokeWidth={2.5} />
                )}
              </button>
            </div>
            
            <div>
                 <h3 className="font-bold text-sm mb-0.5 line-clamp-1">{product.name}</h3>
                 {product.description && (
                   <p className="text-xs text-gray-500 line-clamp-3 mb-1">{product.description}</p>
                 )}
                 <div className="flex items-center gap-2 mb-1">
                     <p className="text-xs text-gray-500 uppercase tracking-wide line-clamp-1">{product.category}</p>
                     {product.type === 'service' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">SERVICE</span>}
                     {product.type === 'digital' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">DIGITAL</span>}
                 </div>
                 {product.sizes && product.sizes.length > 0 && (
                   <div className="flex flex-wrap gap-1 mb-1">
                     {product.sizes.map((s) => (
                       <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{s}</span>
                     ))}
                   </div>
                 )}
                 <div className="mt-1 text-lg font-bold">
                    {formatPrice(Number(product.price), tenant.currency)}
                 </div>
            </div>

            {/* Size Picker Popup */}
            {showSizePicker && product.sizes && (
              <div 
                className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-3 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs font-bold text-gray-700 mb-2">Select Size</p>
                <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={(e) => handleAdd(e, s)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all active:scale-95"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSizePicker(false); }}
                  className="text-[10px] text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
    )
}
