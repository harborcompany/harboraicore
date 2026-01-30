import React, { useState } from 'react';
import { PageHeader, DataTable, Tabs, StatusBadge, ChartCard, KPICard, Button } from '../../components/admin/AdminComponents';

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

    return (
        <div className="admin-revenue">
            <PageHeader title="Revenue & Payouts" subtitle="Financial overview and contributor payments" />

            <div className="kpi-row">
                <KPICard label="Revenue (MTD)" value="$284K" change={18.2} trend="up" />
                <KPICard label="Revenue (QTD)" value="$847K" change={24.1} trend="up" />
                <KPICard label="Total Revenue" value="$2.1M" />
                <KPICard label="Pending Payouts" value="$127K" />
                <KPICard label="Avg Margin" value="42%" />
            </div>

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'overview' && (
                <div className="revenue-charts" style={{ marginTop: 24 }}>
                    <ChartCard title="Monthly Revenue Waterfall">
                        <div className="waterfall">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                                <div key={month} className="waterfall-bar">
                                    <div className="bar" style={{ height: `${40 + Math.random() * 100}px`, background: '#3b82f6' }} />
                                    <span className="month-label">{month}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    <div className="revenue-breakdown" style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <ChartCard title="Revenue by Product">
                            <div style={{ padding: '20px 0' }}>
                                {[
                                    { label: 'Dataset Licensing', value: 68, color: '#3b82f6' },
                                    { label: 'API Usage', value: 18, color: '#22c55e' },
                                    { label: 'Ads Platform', value: 10, color: '#f59e0b' },
                                    { label: 'Enterprise', value: 4, color: '#8b5cf6' },
                                ].map(item => (
                                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                                        <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
                                        <span style={{ color: '#a3a3a3', fontSize: 13 }}>{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>

                        <ChartCard title="Payout Forecast">
                            <div style={{ padding: '20px 0' }}>
                                {[
                                    { month: 'Next 30d', amount: 127500 },
                                    { month: '30-60d', amount: 89000 },
                                    { month: '60-90d', amount: 156000 },
                                ].map(item => (
                                    <div key={item.month} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #262626' }}>
                                        <span style={{ fontSize: 13 }}>{item.month}</span>
                                        <span style={{ fontSize: 13, color: '#a3a3a3' }}>${(item.amount / 1000).toFixed(0)}K</span>
                                    </div>
                                ))}
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
