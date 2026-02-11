
import React, { useState, useEffect } from 'react';
import { Upload, DollarSign, Clock, CheckCircle, AlertCircle, FileVideo, Video } from 'lucide-react'; // Added Video icon
import { useAuth } from '../../lib/authStore';
import { useUpload } from '../../hooks/useUpload';
import { submissionService, Submission } from '../../services/submissionService';

const ContributorDashboard: React.FC = () => {
    const user = useAuth();
    const [recentUploads, setRecentUploads] = useState<Submission[]>([]);
    const [uploadCount, setUploadCount] = useState(0);
    const UPLOAD_LIMIT = 1; // Pilot restriction

    const fetchUploads = async () => {
        try {
            const data = await submissionService.getRecentActivity();
            setRecentUploads(data);
            // Calculate uploads. In a real scenario this might come from a user profile stats endpoint
            setUploadCount(data.length);
        } catch (e) {
            console.error("Failed to fetch uploads", e);
        }
    };

    useEffect(() => {
        fetchUploads();
    }, []);

    const { selectFile, progress, status, error, fileName, reset } = useUpload({
        acceptedTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
        maxSizeMB: 1024, // 1GB
        onSuccess: async (result: any) => {
            // Create a submission record with real backend data
            // result contains { url, path, metadata: { originalName } }
            const name = result?.metadata?.originalName || fileName || "video.mp4";

            await submissionService.createSubmission(name, result);
            await fetchUploads();
        }
    });

    const canUpload = uploadCount < UPLOAD_LIMIT;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark">Contributor Dashboard</h1>
                    <p className="text-gray-500">Manage your submissions and track earnings.</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex flex-col items-end">
                    <span className="text-xs text-blue-600 font-semibold uppercase">Pilot Quota</span>
                    <span className="text-brand-dark font-mono font-medium">
                        Videos: <span className={uploadCount >= UPLOAD_LIMIT ? "text-red-500" : "text-green-600"}>{uploadCount}</span> / {UPLOAD_LIMIT}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-brand-dark">
                            <DollarSign size={20} />
                        </div>
                        {recentUploads.some(u => u.payoutAmount) ? (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                Active
                            </span>
                        ) : (
                            <button className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition-colors z-10 relative">
                                Connect Payout
                            </button>
                        )}
                    </div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earnings</p>
                    <p className="text-2xl font-bold text-brand-dark mt-1">
                        ${recentUploads.reduce((acc, curr) => acc + (curr.payoutAmount || 0), 0).toFixed(2)}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-brand-dark">
                            <Clock size={20} />
                        </div>
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            In Review
                        </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Review</p>
                    <p className="text-2xl font-bold text-brand-dark mt-1">
                        {recentUploads.filter(u => u.status === 'pending').length}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-brand-dark">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            +12% this week
                        </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Videos</p>
                    <p className="text-2xl font-bold text-brand-dark mt-1">
                        {recentUploads.filter(u => u.status === 'approved').length}
                    </p>
                </div>
            </div>

            {/* Quick Upload */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-brand-dark">Quick Upload</h2>
                        <p className="text-sm text-gray-500">Upload raw footage for processing. Max 1GB.</p>
                    </div>
                    {!canUpload && (
                        <div className="bg-yellow-50 text-yellow-800 text-xs px-3 py-1 rounded-full border border-yellow-100 flex items-center gap-1">
                            <AlertCircle size={12} /> Limit Reached
                        </div>
                    )}
                </div>

                {!canUpload ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 opacity-75 cursor-not-allowed">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Upload Limit Reached</p>
                        <p className="text-xs text-gray-400">You have reached the pilot limit of {UPLOAD_LIMIT} upload(s).</p>
                    </div>
                ) : status === 'idle' || status === 'error' ? (
                    <div
                        onClick={selectFile}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload size={24} className="text-gray-400 group-hover:text-black transition-colors" />
                        </div>
                        <p className="text-sm font-medium text-brand-dark mb-1">Click to upload raw footage</p>
                        <p className="text-xs text-gray-400">MP4, MOV, or WEBM</p>
                        {status === 'error' && (
                            <p className="mt-4 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full">
                                <AlertCircle size={14} /> {error?.message}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                                <FileVideo size={20} className="text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-dark truncate">{fileName}</p>
                                <p className="text-xs text-gray-500">
                                    {status === 'processing' ? 'Processing and verifying...' : 'Uploading...'}
                                </p>
                            </div>
                            {status === 'success' ? (
                                <button onClick={reset} className="text-sm text-gray-500 hover:text-black">
                                    Upload Another
                                </button>
                            ) : (
                                <span className="text-xs font-mono text-gray-500">{Math.round(progress)}%</span>
                            )}
                        </div>

                        {status !== 'success' ? (
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-black h-full rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center gap-3 text-green-800">
                                <CheckCircle size={20} className="text-green-600" />
                                <div>
                                    <p className="text-sm font-medium">Upload Complete</p>
                                    <p className="text-xs text-green-700">Your video is now queued for review.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recent Uploads List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-brand-dark">Recent Uploads</h2>
                </div>

                {recentUploads.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {recentUploads.map((upload) => (
                            <div key={upload.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <FileVideo size={20} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-brand-dark">{upload.filename}</p>
                                        <p className="text-xs text-gray-500">{new Date(upload.submittedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-brand-dark">{upload.payoutAmount ? `$${upload.payoutAmount}` : '-'}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${upload.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        upload.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {upload.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-16 text-center text-gray-500">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                            <Upload size={24} className="text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-brand-dark mb-2">Ready to contribute?</p>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
                            Upload your first video clip above to start earning from your contributions.
                        </p>
                        <button
                            disabled={!canUpload}
                            onClick={selectFile}
                            className={`px-6 py-2.5 text-white text-sm font-medium rounded-lg transition-colors ${canUpload ? 'bg-brand-dark hover:bg-black' : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                            Upload Video Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContributorDashboard;
