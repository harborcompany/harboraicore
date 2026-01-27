import React from 'react';
import { Check, Info } from 'lucide-react';
import SeoHead from '../components/SeoHead';

const Pricing: React.FC = () => {
  return (
    <div className="w-full bg-[#050505] text-white animate-in fade-in duration-700 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      <SeoHead
        title="Harbor Pricing: Enterprise AI & Media"
        description="Flexible pricing built for scope, usage, and integration. Advertising solutions, training data, and custom enterprise contracts."
      />

      {/* Hero Section - Matching Landing.tsx */}
      <section className="relative w-full px-4 md:px-6 py-4 max-w-[1600px] mx-auto">
        <div className="relative w-full h-[65vh] md:h-[70vh] rounded-2xl overflow-hidden bg-[#0B0F19] group border border-white/5">
          {/* Video/Image Background */}
          <img src="https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2960&auto=format&fit=crop" alt="Pricing Background" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3s] ease-out saturate-0 group-hover:saturate-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/20 to-transparent"></div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 pb-16">
            <div className="max-w-4xl">
              <h1 className="h1-hero mb-6 text-white text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9]">
                Flexible Pricing <br />
                <span className="text-gray-400">Built for Scale.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 font-light max-w-xl leading-relaxed mb-10">
                Harbor offers two standalone product lines: <span className="text-white font-medium">Advertising Solutions</span> and <span className="text-white font-medium">AI Training Data</span>.
              </p>

              <div className="mt-8"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards (3 Columns) */}
      <section className="px-6 pb-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

          {/* Card 1: Advertising Solutions */}
          <div className="flex flex-col bg-[#0A0A0A] rounded-[2rem] p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-[#0F0F0F] group">
            <div className="mb-8">
              <h3 className="text-2xl font-medium text-white mb-2">Advertising Solutions</h3>
              <p className="text-gray-500 text-sm leading-relaxed min-h-[40px]">
                Run high-performance video advertising across Harbor’s streaming infrastructure.
              </p>
            </div>
            <div className="flex-grow space-y-4 mb-12">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-600 mb-4">Capabilities</p>
              {[
                'Contextual video ad placement',
                'Audience segmentation & targeting',
                'Performance analytics',
                'Managed campaign optimization',
                'Behavioral targeting (Add-on)'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={16} className="text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <button className="w-full bg-white text-black py-4 rounded-full font-medium hover:bg-gray-200 transition-colors mb-3">
                Book Demo
              </button>
              <p className="text-center text-[10px] text-gray-600">
                Customized based on campaign goals
              </p>
            </div>
          </div>

          {/* Card 2: AI Training Data (Foundation) */}
          <div className="flex flex-col bg-[#0A0A0A] rounded-[2rem] p-8 border border-indigo-500/30 ring-1 ring-indigo-500/20 hover:border-indigo-500/50 transition-all hover:bg-[#0F0F0F] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/20">
                Most Popular
              </span>
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-medium text-white mb-2">Foundation Access</h3>
              <p className="text-gray-500 text-sm leading-relaxed min-h-[40px]">
                Access to curated, rights-cleared video datasets prepared for ML workflows.
              </p>
            </div>
            <div className="flex-grow space-y-4 mb-12">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-600 mb-4">Includes</p>
              {[
                'Licensed & verified video',
                'Structured metadata & manifests',
                'Audio & text alignment',
                'Standard dataset exports',
                'Rights-cleared for training'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <button className="w-full bg-indigo-600 text-white py-4 rounded-full font-medium hover:bg-indigo-500 transition-colors mb-3 shadow-lg shadow-indigo-900/20">
                Request Access
              </button>
              <p className="text-center text-[10px] text-gray-600">
                Ideal for baseline training & research
              </p>
            </div>
          </div>

          {/* Card 3: Enterprise / Custom */}
          <div className="flex flex-col bg-[#0A0A0A] rounded-[2rem] p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-[#0F0F0F]">
            <div className="mb-8">
              <h3 className="text-2xl font-medium text-white mb-2">Custom & Enterprise</h3>
              <p className="text-gray-500 text-sm leading-relaxed min-h-[40px]">
                Highly tailored datasets and annotation workflows built for specific objectives.
              </p>
            </div>
            <div className="flex-grow space-y-4 mb-12">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-600 mb-4">Enterprise Features</p>
              {[
                'Custom data capture & sourcing',
                'Expert annotation (RLHF)',
                'Quality assurance & validation',
                'Dedicated support & SLAs',
                'Full audit documentation'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={16} className="text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <button className="w-full bg-transparent border border-white/20 text-white py-4 rounded-full font-medium hover:bg-white/10 transition-colors mb-3">
                Contact Sales
              </button>
              <p className="text-center text-[10px] text-gray-600">
                For regulated industries & autonomous systems
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* How Pricing Works (Bottom Section - AIBC Text Layout) */}
      <section className="py-24 px-6 border-t border-white/5 mx-auto max-w-[1600px]">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-medium tracking-tight mb-4">How Pricing Works</h2>
            <p className="text-gray-400 font-light leading-relaxed">
              Harbor pricing reflects the value and complexity of each engagement. All plans are customized to align with enterprise workflows and long-term partnerships.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="flex items-center gap-2 text-white font-medium mb-2">
                <Info size={16} className="text-gray-500" /> Dataset Scope
              </h4>
              <p className="text-sm text-gray-500 font-light">Pricing based on dataset size, modality complexity, and unique capture requirements.</p>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-white font-medium mb-2">
                <Info size={16} className="text-gray-500" /> Annotation Depth
              </h4>
              <p className="text-sm text-gray-500 font-light">Costs scale with the granularity of labeling and the level of expert review needed.</p>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-white font-medium mb-2">
                <Info size={16} className="text-gray-500" /> Compliance
              </h4>
              <p className="text-sm text-gray-500 font-light">Enterprise plans include indemnification, extensive audit logs, and custom retention.</p>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-white font-medium mb-2">
                <Info size={16} className="text-gray-500" /> API Usage
              </h4>
              <p className="text-sm text-gray-500 font-light">Metered billing for continuous pipeline ingestion and manifest retrieval.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;