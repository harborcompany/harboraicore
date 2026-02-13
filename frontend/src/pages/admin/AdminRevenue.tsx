import React, { useState, useEffect } from 'react';
import { PageHeader, DataTable, Tabs, StatusBadge, ChartCard, KPICard, Button } from '../../components/admin/AdminComponents';
import { analyticsService, type AnalyticsSummary } from '../../services/analyticsService';

interface Payout {
    id: string;
    user: string;
    amount: number;
    method: string;
    status: string;
    availableAt: string;
    requestedAt: string;
}

const mockPayouts: Payout[] = [
    { id: 'pay_001', user: 'alice@studio.com', amount: 4250, method: 'bank', status: 'pending', availableAt: '2025-02-15', requestedAt: '2024-11-15' },
    { id: 'pay_002', user: 'bob@creator.net', amount: 1890, method: 'stripe', status: 'paid', availableAt: '2024-11-01', requestedAt: '2024-11-02' },
    { id: 'pay_003', user: 'carol@media.io', amount: 720, method: 'crypto', status: 'pending', availableAt: '2025-01-20', requestedAt: '2024-10-20' },
    { id: 'pay_004', user: 'eve@content.tv', amount: 3100, method: 'bank', status: 'paid', availableAt: '2024-10-15', requestedAt: '2024-10-16' },
];

export function AdminRevenue() {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState<AnalyticsSummary | null>(null);

    useEffect(() => {
        setStats(analyticsService.getSummary());
    }, []);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'payouts', label: 'Payouts', count: mockPayouts.filter(p => p.status === 'pending').length },
        { id: 'ledger', label: 'Ledger' },
    ];

    const payoutColumns = [
        { key: 'user', label: 'Contributor' },
        { key: 'amount', label: 'Amount', sortable: true, render: (p: Payout) => `$${p.amount.toLocaleString()}` },
        { key: 'method', label: 'Method', render: (p: Payout) => <StatusBadge label={p.method} variant="info" /> },
        { key: 'status', label: 'Status', render: (p: Payout) => <StatusBadge label={p.status} variant={p.status === 'paid' ? 'success' : 'warning'} /> },
        { key: 'availableAt', label: 'Available Date' },
        { key: 'actions', label: '', render: (p: Payout) => p.status === 'pending' ? <Button variant="secondary" size="sm">Execute</Button> : null },
    ];

    if (!stats) return null;

    return (
        <div className="admin-revenue p-6">
            <PageHeader title="Revenue & Payouts" subtitle="Financial overview and contributor payments" />

            <div className="kpi-row grid grid-cols-5 gap-4 mb-6">
                <KPICard label="Revenue (MTD)" value={`$${(stats.revenueMTD / 1000).toFixed(1)}K`} change={12.4} trend="up" />
                <KPICard label="Revenue (QTD)" value={`$${(stats.revenueQTD / 1000).toFixed(1)}K`} change={8.2} trend="up" />
                <KPICard label="Total Revenue" value={`$${(stats.revenueTotal / 1000000).toFixed(1)}M`} />
                <KPICard label="Pending Payouts" value={`$${(stats.pendingPayouts / 1000).toFixed(1)}K`} />
                <KPICard label="Avg Margin" value={`${stats.averageMargin.toFixed(0)}%`} />
            </div>

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'overview' && (
                <div className="revenue-charts mt-6">
                    <ChartCard title="Monthly Revenue Waterfall">
                        <div className="waterfall flex items-end justify-between h-[200px] gap-2 px-4">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                                <div key={month} className="waterfall-bar flex flex-col items-center gap-2">
                                    <div
                                        className="bar w-10 rounded-t bg-blue-600 transition-all"
                                        style={{ height: month === 'Feb' ? '140px' : month === 'Jan' ? '120px' : '40px' }}
                                    />
                                    <span className="month-label text-[11px] text-[#a3a3a3]">{month}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    <div className="revenue-breakdown mt-6 grid grid-cols-2 gap-4">
                        <ChartCard title="Revenue by Product">
                            <div className="py-4">
                                {[
                                    { label: 'Dataset Licensing', value: stats.revenueBySource.dataset_license, color: '#3b82f6' },
                                    { label: 'API Usage', value: stats.revenueBySource.api_usage, color: '#22c55e' },
                                    { label: 'Ads Platform', value: stats.revenueBySource.ads_platform, color: '#f59e0b' },
                                    { label: 'Enterprise', value: stats.revenueBySource.enterprise, color: '#8b5cf6' },
                                ].map(item => {
                                    const pct = ((item.value / stats.revenueTotal) * 100).toFixed(0);
                                    return (
                                        <div key={item.label} className="flex items-center gap-3 mb-3">
                                            <div className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
                                            <span className="flex-1 text-sm text-stone-300">{item.label}</span>
                                            <span className="text-sm text-stone-500">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </ChartCard>

                        <ChartCard title="Payout Forecast">
                            <div className="py-4">
                                {stats.payoutForecast.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-2 border-b border-[#262626] last:border-0">
                                        <span className="text-sm text-stone-300">{item.date}</span>
                                        <span className="text-sm text-stone-500">${item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                {stats.payoutForecast.length === 0 && (
                                    <p className="text-sm text-stone-600 text-center py-4">No pending forecasts</p>
                                )}
                            </div>
                        </ChartCard>
                    </div>
                </div>
            )}

            {activeTab === 'payouts' && (
                <div style={{ marginTop: 24 }}>
                    <DataTable columns={payoutColumns} data={mockPayouts} />
                </div>
            )}

            {activeTab === 'ledger' && (
                <div style={{ marginTop: 24, background: '#141414', border: '1px solid #262626', borderRadius: 8, padding: 40, textAlign: 'center', color: '#525252' }}>
                    Full ledger view coming soon...
                </div>
            )}

            <style>{`
        .admin-revenue { max-width: 1400px; }
        .kpi-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
        .waterfall { display: flex; align-items: flex-end; justify-content: space-between; height: 200px; gap: 8px; }
        .waterfall-bar { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .bar { width: 40px; border-radius: 4px 4px 0 0; }
        .month-label { font-size: 11px; color: #a3a3a3; }
      `}</style>
        </div>
    );
}

export default AdminRevenue;
