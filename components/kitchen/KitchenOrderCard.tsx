'use client';

import { Order } from "@/lib/repository/types";
import { updateOrderStatus } from "@/app/actions/order-actions";
import { Clock, CheckCircle2, Printer, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Props {
  order: Order;
  slug: string;
}

export default function KitchenOrderCard({ order, slug }: Props) {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status: 'preparing' | 'ready') => {
    setLoading(true);
    await updateOrderStatus(order.id, status, slug);
    setLoading(false);
  };

  const handlePrint = () => {
    // For MVP, we'll just print the window, but in a real app this would
    // target a specific print-friendly version or use a thermal printer API.
    // We can add a class to body to hide everything else temporarily.
    window.print();
  };

  const timeElapsed = () => {
    const diff = Date.now() - new Date(order.date).getTime();
    const mins = Math.floor(diff / 60000);
    return `${mins}m ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden flex flex-col h-full print:border-black print:shadow-none break-inside-avoid">
       {/* Header */}
       <div className={`p-4 flex justify-between items-center ${order.status === 'preparing' ? 'bg-orange-50 border-b border-orange-100' : 'bg-gray-50 border-b border-gray-100'} print:bg-white print:border-b-2 print:border-black`}>
          <div>
              <span className="font-mono text-xs text-gray-500 print:text-black">#{order.id.slice(-4)}</span>
              <h3 className="font-bold text-lg leading-tight print:text-2xl">{order.customer.name.split(' ')[0]}</h3>
          </div>
          <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-medium text-gray-600 print:text-black">
                  <Clock size={14} /> {timeElapsed()}
              </div>
              <div className="text-xs text-gray-400 print:hidden">
                  {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
          </div>
       </div>

       {/* Items */}
       <div className="p-4 flex-1">
          <ul className="space-y-3">
              {order.items.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-lg font-medium leading-snug">
                      <span className="bg-gray-100 text-gray-800 px-2 rounded min-w-[32px] text-center font-bold print:border print:border-black print:bg-transparent">
                          {item.quantity}x
                      </span>
                      <span className="text-gray-800 print:text-black">
                          {item.name}
                      </span>
                  </li>
              ))}
          </ul>
       </div>

       {/* Actions (Hidden on Print) */}
       <div className="p-4 pt-0 mt-auto grid grid-cols-2 gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="col-span-2 py-2 text-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-2 mb-2"
          >
              <Printer size={16} /> Print Ticket
          </button>

          {order.status === 'pending' && (
              <button 
                onClick={() => handleStatusUpdate('preparing')}
                disabled={loading}
                className="col-span-2 btn-primary bg-orange-500 hover:bg-orange-600 border-none text-white py-4 text-lg"
              >
                  {loading ? 'Updating...' : 'Start Cooking'}
              </button>
          )}

          {order.status === 'preparing' && (
              <button 
                 onClick={() => handleStatusUpdate('ready')}
                 disabled={loading}
                 className="col-span-2 btn-primary bg-green-600 hover:bg-green-700 border-none text-white py-4 text-lg flex items-center justify-center gap-2"
              >
                  <CheckCircle2 size={24} />
                  {loading ? 'Updating...' : 'Mark Ready'}
              </button>
          )}
       </div>
    </div>
  );
}
