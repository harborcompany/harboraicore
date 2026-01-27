import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

const UseCases: React.FC = () => {
    return (
        <div className="w-full bg-[#FAFAFA] text-[#111] animate-in fade-in duration-700 min-h-screen font-sans selection:bg-black selection:text-white">
            <SeoHead
                title="Use Cases — Harbor Infrastructure"
                description="Real-world applications of Harbor’s data infrastructure across media, robotics, and enterprise AI."
            />

            {/* SECTION 1: HERO */}
            <section className="relative w-full px-6 pt-24 pb-12 md:pt-32 md:pb-16 max-w-[1400px] mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 text-black leading-[1.05]">
                    How Teams Use Harbor
                </h1>
                <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed mb-10">
                    Real-world applications of Harbor’s data infrastructure across media, robotics, and enterprise AI.
                </p>
                <Link to="/contact" className="bg-[#111] text-white px-8 py-3.5 rounded-full font-medium hover:bg-black transition-all inline-block">
                    Request Dataset Access
                </Link>
            </section>

            {/* SECTION 2: USE CASE 1 - ADS */}
            <section className="w-full py-8 px-6">
                <div className="relative w-full max-w-[1280px] mx-auto rounded-[2.5rem] overflow-hidden min-h-[600px] flex items-center">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/mix_style_video_1080p_202601271137.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="relative z-10 px-6 py-10 md:p-10 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">
                            {/* LEFT COLUMN: Context */}
                            <div className="md:col-span-4 flex flex-col gap-12">
                                <div>
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-4">Ad Tech</span>
                                    <h2 className="text-3xl font-medium tracking-tight text-white leading-tight">
                                        Continuous Creative Training for Automated Advertising
                                    </h2>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-2">Who</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">Brands, agencies, and platforms running ongoing video advertising programs.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-2">Problem</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">Creative fatigue and slow iteration limit performance. Manual ad production can’t keep up with demand or audience segmentation.</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Solution & Details */}
                            <div className="md:col-span-8 flex flex-col gap-12">
                                {/* Solution - Hero Text */}
                                <div>
                                    <h4 className="text-white font-medium text-xs mb-4 uppercase tracking-wide opacity-50">Harbor Solution</h4>
                                    <p className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed">
                                        Harbor ingests a company’s historical creative assets, performance data, and live campaign outputs. Models are trained on this dataset and continuously refreshed using real-world viewing and engagement signals.
                                    </p>
                                </div>



                                {/* Outcome & Unique Factors */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-white/10 pt-8">
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Outcome</h4>
                                        <ul className="space-y-3 text-gray-400 font-light">
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> 10+ new ads delivered monthly</li>
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Creative aligned to brand tone and performance data</li>
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Continuous improvement without manual briefing cycles</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Why Harbor Is Unique</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">
                                            Only Harbor combines live video infrastructure, dataset licensing, continuous feedback loops, and ads delivery as a native product. This is not ad tech layered on AI — it is AI trained inside the media system.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* SECTION 3: USE CASE 2 - ROBOTICS */}
            <section className="w-full py-8 px-6">
                <div className="relative w-full max-w-[1280px] mx-auto rounded-[2.5rem] overflow-hidden min-h-[600px] flex items-center">
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/industrialautomation.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="relative z-10 px-6 py-10 md:p-10 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">
                            {/* LEFT */}
                            <div className="md:col-span-4 flex flex-col gap-12">
                                <div>
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-4">Industrial Automation</span>
                                    <h2 className="text-3xl font-medium tracking-tight text-white leading-tight">
                                        Vision Training for Robotics & Industrial Automation
                                    </h2>
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-2">Who</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">Robotics companies, manufacturers, and automation teams.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-2">Problem</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">Robotic systems fail in edge cases because training data lacks real-world variability.</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="md:col-span-8 flex flex-col gap-12">
                                <div>
                                    <h4 className="text-white font-medium text-xs mb-4 uppercase tracking-wide opacity-50">Harbor Solution</h4>
                                    <p className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed">
                                        Harbor sources, licenses, and annotates highly specific video datasets — such as sewing, assembly, or manipulation tasks — across multiple styles, materials, and environments.
                                    </p>
                                </div>



                                {/* Example Box */}
                                <div className="p-8 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                                    <h4 className="text-white font-medium text-sm mb-3 uppercase tracking-wide">Example: Sewing Automation</h4>
                                    <p className="text-gray-300 font-light mb-4">Training a sewing robot to recognize:</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-white/10 border border-white/10 px-3 py-1.5 rounded text-sm text-gray-300">Different fabrics</span>
                                        <span className="bg-white/10 border border-white/10 px-3 py-1.5 rounded text-sm text-gray-300">Stitch patterns</span>
                                        <span className="bg-white/10 border border-white/10 px-3 py-1.5 rounded text-sm text-gray-300">Garment sizes</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-white/10 pt-8">
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Outcome</h4>
                                        <ul className="space-y-3 text-gray-400 font-light">
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Higher task accuracy</li>
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Faster model convergence</li>
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Reduced reliance on synthetic data</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Why Harbor Is Unique</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">
                                            Harbor can deliver task-specific, real-world video — not scraped clips or lab simulations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: USE CASE 3 - ENTERPRISE AI */}
            <section className="w-full py-8 px-6">
                <div className="relative w-full max-w-[1280px] mx-auto rounded-[2.5rem] overflow-hidden min-h-[600px] flex items-center">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/real_enterprise_meeting_1769477739082.png"
                            alt="Enterprise Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="relative z-10 px-6 py-10 md:p-10 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">
                            {/* LEFT */}
                            <div className="md:col-span-4 flex flex-col gap-12">
                                <div>
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-4">Enterprise AI</span>
                                    <h2 className="text-3xl font-medium tracking-tight text-white leading-tight">
                                        Multimodal Training for Enterprise AI Systems
                                    </h2>
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-2">Who</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">Enterprises building internal AI for monitoring, analysis, or decision support.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-2">Problem</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">Enterprise models need aligned image, audio, and video data — but sourcing compliant multimodal datasets is slow and risky.</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="md:col-span-8 flex flex-col gap-12">
                                <div>
                                    <h4 className="text-white font-medium text-xs mb-4 uppercase tracking-wide opacity-50">Harbor Solution</h4>
                                    <p className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed">
                                        Harbor delivers licensed multimodal datasets with aligned audio, video, and metadata, tuned to enterprise objectives with clear provenance and auditability. Data is delivered via API or bulk export, ready for training and evaluation.
                                    </p>
                                </div>



                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-white/10 pt-8">
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Outcome</h4>
                                        <ul className="space-y-3 text-gray-400 font-light">
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Faster model development</li>
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Reduced legal and compliance risk</li>
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Consistent data across teams</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Why Harbor Is Unique</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">
                                            Harbor treats multimodal data as infrastructure, not static files.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: USE CASE 4 - LIVE DATA */}
            <section className="w-full py-8 px-6">
                <div className="relative w-full max-w-[1280px] mx-auto rounded-[2.5rem] overflow-hidden min-h-[600px] flex items-center">
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/NewVid1.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="relative z-10 px-6 py-10 md:p-10 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">
                            {/* LEFT */}
                            <div className="md:col-span-4 flex flex-col gap-12">
                                <div>
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-4">Continuous Learning</span>
                                    <h2 className="text-3xl font-medium tracking-tight text-white leading-tight">
                                        Continuous Learning from Live Real-World Data
                                    </h2>
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-2">Who</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">AI labs and companies training models that must adapt to changing environments.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-2">Problem</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">Static datasets become outdated. Models trained once fail in dynamic real-world conditions.</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="md:col-span-8 flex flex-col gap-12">
                                <div>
                                    <h4 className="text-white font-medium text-xs mb-4 uppercase tracking-wide opacity-50">Harbor Solution</h4>
                                    <p className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed">
                                        Harbor’s live linear infrastructure streams over 200,000 hours of content annually, enabling continuous dataset refresh and temporal learning.
                                    </p>
                                </div>



                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-white/10 pt-8">
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Outcome</h4>
                                        <ul className="space-y-3 text-gray-400 font-light">
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Models that stay current</li>
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Reduced retraining costs</li>
                                            <li className="flex items-start gap-3"><span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span> Better real-world performance</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Why Harbor Is Unique</h4>
                                        <p className="text-gray-400 font-light leading-relaxed">
                                            No other provider combines live data, licensing, annotation, and delivery into a single continuous pipeline.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CLOSING CTA */}
            <section className="py-16 px-6 text-center bg-gray-50 border-t border-gray-200">
                <div className="max-w-xl mx-auto">
                    <h2 className="text-3xl font-medium tracking-tight mb-8 text-black">
                        Harbor supports multiple data engagement models.
                    </h2>
                    <p className="text-lg text-gray-500 font-light leading-relaxed mb-12">
                        From static datasets to continuous learning pipelines.
                    </p>
                    <div className="flex justify-center">
                        <Link to="/contact" className="bg-[#111] text-white px-8 py-3.5 rounded-full font-medium hover:bg-black transition-all inline-block">
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UseCases;
