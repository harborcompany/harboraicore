import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

const HowItWorks: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-20 pb-12 px-6">
            <SeoHead
                title="How It Works — Harbor Infrastructure"
                description="Harbor infrastructure combines automated ingestion with precision human-in-the-loop annotation."
            />

            <div className="max-w-[700px] mx-auto">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-8">Process</span>

                <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#111] mb-8 leading-[1.1]">
                    Harbor Architecture & Alignment
                </h1>

                <div className="space-y-6 text-lg md:text-xl font-light text-gray-600 leading-relaxed font-sans mb-12">
                    <p>
                        Our infrastructure combines automated ingestion with precision human-in-the-loop annotation.
                    </p>
                    <p>
                        Harbor operates across the full data stack. From ingestion to delivery, we handle the entire pipeline from Layer-1 storage through to the RAG Retrieval Engine and final API Gateway.
                    </p>
                </div>

                {/* Diagrams from UseCases.tsx */}
                <div className="space-y-8">
                    {/* Diagram 1: Architecture */}
                    <div>
                        <div className="bg-white p-8 rounded-xl border border-gray-100 mb-6 flex items-center justify-center shadow-sm">
                            <img
                                src="/diagram_architecture_stack_1769477312827.png"
                                alt="Harbor Architecture Stack"
                                className="max-w-full h-auto object-contain mix-blend-multiply"
                            />
                        </div>
                        <h3 className="text-xl font-medium text-black mb-2">Full-Stack Data Infrastructure</h3>
                        <p className="text-gray-500 font-light text-sm leading-relaxed">
                            From ingestion to delivery. We handle the entire pipeline from Layer-1 storage through to the RAG Retrieval Engine and final API Gateway.
                        </p>
                    </div>

                    {/* Diagram 2: RLHF */}
                    <div>
                        <div className="bg-white p-8 rounded-xl border border-gray-100 mb-6 flex items-center justify-center shadow-sm">
                            <img
                                src="/diagram_rlhf_cycle_1769477296587.png"
                                alt="Harbor RLHF Cycle"
                                className="max-w-full h-auto object-contain mix-blend-multiply"
                            />
                        </div>
                        <h3 className="text-xl font-medium text-black mb-2">Continuous Alignment Cycle</h3>
                        <p className="text-gray-500 font-light text-sm leading-relaxed">
                            Our models improve through a rigorous cycle of Supervised Fine-Tuning (SFT), Red Teaming, and RLHF rooted in human preferences.
                        </p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="mt-6">
                        <Link to="/contact" className="text-sm font-medium text-[#1A1A1A] border-b border-black/20 pb-0.5 hover:border-black transition-colors">Contact Us</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
