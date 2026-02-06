import React, { useState } from 'react';
import { Upload, Slack, Database, Mail, ArrowRight, CheckCircle2, Megaphone, Loader2 } from 'lucide-react';

const AdsPage: React.FC = () => {
    const [requestStatus, setRequestStatus] = useState<'idle' | 'requesting' | 'completed'>('idle');

    const handleBuildRequest = () => {
        setRequestStatus('requesting');
        setTimeout(() => {
            setRequestStatus('completed');
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-serif text-[#1A1A1A] mb-4">Ads Creative Studio</h1>
                <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                    Upload your assets or connect your workspace to generate high-performance ad creatives automatically.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Option 1: Upload */}
                <div className="bg-white p-8 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all shadow-sm group">
                    <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                        <Upload size={24} />
                    </div>
                    <h2 className="text-2xl font-medium text-[#1A1A1A] mb-3">Upload Assets</h2>
                    <p className="text-stone-500 mb-8 leading-relaxed">
                        Directly upload raw videos, images, or dataset files. Our system will ingest and tag them for creative generation.
                    </p>
                    <button className="w-full py-3 border border-stone-200 rounded-lg font-medium text-[#1A1A1A] hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                        Upload Files <ArrowRight size={16} />
                    </button>
                    <div className="mt-4 flex gap-3 text-xs text-stone-400">
                        <span className="flex items-center gap-1"><CheckCircle2 size={12} /> MP4/MOV</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={12} /> PNG/JPG</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={12} /> JSON/CSV</span>
                    </div>
                </div>

                {/* Option 2: Integrate */}
                <div className="bg-white p-8 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all shadow-sm group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Slack size={120} />
                    </div>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                        <Slack size={24} />
                    </div>
                    <h2 className="text-2xl font-medium text-[#1A1A1A] mb-3">Connect Workspace</h2>
                    <p className="text-stone-500 mb-8 leading-relaxed">
                        Integrate with Slack or Teams to automatically pull creative assets from your marketing channels.
                    </p>

                    {requestStatus === 'idle' && (
                        <button
                            onClick={handleBuildRequest}
                            className="w-full py-3 bg-[#1A1A1A] text-white rounded-lg font-medium hover:bg-[#333] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                        >
                            <Megaphone size={18} />
                            Build Ad Set for Me
                        </button>
                    )}

                    {requestStatus === 'requesting' && (
                        <button disabled className="w-full py-3 bg-stone-100 text-stone-400 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin" />
                            Processing Request...
                        </button>
                    )}

                    {requestStatus === 'completed' && (
                        <button disabled className="w-full py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg font-medium cursor-default flex items-center justify-center gap-2">
                            <CheckCircle2 size={18} />
                            Request Made
                        </button>
                    )}

                    <p className="mt-4 text-xs text-center text-stone-400">
                        {requestStatus === 'completed'
                            ? "We'll notify you when your creatives are ready."
                            : "Includes automated formatting and copy generation."
                        }
                    </p>
                </div>
            </div>

            {/* Bottom Note */}
            <div className="text-center">
                <p className="text-sm text-stone-400">
                    Need enterprise data connection? <span className="text-[#1A1A1A] underline cursor-pointer">Contact Data Operations</span>
                </p>
            </div>
        </div>
    );
};

export default AdsPage;
