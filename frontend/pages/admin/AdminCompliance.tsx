import React, { useState } from 'react';
import { PageHeader, DataTable, Tabs, StatusBadge, Button, ChartCard } from '../../components/admin/AdminComponents';

interface AuditLog {
    id: string;
    action: string;
    actorId: string;
    resourceId: string;
    status: string;
    details: string;
    ipAddress: string;
    timestamp: string;
}

const mockLogs: AuditLog[] = [
    { id: 'log_001', action: 'DATASET_PUBLISH', actorId: 'admin@harbor.ai', resourceId: 'ds_001', status: 'SUCCESS', details: 'Published Urban Driving v3', ipAddress: '192.168.1.1', timestamp: '2 min ago' },
    { id: 'log_002', action: 'USER_FLAGS_UPDATED', actorId: 'admin@harbor.ai', resourceId: 'usr_042', status: 'SUCCESS', details: 'Risk score updated to 0.72', ipAddress: '192.168.1.1', timestamp: '15 min ago' },
    { id: 'log_003', action: 'PAYOUT_EXECUTED', actorId: 'finance@harbor.ai', resourceId: 'pay_089', status: 'SUCCESS', details: '$4,250 paid to alice@studio.com', ipAddress: '10.0.0.5', timestamp: '1 hr ago' },
    { id: 'log_004', action: 'ASSET_REJECTED', actorId: 'qa@harbor.ai', resourceId: 'ast_234', status: 'SUCCESS', details: 'Web scrape match found', ipAddress: '10.0.0.8', timestamp: '2 hr ago' },
    { id: 'log_005', action: 'API_ACCESS_DENIED', actorId: 'unknown', resourceId: 'api_key_expired', status: 'DENIED', details: 'Expired API key attempt', ipAddress: '45.33.32.156', timestamp: '3 hr ago' },
];

export function AdminCompliance() {
    const [activeTab, setActiveTab] = useState('logs');

    const tabs = [
        { id: 'logs', label: 'Audit Logs' },
        { id: 'provenance', label: 'Provenance Reports' },
        { id: 'exports', label: 'Compliance Exports' },
    ];

    const columns = [
        { key: 'action', label: 'Action', render: (log: AuditLog) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.action}</span> },
        { key: 'actorId', label: 'Actor' },
        { key: 'resourceId', label: 'Resource', render: (log: AuditLog) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.resourceId}</span> },
        {
            key: 'status', label: 'Status', render: (log: AuditLog) => (
                <StatusBadge label={log.status} variant={log.status === 'SUCCESS' ? 'success' : log.status === 'DENIED' ? 'error' : 'warning'} />
            )
        },
        { key: 'details', label: 'Details' },
        { key: 'ipAddress', label: 'IP', render: (log: AuditLog) => <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{log.ipAddress}</span> },
        { key: 'timestamp', label: 'Time' },
    ];

    return (
        <div className="admin-compliance">
            <PageHeader
                title="Compliance & Audit Logs"
                subtitle="Immutable event log and compliance reporting"
                actions={<Button variant="secondary">Export Logs</Button>}
            />

            <div className="audit-summary">
                <ChartCard title="Audit Layers (n8n Mapped)">
                    <div className="audit-layers">
                        {[
                            { layer: 'Metadata & Fingerprint Scan', status: 'active', count: 12450 },
                            { layer: 'Web Scrape Similarity Check', status: 'active', count: 11890 },
                            { layer: 'Human Verification', status: 'active', count: 2341 },
                            { layer: 'Dataset Provenance', status: 'active', count: 47 },
                        ].map(l => (
                            <div key={l.layer} className="layer-row">
                                <span className="layer-name">{l.layer}</span>
                                <span className="layer-count">{l.count.toLocaleString()} processed</span>
                                <StatusBadge label={l.status} variant="success" />
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            <div style={{ marginTop: 24 }}>
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {activeTab === 'logs' && (
                <div style={{ marginTop: 16 }}>
                    <DataTable columns={columns} data={mockLogs} />
                </div>
            )}

            {activeTab === 'provenance' && (
                <div className="provenance-section" style={{ marginTop: 16 }}>
                    <ChartCard title="Dataset Provenance Reports">
                        <div className="provenance-list">
                            {[
                                { dataset: 'Urban Driving v3', report: 'Full chain of custody documented', date: '2024-11-15' },
                                { dataset: 'Podcast Conversations', report: 'All consent records verified', date: '2024-11-10' },
                                { dataset: 'Gaming Voice Commands', report: 'Audit complete, no issues', date: '2024-11-08' },
                            ].map(p => (
                                <div key={p.dataset} className="provenance-row">
                                    <div>
                                        <span style={{ display: 'block', color: '#fafafa' }}>{p.dataset}</span>
                                        <span style={{ display: 'block', fontSize: 12, color: '#a3a3a3' }}>{p.report}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ display: 'block', fontSize: 12, color: '#525252' }}>{p.date}</span>
                                        <Button variant="ghost" size="sm">Download</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            )}

            {activeTab === 'exports' && (
                <div className="exports-section" style={{ marginTop: 16 }}>
                    <ChartCard title="Compliance Exports">
                        <div className="export-options">
                            <div className="export-card">
                                <h4>GDPR Data Export</h4>
                                <p>Full user data export for GDPR compliance requests</p>
                                <Button variant="secondary">Generate Export</Button>
                            </div>
                            <div className="export-card">
                                <h4>SOC2 Audit Trail</h4>
                                <p>Complete audit log for SOC2 certification</p>
                                <Button variant="secondary">Generate Export</Button>
                            </div>
                            <div className="export-card">
                                <h4>Dataset License Report</h4>
                                <p>All licensing terms and usage rights</p>
                                <Button variant="secondary">Generate Export</Button>
                            </div>
                        </div>
                    </ChartCard>
                </div>
            )}

            <style>{`
        .admin-compliance { max-width: 1400px; }
        .audit-summary { margin-bottom: 24px; }
        .audit-layers { display: flex; flex-direction: column; gap: 12px; }
        .layer-row { display: flex; align-items: center; gap: 16px; padding: 8px 0; border-bottom: 1px solid #262626; }
        .layer-name { flex: 2; font-size: 13px; color: #fafafa; }
        .layer-count { flex: 1; font-size: 12px; color: #a3a3a3; }
        .provenance-list { display: flex; flex-direction: column; gap: 12px; }
        .provenance-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #262626; }
        .export-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .export-card { background: #1a1a1a; border: 1px solid #262626; border-radius: 8px; padding: 20px; }
        .export-card h4 { margin: 0 0 8px 0; font-size: 14px; }
        .export-card p { margin: 0 0 16px 0; font-size: 12px; color: #a3a3a3; }
      `}</style>
        </div>
    );
}

export default AdminCompliance;
