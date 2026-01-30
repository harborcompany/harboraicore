import React from 'react';
import { PageHeader, DataTable, StatusBadge, ChartCard, KPICard } from '../../components/admin/AdminComponents';

interface Deal {
    id: string;
    client: string;
    datasets: string[];
    pricingModel: string;
    termMonths: number;
    usageLimits: string;
    slaTier: string;
    totalValue: number;
    status: string;
    startDate: string;
}

const mockDeals: Deal[] = [
    { id: 'deal_001', client: 'Waymo', datasets: ['Urban Driving v3'], pricingModel: 'usage', termMonths: 24, usageLimits: 'Unlimited', slaTier: 'enterprise', totalValue: 450000, status: 'active', startDate: '2024-03-01' },
    { id: 'deal_002', client: 'Spotify', datasets: ['Podcast Conversations'], pricingModel: 'subscription', termMonths: 12, usageLimits: '10K queries/mo', slaTier: 'premium', totalValue: 120000, status: 'active', startDate: '2024-06-15' },
    { id: 'deal_003', client: 'Unity', datasets: ['Gaming Voice Commands'], pricingModel: 'flat_fee', termMonths: 6, usageLimits: 'Full access', slaTier: 'standard', totalValue: 75000, status: 'active', startDate: '2024-09-01' },
    { id: 'deal_004', client: 'Calm App', datasets: ['Therapy Sessions'], pricingModel: 'revenue_share', termMonths: 36, usageLimits: 'API + Download', slaTier: 'premium', totalValue: 280000, status: 'active', startDate: '2024-01-15' },
];

export function AdminMarketplace() {
    const totalRevenue = mockDeals.reduce((sum, d) => sum + d.totalValue, 0);
    const avgDealSize = totalRevenue / mockDeals.length;

    const columns = [
        { key: 'client', label: 'Client', sortable: true },
        { key: 'datasets', label: 'Dataset(s)', render: (d: Deal) => d.datasets.join(', ') },
        { key: 'pricingModel', label: 'Pricing', render: (d: Deal) => <StatusBadge label={d.pricingModel.replace('_', ' ')} variant="info" /> },
        { key: 'termMonths', label: 'Term', render: (d: Deal) => `${d.termMonths} mo` },
        { key: 'usageLimits', label: 'Usage Limits' },
        { key: 'slaTier', label: 'SLA', render: (d: Deal) => <StatusBadge label={d.slaTier} variant={d.slaTier === 'enterprise' ? 'success' : 'neutral'} /> },
        { key: 'totalValue', label: 'Value', sortable: true, render: (d: Deal) => `$${(d.totalValue / 1000).toFixed(0)}K` },
        { key: 'status', label: 'Status', render: (d: Deal) => <StatusBadge label={d.status} variant="success" /> },
    ];

    return (
        <div className="admin-marketplace">
            <PageHeader title="Marketplace & Sales" subtitle="Active deals and revenue attribution" />

            <div className="kpi-row">
                <KPICard label="Active Deals" value={mockDeals.length} />
                <KPICard label="Total Contract Value" value={`$${(totalRevenue / 1000).toFixed(0)}K`} />
                <KPICard label="Avg Deal Size" value={`$${(avgDealSize / 1000).toFixed(0)}K`} />
                <KPICard label="Enterprise Clients" value={mockDeals.filter(d => d.slaTier === 'enterprise').length} />
            </div>

            <ChartCard title="Revenue by Dataset">
                <div className="revenue-breakdown">
                    {[
                        { dataset: 'Urban Driving v3', revenue: 245000, color: '#3b82f6' },
                        { dataset: 'Therapy Sessions', revenue: 156000, color: '#22c55e' },
                        { dataset: 'Podcast Conversations', revenue: 127000, color: '#f59e0b' },
                        { dataset: 'Gaming Voice', revenue: 89000, color: '#8b5cf6' },
                    ].map(item => (
                        <div key={item.dataset} className="revenue-row">
                            <span className="dataset-name">{item.dataset}</span>
                            <div className="revenue-bar-track">
                                <div className="revenue-bar" style={{ width: `${(item.revenue / 245000) * 100}%`, background: item.color }} />
                            </div>
                            <span className="revenue-amount">${(item.revenue / 1000).toFixed(0)}K</span>
                        </div>
                    ))}
                </div>
            </ChartCard>

            <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 14, marginBottom: 16 }}>Active Deals</h3>
                <DataTable columns={columns} data={mockDeals} />
            </div>

            <style>{`
        .admin-marketplace { max-width: 1400px; }
        .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .revenue-breakdown { display: flex; flex-direction: column; gap: 12px; }
        .revenue-row { display: flex; align-items: center; gap: 16px; }
        .dataset-name { width: 180px; font-size: 13px; color: #fafafa; }
        .revenue-bar-track { flex: 1; height: 20px; background: #262626; border-radius: 4px; overflow: hidden; }
        .revenue-bar { height: 100%; border-radius: 4px; }
        .revenue-amount { width: 60px; text-align: right; font-size: 13px; color: #a3a3a3; }
      `}</style>
        </div>
    );
}

export default AdminMarketplace;
