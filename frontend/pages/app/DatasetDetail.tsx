import React from 'react';
import { BadgeCheck, Calendar, Layers, Activity, Lock, Database, Play, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DatasetDetail: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-500 pb-20">
            {/* Header Section */}
            <div className="border-b border-gray-200 pb-8 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide rounded">Licensed</span>
                            <span className="px-2 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded">Annotated</span>
                            <span className="px-2 py-1 bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wide rounded">Multimodal</span>
                        </div>
                        <h1 className="text-3xl font-medium text-[#111] tracking-tight mb-2">Maritime Vessel Classification - Batch A</h1>
                        <p className="text-stone-500 font-light max-w-2xl">
                            High-fidelity dataset for autonomous maritime navigation systems. Includes varied weather conditions, vessel types, and harbor environments.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white text-[#111] font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            Customize Dataset
                        </button>
                        <button className="px-5 py-2.5 bg-[#111] text-white font-medium rounded-lg hover:bg-black transition-colors shadow-lg shadow-gray-200">
                            Request Access
                        </button>
                    </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Samples</p>
                        <p className="text-lg font-medium text-[#111]">124,500</p>
                    </div>
                    <div>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Video Hours</p>
                        <p className="text-lg font-medium text-[#111]">8,200</p>
                    </div>
                    <div>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Modalities</p>
                        <div className="flex gap-2 text-[#111]">
                            <Database size={18} />
                            <Play size={18} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Coverage</p>
                        <p className="text-lg font-medium text-[#111]">100%</p>
                    </div>
                    <div>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Last Updated</p>
                        <p className="text-lg font-medium text-[#111]">2h ago</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* SECTION: OVERVIEW */}
                    <section>
                        <h2 className="text-xl font-medium text-[#111] mb-4">Overview</h2>
                        <p className="text-gray-600 leading-relaxed font-light">
                            This dataset is designed for training and evaluating models in maritime logistics and surveillance.
                            It includes licensed content with structured annotations and metadata, covering over 50 vessel classes
                            from small recreational boats to large container ships. Data was collected across 12 international ports
                            under varying lighting and weather conditions suitable for robust model training.
                        </p>
                    </section>

                    {/* SECTION: DATA COMPOSITION */}
                    <section>
                        <h2 className="text-xl font-medium text-[#111] mb-6 flex items-center gap-2">
                            <Layers size={20} className="text-gray-400" /> Data Composition
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-white p-6">
                                <h4 className="font-medium text-[#111] text-sm mb-3">Modalities Included</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> RGB Video (4K)</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> Thermal / IR</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> Radar Cross-section</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6">
                                <h4 className="font-medium text-[#111] text-sm mb-3">Annotation Types</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> 2D Bounding Boxes</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> Instance Segmentation</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> Velocity Vectors</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6">
                                <h4 className="font-medium text-[#111] text-sm mb-3">Metadata Fields</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> Time of Day</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> Weather Condition</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> Sea State (Douglas Scale)</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6">
                                <h4 className="font-medium text-[#111] text-sm mb-3">Formats</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> JSON (COCO format)</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black rounded-full"></div> MP4 (H.265)</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* SECTION: QUALITY & VALIDATION */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <h3 className="text-lg font-medium text-[#111] mb-6 flex items-center gap-2">
                            <Activity size={18} className="text-emerald-500" /> Quality Assurance
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Inter-annotator agreement</span>
                                    <span className="font-medium text-[#111]">96.4%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[96.4%]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm py-3 border-b border-gray-50">
                                <span className="text-gray-600">QA Pass Rate</span>
                                <span className="font-medium text-[#111]">99.1%</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2">
                                <span className="text-gray-600">Validation</span>
                                <span className="font-medium text-[#111]">Double-blind pass</span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: ACCESS & DELIVERY */}
                    <div>
                        <h3 className="text-lg font-medium text-[#111] mb-4">Access Methods</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-medium text-[#111] text-sm">API Access</h4>
                                    <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#111]" />
                                </div>
                                <p className="text-xs text-gray-500">RESTful endpoints for JSON retrieval</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-medium text-[#111] text-sm">Cloud Export</h4>
                                    <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#111]" />
                                </div>
                                <p className="text-xs text-gray-500">Direct S3 / GCS bucket transfer</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-medium text-[#111] text-sm">Streaming Feed</h4>
                                    <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#111]" />
                                </div>
                                <p className="text-xs text-gray-500">Real-time RTMP / HLS access</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: COMPLIANCE & RIGHTS */}
                    <div className="p-6 bg-[#1A1A1A] text-white rounded-2xl">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <Lock size={18} className="text-gray-400" /> Licensing & Provenance
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                            All data is rights-cleared, traceable, and compliant with usage constraints. Indemnification included for enterprise tiers.
                        </p>
                        <button className="w-full py-2.5 bg-white/10 text-white border border-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                            View Legal Manifest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatasetDetail;
