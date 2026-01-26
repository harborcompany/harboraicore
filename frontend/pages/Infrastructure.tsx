import React from 'react';
import { Server, Database, Cloud, Share2, Lock, Activity, ArrowDown, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import SystemFlowDiagram from '../components/SystemFlowDiagram';

const Infrastructure: React.FC = () => {
  return (
    <div className="w-full bg-[#F9F8F6]">
      {/* Hero Section - The "Moat" Argument */}
      <section className="pt-32 pb-24 px-6 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-sm font-mono uppercase tracking-widest text-stone-500">Global Physical Infrastructure</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 leading-[1.1]">
              Why generic cloud stacks <span className="italic text-stone-400">fail</span> at media.
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed mb-8">
              S3 buckets and JSON blobs weren't built for frame-accurate intelligence. They introduce unacceptable latency, incur massive egress costs, and fail to maintain temporal context.
            </p>
            <p className="text-lg font-medium text-[#1A1A1A]">
              Harbor runs on bare metal, optimized for high-throughput tensor operations.
            </p>
          </div>

          {/* Abstract Visual: Cloud vs. Harbor */}
          <div className="bg-[#1A1A1A] rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full"></div>

            <div className="relative z-10 grid grid-cols-2 gap-8 border-b border-white/10 pb-8 mb-8">
              <div>
                <div className="font-mono text-xs text-stone-500 mb-2">GENERIC CLOUD</div>
                <div className="text-3xl font-serif text-white/50">240ms</div>
                <div className="text-xs text-stone-500 mt-1">Retrieval Latency</div>
              </div>
              <div>
                <div className="font-mono text-xs text-orange-400 mb-2">HARBOR METAL</div>
                <div className="text-3xl font-serif text-white">12ms</div>
                <div className="text-xs text-stone-500 mt-1">Retrieval Latency</div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-8">
              <div>
                <div className="font-mono text-xs text-stone-500 mb-2">EGRESS COST</div>
                <div className="text-3xl font-serif text-white/50">$0.09<span className="text-sm">/GB</span></div>
              </div>
              <div>
                <div className="font-mono text-xs text-orange-400 mb-2">HARBOR NETWORK</div>
                <div className="text-3xl font-serif text-white">$0.00<span className="text-sm">/GB</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Canonical System Flow Visual */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-6">Canonical System Flow</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              This diagram represents the <span className="font-semibold text-[#1A1A1A]">fixed execution order</span> of Harbor.
              Data flows strictly top to bottom—no shortcuts, no abstractions, no skipping layers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SystemFlowDiagram />
            </div>

            <div className="space-y-12 pt-8">
              <div>
                <h3 className="text-xl font-serif mb-4 flex items-center gap-3">
                  <div className="w-8 h-px bg-stone-300"></div>
                  Hard Contract
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2.5"></div>
                    <div>
                      <strong className="block text-[#1A1A1A] mb-1">Strict Layer Adherence</strong>
                      <p className="text-stone-600 text-sm">Nothing skips layers. No dataset exists without annotation. No distribution without RAG.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2.5"></div>
                    <div>
                      <strong className="block text-[#1A1A1A] mb-1">Provenance First</strong>
                      <p className="text-stone-600 text-sm">Every asset has an owner, consent state, and source before it enters the ingestion layer.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2.5"></div>
                    <div>
                      <strong className="block text-[#1A1A1A] mb-1">RAG-Native</strong>
                      <p className="text-stone-600 text-sm">Datasets are living systems. If a dataset is not RAG-enabled, it is incomplete.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
                <h4 className="font-mono text-xs uppercase tracking-widest text-stone-500 mb-6">Service Guarantees</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-2xl font-serif text-[#1A1A1A] mb-1">100%</div>
                    <div className="text-xs text-stone-500">Provenance Coverage</div>
                  </div>
                  <div>
                    <div className="text-2xl font-serif text-[#1A1A1A] mb-1">Zero</div>
                    <div className="text-xs text-stone-500">Anonymous Ingest</div>
                  </div>
                  <div>
                    <div className="text-2xl font-serif text-[#1A1A1A] mb-1">Real-time</div>
                    <div className="text-xs text-stone-500">Vector Indexing</div>
                  </div>
                  <div>
                    <div className="text-2xl font-serif text-[#1A1A1A] mb-1">Immutable</div>
                    <div className="text-xs text-stone-500">Version History</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scale Metrics */}
      <section className="py-24 px-6 bg-[#1A1A1A] text-white">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-16">Metrics that matter.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="text-4xl md:text-6xl font-serif mb-2">99.99%</div>
              <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Global Uptime</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-serif mb-2">2.4 PB</div>
              <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Monthly Ingest</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-serif mb-2">12ms</div>
              <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Vector Retrieval</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-serif mb-2">SOC 2</div>
              <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Type II Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Lock size={48} className="mx-auto mb-6 text-stone-300" />
          <h2 className="text-3xl font-serif mb-6 text-[#1A1A1A]">Bank-grade security for your assets.</h2>
          <p className="text-stone-600 leading-relaxed mb-12">
            We understand that proprietary datasets are your most valuable IP. Harbor operates with a zero-trust architecture, ensuring that data is encrypted at rest, in transit, and during computation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-6 py-3 bg-white border border-stone-200 rounded-full text-sm font-medium text-stone-600">End-to-End Encryption</span>
            <span className="px-6 py-3 bg-white border border-stone-200 rounded-full text-sm font-medium text-stone-600">VPC Peering</span>
            <span className="px-6 py-3 bg-white border border-stone-200 rounded-full text-sm font-medium text-stone-600">Role-Based Access Control</span>
            <span className="px-6 py-3 bg-white border border-stone-200 rounded-full text-sm font-medium text-stone-600">Audit Logging</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Infrastructure;