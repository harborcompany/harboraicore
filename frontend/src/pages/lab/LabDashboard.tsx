import React, { useEffect, useState } from 'react';
import { Plus, Play, Clock, CheckCircle, XCircle, Terminal as TerminalIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Experiment } from '../../types';

// Mock data fetcher until we hook up the hook
const LabDashboard = () => {
    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExperiments = async () => {
        try {
            const res = await fetch('/api/lab/experiments');
            const json = await res.json();
            if (json.data) setExperiments(json.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiments();
        const interval = setInterval(fetchExperiments, 2000); // Poll for updates
        return () => clearInterval(interval);
    }, []);

    const createExperiment = async () => {
        // Quick start a demo run
        try {
            await fetch('/api/lab/experiments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `Run-${Math.floor(Math.random() * 1000)}`,
                    config: {
                        model: { name: "Qwen-7B-Instruct" },
                        orchestrator: {
                            batch_size: 512,
                            rollouts_per_example: 16,
                            env: [{ id: "harbor/lego-v1", name: "lego" }]
                        }
                    }
                })
            });
            fetchExperiments();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Experiments</h1>
                    <p className="text-stone-400 text-sm">Manage training runs and evaluations.</p>
                </div>
                <button
                    onClick={createExperiment}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
                >
                    <Plus size={16} /> New Run
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-12">
                {[
                    { label: 'Active Runs', value: experiments.filter(e => e.status === 'RUNNING').length, color: 'text-emerald-400' },
                    { label: 'Queued', value: experiments.filter(e => e.status === 'QUEUED').length, color: 'text-amber-400' },
                    { label: 'Completed', value: experiments.filter(e => e.status === 'COMPLETED').length, color: 'text-blue-400' },
                    { label: 'Total GPU Hours', value: '12,450', color: 'text-purple-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#121214] border border-stone-800 p-4 rounded-lg">
                        <div className="text-stone-500 text-xs font-mono mb-1 uppercase">{stat.label}</div>
                        <div className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Experiments Table */}
            <div className="bg-[#121214] border border-stone-800 rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 px-6 py-3 border-b border-stone-800 text-xs font-mono text-stone-500">
                    <div className="col-span-4">NAME / ID</div>
                    <div className="col-span-2">STATUS</div>
                    <div className="col-span-2">MODEL</div>
                    <div className="col-span-2">STEP</div>
                    <div className="col-span-2 text-right">CREATED</div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-stone-500 text-sm">Loading experiments...</div>
                ) : (
                    experiments.map(exp => (
                        <Link
                            to={`/lab/experiments/${exp.id}`}
                            key={exp.id}
                            className="grid grid-cols-12 px-6 py-4 border-b border-stone-800/50 hover:bg-stone-800/30 transition-colors items-center group cursor-pointer"
                        >
                            <div className="col-span-4">
                                <div className="font-medium text-stone-200 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                    <TerminalIcon size={14} className="opacity-50" />
                                    {exp.name}
                                </div>
                                <div className="text-xs text-stone-600 font-mono mt-0.5">{exp.id.slice(0, 8)}</div>
                            </div>
                            <div className="col-span-2">
                                <StatusBadge status={exp.status} />
                            </div>
                            <div className="col-span-2 text-sm text-stone-400">
                                {exp.config?.model?.name || 'Unknown'}
                            </div>
                            <div className="col-span-2 font-mono text-xs text-stone-400">
                                {exp.currentStep} / {exp.totalSteps}
                            </div>
                            <div className="col-span-2 text-right text-xs text-stone-500 font-mono">
                                {new Date(exp.createdAt).toLocaleTimeString()}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'RUNNING':
            return <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 text-xs font-medium border border-emerald-900/50"><Play size={10} /> Running</div>;
        case 'QUEUED':
            return <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-900/30 text-amber-400 text-xs font-medium border border-amber-900/50"><Clock size={10} /> Queued</div>;
        case 'COMPLETED':
            return <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-900/30 text-blue-400 text-xs font-medium border border-blue-900/50"><CheckCircle size={10} /> Done</div>;
        case 'FAILED':
            return <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-900/30 text-red-400 text-xs font-medium border border-red-900/50"><XCircle size={10} /> Failed</div>;
        default:
            return <span className="text-stone-500">{status}</span>;
    }
};

export default LabDashboard;
