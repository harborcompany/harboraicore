import React from 'react';
import { Check, Shield, Zap, Database, ArrowRight, Activity, Layers, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  return (
    <div className="w-full bg-[#F9F8F6]">
      {/* Hero Section - Operational Focus */}
      <section className="pt-32 pb-20 px-6 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-mono uppercase tracking-widest text-stone-500">Strategic Infrastructure Investment</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 leading-[1.1]">
              Predictable costs for <br /><span className="italic text-stone-400">scale-aware</span> pipelines.
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed max-w-2xl">
              Harbor aligns pricing with value creation—whether that's high-quality dataset acquisition, real-time inference throughput, or automated ad generation. We don't charge for seat counts; we charge for scale.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Dimensions - "What you pay for" */}
      <section className="py-20 px-6 bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-xl font-medium mb-12 flex items-center gap-3">
            <Layers size={20} className="text-stone-400" />
            Pricing Dimensions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-stone-600">
            <div>
              <h3 className="text-[#1A1A1A] font-medium mb-3 flex items-center gap-2">
                <Database size={16} /> Data Depth & Exclusivity
              </h3>
              <p className="leading-relaxed">
                Dataset pricing scales based on annotation granularity (e.g., frame-by-frame vs. clip-level) and licensing rights (exclusive vs. non-exclusive). You pay for the signal integrity, not just the gigabytes.
              </p>
            </div>
            <div>
              <h3 className="text-[#1A1A1A] font-medium mb-3 flex items-center gap-2">
                <Zap size={16} /> Throughput & Latency
              </h3>
              <p className="leading-relaxed">
                API usage is billed on query volume and retrieval complexity. Higher tiers guarantee lower latency limits (sub-20ms) and dedicated RAG indexing resources for production-critical applications.
              </p>
            </div>
            <div>
              <h3 className="text-[#1A1A1A] font-medium mb-3 flex items-center gap-2">
                <Shield size={16} /> Indemnification & Governance
              </h3>
              <p className="leading-relaxed">
                Enterprise tiers include comprehensive legal assurances, custom data retention policies, and audit logs. Essential for public companies and regulated industries deploying generative models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Models */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Dataset Licensing */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 rounded-full bg-stone-100 text-xs font-mono mb-4 text-stone-600">FOR TRAINING & RAG</div>
              <h3 className="text-3xl font-serif mb-2 text-[#1A1A1A]">Dataset Licensing</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Direct access to licensed, clean multimodal corpora for foundation model training or RAG knowledge bases.
              </p>
            </div>

            <div className="space-y-4 mb-10 flex-grow font-mono text-sm text-stone-600">
              <div className="flex gap-3">
                <Check size={16} className="text-[#1A1A1A] mt-0.5" />
                <span>One-off perpetual licenses</span>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-[#1A1A1A] mt-0.5" />
                <span>Quarterly update subscriptions</span>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-[#1A1A1A] mt-0.5" />
                <span>Commercial usage rights</span>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-[#1A1A1A] mt-0.5" />
                <span>Raw file + JSON metadata access</span>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-100 mt-auto">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Price Model</div>
                  <div className="text-lg font-medium text-[#1A1A1A]">Variable / Asset</div>
                </div>
                <Link to="/datasets" className="text-sm font-medium hover:underline flex items-center gap-1">
                  Browse Marketplace <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* API Usage */}
          <div className="bg-[#1A1A1A] text-white rounded-3xl p-8 border border-stone-800 shadow-xl flex flex-col relative transform lg:-translate-y-4">
            <div className="absolute top-4 right-4 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <div className="mb-8">
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-mono mb-4 text-white/70">FOR INTEGRATION</div>
              <h3 className="text-3xl font-serif mb-2 text-white">API Usage</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Programmatic access to Harbor's intelligence layer, including vector search, annotation streams, and content generation.
              </p>
            </div>

            <div className="space-y-4 mb-10 flex-grow font-mono text-sm text-white/70">
              <div className="flex gap-3">
                <Check size={16} className="text-white mt-0.5" />
                <span>Usage-based billing (per 1k reqs)</span>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-white mt-0.5" />
                <span>Semantic Vector Search</span>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-white mt-0.5" />
                <span>Real-time Annotation Stream</span>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-white mt-0.5" />
                <span>99.99% Uptime SLA available</span>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 mt-auto">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Price Model</div>
                  <div className="text-lg font-medium text-white">Metered</div>
                </div>
                <Link to="/infrastructure" className="text-sm font-medium hover:text-white text-white/80 hover:underline flex items-center gap-1">
                  View Docs <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Harbor Ads */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 rounded-full bg-rose-50 text-xs font-mono mb-4 text-rose-600">FOR GROWTH</div>
              <h3 className="text-3xl font-serif mb-2 text-[#1A1A1A]">Harbor Ads</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                End-to-end management of AI-generated advertising campaigns. From dataset curation to creative generation and placement.
              </p>
            </div>

            <div className="space-y-4 mb-10 flex-grow font-mono text-sm text-stone-600">
              <div className="flex gap-3">
                <Check size={16} className="text-[#1A1A1A] mt-0.5" />
                <span>Flat monthly retainer</span>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-[#1A1A1A] mt-0.5" />
                <span>Guaranteed creative volume</span>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-[#1A1A1A] mt-0.5" />
                <span>Performance feedback loops</span>
              </div>
              <div className="flex gap-3">
                <Check size={16} className="text-[#1A1A1A] mt-0.5" />
                <span>Dedicated account manager</span>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-100 mt-auto">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Price Model</div>
                  <div className="text-lg font-medium text-[#1A1A1A]">Subscription</div>
                </div>
                <Link to="/ads" className="text-sm font-medium hover:underline flex items-center gap-1">
                  Start Campaign <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Enterprise Context - "The Margin Logic" */}
      <section className="py-24 px-6 bg-[#1A1A1A] text-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Why high-quality data is <br /><span className="italic text-white/50">cheaper</span> than bad data.
            </h2>
            <div className="space-y-8 text-white/70 text-lg leading-relaxed">
              <p>
                The hidden cost of "cheap" web-scraped datasets is the engineering hours spent cleaning them, the model drift caused by low signal-to-noise ratios, and the legal risk of unverified IP.
              </p>
              <p>
                Harbor reverses this equation. By front-loading the cost of rigorous ingestion and expert annotation, we reduce downstream training cycles and hallucination rates in RAG systems.
              </p>
            </div>
            <div className="mt-12">
              <Link to="/contact" className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-stone-200 transition-colors inline-flex items-center gap-2">
                Talk to Enterprise Sales <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Abstract Logic Diagram */}
            <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent rounded-[3rem] p-10 border border-white/10 flex flex-col justify-between">
              {/* Top Logic */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-rose-400">TRADITIONAL WORKFLOW</span>
                  <Activity size={16} className="text-rose-400" />
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full mb-2 overflow-hidden">
                  <div className="h-full w-[80%] bg-rose-500/50"></div>
                </div>
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>Data Cleaning (80%)</span>
                  <span>Training (20%)</span>
                </div>
              </div>

              <div className="text-center font-mono text-white/30 text-xs py-4">VS</div>

              {/* Bottom Logic */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-emerald-400">HARBOR WORKFLOW</span>
                  <Zap size={16} className="text-emerald-400" />
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full mb-2 overflow-hidden">
                  <div className="h-full w-[20%] bg-emerald-500/50"></div>
                </div>
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>Integration (20%)</span>
                  <span>Training (80%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Clarifications */}
      <section className="py-24 px-6 border-b border-stone-200">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-serif text-[#1A1A1A] mb-12 text-center">Operational Explanations</h3>
          <div className="space-y-8">
            <div className="pb-8 border-b border-stone-200">
              <h4 className="font-medium text-lg mb-2">What defines "Commercial Usage Rights"?</h4>
              <p className="text-stone-600 leading-relaxed">
                Datasets purchased with a commercial license include a perpetually irrevocable right to use the data for training internal or external models, including those generating revenue. It explicitly clears IP concerns regarding the raw assets.
              </p>
            </div>
            <div className="pb-8 border-b border-stone-200">
              <h4 className="font-medium text-lg mb-2">How is API volume measured?</h4>
              <p className="text-stone-600 leading-relaxed">
                Volume is an aggregate of query operations (Search), ingestion events (Upload), and generation requests (Ads). We verify metering on a 24-hour rolling basis. Detailed logs are available in the dashboard.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-2">Can we migrate from Monthly to Enterprise?</h4>
              <p className="text-stone-600 leading-relaxed">
                Yes. Enterprise agreements often include retroactive volume discounts for prior API usage and can bundle multiple dataset licenses into a single MSA.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;