import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowDownLeft, TrendingUp, Download } from 'lucide-react';
import { creatorService, CreatorEarning, CreatorProfile } from '../../services/creatorSubmissionService';

const CreatorEarnings: React.FC = () => {
    const [profile, setProfile] = useState<CreatorProfile | null>(null);
    const [earnings, setEarnings] = useState<CreatorEarning[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            creatorService.getProfile(),
            creatorService.getEarnings(),
        ]).then(([p, e]) => {
            setProfile(p);
            setEarnings(e);
            setLoading(false);
        });
    }, []);

    const formatCents = (cents: number) => `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    if (loading || !profile) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
            </div>
        );
    }

    const totalPaid = earnings.filter(e => e.status === 'paid').reduce((a, e) => a + e.amount, 0);
    const totalPending = earnings.filter(e => e.status === 'pending').reduce((a, e) => a + e.amount, 0);

    // Simple monthly chart data
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const chartData = [800, 1200, 2000, 3700, 5200]; // cents
    const maxVal = Math.max(...chartData);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Earnings</h1>
                <p className="text-gray-500 mt-1">Track your income and manage payouts.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <DollarSign size={20} className="text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earned</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCents(profile.totalEarned)}</p>
                </div>

                <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                            <TrendingUp size={20} className="text-orange-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{formatCents(totalPending)}</p>
                </div>

                <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <ArrowDownLeft size={20} className="text-[#2563EB]" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Out</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCents(totalPaid)}</p>
                </div>
            </div>

            {/* Earnings Chart */}
            <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-6">Monthly Earnings</h2>
                <div className="flex items-end gap-3 h-40">
                    {months.map((month, i) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full relative" style={{ height: '120px' }}>
                                <div
                                    className="absolute bottom-0 w-full bg-[#2563EB] rounded-lg transition-all duration-500 hover:bg-blue-700"
                                    style={{ height: `${(chartData[i] / maxVal) * 100}%`, minHeight: '8px' }}
                                />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Withdraw Section */}
            <div className="bg-[#2563EB] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-blue-100 mb-1">Available to Withdraw</p>
                        <p className="text-3xl font-bold">{formatCents(profile.availableToWithdraw)}</p>
                        <p className="text-xs text-blue-200 mt-2">Minimum withdrawal: $50 • Next payout: {profile.nextPayoutDate}</p>
                    </div>
                    <button
                        disabled={profile.availableToWithdraw < 5000}
                        className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${profile.availableToWithdraw >= 5000
                                ? 'bg-white text-[#2563EB] hover:bg-blue-50'
                                : 'bg-white/20 text-white/60 cursor-not-allowed'
                            }`}
                    >
                        Withdraw Funds
                    </button>
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900">Transaction History</h2>
                    <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 font-medium">
                        <Download size={14} />
                        Export CSV
                    </button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 bg-[#F7F7F8] border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div>Date</div>
                        <div>Submission</div>
                        <div>Amount</div>
                        <div>Status</div>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {earnings.map(earning => (
                            <div key={earning.id} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-6 py-4">
                                <div className="text-sm text-gray-600">
                                    {new Date(earning.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-sm font-medium text-gray-900 truncate">{earning.submissionTitle}</div>
                                <div className="text-sm font-semibold text-gray-900">{formatCents(earning.amount)}</div>
                                <div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${earning.status === 'paid' ? 'text-green-700 bg-green-100' :
                                            earning.status === 'pending' ? 'text-yellow-700 bg-yellow-100' :
                                                'text-blue-700 bg-blue-100'
                                        }`}>
                                        {earning.status === 'paid' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                    First payout occurs within 90 days of approval; subsequent payments are processed every 30 days.
                </p>
            </div>
        </div>
    );
};

export default CreatorEarnings;
