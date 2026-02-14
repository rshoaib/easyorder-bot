"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Plus, ShoppingBag, Search, Check, Clock } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Tenant } from "@/lib/repository/types";
import { Product } from "@/lib/repository/types";

interface StoreFrontProps {
    initialProducts: Product[];
    tenant: Tenant;
}

export default function StoreFront({ initialProducts, tenant }: StoreFrontProps) {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, total } = useCart();
  const dict = getDictionary(tenant.language as any);

  const products = initialProducts;
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  
  const filteredProducts = products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const isOpen = tenant.isOpen !== false; // default to open

  return (
    <main className="store-container">
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
                  {isOpen ? 'Open Now' : 'Closed'}
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
          
          {/* Cart button */}
          <div className="cart-btn-wrapper">
            <Link href={`${tenant.slug}/cart`}>
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
      <div className="category-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`category-pill ${category === cat ? "active" : ""}`}
            style={category === cat ? { backgroundColor: tenant.themeColor || '#000', borderColor: tenant.themeColor || '#000', color: '#fff' } : {}}
          >
            {cat}
          </button>
        ))}
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
            <span className="text-gray-400">Powered by</span>
            <span className="font-bold text-gray-600">OrderViaChat</span>
        </Link>
      </footer>

      {/* Sticky Cart Summary (Mobile Only, Shows when items in cart) */}
      {itemCount > 0 ? (
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
              <Link href={`${tenant.slug}/cart`}>
                  <div className="bg-gray-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between border border-gray-800">
                      <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-medium">{itemCount} items</span>
                          <span className="font-bold text-lg leading-none">{tenant.currency}{total.toFixed(2)}</span>
                      </div>
                      <div 
                        className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold"
                        style={{ color: tenant.themeColor || '#000' }}
                      >
                          View Cart <ShoppingBag size={16} />
                      </div>
                  </div>
              </Link>
          </div>
      ) : (
          /* Sticky Viral Button (Only when cart is empty) */
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom-5 duration-700">
              <Link href="/register" target="_blank">
                  <div className="bg-white/90 backdrop-blur-md text-gray-900 p-4 rounded-xl shadow-lg flex items-center justify-between border border-gray-200">
                      <div>
                          <p className="font-bold text-sm">Want a store like this?</p>
                          <p className="text-xs text-gray-500">Launch for free in 2 mins.</p>
                      </div>
                      <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                          Start 🚀
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

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product.isAvailable) return;
        
        addItem({ ...product, price: Number(product.price) });
        
        // Trigger animation
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div 
          className={`product-card group cursor-pointer ${!product.isAvailable ? 'opacity-80' : ''}`}
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
                   <p className="text-[11px] text-gray-400 line-clamp-1 mb-1">{product.description}</p>
                 )}
                 <div className="flex items-center gap-2 mb-1">
                     <p className="text-xs text-gray-500 uppercase tracking-wide line-clamp-1">{product.category}</p>
                     {product.type === 'service' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">SERVICE</span>}
                     {product.type === 'digital' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">DIGITAL</span>}
                 </div>
                 <div className="mt-1 text-lg font-bold">
                    {tenant.currency}{Number(product.price).toFixed(2)}
                 </div>
            </div>
          </div>
    )
}
