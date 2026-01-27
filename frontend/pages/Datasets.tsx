import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Check, Zap, Layers, Box, Cpu } from 'lucide-react';
import SeoHead from '../components/SeoHead';

const Datasets: React.FC = () => {
  return (
    <div className="w-full bg-[#fcfcfc] text-[#111] selection:bg-black selection:text-white pb-20">
      <SeoHead
        title="Harbor Datasets: Generative Media Engine"
        description="High-fidelity video, audio, and image datasets for generative AI. Curated, licensed, and annotated for production models."
      />

      {/* HERO SECTION: Boxed Style (Matching Pricing) - Light Mode */}
      <section className="relative w-full px-4 md:px-6 py-4 max-w-[1600px] mx-auto">
        <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden bg-black group border border-black/5 shadow-2xl">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60"
            >
              <source src="/Jan_27__1044_32s_202601271148_6xrem.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 pb-12 z-20">
            <div className="max-w-4xl">

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter mb-8 leading-[1.05] text-white">
                Powering the next generation <br /> <span className="text-white/60">of Multimodal Models.</span>
              </h1>
              <p className="text-xl text-white/70 font-light max-w-2xl leading-relaxed mb-10">
                The infrastructure for generative video, audio, and physical intelligence.
                Ingest, curate, and annotate petabytes of unstructured data.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/how-it-works" className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                  <Play size={16} fill="currentColor" />
                  Watch Demo
                </Link>
                <Link to="/app/marketplace" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all w-full sm:w-auto backdrop-blur-sm flex items-center justify-center">
                  Explore Data Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MULTIMEDIA BENTO GRID (Light Mode) */}
      <section className="py-8 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 px-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 text-black">Foundation Datasets</h2>
            <p className="text-gray-500 font-light max-w-lg">
              Curated, rights-cleared collections designed for pre-training and fine-tuning.
            </p>
          </div>
          <Link to="/app/datasets" className="text-sm font-medium border-b border-black/20 pb-1 hover:text-black hover:border-black transition-colors mt-6 md:mt-0 text-gray-500">
            View Full Registry
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* LARGE VIDEO CARD (Spans 8 cols) */}
          <div className="md:col-span-8 h-[500px] rounded-3xl overflow-hidden relative group border border-gray-200 bg-gray-100 shadow-sm hover:shadow-md transition-all">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 scale-125"
            >
              <source src="/industrialautomation.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-10">
              <div className="flex items-center gap-2 text-white/90 mb-2">
                <Cpu size={16} />
                <span className="text-xs font-mono uppercase tracking-widest">Physical Intelligence</span>
              </div>
              <h3 className="text-3xl font-medium mb-3 text-white">Robotics & Manipulation</h3>
              <p className="text-white/80 max-w-md font-light">
                Ego-centric manipulation tasks, teleoperation data, and simulated physics interactions for embodied AI.
              </p>
            </div>
          </div>

          {/* TALL CARD (Spans 4 cols) - Light Mode Override */}
          <div className="md:col-span-4 h-[500px] rounded-3xl overflow-hidden relative group border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6),linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6)] bg-[size:20px_20px] opacity-40"></div>
            <div className="p-10 h-full flex flex-col relative z-10">
              <div className="mb-auto">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-6 text-black">
                  <Layers size={24} />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-black">RLHF Video & Audio</h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  Human preference pairs for video generation.
                  Ranked outputs for temporal consistency, motion fidelity, and prompt alignment.
                </p>
              </div>
              <div className="space-y-3 mt-8">
                {['Temporal Consistency', 'Motion Fidelity', 'Prompt Alignment'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check size={14} className="text-black" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WIDE CARD (Spans 6 cols) */}
          <div className="md:col-span-6 h-[400px] rounded-3xl overflow-hidden relative group border border-gray-200 bg-gray-100 shadow-sm hover:shadow-md transition-all">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            >
              <source src="/style_video_202601271427_5k4jh.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-10">
              <h3 className="text-2xl font-medium mb-2 text-white">Micro Object Detection Data</h3>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 bg-white/20 backdrop-blur rounded text-xs text-white">Counted</span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur rounded text-xs text-white">Verified</span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur rounded text-xs text-white">Labelled</span>
              </div>
            </div>
          </div>

          {/* WIDE CARD (Spans 6 cols) */}
          <div className="md:col-span-6 h-[400px] rounded-3xl overflow-hidden relative group border border-gray-200 bg-gray-100 shadow-sm hover:shadow-md transition-all">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 scale-125"
            >
              <source src="/mix_style_video_1080p_202601271137.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-10">
              <h3 className="text-2xl font-medium mb-2 text-white">Audio-Visual Reasoning</h3>
              <p className="text-white/80 text-sm font-light">Aligned audio-video pairs for multimodal understanding.</p>
            </div>
            <div className="absolute top-6 right-6">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <Play size={16} fill="white" className="ml-0.5 text-white" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CAPABILITIES SECTION (Light Mode) */}
      <section className="py-8 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto border-t border-gray-200 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-lg font-medium text-black mb-6 flex items-center gap-2">
              <Box size={18} className="text-black" />
              Data Curation
            </h3>
            <p className="text-gray-500 font-light leading-relaxed mb-6">
              Filter petabytes of data using semantic search, CLIP embeddings, and custom metadata filters. Build training sets that target specific edge cases.
            </p>
            <a href="#" className="text-sm font-medium text-black border-b border-black/20 pb-0.5 hover:border-black transition-colors">Learn about Curation</a>
          </div>
          <div>
            <h3 className="text-lg font-medium text-black mb-6 flex items-center gap-2">
              <Layers size={18} className="text-black" />
              Annotation Fabric
            </h3>
            <p className="text-gray-500 font-light leading-relaxed mb-6">
              Pixel-perfect segmentation, 3D cuboids, and temporal action localization. Powered by our expert-in-the-loop workforce.
            </p>
            <a href="#" className="text-sm font-medium text-black border-b border-black/20 pb-0.5 hover:border-black transition-colors">View Annotation Specs</a>
          </div>
          <div>
            <h3 className="text-lg font-medium text-black mb-6 flex items-center gap-2">
              <Cpu size={18} className="text-black" />
              Model Evaluation
            </h3>
            <p className="text-gray-500 font-light leading-relaxed mb-6">
              Test your models against our hold-out sets. Verify performance on real-world distribution shifts and edge cases.
            </p>
            <a href="#" className="text-sm font-medium text-black border-b border-black/20 pb-0.5 hover:border-black transition-colors">Start Evaluation</a>
          </div>
        </div>
      </section>

      {/* CTA SECTION (Light Mode) */}
      <section className="py-16 text-center bg-white border-t border-gray-100">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8 text-black">
          Ready to build?
        </h2>
        <div className="flex justify-center gap-6">
          <Link to="/app" className="bg-black text-white px-9 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg">
            Get Started
          </Link>
          <Link to="/contact" className="text-black border border-gray-200 px-9 py-4 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Datasets;