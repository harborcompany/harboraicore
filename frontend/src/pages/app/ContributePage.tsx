import React from 'react';
import { Upload, DollarSign, Clock, CheckCircle, AlertCircle, Plus, FileAudio, FileVideo } from 'lucide-react';

const contributions = [
    {
        id: 1,
        name: 'street_interview_01.mp4',
        type: 'Video',
        size: '2.4 GB',
        duration: '45:30',
        status: 'Approved',
        earnings: '$45.30',
        uploadedAt: 'Jan 20, 2026'
    },
    {
        id: 2,
        name: 'ambient_city_sounds.wav',
        type: 'Audio',
        size: '890 MB',
        duration: '2:15:00',
        status: 'Processing',
        earnings: 'Pending',
        uploadedAt: 'Jan 22, 2026'
    },
    {
        id: 3,
        name: 'podcast_ep_47.mp3',
        type: 'Audio',
        size: '156 MB',
        duration: '1:12:00',
        status: 'Review',
        earnings: 'Pending',
        uploadedAt: 'Jan 22, 2026'
    },
    {
        id: 4,
        name: 'warehouse_walkthrough.mp4',
        type: 'Video',
        size: '4.1 GB',
        duration: '28:45',
        status: 'Approved',
        earnings: '$28.45',
        uploadedAt: 'Jan 18, 2026'
    },
    {
        id: 5,
        name: 'nature_documentary_raw.mp4',
        type: 'Video',
        size: '8.7 GB',
        duration: '1:45:00',
        status: 'Rejected',
        earnings: '$0.00',
        uploadedAt: 'Jan 15, 2026'
    }
];

const ContributePage: React.FC = () => {
    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">Contribute</h1>
                    <p className="text-stone-500">Upload and monetize your audio and video content</p>
                </div>
                <button className="bg-[#1A1A1A] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#333] transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    Upload Content
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Upload size={20} className="text-blue-500" />
                        <span className="text-stone-500 text-sm">Total Uploads</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">5</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock size={20} className="text-purple-500" />
                        <span className="text-stone-500 text-sm">Total Duration</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">5h 26m</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-stone-500 text-sm">Approved</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">2</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign size={20} className="text-green-500" />
                        <span className="text-stone-500 text-sm">Total Earnings</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">$73.75</p>
                </div>
            </div>

            {/* Upload Zone */}
            <div className="mb-8 p-8 bg-white border-2 border-dashed border-stone-300 rounded-xl text-center hover:border-stone-400 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload size={28} className="text-stone-400" />
                </div>
                <p className="text-[#1A1A1A] font-medium mb-2">Drop files here or click to upload</p>
                <p className="text-stone-500 text-sm">Supports MP4, MOV, WAV, MP3, FLAC up to 10GB</p>
            </div>

            {/* Contributions Table */}
            <div className="mb-6">
                <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">Your Contributions</h2>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-stone-200 bg-stone-50">
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">File</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Duration</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Size</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Status</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Earnings</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Uploaded</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contributions.map((item) => (
                            <tr key={item.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        {item.type === 'Video' ? (
                                            <FileVideo size={18} className="text-purple-500" />
                                        ) : (
                                            <FileAudio size={18} className="text-blue-500" />
                                        )}
                                        <span className="text-[#1A1A1A]">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-stone-600 font-mono">{item.duration}</td>
                                <td className="px-5 py-4 text-stone-600">{item.size}</td>
                                <td className="px-5 py-4">
                                    <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 w-fit ${item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            item.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                item.status === 'Review' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {item.status === 'Approved' && <CheckCircle size={12} />}
                                        {item.status === 'Rejected' && <AlertCircle size={12} />}
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-stone-600 font-mono">{item.earnings}</td>
                                <td className="px-5 py-4 text-stone-500 text-sm">{item.uploadedAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContributePage;
