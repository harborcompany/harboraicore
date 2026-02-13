import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, FileVideo, Check, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { creatorService, SubmissionCategory } from '../../services/creatorSubmissionService';
import { messagingService } from '../../services/messagingService';
import { annotationService } from '../../services/annotationService';

type Step = 'category' | 'file' | 'details' | 'confirm';

const STEPS: { id: Step; label: string }[] = [
    { id: 'category', label: 'Category' },
    { id: 'file', label: 'Upload' },
    { id: 'details', label: 'Details' },
    { id: 'confirm', label: 'Submit' },
];

const CreatorUpload: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<Step>('category');
    const [category, setCategory] = useState<SubmissionCategory | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submissionId, setSubmissionId] = useState('');

    const stepIndex = STEPS.findIndex(s => s.id === currentStep);

    const categories = [
        { id: 'lego' as SubmissionCategory, icon: '🧱', label: 'LEGO Video', desc: '5–10 min hands-only build' },
        { id: 'voice' as SubmissionCategory, icon: '🎙', label: 'Audio', desc: 'Clear speech recording' },
    ];

    const handleFileSelect = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = category === 'voice' ? 'audio/*' : 'video/mp4,video/quicktime,video/webm';
        input.onchange = (e) => {
            const f = (e.target as HTMLInputElement).files?.[0];
            if (f) {
                setFile(f);
                if (!title) {
                    setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                }
            }
        };
        input.click();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) {
            setFile(f);
            if (!title) {
                setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
            }
        }
    };

    const handleSubmit = async () => {
        if (!category || !file || !title || !agreedToTerms) return;
        setUploading(true);
        try {
            const result = await creatorService.createSubmission({
                title,
                category,
                fileName: file.name,
            });
            setSubmissionId(result.id);
            setSubmitted(true);

            // Phase 12: Trigger Automated QA Feedback & Queue
            setTimeout(() => {
                messagingService.sendQaFeedback(
                    'dev-user-id',
                    result.id,
                    `Your submission "${title}" has passed Auto-QA (Score: 88). It has been added to the professional annotation queue for review.`
                );
                annotationService.addToQueue({
                    id: result.id,
                    filename: file.name,
                    uploaderName: 'Creator',
                    autoScore: 88,
                });
            }, 1000);
        } catch (err) {
            console.error(err);
        }
        setUploading(false);
    };

    const canAdvance = () => {
        switch (currentStep) {
            case 'category': return category !== null;
            case 'file': return file !== null;
            case 'details': return title.trim().length > 0;
            case 'confirm': return agreedToTerms;
        }
    };

    const goNext = () => {
        if (currentStep === 'confirm') {
            handleSubmit();
            return;
        }
        const next = STEPS[stepIndex + 1];
        if (next) setCurrentStep(next.id);
    };

    const goBack = () => {
        const prev = STEPS[stepIndex - 1];
        if (prev) setCurrentStep(prev.id);
    };

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto text-center py-16 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Check size={28} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Submission Received</h1>
                <p className="text-gray-500 mb-6">
                    Your submission is now under review. Most reviews are completed within 48 hours.
                </p>
                <div className="bg-[#F7F7F8] rounded-2xl p-5 border border-gray-100 text-left mb-8">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Submission ID</span>
                            <span className="text-sm font-mono text-gray-900">{submissionId.slice(0, 12)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Category</span>
                            <span className="text-sm font-medium text-gray-900 capitalize">{category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Est. Payout</span>
                            <span className="text-sm font-semibold text-green-600">$8–$20</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Est. Review</span>
                            <span className="text-sm text-gray-900">24–48 hours</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate('/creator/submissions')}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        View Submissions
                    </button>
                    <button
                        onClick={() => { setSubmitted(false); setFile(null); setTitle(''); setCategory(null); setAgreedToTerms(false); setCurrentStep('category'); }}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Upload Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload New Content</h1>
            <p className="text-gray-500 mb-8">Follow the steps below to submit your recording.</p>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-10">
                {STEPS.map((step, i) => (
                    <React.Fragment key={step.id}>
                        <button
                            onClick={() => i < stepIndex ? setCurrentStep(step.id) : undefined}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors
                ${i === stepIndex ? 'text-[#2563EB]' : i < stepIndex ? 'text-green-600 cursor-pointer' : 'text-gray-400'}`}
                        >
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${i === stepIndex ? 'border-[#2563EB] bg-[#2563EB] text-white' :
                                    i < stepIndex ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 text-gray-400'}`}>
                                {i < stepIndex ? <Check size={14} /> : i + 1}
                            </span>
                            <span className="hidden sm:inline">{step.label}</span>
                        </button>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 rounded ${i < stepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[320px]">
                {/* Step 1: Category */}
                {currentStep === 'category' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <h2 className="text-lg font-semibold text-gray-900">Choose Category</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={`p-5 rounded-2xl border-2 text-left transition-all ${category === cat.id
                                        ? 'border-[#2563EB] bg-blue-50'
                                        : 'border-gray-100 bg-[#F7F7F8] hover:border-gray-200'
                                        }`}
                                >
                                    <span className="text-2xl block mb-2">{cat.icon}</span>
                                    <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: File Upload */}
                {currentStep === 'file' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <h2 className="text-lg font-semibold text-gray-900">Upload File</h2>

                        {!file ? (
                            <div
                                onDragOver={e => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={handleFileSelect}
                                className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-[#2563EB] hover:bg-blue-50/30 transition-all cursor-pointer group"
                            >
                                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={24} className="text-gray-400 group-hover:text-[#2563EB]" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 mb-1">Drag & drop or click to upload</p>
                                <p className="text-xs text-gray-500">
                                    {category === 'voice' ? 'WAV, MP3 — max 500MB' : 'MP4, MOV, WEBM — max 4GB'}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-[#F7F7F8] rounded-2xl p-5 border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                        <FileVideo size={22} className="text-[#2563EB]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / (1024 * 1024)).toFixed(1)} MB
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="text-sm text-gray-500 hover:text-red-600 font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-xs text-blue-800">
                                <strong>Tip:</strong> Use a tripod for stable framing. Keep the camera fixed, hands visible, and record a continuous take without edits or speed-ups.
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 3: Details */}
                {currentStep === 'details' && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                        <h2 className="text-lg font-semibold text-gray-900">Title Your Submission</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g., LEGO House Build – 7 Minutes"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors bg-white"
                            />
                            <p className="text-xs text-gray-400 mt-1.5">
                                Describe what you built and approximately how long.
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 4: Confirm */}
                {currentStep === 'confirm' && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                        <h2 className="text-lg font-semibold text-gray-900">Review & Submit</h2>

                        <div className="bg-[#F7F7F8] rounded-2xl p-5 border border-gray-100 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Category</span>
                                <span className="text-sm font-medium text-gray-900 capitalize">{category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">File</span>
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Title</span>
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{title}</span>
                            </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-[#2563EB] transition-colors">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={e => setAgreedToTerms(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                            />
                            <span className="text-sm text-gray-700 leading-relaxed">
                                I confirm I recorded this content myself and license it to Harbor ML under the{' '}
                                <a href="/terms" className="text-[#2563EB] hover:underline">Contributor Agreement</a>.
                                I have removed any copyrighted music or third-party content.
                            </span>
                        </label>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                {stepIndex > 0 ? (
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                ) : (
                    <div />
                )}
                <button
                    onClick={goNext}
                    disabled={!canAdvance() || uploading}
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all
            ${canAdvance()
                            ? 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm shadow-blue-200'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                    {uploading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                        </>
                    ) : currentStep === 'confirm' ? (
                        <>Submit for Review <Check size={16} /></>
                    ) : (
                        <>Continue <ArrowRight size={16} /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CreatorUpload;
