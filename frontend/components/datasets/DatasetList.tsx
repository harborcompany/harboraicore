import React, { useEffect, useState } from 'react';
import { Dataset } from '../../types';
import { datasetService } from '../../services/datasetService';
import { Database, Plus, Search, Loader2, Filter, ShieldCheck, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const DatasetList: React.FC = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVertical, setSelectedVertical] = useState<string>('');
    const [selectedLicense, setSelectedLicense] = useState<string>('');

    useEffect(() => {
        loadDatasets();
    }, [searchTerm, selectedVertical, selectedLicense]);

    const loadDatasets = async () => {
        setLoading(true);
        try {
            const filters: Record<string, any> = {};
            if (searchTerm) filters.search = searchTerm;
            if (selectedVertical) filters.vertical = selectedVertical;
            if (selectedLicense) filters.licenseType = selectedLicense;

            // Debounce search could be added here, but for now direct call
            const data = await datasetService.getDatasets(filters);
            setDatasets(data);
        } catch (error) {
            console.error("Failed to load datasets", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'draft': return 'bg-stone-100 text-stone-600 border-stone-200';
            default: return 'bg-stone-100 text-stone-600';
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search datasets..."
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                    <div className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-lg bg-stone-50">
                        <Filter size={16} className="text-stone-500" />
                        <select
                            className="bg-transparent border-none text-sm font-medium text-stone-700 focus:outline-none cursor-pointer"
                            value={selectedVertical}
                            onChange={(e) => setSelectedVertical(e.target.value)}
                        >
                            <option value="">All Verticals</option>
                            <option value="AUTONOMOUS_DRIVING">Autonomous Driving</option>
                            <option value="MEDICAL_IMAGING">Medical Imaging</option>
                            <option value="ROBOTICS">Robotics</option>
                            <option value="SECURITY">Security</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-lg bg-stone-50">
                        <Tag size={16} className="text-stone-500" />
                        <select
                            className="bg-transparent border-none text-sm font-medium text-stone-700 focus:outline-none cursor-pointer"
                            value={selectedLicense}
                            onChange={(e) => setSelectedLicense(e.target.value)}
                        >
                            <option value="">All Licenses</option>
                            <option value="COMMERCIAL">Commercial</option>
                            <option value="ACADEMIC">Academic</option>
                            <option value="OPEN_SOURCE">Open Source</option>
                        </select>
                    </div>

                    <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors whitespace-nowrap flex items-center gap-2">
                        <Plus size={16} /> New Dataset
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="p-20 flex justify-center items-center">
                    <Loader2 className="animate-spin text-stone-400" size={32} />
                </div>
            ) : datasets.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-stone-300 p-20 text-center">
                    <Database size={48} className="mx-auto mb-4 text-stone-300" />
                    <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">No datasets found</h3>
                    <p className="text-stone-500 max-w-md mx-auto">Try adjusting your filters or search query, or create a new dataset to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {datasets.map((ds) => (
                        <Link
                            to={`/app/datasets/${ds.id}`}
                            key={ds.id}
                            className="group bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                        >
                            {/* Card Header */}
                            <div className="p-5 border-b border-stone-100 bg-gradient-to-br from-white to-stone-50 relative">
                                {ds.is_anchor && (
                                    <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                                        <ShieldCheck size={12} />
                                        ANCHOR
                                    </div>
                                )}
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl font-serif border ${ds.media_type === 'video' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                            ds.media_type === 'audio' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        {ds.media_type === 'video' ? 'V' : ds.media_type === 'audio' ? 'A' : 'M'}
                                    </div>
                                </div>
                                <h3 className="text-lg font-serif font-medium text-[#1A1A1A] group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {ds.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
                                    <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">{ds.version}</span>
                                    <span>•</span>
                                    <span>{formatBytes(ds.size_bytes)}</span>
                                    <span>•</span>
                                    <span className="capitalize">{ds.vertical?.replace('_', ' ').toLowerCase() || 'General'}</span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col gap-4">
                                <p className="text-sm text-stone-600 line-clamp-2">
                                    {ds.description || "No description provided."}
                                </p>

                                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                                    <div>
                                        <div className="text-[10px] text-stone-400 uppercase font-medium mb-1">Status</div>
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ds.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${ds.status === 'active' ? 'bg-emerald-500' : 'bg-stone-400'}`}></span>
                                            <span className="capitalize">{ds.status}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-stone-400 uppercase font-medium mb-1">RAG Index</div>
                                        <div className={`text-xs font-medium ${ds.embedding_status === 'completed' ? 'text-emerald-600' :
                                                ds.embedding_status === 'embedding' ? 'text-blue-600' : 'text-stone-400'
                                            }`}>
                                            {ds.embedding_status === 'completed' ? 'Active' :
                                                ds.embedding_status === 'embedding' ? 'Indexing...' : 'Not Indexed'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DatasetList;
