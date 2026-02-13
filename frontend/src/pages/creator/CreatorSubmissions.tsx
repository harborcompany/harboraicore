import React, { useState, useEffect } from 'react';
import { FileVideo, ChevronDown, X, Play, MessageSquare, AlertCircle, RotateCcw, Shield, Activity, Mic, Brain, Fingerprint, BarChart3, Eye, ChevronRight } from 'lucide-react';
import { creatorService, CreatorSubmission, SubmissionStatus } from '../../services/creatorSubmissionService';
import { qaService, QAPipelineResult } from '../../services/qaService';

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; bg: string }> = {
    submitted: { label: 'Submitted', color: 'text-blue-700', bg: 'bg-blue-100' },
    under_review: { label: 'Under Review', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    approved: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-100' },
    rejected: { label: 'Rejected', color: 'text-gray-600', bg: 'bg-gray-200' },
    revision_requested: { label: 'Needs Revision', color: 'text-red-700', bg: 'bg-red-100' },
};

const QA_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    NEEDS_HUMAN_REVIEW: { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-50', icon: '⏳' },
    FAIL_AUTOMATED: { label: 'Auto Fail', color: 'text-red-700', bg: 'bg-red-50', icon: '✗' },
};

function getScoreColor(score: number): string {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
}

function getScoreBg(score: number): string {
    if (score >= 85) return 'bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
}

function getBarColor(score: number): string {
    if (score >= 85) return '#10B981';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
}

const CreatorSubmissions: React.FC = () => {
    const [submissions, setSubmissions] = useState<CreatorSubmission[]>([]);
    const [qaResults, setQaResults] = useState<Record<string, QAPipelineResult>>({});
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<CreatorSubmission | null>(null);
    const [filter, setFilter] = useState<SubmissionStatus | 'all'>('all');
    const [qaExpanded, setQaExpanded] = useState(false);
    const [activeQAStep, setActiveQAStep] = useState<number>(0);

    useEffect(() => {
        Promise.all([
            creatorService.getSubmissions(),
            qaService.getAllQAResults(),
        ]).then(([subs, qa]) => {
            setSubmissions(subs);
            setQaResults(qa);
            setLoading(false);
        });
    }, []);

    const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);

    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatCents = (cents: number) => `$${(cents / 100).toFixed(0)}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
            </div>
        );
    }

    const selectedQA = selected ? qaResults[selected.id] : null;

    const qaSteps = selectedQA ? [
        {
            label: 'Preprocessing',
            icon: <Activity size={14} />,
            summary: `${selectedQA.steps.preprocessing.convertedFormat.toUpperCase()} · ${selectedQA.steps.preprocessing.sampleRate / 1000}kHz · ${selectedQA.steps.preprocessing.channels}`,
            detail: (
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Format</span><span className="font-mono">{selectedQA.steps.preprocessing.originalFormat} → WAV</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Sample Rate</span><span className="font-mono">44.1 kHz</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Channels</span><span className="font-mono">Mono</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Amplitude Normalized</span><span className="font-mono text-emerald-600">Yes</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">File Size</span><span className="font-mono">{(selectedQA.steps.preprocessing.fileSizeBytes / 1048576).toFixed(1)} MB</span></div>
                </div>
            ),
        },
        {
            label: 'Quality Metrics',
            icon: <BarChart3 size={14} />,
            summary: `SNR ${selectedQA.steps.qualityMetrics.speech_to_noise_ratio.toFixed(1)}dB · Vol ${selectedQA.steps.qualityMetrics.average_volume_db.toFixed(1)}dB`,
            detail: (
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-mono">{Math.floor(selectedQA.steps.qualityMetrics.duration_seconds / 60)}m {selectedQA.steps.qualityMetrics.duration_seconds % 60}s</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Avg Volume</span><span className="font-mono">{selectedQA.steps.qualityMetrics.average_volume_db.toFixed(1)} dB</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Clipping Ratio</span><span className={`font-mono ${selectedQA.steps.qualityMetrics.clipping_ratio > 0.005 ? 'text-red-600' : 'text-emerald-600'}`}>{(selectedQA.steps.qualityMetrics.clipping_ratio * 100).toFixed(2)}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Silence Ratio</span><span className="font-mono">{(selectedQA.steps.qualityMetrics.silence_ratio * 100).toFixed(0)}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Background Noise</span><span className="font-mono">{(selectedQA.steps.qualityMetrics.background_noise_score * 100).toFixed(0)}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Speech-to-Noise</span><span className="font-mono">{selectedQA.steps.qualityMetrics.speech_to_noise_ratio.toFixed(1)} dB</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Language</span><span className="font-mono uppercase">{selectedQA.steps.qualityMetrics.language_detected}</span></div>
                    {selectedQA.steps.qualityMetrics.speech_rate_wpm > 0 && (
                        <div className="flex justify-between"><span className="text-gray-500">Speech Rate</span><span className="font-mono">{selectedQA.steps.qualityMetrics.speech_rate_wpm} wpm</span></div>
                    )}
                </div>
            ),
        },
        {
            label: 'Transcription',
            icon: <Mic size={14} />,
            summary: `${selectedQA.steps.transcription.segments.length} segments · WER ${(selectedQA.steps.transcription.wer_estimate * 100).toFixed(1)}%`,
            detail: (
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Model: {selectedQA.steps.transcription.model}</span>
                        <span>WER: {(selectedQA.steps.transcription.wer_estimate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1.5">
                        {selectedQA.steps.transcription.segments.slice(0, 6).map((seg, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-gray-400 font-mono text-xs flex-shrink-0 w-16">{seg.start.toFixed(1)}s</span>
                                <span className="text-gray-700 text-xs leading-relaxed flex-1">{seg.text}</span>
                                <span className={`text-xs font-mono flex-shrink-0 ${seg.confidence >= 0.9 ? 'text-emerald-600' : 'text-amber-600'}`}>{(seg.confidence * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                        {selectedQA.steps.transcription.segments.length > 6 && (
                            <p className="text-xs text-gray-400 italic">+{selectedQA.steps.transcription.segments.length - 6} more segments</p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            label: 'Emotion Classification',
            icon: <Brain size={14} />,
            summary: `Dominant: ${selectedQA.steps.emotion.dominantEmotion} · Avg Conf ${(selectedQA.steps.emotion.averageConfidence * 100).toFixed(0)}%`,
            detail: (
                <div className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {Object.entries(selectedQA.steps.emotion.emotionDistribution).map(([emotion, ratio]) => (
                            <span key={emotion} className="text-xs bg-gray-100 rounded-full px-2 py-0.5 capitalize">
                                {emotion} {(Number(ratio) * 100).toFixed(0)}%
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">Dominant Emotion</span><span className="capitalize">{selectedQA.steps.emotion.dominantEmotion}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Avg Confidence</span><span className={`font-mono ${selectedQA.steps.emotion.averageConfidence >= 0.7 ? 'text-emerald-600' : 'text-amber-600'}`}>{(selectedQA.steps.emotion.averageConfidence * 100).toFixed(0)}%</span></div>
                </div>
            ),
        },
        {
            label: 'Speaker Fingerprint',
            icon: <Fingerprint size={14} />,
            summary: `${selectedQA.steps.speakerFingerprint.speakerCount} speaker · Fraud risk: ${selectedQA.steps.speakerFingerprint.identityFraudRisk}`,
            detail: (
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Speaker Count</span><span className="font-mono">{selectedQA.steps.speakerFingerprint.speakerCount}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Duplicate Voice</span><span className={`font-mono ${selectedQA.steps.speakerFingerprint.duplicateVoiceDetected ? 'text-red-600' : 'text-emerald-600'}`}>{selectedQA.steps.speakerFingerprint.duplicateVoiceDetected ? 'Yes ⚠' : 'None'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Fraud Risk</span><span className={`font-mono capitalize ${selectedQA.steps.speakerFingerprint.identityFraudRisk === 'none' ? 'text-emerald-600' : 'text-red-600'}`}>{selectedQA.steps.speakerFingerprint.identityFraudRisk}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Embedding ID</span><span className="font-mono text-xs text-gray-400">{selectedQA.steps.speakerFingerprint.embeddingHash.slice(0, 12)}…</span></div>
                </div>
            ),
        },
        {
            label: 'Auto Score',
            icon: <Shield size={14} />,
            summary: `Score: ${selectedQA.steps.autoScore.auto_score} · ${QA_STATUS_CONFIG[selectedQA.steps.autoScore.status]?.label || selectedQA.steps.autoScore.status}`,
            detail: (
                <div className="space-y-3 text-sm">
                    {/* Score Breakdown Bars */}
                    {Object.entries(selectedQA.steps.autoScore.breakdown).map(([key, val]) => (
                        <div key={key}>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-500 capitalize text-xs">{key.replace(/_/g, ' ')}</span>
                                <span className="text-xs font-mono">{val.score.toFixed(0)} <span className="text-gray-400">({(val.weight * 100).toFixed(0)}%)</span></span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${val.score}%`,
                                        backgroundColor: getBarColor(val.score),
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    {/* Final score */}
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Weighted Score</span>
                        <span className={`text-lg font-bold ${getScoreColor(selectedQA.steps.autoScore.auto_score)}`}>{selectedQA.steps.autoScore.auto_score}</span>
                    </div>
                </div>
            ),
        },
    ] : [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
                    <p className="text-gray-500 mt-1">Track the status of everything you've uploaded.</p>
                </div>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value as any)}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#2563EB]"
                >
                    <option value="all">All Status</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="revision_requested">Needs Revision</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#F7F7F8] border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Title</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">QA Score</div>
                    <div className="col-span-2">Est. Payment</div>
                    <div className="col-span-1">Date</div>
                </div>

                {filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <FileVideo size={32} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No submissions found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map(sub => {
                            const status = STATUS_CONFIG[sub.status];
                            const qa = qaResults[sub.id];
                            const qaStatus = qa ? QA_STATUS_CONFIG[qa.steps.autoScore.status] : null;
                            return (
                                <button
                                    key={sub.id}
                                    onClick={() => { setSelected(sub); setQaExpanded(false); setActiveQAStep(0); }}
                                    className="w-full grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-[#F7F7F8] transition-colors text-left items-center"
                                >
                                    <div className="col-span-3 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FileVideo size={18} className="text-gray-500" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 truncate">{sub.title}</span>
                                    </div>
                                    <div className="col-span-2 text-sm text-gray-600 capitalize">{sub.category}</div>
                                    <div className="col-span-2">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color} ${status.bg}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        {qa ? (
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${getScoreColor(qa.steps.autoScore.auto_score)}`}>
                                                    {qa.steps.autoScore.auto_score}
                                                </span>
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${qaStatus?.color} ${qaStatus?.bg}`}>
                                                    {qaStatus?.icon} {qaStatus?.label}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Pending</span>
                                        )}
                                    </div>
                                    <div className="col-span-2 text-sm font-semibold text-gray-900">
                                        {sub.finalPayment ? formatCents(sub.finalPayment) : `~${formatCents(sub.estimatedPayment)}`}
                                    </div>
                                    <div className="col-span-1 text-sm text-gray-500">{formatDate(sub.createdAt)}</div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-auto animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{selected.title}</h2>
                                    <p className="text-sm text-gray-500 capitalize">{selected.category} • {selected.duration}</p>
                                </div>
                                <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Status + QA Score Side-by-Side */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_CONFIG[selected.status].color} ${STATUS_CONFIG[selected.status].bg}`}>
                                    {STATUS_CONFIG[selected.status].label}
                                </span>
                                {selectedQA && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getScoreBg(selectedQA.steps.autoScore.auto_score)}`}>
                                            <Shield size={12} />
                                            <span className={`text-xs font-bold ${getScoreColor(selectedQA.steps.autoScore.auto_score)}`}>
                                                QA: {selectedQA.steps.autoScore.auto_score}
                                            </span>
                                            <span className={`text-[10px] ${QA_STATUS_CONFIG[selectedQA.steps.autoScore.status]?.color}`}>
                                                {QA_STATUS_CONFIG[selectedQA.steps.autoScore.status]?.label}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Details */}
                            <div className="bg-[#F7F7F8] rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Submitted</span>
                                    <span className="text-sm text-gray-900">{new Date(selected.createdAt).toLocaleDateString()}</span>
                                </div>
                                {selected.reviewedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Reviewed</span>
                                        <span className="text-sm text-gray-900">{new Date(selected.reviewedAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {selected.qualityScore !== null && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Manual Quality Score</span>
                                        <span className={`text-sm font-semibold ${selected.qualityScore >= 80 ? 'text-green-600' : selected.qualityScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {selected.qualityScore}/100
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Payment</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {selected.finalPayment ? formatCents(selected.finalPayment) : `~${formatCents(selected.estimatedPayment)}`}
                                    </span>
                                </div>
                                {selectedQA && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Pipeline Version</span>
                                        <span className="text-sm font-mono text-gray-600">Opus {selectedQA.pipelineVersion}</span>
                                    </div>
                                )}
                            </div>

                            {/* Human Review Reasons */}
                            {selectedQA && selectedQA.humanReviewRequired && selectedQA.humanReviewReasons.length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Eye size={14} className="text-amber-600" />
                                        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Human Review Triggered</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {selectedQA.humanReviewReasons.map((reason, i) => (
                                            <li key={i} className="text-xs text-amber-700 flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* QA Pipeline Details (Expandable) */}
                            {selectedQA && (
                                <div className="mb-6">
                                    <button
                                        onClick={() => setQaExpanded(!qaExpanded)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Shield size={16} className="text-[#2563EB]" />
                                            <span className="text-sm font-semibold text-gray-900">QA Pipeline Details</span>
                                            <span className="text-xs text-gray-500">6 steps • {selectedQA.processingTimeMs}ms</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${qaExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                    {qaExpanded && (
                                        <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden">
                                            {qaSteps.map((step, i) => (
                                                <div key={i} className="border-b border-gray-50 last:border-b-0">
                                                    <button
                                                        onClick={() => setActiveQAStep(activeQAStep === i ? -1 : i)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0 text-[#2563EB]">
                                                            {step.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-900">Step {i + 1}: {step.label}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 truncate">{step.summary}</p>
                                                        </div>
                                                        <ChevronRight size={14} className={`text-gray-400 transition-transform ${activeQAStep === i ? 'rotate-90' : ''}`} />
                                                    </button>
                                                    {activeQAStep === i && (
                                                        <div className="px-4 pb-4 pt-1 bg-gray-50/50">
                                                            {step.detail}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Review Notes */}
                            {selected.reviewNotes && (
                                <div className={`rounded-xl p-4 mb-6 border ${selected.status === 'approved' ? 'bg-green-50 border-green-100' :
                                    selected.status === 'revision_requested' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare size={14} className="text-gray-500" />
                                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Reviewer Notes</span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{selected.reviewNotes}</p>
                                </div>
                            )}

                            {/* Actions */}
                            {selected.status === 'revision_requested' && (
                                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-[#2563EB] hover:bg-blue-700 transition-colors">
                                    <RotateCcw size={14} />
                                    Resubmit After Corrections
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatorSubmissions;
