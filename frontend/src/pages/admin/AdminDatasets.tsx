import React, { useState, useEffect } from 'react';
import {
    getDatasetBuilds,
    getUploads,
    getQAReviews,
    createDatasetBuild,
    formatDate,
    type DatasetBuild,
    type Upload,
} from '../../services/adminPipelineService';
import { Link } from 'react-router-dom';
import { datasetCertificationService, CertificationResult } from '../../services/datasetCertificationService';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AdminDatasets() {
    const [builds, setBuilds] = useState<DatasetBuild[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [eligibleUploads, setEligibleUploads] = useState<Upload[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [splitConfig, setSplitConfig] = useState({ train: 0.8, val: 0.1, test: 0.1 });
    const [expandedBuild, setExpandedBuild] = useState<string | null>(null);
    const [certifying, setCertifying] = useState<string | null>(null);
    const [certError, setCertError] = useState<{ id: string, messages: string[] } | null>(null);

    useEffect(() => {
        setBuilds(getDatasetBuilds());
        // Only approved uploads are eligible
        const reviews = getQAReviews();
        const approvedIds = new Set(reviews.filter(r => r.action === 'approve' && r.includeInDataset).map(r => r.uploadId));
        const allUploads = getUploads();
        setEligibleUploads(allUploads.filter(u => approvedIds.has(u.id)));
    }, []);

    function handleCreate() {
        if (!newTitle || selectedIds.size === 0) return;
        createDatasetBuild({
            title: newTitle,
            description: newDescription,
            mediaIds: Array.from(selectedIds),
            splitConfig,
            license: { type: 'Commercial', scope: 'Non-exclusive' },
            schemaName: 'lego_assembly',
        });
        setBuilds(getDatasetBuilds());
        setShowCreate(false);
        setNewTitle('');
        setNewDescription('');
        setSelectedIds(new Set());
    }

    async function handleCertify(id: string) {
        setCertifying(id);
        const result = await datasetCertificationService.certifyDataset(id);
        if (result.success) {
            setBuilds(prev => prev.map(b => b.datasetId === id ? { ...b, status: 'ready' } : b));
            setCertError(null);
        } else {
            setCertError({ id, messages: result.errors });
        }
        setCertifying(false as any);
    }

    return (
        <div className="p-6 text-white max-w-[1400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Dataset Builder</h1>
                    <p className="text-[#737373] mt-1">Build, version, and export datasets from approved assets</p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    + New Dataset
                </button>
            </div>

            {/* Create dataset panel */}
            {showCreate && (
                <div className="bg-[#141414] border border-blue-500/20 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold mb-4">Create Dataset Build</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs text-[#737373] mb-1">Title</label>
                            <input
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[#0a0a0a] border border-[#262626] text-sm text-white focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. Harbor_Assemble_LEGO_v2"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[#737373] mb-1">Description</label>
                            <input
                                value={newDescription}
                                onChange={e => setNewDescription(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[#0a0a0a] border border-[#262626] text-sm text-white focus:border-blue-500 focus:outline-none"
                                placeholder="Assembly primitives for robotics..."
                            />
                        </div>
                    </div>

                    {/* Split config */}
                    <div className="mb-4">
                        <label className="block text-xs text-[#737373] mb-2">Train / Val / Test Split</label>
                        <div className="flex gap-4">
                            {(['train', 'val', 'test'] as const).map(key => (
                                <div key={key} className="flex items-center gap-2">
                                    <span className="text-xs text-[#a3a3a3] capitalize">{key}:</span>
                                    <input
                                        type="number"
                                        min={0} max={1} step={0.05}
                                        value={splitConfig[key]}
                                        onChange={e => setSplitConfig({ ...splitConfig, [key]: parseFloat(e.target.value) })}
                                        className="w-16 p-1.5 rounded bg-[#0a0a0a] border border-[#262626] text-sm text-white text-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Select approved uploads */}
                    <div className="mb-4">
                        <label className="block text-xs text-[#737373] mb-2">Approved Assets ({eligibleUploads.length} eligible)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                            {eligibleUploads.map(u => (
                                <label key={u.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${selectedIds.has(u.id) ? 'bg-blue-500/5 border-blue-500/20' : 'bg-[#0a0a0a] border-[#262626]'
                                    }`}>
                                    <input
                                        type="checkbox"
                                        className="accent-blue-500"
                                        checked={selectedIds.has(u.id)}
                                        onChange={() => {
                                            const next = new Set(selectedIds);
                                            if (next.has(u.id)) next.delete(u.id); else next.add(u.id);
                                            setSelectedIds(next);
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{u.filename}</div>
                                        <div className="text-xs text-[#525252]">Score: {u.autoScore}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-[#a3a3a3] hover:text-white">Cancel</button>
                        <button onClick={handleCreate} disabled={!newTitle || selectedIds.size === 0}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg">
                            Build Dataset
                        </button>
                    </div>
                </div>
            )}

            {/* Dataset builds list */}
            <div className="space-y-4">
                {builds.map(build => {
                    const expanded = expandedBuild === build.datasetId;
                    return (
                        <div key={build.datasetId} className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden hover:border-[#404040] transition-all">
                            <button
                                onClick={() => setExpandedBuild(expanded ? null : build.datasetId)}
                                className="w-full text-left p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold">{build.title}</h3>
                                            <span className="text-xs font-mono px-2 py-0.5 bg-[#262626] rounded text-[#a3a3a3]">{build.version}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${build.status === 'ready' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                build.status === 'delivered' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {build.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#737373] mt-1">{build.description}</p>
                                    </div>
                                    <svg
                                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        className={`flex-shrink-0 text-[#525252] transition-transform ${expanded ? 'rotate-180' : ''}`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>

                                {/* Summary metrics row */}
                                <div className="grid grid-cols-6 gap-4 mt-4">
                                    <div>
                                        <div className="text-xs text-[#525252]">Hours</div>
                                        <div className="text-sm font-bold">{build.totalHours}h</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#525252]">Clips</div>
                                        <div className="text-sm font-bold">{build.totalClips}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#525252]">Contributors</div>
                                        <div className="text-sm font-bold">{build.contributorsCount}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#525252]">Dataset Score</div>
                                        <div className="text-sm font-bold" style={{ color: build.finalDatasetScore >= 85 ? '#22c55e' : '#f59e0b' }}>
                                            {build.finalDatasetScore}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#525252]">Human QA%</div>
                                        <div className="text-sm font-bold">{build.humanCheckedPct}%</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#525252]">Created</div>
                                        <div className="text-sm text-[#a3a3a3]">{formatDate(build.createdAt)}</div>
                                    </div>
                                </div>
                            </button>

                            {/* Expanded detail */}
                            {expanded && (
                                <div className="border-t border-[#262626] p-5 space-y-5">
                                    {/* QA summary */}
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-3">Quality Summary</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { label: 'Auto-Check Pass', value: `${build.qaSummary.autoCheckPassRate}%`, color: '#22c55e' },
                                                { label: 'Human QA Pass', value: `${build.qaSummary.humanQAPassRate}%`, color: '#3b82f6' },
                                                { label: 'Median Auto', value: `${build.qaSummary.medianAutoScore}`, color: '#8b5cf6' },
                                                { label: 'Median Human', value: `${build.qaSummary.medianHumanScore}`, color: '#f59e0b' },
                                                { label: 'Avg SNR', value: `${build.qaSummary.avgSNR} dB`, color: '#22d3ee' },
                                                { label: 'Clipping Rate', value: `${build.qaSummary.clippingRate}%`, color: '#ef4444' },
                                                { label: 'Frame Coverage', value: `${build.qaSummary.frameCoverage}%`, color: '#a3e635' },
                                                { label: 'Annotation IoU', value: `${build.qaSummary.annotationAgreement}`, color: '#ec4899' },
                                            ].map(m => (
                                                <div key={m.label} className="bg-[#0a0a0a] rounded-lg p-3 border border-[#262626]">
                                                    <div className="text-xs text-[#737373] mb-1">{m.label}</div>
                                                    <div className="text-lg font-mono font-bold" style={{ color: m.color }}>{m.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Split config */}
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-3">Split Configuration</h4>
                                        <div className="flex gap-3">
                                            {Object.entries(build.splitConfig).map(([key, val]) => (
                                                <div key={key} className="bg-[#0a0a0a] rounded-lg p-3 border border-[#262626] flex-1 text-center">
                                                    <div className="text-xs text-[#737373] capitalize mb-1">{key}</div>
                                                    <div className="text-lg font-bold">{(val * 100).toFixed(0)}%</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-2">
                                        {build.status !== 'ready' && build.status !== 'delivered' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleCertify(build.datasetId); }}
                                                disabled={certifying === build.datasetId}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg flex items-center gap-2"
                                            >
                                                {certifying === build.datasetId ? 'Certifying...' : <><ShieldCheck size={16} /> Certify Version</>}
                                            </button>
                                        )}
                                        {certError?.id === build.datasetId && (
                                            <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-1 uppercase">
                                                    <AlertTriangle size={12} /> Certification Failed
                                                </div>
                                                {certError.messages.map(m => (
                                                    <div key={m} className="text-xs text-red-300/80">• {m}</div>
                                                ))}
                                            </div>
                                        )}
                                        <Link
                                            to={`/admin/qa-report?dataset=${build.datasetId}`}
                                            className="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/20 text-sm rounded-lg hover:bg-purple-600/30 transition-colors"
                                        >
                                            📊 View QA Report
                                        </Link>
                                        <Link
                                            to="/admin/delivery"
                                            className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/20 text-sm rounded-lg hover:bg-green-600/30 transition-colors"
                                        >
                                            📦 Deliver to Client
                                        </Link>
                                        <button className="px-4 py-2 bg-[#0a0a0a] border border-[#262626] text-[#a3a3a3] text-sm rounded-lg hover:text-white hover:border-[#404040] transition-colors">
                                            ⬇︎ Export Manifest
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AdminDatasets;
