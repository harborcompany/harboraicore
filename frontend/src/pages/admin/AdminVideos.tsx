
import React, { useState } from 'react';
import { Play, Check, X, Filter, Search, MoreHorizontal, Clock, AlertCircle } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/admin/AdminComponents';
import { Link } from 'react-router-dom';

const AdminVideos: React.FC = () => {
    // Mock Data
    const videos = [
        { id: 'sub_8x92', contributor: 'alex.chen', filename: 'lego_assembly_12.mp4', duration: '14:20', status: 'PENDING_REVIEW', submittedAt: '2026-02-06 09:30', confidence: 0.98 },
        { id: 'sub_7z88', contributor: 'maria.g', filename: 'audio_session_5.mp3', duration: '08:45', status: 'PROCESSING', submittedAt: '2026-02-06 10:15', confidence: 0.0 },
        { id: 'sub_6v44', contributor: 'john.d', filename: 'lego_build_final.mp4', duration: '22:10', status: 'REVIEWED', submittedAt: '2026-02-05 02:20', confidence: 0.92 },
        { id: 'sub_5t33', contributor: 'super.builder', filename: 'robot_arm_demo.mp4', duration: '05:30', status: 'UPLOADED', submittedAt: '2026-02-07 11:00', confidence: 0.0 },
    ];

    return (
        <div className="p-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-[#111] dark:text-white">Video Ingestion Queue</h1>
                    <p className="text-gray-500">Monitor uploads, processing status, and review queue.</p>
                </div>
            </header>

            <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#262626] flex justify-between items-center bg-[#0a0a0a]">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search filenames..."
                                className="pl-9 pr-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-sm w-64 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-[#333] rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
                            <Filter size={16} /> Filter Status
                        </button>
                    </div>
                </div>
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-[#0a0a0a] border-b border-[#262626] text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">File / ID</th>
                            <th className="px-6 py-3">Contributor</th>
                            <th className="px-6 py-3">Duration</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Auto-QC</th>
                            <th className="px-6 py-3">Submitted</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                        {videos.map((video) => (
                            <tr key={video.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-white">{video.filename}</span>
                                        <span className="text-xs text-gray-500 font-mono">{video.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-blue-400">{video.contributor}</td>
                                <td className="px-6 py-4 font-mono text-xs">{video.duration}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge label={video.status} variant={video.status === 'REVIEWED' ? 'success' : video.status === 'PENDING_REVIEW' ? 'warning' : 'neutral'} />
                                </td>
                                <td className="px-6 py-4">
                                    {video.confidence > 0 ? (
                                        <span className={`text-xs font-bold ${video.confidence > 0.9 ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {(video.confidence * 100).toFixed(0)}%
                                        </span>
                                    ) : <span className="text-gray-600">-</span>}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{video.submittedAt}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {video.status === 'PENDING_REVIEW' && (
                                            <Link
                                                to={`/admin/submission/${video.id}`}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors"
                                            >
                                                Review
                                            </Link>
                                        )}
                                        {video.status === 'REVIEWED' && (
                                            <Link
                                                to={`/admin/submission/${video.id}`}
                                                className="px-3 py-1.5 bg-[#262626] hover:bg-[#333] text-white text-xs rounded transition-colors"
                                            >
                                                View
                                            </Link>
                                        )}
                                        <button className="p-1.5 text-gray-500 hover:text-white">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminVideos;
