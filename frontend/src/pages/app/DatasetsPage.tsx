import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Play, Clock, CheckCircle, Search, Filter, Download } from 'lucide-react';

const sampleDatasets = [
    {
        id: 1,
        name: 'Urban Speech v4 (US-East)',
        type: 'Audio+Metadata',
        hours: 142400,
        annotations: 'Diarization, Sentiment, Phonetics',
        license: 'Commercial',
        status: 'Available'
    },
    {
        id: 2,
        name: 'Automotive Cabin Lensing',
        type: 'Multimodal',
        hours: 8520,
        annotations: 'Head-pose, Voice, Temporal alignment',
        license: 'Commercial',
        status: 'Available'
    },
    {
        id: 3,
        name: 'Egocentric Perception (POV)',
        type: 'Video',
        hours: 5200,
        annotations: 'Object Persistance, TAL',
        license: 'Enterprise',
        status: 'Processing'
    },
    {
        id: 4,
        name: 'Drone Surveillance Baseline',
        type: 'Video+IR',
        hours: 1320,
        annotations: 'Classification, Re-ID',
        license: 'Defense Tier',
        status: 'Available'
    },
    {
        id: 5,
        name: 'Retail Interaction Stream',
        type: 'Multimodal',
        hours: 1100,
        annotations: 'Pose, Action, Trajectory',
        license: 'Commercial',
        status: 'Available'
    },
    {
        id: 6,
        name: 'Public Sector Archive A-9',
        type: 'Audio',
        hours: 184500,
        annotations: 'Transcription, PI Extraction',
        license: 'GovCloud',
        status: 'Available'
    }
];

const DatasetsPage: React.FC = () => {
    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">Datasets</h1>
                    <p className="text-stone-500">Browse and manage your licensed datasets</p>
                </div>
                <Link
                    to="/app/marketplace"
                    className="bg-[#1A1A1A] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#333] transition-colors flex items-center gap-2"
                >
                    <Search size={18} />
                    Browse Marketplace
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Database size={20} className="text-stone-400" />
                        <span className="text-stone-500 text-sm">Total Datasets</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">5</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Play size={20} className="text-stone-400" />
                        <span className="text-stone-500 text-sm">Total Hours</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">9,870</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-stone-500 text-sm">Available</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">4</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock size={20} className="text-amber-500" />
                        <span className="text-stone-500 text-sm">Processing</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">1</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-4 py-2.5 flex-1">
                    <Search size={18} className="text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search datasets..."
                        className="bg-transparent text-[#1A1A1A] placeholder-stone-400 focus:outline-none flex-1"
                    />
                </div>
                <button className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-stone-600 hover:bg-stone-50 transition-colors">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* Dataset Table */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-stone-200 bg-stone-50">
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Name</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Type</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Hours</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Annotations</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">License</th>
                            <th className="text-left px-5 py-4 text-sm font-medium text-stone-500">Status</th>
                            <th className="px-5 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleDatasets.map((dataset) => (
                            <tr key={dataset.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                                <td className="px-5 py-4 text-[#1A1A1A] font-medium">{dataset.name}</td>
                                <td className="px-5 py-4 text-stone-600">{dataset.type}</td>
                                <td className="px-5 py-4 text-stone-600 font-mono">{dataset.hours.toLocaleString()}</td>
                                <td className="px-5 py-4 text-stone-500 text-sm">{dataset.annotations}</td>
                                <td className="px-5 py-4">
                                    <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">
                                        {dataset.license}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${dataset.status === 'Available'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {dataset.status}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <button className="text-stone-400 hover:text-[#1A1A1A] transition-colors">
                                        <Download size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DatasetsPage;
