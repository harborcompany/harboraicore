import React from 'react';
import SeoHead from '../components/SeoHead';

const About: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24 px-6">
            <SeoHead
                title="About Harbor: Built for Real-World AI"
                description="Harbor was created to solve a foundational limitation in artificial intelligence: access to high-quality, rights-cleared, real-world data at scale."
            />

            <div className="max-w-[640px] mx-auto">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-8">Purpose</span>

                <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#111] mb-12 leading-[1.1]">
                    Built for Real-World AI Systems
                </h1>

                <div className="space-y-8 text-lg md:text-xl font-light text-gray-600 leading-relaxed font-sans">
                    <p>
                        Harbor was created to solve a foundational limitation in artificial intelligence: access to high-quality, rights-cleared, real-world data at scale.
                    </p>
                    <p>
                        Modern models require more than static datasets. They require continuous signal, clear provenance, and infrastructure that supports iteration in production environments.
                    </p>
                    <p>
                        Harbor operates its own data and compute infrastructure, enabling licensed sourcing, live data ingestion, annotation, and delivery as a unified system rather than disconnected services.
                    </p>
                    <p>
                        Today, Harbor supports image, audio, and video data across research, training, and deployment workflows for enterprises and AI labs.
                    </p>
                </div>

                <div className="mt-20 pt-12 border-t border-gray-100">
                    <p className="text-lg font-medium text-[#111]">
                        Harbor is infrastructure: not a marketplace, not a gig platform, and not a data broker.
                    </p>
                    <div className="mt-8">
                        <a href="/contact" className="text-sm font-medium text-[#1A1A1A] border-b border-black/20 pb-0.5 hover:border-black transition-colors">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
