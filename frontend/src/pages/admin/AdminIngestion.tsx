import React, { useState, useEffect } from 'react';
import {
    getUploads,
    getAutoChecks,
    recheckUpload,
    forceReject,
    createAnnotationJob,
    classifyAutoScore,
    formatBytes,
    formatDuration,
    formatDate,
    type Upload,
    type AutoCheck,
    type AutoCheckSummary,
} from '../../services/adminPipelineService';

export function AdminIngestion() {
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
    const [selectedChecks, setSelectedChecks] = useState<AutoCheck[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadUploads();
    }, [statusFilter]);

    function loadUploads() {
        const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
        setUploads(getUploads(filters));
    }

    function handleInspect(upload: Upload) {
        setSelectedUpload(upload);
        setSelectedChecks(getAutoChecks(upload.id));
    }

    function handleRecheck(id: string) {
        recheckUpload(id);
        loadUploads();
    }

    function handleForceReject(id: string) {
        const note = prompt('Rejection note:');
        if (note) {
            forceReject(id, note);
            loadUploads();
            setSelectedUpload(null);
        }
    }

    function handlePushToAnnotation() {
        if (selectedIds.size === 0) return;
        const ids = Array.from(selectedIds);
        createAnnotationJob(ids, 'lego_assembly');
        setSelectedIds(new Set());
        loadUploads();
    }

    function toggleSelect(id: string) {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelectedIds(next);
    }

    return (
        <div className="p-6 text-white max-w-[1400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Uploads & Ingest Queue</h1>
                    <p className="text-[#737373] mt-1">{uploads.length} assets in pipeline</p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handlePushToAnnotation}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Push {selectedIds.size} to Annotation →
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-5">
                {['all', 'pending', 'passed', 'flagged', 'failed'].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${statusFilter === s
                                ? 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                                : 'bg-[#141414] border-[#262626] text-[#a3a3a3] hover:text-white hover:border-[#404040]'
                            }`}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#262626] text-[#737373] text-xs uppercase tracking-wider">
                            <th className="p-3 text-left w-10">
                                <input
                                    type="checkbox"
                                    className="accent-blue-500"
                                    onChange={e => {
                                        if (e.target.checked) setSelectedIds(new Set(uploads.filter(u => u.autoCheckStatus === 'passed').map(u => u.id)));
                                        else setSelectedIds(new Set());
                                    }}
                                />
                            </th>
                            <th className="p-3 text-left">Filename</th>
                            <th className="p-3 text-left">Uploader</th>
                            <th className="p-3 text-left">Campaign</th>
                            <th className="p-3 text-right">Duration</th>
                            <th className="p-3 text-right">Size</th>
                            <th className="p-3 text-center">Auto Score</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploads.map(u => {
                            const cls = u.autoScore !== null ? classifyAutoScore(u.autoScore) : null;
                            return (
                                <tr key={u.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            className="accent-blue-500"
                                            checked={selectedIds.has(u.id)}
                                            onChange={() => toggleSelect(u.id)}
                                            disabled={u.autoCheckStatus !== 'passed'}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <div className="text-sm font-medium">{u.filename}</div>
                                        <div className="text-xs text-[#525252]">{u.id}</div>
                                    </td>
                                    <td className="p-3 text-sm text-[#a3a3a3]">{u.uploaderName}</td>
                                    <td className="p-3 text-sm text-[#a3a3a3]">{u.campaignName || '—'}</td>
                                    <td className="p-3 text-sm text-right text-[#a3a3a3] font-mono">{formatDuration(u.duration)}</td>
                                    <td className="p-3 text-sm text-right text-[#a3a3a3] font-mono">{formatBytes(u.sizeBytes)}</td>
                                    <td className="p-3 text-center">
                                        {u.autoScore !== null && cls ? (
                                            <span className="text-sm font-mono font-bold" style={{ color: cls.color }}>{u.autoScore}</span>
                                        ) : (
                                            <span className="text-[#525252]">—</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-center">
                                        <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${u.autoCheckStatus === 'passed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                u.autoCheckStatus === 'flagged' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    u.autoCheckStatus === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                        u.autoCheckStatus === 'pending' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                                                            'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                            }`}>
                                            {u.autoCheckStatus}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => handleInspect(u)}
                                                className="p-1.5 rounded-md text-[#a3a3a3] hover:text-white hover:bg-[#262626] transition-colors"
                                                title="Inspect"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleRecheck(u.id)}
                                                className="p-1.5 rounded-md text-[#a3a3a3] hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                                                title="Re-check"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleForceReject(u.id)}
                                                className="p-1.5 rounded-md text-[#a3a3a3] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                title="Force reject"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Inspect Panel */}
            {selectedUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUpload(null)} />
                    <div className="relative bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-[#262626]">
                            <div>
                                <h2 className="text-lg font-bold">{selectedUpload.filename}</h2>
                                <p className="text-sm text-[#737373]">{selectedUpload.id} · {selectedUpload.uploaderName}</p>
                            </div>
                            <button onClick={() => setSelectedUpload(null)} className="p-2 rounded-lg hover:bg-[#262626] text-[#a3a3a3]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Video placeholder */}
                            <div className="aspect-video bg-[#0a0a0a] rounded-xl border border-[#262626] flex items-center justify-center">
                                <div className="text-center text-[#525252]">
                                    <svg className="mx-auto mb-2" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    <p className="text-sm">Video Preview</p>
                                    <p className="text-xs">{selectedUpload.resolution} · {formatDuration(selectedUpload.duration)}</p>
                                </div>
                            </div>

                            {/* Auto-check summary */}
                            {selectedUpload.autoCheckJson && (
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#737373] mb-3">Auto-Check Scores</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {([
                                            ['Framing', selectedUpload.autoCheckJson.framing],
                                            ['Object Coverage', selectedUpload.autoCheckJson.objectCoverage],
                                            ['Continuity', selectedUpload.autoCheckJson.continuity],
                                            ['Tech Quality', selectedUpload.autoCheckJson.technicalQuality],
                                            ['Annotation Coverage', selectedUpload.autoCheckJson.annotationCoverage],
                                        ] as [string, number][]).map(([label, score]) => (
                                            <div key={label} className="bg-[#0a0a0a] rounded-lg p-3 border border-[#262626]">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-[#a3a3a3]">{label}</span>
                                                    <span className="text-sm font-mono font-bold" style={{ color: score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444' }}>{score}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-[#262626] rounded-full">
                                                    <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444' }} />
                                                </div>
                                            </div>
                                        ))}
                                        <div className="bg-[#0a0a0a] rounded-lg p-3 border border-blue-500/20">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-blue-400">Composite Score</span>
                                                <span className="text-lg font-mono font-bold text-blue-400">{selectedUpload.autoCheckJson.compositeScore}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Flags */}
                            {selectedUpload.autoCheckJson?.flags && selectedUpload.autoCheckJson.flags.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#737373] mb-3">Flags</h3>
                                    <div className="space-y-1">
                                        {selectedUpload.autoCheckJson.flags.map((flag, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-sm">
                                                <span>⚠️</span>
                                                <span>{flag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Per-check details */}
                            {selectedChecks.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#737373] mb-3">Individual Checks</h3>
                                    <div className="space-y-2">
                                        {selectedChecks.map(c => (
                                            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0a] border border-[#262626]">
                                                <div>
                                                    <div className="text-sm font-medium">{c.checkType.replace(/_/g, ' ')}</div>
                                                    <div className="text-xs text-[#525252]">{c.modelVersion} · {c.latencyMs}ms</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-mono" style={{ color: c.passed ? '#22c55e' : '#ef4444' }}>{c.score}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {c.passed ? 'PASS' : 'FAIL'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminIngestion;
