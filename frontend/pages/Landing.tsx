import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SeoHead from '../components/SeoHead';


const Landing: React.FC = () => {
   return (
      <div className="w-full bg-[#FAFAFA] text-[#111]">
         <SeoHead
            title="Harbor: Enterprise Data Infrastructure"
            description="Harbor provides training-ready image, audio, and video datasets, delivered through licensed sourcing, real-time infrastructure, and human-validated annotation."
         />

         {/* SECTION 1: HERO */}
         <section className="relative w-full pt-48 pb-32 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto min-h-[70vh] flex flex-col justify-center overflow-hidden rounded-[2rem] mt-4">

            {/* Video Background - Content */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
               <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-[0.85] scale-[1.04] origin-left"
               >
                  <source src="/Jan_27__1044_32s_202601271148_6xrem.mp4" type="video/mp4" />
               </video>
               {/* Gradient Overlay for Text Readability - Reduced Opacity */}
               <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA]/60 via-[#FAFAFA]/30 to-transparent"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent opacity-80"></div>
            </div>

            <div className="max-w-3xl relative z-10">
               <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 leading-[1.05] text-black">
                  Enterprise Data Infrastructure <br /> for Multimodal AI
               </h1>
               <p className="text-lg md:text-xl text-black font-light leading-relaxed mb-10 max-w-xl">
                  Harbor provides training-ready image, audio, and video datasets, delivered through licensed sourcing, real-time infrastructure, and human-validated annotation.
               </p>

               <div className="flex flex-wrap items-center gap-5">
                  <Link to="/auth/signup" className="bg-[#111] text-white px-7 py-3 rounded hover:bg-black transition-all font-medium text-sm">
                     Request Dataset Access
                  </Link>
                  <Link to="/contact" className="text-[#111] font-medium text-sm hover:text-gray-600 transition-colors border-b border-gray-300 pb-0.5 hover:border-black">
                     Contact Sales
                  </Link>
               </div>
            </div>
         </section>



         {/* SECTION 3: POSITIONING STATEMENT */}
         <section className="py-32 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-12">
               Built on Infrastructure: Not Abstractions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <p className="text-lg font-light text-gray-600 leading-relaxed">
                  Harbor operates across the full data stack. From live content ingestion to model-ready delivery.
               </p>
               <p className="text-lg font-light text-gray-600 leading-relaxed">
                  Unlike providers that rely on scraped or third-party inputs, Harbor controls the underlying infrastructure, enabling flexible data products, real-time learning, and clear provenance.
               </p>
            </div>
         </section>

         {/* SECTION 4: LIVE DATA INFRASTRUCTURE (Moved Up) */}
         <section className="py-32 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto bg-black text-white rounded-[2rem] my-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
               <div>
                  <h2 className="text-2xl md:text-4xl font-medium tracking-tight mb-8">
                     Real-Time Data at <br /> Production Scale
                  </h2>
                  <p className="text-gray-400 text-lg font-light leading-relaxed mb-8">
                     Our models learn from continuously flowing data, enabling dynamic dataset refreshes, temporal context, and real-world signal capture unavailable through static corpora.
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

         {/* SECTION 5: DATA FOCUS (Was Product Surface) */}
         <section className="py-16 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10">
               <h2 className="text-2xl font-medium text-black">Data Focus</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
               {[
                  {
                     title: "Video, Image & Audio Datasets",
                     desc: "Curated, rights-cleared foundation data.",
                     image: null,
                     video: "/nba1.mov"
                  },
                  {
                     title: "Annotation & RLHF",
                     desc: "Human-in-the-loop validation and labeling fabric.",
                     image: "/assets/landing/dataset_lego_v3.png"
                  },
                  {
                     title: "Live & Streaming Data Pipelines",
                     desc: "Real-time ingestion for continuous learning.",
                     image: "/assets/landing/pipeline_real_v3.png"
                  },
                  {
                     title: "Data Infrastructure & APIs",
                     desc: "Programmatic access to the Harbor engine.",
                     image: "/assets/landing/infrastructure_v3.png"
                  }
               ].map((block, i) => (
                  <div key={i} className="bg-white p-6 md:p-10 hover:bg-gray-50 transition-colors min-h-[400px] md:aspect-square md:min-h-0 flex flex-col justify-between group overflow-hidden relative">
                     <div className="relative z-10">
                        <h3 className="text-xl font-medium text-black mb-3">{block.title}</h3>
                        <p className="text-gray-500 font-light">{block.desc}</p>
                     </div>

                     {block.video && (
                        <div className="absolute inset-x-0 bottom-0 top-[45%] md:top-[22%] overflow-hidden">
                           <video
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-700"
                           >
                              <source src={block.video} type="video/mp4" />
                              <source src={block.video} type="video/quicktime" />
                           </video>
                           <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-white/90"></div>
                        </div>
                     )}

                     {block.image && (
                        <div className="absolute inset-x-0 bottom-0 top-[45%] md:top-[22%] overflow-hidden">
                           <img
                              src={block.image}
                              alt={block.title}
                              className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-700"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-white/90"></div>
                        </div>
                     )}

                     <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity self-end">
                        <ArrowRight size={20} className="text-gray-400" />
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* SECTION: SIMPLE TRANSPARENT ENGAGEMENT (Copied from AdsPage) */}
         <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto bg-[#111] text-white rounded-[3rem] mb-12 overflow-hidden relative">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">
                     Simple, Transparent <br /> Engagement
                  </h2>

                  <div className="space-y-8 mb-12">
                     <div>
                        <h3 className="text-xl font-medium text-white mb-2">Subscription + Workflows</h3>
                        <p className="text-gray-400 font-light">We collaborate on briefs and data connections so Harbor can generate, refine, and test ads continuously.</p>
                     </div>
                     <div>
                        <h3 className="text-xl font-medium text-white mb-2">Enterprise Mode</h3>
                        <p className="text-gray-400 font-light">Integrations via API, pipeline automation, compliance readiness, and rich media analytics.</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <Link to="/contact" className="bg-white text-black px-8 py-4 rounded hover:bg-gray-100 transition-all font-medium text-lg w-full sm:w-auto text-center">
                        Book Demo
                     </Link>
                     <Link to="/datasets" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded hover:bg-white/10 transition-all font-medium text-lg w-full sm:w-auto text-center">
                        Request Dataset Access
                     </Link>
                  </div>
               </div>

               {/* End Visual: Abstract Multimodal Schematic */}
               <div className="relative w-full aspect-video md:h-[400px] md:aspect-auto rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <img
                     src="/Make_the_background_202601271704.jpeg"
                     alt="Multimodal Data Infrastructure"
                     className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
               </div>
            </div>

            {/* Final Repeater CTA */}
            <div className="mt-24 pt-12 border-t border-white/10 text-center">
               <h2 className="text-2xl md:text-3xl font-medium mb-8">Ready to Generate Better Ads with Real Media?</h2>
               <Link to="/contact" className="bg-blue-600 text-white px-10 py-4 rounded-full hover:bg-blue-500 transition-all font-medium text-lg shadow-lg hover:shadow-blue-500/25 inline-block">
                  Book Demo
               </Link>
            </div>
         </section>



         {/* SECTION 6: FINAL CTA */}
         <section className="py-32 px-6 md:px-12 lg:px-16 text-center">
            <div className="max-w-2xl mx-auto">
               <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-12 text-black">
                  Build with training data <br /> you can trust.
               </h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/auth/signup" className="bg-[#111] text-white px-8 py-4 rounded hover:bg-black transition-all font-medium text-base w-full sm:w-auto">
                     Request Dataset Access
                  </Link>
                  <Link to="/contact" className="bg-transparent border border-gray-300 text-black px-8 py-4 rounded hover:bg-gray-50 transition-all font-medium text-base w-full sm:w-auto">
                     Contact Sales
                  </Link>
               </div>
            </div>
         </section>
      </div>
   );
};
export default Landing;