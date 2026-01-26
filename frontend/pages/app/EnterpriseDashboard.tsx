import React, { useState } from 'react';
import {
    Layers,
    Zap,
    Activity,
    ArrowUpRight,
    Database,
    BrainCircuit,
    FileJson,
    Cpu,
    Sparkles
} from 'lucide-react';

const EnterpriseDashboard: React.FC = () => {
    const [datasetStats] = useState({
        activeBuilds: 3,
        totalAssets: '1.2M',
        indexedDuration: '450h'
    });

    const [activeBuilds] = useState([
        { id: 'BLD-998', name: 'Vision-Z-Alpha', type: 'Video', progress: 85, status: 'indexing' },
        { id: 'BLD-999', name: 'Audio-N-Primary', type: 'Audio', progress: 40, status: 'extracting' },
        { id: 'BLD-1000', name: 'Multi-Core-X', type: 'Mixed', progress: 12, status: 'queued' },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                        Enterprise Command
                    </h1>
                    <p className="text-gray-400 mt-1">High-fidelity data orchestration for frontier models.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-zinc-800 text-white font-medium border border-zinc-700 hover:bg-zinc-700 transition-colors">
                        GET API KEY
                    </button>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                        <Plus className="w-5 h-5" />
                        BUILD DATASET
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard icon={<Layers className="text-blue-400" />} label="ACTIVE BUILDS" value={datasetStats.activeBuilds.toString()} />
                <MetricCard icon={<Database className="text-emerald-400" />} label="TOTAL ASSETS" value={datasetStats.totalAssets} />
                <MetricCard icon={<Zap className="text-yellow-400" />} label="ENGINES RUNNING" value="12" />
                <MetricCard icon={<Activity className="text-red-400" />} label="API UPTIME" value="99.98%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Ingestion Pipeline */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-blue-400" />
                            Provisioning Pipeline
                        </h3>
                        <span className="text-xs font-mono text-zinc-500">REAL-TIME TELEMETRY</span>
                    </div>
                    <div className="space-y-6">
                        {activeBuilds.map((b) => (
                            <div key={b.id} className="group cursor-pointer">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="font-bold text-sm tracking-wide">{b.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-mono">{b.id} • {b.type.toUpperCase()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-mono">{b.progress}%</p>
                                        <p className="text-[10px] text-emerald-400 font-mono uppercase">{b.status}</p>
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000"
                                        style={{ width: `${b.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Automation Quick-Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-6 group hover:border-blue-500/50 transition-colors">
                        <BrainCircuit className="w-8 h-8 text-blue-400 mb-4" />
                        <h4 className="font-bold mb-2">RAG Indexer</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                            Deploy high-density semantic search over your private data lake.
                        </p>
                        <button className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            CONFIGURE <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-6 group hover:border-emerald-500/50 transition-colors">
                        <Sparkles className="w-8 h-8 text-emerald-400 mb-4" />
                        <h4 className="font-bold mb-2">Veo Creative Engine</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                            Orchestrate video generation using your brand's unique data baseline.
                        </p>
                        <button className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            NEW ADS PROJECT <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="bg-zinc-900 border border-zinc-800 p-5 group hover:border-zinc-700 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</span>
            {icon}
        </div>
        <div className="text-2xl font-bold font-mono tracking-tight">{value}</div>
    </div>
);

const Plus = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

export default EnterpriseDashboard;
