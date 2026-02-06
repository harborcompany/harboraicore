import React, { useEffect, useState } from 'react';
import { KPICard, ChartCard, PageHeader, StatusBadge, DataTable } from '../../components/admin/AdminComponents';

interface KPIs {
    totalActiveUsers: number;
    uploads24h: number;
    uploads7d: number;
    approvalRate: string;
    rejectionRate: string;
    activeDatasets: number;
    pendingPayoutLiability: number;
}

interface SystemSignal {
    name: string;
    status: 'healthy' | 'warning' | 'critical';
    value: string;
}

export function AdminOverview() {
    const [kpis, setKpis] = useState<KPIs | null>(null);
    const [loading, setLoading] = useState(true);

    // Mock data - replace with API calls
    useEffect(() => {
        setTimeout(() => {
            setKpis({
                totalActiveUsers: 12847,
                uploads24h: 3421,
                uploads7d: 24893,
                approvalRate: '87.3',
                rejectionRate: '12.7',
                activeDatasets: 47,
                pendingPayoutLiability: 127500
            });
            setLoading(false);
        }, 500);
    }, []);

    const systemSignals: SystemSignal[] = [
        { name: 'Ingestion Latency', status: 'healthy', value: '124ms' },
        { name: 'Annotation Backlog', status: 'warning', value: '2,341 items' },
        { name: 'Audit Failure Rate', status: 'healthy', value: '0.4%' },
        { name: 'API Response Time', status: 'healthy', value: '89ms' },
    ];

    const recentActivity = [
        { id: '1', type: 'upload', user: 'alice@example.com', asset: 'video_001.mp4', time: '2 min ago' },
        { id: '2', type: 'approved', user: 'bob@example.com', asset: 'audio_session_42.wav', time: '5 min ago' },
        { id: '3', type: 'dataset', user: 'admin', asset: 'Urban Driving v3', time: '12 min ago' },
        { id: '4', type: 'payout', user: 'charlie@example.com', asset: '$1,250.00', time: '18 min ago' },
        { id: '5', type: 'rejected', user: 'dave@example.com', asset: 'image_batch_99.zip', time: '24 min ago' },
    ];

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-overview">
            <PageHeader
                title="Overview"
                subtitle="Platform health and key metrics"
            />

            {/* KPI Row */}
            <div className="kpi-grid">
                <KPICard label="Active Users (30d)" value={kpis?.totalActiveUsers || 0} change={12.3} trend="up" />
                <KPICard label="Uploads (24h)" value={kpis?.uploads24h || 0} change={8.1} trend="up" />
                <KPICard label="Approval Rate" value={kpis?.approvalRate || '0'} suffix="%" change={2.1} trend="up" />
                <KPICard label="Active Datasets" value={kpis?.activeDatasets || 0} />
                <KPICard label="Revenue (MTD)" value="$847K" change={15.4} trend="up" />
                <KPICard label="Payout Liability" value={kpis?.pendingPayoutLiability || 0} prefix="$" />
            </div>

            {/* Charts Row */}
            <div className="charts-grid">
                <ChartCard title="Upload Volume" subtitle="Last 30 days">
                    <div className="chart-placeholder">
                        <UploadVolumeChart />
                    </div>
                </ChartCard>

                <ChartCard title="Content by Type">
                    <div className="chart-placeholder">
                        <ContentTypeChart />
                    </div>
                </ChartCard>
            </div>

            {/* Bottom Row */}
            <div className="bottom-grid">
                {/* System Signals */}
                <ChartCard title="System Signals">
                    <div className="system-signals">
                        {systemSignals.map((signal) => (
                            <div key={signal.name} className="signal-row">
                                <div className="signal-info">
                                    <span className={`signal-dot ${signal.status}`}></span>
                                    <span className="signal-name">{signal.name}</span>
                                </div>
                                <span className="signal-value">{signal.value}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                {/* Recent Activity */}
                <ChartCard title="Recent Activity">
                    <div className="activity-list">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="activity-row">
                                <StatusBadge
                                    label={item.type}
                                    variant={
                                        item.type === 'approved' ? 'success' :
                                            item.type === 'rejected' ? 'error' :
                                                item.type === 'payout' ? 'info' : 'neutral'
                                    }
                                />
                                <span className="activity-user">{item.user}</span>
                                <span className="activity-asset">{item.asset}</span>
                                <span className="activity-time">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                {/* Funnel */}
                <ChartCard title="Content Funnel">
                    <div className="funnel">
                        <FunnelChart />
                    </div>
                </ChartCard>
            </div>

            <style>{`
        .admin-overview {
          max-width: 1400px;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          gap: 16px;
        }
        .chart-placeholder {
          height: 200px;
        }
        .system-signals {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .signal-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .signal-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .signal-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .signal-dot.healthy { background: #22c55e; }
        .signal-dot.warning { background: #f59e0b; }
        .signal-dot.critical { background: #ef4444; }
        .signal-name { font-size: 13px; color: #fafafa; }
        .signal-value { font-size: 13px; color: #a3a3a3; }
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .activity-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }
        .activity-user { color: #fafafa; flex: 1; }
        .activity-asset { color: #a3a3a3; flex: 1; }
        .activity-time { color: #525252; font-size: 12px; }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: #a3a3a3;
        }
        @media (max-width: 1200px) {
          .kpi-grid { grid-template-columns: repeat(3, 1fr); }
          .charts-grid { grid-template-columns: 1fr; }
          .bottom-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
}

// Simple SVG Charts (no external dependencies)
function UploadVolumeChart() {
    const data = [45, 52, 38, 65, 71, 55, 80, 62, 73, 68, 85, 90, 78, 82];
    const max = Math.max(...data);
    const width = 100;
    const height = 180;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" preserveAspectRatio="none">
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill="url(#gradient)"
            />
            <polyline
                points={points}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
            />
            <style>{`.line-chart { width: 100%; height: 100%; }`}</style>
        </svg>
    );
}

function ContentTypeChart() {
    const data = [
        { label: 'Video', value: 45, color: '#3b82f6' },
        { label: 'Audio', value: 35, color: '#22c55e' },
        { label: 'Image', value: 20, color: '#f59e0b' },
    ];

    return (
        <div className="bar-chart">
            {data.map((item) => (
                <div key={item.label} className="bar-row">
                    <span className="bar-label">{item.label}</span>
                    <div className="bar-track">
                        <div
                            className="bar-fill"
                            style={{ width: `${item.value}%`, background: item.color }}
                        />
                    </div>
                    <span className="bar-value">{item.value}%</span>
                </div>
            ))}
            <style>{`
        .bar-chart { display: flex; flex-direction: column; gap: 16px; padding-top: 20px; }
        .bar-row { display: flex; align-items: center; gap: 12px; }
        .bar-label { width: 60px; font-size: 13px; color: #a3a3a3; }
        .bar-track { flex: 1; height: 24px; background: #262626; border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
        .bar-value { width: 40px; text-align: right; font-size: 13px; color: #fafafa; }
      `}</style>
        </div>
    );
}

function FunnelChart() {
    const stages = [
        { label: 'Uploaded', value: 10000, color: '#3b82f6' },
        { label: 'Scanned', value: 9200, color: '#6366f1' },
        { label: 'Approved', value: 8700, color: '#8b5cf6' },
        { label: 'Monetized', value: 4500, color: '#22c55e' },
    ];
    const max = stages[0].value;

    return (
        <div className="funnel-chart">
            {stages.map((stage, i) => (
                <div key={stage.label} className="funnel-stage">
                    <div
                        className="funnel-bar"
                        style={{
                            width: `${(stage.value / max) * 100}%`,
                            background: stage.color
                        }}
                    >
                        <span className="funnel-value">{(stage.value / 1000).toFixed(1)}K</span>
                    </div>
                    <span className="funnel-label">{stage.label}</span>
                </div>
            ))}
            <style>{`
        .funnel-chart { display: flex; flex-direction: column; gap: 8px; }
        .funnel-stage { display: flex; align-items: center; gap: 12px; }
        .funnel-bar { 
          height: 32px; 
          border-radius: 4px; 
          display: flex; 
          align-items: center; 
          justify-content: flex-end;
          padding-right: 12px;
          min-width: 60px;
        }
        .funnel-value { font-size: 12px; color: #fff; font-weight: 500; }
        .funnel-label { font-size: 12px; color: #a3a3a3; }
      `}</style>
        </div>
    );
}

export default AdminOverview;
