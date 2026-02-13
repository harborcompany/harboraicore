import React, { useState, useEffect } from 'react';
import {
    getAutoCheckMetrics,
    getUploads,
    getAutoChecks,
    formatDate,
    type AutoCheckMetrics,
    type Upload,
    type AutoCheck,
} from '../../services/adminPipelineService';

export function AdminAutoChecks() {
    const [metrics, setMetrics] = useState<AutoCheckMetrics[]>([]);
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
    const [checks, setChecks] = useState<AutoCheck[]>([]);

    useEffect(() => {
        setMetrics(getAutoCheckMetrics());
        setUploads(getUploads());
    }, []);

    function handleSelect(u: Upload) {
        setSelectedUpload(u);
        setChecks(getAutoChecks(u.id));
    }

    const checkTypeLabels: Record<string, string> = {
        framing: 'Framing & Hands',
        object_coverage: 'Object Coverage (SAM3)',
        continuity: 'Temporal Continuity',
        audio_noise: 'Audio / SNR',
        transcription: 'Transcription',
        hands_detection: 'Hands Detection',
        face_detection: 'Face Detection',
    };

    return (
        <div className="p-6 text-white max-w-[1400px]">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Auto-Check Pipeline Health</h1>
                <p className="text-[#737373] mt-1">Model performance, latencies, and per-upload auto-check details</p>
            </div>

            {/* Per-check-type metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map(m => (
                    <div key={m.checkType} className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-[#404040] transition-colors">
                        <div className="text-xs text-[#737373] uppercase tracking-wider mb-3">
                            {checkTypeLabels[m.checkType] || m.checkType}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <div className="text-xl font-bold" style={{ color: m.avgScore >= 85 ? '#22c55e' : m.avgScore >= 70 ? '#f59e0b' : '#ef4444' }}>
                                    {m.avgScore}
                                </div>
                                <div className="text-xs text-[#525252]">Avg Score</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold" style={{ color: m.passRate >= 80 ? '#22c55e' : m.passRate >= 60 ? '#f59e0b' : '#ef4444' }}>
                                    {m.passRate}%
                                </div>
                                <div className="text-xs text-[#525252]">Pass Rate</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#525252]">
                            <span>Avg: {m.avgLatencyMs}ms</span>
                            <span>{m.totalRuns} runs</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Threshold Config Display */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Active Thresholds</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Pending Review', value: '≥ 70', color: '#f59e0b', desc: 'Human QA review required' },
                        { label: 'Auto-FAIL', value: '< 70', color: '#ef4444', desc: 'Fix or reject' },
                    ].map(t => (
                        <div key={t.label} className="p-3 rounded-lg" style={{ background: `${t.color}08`, border: `1px solid ${t.color}20` }}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium" style={{ color: t.color }}>{t.label}</span>
                                <span className="text-sm font-mono font-bold" style={{ color: t.color }}>{t.value}</span>
                            </div>
                            <div className="text-xs text-[#737373]">{t.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upload list with auto-check detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: upload list */}
                <div className="lg:col-span-1 bg-[#141414] border border-[#262626] rounded-xl">
                    <div className="p-4 border-b border-[#262626]">
                        <h3 className="font-semibold">Uploads</h3>
                    </div>
                    <div className="divide-y divide-[#1a1a1a] max-h-[500px] overflow-y-auto">
                        {uploads.map(u => (
                            <button
                                key={u.id}
                                onClick={() => handleSelect(u)}
                                className={`w-full text-left px-4 py-3 hover:bg-[#1a1a1a] transition-colors ${selectedUpload?.id === u.id ? 'bg-blue-500/5 border-l-2 border-blue-500' : ''
                                    }`}
                            >
                                <div className="text-sm font-medium truncate">{u.filename}</div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-[#525252]">{u.uploaderName}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.autoCheckStatus === 'passed' ? 'bg-green-500/10 text-green-400' :
                                        u.autoCheckStatus === 'flagged' ? 'bg-amber-500/10 text-amber-400' :
                                            u.autoCheckStatus === 'failed' ? 'bg-red-500/10 text-red-400' :
                                                'bg-gray-500/10 text-gray-400'
                                        }`}>
                                        {u.autoScore !== null ? u.autoScore : 'pending'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: check detail */}
                <div className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-xl">
                    {selectedUpload ? (
                        <>
                            <div className="p-4 border-b border-[#262626]">
                                <h3 className="font-semibold">{selectedUpload.filename}</h3>
                                <p className="text-xs text-[#737373] mt-1">
                                    Composite: <span className="font-mono font-bold text-blue-400">{selectedUpload.autoScore ?? '—'}</span>
                                    {selectedUpload.autoCheckJson && ` · Latency: ${selectedUpload.autoCheckJson.totalLatencyMs}ms`}
                                </p>
                            </div>
                            <div className="p-4 space-y-4">
                                {/* Score breakdown bars */}
                                {selectedUpload.autoCheckJson && (
                                    <div className="space-y-3">
                                        {([
                                            ['Framing (30%)', selectedUpload.autoCheckJson.framing, 0.30],
                                            ['Object Coverage (25%)', selectedUpload.autoCheckJson.objectCoverage, 0.25],
                                            ['Continuity (15%)', selectedUpload.autoCheckJson.continuity, 0.15],
                                            ['Tech Quality (15%)', selectedUpload.autoCheckJson.technicalQuality, 0.15],
                                            ['Annotation Coverage (15%)', selectedUpload.autoCheckJson.annotationCoverage, 0.15],
                                        ] as [string, number, number][]).map(([label, score, weight]) => (
                                            <div key={label}>
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className="text-[#a3a3a3]">{label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#525252]">weighted: {(score * weight).toFixed(1)}</span>
                                                        <span className="font-mono font-bold" style={{ color: score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444' }}>{score}</span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-2 bg-[#262626] rounded-full">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${score}%`, background: score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Flags */}
                                {selectedUpload.autoCheckJson?.flags && selectedUpload.autoCheckJson.flags.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-2">Flags</h4>
                                        {selectedUpload.autoCheckJson.flags.map((f, i) => (
                                            <div key={i} className="text-sm text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2 mb-1">
                                                ⚠️ {f}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Individual check timeline */}
                                {checks.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-2">Check Timeline</h4>
                                        <div className="relative">
                                            <div className="absolute left-4 top-0 bottom-0 w-px bg-[#262626]" />
                                            <div className="space-y-3">
                                                {checks.map(c => (
                                                    <div key={c.id} className="relative pl-10">
                                                        <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 ${c.passed ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'}`} />
                                                        <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-3">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-sm font-medium">{checkTypeLabels[c.checkType] || c.checkType}</span>
                                                                <span className="text-sm font-mono" style={{ color: c.passed ? '#22c55e' : '#ef4444' }}>{c.score}</span>
                                                            </div>
                                                            <div className="text-xs text-[#525252]">{c.modelVersion} · {c.latencyMs}ms · {formatDate(c.createdAt)}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-[#525252] text-sm">
                            Select an upload to view auto-check details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminAutoChecks;
