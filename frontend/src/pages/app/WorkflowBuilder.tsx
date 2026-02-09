import React from 'react';
import { ArrowLeft, Plus, Settings, Play, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkflowBuilder: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col bg-white -m-8">
            {/* Header */}
            <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-medium text-gray-900">Untitled Workflow</h1>
                        <p className="text-xs text-gray-500">Draft • Last saved just now</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                        Save Draft
                    </button>
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <Play size={16} fill="currentColor" />
                        Run
                    </button>
                </div>
            </header>

            {/* Main Canvas Area */}
            <div className="flex-1 flex overflow-hidden relative bg-stone-50">
                {/* Sidebar */}
                <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nodes</h2>
                    </div>
                    <div className="p-4 space-y-3">
                        {['Input Source', 'Transformation', 'AI Model', 'Filter', 'Output Destination'].map((item) => (
                            <div key={item} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 transition-colors flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                    <Plus size={16} className="text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Canvas Grid */}
                <div className="flex-1 overflow-auto relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 p-12 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Settings size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Workflow Canvas Beta</h2>
                            <p className="text-gray-600 mb-6">
                                The visual workflow builder is currently being rolled out to Enterprise partners.
                                Your organization is on the priority list.
                            </p>
                            <button
                                onClick={() => navigate('/app')}
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilder;
