'use client';

import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, ArrowLeft, Send, MapPin, Tag, Store, CreditCard, Wallet } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import axios from 'axios';
import { validatePromoCode } from "@/app/actions/promo-actions";
import { sendGAEvent } from '@next/third-parties/google';
import { PromoCode } from "@/lib/repository/types";
import { toast } from "sonner";
import { runFireworks } from "@/components/ui/Confetti";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, getCurrencySymbol } from '@/lib/currency';

// Helper to calc discount
function calculateDiscount(subtotal: number, promo: Pick<PromoCode, 'discountType' | 'value'>) {
    if (promo.discountType === 'percent') return subtotal * (promo.value / 100);
    return promo.value;
}

function PromoCodeSection({ tenantId, onApply }: { tenantId: string, onApply: (p: any) => void }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    async function handleApply() {
        if(!code) return;
        setLoading(true);
        const codeToApply = code.trim().toUpperCase();
        const res = await validatePromoCode(codeToApply, tenantId);
        setLoading(false);
        if(res.success) {
            setMsg('Applied!');
            onApply(res.promo);
        } else {
            setMsg(res.message || 'Invalid code');
            onApply(null);
        }
    }

    return (
        <div className="bg-gray-50 p-3 rounded-xl mb-4">
             <div className="flex gap-2">
                 <input 
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase"
                    placeholder="Promo Code"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                 />
                 <button 
                    disabled={loading}
                    onClick={handleApply}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                 >
                    {loading ? '...' : 'Apply'}
                 </button>
             </div>
             {msg && <p className={`text-xs mt-2 ${msg === 'Applied!' ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
        </div>
    );
}

interface Props {
    tenantId: string;
    slug: string;
    isOpen: boolean;
    currency?: string;
    paypalLink?: string;
    stripeLink?: string;
    codEnabled?: boolean;
    deliveryFee?: number;
    minOrderAmount?: number;
}

export default function CartClient({ tenantId, slug, isOpen, currency, paypalLink, stripeLink, codEnabled, deliveryFee: deliveryFeeProp, minOrderAmount }: Props) {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customer, setCustomer] = useState({ name: '', phone: '+', address: '', email: '', locationLink: '' });
    const [notes, setNotes] = useState('');

    // Build available payment methods dynamically
    const availableMethods: { id: string; label: string; icon: React.ReactNode }[] = [];
    if (codEnabled !== false) {
        availableMethods.push({ id: 'cod', label: 'Cash on Delivery', icon: <span className="text-lg">💵</span> });
    }
    if (paypalLink) {
        availableMethods.push({ id: 'paypal', label: 'Pay with PayPal', icon: <Wallet size={18} className="text-blue-600" /> });
    }
    if (stripeLink) {
        availableMethods.push({ id: 'stripe', label: 'Pay with Card (Stripe)', icon: <CreditCard size={18} className="text-purple-600" /> });
    }
    // Fallback: If nothing is configured, show COD + Bank Transfer
    if (availableMethods.length === 0) {
        availableMethods.push({ id: 'cod', label: 'Cash on Delivery', icon: <span className="text-lg">💵</span> });
    }

    const [paymentMethod, setPaymentMethod] = useState(availableMethods[0]?.id || 'cod');
    const router = useRouter();

    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [appliedPromo, setAppliedPromo] = useState<Pick<PromoCode, 'code' | 'discountType' | 'value'> | null>(null);

    // Use per-store delivery fee from tenant settings (falls back to env var for backward compat)
    const deliveryFee = deliveryFeeProp ?? parseFloat(process.env.NEXT_PUBLIC_DELIVERY_FEE || "0");
    const finalTotal = Math.max(0, total + deliveryFee - (appliedPromo ? calculateDiscount(total, appliedPromo) : 0));
    const belowMinimum = (minOrderAmount || 0) > 0 && total < (minOrderAmount || 0);

    const handleLocationClick = () => {
        setLocationStatus('loading');
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            setLocationStatus('error');
            return;
        }

        // Show loading state in the input immediately
        setCustomer(prev => ({
            ...prev,
            address: "Fetching precise address..."
        }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                
                // Default fallback
                let addressText = `Shared Location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;

                try {
                    // Method 1: BigDataCloud (Free, No Key, Good for Client-Side)
                    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await res.json();
                    
                    // Construct readable address
                    const components = [
                        data.locality,
                        data.city,
                        data.principalSubdivision,
                        data.countryName
                    ].filter(Boolean);
                    
                    // Remove duplicates (sometimes locality == city)
                    const uniqueComponents = [...new Set(components)];
                    
                    if (uniqueComponents.length > 0) {
                        addressText = uniqueComponents.join(', ');
                    }
                } catch (e) {
                    console.error("Geocoding failed", e);
                }
                
                setCustomer(prev => ({
                    ...prev,
                    address: addressText,
                    locationLink: mapsLink
                }));
                setLocationStatus('success');
            },
            () => {
                toast.error("Unable to retrieve your location");
                setLocationStatus('error');
                setCustomer(prev => ({
                     ...prev,
                     address: "" // Clear loading text
                }));
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isOpen) {
            toast.error("Sorry, the store is currently closed.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post('/api/place-order', {
                items,
                total: finalTotal, // API calculates simpler, but we pass for reference
                customer,
                slug, // Pass slug so API knows which tenant!
                promoCode: appliedPromo?.code,
                paymentMethod,
                notes: notes.trim() || undefined
            });

            if (response.data.success) {
                // Google Analytics Conversion Tracking
                sendGAEvent('event', 'purchase', {
                    transaction_id: response.data.orderId || Date.now().toString(),
                    value: finalTotal,
                    currency: currency || 'USD',
                    items: items.map(item => ({
                        item_id: item.id,
                        item_name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                });

                clearCart();

                // Handle PayPal redirect
                if (paymentMethod === 'paypal' && paypalLink) {
                    toast.success("Order placed!", { description: "Redirecting to PayPal..." });
                    runFireworks();
                    // Normalize the PayPal link and append amount
                    let ppLink = paypalLink.trim();
                    if (!ppLink.startsWith('http')) ppLink = `https://${ppLink}`;
                    // Append amount and currency
                    const ppUrl = `${ppLink}/${finalTotal.toFixed(2)}${currency || 'USD'}`;
                    window.open(ppUrl, '_blank');
                    setTimeout(() => { window.location.href = `/store/${slug}`; }, 2000);
                    return;
                }

                // Handle Stripe redirect
                if (paymentMethod === 'stripe' && stripeLink) {
                    toast.success("Order placed!", { description: "Redirecting to payment..." });
                    runFireworks();
                    window.open(stripeLink, '_blank');
                    setTimeout(() => { window.location.href = `/store/${slug}`; }, 2000);
                    return;
                }
                
                if (response.data.whatsappNumber) {
                     toast.success("Order placed!", { description: "Redirecting to WhatsApp..." });
                     runFireworks();
                     const url = `https://wa.me/${response.data.whatsappNumber}?text=${response.data.message}`;
                     window.open(url, '_blank');
                     setTimeout(() => {
                        window.location.href = `/store/${slug}`;
                     }, 2000);
                } else {
                     toast.success("Order placed successfully!");
                     runFireworks();
                     setTimeout(() => {
                        router.push(`/store/${slug}`);
                     }, 2000);
                }
            }
        } catch (error: any) {
            console.error('Order placement error:', error);
            const apiError = error?.response?.data?.error;
            toast.error(apiError || 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100/50">
                    <ShoppingBag size={36} className="text-indigo-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">
                    Browse the menu and tap any item to add it here. It only takes a few taps to order!
                </p>
                <Link href={`/store/${slug}`}>
                    <button className="btn-primary flex items-center gap-2 px-6 py-3 text-base shadow-lg shadow-indigo-500/20">
                        <ArrowLeft size={18} /> Browse Menu
                    </button>
                </Link>
            </div>
        );
    }

    const isDigitalOnly = items.length > 0 && items.every(i => (i as any).type === 'digital');

    return (
        <main className="container pt-6 pb-24 max-w-lg mx-auto">
             {/* ... Header and Banners code same as before ... */}
             <div className="flex items-center gap-4 mb-6">
                <Link href={`/store/${slug}`} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold">Checkout</h1>
                </div>
                {!isOpen && (
                   <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                       <Store size={12} /> CLOSED
                   </div>
                )}
            </div>

            {/* Closed Banner */}
            {!isOpen && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6 text-center">
                    <h3 className="font-bold text-red-800">Store is Currently Closed</h3>
                    <p className="text-sm text-red-600 mt-1">We are not accepting orders right now. Please check back later!</p>
                </div>
            )}

            {/* Cart Items */}
            <div className="space-y-4 mb-8">
                <AnimatePresence mode="popLayout">
                {items.map((item) => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        transition={{ duration: 0.2 }}
                        key={item.id} 
                        className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                    >
                         <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-50 relative flex-shrink-0">
                             <ImageWithFallback src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold">{item.name}</h3>
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="text-sm text-gray-500">{formatPrice(item.price, currency)}</div>
                                {(item as any).type === 'digital' && <span className="text-[10px] uppercase font-bold bg-indigo-100 text-indigo-700 px-2 rounded-sm">Digital</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 font-bold hover:bg-gray-200"
                                >-</button>
                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 font-bold hover:bg-gray-200"
                                >+</button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-8 space-y-2">
                {isOpen && <PromoCodeSection tenantId={tenantId} onApply={setAppliedPromo} />}
                
                <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">{formatPrice(total, currency)}</span>
                    </div>
                    {/* Hide delivery fee for digital only */}
                    {!isDigitalOnly && deliveryFee > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Delivery Fee</span>
                            <span className="font-medium">{formatPrice(deliveryFee, currency)}</span>
                        </div>
                    )}
                    {appliedPromo && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span className="font-medium flex items-center gap-1"><Tag size={12}/> Code: {appliedPromo.code}</span>
                            <span className="font-bold">-{formatPrice(calculateDiscount(total, appliedPromo), currency)}</span>
                        </div>
                    )}
                </div>
                
                <div className="border-t border-gray-100 my-2 pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(Math.max(0, total + (isDigitalOnly ? 0 : deliveryFee) - (appliedPromo ? calculateDiscount(total, appliedPromo) : 0)), currency)}</span>
                </div>
            </div>

            {/* Minimum Order Warning */}
            {belowMinimum && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 text-center">
                    <h3 className="font-bold text-amber-800">Minimum Order: {formatPrice(minOrderAmount || 0, currency)}</h3>
                    <p className="text-sm text-amber-600 mt-1">Add {formatPrice((minOrderAmount || 0) - total, currency)} more to place your order.</p>
                </div>
            )}

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className={`space-y-4 ${!isOpen || belowMinimum ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <h2 className="font-bold text-lg">Your Details</h2>
                
                <div>
                    <label className="form-label">Full Name</label>
                    <input 
                        required={isOpen}
                        className="form-input"
                        placeholder="John Doe"
                        value={customer.name}
                        onChange={e => setCustomer({...customer, name: e.target.value})}
                    />
                </div>

                <div>
                    <label className="form-label">Phone Number (WhatsApp)</label>
                    <input 
                        required={isOpen}
                        type="tel"
                        className="form-input"
                        placeholder="+1234567890"
                        value={customer.phone}
                        onChange={e => {
                            let val = e.target.value;
                            val = '+' + val.replace(/^\++/, '');
                            setCustomer({...customer, phone: val})
                        }}
                    />
                </div>

                {/* Hide Address for Digital Only */}
                {!isDigitalOnly ? (
                    <div>
                        <label className="form-label">Delivery Address</label>
                        <div className="flex gap-2">
                            <textarea 
                                required={isOpen}
                                className="form-input flex-1"
                                rows={2}
                                placeholder="Street, City, Building..."
                                value={customer.address}
                                onChange={e => setCustomer({...customer, address: e.target.value})}
                            />
                             <button 
                                type="button"
                                onClick={handleLocationClick}
                                disabled={locationStatus === 'loading'}
                                className={`px-3 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-xs gap-1 transition-colors ${
                                    locationStatus === 'success' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                                title="Share Current Location"
                            >
                                <MapPin size={18} />
                                {locationStatus === 'loading' ? '...' : locationStatus === 'success' ? 'Shared' : 'GPS'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                         <label className="form-label">Email Address (For Delivery)</label>
                         <input 
                            required={isOpen}
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={customer.email}
                            onChange={e => setCustomer({...customer, email: e.target.value})}
                         />
                         <p className="text-xs text-gray-500 mt-1">We will send your files to this email.</p>
                    </div>
                )}

                <div>
                    <label className="form-label mb-2 block">Payment Method</label>
                    <div className="space-y-2">
                        {availableMethods.map((method) => (
                            <label key={method.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                paymentMethod === method.id 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}>
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value={method.id}
                                    checked={paymentMethod === method.id}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="flex items-center gap-2 font-medium">
                                    {method.icon} {method.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Special Instructions / Notes */}
                <div>
                    <label className="form-label">Special Instructions (Optional)</label>
                    <textarea 
                        className="form-input"
                        rows={2}
                        placeholder="e.g. No onions, extra sauce, ring the doorbell..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        maxLength={500}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting || !isOpen || belowMinimum}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-4 text-base shadow-lg shadow-blue-500/20 disabled:bg-gray-300 disabled:shadow-none"
                >
                    {isSubmitting ? (
                        'Sending Order...'
                    ) : !isOpen ? (
                        'Store Closed'
                    ) : belowMinimum ? (
                        `Min. order: ${formatPrice(minOrderAmount || 0, currency)}`
                    ) : (
                        <>
                            Place Order via WhatsApp <Send size={18} />
                        </>
                    )}
                </button>
            </form>
        </main>
    );
}
