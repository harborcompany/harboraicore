import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Database, Shield, Zap, CheckCircle2 } from 'lucide-react';

const SeoLanding = () => {
    const { slug } = useParams<{ slug: string }>();

    // In a real app, we'd fetch this from the backend based on slug
    // For demo/pSEO scale, we generate unique content based on slug parts
    const title = slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Multimodal Intelligence';

    return (
        <div className="min-h-screen bg-[#F9F8F6] pt-32 pb-24 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-xs font-mono font-medium tracking-[0.3em] text-stone-400 mb-6 uppercase">Programmatic Research | {slug}</div>

                <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 leading-[1.1]">
                    {title} <span className="italic text-stone-400">Scale and Compliance.</span>
                </h1>

                <p className="text-xl md:text-2xl text-stone-600 mb-12 leading-relaxed font-light">
                    Optimizing human-in-the-loop workflows for {title.toLowerCase()} requires high-throughput ingestion and frame-accurate verification. Harbor provides the infrastructure layer to bridge raw data and model-ready insights.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                        <Database className="text-[#1A1A1A] mb-4" size={32} />
                        <h3 className="text-xl font-serif mb-2">Automated Data Ingestion</h3>
                        <p className="text-stone-500 text-sm leading-relaxed">
                            Scale your {title.toLowerCase()} pipelines with Harbor’s L1 network, designed for petabyte-scale audio and video data handling with zero downtime.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                        <Shield className="text-[#1A1A1A] mb-4" size={32} />
                        <h3 className="text-xl font-serif mb-2">Technical Compliance</h3>
                        <p className="text-stone-500 text-sm leading-relaxed">
                            Every item in the {title.toLowerCase()} dataset is tracked with cryptographically signed lineage, ensuring full enterprise compliance for audit trails.
                        </p>
                    </div>
                </div>

                {/* FAQ Style - Critical for pSEO Indexing */}
                <div className="border-t border-stone-200 pt-16">
                    <h2 className="text-3xl font-serif mb-8 text-[#1A1A1A]">Technical Specifications for {title}</h2>
                    <div className="space-y-6">
                        {[
                            { q: `What is the latency profile for ${title} datasets?`, a: "Harbor maintains sub-12ms retrieval times for indexed multimodal embeddings across global regions." },
                            { q: `How does Harbor handle ${title.toLowerCase()} frame-accuracy?`, a: "Our annotation engine supports SMPTE timecode alignment and per-frame confidence scoring as standard." },
                            { q: `Can I integrate existing S3 buckets for ${title}?`, a: "Yes, Harbor connects directly to your private infrastructure without data duplication, acting as an abstraction layer." }
                        ].map((faq, i) => (
                            <div key={i} className="group">
                                <h4 className="text-lg font-serif text-[#1A1A1A] mb-2">{faq.q}</h4>
                                <p className="text-stone-500 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center">
                    <Link to="/contact" className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:bg-black transition-all">
                        Request System Access for {title}
                    </Link>
                    <Link to="/explore" className="mt-6 text-stone-400 text-sm hover:text-stone-600 transition-colors flex items-center gap-2">
                        View All Industry Hubs <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SeoLanding;
