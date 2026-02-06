import React, { useState } from 'react';
import { X, ArrowRight, Check, Loader2, Workflow, Database, Play } from 'lucide-react';

interface CreateWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    { title: 'Workflow Type', id: 'type' },
    { title: 'Inputs', id: 'inputs' },
    { title: 'Processing', id: 'processing' },
    { title: 'Output', id: 'output' },
    { title: 'Review', id: 'review' }
];

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        onClose(); // In a real app, show success or navigate
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-medium text-[#111]">Create Workflow</h2>
                        <p className="text-sm text-gray-500 mt-1">Define an end-to-end pipeline from data ingestion to delivery.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-[#111] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress */}
                <div className="px-6 pt-4">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">
                        Step {step + 1} of {STEPS.length}: <span className="text-[#111]">{STEPS[step].title}</span>
                    </div>
                    <div className="h-1 bg-gray-100 w-full rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#111] transition-all duration-300 ease-out"
                            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {step === 0 && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700 block">Select Workflow Type</label>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { title: 'Dataset preparation', desc: 'Ingest and clean raw data' },
                                    { title: 'Annotation & review', desc: 'Labeling workflows with human loop' },
                                    { title: 'RLHF pipeline', desc: 'Preference ranking and feedback' },
                                    { title: 'Continuous ingestion', desc: 'Live stream processing' },
                                    { title: 'Evaluation dataset', desc: 'Model benchmarking set' }
                                ].map((opt) => (
                                    <button key={opt.title} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#111] hover:bg-gray-50 text-left transition-all group">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm">
                                            <Workflow size={18} className="text-gray-500 group-hover:text-[#111]" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-[#111]">{opt.title}</h3>
                                            <p className="text-sm text-gray-500">{opt.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 block">Data Source</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {['Harbor dataset', 'Uploaded data', 'Live stream'].map(src => (
                                        <button key={src} className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-[#111] hover:border-[#111] bg-white hover:bg-gray-50 transition-all">
                                            {src}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 block">Versioning Strategy</label>
                                <div className="space-y-2">
                                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="versioning" className="mt-1" />
                                        <div>
                                            <span className="block text-sm font-medium text-[#111]">Snapshot</span>
                                            <span className="block text-xs text-gray-500">Create immutable version at specific time</span>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="versioning" className="mt-1" />
                                        <div>
                                            <span className="block text-sm font-medium text-[#111]">Continuous updates</span>
                                            <span className="block text-xs text-gray-500">Append new data as it arrives</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700 block">Processing Steps</label>
                            <div className="space-y-2">
                                {['Annotation', 'QA & validation', 'Metadata enrichment', 'Human feedback'].map((proc) => (
                                    <label key={proc} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="rounded border-gray-300 text-[#111] focus:ring-[#111]" />
                                            <span className="font-medium text-[#111]">{proc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 block">Delivery Method</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['API', 'Export', 'Streaming'].map(method => (
                                        <button key={method} className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-[#111] hover:border-[#111] transition-all">
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 block">Update Cadence</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['One-time', 'Scheduled', 'Real-time'].map(cadence => (
                                        <button key={cadence} className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-[#111] hover:border-[#111] transition-all">
                                            {cadence}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 shadow-sm">
                                <Check size={20} className="text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-medium text-[#111] mb-2">Ready to Activate</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Your workflow pipeline is configured and ready to start processing.
                            </p>
                            <div className="text-left bg-white p-4 rounded-lg border border-gray-200 text-sm space-y-2 mb-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-medium">Annotation & review</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Source</span>
                                    <span className="font-medium">Harbor Dataset</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Output</span>
                                    <span className="font-medium">API via JSON</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={step === 0}
                        className="px-5 py-2.5 text-gray-500 font-medium text-sm hover:text-[#111] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={submitting}
                        className="px-6 py-2.5 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting && <Loader2 size={14} className="animate-spin" />}
                        {step === STEPS.length - 1 ? 'Activate Workflow' : 'Continue'}
                        {step !== STEPS.length - 1 && <ArrowRight size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkflowModal;
