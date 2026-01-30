import React from 'react';
import { PageHeader, DataTable, StatusBadge, ChartCard, KPICard } from '../../components/admin/AdminComponents';

interface Campaign {
    id: string;
    client: string;
    name: string;
    platform: string;
    status: string;
    creativesGenerated: number;
    datasetInputs: string[];
    performanceScore: number;
    createdAt: string;
}

const mockCampaigns: Campaign[] = [
    { id: 'camp_001', client: 'Nike', name: 'Summer Run 2024', platform: 'tiktok', status: 'active', creativesGenerated: 24, datasetInputs: ['Urban Driving v3'], performanceScore: 8.7, createdAt: '2024-05-15' },
    { id: 'camp_002', client: 'Spotify', name: 'Wrapped Teasers', platform: 'meta', status: 'completed', creativesGenerated: 48, datasetInputs: ['Podcast Conversations'], performanceScore: 9.2, createdAt: '2024-11-01' },
    { id: 'camp_003', client: 'Unity', name: 'Dev Conference', platform: 'youtube', status: 'active', creativesGenerated: 12, datasetInputs: ['Gaming Voice'], performanceScore: 7.4, createdAt: '2024-10-20' },
    { id: 'camp_004', client: 'Calm', name: 'Sleep Stories Launch', platform: 'meta', status: 'draft', creativesGenerated: 6, datasetInputs: ['Therapy Sessions'], performanceScore: 0, createdAt: '2024-12-01' },
];

export function AdminAds() {
    const columns = [
        { key: 'client', label: 'Client', sortable: true },
        { key: 'name', label: 'Campaign' },
        { key: 'platform', label: 'Platform', render: (c: Campaign) => <StatusBadge label={c.platform} variant="info" /> },
        {
            key: 'status', label: 'Status', render: (c: Campaign) => (
                <StatusBadge label={c.status} variant={c.status === 'active' ? 'success' : c.status === 'completed' ? 'neutral' : 'warning'} />
            )
        },
        { key: 'creativesGenerated', label: 'Creatives', sortable: true },
        { key: 'datasetInputs', label: 'Datasets', render: (c: Campaign) => c.datasetInputs.join(', ') },
        {
            key: 'performanceScore', label: 'Performance', render: (c: Campaign) => c.performanceScore > 0 ? (
                <span style={{ color: c.performanceScore >= 8 ? '#22c55e' : c.performanceScore >= 6 ? '#f59e0b' : '#ef4444' }}>
                    {c.performanceScore.toFixed(1)}
                </span>
            ) : '—'
        },
    ];

    return (
        <div className="admin-ads">
            <PageHeader title="Ads & Creative Engine" subtitle="Campaign dashboard and performance feedback" />

            <div className="kpi-row">
                <KPICard label="Active Campaigns" value={mockCampaigns.filter(c => c.status === 'active').length} />
                <KPICard label="Creatives Generated" value={mockCampaigns.reduce((sum, c) => sum + c.creativesGenerated, 0)} />
                <KPICard label="Avg Performance" value="8.4" />
                <KPICard label="Datasets Used" value="4" />
            </div>

            <ChartCard title="Feedback Loop">
                <div className="feedback-loop">
                    <div className="feedback-step">📊 Performance Data</div>
                    <div className="feedback-arrow">→</div>
                    <div className="feedback-step">⚖️ Dataset Weighting</div>
                    <div className="feedback-arrow">→</div>
                    <div className="feedback-step">📝 Annotation Priority</div>
                    <div className="feedback-arrow">→</div>
                    <div className="feedback-step">🧠 RAG Refinement</div>
                </div>
            </ChartCard>

            <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 14, marginBottom: 16 }}>Campaigns</h3>
                <DataTable columns={columns} data={mockCampaigns} />
            </div>

            <style>{`
        .admin-ads { max-width: 1400px; }
        .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .feedback-loop { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 20px 0; }
        .feedback-step { background: #1a1a1a; border: 1px solid #262626; border-radius: 8px; padding: 16px 24px; font-size: 13px; }
        .feedback-arrow { color: #525252; font-size: 20px; }
      `}</style>
        </div>
    );
}

export default AdminAds;
