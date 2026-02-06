import React from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export const EarningsChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-medium text-stone-500 uppercase tracking-widest mb-1">Total Earnings</h3>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-serif text-[#1A1A1A] font-bold">$0.00</h2>
                        <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                            <TrendingUp size={14} /> 0%
                        </span>
                    </div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <DollarSign size={20} />
                </div>
            </div>

            {/* Mock Chart Visualization */}
            <div className="h-32 flex items-end gap-2 justify-between px-2">
                {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((h, i) => (
                    <div
                        key={i}
                        className="w-full bg-[#1A1A1A] rounded-t-sm opacity-5 relative group"
                        style={{ height: '5%' }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            $0.00
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-mono uppercase">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
            </div>
        </div>
    );
};
