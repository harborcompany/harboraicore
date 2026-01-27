import React from 'react';

export const LivePipelines: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-medium text-[#111]">Live Pipelines</h3>
                    <p className="text-stone-500 text-sm">Continuous ingestion status.</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Live</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                        <p className="text-sm font-medium text-[#111]">Linear Video Stream</p>
                        <p className="text-xs text-stone-500 font-mono">Ingest Rate: 1,120 hrs / week</p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                        <p className="text-sm font-medium text-[#111]">Image Ingest</p>
                        <p className="text-xs text-stone-500 font-mono">Processed (24h): 184,220</p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                        <p className="text-sm font-medium text-[#111]">Audio Stream</p>
                        <p className="text-xs text-stone-500 font-mono">Duration Added (24h): 312 hrs</p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
            </div>
        </div>
    );
};
