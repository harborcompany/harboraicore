import React, { useState } from 'react';
import { Upload, CheckCircle, Clock, AlertCircle, FileVideo, DollarSign, Calendar } from 'lucide-react';

const ContributorDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('tasks');
    const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');

    // Mock Data for "Status Tracker"
    const submissions = [
        { id: 1, type: 'LEGO Assembly', date: 'Oct 24, 2025', status: 'reviewed', verdict: 'approved', earnings: 15.00 },
        { id: 2, type: 'LEGO Assembly', date: 'Oct 23, 2025', status: 'processing', verdict: 'pending', earnings: 0 },
        { id: 3, type: 'Audio Script', date: 'Oct 20, 2025', status: 'reviewed', verdict: 'rejected', earnings: 0 },
    ];

    const handleUpload = () => {
        setUploadState('uploading');
        setTimeout(() => setUploadState('processing'), 2000);
        setTimeout(() => setUploadState('complete'), 4500);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <header className="mb-8">
                <h1 className="text-2xl font-medium text-[#111]">Contributor Dashboard</h1>
                <p className="text-gray-500">Manage your tasks and track earnings.</p>
            </header>

            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <DollarSign size={18} />
                        <span className="text-sm font-medium uppercase tracking-wide">Total Earnings</span>
                    </div>
                    <div className="text-3xl font-semibold text-[#111]">$450.00</div>
                    <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle size={14} /> Paid to date
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <Clock size={18} />
                        <span className="text-sm font-medium uppercase tracking-wide">Pending Payout</span>
                    </div>
                    <div className="text-3xl font-semibold text-[#111]">$15.00</div>
                    <div className="text-sm text-gray-400 mt-1">
                        Next payout: Nov 1, 2025
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <Calendar size={18} />
                        <span className="text-sm font-medium uppercase tracking-wide">Active Task</span>
                    </div>
                    <div className="text-xl font-medium text-[#111] mb-1">LEGO Assembly Dataset</div>
                    <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        Open for Submissions
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Active Task & Upload */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Active Task Section */}
                    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-medium text-[#111] mb-1">Active Task: LEGO Assembly Dataset</h2>
                            <p className="text-sm text-gray-500">
                                Record yourself building LEGO models. Hands and models only. No faces. No cuts.
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-8">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileVideo size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-[#111] mb-2">Requirements</h4>
                                    <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                                        <li>Minimum total recording time: 30 minutes</li>
                                        <li>Multiple videos allowed</li>
                                        <li>Clear, continuous, real-time recording</li>
                                        <li>Authenticity and originality verified by review</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Upload Interface */}
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50/30">
                                {uploadState === 'idle' && (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-blue-600">
                                            <Upload size={24} />
                                        </div>
                                        <h3 className="text-lg font-medium text-[#111] mb-2">Upload Recording</h3>
                                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                                            Videos must be clear, continuous, and recorded in real time.
                                            Submissions are reviewed for authenticity.
                                        </p>
                                        <button
                                            onClick={handleUpload}
                                            className="px-6 py-2.5 bg-[#111] text-white rounded-lg font-medium hover:bg-black transition-colors"
                                        >
                                            Select File
                                        </button>
                                    </>
                                )}

                                {uploadState === 'uploading' && (
                                    <div className="py-8">
                                        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-600 font-medium">Uploading video...</p>
                                        <p className="text-sm text-gray-400 mt-1">45% complete</p>
                                    </div>
                                )}

                                {uploadState === 'processing' && (
                                    <div className="py-8">
                                        <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-600 font-medium">Processing & Auto-Annotating...</p>
                                        <p className="text-sm text-gray-400 mt-1">Identifying actions and objects</p>
                                    </div>
                                )}

                                {uploadState === 'complete' && (
                                    <div className="py-6 animate-in fade-in zoom-in duration-300">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle size={24} />
                                        </div>
                                        <h3 className="text-lg font-medium text-[#111] mb-2">Submission Received</h3>
                                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                                            Your submission is being processed. We'll notify you once review is complete.
                                        </p>
                                        <button
                                            onClick={() => setUploadState('idle')}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                                        >
                                            Upload another video
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Status Tracker */}
                <div className="lg:col-span-1">
                    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-medium text-[#111]">Submission Status</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {submissions.map((sub) => (
                                <div key={sub.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#111]">{sub.type}</span>
                                        <span className="text-xs text-gray-400">{sub.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {sub.status === 'processing' && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
                                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                                                    Processing
                                                </span>
                                            )}
                                            {sub.status === 'reviewed' && sub.verdict === 'approved' && (
                                                <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                                    Approved
                                                </span>
                                            )}
                                            {sub.status === 'reviewed' && sub.verdict === 'rejected' && (
                                                <span className="inline-flex items-center px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                                                    Rejected
                                                </span>
                                            )}
                                        </div>
                                        {sub.verdict === 'approved' && (
                                            <span className="text-sm font-medium text-green-600">+${sub.earnings.toFixed(2)}</span>
                                        )}
                                    </div>
                                    {/* Action/Tip based on status */}
                                    {sub.verdict === 'rejected' && (
                                        <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                            Issue: Low lighting. Please improve lighting and consistent framing.
                                        </p>
                                    )}
                                    {sub.verdict === 'approved' && (
                                        <p className="mt-2 text-xs text-gray-500">
                                            Payment issued within 90 days.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
                            <button className="text-sm font-medium text-gray-500 hover:text-[#111]">View All History</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ContributorDashboard;
