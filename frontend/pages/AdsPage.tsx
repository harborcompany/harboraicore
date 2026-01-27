import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import SeoHead from '../components/SeoHead';

const AdsPage: React.FC = () => {
    return (
        <div className="w-full bg-white text-[#111] animate-in fade-in duration-700 font-sans selection:bg-[#111] selection:text-white">
            <SeoHead
                title="Harbor Ads — Enterprise-Grade Creative Infrastructure"
                description="Scale your creative output on infrastructure you own. Generate, test, and serve video ads with total control."
            />

            {/* SECTION 1: HERO (Large, Left-Aligned, Outcome-Driven) */}
            <section className="pt-32 pb-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto min-h-[80vh] flex flex-col justify-center">
                <div className="max-w-4xl">
                    <h1 className="text-6xl md:text-8xl font-medium tracking-tighter mb-8 leading-[0.95] text-black">
                        Scale your creative <br /> on infrastructure.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mb-12 max-w-xl">
                        Harbor is the only ad production platform that runs on owned infrastructure.
                        Generate 10,000+ video variations without API bottlenecks or rendering queues.
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                        <button className="bg-[#111] text-white px-8 py-4 rounded hover:bg-black transition-all font-medium text-lg">
                            Book a Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 2: IMMEDIATE VALUE PROOF (Value + Clean Visual) */}
            <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto border-t border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6 leading-tight">
                            Why rent creative capacity <br /> when you can own it?
                        </h2>
                        <p className="text-lg text-gray-500 font-light leading-relaxed mb-8">
                            Most platforms are just wrappers around public APIs. Harbor gives you direct access to the metal.
                            This means zero-latency generation, infinite scale, and data privacy by default.
                        </p>
                        <div className="flex flex-col gap-3">
                            {['No per-seat licensing fees', 'Unlimited generation throughput', 'Enterprise-grade SLAs'].map((item) => (
                                <div key={item} className="flex items-center gap-3 text-gray-600 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual: Clean, Light Product/Abstract Frame */}
                    <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-[4/3] border border-gray-100 shadow-sm">
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop"
                            alt="Harbor Infrastructure Dashboard"
                            className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 3: HOW IT WORKS (Step Flow) */}
            <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-200 pt-16">
                    {/* Step 1 */}
                    <div className="space-y-4">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">01 / Input</span>
                        <h3 className="text-xl font-medium text-black">Submit Campaign Assets</h3>
                        <p className="text-gray-500 font-light leading-relaxed">
                            Upload raw video, images, and brand guidelines. Our ingestion engine normalizes everything automatically.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-4">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">02 / System</span>
                        <h3 className="text-xl font-medium text-black">Infrastructure Generation</h3>
                        <p className="text-gray-500 font-light leading-relaxed">
                            The Harbor Engine generates thousands of native-format placements for TikTok, Shorts, and Reels instantly.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-4">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">03 / Outcome</span>
                        <h3 className="text-xl font-medium text-black">Performance & Scale</h3>
                        <p className="text-gray-500 font-light leading-relaxed">
                            Live placements are monitored 24/7. Winning concepts are cycled back into production automatically.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 4: DIFFERENTIATOR (Infrastructure Angle) */}
            <section className="py-32 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto bg-gray-50 rounded-[2rem] my-12">
                <div className="max-w-3xl">
                    <span className="inline-block px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-500 mb-8">
                        The Infrastructure Advantage
                    </span>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-8 leading-tight">
                        Built on Live Linear Video. <br /> Not on File Storage.
                    </h2>
                    <p className="text-lg text-gray-500 font-light leading-relaxed mb-12">
                        Other tools treat video as static files sitting in a bucket. Harbor treats video as a live, programmable stream.
                        This allows us to inject dynamic pricing, localization, and compliance edits into video ads at the moment of delivery.
                    </p>

                    {/* Visual Support */}
                    <div className="h-64 md:h-80 w-full bg-white rounded-xl border border-gray-200 overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-light">
                            {/* Placeholder for Abstract Infrastructure Visualization */}
                            <span className="text-sm uppercase tracking-widest border border-gray-100 px-4 py-2 rounded">Live Stream Architecture</span>
                        </div>
                        {/* Abstract Video Lines */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/20 animate-pulse"></div>
                        <div className="absolute top-[20%] left-0 w-full h-[1px] bg-indigo-500/20 animate-pulse delay-75"></div>
                        <div className="absolute top-[40%] left-0 w-full h-[1px] bg-indigo-500/20 animate-pulse delay-150"></div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: USE CASES (Vertical Blocks - No Logos) */}
            <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: 'Global Brands', desc: 'Maintain strict brand compliance across 500+ localized campaigns.' },
                        { title: 'Performance Agencies', desc: 'Reduce CPA by 40% through high-velocity creative testing.' },
                        { title: 'Ad Tech Platforms', desc: 'Offer white-labeled video generation features to your own users.' },
                        { title: 'Linear Networks', desc: 'Programmatically replace broadcast inventory with targeted digital assets.' }
                    ].map((block, i) => (
                        <div key={i} className="flex flex-col h-full justify-between p-8 border-l border-gray-200 hover:border-black transition-colors group">
                            <div>
                                <h3 className="text-xl font-medium mb-4">{block.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed text-sm">{block.desc}</p>
                            </div>
                            <div className="mt-8 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 6: FINAL CTA (Calm, Centered) */}
            <section className="py-32 px-6 md:px-12 lg:px-16 text-center">
                <div className="max-w-xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-8 text-black">
                        Build your creative <br /> engine today.
                    </h2>
                    <div className="flex justify-center">
                        <button className="bg-[#111] text-white px-10 py-4 rounded hover:bg-black transition-all font-medium text-lg w-full sm:w-auto">
                            Book a Demo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdsPage;
