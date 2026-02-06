import React, { useState } from 'react';
import { Check, X, Clock, DollarSign, Filter, Search } from 'lucide-react';

const AdminContributors: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'applications' | 'payments'>('applications');

    // Mock Data for Applications
    const applications = [
        { id: '1', email: 'alex.chen@example.com', dataset: 'LEGO', country: 'US', status: 'pending', appliedAt: '2026-02-06 09:30 AM' },
        { id: '2', email: 'maria.g@example.com', dataset: 'Audio', country: 'BR', status: 'pending', appliedAt: '2026-02-06 10:15 AM' },
        { id: '3', email: 'john.d@example.com', dataset: 'LEGO', country: 'UK', status: 'approved', appliedAt: '2026-02-05 02:20 PM' },
    ];

    // Mock Data for Payments
    const payments = [
        { id: '101', contributor: 'alex.chen@example.com', submission: 'sub_8x92', amount: 15.00, status: 'scheduled', nextPayout: '2026-03-01' },
        { id: '102', contributor: 'sarah.j@example.com', submission: 'sub_7z88', amount: 15.00, status: 'paid', nextPayout: '-' },
    ];

    return (
        <div className="p-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-[#111]">Contributor Management</h1>
                    <p className="text-gray-500">Review applications and manage payouts.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'applications' ? 'bg-[#111] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Applications
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'payments' ? 'bg-[#111] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Payments
                    </button>
                </div>
            </header>

            {activeTab === 'applications' && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search emails..."
                                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                <Filter size={16} /> Filters
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Dataset</th>
                                <th className="px-6 py-3">Country</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Applied At</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#111]">{app.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${app.dataset === 'LEGO' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {app.dataset}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{app.country}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {app.status === 'pending' && <Clock size={12} />}
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{app.appliedAt}</td>
                                    <td className="px-6 py-4 text-right">
                                        {app.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Approve">
                                                    <Check size={16} />
                                                </button>
                                                <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Contributor</th>
                                <th className="px-6 py-3">Submission</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Next Payout</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#111]">{payment.contributor}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{payment.submission}</td>
                                    <td className="px-6 py-4 font-medium text-green-600">${payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {payment.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{payment.nextPayout}</td>
                                    <td className="px-6 py-4 text-right">
                                        {payment.status === 'scheduled' && (
                                            <button className="text-blue-600 hover:underline text-xs font-medium">Process Now</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminContributors;
