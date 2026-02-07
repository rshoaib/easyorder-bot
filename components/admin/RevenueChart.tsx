'use client';

import { useMemo } from 'react';
import { DollarSign } from 'lucide-react';

interface RevenueChartProps {
    orders: {
        date: string;
        total: number;
        status: string;
    }[];
    currency: string;
}

export default function RevenueChart({ orders, currency }: RevenueChartProps) {
    const dailyData = useMemo(() => {
        const days = [];
        const today = new Date();
        
        // Generate last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            
            // Filter orders for this day and strictly count only active/completed revenue (exclude cancelled)
            const dayTotal = orders
                .filter(o => o.date.startsWith(dateStr) && o.status !== 'cancelled')
                .reduce((sum, o) => sum + o.total, 0);

            days.push({
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: dateStr,
                value: dayTotal
            });
        }
        return days;
    }, [orders]);

    const maxValue = Math.max(...dailyData.map(d => d.value), 1); // Avoid div by zero

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Weekly Revenue</h3>
                    <p className="text-sm text-gray-500">Last 7 days performance</p>
                </div>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <DollarSign size={20} />
                </div>
            </div>

            <div className="flex items-end justify-between h-40 gap-2">
                {dailyData.map((day) => {
                    const heightPercent = (day.value / maxValue) * 100;
                    return (
                        <div key={day.fullDate} className="flex flex-col items-center gap-2 flex-1 group relative">
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {currency}{day.value.toFixed(2)}
                            </div>
                            
                            {/* Bar */}
                            <div 
                                className="w-full bg-indigo-50 rounded-t-lg relative overflow-hidden transition-all group-hover:bg-indigo-100"
                                style={{ height: '100%' }}
                            >
                                <div 
                                    className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500 ease-out group-hover:bg-indigo-600"
                                    style={{ height: `${heightPercent}%` }}
                                ></div>
                            </div>
                            
                            {/* Label */}
                            <span className="text-xs text-gray-500 font-medium">{day.date}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
