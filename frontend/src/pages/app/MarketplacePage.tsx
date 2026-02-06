import React, { useState } from 'react';
import { Search, Filter, Database, Clock, ShoppingCart } from 'lucide-react';

const marketplaceDatasets = [
    {
        id: 1,
        name: 'Regional Dialect Corpus v2',
        provider: 'Multimodal Research Group',
        type: 'Audio+Text',
        hours: 142500,
        annotations: 'Diarization, Sentiment, Phonetic Align',
        price: 'From $0.04/hr',
        rating: 4.9,
        reviews: 242,
        tags: ['Speech', 'Linguistics', 'Accents']
    },
    {
        id: 2,
        name: 'L-4 Autonomous Perception Kit',
        provider: 'VectorDrive Systems',
        type: 'Video+Lidar+IR',
        hours: 12400,
        annotations: '3D Bounding Boxes, TAL, Re-ID',
        price: 'From $0.18/hr',
        rating: 4.8,
        reviews: 114,
        tags: ['Automotive', 'ADAS', 'Multi-Sensor']
    },
    {
        id: 3,
        name: 'Surgical Procedure Dataset (De-ID)',
        provider: 'ClinicalData Partners',
        type: 'Video',
        hours: 3200,
        annotations: 'Action Recognition, Tool Tracking',
        price: 'Enterprise Only',
        rating: 4.7,
        reviews: 45,
        tags: ['Healthcare', 'Surgical', 'High-Fidelity']
    },
    {
        id: 4,
        name: 'Global Sports Broadcast Archive',
        provider: 'MediaNetwork Delta',
        type: 'Video',
        hours: 185000,
        annotations: 'Player Trajectories, Event Spotting',
        price: 'Tiered Pricing',
        rating: 4.6,
        reviews: 87,
        tags: ['Broadcast', 'Sports', 'Tracking']
    },
    {
        id: 5,
        name: 'Egocentric Daily Life (1st Person)',
        provider: 'Spatial Perception Labs',
        type: 'Video+Audio',
        hours: 8800,
        annotations: 'Gaze Detection, Object Interactions',
        price: 'From $0.06/hr',
        rating: 4.5,
        reviews: 312,
        tags: ['AR/VR', 'Egocentric', 'Interaction']
    },
    {
        id: 6,
        name: 'Industrial Safety Monitoring',
        provider: 'SafeFlow Industrial',
        type: 'Video',
        hours: 4100,
        annotations: 'Hazard Detection, PPE Compliance',
        price: 'From $0.12/hr',
        rating: 4.4,
        reviews: 93,
        tags: ['Industrial', 'Safety', 'Compliance']
    },
    {
        id: 7,
        name: 'Oceanic Acoustic Baseline',
        provider: 'MarineBio Research',
        type: 'Audio',
        hours: 22000,
        annotations: 'Species ID, Noise Localization',
        price: 'Free for Research',
        rating: 4.9,
        reviews: 512,
        tags: ['Environmental', 'Acoustic', 'Science']
    }
];

const MarketplacePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [requestedIds, setRequestedIds] = useState<number[]>([]);

    const handleLicenseClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setRequestedIds(prev => [...prev, id]);
    };

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">Marketplace</h1>
                <p className="text-stone-500">Discover and license production-ready datasets</p>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-4 py-3 flex-1">
                    <Search size={20} className="text-stone-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, type, or annotation..."
                        className="bg-transparent text-[#1A1A1A] placeholder-stone-400 focus:outline-none flex-1"
                    />
                </div>
                <button className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-600 hover:bg-stone-50 transition-colors">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 mb-8">
                {['All', 'Audio', 'Video', 'Multimodal'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filter
                            ? 'bg-[#1A1A1A] text-white'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Dataset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketplaceDatasets.map((dataset) => (
                    <div
                        key={dataset.id}
                        className="p-6 bg-white border border-stone-200 rounded-xl hover:border-stone-300 hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-[#1A1A1A] mb-1">{dataset.name}</h3>
                                <p className="text-sm text-stone-500">{dataset.provider}</p>
                            </div>
                            {/* Stars removed as per user request */}
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2 text-stone-500 text-sm">
                                <Database size={14} />
                                {dataset.type}
                            </div>
                            <div className="flex items-center gap-2 text-stone-500 text-sm">
                                <Clock size={14} />
                                {dataset.hours.toLocaleString()} hrs
                            </div>
                        </div>

                        <p className="text-stone-500 text-sm mb-4">{dataset.annotations}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {dataset.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                            <span className="text-[#1A1A1A] font-medium">{dataset.price}</span>
                            <button
                                onClick={(e) => handleLicenseClick(e, dataset.id)}
                                disabled={requestedIds.includes(dataset.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${requestedIds.includes(dataset.id)
                                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                    : 'bg-[#1A1A1A] text-white hover:bg-[#333]'
                                    }`}
                            >
                                <ShoppingCart size={16} />
                                {requestedIds.includes(dataset.id) ? 'Request Pending' : 'License'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketplacePage;
