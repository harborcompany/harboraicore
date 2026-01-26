import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, ShieldCheck, Zap, Coins } from 'lucide-react';

const HowItWorks: React.FC = () => {
    return (
        <div className="w-full bg-[#faFaF9] pt-24 md:pt-32 pb-20 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <h1 className="text-4xl md:text-7xl font-serif text-[#1A1A1A] mb-6 md:mb-8 leading-tight">The Law of Motion</h1>
                    <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed px-2">
                        Harbor isn't just a marketplace. It's a high-throughput data engine that turns raw media into verified, revenue-generating assets.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-16 md:space-y-24 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-stone-300 hidden md:block"></div>

                    {/* Mobile Connecting Line (Left aligned) */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-stone-200 md:hidden"></div>

                    {/* Step 1: Ingestion */}
                    <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-12 group pl-20 md:pl-0">
                        <div className="flex-1 text-left md:text-right order-2 md:order-1 px-0 md:px-8">
                            <h3 className="text-2xl md:text-3xl font-serif mb-2 md:mb-4 group-hover:text-amber-700 transition-colors">1. Verified Ingestion</h3>
                            <p className="text-stone-500 leading-relaxed text-sm md:text-base">
                                Upload raw video, audio, or images. We verify ownership and strip metadata immediately. No anonymous uploads allowed.
                            </p>
                        </div>
                        <div className="absolute left-0 md:relative md:left-auto w-16 h-16 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center z-10 shadow-xl border-4 border-[#faFaF9] order-1 md:order-2 shrink-0 group-hover:scale-110 transition-transform">
                            <b className="text-xl">1</b>
                        </div>
                        <div className="flex-1 order-3 px-8 opacity-0 md:opacity-100 hidden md:block"></div>
                    </div>

                    {/* Step 2: Audit */}
                    <div className="relative flex flex-col md:flex-row items-center gap-12 group">
                        <div className="flex-1 order-2 md:order-1 px-8 opacity-0 md:opacity-100"></div>
                        <div className="w-16 h-16 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center z-10 shadow-xl border-4 border-[#faFaF9] order-1 md:order-2 shrink-0 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={28} />
                        </div>
                        <div className="flex-1 text-left order-3 md:order-3 px-8">
                            <h3 className="text-3xl font-serif mb-4 group-hover:text-emerald-700 transition-colors">2. Multi-Layer Audit</h3>
                            <p className="text-stone-500 leading-relaxed">
                                Every asset passes through automated hash detection, web scraping for duplicates, and human review.
                            </p>
                        </div>
                    </div>

                    {/* Step 3: Dataset */}
                    <div className="relative flex flex-col md:flex-row items-center gap-12 group">
                        <div className="flex-1 text-right order-2 md:order-1 px-8">
                            <h3 className="text-3xl font-serif mb-4 group-hover:text-blue-700 transition-colors">3. Dataset Creation</h3>
                            <p className="text-stone-500 leading-relaxed">
                                Assets are normalized, annotated, and grouped into high-value datasets for specific commercial verticals.
                            </p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center z-10 shadow-xl border-4 border-[#faFaF9] order-1 md:order-2 shrink-0 group-hover:scale-110 transition-transform">
                            <Database size={28} />
                        </div>
                        <div className="flex-1 order-3 px-8 opacity-0 md:opacity-100"></div>
                    </div>

                    {/* Step 4: Revenue */}
                    <div className="relative flex flex-col md:flex-row items-center gap-12 group">
                        <div className="flex-1 order-2 md:order-1 px-8 opacity-0 md:opacity-100"></div>
                        <div className="w-16 h-16 rounded-full bg-amber-400 text-[#1A1A1A] flex items-center justify-center z-10 shadow-xl border-4 border-[#faFaF9] order-1 md:order-2 shrink-0 group-hover:scale-110 transition-transform">
                            <Coins size={28} />
                        </div>
                        <div className="flex-1 text-left order-3 md:order-3 px-8">
                            <h3 className="text-3xl font-serif mb-4">4. Compounding Revenue</h3>
                            <p className="text-stone-500 leading-relaxed">
                                You earn every time your data is used for training or RAG. Value compounds as we add deeper annotations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-32 text-center">
                    <Link
                        to="/auth/signup"
                        className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white px-10 py-5 rounded-full text-lg font-medium shadow-2xl hover:bg-black hover:scale-105 transition-all duration-300"
                    >
                        Join the Data Economy <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
