import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';

interface RequestDatasetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RequestDatasetModal: React.FC<RequestDatasetModalProps> = ({ isOpen, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={32} />
                    </div>
                    <h2 className="text-xl font-medium text-[#111] mb-2">Request Submitted</h2>
                    <p className="text-gray-500 mb-8">
                        Your request has been submitted. A Harbor specialist will follow up shortly to discuss your data requirements.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-[#111] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-medium text-[#111]">Request a Dataset</h2>
                        <p className="text-sm text-gray-500 mt-1">Specify your requirements and we’ll design a dataset aligned to your model objectives.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-[#111] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="dataset-request-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* SECTION 1: USE CASE & OBJECTIVE */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-mono uppercase text-gray-400 tracking-widest font-medium">Use Case & Objective</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Primary use case</label>
                                    <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#111] focus:border-[#111] transition-colors">
                                        <option>Model training</option>
                                        <option>Fine-tuning</option>
                                        <option>Evaluation / benchmarking</option>
                                        <option>RLHF / human feedback</option>
                                        <option>Production monitoring</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Brief description (optional)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#111] focus:border-[#111] transition-colors"
                                        placeholder="Describe what you’re training and what the data should represent."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: DATA MODALITIES */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-mono uppercase text-gray-400 tracking-widest font-medium">Data Modalities</h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="text-sm font-medium text-gray-700 block mb-3">Data types required</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {['Video', 'Images', 'Audio', 'Text', 'Multimodal'].map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded border-gray-300 text-[#111] focus:ring-[#111]" />
                                            <span className="text-sm text-gray-600">{type}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                                    Harbor supports single- and multi-modal datasets.
                                </p>
                            </div>
                        </div>

                        {/* SECTION 3: DATA CHARACTERISTICS */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-mono uppercase text-gray-400 tracking-widest font-medium">Data Characteristics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Content domain</label>
                                    <div className="space-y-2">
                                        {['Advertising & marketing', 'Industrial / robotics', 'Retail & ecommerce', 'Media & entertainment', 'Education', 'Custom domain'].map((domain) => (
                                            <label key={domain} className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded border-gray-300 text-[#111] focus:ring-[#111]" />
                                                <span className="text-sm text-gray-600">{domain}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Scale required</label>
                                    <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#111] focus:border-[#111] transition-colors">
                                        <option>&lt;1K samples</option>
                                        <option>1K–100K samples</option>
                                        <option>100K–1M samples</option>
                                        <option>Continuous stream</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: ANNOTATION & METADATA */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-mono uppercase text-gray-400 tracking-widest font-medium">Annotation & Metadata</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Annotation required?</label>
                                    <div className="flex gap-6">
                                        {['Yes', 'No', 'Not sure'].map((opt) => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="annotation_req" className="border-gray-300 text-[#111] focus:ring-[#111]" />
                                                <span className="text-sm text-gray-600">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {/* Conditional Logic could go here for annotation types */}
                                <div className="pl-4 border-l-2 border-gray-100">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Annotation types</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Bounding boxes', 'Segmentation', 'Classification', 'Temporal labeling', 'Human preference / RLHF'].map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded border-gray-300 text-[#111] focus:ring-[#111]" />
                                                <span className="text-sm text-gray-600">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Annotation workflows are tailored per dataset.</p>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 5: DELIVERY & ACCESS */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-mono uppercase text-gray-400 tracking-widest font-medium">Delivery & Access</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Delivery method</label>
                                    <div className="space-y-2">
                                        {['API access', 'Cloud export', 'Streaming access'].map((method) => (
                                            <label key={method} className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded border-gray-300 text-[#111] focus:ring-[#111]" />
                                                <span className="text-sm text-gray-600">{method}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Timeline</label>
                                    <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#111] focus:border-[#111] transition-colors">
                                        <option>ASAP</option>
                                        <option>2–4 weeks</option>
                                        <option>Custom timeline</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 6: COMPLIANCE */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-mono uppercase text-gray-400 tracking-widest font-medium">Compliance (Optional)</h3>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Requirements</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Licensing & provenance', 'Privacy / PII handling', 'Regulated industry', 'None'].map((req) => (
                                        <label key={req} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded border-gray-300 text-[#111] focus:ring-[#111]" />
                                            <span className="text-sm text-gray-600">{req}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="dataset-request-form"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting && <Loader2 size={14} className="animate-spin" />}
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestDatasetModal;
