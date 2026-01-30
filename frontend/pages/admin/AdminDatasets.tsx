import React, { useState } from 'react';
import { PageHeader, DataTable, Tabs, StatusBadge, Button, KPICard } from '../../components/admin/AdminComponents';

interface Dataset {
    id: string;
    name: string;
    vertical: string;
    modality: string[];
    hours: number;
    assetCount: number;
    license: string;
    status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';
    revenue: number;
    clients: number;
    createdAt: string;
}

const mockDatasets: Dataset[] = [
    { id: 'ds_001', name: 'Urban Driving Scenes v3', vertical: 'AUTOMOTIVE', modality: ['video'], hours: 12500, assetCount: 45000, license: 'COMMERCIAL', status: 'PUBLISHED', revenue: 245000, clients: 8, createdAt: '2024-06-15' },
    { id: 'ds_002', name: 'Podcast Conversations', vertical: 'BROADCAST', modality: ['audio'], hours: 8400, assetCount: 12000, license: 'COMMERCIAL', status: 'PUBLISHED', revenue: 127000, clients: 5, createdAt: '2024-08-22' },
    { id: 'ds_003', name: 'Retail Interactions', vertical: 'RETAIL', modality: ['video', 'audio'], hours: 3200, assetCount: 8500, license: 'HYBRID', status: 'DRAFT', revenue: 0, clients: 0, createdAt: '2024-11-10' },
    { id: 'ds_004', name: 'Gaming Voice Commands', vertical: 'GAMING', modality: ['audio'], hours: 1800, assetCount: 25000, license: 'COMMERCIAL', status: 'PUBLISHED', revenue: 89000, clients: 12, createdAt: '2024-09-05' },
    { id: 'ds_005', name: 'Therapy Sessions (Anonymized)', vertical: 'THERAPY', modality: ['audio'], hours: 950, assetCount: 2400, license: 'RESEARCH', status: 'PUBLISHED', revenue: 156000, clients: 3, createdAt: '2024-07-18' },
];

export function AdminDatasets() {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

    const tabs = [
        { id: 'all', label: 'All', count: mockDatasets.length },
        { id: 'published', label: 'Published', count: mockDatasets.filter(d => d.status === 'PUBLISHED').length },
        { id: 'draft', label: 'Draft', count: mockDatasets.filter(d => d.status === 'DRAFT').length },
    ];

    const columns = [
        {
            key: 'name',
            label: 'Dataset',
            render: (ds: Dataset) => (
                <div>
                    <span style={{ color: '#fafafa' }}>{ds.name}</span>
                    <span style={{ display: 'block', fontSize: 11, color: '#525252', fontFamily: 'monospace' }}>{ds.id}</span>
                </div>
            )
        },
        {
            key: 'vertical',
            label: 'Vertical',
            render: (ds: Dataset) => <StatusBadge label={ds.vertical} variant="info" />
        },
        {
            key: 'modality',
            label: 'Modality',
            render: (ds: Dataset) => ds.modality.join(', ')
        },
        {
            key: 'hours',
            label: 'Hours',
            sortable: true,
            render: (ds: Dataset) => `${(ds.hours / 1000).toFixed(1)}K`
        },
        { key: 'assetCount', label: 'Assets', sortable: true, render: (ds: Dataset) => ds.assetCount.toLocaleString() },
        { key: 'license', label: 'License' },
        {
            key: 'status',
            label: 'Status',
            render: (ds: Dataset) => (
                <StatusBadge
                    label={ds.status}
                    variant={ds.status === 'PUBLISHED' ? 'success' : ds.status === 'DRAFT' ? 'warning' : 'neutral'}
                />
            )
        },
        {
            key: 'revenue',
            label: 'Revenue',
            sortable: true,
            render: (ds: Dataset) => `$${(ds.revenue / 1000).toFixed(0)}K`
        },
        { key: 'clients', label: 'Clients', sortable: true },
    ];

    const filteredDatasets = mockDatasets.filter(ds => {
        if (activeTab === 'published') return ds.status === 'PUBLISHED';
        if (activeTab === 'draft') return ds.status === 'DRAFT';
        return true;
    });

    const totalRevenue = mockDatasets.reduce((sum, d) => sum + d.revenue, 0);
    const totalHours = mockDatasets.reduce((sum, d) => sum + d.hours, 0);
    const totalAssets = mockDatasets.reduce((sum, d) => sum + d.assetCount, 0);

    return (
        <div className="admin-datasets">
            <PageHeader
                title="Datasets"
                subtitle="Dataset registry and management"
                actions={<Button variant="primary">Create Dataset</Button>}
            />

            <div className="kpi-row">
                <KPICard label="Total Datasets" value={mockDatasets.length} />
                <KPICard label="Published" value={mockDatasets.filter(d => d.status === 'PUBLISHED').length} />
                <KPICard label="Total Hours" value={`${(totalHours / 1000).toFixed(1)}K`} />
                <KPICard label="Total Assets" value={totalAssets.toLocaleString()} />
                <KPICard label="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} />
            </div>

            <div className="dataset-toolbar">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <DataTable
                columns={columns}
                data={filteredDatasets}
                onRowClick={(ds) => setSelectedDataset(ds)}
            />

            {selectedDataset && (
                <div className="dataset-drawer">
                    <div className="drawer-overlay" onClick={() => setSelectedDataset(null)} />
                    <div className="drawer-content">
                        <div className="drawer-header">
                            <h2>{selectedDataset.name}</h2>
                            <button className="close-btn" onClick={() => setSelectedDataset(null)}>×</button>
                        </div>
                        <div className="drawer-body">
                            <div className="detail-section">
                                <h3>Overview</h3>
                                <DetailRow label="Dataset ID" value={selectedDataset.id} mono />
                                <DetailRow label="Vertical" value={selectedDataset.vertical} />
                                <DetailRow label="Modalities" value={selectedDataset.modality.join(', ')} />
                                <DetailRow label="License" value={selectedDataset.license} />
                                <DetailRow label="Status" value={selectedDataset.status} />
                            </div>
                            <div className="detail-section">
                                <h3>Metrics</h3>
                                <DetailRow label="Total Hours" value={`${selectedDataset.hours.toLocaleString()} hrs`} />
                                <DetailRow label="Asset Count" value={selectedDataset.assetCount.toLocaleString()} />
                                <DetailRow label="Revenue" value={`$${selectedDataset.revenue.toLocaleString()}`} />
                                <DetailRow label="Active Clients" value={selectedDataset.clients.toString()} />
                            </div>
                            <div className="detail-section">
                                <h3>Actions</h3>
                                <div className="action-buttons">
                                    {selectedDataset.status === 'DRAFT' && <Button variant="primary">Publish Dataset</Button>}
                                    <Button variant="secondary">Clone Dataset</Button>
                                    <Button variant="secondary">View Assets</Button>
                                    <Button variant="ghost" style={{ color: '#ef4444' }}>Unpublish</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .admin-datasets { max-width: 1400px; }
        .kpi-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .dataset-toolbar { margin-bottom: 16px; }
        .dataset-drawer { position: fixed; inset: 0; z-index: 100; }
        .drawer-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
        .drawer-content {
          position: absolute; right: 0; top: 0; bottom: 0; width: 450px;
          background: #141414; border-left: 1px solid #262626;
          display: flex; flex-direction: column;
        }
        .drawer-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px; border-bottom: 1px solid #262626;
        }
        .drawer-header h2 { margin: 0; font-size: 16px; }
        .close-btn { background: none; border: none; color: #a3a3a3; font-size: 24px; cursor: pointer; }
        .drawer-body { flex: 1; overflow-y: auto; padding: 20px; }
        .detail-section { margin-bottom: 24px; }
        .detail-section h3 { font-size: 12px; color: #a3a3a3; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .action-buttons { display: flex; flex-direction: column; gap: 8px; }
      `}</style>
        </div>
    );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="detail-row">
            <span className="detail-label">{label}</span>
            <span className={`detail-value ${mono ? 'mono' : ''}`}>{value}</span>
            <style>{`
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #262626; }
        .detail-label { color: #a3a3a3; font-size: 13px; }
        .detail-value { color: #fafafa; font-size: 13px; }
        .detail-value.mono { font-family: monospace; }
      `}</style>
        </div>
    );
}

export default AdminDatasets;
