import React, { useState, useEffect } from 'react';
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
    videos?: any[]; // Raw backend videos
}

export function AdminDatasets() {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedDataset, setSelectedDataset] = useState<any | null>(null);

    // Fetch Datasets from API
    useEffect(() => {
        fetchDatasets();
    }, []);

    const fetchDatasets = async () => {
        try {
            const res = await fetch('/api/lab/datasets');
            const json = await res.json();
            // Map Prisma model to UI model
            const mapped = json.data.map((d: any) => ({
                id: d.id,
                name: d.title,
                vertical: d.category.toUpperCase(),
                modality: ['video', 'annotation'],
                hours: d.videos.reduce((acc: number, v: any) => acc + (v.duration || 0), 0),
                assetCount: d.videos.length,
                license: 'COMMERCIAL',
                status: d.isPublic ? 'PUBLISHED' : 'DRAFT',
                revenue: d.price * 10, // Mock revenue logic
                clients: Math.floor(Math.random() * 20),
                createdAt: new Date(d.createdAt).toISOString().split('T')[0],
                videos: d.videos // Keep raw videos for details
            }));
            setDatasets(mapped);
        } catch (e) {
            console.error("Failed to fetch datasets", e);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessVideo = async () => {
        if (!selectedDataset) return;

        try {
            await fetch('/api/lab/process-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    datasetId: selectedDataset.id,
                    filename: `upload_${Date.now()}.mp4`,
                    duration: 300 // 5 minutes
                })
            });
            alert("Started Processing 5-minute video! Check back in a few seconds.");
            fetchDatasets(); // Refresh
            setSelectedDataset(null);
        } catch (e) {
            alert("Failed to start processing");
        }
    };

    const tabs = [
        { id: 'all', label: 'All', count: datasets.length },
        { id: 'published', label: 'Published', count: datasets.filter(d => d.status === 'PUBLISHED').length },
        { id: 'draft', label: 'Draft', count: datasets.filter(d => d.status === 'DRAFT').length },
    ];

    const columns = [
        {
            key: 'name',
            label: 'Dataset',
            render: (ds: Dataset) => (
                <div>
                    <span style={{ color: '#fafafa' }}>{ds.name}</span>
                    <span style={{ display: 'block', fontSize: 11, color: '#525252', fontFamily: 'monospace' }}>{ds.id.substring(0, 8)}</span>
                </div>
            )
        },
        {
            key: 'vertical',
            label: 'Vertical',
            render: (ds: Dataset) => <StatusBadge label={ds.vertical} variant="info" />
        },
        {
            key: 'assetCount',
            label: 'Labeled Videos',
            render: (ds: any) => (
                <div className="flex gap-2 items-center">
                    <span>{ds.assetCount}</span>
                    {ds.videos?.some((v: any) => v.status === 'PROCESSING') && (
                        <span className="text-xs text-blue-400 animate-pulse">Processing...</span>
                    )}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (ds: Dataset) => (
                <StatusBadge
                    label={ds.status}
                    variant={ds.status === 'PUBLISHED' ? 'success' : 'neutral'}
                />
            )
        }
    ];

    const filteredDatasets = datasets.filter(ds => {
        if (activeTab === 'published') return ds.status === 'PUBLISHED';
        if (activeTab === 'draft') return ds.status === 'DRAFT';
        return true;
    });

    const totalRevenue = datasets.reduce((sum, d) => sum + d.revenue, 0);
    const totalHours = datasets.reduce((sum, d) => sum + d.hours, 0);
    const totalAssets = datasets.reduce((sum, d) => sum + d.assetCount, 0);

    return (
        <div className="admin-datasets">
            <PageHeader
                title="Lab Datasets"
                subtitle="Data Labeling Pipeline & Registry"
                actions={<Button variant="primary" onClick={() => fetchDatasets()}>Refresh</Button>}
            />

            <div className="kpi-row">
                <KPICard label="Total Datasets" value={datasets.length} />
                <KPICard label="Published" value={datasets.filter(d => d.status === 'PUBLISHED').length} />
                <KPICard label="Total Seconds" value={totalHours.toLocaleString()} />
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
                                <DetailRow label="Status" value={selectedDataset.status} />
                            </div>
                            <div className="detail-section">
                                <h3>Pipeline Controls</h3>
                                <div className="p-4 bg-gray-900 rounded border border-gray-800 mb-4">
                                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Simulate Data Ingestion</h4>
                                    <p className="text-xs text-gray-500 mb-3">Upload a 5-minute video for mock VLM analysis.</p>
                                    <Button variant="primary" onClick={handleProcessVideo}>
                                        Upload & Label Video (5m)
                                    </Button>
                                </div>
                            </div>
                            <div className="detail-section">
                                <h3>Metrics</h3>
                                <DetailRow label="Total Seconds" value={`${selectedDataset.hours}`} />
                                <DetailRow label="Labeled Videos" value={selectedDataset.assetCount.toString()} />
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
