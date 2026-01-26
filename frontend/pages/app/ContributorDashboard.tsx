import React, { useState } from 'react';
import {
    Wallet,
    Video,
    CheckCircle,
    Clock,
    ArrowUpRight,
    ShieldCheck,
    BarChart3,
    Camera,
    Plus
} from 'lucide-react';

const ContributorDashboard: React.FC = () => {
    const [earnings] = useState({
        total: 1250.45,
        pending: 145.20,
        currency: 'USDT'
    });

    const [sessions] = useState([
        { id: 'SESS-001', date: '2026-01-20', assets: 45, status: 'verified', payout: 12.50 },
        { id: 'SESS-002', date: '2026-01-21', assets: 12, status: 'processing', payout: 0 },
        { id: 'SESS-003', date: '2026-01-22', assets: 8, status: 'flagged', payout: 0 },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent italic tracking-tight">
                        Contributor Portal
                    </h1>
                    <p className="text-gray-400 mt-1">Monetize your world. Supply the models.</p>
                </div>
                <button className="px-6 py-3 bg-white text-black font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    <Camera className="w-5 h-5" />
                    NEW CAPTURE
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-16 h-16" />
                    </div>
                    <p className="text-sm text-gray-500 font-mono">TOTAL EARNINGS</p>
                    <h2 className="text-3xl font-bold mt-2 font-mono">
                        ${earnings.total.toLocaleString()} <span className="text-sm text-gray-500">{earnings.currency}</span>
                    </h2>
                    <div className="flex items-center gap-1 text-green-500 text-sm mt-2 font-mono">
                        <ArrowUpRight className="w-4 h-4" />
                        +12.4% vs last mo
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Video className="w-16 h-16" />
                    </div>
                    <p className="text-sm text-gray-500 font-mono">ASSETS CONTRIBUTED</p>
                    <h2 className="text-3xl font-bold mt-2 font-mono">4,129</h2>
                    <p className="text-sm text-gray-500 mt-2 font-mono">89% verification rate</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck className="w-16 h-16" />
                    </div>
                    <p className="text-sm text-gray-500 font-mono">KYC STATUS</p>
                    <div className="flex items-center gap-2 mt-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <h2 className="text-xl font-bold font-mono">VERIFIED</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 font-mono">Tier 2: $5,000 limit</p>
                </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        Recent Capture Sessions
                    </h3>
                    <button className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-zinc-700">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-xs font-mono uppercase">
                                <th className="px-6 py-4 font-normal">Session ID</th>
                                <th className="px-6 py-4 font-normal">Timestamp</th>
                                <th className="px-6 py-4 font-normal">Item Count</th>
                                <th className="px-6 py-4 font-normal">Status</th>
                                <th className="px-6 py-4 font-normal text-right">Payout</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {sessions.map((s) => (
                                <tr key={s.id} className="hover:bg-zinc-800/50 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4 font-mono text-sm">{s.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{s.date}</td>
                                    <td className="px-6 py-4 text-sm font-mono">{s.assets}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${s.status === 'verified' ? 'bg-green-500/10 text-green-500' :
                                                s.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-sm">
                                        {s.payout > 0 ? `+$${s.payout.toFixed(2)}` : '--'}
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

export default ContributorDashboard;
