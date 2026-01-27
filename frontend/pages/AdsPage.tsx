import React, { useState } from 'react';
import { ArrowRight, Check, Play, Pause, X } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { Link } from 'react-router-dom';

const AdsPage: React.FC = () => {
    return (
        <div className="w-full bg-white text-[#111] animate-in fade-in duration-700 font-sans selection:bg-[#111] selection:text-white">
            <SeoHead
                title="Harbor Ads: Make Better Ads Faster"
                description="Make Better Ads Faster: With Real Media, Real Data. Generate, test, and deploy high-performance video creatives at scale."
            />

            {/* SECTION 1: HERO */}
            <section className="pt-32 pb-24 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto min-h-[90vh] flex flex-col justify-center">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.05] text-black">
                        Make Better Ads Faster: <br /> With Real Media, Real Data
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mb-10 max-w-4xl mx-auto">
                        Harbor’s ad platform uses your data and real media insights to generate, test, and deploy high-performance video creatives at scale, continuously and automatically.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/contact" className="bg-[#111] text-white px-8 py-4 rounded hover:bg-black transition-all font-medium text-lg w-full sm:w-auto text-center">
                            Book Demo
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-gray-500 font-medium">
                        Trusted by media, growth, and AI teams building data-driven ad pipelines.
                    </p>
                </div>

                {/* Hero Visual: ads_creative_pipeline.webp */}
                {/* Hero Visual: 8second_fastcut_ad */}
                <div className="relative w-full max-w-7xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover scale-110"
                    >
                        <source src="/8second_fastcut_ad_1080p_202601271456.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay to ensure text readability if needed, though clean visual is preferred */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50 pointer-events-none"></div>
                </div>
            </section>

            {/* SECTION 2: WHAT HARBOR ADS DELIVERS */}
            <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto border-t border-gray-100">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1">
                        <span className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-4 block">What Harbor Ads Delivers</span>
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6 leading-tight">
                            A Constant Stream of Tested, <br /> High-Performance Creatives
                        </h2>
                        <ul className="space-y-4 mb-8">
                            {[
                                'Fresh video ad concepts delivered weekly',
                                'Uses your footage + Harbor’s media engine',
                                'Designed for paid social, search, and streaming campaigns'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-lg text-gray-600 font-light">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="text-gray-500 font-light leading-relaxed border-l-2 border-blue-600 pl-6">
                            Harbor doesn’t just generate clips; we produce performance-oriented creatives informed by real viewing signals and live media behavior.
                        </p>
                    </div>
                    {/* Visual: Algorithm -> Output Pipeline Placeholder (using code visual or abstract) */}
                    <div className="flex-1 w-full relative aspect-square md:aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        >
                            <source src="/adpagevideo2.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </section>

            {/* SECTION 3: HOW IT WORKS (4 Steps) */}
            <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto bg-gray-50 rounded-[3rem] my-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">How It Works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            step: '01',
                            title: 'Upload or connect media',
                            desc: 'Upload footage or link existing media libraries. Your content becomes training data for creative generation.'
                        },
                        {
                            step: '02',
                            title: 'Generate multivariate creatives',
                            desc: 'Harbor’s engine produces variations across hooks, angles, and formats.'
                        },
                        {
                            step: '03',
                            title: 'Test against real signals',
                            desc: 'We measure what resonates and prioritize winners.'
                        },
                        {
                            step: '04',
                            title: 'Iterate continuously',
                            desc: 'New creative versions spin out automatically as trends evolve.'
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-4xl font-light text-gray-200 mb-6">{item.step}</div>
                            <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-light">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Mid-page visual: Keep_the_same_2k_202601271703.jpeg */}
                <div className="mt-20 relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                    <img
                        src="/Keep_the_same_2k_202601271703.jpeg"
                        alt="Global Media Ingestion Pipeline"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </section>

            {/* SECTION 4: WHY HARBOR IS DIFFERENT */}
            <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div>
                        <span className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-4 block">Why Harbor is Different</span>
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-8 leading-tight">
                            Built on Media, Not Templates
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-400 mb-2">Most ad platforms are:</h3>
                                <ul className="flex flex-wrap gap-2">
                                    {['Manual agencies', 'Template generators', 'Script-only tools'].map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">{tag}</span>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-black mb-4">Harbor is data-native:</h3>
                                <ul className="space-y-4">
                                    {[
                                        'Ads are informed by the same media that fuels our audio & video data engine',
                                        'We source and process your content, not just remix it',
                                        'Results feed both your campaigns and our dataset pipelines'
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black mt-2.5 shrink-0" />
                                            <p className="text-gray-600 font-light leading-relaxed">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <p className="mt-8 text-lg font-medium text-black">
                            This means your creatives improve over time as the system learns what actually works.
                        </p>
                    </div>

                    {/* Visual: usecase_ads.webp (Real ad outputs/dashboard) */}
                    <div className="relative rounded-2xl overflow-hidden bg-gray-50 shadow-lg border border-gray-100 aspect-square">
                        <img
                            src="/newscreenshot44.jpg"
                            alt="Data Native Ads"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 5: WHAT YOU GET */}
            <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto border-t border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start mb-16">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight">What You Get</h2>
                    <p className="text-gray-500 font-light max-w-md mt-4 md:mt-0">
                        This isn’t a tool you fiddle with, it’s a creative delivery engine that produces test-ready assets you can run immediately.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
                    {[
                        'Weekly ad concepts built from real media',
                        'Variant testing across formats (16:9, 9:16, 1:1)',
                        'Automated optimization signals',
                        'Compliance & metadata tagging from our data engine',
                        'Enterprise workflows & delivery (API, exports)'
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 flex items-start gap-4">
                            <div className="text-blue-600 mt-1">
                                <Check size={18} strokeWidth={3} />
                            </div>
                            <span className="text-gray-700 font-medium">{item}</span>
                        </div>
                    ))}
                    {/* Filler block to complete grid if needed or just leave as is */}
                    <div className="bg-blue-50 p-8 flex items-center justify-center text-center">
                        <span className="text-blue-900 font-medium text-sm">Ready to scale?</span>
                    </div>
                </div>
            </section>

            {/* SECTION 6: WHO IT'S FOR */}
            <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto">
                <h2 className="text-3xl font-medium mb-12">Who It's For</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { title: 'Brands & Growth Teams', desc: 'Scale creative output without adding headcount.' },
                        { title: 'Performance Marketers', desc: 'Test more concepts, find winners faster.' },
                        { title: 'Agencies', desc: 'Deliver more value to clients with systematic variation.' },
                        { title: 'Multimodal AI Teams', desc: 'Generate media assets that also feed training pipelines.' }
                    ].map((card, i) => (
                        <div key={i} className="group p-6 rounded-xl border border-gray-200 hover:border-black transition-colors cursor-default">
                            <h3 className="text-lg font-medium mb-3 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                            <p className="text-gray-500 font-light text-sm">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 7: ENGAGEMENT & CTA */}
            <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto bg-[#111] text-white rounded-[3rem] mb-12 overflow-hidden relative">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">
                            Simple, Transparent <br /> Engagement
                        </h2>

                        <div className="space-y-8 mb-12">
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Subscription + Workflows</h3>
                                <p className="text-gray-400 font-light">We collaborate on briefs and data connections so Harbor can generate, refine, and test ads continuously.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Enterprise Mode</h3>
                                <p className="text-gray-400 font-light">Integrations via API, pipeline automation, compliance readiness, and rich media analytics.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/contact" className="bg-white text-black px-8 py-4 rounded hover:bg-gray-100 transition-all font-medium text-lg w-full sm:w-auto text-center">
                                Book Demo
                            </Link>
                            <Link to="/datasets" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded hover:bg-white/10 transition-all font-medium text-lg w-full sm:w-auto text-center">
                                Request Dataset Access
                            </Link>
                        </div>
                    </div>

                    {/* End Visual: Abstract Multimodal Schematic */}
                    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                        <img
                            src="/Make_the_background_202601271704.jpeg"
                            alt="Multimodal Data Infrastructure"
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                    </div>
                </div>

                {/* Final Repeater CTA */}
                <div className="mt-24 pt-12 border-t border-white/10 text-center">
                    <h2 className="text-2xl md:text-3xl font-medium mb-8">Ready to Generate Better Ads with Real Media?</h2>
                    <Link to="/contact" className="bg-blue-600 text-white px-10 py-4 rounded-full hover:bg-blue-500 transition-all font-medium text-lg shadow-lg hover:shadow-blue-500/25 inline-block">
                        Book Demo
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AdsPage;
