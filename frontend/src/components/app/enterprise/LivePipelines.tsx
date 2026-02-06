import React from 'react';

export const LivePipelines: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-medium text-[#111]">Live Pipelines</h3>
                    <p className="text-stone-500 text-sm">Continuous ingestion status.</p>
                </div>
                <div className="flex items-center gap-1.5 opacity-50">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-300"></span>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Offline</span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-sm font-medium text-gray-400">No active pipelines</p>
                <p className="text-xs text-gray-300 mt-1">Connect a data source to begin.</p>
            </div>
        </div>
    );
};
