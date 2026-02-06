import React from 'react';
import { PieChart } from 'lucide-react';

export const ResourceUsage: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
            <h3 className="text-lg font-medium text-[#111] mb-6">Usage</h3>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-600">Storage</span>
                        <span className="font-medium text-[#111]">72%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-800 w-[72%]"></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-600">API Requests (30d)</span>
                        <span className="font-medium text-[#111]">1.4M</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-800 w-[45%]"></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-600">Streaming Throughput</span>
                        <span className="font-medium text-[#111]">61%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-800 w-[61%]"></div>
                    </div>
                </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-6 text-center">Usage resets on Feb 1, 2026</p>
        </div>
    );
};
