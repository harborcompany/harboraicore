import React from 'react';
import { Play, Sparkles, Target, BarChart3, Repeat, ArrowRight, Upload, Video, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

const Ads: React.FC = () => {
  return (
    <div className="w-full bg-[#050505] text-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-sm font-mono uppercase tracking-widest text-stone-400">Creative Automation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.1]">
              Scale your chaos. <br /><span className="italic text-stone-500">Automate</span> your wins.
            </h1>
            <p className="text-xl text-stone-400 leading-relaxed max-w-lg mb-8">
              Harbor Ads isn't an agency. It's an algorithmic production engine that turns one core asset into thousands of platform-native variations, optimizing for ROAS in real-time.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-stone-200 transition-colors">
                Start Campaign
              </Link>
              <button className="px-8 py-4 border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                <Play size={16} /> Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual: The "Engine" */}
          <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 shadow-2xl aspect-video flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Sparkles size={120} className="text-rose-500" />
            </div>

            <div className="flex justify-between items-start z-10">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="text-xs font-mono text-stone-500 mb-1">INPUT ASSET</div>
                <div className="w-16 h-9 bg-stone-700/50 rounded"></div>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-white/10 mt-8 mx-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0A0A0A] px-2 text-xs font-mono text-stone-500">GENERATING 24 VARIANTS</div>
              </div>
              <div className="bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                <div className="text-xs font-mono text-rose-400 mb-1">OUTPUT</div>
                <div className="grid grid-cols-2 gap-1 w-24">
                  <div className="w-full h-6 bg-rose-500/30 rounded-sm"></div>
                  <div className="w-full h-6 bg-rose-500/30 rounded-sm"></div>
                  <div className="w-full h-6 bg-rose-500/30 rounded-sm"></div>
                  <div className="w-full h-6 bg-rose-500/30 rounded-sm"></div>
                </div>
              </div>
            </div>

            <div className="z-10">
              <div className="flex items-center justify-between text-xs font-mono text-stone-500 border-t border-white/10 pt-4 mt-4">
                <span>PROCESSING TIME: 14s</span>
                <span>MODEL: HARBOR-GEN-V2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Workflow */}
      <section className="py-24 px-6 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-serif mb-16 text-center text-white">The Production Pipeline</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-white/10 -z-10"></div>

            {/* Step 1 */}
            <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Upload size={20} className="text-stone-300" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">1. Ingest Assets</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Upload your brand core: logos, fonts, product shots, and raw b-roll. Harbor indexes these into a semantic "Brand Knowledge Graph".
              </p>
              <div className="bg-black/50 p-3 rounded-lg border border-white/10 text-xs font-mono text-stone-500">
                     > Indexing 42 assets...<br />
                     > Extracting hex codes...<br />
                     > Brand voice: "Premium"
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Video size={20} className="text-stone-300" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">2. Generative Remix</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Our pipeline generates hundreds of script-to-video variations. Hooks are swapped, calls-to-action rotated, and audio synced to beat.
              </p>
              <div className="bg-black/50 p-3 rounded-lg border border-white/10 text-xs font-mono text-stone-500">
                     > Generating Hook A + B-Roll C...<br />
                     > Applying "Fast Paced" edit...<br />
                     > Rendering 1080x1920...
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Target size={20} className="text-stone-300" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">3. Performance Loop</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                We don't just ship. We deploy, track ROAS, and feed performance data back into the generation model to optimize the next batch.
              </p>
              <div className="bg-black/50 p-3 rounded-lg border border-white/10 text-xs font-mono text-stone-500">
                     > Variant 14 CPA: $12.50<br />
                     > Signal: High Retention<br />
                     > Action: Scale Variant 14
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Targets */}
      <section className="py-24 px-6 border-b border-white/10 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-12 text-white">Native output for every feed.</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['TikTok', 'Instagram Reels', 'YouTube Shorts', 'LinkedIn Video', 'Programmatic TV', 'Digital Out-of-Home'].map(platform => (
              <span key={platform} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-stone-300 font-medium hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Case Study */}
      <section className="py-24 px-6 bg-[#050505] text-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">The Efficiency Gap</h2>
            <p className="text-white/60 text-lg leading-relaxed mb-12">
              Manual creative testing handles 3-5 variations per week. Harbor handles 300-500. The math is simple: more shots on goal equals higher probability of finding a winner.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-serif mb-2 text-rose-400">-40%</div>
                <div className="text-xs font-mono uppercase tracking-widest text-white/40">Cost Per Acquisition</div>
              </div>
              <div>
                <div className="text-4xl font-serif mb-2 text-rose-400">12x</div>
                <div className="text-xs font-mono uppercase tracking-widest text-white/40">Creative Velocity</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] rounded-2xl p-8 border border-white/10">
            <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-8">
              <div>
                <div className="text-xs font-mono text-stone-500 mb-1">TRADITIONAL AGENCY</div>
                <div className="text-2xl font-serif text-white/40">$2,500</div>
                <div className="text-xs text-stone-500">Cost Per Video Asset</div>
              </div>
              <div>
                <div className="text-xs font-mono text-rose-400 mb-1">HARBOR ADS</div>
                <div className="text-2xl font-serif text-white">$120</div>
                <div className="text-xs text-stone-500">Cost Per Video Asset</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><BarChart3 size={14} className="text-stone-400" /></div>
                <div className="flex-1">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[20%] bg-stone-500"></div>
                  </div>
                </div>
                <span className="text-xs font-mono text-stone-500">Data Reach</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center"><Repeat size={14} /></div>
                <div className="flex-1">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-rose-500"></div>
                  </div>
                </div>
                <span className="text-xs font-mono text-rose-400">Optimization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center bg-[#050505]">
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">Ready to automate performance?</h2>
        <div className="flex justify-center gap-6">
          <Link to="/contact" className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-stone-200 transition-colors">
            Request Campaign Strategy
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Ads;