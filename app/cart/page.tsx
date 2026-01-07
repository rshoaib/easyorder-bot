"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Trash2, ArrowLeft, Send, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true); // Re-use loading state or add a specific one temporarily
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData((prev) => ({ ...prev, address: `📍 Current Location: ${mapsLink}` }));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to retrieve your location. Please enter it manually.");
        setLoading(false);
      }
    );
  };

  if (items.length === 0) {
    return (
      <main className="container flex-col justify-center items-center text-center" style={{ minHeight: '80vh', display: 'flex' }}>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-6 text-gray-500">Looks like you haven't added anything yet.</p>
        <Link href="/">
          <button className="btn-block" style={{ width: 'auto', padding: '12px 24px' }}>Start Shopping</button>
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/checkout", {
        items,
        total,
        customer: formData,
      });

      if (response.data.success) {
        clearCart();
        alert("Order Sent! Check your WhatsApp.");
        router.push("/");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to send order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container pt-4">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-black mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back to Catalog
        </Link>
        <h1 className="text-3xl font-extrabold">Shopping Cart</h1>
      </div>

      <div className="panel-card">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <ImageWithFallback src={item.image} alt={item.name} className="cart-item-image" />
            
            <div className="flex-col w-full">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-sm">{item.name}</h3>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{item.category}</p>
              
              <div className="flex justify-between items-center mt-2">
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn"
                  >-</button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                  >+</button>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="delete-btn"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-4 pt-4" style={{borderTop: '1px solid #f0f0f0'}}>
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
      <div className="panel-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              required
              type="text" 
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your Name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">WhatsApp Number</label>
            <input 
              required
              type="tel" 
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="e.g. 15551234567"
            />
            <p className="text-xs text-gray-500 mt-2">We will send the invoice here.</p>
          </div>
          <div className="form-group">
            <label className="form-label flex justify-between items-center">
              Address
              <button
                type="button"
                onClick={handleLocationClick}
                className="btn-secondary"
              >
                <MapPin size={14} /> Current Location
              </button>
            </label>
            <textarea 
              required
              rows={3}
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Delivery Address (or click button above)..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-block"
          >
            {loading ? "Processing..." : (
                <>Send Order <Send size={18} /></>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
