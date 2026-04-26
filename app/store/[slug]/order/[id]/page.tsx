import { getTenantRepository, getOrderRepository } from "@/lib/repository";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { formatPrice, getCurrencySymbol } from "@/lib/currency";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";
import Link from "next/link";
import { ArrowLeft, Package, Clock, ChefHat, CheckCircle, Truck, MapPin, Phone, FileText, StickyNote } from "lucide-react";
import { formatOrderDateFull, formatOrderTime } from "@/lib/date-utils";

export const dynamic = 'force-dynamic';
export const revalidate = 30; // Auto-refresh every 30 seconds

interface Props {
    params: {
        slug: string;
        id: string;
    }
}

const STEPS = [
    { key: 'pending', label: 'Order Placed', icon: Package, color: 'text-amber-600 bg-amber-100' },
    { key: 'preparing', label: 'Preparing', icon: ChefHat, color: 'text-blue-600 bg-blue-100' },
    { key: 'ready', label: 'Ready', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    { key: 'delivered', label: 'Delivered', icon: Truck, color: 'text-emerald-600 bg-emerald-100' },
];

export default async function OrderTrackingPage({ params }: Props) {
    const { slug, id: orderId } = await params;

    // Use service-role client to bypass RLS (tracking pages are public)
    const serviceClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const tenantRepo = getTenantRepository(serviceClient);
    const tenant = await tenantRepo.getTenantBySlug(slug);
    const t = getDictionary(((tenant?.language as Locale) || 'en'));

    if (!tenant) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
                    <p className="text-gray-500">This store does not exist.</p>
                </div>
            </div>
        );
    }

    const orderRepo = getOrderRepository(serviceClient);
    const order = await orderRepo.getOrderById(orderId);

    if (!order || order.tenantId !== tenant.id) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package size={28} className="text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
                    <p className="text-gray-500 mb-6">This order doesn&apos;t exist or belongs to a different store.</p>
                    <Link href={`/store/${slug}`}>
                        <button className="btn-primary px-6 py-3">Browse Store</button>
                    </Link>
                </div>
            </div>
        );
    }

    // Determine current step index
    const currentStepIndex = STEPS.findIndex(s => s.key === order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
                    <Link href={`/store/${slug}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <h1 className="font-bold text-lg">{tenant.name}</h1>
                        <p className="text-xs text-gray-500">Order Tracking</p>
                    </div>
                </div>
            </div>

            <div className="container max-w-lg mx-auto px-4 py-8 space-y-6">
                {/* Order ID + Date */}
                <div className="text-center">
                    <p className="text-sm text-gray-500">{t.orderLabel}</p>
                    <h2 className="text-xl font-bold font-mono text-gray-900">#{orderId.replace('ORD-', '')}</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {formatOrderDateFull(order.date, tenant.timezone)}
                        {' · '}
                        {formatOrderTime(order.date, tenant.timezone)}
                    </p>
                </div>

                {/* Status Timeline */}
                {isCancelled ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">✕</span>
                        </div>
                        <h3 className="font-bold text-red-800 text-lg">Order Cancelled</h3>
                        <p className="text-sm text-red-600 mt-1">This order has been cancelled.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            {STEPS.map((step, index) => {
                                const isActive = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const Icon = step.icon;
                                return (
                                    <div key={step.key} className="flex flex-col items-center flex-1 relative">
                                        {/* Connector Line */}
                                        {index > 0 && (
                                            <div className={`absolute top-5 -left-1/2 w-full h-0.5 ${
                                                index <= currentStepIndex ? 'bg-indigo-500' : 'bg-gray-200'
                                            }`} />
                                        )}
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all ${
                                            isCurrent 
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-100' 
                                                : isActive 
                                                    ? 'bg-indigo-500 text-white' 
                                                    : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            <Icon size={18} />
                                        </div>
                                        <span className={`text-[11px] mt-2 font-medium text-center leading-tight ${
                                            isCurrent ? 'text-indigo-700 font-bold' : isActive ? 'text-gray-700' : 'text-gray-400'
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Current Status Message */}
                        <div className={`text-center p-3 rounded-xl ${STEPS[currentStepIndex]?.color || 'bg-gray-100 text-gray-600'}`}>
                            <p className="font-bold text-sm">
                                {currentStepIndex === 0 && 'Your order has been received! ✨'}
                                {currentStepIndex === 1 && 'Your order is being prepared 👨‍🍳'}
                                {currentStepIndex === 2 && 'Your order is ready for pickup/delivery! 🎉'}
                                {currentStepIndex === 3 && 'Your order has been delivered! ✅'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Customer Notes */}
                {order.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                        <StickyNote size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-800">Your Notes</p>
                            <p className="text-sm text-amber-700 mt-1">{order.notes}</p>
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <FileText size={16} /> Order Details
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center px-4 py-3">
                                <div>
                                    <span className="font-medium text-gray-900">{item.name}</span>
                                    <span className="text-gray-400 ml-2">×{item.quantity}</span>
                                </div>
                                <span className="font-medium text-gray-700">
                                    {formatPrice(item.price * item.quantity, tenant.currency)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        {order.deliveryFee > 0 && (
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Delivery Fee</span>
                                <span>{formatPrice(order.deliveryFee, tenant.currency)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>{t.total}</span>
                            <span>{formatPrice(order.total, tenant.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-indigo-600">{order.customer.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{order.customer.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{order.customer.phone}</p>
                        </div>
                    </div>
                    {order.customer.address && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <span>{order.customer.address}</span>
                        </div>
                    )}
                </div>

                {/* Back to Store */}
                <div className="text-center pt-4">
                    <Link href={`/store/${slug}`}>
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                            ← Back to {tenant.name}
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
