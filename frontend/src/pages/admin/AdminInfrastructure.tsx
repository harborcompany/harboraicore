import React from 'react';
import { PageHeader, ChartCard, KPICard, DataTable, StatusBadge } from '../../components/admin/AdminComponents';

interface APIEndpoint {
    id: string;
    endpoint: string;
    method: string;
    requests7d: number;
    avgLatency: number;
    errorRate: number;
}

const mockEndpoints: APIEndpoint[] = [
    { id: 'ep_001', endpoint: '/datasets/query', method: 'POST', requests7d: 284500, avgLatency: 124, errorRate: 0.02 },
    { id: 'ep_002', endpoint: '/rag/query', method: 'POST', requests7d: 156000, avgLatency: 890, errorRate: 0.15 },
    { id: 'ep_003', endpoint: '/assets/upload', method: 'POST', requests7d: 45200, avgLatency: 2400, errorRate: 0.08 },
    { id: 'ep_004', endpoint: '/annotation/auto', method: 'POST', requests7d: 38900, avgLatency: 3200, errorRate: 0.05 },
    { id: 'ep_005', endpoint: '/datasets', method: 'GET', requests7d: 128000, avgLatency: 45, errorRate: 0.01 },
];

export function AdminInfrastructure() {
    const columns = [
        { key: 'endpoint', label: 'Endpoint', render: (e: APIEndpoint) => <span style={{ fontFamily: 'monospace' }}>{e.endpoint}</span> },
        { key: 'method', label: 'Method', render: (e: APIEndpoint) => <StatusBadge label={e.method} variant="info" /> },
        { key: 'requests7d', label: 'Requests (7d)', sortable: true, render: (e: APIEndpoint) => e.requests7d.toLocaleString() },
        { key: 'avgLatency', label: 'Avg Latency', render: (e: APIEndpoint) => `${e.avgLatency}ms` },
        {
            key: 'errorRate', label: 'Error Rate', render: (e: APIEndpoint) => (
                <span style={{ color: e.errorRate > 0.1 ? '#ef4444' : e.errorRate > 0.05 ? '#f59e0b' : '#22c55e' }}>
                    {(e.errorRate * 100).toFixed(2)}%
                </span>
            )
        },
    ];

    return (
        <div className="admin-infrastructure">
            <PageHeader title="Infrastructure & APIs" subtitle="System performance and resource utilization" />

            <div className="kpi-row">
                <KPICard label="API Requests (24h)" value="89.4K" change={5.2} trend="up" />
                <KPICard label="Avg Response Time" value="124ms" />
                <KPICard label="Error Rate" value="0.04%" />
                <KPICard label="Active Connections" value="1,247" />
            </div>

            <div className="infra-grid">
                <ChartCard title="API Metrics (7 days)">
                    <DataTable columns={columns} data={mockEndpoints} />
                </ChartCard>

                <ChartCard title="Storage Metrics">
                    <div className="storage-stats">
                        <div className="storage-row">
                            <span className="storage-label">Total Storage</span>
                            <span className="storage-value">847 TB</span>
                        </div>
                        <div className="storage-row">
                            <span className="storage-label">Hot Storage</span>
                            <span className="storage-value">124 TB</span>
                        </div>
                        <div className="storage-row">
                            <span className="storage-label">Cold Storage</span>
                            <span className="storage-value">723 TB</span>
                        </div>
                        <div className="storage-row">
                            <span className="storage-label">Growth (30d)</span>
                            <span className="storage-value" style={{ color: '#22c55e' }}>+12.4 TB</span>
                        </div>
                        <div className="storage-row">
                            <span className="storage-label">Cost per TB</span>
                            <span className="storage-value">$18.50</span>
                        </div>
                        <div className="storage-row">
                            <span className="storage-label">Total Hours Stored</span>
                            <span className="storage-value">26,800 hrs</span>
                        </div>
                    </div>
                </ChartCard>

                <ChartCard title="System Status">
                    <div className="system-status">
                        {[
                            { service: 'API Gateway', status: 'healthy' },
                            { service: 'Media Ingestion', status: 'healthy' },
                            { service: 'Annotation Pipeline', status: 'healthy' },
                            { service: 'RAG Engine', status: 'degraded' },
                            { service: 'Payout Service', status: 'healthy' },
                            { service: 'n8n Automation', status: 'healthy' },
                        ].map(s => (
                            <div key={s.service} className="status-row">
                                <span className={`status-dot ${s.status}`} />
                                <span className="service-name">{s.service}</span>
                                <StatusBadge label={s.status} variant={s.status === 'healthy' ? 'success' : 'warning'} />
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            <style>{`
        .admin-infrastructure { max-width: 1400px; }
        .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .infra-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
        .storage-stats, .system-status { display: flex; flex-direction: column; gap: 12px; }
        .storage-row, .status-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #262626; }
        .storage-label, .service-name { font-size: 13px; color: #a3a3a3; }
        .storage-value { font-size: 13px; color: #fafafa; font-weight: 500; }
        .status-row { gap: 12px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-dot.healthy { background: #22c55e; }
        .status-dot.degraded { background: #f59e0b; }
        .status-dot.down { background: #ef4444; }
        .service-name { flex: 1; }
      `}</style>
        </div>
    );
}

export default AdminInfrastructure;
