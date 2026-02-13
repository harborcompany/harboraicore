import React from 'react';
import { CheckCircle, XCircle, Download, BookOpen, AlertTriangle } from 'lucide-react';

const CreatorGuidelines: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Guidelines</h1>
                <p className="text-gray-500 mt-1">Everything you need to know to get your submissions approved.</p>
            </div>

            {/* LEGO Requirements */}
            <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">🧱</span>
                    <h2 className="text-lg font-semibold text-gray-900">LEGO Submission Requirements</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        '5–10 minutes recording',
                        'No audio or music',
                        'Hands only — no face',
                        'Build from scratch',
                        'Clean, uncluttered background',
                        'Good, even lighting',
                        'Tripod or fixed camera',
                        'Continuous take — no edits',
                    ].map((req, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{req}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Audio Requirements */}
            <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">🎙</span>
                    <h2 className="text-lg font-semibold text-gray-900">Audio Submission Requirements</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        'Clear, natural speech',
                        'No background noise',
                        'Quiet indoor environment',
                        '1–5 minutes per recording',
                        'Consistent volume',
                        'No music or effects',
                    ].map((req, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{req}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Common Rejections */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-5">
                    <AlertTriangle size={20} className="text-red-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Common Rejection Reasons</h2>
                </div>
                <div className="space-y-3">
                    {[
                        { reason: 'Music in background', fix: 'Record in silence — no music, TV, or radio' },
                        { reason: 'Time-lapse or sped up', fix: 'Real-time recording only, no speed adjustments' },
                        { reason: 'Camera cuts or edits', fix: 'Record one continuous take, no editing' },
                        { reason: 'Face visible in frame', fix: 'Only hands and build surface should be visible' },
                        { reason: 'Not built from scratch', fix: 'Start from separated pieces, not a pre-assembled set' },
                        { reason: 'Poor lighting or blurry', fix: 'Use good room lighting; stabilize with tripod' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-red-100">
                            <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{item.reason}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.fix}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: 'How long until my submission is reviewed?', a: 'Most submissions are reviewed within 24–48 hours.' },
                        { q: 'When do I get paid?', a: 'First payout occurs within 90 days of your first approved submission. After that, payouts are processed monthly.' },
                        { q: 'Can I resubmit a rejected video?', a: 'Yes. Fix the issues noted in the review and resubmit as a new upload.' },
                        { q: 'What happens to my video?', a: 'Your video is used for AI training data. Harbor will not publish raw videos publicly without additional consent.' },
                        { q: 'Do I keep the rights to my recording?', a: 'You retain non-exclusive authorship but grant Harbor a perpetual license for dataset creation and training.' },
                    ].map((faq, i) => (
                        <div key={i} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                            <p className="text-sm font-semibold text-gray-900 mb-1">{faq.q}</p>
                            <p className="text-sm text-gray-600">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Download Guide */}
            <div className="text-center">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#2563EB] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
                    <Download size={16} />
                    Download LEGO Creator Guide (PDF)
                </button>
            </div>
        </div>
    );
};

export default CreatorGuidelines;
