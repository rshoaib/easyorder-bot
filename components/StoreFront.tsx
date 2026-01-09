"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Plus, ShoppingBag, Search } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Product } from "@/lib/repository/types";

interface StoreFrontProps {
    initialProducts: Product[];
}

export default function StoreFront({ initialProducts }: StoreFrontProps) {
  const [category, setCategory] = useState("All");
  const { addItem, itemCount } = useCart();

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
          <h1 className="text-3xl font-extrabold mb-1">EasyOrder.</h1>
          <p className="text-gray-500 font-medium">Good evening</p>
        </div>
        <div className="cart-btn-wrapper">
          <Link href="cart">
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
            placeholder="Search products..." 
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
                className="product-image"
              />
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    addItem({ 
                        ...product,
                        // Ensure price is a number if coming from JSON
                        price: Number(product.price) 
                    });
                }}
                className="fab-add"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            <div>
                 <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                 <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
                 <div className="mt-2 text-lg font-bold">
                    ${Number(product.price).toFixed(2)}
                 </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
