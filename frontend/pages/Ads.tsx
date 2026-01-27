import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Download, Play, MessageSquare, BarChart3, ChevronRight } from 'lucide-react';
import SeoHead from '../components/SeoHead';

const Ads: React.FC = () => {
  return (
    <div className="w-full bg-white animate-in fade-in duration-700">
      <SeoHead
        title="Harbor Ads — Data-Driven Creative at Scale"
        description="Harbor Ads: premium creative production powered by our datasets. A repeatable, high-quality ad generation pipeline with performance feedback into datasets."
      />

      {/* HERO */}
      <section className="text-center pt-[160px] pb-[80px] px-6">
        <h1 className="h1 mb-6 text-[#0F1115]">Ads Built On Data</h1>
        <p className="body-text text-xl max-w-3xl mx-auto mb-8">
          A production-grade creative engine powered by Harbor’s datasets.
          Deterministic workflows, performance feedback, enterprise controls.
        </p>
        <Link to="/contact" className="btn-primary">
          Request Access
        </Link>
      </section>

      {/* PIPELINE SCROLL */}
      <section className="section-pad bg-[#F8F9FA] border-y border-[#E3E5E8] overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="h3 uppercase tracking-widest text-[#5F6368] text-sm mb-12 text-center">Development Pipeline</h2>

          <div className="flex gap-8 overflow-x-auto pb-12 snap-x text-center md:text-left md:justify-center">
            {[
              { step: '01', title: 'Intake', desc: 'Brand assets, goals, platforms', icon: <Download size={24} /> },
              { step: '02', title: 'Resolution', desc: 'Match Harbor datasets to brief', icon: <Wand2 size={24} /> },
              { step: '03', title: 'Compile', desc: 'Deterministic prompt templates', icon: <MessageSquare size={24} /> },
              { step: '04', title: 'Generate', desc: 'Model runs + Human QA', icon: <Play size={24} /> },
              { step: '05', title: 'Deploy', desc: 'Platform-native exports', icon: <BarChart3 size={24} /> },
            ].map((s, i) => (
              <div key={i} className="min-w-[240px] flex flex-col gap-4 snap-center relative group">
                <div className="w-12 h-12 rounded-full border border-[#E3E5E8] bg-white flex items-center justify-center text-[#5F6368] group-hover:text-[#2F6AFF] group-hover:border-[#2F6AFF] transition-all mx-auto md:mx-0">
                  {s.icon}
                </div>
                <div>
                  <div className="text-xs font-mono text-[#5F6368] mb-1">STEP {s.step}</div>
                  <h3 className="h3 text-[20px] mb-2">{s.title}</h3>
                  <p className="body-text text-sm">{s.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden md:block absolute top-[24px] right-[-24px] text-[#E3E5E8]">
                    <ChevronRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="section-pad text-center mb-[80px]">
        <div className="max-w-3xl mx-auto p-12 rounded-[24px] bg-[#0F1115] text-white bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
          <h2 className="text-[40px] font-semibold mb-6">Start your engine</h2>
          <p className="text-lg text-white/60 mb-8 max-w-lg mx-auto">
            Stop guessing with creative. Start engineering with data.
          </p>
          <Link to="/contact" className="inline-flex items-center justify-center h-[50px] px-[24px] rounded-[8px] bg-white text-[#0F1115] text-[18px] font-medium hover:bg-stone-200 transition-colors">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Ads;