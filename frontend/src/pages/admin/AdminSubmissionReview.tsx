import React, { useState, useEffect } from 'react';
import {
    getQAQueue,
    submitQAReview,
    computeFinalScore,
    classifyAutoScore,
    classifyFinalScore,
    formatDuration,
    formatDate,
    type Upload,
    type AutoCheck,
    type QAReview,
} from '../../services/adminPipelineService';

interface QueueItem {
    upload: Upload;
    autoChecks: AutoCheck[];
    existingReview: QAReview | null;
}

export function AdminSubmissionReview() {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [humanScore, setHumanScore] = useState(80);
    const [action, setAction] = useState<'approve' | 'reject' | 'request_edit'>('approve');
    const [notes, setNotes] = useState('');
    const [includeInDataset, setIncludeInDataset] = useState(true);
    const [checklist, setChecklist] = useState({
        handsVisible: false,
        stepsLabeled: false,
        noObstructions: false,
        audioClean: false,
        consentVerified: false,
    });

    useEffect(() => {
        setQueue(getQAQueue());
    }, []);

    const item = queue[activeIndex] || null;
    const autoScore = item?.upload.autoScore ?? 0;
    const finalScore = computeFinalScore(autoScore, humanScore);
    const finalCls = classifyFinalScore(finalScore);

    function handleSubmit() {
        if (!item) return;
        submitQAReview({
            uploadId: item.upload.id,
            reviewerId: 'rev_current',
            reviewerName: 'Current Reviewer',
            autoScore,
            humanScore,
            finalScore,
            action,
            reason: action !== 'approve' ? notes : '',
            notes,
            payoutEstimateCents: action === 'approve' ? Math.round(item.upload.duration / 60 * 100) : 0,
            includeInDataset: action === 'approve' && includeInDataset,
            qaChecklist: checklist,
        });
        // Move to next
        const newQueue = getQAQueue();
        setQueue(newQueue);
        setActiveIndex(Math.min(activeIndex, newQueue.length - 1));
        setHumanScore(80);
        setAction('approve');
        setNotes('');
        setIncludeInDataset(true);
        setChecklist({ handsVisible: false, stepsLabeled: false, noObstructions: false, audioClean: false, consentVerified: false });
    }

    return (
        <div className="p-6 text-white max-w-[1400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">QA Review Queue</h1>
                    <p className="text-[#737373] mt-1">{queue.length} items · Prioritized by score (flagged first)</p>
                </div>
                <div className="text-sm text-[#a3a3a3]">
                    Reviewing: {activeIndex + 1} / {queue.length}
                </div>
            </div>

            {!item ? (
                <div className="bg-[#141414] border border-[#262626] rounded-xl p-12 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h2 className="text-xl font-bold mb-2">Queue Clear</h2>
                    <p className="text-[#737373]">All items have been reviewed. Check back after new uploads arrive.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column: queue list */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#141414] border border-[#262626] rounded-xl">
                            <div className="p-4 border-b border-[#262626]">
                                <h3 className="font-semibold text-sm">Review Queue</h3>
                            </div>
                            <div className="divide-y divide-[#1a1a1a] max-h-[600px] overflow-y-auto">
                                {queue.map((q, i) => {
                                    const cls = q.upload.autoScore ? classifyAutoScore(q.upload.autoScore) : null;
                                    return (
                                        <button
                                            key={q.upload.id}
                                            onClick={() => setActiveIndex(i)}
                                            className={`w-full text-left px-4 py-3 hover:bg-[#1a1a1a] transition-colors ${i === activeIndex ? 'bg-blue-500/5 border-l-2 border-blue-500' : ''
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium truncate">{q.upload.filename}</div>
                                                    <div className="text-xs text-[#525252]">{q.upload.uploaderName} · {formatDuration(q.upload.duration)}</div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                                    {q.existingReview && (
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${q.existingReview.action === 'approve' ? 'bg-green-500/10 text-green-400' :
                                                            q.existingReview.action === 'request_edit' ? 'bg-amber-500/10 text-amber-400' :
                                                                'bg-red-500/10 text-red-400'
                                                            }`}>
                                                            Done
                                                        </span>
                                                    )}
                                                    {cls && (
                                                        <span className="text-sm font-mono font-bold" style={{ color: cls.color }}>{q.upload.autoScore}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right column: review panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video preview */}
                        <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
                            <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center">
                                <div className="text-center text-[#525252]">
                                    <svg className="mx-auto mb-2" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    <p>{item.upload.filename}</p>
                                    <p className="text-xs mt-1">{item.upload.resolution} · {formatDuration(item.upload.duration)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Auto-check summary */}
                        {item.upload.autoCheckJson && (
                            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Auto-Check Summary</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[#737373]">Auto Score:</span>
                                        <span className="text-lg font-mono font-bold" style={{ color: classifyAutoScore(autoScore).color }}>{autoScore}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-3">
                                    {([
                                        ['Framing', item.upload.autoCheckJson.framing],
                                        ['Objects', item.upload.autoCheckJson.objectCoverage],
                                        ['Continuity', item.upload.autoCheckJson.continuity],
                                        ['Tech', item.upload.autoCheckJson.technicalQuality],
                                        ['Annotations', item.upload.autoCheckJson.annotationCoverage],
                                    ] as [string, number][]).map(([label, score]) => (
                                        <div key={label} className="text-center">
                                            <div className="text-sm font-mono font-bold mb-1" style={{ color: score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444' }}>{score}</div>
                                            <div className="w-full h-1 bg-[#262626] rounded-full mb-1">
                                                <div className="h-full rounded-full" style={{ width: `${score}%`, background: score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444' }} />
                                            </div>
                                            <div className="text-xs text-[#525252]">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Existing review (if any) */}
                        {item.existingReview && (
                            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                                <h3 className="font-semibold text-green-400 mb-2">Previously Reviewed</h3>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-[#737373]">Reviewer:</span> {item.existingReview.reviewerName}
                                    </div>
                                    <div>
                                        <span className="text-[#737373]">Action:</span>{' '}
                                        <span className={item.existingReview.action === 'approve' ? 'text-green-400' : 'text-red-400'}>
                                            {item.existingReview.action}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[#737373]">Final:</span>{' '}
                                        <span className="font-mono font-bold">{item.existingReview.finalScore}</span>
                                    </div>
                                </div>
                                {item.existingReview.notes && (
                                    <p className="text-sm text-[#a3a3a3] mt-2 italic">"{item.existingReview.notes}"</p>
                                )}
                            </div>
                        )}

                        {/* QA Scoring Panel */}
                        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
                            <h3 className="font-semibold mb-4">Your Review</h3>

                            {/* Checklist */}
                            <div className="mb-5">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-3">QA Checklist</h4>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {Object.entries(checklist).map(([key, val]) => (
                                        <label
                                            key={key}
                                            className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${val ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-[#0a0a0a] border-[#262626] text-[#737373]'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={val}
                                                onChange={() => setChecklist({ ...checklist, [key]: !val })}
                                                className="accent-green-500"
                                            />
                                            <span className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Human score slider */}
                            <div className="mb-5">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium">Human Quality Score (0–100) — How would you rate this asset overall?</label>
                                    <span className="text-xl font-mono font-bold" style={{ color: humanScore >= 85 ? '#22c55e' : humanScore >= 70 ? '#f59e0b' : '#ef4444' }}>
                                        {humanScore}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={humanScore}
                                    onChange={e => setHumanScore(parseInt(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                            </div>

                            {/* Final score display */}
                            <div className="bg-[#0a0a0a] border rounded-xl p-4 mb-5" style={{ borderColor: `${finalCls.color}30` }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-[#737373] mb-1">Final Dataset Score (auto+human weighted)</div>
                                        <div className="text-xs text-[#525252]">{(0.4 * autoScore).toFixed(1)} + {(0.6 * humanScore).toFixed(1)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono font-bold" style={{ color: finalCls.color }}>{finalScore}</div>
                                        <div className="text-xs" style={{ color: finalCls.color }}>{finalCls.label}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action selection */}
                            <div className="flex gap-3 mb-5">
                                {([
                                    { val: 'approve' as const, label: 'Approve', color: '#22c55e', icon: '✓' },
                                    { val: 'request_edit' as const, label: 'Request edit (send back to annotator)', color: '#f59e0b', icon: '✎' },
                                    { val: 'reject' as const, label: 'Reject (remove from build)', color: '#ef4444', icon: '✕' },
                                ]).map(opt => (
                                    <button
                                        key={opt.val}
                                        onClick={() => setAction(opt.val)}
                                        className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${action === opt.val
                                            ? `border-${opt.val === 'approve' ? 'green' : opt.val === 'reject' ? 'red' : 'amber'}-500/40`
                                            : 'border-[#262626] text-[#737373] hover:text-white hover:border-[#404040]'
                                            }`}
                                        style={action === opt.val ? { background: `${opt.color}15`, borderColor: `${opt.color}40`, color: opt.color } : {}}
                                    >
                                        {opt.icon} {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Dataset inclusion */}
                            {action === 'approve' && (
                                <label className="flex items-center gap-2 mb-4">
                                    <input type="checkbox" checked={includeInDataset} onChange={() => setIncludeInDataset(!includeInDataset)} className="accent-blue-500" />
                                    <span className="text-sm">Include in dataset</span>
                                    {includeInDataset && (
                                        <span className="text-xs text-[#525252]">· Est. payout: ${(item.upload.duration / 60 * 1).toFixed(2)}</span>
                                    )}
                                </label>
                            )}

                            {/* Notes */}
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Short reviewer notes — what to fix / why rejected (use templates where possible)"
                                className="w-full p-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-sm text-white resize-none h-20 focus:border-blue-500 focus:outline-none transition-colors"
                            />

                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                                    style={{
                                        background: action === 'approve' ? '#22c55e' : action === 'reject' ? '#ef4444' : '#f59e0b',
                                        color: '#fff',
                                    }}
                                >
                                    Submit Review →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSubmissionReview;
