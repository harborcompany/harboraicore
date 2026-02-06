import React, { useState } from 'react';
import { Play, Pause, Check, X, AlertTriangle, Eye, ChevronRight } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/admin/AdminComponents';

export const AdminSubmissionReview: React.FC = () => {
    const [playing, setPlaying] = useState(false);

    // Mock Data
    const submission = {
        id: 'sub_8x92',
        contributor: 'alex.chen@example.com',
        type: 'LEGO Assembly',
        duration: '14:20',
        uploadedAt: '2026-02-06 09:30 AM',
        status: 'pending_review',
        autoAnnotations: {
            qualityScore: 94,
            confidence: 0.98,
            actions: [
                { time: '0:15', label: 'search_piece', conf: 0.99 },
                { time: '0:45', label: 'align_brick', conf: 0.95 },
                { time: '1:10', label: 'attach_brick', conf: 0.98 },
                { time: '1:45', label: 'adjust_fit', conf: 0.88 },
            ],
            failures: [
                { time: '4:20', type: 'misalignment', severity: 'low' }
            ]
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto p-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                        Review Submission <span className="text-gray-500 font-mono text-base">{submission.id}</span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Contributor: {submission.contributor} • {submission.type} • {submission.uploadedAt}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded border border-red-500/20 flex items-center gap-2 transition-colors">
                        <X size={16} /> Reject
                    </button>
                    <button className="px-4 py-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 rounded border border-yellow-500/20 flex items-center gap-2 transition-colors">
                        <AlertTriangle size={16} /> Partial
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20">
                        <Check size={16} /> Approve & Pay
                    </button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left: Video Player */}
                <div className="col-span-8 bg-black rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPlaying(!playing)}
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                {playing ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                            </button>
                            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-blue-500"></div>
                            </div>
                            <span className="text-sm font-medium text-white">{submission.duration}</span>
                        </div>
                    </div>
                    <p className="text-gray-500">Video Player Component Placeholder</p>
                </div>

                {/* Right: Analysis & Logs */}
                <div className="col-span-4 flex flex-col gap-6 min-h-0">

                    {/* Metrics Card */}
                    <div className="bg-[#141414] border border-gray-800 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Quality Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">{submission.autoAnnotations.qualityScore}</div>
                                <div className="text-xs text-gray-500">Quality Score</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">{(submission.autoAnnotations.confidence * 100).toFixed(0)}%</div>
                                <div className="text-xs text-gray-500">AI Confidence</div>
                            </div>
                        </div>
                    </div>

                    {/* Annotations List */}
                    <div className="bg-[#141414] border border-gray-800 rounded-xl flex-1 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Event Log</h3>
                            <button className="text-blue-400 text-xs hover:text-blue-300">View JSON</button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                            {submission.autoAnnotations.actions.map((action, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">{action.time}</span>
                                        <span className="text-sm text-gray-300">{action.label}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-600 group-hover:text-gray-500">{(action.conf * 100).toFixed(0)}%</span>
                                        <ChevronRight size={14} className="text-gray-700 group-hover:text-gray-500" />
                                    </div>
                                </div>
                            ))}
                            {submission.autoAnnotations.failures.map((fail, i) => (
                                <div key={`fail-${i}`} className="flex items-center justify-between p-3 bg-red-500/5 hover:bg-red-500/10 rounded transition-colors cursor-pointer border border-red-500/10">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">{fail.time}</span>
                                        <span className="text-sm text-red-200">{fail.type}</span>
                                    </div>
                                    <span className="text-xs text-red-400 uppercase font-medium">{fail.severity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
