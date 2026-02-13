import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    getPipelineStats,
    getUploads,
    getQAReviews,
    getAuditEvents,
    classifyAutoScore,
    formatDuration,
    formatDate,
    type PipelineStats,
    type Upload,
    type QAReview,
    type AuditEvent,
} from '../../services/adminPipelineService';

export function AdminDashboard() {
    const [stats, setStats] = useState<PipelineStats | null>(null);
    const [recentUploads, setRecentUploads] = useState<Upload[]>([]);
    const [recentReviews, setRecentReviews] = useState<QAReview[]>([]);
    const [auditLog, setAuditLog] = useState<AuditEvent[]>([]);

    useEffect(() => {
        setStats(getPipelineStats());
        setRecentUploads(getUploads().slice(0, 5));
        setRecentReviews(getQAReviews().slice(0, 5));
        setAuditLog(getAuditEvents().slice(0, 8));
    }, []);

    if (!stats) return <div className="p-6 text-white">Loading...</div>;

    return (
        <div className="p-6 text-white max-w-[1400px]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pipeline Dashboard</h1>
                    <p className="text-[#a3a3a3] mt-1 text-sm uppercase tracking-widest font-mono">LEGO Pilot Week 1 — Ingest → QA → Dataset</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Pipeline Active
                    </span>
                </div>
            </div>

            {/* KPI Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                <KPITile label="New Uploads (24h)" value={stats.uploads24h.toString()} accent="#3b82f6" />
                <KPITile label="Auto-Fail Assets" value={stats.autoFailCount.toString()} accent="#ef4444" />
                <KPITile label="In QA" value={stats.assetsInQA.toString()} accent="#f59e0b" />
                <KPITile label="Datasets Ready" value={stats.datasetsReady.toString()} accent="#22c55e" />
                <KPITile label="Pending Exports" value={stats.pendingExports.toString()} accent="#8b5cf6" />
                <KPITile label="Total Uploads" value={stats.uploadsTotal.toString()} accent="#64748b" />
            </div>

            {/* Pipeline Funnel */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Pipeline Flow</h2>
                <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
                    <div className="flex items-center justify-between gap-2">
                        {[
                            { label: 'Uploaded', count: stats.pipelineStages.uploaded, color: '#64748b', path: '/admin/uploads' },
                            { label: 'Processing', count: stats.pipelineStages.processing, color: '#3b82f6', path: '/admin/auto-checks' },
                            { label: 'Annotated', count: stats.pipelineStages.annotated, color: '#8b5cf6', path: '/admin/annotations' },
                            { label: 'Reviewed', count: stats.pipelineStages.reviewed, color: '#22c55e', path: '/admin/reviews' },
                            { label: 'Dataset Ready', count: stats.pipelineStages.datasetReady, color: '#f59e0b', path: '/admin/datasets' },
                        ].map((stage, i, arr) => (
                            <React.Fragment key={stage.label}>
                                <Link
                                    to={stage.path}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border min-w-[100px] transition-all hover:scale-105 hover:shadow-lg"
                                    style={{
                                        background: `${stage.color}10`,
                                        borderColor: `${stage.color}30`,
                                        color: stage.color,
                                    }}
                                >
                                    <span className="text-3xl font-bold">{stage.count}</span>
                                    <span className="text-xs uppercase tracking-wider mt-1 opacity-80">{stage.label}</span>
                                </Link>
                                {i < arr.length - 1 && (
                                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-[#404040] flex-shrink-0">
                                        <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Uploads */}
                <div className="bg-[#141414] border border-[#262626] rounded-xl">
                    <div className="flex items-center justify-between p-4 border-b border-[#262626]">
                        <h3 className="font-semibold">Recent Uploads</h3>
                        <Link to="/admin/uploads" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
                    </div>
                    <div className="divide-y divide-[#262626]">
                        {recentUploads.map(u => {
                            const cls = u.autoScore ? classifyAutoScore(u.autoScore) : null;
                            return (
                                <div key={u.id} className="flex items-center justify-between px-4 py-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{u.filename}</div>
                                        <div className="text-xs text-[#737373]">{u.uploaderName} · {formatDuration(u.duration)}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {u.autoScore !== null && cls && (
                                            <span className="text-sm font-mono font-bold" style={{ color: cls.color }}>{u.autoScore}</span>
                                        )}
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.autoCheckStatus === 'passed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            u.autoCheckStatus === 'flagged' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                u.autoCheckStatus === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                            }`}>
                                            {u.autoCheckStatus}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* QA Review Activity */}
                <div className="bg-[#141414] border border-[#262626] rounded-xl">
                    <div className="flex items-center justify-between p-4 border-b border-[#262626]">
                        <h3 className="font-semibold">QA Review Activity</h3>
                        <Link to="/admin/reviews" className="text-xs text-blue-400 hover:text-blue-300">View queue →</Link>
                    </div>
                    <div className="divide-y divide-[#262626]">
                        {recentReviews.map(r => (
                            <div key={r.qaId} className="flex items-center justify-between px-4 py-3">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium">{r.reviewerName}</div>
                                    <div className="text-xs text-[#737373]">{formatDate(r.createdAt)}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono font-bold" style={{
                                        color: r.finalScore >= 80 ? '#22c55e' : r.finalScore >= 75 ? '#eab308' : '#ef4444'
                                    }}>
                                        {r.finalScore}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.action === 'approve' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                        r.action === 'request_edit' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                            'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                        {r.action.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentReviews.length === 0 && (
                            <div className="px-4 py-8 text-center text-[#737373] text-sm">No reviews yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl mb-8">
                <div className="flex items-center justify-between p-4 border-b border-[#262626]">
                    <h3 className="font-semibold">Recent Activity</h3>
                </div>
                <div className="divide-y divide-[#262626]">
                    {auditLog.map(evt => (
                        <div key={evt.eventId} className="flex items-center gap-4 px-4 py-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${evt.verb.includes('upload') ? 'bg-blue-500/15 text-blue-400' :
                                evt.verb.includes('auto_check') ? 'bg-purple-500/15 text-purple-400' :
                                    evt.verb.includes('annotation') ? 'bg-indigo-500/15 text-indigo-400' :
                                        evt.verb.includes('qa') ? 'bg-amber-500/15 text-amber-400' :
                                            evt.verb.includes('dataset') ? 'bg-green-500/15 text-green-400' :
                                                'bg-gray-500/15 text-gray-400'
                                }`}>
                                {evt.verb.includes('upload') ? '↑' :
                                    evt.verb.includes('auto_check') ? '⚡' :
                                        evt.verb.includes('annotation') ? '🏷' :
                                            evt.verb.includes('qa') ? '✓' :
                                                evt.verb.includes('dataset') ? '📦' : '•'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm">
                                    <span className="font-medium">{evt.actorName}</span>
                                    <span className="text-[#737373]"> · {evt.verb.replace(/\./g, ' → ')}</span>
                                </div>
                                <div className="text-xs text-[#525252]">{formatDate(evt.createdAt)}</div>
                            </div>
                            {evt.metadata.score !== undefined && (
                                <span className="text-sm font-mono text-[#a3a3a3]">{evt.metadata.score}</span>
                            )}
                            {evt.metadata.action && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${evt.metadata.action === 'approve' ? 'bg-green-500/10 text-green-400' :
                                    evt.metadata.action === 'request_edit' ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-red-500/10 text-red-400'
                                    }`}>
                                    {evt.metadata.action}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* System Alerts */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl">
                <div className="p-4 border-b border-[#262626]">
                    <h3 className="font-semibold">System Alerts</h3>
                </div>
                <div className="p-4 space-y-2">
                    {stats.autoFailCount > 0 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                            <span>⚠️</span>
                            <span className="text-sm font-medium">{stats.autoFailCount} upload(s) auto-failed — need review or rejection</span>
                        </div>
                    )}
                    {stats.pendingExports > 0 && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <span>📦</span>
                            <span className="text-sm font-medium">{stats.pendingExports} dataset build(s) in progress</span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <span>ℹ️</span>
                        <span className="text-sm font-medium">LEGO Pilot Week 1 campaign active — target: 8h footage from 30 contributors</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPITile({ label, value, accent }: { label: string; value: string; accent: string }) {
    return (
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 hover:border-[#404040] transition-colors">
            <div className="text-xs text-[#737373] uppercase tracking-wider mb-1">{label}</div>
            <div className="text-2xl font-bold" style={{ color: accent }}>{value}</div>
        </div>
    );
}

export default AdminDashboard;
