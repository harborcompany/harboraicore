import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Code, Terminal, ArrowRight } from 'lucide-react';

const Docs: React.FC = () => {
    return (
        <div className="w-full bg-white pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-serif text-[#1A1A1A] mb-6">Documentation Hub</h1>
                    <p className="text-xl text-stone-500 max-w-2xl mx-auto">
                        Everything you need to integrate Harbor's data engine into your AI workflows.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Guides */}
                    <div className="p-8 bg-[#F9F8F6] rounded-2xl border border-stone-100 hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                            <Book size={24} className="text-[#1A1A1A]" />
                        </div>
                        <h3 className="text-2xl font-serif mb-4">Guides</h3>
                        <p className="text-stone-500 mb-6">Step-by-step tutorials for RAG, Fine-tuning, and Data Ingestion.</p>
                        <Link to="/docs/guides" className="flex items-center gap-2 text-[#1A1A1A] font-medium hover:gap-3 transition-all">
                            Read Guides <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* API Reference */}
                    <div className="p-8 bg-[#F9F8F6] rounded-2xl border border-stone-100 hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                            <Terminal size={24} className="text-[#1A1A1A]" />
                        </div>
                        <h3 className="text-2xl font-serif mb-4">API Reference</h3>
                        <p className="text-stone-500 mb-6">Comprehensive endpoints for Dataset management and Marketplace operations.</p>
                        <Link to="/docs/api" className="flex items-center gap-2 text-[#1A1A1A] font-medium hover:gap-3 transition-all">
                            View API <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* SDKs */}
                    <div className="p-8 bg-[#F9F8F6] rounded-2xl border border-stone-100 hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                            <Code size={24} className="text-[#1A1A1A]" />
                        </div>
                        <h3 className="text-2xl font-serif mb-4">SDKs</h3>
                        <p className="text-stone-500 mb-6">Client libraries for Python and Node.js to accelerate development.</p>
                        <Link to="/docs/sdk" className="flex items-center gap-2 text-[#1A1A1A] font-medium hover:gap-3 transition-all">
                            Get Client <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Docs;
