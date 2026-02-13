import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Terminal, Cpu, Clock, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Experiment, TrainingLog } from '../../types';

const ExperimentView = () => {
    const { id } = useParams<{ id: string }>();
    const [experiment, setExperiment] = useState<Experiment | null>(null);
    const [loading, setLoading] = useState(true);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const fetchExperiment = async () => {
        if (!id) return;
        try {
            const res = await fetch(`/api/lab/experiments/${id}`);
            const json = await res.json();
            if (json.data) setExperiment(json.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiment();
        const interval = setInterval(fetchExperiment, 1000); // Live poll
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        // Auto-scroll logs
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [experiment?.logs]);

    if (loading) return <div className="p-12 text-center text-stone-500">Loading experiment...</div>;
    if (!experiment) return <div className="p-12 text-center text-red-500">Experiment not found</div>;

    const data = experiment.logs.map(log => ({
        step: log.step,
        loss: log.metrics['train/loss'],
        reward: log.metrics.reward
    }));

    return (
        <div className="flex flex-col h-full bg-[#09090b]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-[#0c0c0e]">
                <div className="flex items-center gap-4">
                    <Link to="/lab" className="text-stone-500 hover:text-white transition-colors">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            {experiment.name}
                            <StatusBadge status={experiment.status} />
                        </h1>
                        <div className="text-xs text-stone-500 font-mono">ID: {experiment.id}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono text-stone-400">
                    <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {(Date.now() - new Date(experiment.createdAt).getTime()) / 1000 > 0 ?
                            `${Math.floor((Date.now() - new Date(experiment.createdAt).getTime()) / 1000)}s elapsed` : 'Starting...'}
                    </div>
                    <div className="flex items-center gap-2">
                        <Cpu size={14} />
                        H100 x 8
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Main: Charts */}
                <div className="flex-1 p-6 overflow-y-auto border-r border-stone-800">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Throughput', value: `${(experiment.logs[experiment.logs.length - 1]?.metrics['orch/throughput'] || 0).toFixed(0)} tok/s`, color: 'text-emerald-400' },
                            { label: 'Active Rollouts', value: (experiment.logs[experiment.logs.length - 1]?.metrics['orch/active_rollouts'] || 0), color: 'text-blue-400' },
                            { label: 'Buffer Size', value: (experiment.logs[experiment.logs.length - 1]?.metrics['orch/buffer_size'] || 0).toLocaleString(), color: 'text-purple-400' },
                            { label: 'Grad Norm', value: (experiment.logs[experiment.logs.length - 1]?.metrics['train/grad_norm'] || 0).toFixed(4), color: 'text-amber-400' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#121214] border border-stone-800 p-3 rounded-lg">
                                <div className="text-stone-500 text-[10px] font-mono mb-1 uppercase tracking-wider">{stat.label}</div>
                                <div className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Loss Chart */}
                        <div className="bg-[#121214] border border-stone-800 rounded-lg p-4 h-64">
                            <h3 className="text-xs font-mono text-stone-500 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                TRAINING LOSS
                            </h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="step" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={10} domain={['auto', 'auto']} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px' }} />
                                    <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Reward Chart */}
                        <div className="bg-[#121214] border border-stone-800 rounded-lg p-4 h-64">
                            <h3 className="text-xs font-mono text-stone-500 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                MEAN REWARD
                            </h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="step" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={10} domain={[0, 1]} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px' }} />
                                    <Line type="monotone" dataKey="reward" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Config Viewer */}
                    <div className="bg-[#121214] border border-stone-800 rounded-lg overflow-hidden">
                        <div className="px-4 py-2 bg-stone-900 border-b border-stone-800 text-xs font-mono text-stone-400">
                            CONFIGURATION
                        </div>
                        <div className="p-4 font-mono text-xs text-stone-400 overflow-x-auto">
                            <pre>{JSON.stringify(experiment.config, null, 2)}</pre>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Logs */}
                <div className="w-full md:w-96 bg-[#0c0c0e] flex flex-col border-l border-stone-800">
                    <div className="px-4 py-3 border-b border-stone-800 flex items-center gap-2 text-stone-400 text-xs font-mono bg-[#0c0c0e]">
                        <Terminal size={14} />
                        LIVE LOGS
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 bg-[#09090b]">
                        {experiment.logs.map((log, i) => (
                            <div key={i} className="break-all border-l-2 border-transparent hover:border-stone-600 pl-2 py-0.5 transition-colors">
                                <span className="text-stone-600">[{new Date(log.timestamp).toISOString().split('T')[1].slice(0, 8)}]</span>{' '}
                                <span className="text-blue-500 font-bold">Step {log.step}:</span>{' '}
                                <span className="text-stone-400">
                                    loss=<span className="text-stone-300">{log.metrics['train/loss']?.toFixed(4)}</span>{' '}
                                    reward=<span className="text-stone-300">{log.metrics.reward?.toFixed(4)}</span>{' '}
                                    throughput=<span className="text-stone-500">{log.metrics['orch/throughput']?.toFixed(0)}</span>
                                </span>
                            </div>
                        ))}
                        {experiment.status === 'RUNNING' && (
                            <div className="animate-pulse text-emerald-500 pl-2">_</div>
                        )}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        'RUNNING': 'text-emerald-400',
        'QUEUED': 'text-amber-400',
        'COMPLETED': 'text-blue-400',
        'FAILED': 'text-red-400'
    };
    return <span className={`text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 ${colors[status] || 'text-stone-500'}`}>{status}</span>;
};

export default ExperimentView;
