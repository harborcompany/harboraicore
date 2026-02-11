import React, { useState, useEffect } from 'react';
import { Play, Pause, Check, X, AlertTriangle, Eye, ChevronRight } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/admin/AdminComponents';
import { AssetQACard } from '../../components/qa'; // Assuming this exists or mocked
import { useParams } from 'react-router-dom';
import { AdminAPI } from '../../services/admin';
import { Submission } from '../../types';

export const AdminSubmissionReview: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [playing, setPlaying] = useState(false);

    // Review State
    const [verdict, setVerdict] = useState<'APPROVED' | 'PARTIAL' | 'REJECTED' | null>(null);
    const [reason, setReason] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Hardcoded Reasons
    const REJECTION_REASONS = [
        'Poor visibility / Lighting',
        'Insufficient motion / Static',
        'Excessive occlusion',
        'Non-compliant recording angle',
        'Low annotation confidence',
        'Other (See notes)'
    ];

    const PARTIAL_REASONS = [
        'Minor occlusion',
        'Short duration',
        'Background noise',
        'Usable but non-core'
    ];

    useEffect(() => {
        if (id) {
            AdminAPI.getSubmission(id).then(setSubmission);
        }
    }, [id]);

    const handleSubmit = async () => {
        if (!verdict || !reason || !id) return;

        setSubmitting(true);
        try {
            await AdminAPI.submitReview(id, verdict, reason, notes);
            setCompleted(true);
        } catch (e) {
            console.error(e);
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (!submission) return <div className="p-6 text-white">Loading...</div>;

    return (
        <div className="max-w-[1600px] mx-auto p-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col text-white">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-semibold flex items-center gap-2">
                        Review Submission <span className="text-gray-500 font-mono text-base">{submission.id}</span>
                        {completed && <span className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">REVIEWED</span>}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Contributor: {submission.contributor?.email} • {submission.uploadStatus} • {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Status Indicator if completed */}
                {completed ? (
                    <div className="bg-[#141414] border border-[#262626] px-4 py-2 rounded flex items-center gap-2">
                        {verdict === 'APPROVED' && <Check className="text-green-500" size={16} />}
                        {verdict === 'REJECTED' && <X className="text-red-500" size={16} />}
                        {verdict === 'PARTIAL' && <AlertTriangle className="text-yellow-500" size={16} />}
                        <span>{verdict}</span>
                        <span className="text-gray-500 text-sm">({reason})</span>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setVerdict(null)}
                            disabled={!verdict}
                            className="text-gray-400 hover:text-white px-3 py-2"
                        >
                            Reset
                        </button>
                    </div>
                )}
            </header>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left: Video Player */}
                <div className="col-span-8 bg-black rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-800">
                    {/* Placeholder for video player */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPlaying(!playing)}
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors pointer-events-auto"
                            >
                                {playing ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                            </button>
                            <span className="text-sm font-medium text-white">00:00 / 14:20</span>
                        </div>
                    </div>
                    <p className="text-gray-500">Video Player Component</p>
                </div>

                {/* Right: Review Controls */}
                <div className="col-span-4 flex flex-col gap-6 min-h-0">

                    {/* Decision Panel */}
                    {!completed ? (
                        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 flex flex-col gap-4">
                            <h3 className="font-semibold text-lg">Quality Gate</h3>

                            {/* Verdict Selection */}
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => { setVerdict('APPROVED'); setReason('High Quality'); }}
                                    className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${verdict === 'APPROVED'
                                            ? 'bg-green-500/20 border-green-500 text-green-500'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <Check size={20} />
                                    <span className="text-sm font-medium">Approve</span>
                                </button>
                                <button
                                    onClick={() => { setVerdict('PARTIAL'); setReason(''); }}
                                    className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${verdict === 'PARTIAL'
                                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <AlertTriangle size={20} />
                                    <span className="text-sm font-medium">Partial</span>
                                </button>
                                <button
                                    onClick={() => { setVerdict('REJECTED'); setReason(''); }}
                                    className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${verdict === 'REJECTED'
                                            ? 'bg-red-500/20 border-red-500 text-red-500'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <X size={20} />
                                    <span className="text-sm font-medium">Reject</span>
                                </button>
                            </div>

                            {/* Conditional Reason Dropdown */}
                            {verdict && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-sm text-gray-400">Reason (Mandatory)</label>
                                    <select
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full bg-black border border-[#333] rounded p-2 text-white"
                                    >
                                        <option value="">Select a reason...</option>
                                        {verdict === 'APPROVED' && <option value="High Quality">High Quality (Standard)</option>}
                                        {verdict === 'REJECTED' && REJECTION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                        {verdict === 'PARTIAL' && PARTIAL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>

                                    <label className="text-sm text-gray-400">Notes (Optional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full bg-black border border-[#333] rounded p-2 text-white h-20 text-sm"
                                        placeholder="Add context for the contributor..."
                                    />

                                    <button
                                        disabled={!reason || submitting}
                                        onClick={handleSubmit}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Submitting...' : 'Confirm Decision'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 text-center text-gray-400">
                            Decision recorded. Immutable.
                        </div>
                    )}

                    {/* Confidence Score */}
                    {submission.contributor && (
                        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
                            <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Confidence Analysis</h3>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-2xl font-bold text-white">{(submission.contributor.reliabilityScore * 100).toFixed(0)}%</span>
                                <span className="text-xs text-green-500">High Reliability</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full" style={{ width: `${submission.contributor.reliabilityScore * 100}%` }}></div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
