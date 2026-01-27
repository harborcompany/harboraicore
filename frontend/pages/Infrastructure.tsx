import React from 'react';
import { Server, Database, Cloud, Share2, Lock, Activity, ArrowDown, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import SystemFlowDiagram from '../components/SystemFlowDiagram';

const Infrastructure: React.FC = () => {
  return (
    <div className="w-full bg-white animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative w-full px-4 md:px-6 py-4 max-w-[1600px] mx-auto">
        <div className="relative w-full h-[70vh] md:h-[75vh] rounded-2xl overflow-hidden bg-[#0B0F19] group border border-white/5">
          {/* Video/Image Background */}
          <img src="https://images.unsplash.com/photo-1558494949-ef526b01201b?q=80&w=2600&auto=format&fit=crop" alt="Server Infrastructure" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[3s] ease-out saturate-0 group-hover:saturate-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent"></div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 pb-16">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  Global Infrastructure
                </span>
              </div>
              <h1 className="h1-hero mb-6 text-white">
                Why Generic Cloud Stacks <br /> <span className="text-gray-400 italic">Fail</span> at Media.
              </h1>
              <p className="text-lg md:text-xl text-gray-400 font-light max-w-xl leading-relaxed mb-10">
                S3 buckets and JSON blobs weren't built for frame-accurate intelligence. Harbor runs on bare metal, optimized for high-throughput tensor operations.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="btn-primary flex items-center gap-2">
                  View Architecture
                  <ArrowDown size={14} />
                </button>
                <button className="btn-secondary">
                  Read The Spec
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Canonical System Flow Visual */}
      <section className="py-24 px-4 md:px-6 bg-white max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 text-gray-900">Canonical System Flow</h2>
          <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
            This diagram represents the <span className="font-medium text-gray-900">fixed execution order</span> of Harbor.
            Data flows strictly top to bottom—no shortcuts, no abstractions, no skipping layers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <SystemFlowDiagram />
          </div>

          <div className="space-y-12 pt-8">
            <div>
              <h3 className="text-xl font-medium tracking-tight mb-4 flex items-center gap-3 text-gray-900">
                <div className="w-8 h-px bg-gray-300"></div>
                Hard Contract
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5"></div>
                  <div>
                    <strong className="block text-gray-900 mb-1 font-medium">Strict Layer Adherence</strong>
                    <p className="text-gray-500 text-sm font-light">Nothing skips layers. No dataset exists without annotation. No distribution without RAG.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5"></div>
                  <div>
                    <strong className="block text-gray-900 mb-1 font-medium">Provenance First</strong>
                    <p className="text-gray-500 text-sm font-light">Every asset has an owner, consent state, and source before it enters the ingestion layer.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5"></div>
                  <div>
                    <strong className="block text-gray-900 mb-1 font-medium">RAG-Native</strong>
                    <p className="text-gray-500 text-sm font-light">Datasets are living systems. If a dataset is not RAG-enabled, it is incomplete.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-6">Service Guarantees</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-serif text-gray-900 mb-1">100%</div>
                  <div className="text-xs text-gray-500">Provenance Coverage</div>
                </div>
                <div>
                  <div className="text-2xl font-serif text-gray-900 mb-1">Zero</div>
                  <div className="text-xs text-gray-500">Anonymous Ingest</div>
                </div>
                <div>
                  <div className="text-2xl font-serif text-gray-900 mb-1">Real-time</div>
                  <div className="text-xs text-gray-500">Vector Indexing</div>
                </div>
                <div>
                  <div className="text-2xl font-serif text-gray-900 mb-1">Immutable</div>
                  <div className="text-xs text-gray-500">Version History</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scale Metrics */}
      <section className="py-24 px-4 md:px-6 bg-gray-900 text-white mx-4 md:mx-6 rounded-[2rem] mb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter mb-16">Metrics that matter.</h2>
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
          <Lock size={48} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-3xl font-serif mb-6 text-gray-900">Bank-grade security for your assets.</h2>
          <p className="text-gray-600 leading-relaxed mb-12">
            We understand that proprietary datasets are your most valuable IP. Harbor operates with a zero-trust architecture, ensuring that data is encrypted at rest, in transit, and during computation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600">End-to-End Encryption</span>
            <span className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600">VPC Peering</span>
            <span className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600">Role-Based Access Control</span>
            <span className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600">Audit Logging</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Infrastructure;