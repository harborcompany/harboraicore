import React, { useState } from 'react';
import { Search, Filter, Database, Clock, ShoppingCart } from 'lucide-react';



const MarketplacePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Empty state for now, will connect to API later
    const marketplaceDatasets: any[] = [];

    const handleLicenseClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        alert("Licensing is currently disabled.");
    };

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-brand-dark mb-2">Marketplace</h1>
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
                        className="bg-transparent text-brand-dark placeholder-stone-400 focus:outline-none flex-1"
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
                            ? 'bg-brand-dark text-white'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Dataset Grid */}
            {marketplaceDatasets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {marketplaceDatasets.map((dataset) => (
                        <div
                            key={dataset.id}
                            className="p-6 bg-white border border-stone-200 rounded-xl hover:border-stone-300 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-brand-dark mb-1">{dataset.name}</h3>
                                    <p className="text-sm text-stone-500">{dataset.provider}</p>
                                </div>
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
                                {dataset.tags.map((tag: string) => (
                                    <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                <span className="text-brand-dark font-medium">{dataset.price}</span>
                                <button
                                    onClick={(e) => handleLicenseClick(e, dataset.id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-brand-dark text-white hover:bg-[#333]"
                                >
                                    <ShoppingCart size={16} />
                                    License
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 bg-white border border-stone-100 rounded-2xl text-center shadow-sm">
                    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 border border-stone-100 transform rotate-3">
                        <Database size={24} className="text-stone-400" />
                    </div>
                    <h3 className="text-xl font-medium text-brand-dark mb-2">No datasets available</h3>
                    <p className="text-stone-500 max-w-sm mx-auto mb-6 leading-relaxed">
                        We're currently curating new high-quality datasets. Check back soon for our latest releases.
                    </p>
                    <button className="text-sm font-medium text-brand-dark border-b border-brand-dark hover:text-black hover:border-black transition-colors">
                        Notify me when available
                    </button>
                </div>
            )}
        </div>
    );
};

export default MarketplacePage;
