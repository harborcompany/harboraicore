import React from 'react';
import DatasetList from '../../components/datasets/DatasetList';
import { Database, HardDrive, Cpu, Activity } from 'lucide-react';

const DatasetEngine: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F9F8F6] pt-24 pb-12 px-6">
            <div className="max-w-[1400px] mx-auto">

                {/* Header - Engine Stats */}
                <div className="mb-10">
                    <h1 className="text-3xl font-medium tracking-tight text-[#1A1A1A] mb-2">Dataset Engine</h1>
                    <p className="text-stone-500">Manage, annotate, and index your multimodal assets.</p>
                </div>

                {/* Global Stats Strip */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <Database size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-medium tracking-tight text-[#1A1A1A]">2</div>
                            <div className="text-xs font-mono text-stone-500 uppercase">Active Datasets</div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                            <HardDrive size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-medium tracking-tight text-[#1A1A1A]">57 GB</div>
                            <div className="text-xs font-mono text-stone-500 uppercase">Total Storage</div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-medium tracking-tight text-[#1A1A1A]">1</div>
                            <div className="text-xs font-mono text-stone-500 uppercase">Vector Index</div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-stone-100 text-stone-600 rounded-lg flex items-center justify-center">
                            <Activity size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-medium tracking-tight text-[#1A1A1A]">99.9%</div>
                            <div className="text-xs font-mono text-stone-500 uppercase">System Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <DatasetList />
            </div>
        </div>
    );
};

export default DatasetEngine;
