import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SeoHead from '../components/SeoHead';

const Landing: React.FC = () => {
   return (
      <div className="w-full bg-[#FAFAFA] text-[#111]">
         <SeoHead
            title="Harbor — Enterprise Data Infrastructure"
            description="Harbor provides training-ready image, audio, and video datasets — delivered through licensed sourcing, real-time infrastructure, and human-validated annotation."
         />

         {/* SECTION 1: HERO */}
         <section className="relative w-full pt-48 pb-32 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto min-h-[70vh] flex flex-col justify-center overflow-hidden rounded-[2rem] mt-4">

            {/* Video Background - Robotics Content */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
               <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-[0.85]"
               >
                  <source src="/roboticscontent.mp4" type="video/mp4" />
               </video>
               {/* Gradient Overlay for Text Readability */}
               <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA]/95 via-[#FAFAFA]/80 to-transparent"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent"></div>
            </div>

            <div className="max-w-3xl relative z-10">
               <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 leading-[1.05] text-black">
                  Enterprise Data Infrastructure <br /> for Multimodal AI
               </h1>
               <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed mb-10 max-w-xl">
                  Harbor provides training-ready image, audio, and video datasets — delivered through licensed sourcing, real-time infrastructure, and human-validated annotation.
               </p>

               <div className="flex flex-wrap items-center gap-5">
                  <button className="bg-[#111] text-white px-7 py-3 rounded hover:bg-black transition-all font-medium text-sm">
                     Request Dataset Access
                  </button>
                  <button className="text-[#111] font-medium text-sm hover:text-gray-600 transition-colors border-b border-gray-300 pb-0.5 hover:border-black">
                     Contact Sales
                  </button>
               </div>
            </div>
         </section>

         {/* SECTION 2: PARTNER STRIP */}
         <section className="w-full border-y border-gray-200 bg-[#FAFAFA]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 py-8 flex flex-col md:flex-row items-center gap-8 md:gap-16">
               <span className="text-xs font-medium text-gray-400 uppercase tracking-widest shrink-0">
                  Trusted by teams building production AI systems
               </span>
               <div className="flex flex-wrap gap-12 opacity-40 grayscale items-center">
                  {['Higgsfield', 'IBM', 'Adobe', 'Runway', 'Google DeepMind'].map((logo, i) => (
                     <span key={i} className="text-lg font-semibold tracking-tight text-black">{logo}</span>
                  ))}
               </div>
            </div>
         </section>

         {/* SECTION 3: POSITIONING STATEMENT */}
         <section className="py-32 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-12">
               Built on Infrastructure — Not Abstractions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <p className="text-lg font-light text-gray-600 leading-relaxed">
                  Harbor operates across the full data stack. From live content ingestion to model-ready delivery.
               </p>
               <p className="text-lg font-light text-gray-600 leading-relaxed">
                  Unlike providers that rely on scraped or third-party inputs, Harbor controls the underlying infrastructure — enabling flexible data products, real-time learning, and clear provenance.
               </p>
            </div>
         </section>

         {/* SECTION 4: PRODUCT SURFACE (Architectural Blocks) */}
         <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <h2 className="text-2xl font-medium text-black">Product Surface</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
               {[
                  { title: "Video, Image & Audio Datasets", desc: "Curated, rights-cleared foundation data." },
                  { title: "Annotation & RLHF", desc: "Human-in-the-loop validation and labeling fabric." },
                  { title: "Live & Streaming Data Pipelines", desc: "Real-time ingestion for continuous learning." },
                  { title: "Data Infrastructure & APIs", desc: "Programmatic access to the Harbor engine." },
                  { title: "Compliance & Provenance", desc: "Audit trails and indemnification built-in." }
               ].map((block, i) => (
                  <div key={i} className="bg-white p-12 hover:bg-gray-50 transition-colors h-64 flex flex-col justify-between group">
                     <div>
                        <h3 className="text-xl font-medium text-black mb-3">{block.title}</h3>
                        <p className="text-gray-500 font-light">{block.desc}</p>
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={20} className="text-gray-400" />
                     </div>
                  </div>
               ))}
               {/* Filler block to complete grid if odd number */}
               <div className="bg-white hidden md:block"></div>
            </div>
         </section>

         {/* SECTION 5: LIVE DATA INFRASTRUCTURE */}
         <section className="py-32 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto bg-black text-white rounded-[2rem] my-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
               <div>
                  <h2 className="text-2xl md:text-4xl font-medium tracking-tight mb-8">
                     Real-Time Data at <br /> Production Scale
                  </h2>
                  <p className="text-gray-400 text-lg font-light leading-relaxed mb-8">
                     Our models learn from continuously flowing data — enabling dynamic dataset refreshes, temporal context, and real-world signal capture unavailable through static corpora.
                  </p>
                  <div className="inline-block border border-white/20 rounded-full px-4 py-1 text-sm text-gray-300">
                     Live Feedback Loops
                  </div>
               </div>
               <div className="border-l border-white/10 pl-12 flex flex-col justify-center h-full">
                  <span className="text-6xl md:text-8xl font-light tracking-tighter text-white mb-4">
                     200k+
                  </span>
                  <span className="text-xl text-gray-500 font-medium">Hours Streamed Annually</span>
                  <p className="text-gray-500 text-sm mt-4 font-light">Harbor operates a live linear content network.</p>
               </div>
            </div>
         </section>

         {/* SECTION 6: FINAL CTA */}
         <section className="py-32 px-6 md:px-12 lg:px-16 text-center">
            <div className="max-w-2xl mx-auto">
               <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-12 text-black">
                  Build with training data <br /> you can trust.
               </h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="bg-[#111] text-white px-8 py-4 rounded hover:bg-black transition-all font-medium text-base w-full sm:w-auto">
                     Request Dataset Access
                  </button>
                  <button className="bg-transparent border border-gray-300 text-black px-8 py-4 rounded hover:bg-gray-50 transition-all font-medium text-base w-full sm:w-auto">
                     Contact Sales
                  </button>
               </div>
            </div>
         </section>
      </div>
   );
};

export default Landing;