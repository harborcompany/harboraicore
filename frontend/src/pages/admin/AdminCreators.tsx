
import React, { useState } from 'react';
import { Check, X, Clock, Filter, Search, Star, PlayCircle } from 'lucide-react';
import { PageHeader, StatusBadge, Button } from '../../components/admin/AdminComponents'; // Reuse components if possible

const AdminCreators: React.FC = () => {
    // Mock Data
    const creators = [
        { id: '1', email: 'alex.chen@example.com', dataset: 'LEGO_VIDEO', country: 'US', status: 'pending', appliedAt: '2026-02-06 09:30 AM', reliability: 0.5, videosMonth: 0 },
        { id: '2', email: 'maria.g@example.com', dataset: 'LEGO_VIDEO', country: 'BR', status: 'pending', appliedAt: '2026-02-06 10:15 AM', reliability: 0.5, videosMonth: 0 },
        { id: '3', email: 'john.d@example.com', dataset: 'LEGO_VIDEO', country: 'UK', status: 'approved', appliedAt: '2026-02-05 02:20 PM', reliability: 0.92, videosMonth: 1 },
        { id: '4', email: 'super.builder@example.com', dataset: 'LEGO_VIDEO', country: 'DE', status: 'approved', appliedAt: '2026-01-10', reliability: 0.98, videosMonth: 0 },
    ];

    return (
        <div className="p-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-[#111] dark:text-white">Startups & Creators</h1>
                    <p className="text-gray-500">Manage creator applications and monitor performance.</p>
                </div>
            </header>

            <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#262626] flex justify-between items-center bg-[#0a0a0a]">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search emails..."
                                className="pl-9 pr-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-sm w-64 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-[#0a0a0a] border-b border-[#262626] text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Dataset</th>
                            <th className="px-6 py-3">Reliability</th>
                            <th className="px-6 py-3">Videos (Feb)</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Applied At</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                        {creators.map((creator) => (
                            <tr key={creator.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{creator.email}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        {creator.dataset}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <Star size={14} className={creator.reliability > 0.8 ? "text-yellow-500 fill-yellow-500" : "text-gray-600"} />
                                        <span>{(creator.reliability * 100).toFixed(0)}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <PlayCircle size={14} className="text-gray-500" />
                                        <span>{creator.videosMonth} / 1</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge label={creator.status} variant={creator.status === 'approved' ? 'success' : 'neutral'} />
                                </td>
                                <td className="px-6 py-4 text-gray-500">{creator.appliedAt}</td>
                                <td className="px-6 py-4 text-right">
                                    {creator.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1.5 bg-green-500/10 text-green-500 rounded hover:bg-green-500/20 border border-green-500/20" title="Approve">
                                                <Check size={16} />
                                            </button>
                                            <button className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 border border-red-500/20" title="Reject">
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
        </div>
    );
};

export default AdminCreators;
