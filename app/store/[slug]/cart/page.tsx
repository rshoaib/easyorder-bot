import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, ArrowLeft, Send, MapPin, Tag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import axios from 'axios';
import { validatePromoCode } from "@/app/actions/promo-actions";
import { getTenantRepository } from "@/lib/repository"; // Careful, can't use server repo on client

// Helper to calc discount
function calculateDiscount(subtotal: number, promo: any) {
    if (promo.type === 'percent') return subtotal * (promo.value / 100);
    return promo.value;
}

function PromoCodeSection({ tenantId, onApply }: { tenantId: string, onApply: (p: any) => void }) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    async function handleApply() {
        if(!code) return;
        setLoading(true);
        const res = await validatePromoCode(code, tenantId);
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

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customer, setCustomer] = useState({ name: '', phone: '', address: '', locationLink: '' });
    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();

    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [tenantId, setTenantId] = useState(''); // Need tenantId for validation
    const [appliedPromo, setAppliedPromo] = useState<any>(null); // { code, type, value }

    // Fetch tenant ID for current store (we could also pass it via props if this was server component)
    useEffect(() => {
        // Quick way to get tenant ID: call an API or just look it up. 
        // Since we are client side, we can't easily use getTenantRepository.
        // Let's create a tiny API endpoint or pass it down?
        // Actually, validatePromoCode server action takes tenantId. 
        // We need to resolve slug -> tenantId securely.
        // Strategy: We will call a server action to exchange slug -> tenantId first?
        // Or simpler: validatePromoCode can also accept slug!
        // Let's modify validatePromoCode to take SLUG instead of ID. That's easier for frontend.
    }, [slug]);

    // Get Delivery Fee from env (this is client side, so we only see NEXT_PUBLIC)
    // Note: In a real multi-tenant app, we should fetch this from the Tenant config API
    // For now, let's assume it's global or we'll fetch tenant details later.
    const deliveryFee = parseFloat(process.env.NEXT_PUBLIC_DELIVERY_FEE || "0");
    const finalTotal = Math.max(0, total + deliveryFee - (appliedPromo ? calculateDiscount(total, appliedPromo) : 0));

    const handleLocationClick = () => {
        setLocationStatus('loading');
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setLocationStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                
                setCustomer(prev => ({
                    ...prev,
                    address: `Shared Location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`, // Placeholder text
                    locationLink: mapsLink
                }));
                setLocationStatus('success');
            },
            () => {
                alert("Unable to retrieve your location");
                setLocationStatus('error');
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('/api/checkout', {
                items,
                total: finalTotal, // API calculates simpler, but we pass for reference
                customer,
                slug, // Pass slug so API knows which tenant!
                promoCode: appliedPromo?.code
            });

            if (response.data.success) {
                clearCart();
                // We should probably redirect to a success page or back to store
                alert("Order placed successfully! Check your WhatsApp."); // Simple feedback
                router.push(`/store/${slug}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <ShoppingBag size={24} />
                </div>
                <h1 className="text-xl font-bold mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                <Link href={`/store/${slug}`}>
                    <button className="btn-primary">
                        Start Shopping
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <main className="container pt-6 pb-24 max-w-lg mx-auto">
             {/* Header */}
             <div className="flex items-center gap-4 mb-6">
                <Link href={`/store/${slug}`} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold">Checkout</h1>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-8">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
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
                            <div className="text-sm text-gray-500 mb-2">${item.price.toFixed(2)}</div>
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
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-8 space-y-2">
                <PromoCodeSection tenantId={slug} onApply={setAppliedPromo} />
                
                <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    {deliveryFee > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Delivery Fee</span>
                            <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                        </div>
                    )}
                    {appliedPromo && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span className="font-medium flex items-center gap-1"><Tag size={12}/> Code: {appliedPromo.code}</span>
                            <span className="font-bold">-${calculateDiscount(total, appliedPromo).toFixed(2)}</span>
                        </div>
                    )}
                </div>
                
                <div className="border-t border-gray-100 my-2 pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${Math.max(0, total + deliveryFee - (appliedPromo ? calculateDiscount(total, appliedPromo) : 0)).toFixed(2)}</span>
                </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-bold text-lg">Delivery Details</h2>
                
                <div>
                    <label className="form-label">Full Name</label>
                    <input 
                        required
                        className="form-input"
                        placeholder="John Doe"
                        value={customer.name}
                        onChange={e => setCustomer({...customer, name: e.target.value})}
                    />
                </div>

                <div>
                    <label className="form-label">Phone Number (WhatsApp)</label>
                    <input 
                        required
                        type="tel"
                        className="form-input"
                        placeholder="+1234567890"
                        value={customer.phone}
                        onChange={e => setCustomer({...customer, phone: e.target.value})}
                    />
                </div>

                <div>
                    <label className="form-label">Delivery Address</label>
                    <div className="flex gap-2">
                        <textarea 
                            required
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
                    {customer.locationLink && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <MapPin size={12} /> Location attached
                        </p>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-4 text-base shadow-lg shadow-blue-500/20"
                >
                    {isSubmitting ? (
                        'Sending Order...'
                    ) : (
                        <>
                            Place Order via WhatsApp <Send size={18} />
                        </>
                    )}
                </button>
                <p className="text-xs text-center text-gray-400 mt-2">
                    Order details will be sent to our WhatsApp.
                </p>
            </form>
        </main>
    );
}
