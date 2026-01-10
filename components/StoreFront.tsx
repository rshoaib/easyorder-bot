"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Plus, ShoppingBag, Search } from "lucide-react";
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
  const { addItem, itemCount } = useCart();
  const dict = getDictionary(tenant.language as any);

  // Use the passed products instead of static import
  const products = initialProducts;

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = category === "All" 
    ? products 
    : products.filter((p) => p.category === category);

  return (
    <main className="container"> 
      {/* Header */}
      <header className="header-wrapper flex items-center justify-between">
        <div>
                <h1 className="text-xl font-bold">{tenant.name}</h1>
                <div className="flex gap-2">
                    {tenant.instagramUrl && (
                        <a href={tenant.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                        </a>
                    )}
                    {tenant.facebookUrl && (
                        <a href={tenant.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                    )}
                </div>
            <p className="text-gray-500 font-medium">{dict.poweredBy}</p>
        </div>
        <div className="cart-btn-wrapper">
          <Link href={`${tenant.slug}/cart`}>
            <button className="cart-btn">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="cart-badge">
                  {itemCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </header>
      
      {/* Search */}
      <div className="search-bar">
        <Search size={20} className="mr-3 text-gray-500"/>
        <input 
            type="text" 
            placeholder={dict.searchPlaceholder}
            className="search-input" 
        />
      </div>

      {/* Categories */}
      <div className="category-scroll">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`category-pill ${category === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
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
                onClick={(e) => {
                    e.stopPropagation();
                    if (!product.isAvailable) return;
                    addItem({ 
                        ...product,
                        // Ensure price is a number if coming from JSON
                        price: Number(product.price) 
                    });
                }}
                className={`fab-add ${!product.isAvailable ? '!bg-gray-400 !cursor-not-allowed' : ''}`}
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            <div>
                 <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                 <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
                 <div className="mt-2 text-lg font-bold">
                    {tenant.currency}{Number(product.price).toFixed(2)}
                 </div>
            </div>
          </div>
        ))}
      </div>


      <footer className="mt-12 py-8 border-t border-gray-100 text-center">
        <Link 
            href={`${process.env.NEXT_PUBLIC_BASE_URL || '/'}`} 
            target="_blank" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 transition-colors bg-gray-50 hover:bg-indigo-50 px-4 py-2 rounded-full"
        >
            <span>Powered by</span>
            <span className="font-bold">OrderViaChat</span>
        </Link>
      </footer>
    </main>
  );
}
