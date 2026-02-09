import React from 'react';
import { Key, Code, Terminal, Copy } from 'lucide-react';
import { uiStore } from '../../../lib/uiStore';

export const IntegrationCenter: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-lg font-medium text-[#111]">Integration Center</h3>
                    <p className="text-stone-500 text-sm">Connect Harbor data directly into your training pipelines.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* API Keys */}
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Key size={18} className="text-[#111]" />
                        <h4 className="font-medium text-[#111]">API Keys</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Active Keys</p>
                            <p className="text-xl font-medium text-[#111]">3</p>
                        </div>
                        <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Last Used</p>
                            <p className="text-sm font-mono text-[#111]">2 hours ago</p>
                        </div>
                        <div className="pt-2 flex gap-3">
                            <button onClick={() => alert("Key generation is disabled in dev mode.")} className="text-xs bg-[#111] text-white px-3 py-2 rounded-md font-medium hover:bg-black transition-colors">Generate Key</button>
                            <button onClick={() => alert("Key management coming soon.")} className="text-xs bg-white border border-gray-200 text-[#111] px-3 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">Manage</button>
                        </div>
                    </div>
                </div>

                {/* Endpoints */}
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Terminal size={18} className="text-[#111]" />
                        <h4 className="font-medium text-[#111]">Endpoints</h4>
                    </div>
                    <ul className="space-y-3">
                        {['Dataset Retrieval', 'Streaming Access', 'Metadata Manifests'].map((ep) => (
                            <li key={ep} className="flex justify-between items-center bg-white px-3 py-2 rounded border border-gray-100 text-sm text-gray-600">
                                {ep}
                                <Copy size={12} className="text-gray-400 hover:text-[#111] cursor-pointer" />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SDKs */}
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Code size={18} className="text-[#111]" />
                        <h4 className="font-medium text-[#111]">SDKs</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => uiStore.openApiDocs('start')}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-[#111] text-white rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
                        >
                            Python
                        </button>
                        <button
                            onClick={() => uiStore.openApiDocs('start')}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-[#111] rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
                        >
                            Node.js
                        </button>
                        <button
                            onClick={() => uiStore.openApiDocs('reference')}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-[#111] rounded-md text-xs font-medium hover:bg-gray-50 transition-colors col-span-2"
                        >
                            CLI Tool
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
