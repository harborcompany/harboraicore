import React from 'react';
import { Layers, Cpu, Network, ArrowRight, Shield, Zap, Search, Database, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const Product: React.FC = () => {
  return (
    <div className="w-full bg-[#F9F8F6]">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-sm font-mono uppercase tracking-widest text-stone-500">The Harbor Operating System</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 leading-[1.1] max-w-4xl">
            A unified kernel for <br /><span className="italic text-stone-400">multimodal intelligence.</span>
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mb-12">
            Harbor isn't just a database. It's a complete operating environment that orchestrates the lifecycle of video and audio data—from high-throughput ingestion to vectorized retrieval.
          </p>

          {/* Architecture Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-stone-200 pt-8">
            <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
              <div className="text-xs font-mono text-stone-400 mb-2">LAYER 01</div>
              <div className="font-semibold text-lg mb-1">Ingestion</div>
              <div className="text-sm text-stone-500">Zero-copy processing & normalization</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
              <div className="text-xs font-mono text-stone-400 mb-2">LAYER 02</div>
              <div className="font-semibold text-lg mb-1">Annotation</div>
              <div className="text-sm text-stone-500">Frame-accurate semantic labeling</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
              <div className="text-xs font-mono text-stone-400 mb-2">LAYER 03</div>
              <div className="font-semibold text-lg mb-1">Intelligence</div>
              <div className="text-sm text-stone-500">Vectorized RAG & Embeddings</div>
            </div>
            <div className="p-4 bg-stone-900 text-white rounded-xl shadow-sm flex flex-col justify-center">
              <div className="font-semibold text-lg mb-1 flex items-center gap-2">
                Output <ArrowRight size={16} />
              </div>
              <div className="text-sm text-white/60">Training-ready tensors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Modules */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto space-y-32">

          {/* L1: Ingestion */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-xl mb-6">
                <Network className="text-blue-600" size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-[#1A1A1A]">Ingestion Engine</h2>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                A distributed ingestion pipeline designed for petabyte-scale media. It handles transcoding, silence detection, and speaker diarization automatically upon upload, normalizing messy inputs into a pristine master format.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Zap size={18} className="text-stone-400 mt-1" />
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Throughput-Aware Sizing</div>
                    <div className="text-sm text-stone-500">Auto-scales workers based on input queue velocity.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield size={18} className="text-stone-400 mt-1" />
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">PII Scrubbing</div>
                    <div className="text-sm text-stone-500">Automated blur and tone-out for GDPR compliance.</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-[#111] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img
                src="/assets/ingestion_pipeline_diagram_1769172100769.png"
                alt="Ingestion Pipeline Diagram"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          </div>

          {/* L2: Annotation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
            <div className="order-2 lg:order-1 rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
              <img
                src="/assets/video_annotation_infra_1769158183126.png"
                alt="Annotation Interface"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 bg-rose-50 flex items-center justify-center rounded-xl mb-6">
                <Layers className="text-rose-600" size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-[#1A1A1A]">Annotation Interface</h2>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                The industry's most precise semantic labeling environment. Unlike generic image labelers, Harbor enables temporal consistency tracking—objects are ID'd once and tracked across frames.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Code size={18} className="text-stone-400 mt-1" />
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Model-Assisted Labeling</div>
                    <div className="text-sm text-stone-500">Pre-labels scenes using best-in-class SAM and Whisper models.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield size={18} className="text-stone-400 mt-1" />
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Consensus Review</div>
                    <div className="text-sm text-stone-500">Requires multi-annotator agreement for Golden Set data.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* L3: RAG Kernel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center rounded-xl mb-6">
                <Cpu className="text-emerald-600" size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-[#1A1A1A]">RAG Kernel</h2>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                Your data isn't just stored; it's vectorized. Harbor maintains a live index of multimodal embeddings, allowing you to query video content semantically (e.g., "Find clips of a red car turning left in rain").
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Search size={18} className="text-stone-400 mt-1" />
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Semantic Retrieval</div>
                    <div className="text-sm text-stone-500">Natural language search over hours of unlabelled footage.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Database size={18} className="text-stone-400 mt-1" />
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Dynamic Context Window</div>
                    <div className="text-sm text-stone-500">Injects relevant video frames directly into LLM prompts.</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-[#050505] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
              <img
                src="/assets/vector_space_visualization_1769172116622.png"
                alt="Vector Space Visualization"
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Designed For Segments */}
      <section className="py-24 px-6 bg-[#1A1A1A] text-white">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-serif mb-16 text-center">Built for production roles.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="font-mono text-xs text-blue-400 mb-4 tracking-wider">ML ENGINEERS</div>
              <h3 className="text-xl font-medium mb-3">Training Data Pipelines</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Automate the flow from raw dump to Cleaned/Split/Augmented datasets. Version control every experiment.
              </p>
              <div className="text-xs font-mono text-white/40">Dependencies: Python SDK, CLI</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="font-mono text-xs text-rose-400 mb-4 tracking-wider">PRODUCT MANAGERS</div>
              <h3 className="text-xl font-medium mb-3">Feature Verification</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Visually inspect edge cases where the model fails. Create curated "Challenge Sets" for regression testing.
              </p>
              <div className="text-xs font-mono text-white/40">Dependencies: Dashboard, Analytics</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="font-mono text-xs text-emerald-400 mb-4 tracking-wider">TRUST & SAFETY</div>
              <h3 className="text-xl font-medium mb-3">Content Governance</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Audit model outputs against safety guidelines. Flag and filter toxic content before it hits production.
              </p>
              <div className="text-xs font-mono text-white/40">Dependencies: Audit Logs, RBAC</div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-8">Ready to upgrade your stack?</h2>
        <div className="flex justify-center gap-6">
          <Link to="/contact" className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-medium hover:bg-black transition-colors">
            Request Architecture Review
          </Link>
          <Link to="/infrastructure" className="px-8 py-4 bg-white border border-stone-200 text-[#1A1A1A] rounded-full font-medium hover:bg-stone-50 transition-colors">
            View Infrastructure Specs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Product;