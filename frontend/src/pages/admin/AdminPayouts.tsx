
import React from 'react';
import { DollarSign, Download, Search } from 'lucide-react';
import { Button } from '../../components/admin/AdminComponents';

const AdminPayouts: React.FC = () => {
    // Mock Data
    const payouts = [
        { id: 'pay_1', contributor: 'alex.chen', amount: 50.00, status: 'PAID', date: '2026-02-01', method: 'Stripe' },
        { id: 'pay_2', contributor: 'maria.g', amount: 50.00, status: 'PENDING', date: '-', method: 'PayPal' },
        { id: 'pay_3', contributor: 'john.d', amount: 150.00, status: 'PAID', date: '2026-01-15', method: 'Stripe' },
    ];

    return (
        <div className="p-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Creator Payouts</h1>
                    <p className="text-gray-500">Manage financial transactions for approved contributions.</p>
                </div>
                <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex gap-4">
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Pending Payouts</div>
                        <div className="text-xl font-bold text-white">$50.00</div>
                    </div>
                    <div className="w-px bg-[#262626]"></div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Paid (Feb)</div>
                        <div className="text-xl font-bold text-green-500">$200.00</div>
                    </div>
                </div>
            </header>

            <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#262626] flex justify-between items-center bg-[#0a0a0a]">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search payouts..."
                                className="pl-9 pr-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-sm w-64 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <Button variant="primary">Process Pending Batch</Button>
                </div>
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-[#0a0a0a] border-b border-[#262626] text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Payout ID</th>
                            <th className="px-6 py-3">Contributor</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Method</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 text-right">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                        {payouts.map((pay) => (
                            <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{pay.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{pay.contributor}</td>
                                <td className="px-6 py-4 font-medium text-green-400">${pay.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-gray-400">{pay.method}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${pay.status === 'PAID' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {pay.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{pay.date}</td>
                                <td className="px-6 py-4 text-right">
                                    {pay.status === 'PAID' && (
                                        <button className="text-gray-400 hover:text-white p-1">
                                            <Download size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPayouts;
