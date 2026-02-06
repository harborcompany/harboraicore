import React from 'react';
import { ArrowRight } from 'lucide-react';

export const WorkflowList: React.FC = () => {
    const workflows = [
        { name: "Ad Training Dataset", stage: "QA Review", progress: 78, status: "Active" },
        { name: "Robotics Vision Set", stage: "Annotation", progress: 42, status: "Active" },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium text-[#111]">Workflows</h3>
                    <p className="text-stone-500 text-sm">Active pipelines.</p>
                </div>
                <button className="text-xs font-medium text-[#111] hover:text-gray-600 border-b border-gray-200 pb-0.5 transition-colors">
                    View All
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {workflows.map((wf) => (
                    <div key={wf.name} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-medium text-[#111] text-sm">{wf.name}</h4>
                                <span className="text-xs text-stone-500 font-mono uppercase tracking-wide">{wf.stage}</span>
                            </div>
                            <span className="text-xs font-bold text-[#111]">{wf.progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${wf.progress}%` }}></div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New */}
                <button className="w-full py-3 border border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:text-[#111] hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                    Create Workflow <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};
