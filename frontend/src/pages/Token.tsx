import React from 'react';
import SeoHead from '../components/SeoHead';
import { Link } from 'react-router-dom';

const Token: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24 px-6 text-[#111]">
            <SeoHead
                title="$HARBOR Token: The Media Data Stack"
                description="Harbor token: media-native ingestion, frame-accurate annotation fabric, RAG dataset engine, APIs, and ad creative execution."
            />

            <div className="max-w-[640px] mx-auto">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-8">Token</span>

                <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#111] mb-12 leading-[1.1]">
                    What can you do with Harbor?
                </h1>

                <div className="space-y-12 text-lg md:text-xl font-light text-gray-600 leading-relaxed font-sans">
                    <p>
                        Everything you need to build, train, and operate production-grade creative AI.
                    </p>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-medium text-[#111] mb-2 tracking-tight">Access Premium Data</h3>
                            <p>
                                Commercial-grade, rights-cleared datasets for training and fine-tuning production models.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-medium text-[#111] mb-2 tracking-tight">Infrastructure Access</h3>
                            <p>
                                Programmatically access Harbor’s generative engine and storage through a simple, scalable API.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-medium text-[#111] mb-2 tracking-tight">Team Collaboration</h3>
                            <p>
                                Manage permissions, seat licensing, and shared assets across teams without friction.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-medium text-[#111] mb-2 tracking-tight">Usage Analytics</h3>
                            <p>
                                Track resource consumption, performance, and utilization in real time.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-medium text-[#111] mb-2 tracking-tight">Pipeline Integrations</h3>
                            <p>
                                Plug Harbor directly into your existing ML and content workflows.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-12 border-t border-gray-100">
                    <p className="text-lg font-medium text-[#111]">
                        Harbor isn’t a tool you bolt on. It’s infrastructure you build on.
                    </p>
                    <div className="mt-8 flex gap-6">
                        <Link to="/contact" className="text-sm font-medium text-[#1A1A1A] border-b border-black/20 pb-0.5 hover:border-black transition-colors">Book Demo</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Token;
