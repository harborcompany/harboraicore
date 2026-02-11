
import React from 'react';
import { Search, Activity } from 'lucide-react';

const AdminLogs: React.FC = () => {
    // Mock Data
    const logs = [
        { id: 'log_1', action: 'REVIEW_SUBMITTED', actor: 'Admin_Sarah', target: 'sub_8x92', timestamp: '2026-02-07 14:30:22', details: 'approved' },
        { id: 'log_2', action: 'DATASET_LOCKED', actor: 'Admin_Sarah', target: 'd_lego_v1', timestamp: '2026-02-07 12:15:00', details: 'v1.0.0 formulated' },
        { id: 'log_3', action: 'LOGIN', actor: 'alex.chen', target: '-', timestamp: '2026-02-07 11:45:10', details: 'ip: 192.168.1.1' },
    ];

    return (
        <div className="p-6">
            <header className="mb-8">
                <h1 className="text-2xl font-semibold text-white">System Audit Logs</h1>
                <p className="text-gray-500">Immutable record of all system actions and events.</p>
            </header>

            <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#262626] bg-[#0a0a0a]">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Filter logs..."
                                className="pl-9 pr-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-sm w-96 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
                <table className="w-full text-left text-sm text-gray-300 font-mono">
                    <thead className="bg-[#0a0a0a] border-b border-[#262626] text-gray-500 font-medium font-sans">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Actor</th>
                            <th className="px-6 py-3">Target ID</th>
                            <th className="px-6 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-3 text-gray-500">{log.timestamp}</td>
                                <td className="px-6 py-3 text-blue-400">{log.action}</td>
                                <td className="px-6 py-3 text-white">{log.actor}</td>
                                <td className="px-6 py-3 text-gray-500">{log.target}</td>
                                <td className="px-6 py-3 text-gray-400">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLogs;
