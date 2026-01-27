import React from 'react';
import { Database, Video, FileAudio, Users, Info } from 'lucide-react';

export const DataOverview: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-medium text-[#111]">Data Overview</h3>
                    <p className="text-stone-500 text-sm">Summary of active datasets and pipelines.</p>
                </div>
                <div className="group relative">
                    <Info size={16} className="text-gray-400 hover:text-gray-600 cursor-help" />
                    <div className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        Includes licensed, contributed, and live-streamed content processed through Harbor pipelines.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Database size={14} className="text-gray-400" />
                        <span className="text-xs font-mono uppercase text-gray-500 tracking-wider">Datasets</span>
                    </div>
                    <p className="text-3xl font-medium text-[#111] tracking-tight">12</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Database size={14} className="text-gray-400" />
                        <span className="text-xs font-mono uppercase text-gray-500 tracking-wider">Total Records</span>
                    </div>
                    <p className="text-3xl font-medium text-[#111] tracking-tight">8.4M</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Video size={14} className="text-gray-400" />
                        <span className="text-xs font-mono uppercase text-gray-500 tracking-wider">Video Hours</span>
                    </div>
                    <p className="text-3xl font-medium text-[#111] tracking-tight">142,380</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-xs font-mono uppercase text-gray-500 tracking-wider">Annotation</span>
                    </div>
                    <p className="text-3xl font-medium text-[#111] tracking-tight">87%</p>
                </div>
            </div>
        </div>
    );
};
