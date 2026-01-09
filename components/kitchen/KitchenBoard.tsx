'use client';

import { Order } from "@/lib/repository/types";
import KitchenOrderCard from "./KitchenOrderCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

interface Props {
    orders: Order[];
    slug: string;
}

export default function KitchenBoard({ orders, slug }: Props) {
    const router = useRouter();

    useEffect(() => {
        // Poll for new orders every 30 seconds
        const interval = setInterval(() => {
            router.refresh();
        }, 30000);

        return () => clearInterval(interval);
    }, [router]);

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const preparingOrders = orders.filter(o => o.status === 'preparing');

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="flex justify-between items-center mb-8 print:hidden">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Kitchen Display</h1>
                    <p className="text-gray-500">Live feed for {slug}</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm border border-gray-100">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live
                     </div>
                     <button onClick={() => router.refresh()} className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 border border-gray-200">
                        <RefreshCw size={20} />
                     </button>
                </div>
            </header>

            {orders.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <RefreshCw size={32} className="animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-500">All caught up!</h2>
                    <p>No active orders in the queue.</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Prioritize Preparing, then Pending */}
                    {[...preparingOrders, ...pendingOrders].map(order => (
                        <KitchenOrderCard key={order.id} order={order} slug={slug} />
                    ))}
                </div>
            )}
        </div>
    );
}
