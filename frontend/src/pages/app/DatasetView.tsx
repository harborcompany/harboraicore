import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Dataset, DatasetAsset, RAGQueryResult } from '../../types';
import { datasetService } from '../../services/datasetService'; // Use real service
import {
    ArrowLeft, Upload, FileVideo, FileAudio, Search,
    Bot, Database, CheckCircle2, AlertCircle, Loader2,
    Shield, BarChart3, Grid
} from 'lucide-react';
import GovernanceTab from '../../components/datasets/GovernanceTab';
import QualityTab from '../../components/datasets/QualityTab';
import RagExplorer from '../../components/datasets/RagExplorer';
import MediaPlayer, { MediaAsset } from '../../components/datasets/MediaPlayer';
import { AnimatePresence, motion } from 'framer-motion';

type ActiveTab = 'assets' | 'governance' | 'quality';

const DatasetView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [dataset, setDataset] = useState<Dataset | null>(null);
    const [assets, setAssets] = useState<DatasetAsset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('assets');
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

    const handlePreview = (asset: DatasetAsset) => {
        // Construct a demo URL based on type/filename since we don't have real signed URLs yet
        // In production this would come from the API
        let url = '';
        let type: MediaAsset['type'] = 'text';

        if (asset.media_type === 'video') {
            type = 'video';
            url = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; // Demo video
        } else if (asset.media_type === 'audio') {
            type = 'audio';
            url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Demo audio
        } else if (asset.media_type === 'image') {
            type = 'image';
            url = 'https://source.unsplash.com/random/800x600';
        }

        setSelectedAsset({
            id: asset.id,
            title: asset.filename,
            type,
            url,
            content: "Sample text content for preview..."
        });
    };

    useEffect(() => {
        if (id) loadData(id);
    }, [id]);

    const loadData = async (dsId: string) => {
        setIsLoading(true);
        try {
            const ds = await datasetService.getDatasetById(dsId);
            setDataset(ds || null);

            // Only load assets if we found the dataset
            if (ds) {
                const as = await datasetService.getAssets(dsId);
                setAssets(as);
            }
        } catch (error) {
            console.error("Failed to load dataset", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // TODO: Implement real file upload via datasetService if needed for demo
        // For now, keeping consistent with the "Lab-Ready" focus which assumes pre-loaded or API-ingested data
        console.log("File upload not fully wired in demo mode");
    };

    const handleEmbed = async () => {
        // TODO: Wire up real RAG embedding trigger
        console.log("Trigger embedding");
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-stone-400" size={32} /></div>;
    if (!dataset) return <div className="p-20 text-center">Dataset not found</div>;

    return (
        <div className="min-h-screen bg-[#F9F8F6] pt-24 pb-12 px-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm text-stone-500">
                    <Link to="/app/datasets" className="hover:text-[#1A1A1A]">Datasets</Link>
                    <span>/</span>
                    <span className="text-[#1A1A1A] font-medium">{dataset.name}</span>
                </div>

                {/* Header */}
                <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-serif text-[#1A1A1A]">{dataset.name}</h1>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${dataset.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-stone-100'
                                    }`}>
                                    {dataset.status}
                                </span>
                                {dataset.is_anchor && (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                                        <Shield size={10} /> Anchor
                                    </span>
                                )}
                            </div>
                            <p className="text-stone-500 max-w-2xl">{dataset.description}</p>
                            <div className="flex gap-6 mt-4 text-sm font-mono text-stone-500">
                                <div><span className="text-stone-400">ID:</span> {dataset.id}</div>
                                <div><span className="text-stone-400">TYPE:</span> {dataset.media_type}</div>
                                <div><span className="text-stone-400">ASSETS:</span> {dataset.asset_count}</div>
                                <div><span className="text-stone-400">SIZE:</span> {(dataset.size_bytes / (1024 * 1024 * 1024)).toFixed(2)} GB</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* RAG Status / Action */}
                            <div className="text-right mr-4">
                                <div className="text-xs font-mono text-stone-400 mb-1">VECTOR INDEX</div>
                                {dataset.embedding_status === 'completed' ? (
                                    <div className="flex items-center justify-end gap-2 text-emerald-600 font-medium text-sm">
                                        <CheckCircle2 size={16} /> Live
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleEmbed}
                                        disabled={dataset.embedding_status !== 'none'}
                                        className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded disabled:opacity-50"
                                    >
                                        {dataset.embedding_status === 'embedding' ? 'Indexing...' : 'Build Index'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 mt-8 border-b border-stone-100">
                        <button
                            onClick={() => setActiveTab('assets')}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'assets' ? 'text-[#1A1A1A]' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Grid size={16} /> Assets
                            </div>
                            {activeTab === 'assets' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A1A1A] rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('governance')}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'governance' ? 'text-[#1A1A1A]' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Shield size={16} /> Governance
                            </div>
                            {activeTab === 'governance' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A1A1A] rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('quality')}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'quality' ? 'text-[#1A1A1A]' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            <div className="flex items-center gap-2">
                                <BarChart3 size={16} /> Quality & Benchmarks
                            </div>
                            {activeTab === 'quality' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A1A1A] rounded-t-full"></div>}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Main Content (Assets/Gov/Quality) */}
                    <div className="lg:col-span-2 space-y-6">

                        {activeTab === 'assets' && (
                            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm h-[600px] flex flex-col">
                                <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50/50">
                                    <h3 className="font-medium">Assets</h3>
                                    <div className="flex gap-2">
                                        <label className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isUploading ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-[#1A1A1A] text-white hover:bg-black'
                                            }`}>
                                            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                            {isUploading ? 'Ingesting...' : 'Ingest Media'}
                                            <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} accept="video/*,audio/*" />
                                        </label>
                                    </div>
                                </div>

                                <div className="overflow-y-auto flex-1 p-0">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-stone-50 sticky top-0 text-xs font-mono text-stone-500">
                                            <tr>
                                                <th className="px-4 py-3">Filename</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Size</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {assets.map((asset) => (
                                                <tr key={asset.id} className="hover:bg-stone-50">
                                                    <td className="px-4 py-3 flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-stone-100 rounded flex items-center justify-center text-stone-500">
                                                            {asset.media_type === 'video' ? <FileVideo size={16} /> : <FileAudio size={16} />}
                                                        </div>
                                                        <span className="truncate max-w-[200px] font-mono text-stone-600">{asset.filename}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {asset.status === 'processing' ? (
                                                            <span className="text-blue-600 text-xs flex items-center gap-1.5"><Loader2 size={10} className="animate-spin" /> Processing</span>
                                                        ) : (
                                                            <span className="text-emerald-600 text-xs">Ready</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-mono text-stone-500">
                                                        {(asset.file_size_bytes / (1024 * 1024)).toFixed(1)} MB
                                                    </td>
                                                    <td className='px-4 py-3 text-right'>
                                                        <button
                                                            onClick={() => handlePreview(asset)}
                                                            className='text-xs font-medium text-[#1A1A1A] hover:underline hover:text-purple-600'
                                                        >
                                                            Preview
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'governance' && (
                            <GovernanceTab profile={dataset.governanceProfile} />
                        )}

                        {activeTab === 'quality' && (
                            <QualityTab profile={dataset.qualityProfile} />
                        )}

                    </div>

                    {/* RIGHT COLUMN: RAG Playground */}
                    <div className="space-y-6">
                        <RagExplorer datasetId={dataset.id} />

                        {/* Additional Info Cards could go here */}
                        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                            <h4 className="font-serif font-medium text-[#1A1A1A] mb-2">Integration Guide</h4>
                            <p className="text-xs text-stone-500 mb-4">
                                Use the Harbor SDK to query this dataset programmatically.
                            </p>
                            <div className="bg-stone-900 rounded-lg p-3 overflow-x-auto">
                                <code className="text-xs font-mono text-emerald-400">
                                    harbor.query("{dataset.id}", "{'{'} query: '...' {'}'}")
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Player Modal */}
            <AnimatePresence>
                {selectedAsset && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-4xl"
                        >
                            <MediaPlayer asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DatasetView;
