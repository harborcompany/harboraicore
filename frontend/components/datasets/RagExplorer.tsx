import React, { useState } from 'react';
import { RAGQueryResult } from '../../types';
import { datasetService } from '../../services/datasetService';
import { Search, Loader2, Network, FileText, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    datasetId: string;
}

const RagExplorer: React.FC<Props> = ({ datasetId }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<RAGQueryResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const data = await datasetService.queryDataset(datasetId, query);
            setResults(data);
        } catch (err) {
            console.error("RAG Query failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            {/* Header / Search Bar */}
            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-serif font-medium text-[#1A1A1A] flex items-center gap-2">
                            <Network className="text-purple-600" size={20} />
                            Semantic Knowledge Graph
                        </h3>
                        <p className="text-sm text-stone-500">Query the dataset's vector index and knowledge entities.</p>
                    </div>
                    <div className="flex bg-stone-200 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-[#1A1A1A]' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('graph')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'graph' ? 'bg-white shadow text-[#1A1A1A]' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            Graph View
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input
                        type="text"
                        placeholder="Ask a natural language question (e.g. 'Show me all interactions between pedestrians and cyclists')"
                        className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm shadow-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !query}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1A1A1A] text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-black disabled:opacity-50 transition-colors"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : 'Refine'}
                    </button>
                </form>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-hidden relative bg-stone-50/30">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                        <Loader2 size={32} className="animate-spin mb-3 text-purple-600" />
                        <p className="text-sm">Traversing knowledge graph...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 opacity-60">
                        <Network size={48} className="mb-4" />
                        <p>Enter a query to explore semantic connections.</p>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="h-full overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        <AnimatePresence>
                            {results.map((result, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i}
                                    className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:border-purple-200 transition-colors group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                                                Confidence: {(result.score * 100).toFixed(0)}%
                                            </div>
                                            <span className="text-xs text-stone-400 font-mono">ID: {result.asset_id}</span>
                                        </div>
                                        {/* Timecode pill */}
                                        {result.snippet_time_start !== undefined && (
                                            <div className="flex items-center gap-1.5 text-xs font-mono text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                                <PlayCircle size={12} />
                                                {result.snippet_time_start}s - {result.snippet_time_end}s
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        {/* Preview Thumbnail (Placeholder) */}
                                        <div className="w-32 h-20 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0 text-stone-300 group-hover:bg-purple-50 group-hover:text-purple-300 transition-colors">
                                            <PlayCircle size={24} />
                                        </div>

                                        <div>
                                            {/* Context/Text Snippet */}
                                            <p className="text-sm text-stone-700 leading-relaxed">
                                                {result.text_content || "Visual context matched: Semantic alignment with query terms found in video frames."}
                                            </p>

                                            {/* Connected Nodes (Mock for visual) */}
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {['Cyclist', 'Intersection', 'Risk:High'].map((tag, t) => (
                                                    <span key={t} className="text-[10px] px-1.5 py-0.5 border border-stone-200 rounded text-stone-500">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-stone-500">
                        {/* Graph View Placeholder - would use react-force-graph in real implementation */}
                        <div className="text-center">
                            <div className="w-64 h-64 border-2 border-dashed border-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 bg-white">
                                <Network size={32} className="text-purple-300" />
                            </div>
                            <p>Knowledge Graph Visualization</p>
                            <p className="text-xs text-stone-400">(Requires d3-force / react-force-graph)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RagExplorer;
