import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

export const DataQuality: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-medium text-[#111]">Data Quality</h3>
                    <p className="text-stone-500 text-sm">Automated and human-validated scores.</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide flex items-center gap-1">
                    <CheckCircle2 size={12} /> Target
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-sm text-stone-600 font-medium flex items-center gap-1">
                            Annotation Agreement
                            <Info size={12} className="text-gray-300" />
                        </p>
                        <p className="text-lg font-bold text-[#111]">94.2%</p>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black w-[94.2%] rounded-full"></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-sm text-stone-600 font-medium">Metadata Coverage</p>
                        <p className="text-lg font-bold text-[#111]">98.0%</p>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black w-[98%] rounded-full"></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-sm text-stone-600 font-medium">QA Pass Rate</p>
                        <p className="text-lg font-bold text-[#111]">96.7%</p>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black w-[96.7%] rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
