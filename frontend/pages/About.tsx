import React from 'react';
import { ArrowRight, Globe, Zap, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
    return (
        <div className="w-full bg-[#F9F8F6]">
            {/* Hero: The Thesis */}
            <section className="pt-32 pb-24 px-6 border-b border-stone-200">
                <div className="max-w-[1400px] mx-auto text-center">
                    <div className="inline-block mb-6">
                        <span className="font-mono text-xs uppercase tracking-widest text-stone-400">THE HARBOR THESIS</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 leading-[1.1] max-w-4xl mx-auto">
                        We built Harbor because the cloud wasn't ready for <span className="italic text-stone-400">sight.</span>
                    </h1>
                    <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
                        The internet was designed for text. The cloud was optimized for JSON. But the future of intelligence is high-fidelity video, and it requires a new kind of physics.
                    </p>
                </div>
            </section>

            {/* The Origin Story */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div className="prose prose-lg text-stone-600">
                        <h3 className="text-2xl font-serif text-[#1A1A1A] mb-6">The Observation</h3>
                        <p className="mb-6">
                            In 2024, we noticed a critical fracture in the AI stack. While models essentially became "multimodal" overnight—learning to see, hear, and speak—the infrastructure feeding them was stuck in 2015.
                        </p>
                        <p className="mb-6">
                            Engineers were storing petabytes of video in generic object storage, treating frames like files instead of data. Retrieval was slow. Context was lost. Costs were astronomical.
                        </p>
                        <p>
                            We realized that for AI to truly perceive the world, it needed a native operating system. One that understood time, continuity, and pixel-level semantics at the metal layer.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="bg-[#1A1A1A] text-white p-10 rounded-2xl shadow-xl relative z-10">
                            <h4 className="font-mono text-xs text-orange-400 mb-4 tracking-wider">FOUNDER NOTE</h4>
                            <p className="font-serif text-2xl leading-relaxed mb-6">
                                "We keep trying to force video into databases designed for spreadsheets. It's not a scale problem; it's a physics problem."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                                <div>
                                    <div className="font-medium">Akeem Ojuko</div>
                                    <div className="text-sm text-white/50">Co-Founder & CEO</div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-4 -right-4 w-full h-full border border-stone-200 rounded-2xl -z-0"></div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 px-6 border-y border-stone-200 bg-[#F9F8F6]">
                <div className="max-w-[1400px] mx-auto">
                    <h2 className="text-3xl font-serif mb-16 text-center">Operating Principles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                        <div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6"><Globe size={20} /></div>
                            <h3 className="font-medium mb-2">Native Infrastructure</h3>
                            <p className="text-sm text-stone-500 leading-relaxed">We own the metal. No abstraction layers. No cloud tax.</p>
                        </div>

                        <div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-6"><Zap size={20} /></div>
                            <h3 className="font-medium mb-2">Speed is Intelligence</h3>
                            <p className="text-sm text-stone-500 leading-relaxed">Latency kills reasoning loops. We optimize for millisecond retrieval.</p>
                        </div>

                        <div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100">
                            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-6"><Shield size={20} /></div>
                            <h3 className="font-medium mb-2">Zero Trust</h3>
                            <p className="text-sm text-stone-500 leading-relaxed">Your IP is your moat. We encrypt it key-to-key.</p>
                        </div>

                        <div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-6"><Clock size={20} /></div>
                            <h3 className="font-medium mb-2">Long Now</h3>
                            <p className="text-sm text-stone-500 leading-relaxed">We build for the next decade of multimodal computing, not the next quarter.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Team / Join CTA */}
            <section className="py-32 px-6 bg-[#1A1A1A] text-white text-center">
                <h2 className="text-3xl md:text-5xl font-serif mb-8">Build the future of perception.</h2>
                <p className="text-white/60 max-w-xl mx-auto mb-12 text-lg">
                    We are a small, high-density team of systems engineers, researchers, and designers. If you care about raw performance and beautiful systems, join us.
                </p>
                <Link to="/contact" className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-stone-200 transition-colors inline-block">
                    View Open Roles
                </Link>
            </section>
        </div>
    );
};

export default About;
