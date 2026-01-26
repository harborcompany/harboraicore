import React from 'react';
import { Database, Filter, Layers, ArrowRight, ArrowDown, Shield, Zap, Search, Brain, CheckCircle2, RefreshCw, Mic, Video, Box, FileCheck, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

const Datasets: React.FC = () => {
  return (
    <div className="w-full bg-[#FCFCFA]">
      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-6 leading-[1.05] tracking-tight">
              Production-Grade <br /><span className="text-stone-400">Audio & Video</span> Datasets
            </h1>
            <p className="text-xl md:text-2xl font-light text-stone-600 leading-relaxed mb-8 max-w-xl">
              Curated, annotated, and continuously improved datasets for training and deploying multimodal AI systems.
            </p>

            <div className="text-stone-600 mb-10 space-y-4 text-lg leading-relaxed max-w-lg">
              <p>Harbor provides licensed, media-native datasets built specifically for audio-visual AI.</p>
              <p>Every dataset is engineered for real-world use — with clear provenance, structured annotations, and infrastructure designed to scale.</p>
            </div>

            <div className="flex gap-4">
              <Link to="/app/datasets" className="bg-[#1A1A1A] text-white px-8 h-[44px] rounded-full font-medium flex items-center justify-center hover:bg-black transition-colors">
                Explore Datasets
              </Link>
              <Link to="/contact" className="border border-stone-300 text-[#1A1A1A] px-8 h-[44px] rounded-full font-medium flex items-center justify-center hover:bg-stone-50 transition-colors">
                Request Custom Dataset
              </Link>
            </div>
          </div>

          {/* Hero Visual - Monochrome Schematic */}
          <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-sm aspect-video flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            {/* Abstract Pipeline */}
            <div className="relative z-10 flex items-center justify-between gap-4 text-stone-800">
              <div className="flex-1 border border-stone-100 bg-stone-50 rounded-lg p-4 h-32 flex flex-col justify-between">
                <div className="flex gap-1">
                  <div className="w-8 h-10 bg-stone-200 rounded-sm"></div>
                  <div className="w-8 h-10 bg-stone-200 rounded-sm"></div>
                  <div className="w-8 h-10 bg-stone-200 rounded-sm"></div>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">RAW</div>
              </div>
              <div className="w-8 h-[1px] bg-stone-300"></div>
              <div className="flex-1 border border-stone-100 bg-stone-50 rounded-lg p-4 h-32 flex flex-col justify-between relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-12 border-y border-stone-200 flex items-center">
                    <div className="w-full h-4 bg-stone-100 mx-2 rounded-sm"></div>
                  </div>
                </div>
                <div className="z-10 text-[10px] font-mono uppercase tracking-widest text-stone-400 mt-auto">WAVEFORM</div>
              </div>
              <div className="w-8 h-[1px] bg-stone-300"></div>
              <div className="flex-1 border border-stone-100 bg-stone-50 rounded-lg p-4 h-32 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-2 w-full bg-stone-200 rounded-full"></div>
                  <div className="h-2 w-2/3 bg-stone-200 rounded-full"></div>
                  <div className="h-2 w-3/4 bg-stone-200 rounded-full"></div>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">METADATA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-stone-200 py-6 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-stone-500 font-medium">Used by AI labs, media companies, and enterprise teams building multimodal systems.</span>
          <div className="flex gap-8 opacity-40 grayscale">
            {/* Abstract Placeholders */}
            <div className="h-6 w-24 bg-stone-300 rounded"></div>
            <div className="h-6 w-24 bg-stone-300 rounded"></div>
            <div className="h-6 w-24 bg-stone-300 rounded"></div>
            <div className="h-6 w-24 bg-stone-300 rounded"></div>
          </div>
        </div>
      </section>

      {/* WHAT MAKES HARBOR DIFFERENT */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-16">
          <div>
            <div className="inline-block px-3 py-1 bg-stone-100 rounded-full text-xs font-mono font-medium mb-6">BUILT FOR MEDIA-NATIVE AI</div>
            <h2 className="text-3xl font-serif mb-6">Infrastructure, not just files.</h2>
            <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
              <p>Most datasets were never designed for audio and video at scale. Harbor datasets are.</p>
              <p>Each dataset is developed using Harbor's proprietary media infrastructure and refined continuously through annotation, retrieval, and performance feedback loops.</p>
            </div>
          </div>
          {/* Visual: System Diagram */}
          <div className="bg-stone-50 rounded-xl p-8 border border-stone-100 flex items-center justify-center">
            <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
              <div className="bg-white px-4 py-2 border border-stone-200 rounded shadow-sm">INGEST</div>
              <ArrowRight size={14} className="text-stone-300" />
              <div className="bg-white px-4 py-2 border border-stone-200 rounded shadow-sm">ANNOTATE</div>
              <ArrowRight size={14} className="text-stone-300" />
              <div className="bg-white px-4 py-2 border border-stone-200 rounded shadow-sm">IMPROVE</div>
              <ArrowRight size={14} className="text-stone-300" />
              <div className="bg-[#1A1A1A] text-white px-4 py-2 rounded shadow-sm border border-black">DEPLOY</div>
            </div>
          </div>
        </div>

        {/* DIFFERENTIATION GRID */}
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Item 1 */}
          <div className="p-8 border border-stone-100 rounded-xl bg-stone-50/50 hover:bg-stone-50 transition-colors">
            <div className="w-10 h-10 bg-white border border-stone-200 rounded-lg flex items-center justify-center mb-6 shadow-sm"><Mic size={20} className="text-stone-700" /></div>
            <h3 className="text-xl font-medium mb-3">Audio & Video First</h3>
            <div className="text-stone-600 mb-4 text-sm leading-relaxed">
              Harbor datasets are purpose-built for: <br />
              <span className="text-stone-900">• Speech • Sound events • Scenes • Actions • Temporal context</span>
            </div>
            <p className="text-stone-500 text-sm">No generic image or text repurposing.</p>
          </div>

          {/* Item 2 */}
          <div className="p-8 border border-stone-100 rounded-xl bg-stone-50/50 hover:bg-stone-50 transition-colors">
            <div className="w-10 h-10 bg-white border border-stone-200 rounded-lg flex items-center justify-center mb-6 shadow-sm"><Layers size={20} className="text-stone-700" /></div>
            <h3 className="text-xl font-medium mb-3">Native Annotation Infrastructure</h3>
            <div className="text-stone-600 mb-4 text-sm leading-relaxed">
              Annotations are: <br />
              <span className="text-stone-900">• Frame-accurate • Time-aligned • Versioned • Confidence-scored</span>
            </div>
            <p className="text-stone-500 text-sm">This is infrastructure, not labor arbitrage.</p>
          </div>

          {/* Item 3 */}
          <div className="p-8 border border-stone-100 rounded-xl bg-stone-50/50 hover:bg-stone-50 transition-colors">
            <div className="w-10 h-10 bg-white border border-stone-200 rounded-lg flex items-center justify-center mb-6 shadow-sm"><RefreshCw size={20} className="text-stone-700" /></div>
            <h3 className="text-xl font-medium mb-3">RAG-Enhanced Dataset Engineering</h3>
            <div className="text-stone-600 mb-4 text-sm leading-relaxed">
              Before datasets are released: <br />
              <span className="text-stone-900">• Content is indexed and embedded • Context is enriched using retrieval pipelines</span>
            </div>
            <p className="text-stone-500 text-sm">Datasets improve over time.</p>
          </div>

          {/* Item 4 */}
          <div className="p-8 border border-stone-100 rounded-xl bg-stone-50/50 hover:bg-stone-50 transition-colors">
            <div className="w-10 h-10 bg-white border border-stone-200 rounded-lg flex items-center justify-center mb-6 shadow-sm"><FileCheck size={20} className="text-stone-700" /></div>
            <h3 className="text-xl font-medium mb-3">Clear Licensing & Provenance</h3>
            <div className="text-stone-600 mb-4 text-sm leading-relaxed">
              Every dataset includes: <br />
              <span className="text-stone-900">• Source transparency • Usage rights • Commercial readiness</span>
            </div>
            <p className="text-stone-500 text-sm">No ambiguity. No scraped data.</p>
          </div>
        </div>
      </section>

      {/* DATASET CATEGORIES */}
      <section className="py-24 px-6 border-t border-stone-200">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl font-serif mb-12">Available Dataset Verticals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Audio */}
            <div>
              <div className="h-32 bg-stone-100 rounded-lg mb-6 flex items-center justify-center border border-stone-200">
                <Mic className="text-stone-400" size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2">Audio Datasets</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                Structured datasets for speech and sound understanding. Includes Transcription, Speaker ID, Emotion, and Environmental sounds.
              </p>
              <div className="text-xs font-mono text-stone-400">USE CASES: ASR, VOICE ASSISTANTS</div>
            </div>

            {/* Video */}
            <div>
              <div className="h-32 bg-stone-100 rounded-lg mb-6 flex items-center justify-center border border-stone-200">
                <Video className="text-stone-400" size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2">Video Datasets</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                High-fidelity, time-aligned video datasets. Includes Scene segmentation, Action labeling, and Object interaction.
              </p>
              <div className="text-xs font-mono text-stone-400">USE CASES: VIDEO UNDERSTANDING, MODERATION</div>
            </div>

            {/* Multimodal */}
            <div>
              <div className="h-32 bg-stone-100 rounded-lg mb-6 flex items-center justify-center border border-stone-200">
                <Layers className="text-stone-400" size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2">Multimodal Datasets</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                Audio, video, and metadata combined. Includes AV alignment, Contextual signals, and Cross-modal annotations.
              </p>
              <div className="text-xs font-mono text-stone-400">USE CASES: FOUNDATION MODELS, SPATIAL I</div>
            </div>

          </div>
        </div>
      </section>

      {/* DATASET GRID (BROWSING) */}
      <section id="browse" className="py-24 px-6 bg-white border-t border-stone-200">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl font-serif mb-12">Browse Available Datasets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group border border-stone-200 rounded-xl p-6 hover:border-stone-400 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-stone-50 rounded flex items-center justify-center text-stone-400 group-hover:bg-stone-100 transition-colors">
                    {i % 2 === 0 ? <Video size={18} /> : <Mic size={18} />}
                  </div>
                  <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded text-stone-500">COMMERCIAL</span>
                </div>
                <h4 className="font-medium text-lg mb-1 group-hover:underline">Harbor-Core-{i}00</h4>
                <p className="text-sm text-stone-500 mb-6">High-fidelity action alignment dataset.</p>

                <div className="grid grid-cols-2 gap-4 text-xs text-stone-400 font-mono border-t border-stone-100 pt-4">
                  <div>
                    <div className="mb-1">VOLUME</div>
                    <div className="text-stone-600">45 TB</div>
                  </div>
                  <div>
                    <div className="mb-1">ANNOTATION</div>
                    <div className="text-stone-600">Frame-Level</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM DATASET CTA */}
      <section className="py-24 px-6 bg-[#FCFCFA] border-t border-stone-200">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif mb-6">Custom Datasets for Specific Use Cases</h2>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              When off-the-shelf datasets aren't enough, Harbor builds datasets tailored to your requirements. Not a one-off delivery — datasets evolve as your needs change.
            </p>
            <ul className="space-y-2 mb-10 text-stone-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-stone-400" /> Proprietary data ingestion</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-stone-400" /> Annotation schema design</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-stone-400" /> RAG optimization</li>
            </ul>
            <Link to="/contact" className="bg-[#1A1A1A] text-white px-8 h-[44px] rounded-full font-medium inline-flex items-center justify-center hover:bg-black transition-colors">
              Discuss Custom Dataset
            </Link>
          </div>
          {/* Visual */}
          <div className="bg-white border border-stone-200 p-8 rounded-xl shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border border-stone-100 rounded-lg bg-stone-50">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-xs font-mono border border-stone-200">V1.0</div>
                <div className="flex-1">
                  <div className="h-2 w-3/4 bg-stone-200 rounded-full mb-2"></div>
                  <div className="h-2 w-1/2 bg-stone-200 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-center text-stone-300"><ArrowDown size={16} /></div>
              <div className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg bg-white shadow-sm ring-1 ring-black/5">
                <div className="w-8 h-8 bg-[#1A1A1A] text-white rounded flex items-center justify-center text-xs font-mono">V1.1</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Enhanced Metadata</div>
                  <div className="text-xs text-stone-500">Updated 24h ago</div>
                </div>
              </div>
              <div className="flex items-center justify-center text-stone-300"><ArrowDown size={16} /></div>
              <div className="flex items-center gap-4 p-4 border border-stone-100 rounded-lg bg-stone-50 opacity-50">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-xs font-mono border border-stone-200">V1.2</div>
                <div className="flex-1">
                  <div className="h-2 w-3/4 bg-stone-200 rounded-full mb-2"></div>
                  <div className="h-2 w-1/2 bg-stone-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT'S BUILT */}
      <section className="py-24 px-6 bg-white border-t border-stone-200">
        <div className="max-w-[1000px] mx-auto text-center mb-16">
          <h2 className="text-3xl font-serif mb-4">From Raw Media to Deployment-Ready Data</h2>
        </div>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6"><Database size={20} /></div>
            <h4 className="font-medium mb-2">1. Ingest</h4>
            <p className="text-sm text-stone-500">Secure ingestion from enterprise uploads & pipeline streams.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6"><Layers size={20} /></div>
            <h4 className="font-medium mb-2">2. Annotate</h4>
            <p className="text-sm text-stone-500">Machine-assisted labeling with human consensus review.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6"><RefreshCw size={20} /></div>
            <h4 className="font-medium mb-2">3. Curate</h4>
            <p className="text-sm text-stone-500">Data is indexed, embedded, and enriched via RAG.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6"><Box size={20} /></div>
            <h4 className="font-medium mb-2">4. Deliver</h4>
            <p className="text-sm text-stone-500">Released as license-ready collections or API assets.</p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-32 px-6 bg-[#FCFCFA] border-t border-stone-200 text-center">
        <h2 className="text-4xl font-serif mb-6 text-[#1A1A1A]">Data That Holds Up in Production</h2>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 font-light">
          Harbor datasets are engineered for teams that need reliability, scale, and clarity — not experimentation noise.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/app/datasets" className="bg-[#1A1A1A] text-white px-8 h-[44px] rounded-full font-medium flex items-center justify-center hover:bg-black transition-colors shadow-lg">
            Explore Datasets
          </Link>
          <Link to="/contact" className="px-8 h-[44px] rounded-full font-medium flex items-center justify-center text-stone-600 hover:text-[#1A1A1A] transition-colors">
            Request Access
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Datasets;