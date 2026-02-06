import React, { useState } from 'react';
import { PageHeader, DataTable, Tabs, StatusBadge, Button, ChartCard } from '../../components/admin/AdminComponents';

interface Asset {
    id: string;
    filename: string;
    type: 'video' | 'audio' | 'image';
    duration: number;
    size: string;
    user: string;
    status: 'PROCESSING' | 'READY' | 'ERROR';
    source: string;
    createdAt: string;
    auditStage: string;
}

const mockAssets: Asset[] = [
    { id: 'ast_001', filename: 'driving_scene_001.mp4', type: 'video', duration: 124, size: '2.4 GB', user: 'alice@studio.com', status: 'PROCESSING', source: 'API', createdAt: '5 min ago', auditStage: 'fingerprint' },
    { id: 'ast_002', filename: 'podcast_ep_42.wav', type: 'audio', duration: 3600, size: '890 MB', user: 'bob@creator.net', status: 'READY', source: 'Mobile', createdAt: '12 min ago', auditStage: 'completed' },
    { id: 'ast_003', filename: 'street_batch_099.zip', type: 'image', duration: 0, size: '1.2 GB', user: 'carol@media.io', status: 'ERROR', source: 'API', createdAt: '18 min ago', auditStage: 'web_scrape' },
    { id: 'ast_004', filename: 'interview_raw.mp4', type: 'video', duration: 2400, size: '4.8 GB', user: 'dave@studio.co', status: 'PROCESSING', source: 'Mobile', createdAt: '25 min ago', auditStage: 'similarity' },
    { id: 'ast_005', filename: 'nature_sounds.wav', type: 'audio', duration: 900, size: '210 MB', user: 'eve@content.tv', status: 'READY', source: 'API', createdAt: '32 min ago', auditStage: 'completed' },
];

export function AdminIngestion() {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const tabs = [
        { id: 'all', label: 'All', count: mockAssets.length },
        { id: 'pending', label: 'Pending Scan', count: mockAssets.filter(a => a.status === 'PROCESSING').length },
        { id: 'approved', label: 'Approved', count: mockAssets.filter(a => a.status === 'READY').length },
        { id: 'rejected', label: 'Rejected', count: mockAssets.filter(a => a.status === 'ERROR').length },
    ];

    const filteredAssets = mockAssets.filter(asset => {
        if (activeTab === 'pending') return asset.status === 'PROCESSING';
        if (activeTab === 'approved') return asset.status === 'READY';
        if (activeTab === 'rejected') return asset.status === 'ERROR';
        return true;
    });

    const columns = [
        {
            key: 'filename',
            label: 'Asset',
            render: (asset: Asset) => (
                <div className="asset-cell">
                    <span className="asset-type-icon">{asset.type === 'video' ? '🎬' : asset.type === 'audio' ? '🎵' : '🖼️'}</span>
                    <div>
                        <span className="asset-filename">{asset.filename}</span>
                        <span className="asset-id">{asset.id}</span>
                    </div>
                </div>
            )
        },
        { key: 'type', label: 'Type' },
        {
            key: 'duration',
            label: 'Duration',
            render: (asset: Asset) => asset.duration > 0 ? formatDuration(asset.duration) : '—'
        },
        { key: 'size', label: 'Size' },
        { key: 'user', label: 'User' },
        { key: 'source', label: 'Source' },
        {
            key: 'status',
            label: 'Status',
            render: (asset: Asset) => (
                <StatusBadge
                    label={asset.status}
                    variant={asset.status === 'READY' ? 'success' : asset.status === 'ERROR' ? 'error' : 'warning'}
                />
            )
        },
        { key: 'auditStage', label: 'Audit Stage' },
        { key: 'createdAt', label: 'Ingested' },
    ];

    return (
        <div className="admin-ingestion">
            <PageHeader
                title="Content Ingestion"
                subtitle="Media upload queue and audit pipeline"
            />

            {/* Queue Stats */}
            <div className="queue-stats">
                <ChartCard title="Ingestion Queue">
                    <div className="queue-visual">
                        <div className="queue-bar">
                            <div className="queue-segment processing" style={{ width: '40%' }}>
                                <span>Processing (2)</span>
                            </div>
                            <div className="queue-segment approved" style={{ width: '40%' }}>
                                <span>Approved (2)</span>
                            </div>
                            <div className="queue-segment rejected" style={{ width: '20%' }}>
                                <span>Rejected (1)</span>
                            </div>
                        </div>
                    </div>
                </ChartCard>
            </div>

            <div className="ingestion-toolbar">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                <div className="toolbar-actions">
                    <Button variant="secondary">Bulk Approve</Button>
                    <Button variant="secondary">Run Audit</Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredAssets}
                onRowClick={(asset) => setSelectedAsset(asset)}
            />

            {/* Asset Detail Drawer */}
            {selectedAsset && (
                <div className="asset-drawer">
                    <div className="drawer-overlay" onClick={() => setSelectedAsset(null)} />
                    <div className="drawer-content">
                        <div className="drawer-header">
                            <h2>{selectedAsset.filename}</h2>
                            <button className="close-btn" onClick={() => setSelectedAsset(null)}>×</button>
                        </div>
                        <div className="drawer-body">
                            <div className="detail-section">
                                <h3>Metadata</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Asset ID</span>
                                    <span className="detail-value mono">{selectedAsset.id}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Type</span>
                                    <span className="detail-value">{selectedAsset.type}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Duration</span>
                                    <span className="detail-value">{formatDuration(selectedAsset.duration)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Size</span>
                                    <span className="detail-value">{selectedAsset.size}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Source</span>
                                    <span className="detail-value">{selectedAsset.source}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Audit Trail</h3>
                                <div className="audit-timeline">
                                    <AuditStep stage="fingerprint" status="passed" time="5 min ago" />
                                    <AuditStep stage="similarity" status="passed" time="4 min ago" />
                                    <AuditStep stage="web_scrape" status={selectedAsset.status === 'ERROR' ? 'failed' : 'passed'} time="3 min ago" />
                                    <AuditStep stage="human_review" status={selectedAsset.status === 'PROCESSING' ? 'pending' : 'passed'} time={selectedAsset.status === 'PROCESSING' ? 'Pending' : '1 min ago'} />
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Manual Review</h3>
                                <div className="review-actions">
                                    <Button variant="primary">Approve</Button>
                                    <Button variant="ghost" style={{ color: '#ef4444' }}>Reject</Button>
                                </div>
                                <textarea className="review-notes" placeholder="Add review notes..." />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .admin-ingestion { max-width: 1400px; }
        .queue-stats { margin-bottom: 24px; }
        .queue-visual { padding: 8px 0; }
        .queue-bar {
          display: flex;
          height: 40px;
          border-radius: 6px;
          overflow: hidden;
        }
        .queue-segment {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          color: #fff;
        }
        .queue-segment.processing { background: #f59e0b; }
        .queue-segment.approved { background: #22c55e; }
        .queue-segment.rejected { background: #ef4444; }
        .ingestion-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .toolbar-actions { display: flex; gap: 8px; }
        .asset-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .asset-type-icon { font-size: 20px; }
        .asset-filename { display: block; color: #fafafa; }
        .asset-id { display: block; color: #525252; font-size: 11px; font-family: monospace; }
        
        /* Drawer */
        .asset-drawer {
          position: fixed;
          inset: 0;
          z-index: 100;
        }
        .drawer-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        .drawer-content {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 450px;
          background: #141414;
          border-left: 1px solid #262626;
          display: flex;
          flex-direction: column;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #262626;
        }
        .drawer-header h2 { margin: 0; font-size: 16px; }
        .close-btn {
          background: none;
          border: none;
          color: #a3a3a3;
          font-size: 24px;
          cursor: pointer;
        }
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        .detail-section { margin-bottom: 24px; }
        .detail-section h3 {
          font-size: 12px;
          color: #a3a3a3;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #262626;
        }
        .detail-label { color: #a3a3a3; font-size: 13px; }
        .detail-value { color: #fafafa; font-size: 13px; }
        .detail-value.mono { font-family: monospace; }
        .audit-timeline { display: flex; flex-direction: column; gap: 8px; }
        .review-actions { display: flex; gap: 12px; margin-bottom: 12px; }
        .review-notes {
          width: 100%;
          height: 80px;
          background: #1a1a1a;
          border: 1px solid #262626;
          border-radius: 6px;
          color: #fafafa;
          padding: 12px;
          font-size: 13px;
          resize: none;
        }
      `}</style>
        </div>
    );
}

function AuditStep({ stage, status, time }: { stage: string; status: 'passed' | 'failed' | 'pending'; time: string }) {
    return (
        <div className="audit-step">
            <span className={`audit-dot ${status}`}></span>
            <div className="audit-info">
                <span className="audit-stage">{stage.replace('_', ' ')}</span>
                <span className="audit-time">{time}</span>
            </div>
            <StatusBadge
                label={status}
                variant={status === 'passed' ? 'success' : status === 'failed' ? 'error' : 'warning'}
            />
            <style>{`
        .audit-step {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }
        .audit-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .audit-dot.passed { background: #22c55e; }
        .audit-dot.failed { background: #ef4444; }
        .audit-dot.pending { background: #f59e0b; }
        .audit-info { flex: 1; }
        .audit-stage { display: block; color: #fafafa; font-size: 13px; text-transform: capitalize; }
        .audit-time { display: block; color: #525252; font-size: 11px; }
      `}</style>
        </div>
    );
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

export default AdminIngestion;
