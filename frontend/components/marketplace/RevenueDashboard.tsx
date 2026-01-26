import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Download, ExternalLink } from 'lucide-react';
import { DatasetRevenueLedger } from '../../types';

// Mock Data for Demo
const MOCK_LEDGER: DatasetRevenueLedger[] = [
    { id: 'txn_01', dataset_id: 'ds_urban_cctv', transaction_date: '2023-10-01', transaction_type: 'purchase', amount_usd: 1500, buyer_name: 'AutoDrive Inc.', status: 'cleared' },
    { id: 'txn_02', dataset_id: 'ds_medical_xray', transaction_date: '2023-10-05', transaction_type: 'subscription_fee', amount_usd: 500, buyer_name: 'HealthAI Labs', status: 'cleared' },
    { id: 'txn_03', dataset_id: 'ds_urban_cctv', transaction_date: '2023-10-12', transaction_type: 'usage', amount_usd: 120.50, buyer_name: 'SmartCity Gov', status: 'cleared' },
    { id: 'txn_04', dataset_id: 'ds_voice_synt', transaction_date: '2023-10-15', transaction_type: 'purchase', amount_usd: 2200, buyer_name: 'MediaGen Corp', status: 'pending' },
];

const MOCK_CHART_DATA = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
];

const RevenueDashboard: React.FC = () => {
    const [ledger, setLedger] = useState<DatasetRevenueLedger[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setLedger(MOCK_LEDGER);
            setIsLoading(false);
        }, 800);
    }, []);

    const totalRevenue = ledger.reduce((acc, curr) => acc + (curr.status === 'cleared' ? curr.amount_usd : 0), 0);
    const pendingRevenue = ledger.reduce((acc, curr) => acc + (curr.status === 'pending' ? curr.amount_usd : 0), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-serif font-medium text-[#1A1A1A]">Marketplace & Revenue</h2>
                    <p className="text-stone-500">Track dataset monetization, licensing, and usage metrics.</p>
                </div>
                <div className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded">
                    Updated: Just now
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500 font-medium">Total Revenue</p>
                            <h3 className="text-2xl font-serif font-semibold text-[#1A1A1A]">
                                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500 font-medium">Pending Payouts</p>
                            <h3 className="text-2xl font-serif font-semibold text-[#1A1A1A]">
                                ${pendingRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500 font-medium">Active Contracts</p>
                            <h3 className="text-2xl font-serif font-semibold text-[#1A1A1A]">12</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col: Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <h3 className="text-lg font-medium text-[#1A1A1A] mb-6">Revenue Trends</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_CHART_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#F3F4F6' }}
                                />
                                <Bar dataKey="revenue" fill="#1A1A1A" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Col: Top Performers / Actions */}
                <div className="space-y-6">
                    <div className="bg-[#1A1A1A] text-white p-6 rounded-xl shadow-lg">
                        <h3 className="font-serif text-lg mb-2">Payout Schedule</h3>
                        <p className="text-stone-400 text-sm mb-6">Next payout scheduled for Nov 1st, 2023.</p>
                        <button className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-stone-100 transition-colors">
                            Manage Payout Settings
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <h3 className="font-medium mb-4">Top Performing Datasets</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 pb-3 border-b border-stone-50 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 bg-stone-100 rounded flex items-center justify-center font-serif font-bold text-stone-400">
                                        {i}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-[#1A1A1A] truncate">Urban CCTV Footage</div>
                                        <div className="text-xs text-stone-500">$3,450 revenue</div>
                                    </div>
                                    <div className="text-emerald-600 text-xs font-medium">+12%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-[#1A1A1A]">Transaction Ledger</h3>
                    <button className="flex items-center gap-2 text-stone-500 hover:text-[#1A1A1A] text-sm">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-stone-50 text-stone-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">Dataset</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Buyer</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {ledger.map((txn) => (
                                <tr key={txn.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-3 text-stone-500">{txn.transaction_date}</td>
                                    <td className="px-6 py-3 font-mono text-xs text-stone-400">{txn.id}</td>
                                    <td className="px-6 py-3 text-[#1A1A1A]">{txn.dataset_id}</td>
                                    <td className="px-6 py-3">
                                        <span className={`capitalize px-2 py-0.5 rounded text-xs border ${txn.transaction_type === 'purchase' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                txn.transaction_type === 'usage' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    'bg-stone-100 text-stone-600 border-stone-200'
                                            }`}>
                                            {txn.transaction_type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-stone-600">{txn.buyer_name || '-'}</td>
                                    <td className="px-6 py-3">
                                        {txn.status === 'cleared' ? (
                                            <span className="text-emerald-600 flex items-center gap-1.5 font-medium text-xs"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Cleared</span>
                                        ) : (
                                            <span className="text-amber-600 flex items-center gap-1.5 font-medium text-xs"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Pending</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-right font-medium text-[#1A1A1A]">
                                        ${txn.amount_usd.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RevenueDashboard;
