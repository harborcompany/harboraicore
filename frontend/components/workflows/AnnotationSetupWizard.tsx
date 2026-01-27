import React, { useState } from 'react';
import { X, ArrowRight, Check, Loader2, Target, PenTool, Hash, Clock, ThumbsUp } from 'lucide-react';

interface AnnotationSetupWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    { title: 'Select Dataset', id: 'dataset' },
    { title: 'Define Task', id: 'task' },
    { title: 'Quality Controls', id: 'quality' },
    { title: 'Scale & Timeline', id: 'scale' },
    { title: 'Review', id: 'review' }
];

const AnnotationSetupWizard: React.FC<AnnotationSetupWizardProps> = ({ isOpen, onClose }) => {
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-[80vh]">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono uppercase text-gray-400 tracking-widest bg-gray-50 px-2 py-1 rounded">Wizard</span>
                            <span className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</span>
                        </div>
                        <h2 className="text-2xl font-medium text-[#111]">{STEPS[step].title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-[#111] transition-colors p-2 hover:bg-gray-50 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Main Content Area - split layout */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left: Form */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        {step === 0 && (
                            <div className="space-y-6">
                                <p className="text-gray-500">Choose an existing dataset or upload proprietary data.</p>
                                <div className="grid grid-cols-1 gap-4">
                                    <button className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-[#111] hover:bg-gray-50 transition-all text-left group">
                                        <div>
                                            <h3 className="font-medium text-[#111]">Existing Harbor dataset</h3>
                                            <p className="text-sm text-gray-500">Select from your active library</p>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-[#111]" />
                                    </button>
                                    <button className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-[#111] hover:bg-gray-50 transition-all text-left group">
                                        <div>
                                            <h3 className="font-medium text-[#111]">Upload new data</h3>
                                            <p className="text-sm text-gray-500">Drag & drop or S3 import</p>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-[#111]" />
                                    </button>
                                    <button className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-[#111] hover:bg-gray-50 transition-all text-left group">
                                        <div>
                                            <h3 className="font-medium text-[#111]">Connect live stream</h3>
                                            <p className="text-sm text-gray-500">Annotate continuous feed</p>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-[#111]" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 block">Task Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: 'Object detection', icon: Target },
                                            { label: 'Segmentation', icon: PenTool },
                                            { label: 'Classification', icon: Hash },
                                            { label: 'Temporal events', icon: Clock }, // using Clock for temporal
                                            { label: 'RLHF / Ranking', icon: ThumbsUp }
                                        ].map((opt) => (
                                            <button key={opt.label} className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-[#111] hover:bg-gray-50 transition-all text-center h-24">
                                                <opt.icon size={20} className="text-gray-600" />
                                                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block">Instructions</label>
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#111] transition-colors resize-none"
                                        placeholder="Describe labeling guidelines and edge cases."
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700 block">Quality Settings</label>
                                    <div className="space-y-3">
                                        {['Multi-annotator agreement', 'Expert review required', 'Automated validation checks'].map((opt) => (
                                            <label key={opt} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                                                <span className="font-medium text-gray-700">{opt}</span>
                                                <input type="checkbox" className="rounded border-gray-300 text-[#111] focus:ring-[#111]" />
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Quality thresholds ensure consistency and reliability.</p>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-gray-700 block">Volume</label>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Number of samples</label>
                                        <input type="number" className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#111]" placeholder="1000" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-gray-700 block">Priority</label>
                                    <div className="flex gap-4">
                                        {['Standard', 'Accelerated'].map(p => (
                                            <label key={p} className="flex-1 flex items-center justify-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input type="radio" name="priority" className="border-gray-300 text-[#111] focus:ring-[#111] mr-2" />
                                                <span className="text-sm font-medium text-gray-700">{p}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Estimated Completion</span>
                                        <span className="font-medium text-[#111]">Feb 12, 2024</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-lg font-medium text-[#111] mb-6">Summary</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-500">Dataset</span>
                                        <span className="font-medium">Retail_V1 (Selected)</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-500">Task Type</span>
                                        <span className="font-medium">Object Detection</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-500">Volume</span>
                                        <span className="font-medium">2,500 Samples</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-500">Controls</span>
                                        <span className="font-medium">Expert Review</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-500">ETA</span>
                                        <span className="font-medium">~3 Days</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar / Helper (Optional in mobile but good for desktop wizard) */}
                    <div className="hidden md:block w-72 bg-gray-50 border-l border-gray-100 p-8">
                        <div className="sticky top-8">
                            <h4 className="text-sm font-medium text-[#111] mb-4">Wizard Guide</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-6">
                                Configure your annotation pipeline with precision. Tasks are routed to our expert workforce or processed via automated labeling depending on your quality settings.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-stone-600">
                                    <Check size={14} className="text-emerald-500" />
                                    <span>Project Isolation</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-stone-600">
                                    <Check size={14} className="text-emerald-500" />
                                    <span>Audit Trail</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-stone-600">
                                    <Check size={14} className="text-emerald-500" />
                                    <span>SLA Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 flex justify-between items-center bg-white rounded-b-2xl">
                    <button
                        onClick={handleBack}
                        disabled={step === 0}
                        className="px-6 py-2.5 text-gray-500 font-medium hover:text-[#111] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={submitting}
                        className="px-8 py-3 bg-[#111] text-white rounded-lg font-medium hover:bg-black transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-gray-200"
                    >
                        {submitting && <Loader2 size={14} className="animate-spin" />}
                        {step === STEPS.length - 1 ? 'Launch Annotation Task' : 'Continue'}
                        {step !== STEPS.length - 1 && <ArrowRight size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnotationSetupWizard;
