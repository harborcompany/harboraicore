import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Image as ImageIcon } from 'lucide-react';

// Accordion Item for FAQ style sections
const AccordionItem = ({ question }: { question: string }) => (
   <div className="flex items-center justify-between py-6 border-b border-stone-200 cursor-pointer group">
      <span className="text-lg md:text-xl text-[#1A1A1A] group-hover:text-stone-600 transition-colors font-serif">{question}</span>
      <Plus size={20} className="text-stone-400 group-hover:rotate-90 transition-transform duration-300" />
   </div>
);

const Landing: React.FC = () => {
   return (
      <div className="w-full bg-[#F3F2EE]">

         {/* HERO SECTION */}
         <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 md:px-6 pt-32 pb-20 overflow-hidden">

            {/* Video Background */}
            <div className="absolute inset-0 z-0 bg-[#EFEEEC]">
               <video
                  src="/roboticscontent.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-60 mix-blend-multiply"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F9F8F6]/20 to-[#F9F8F6]"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto w-full">

               {/* Pill */}
               <div className="inline-flex items-center gap-2 bg-white px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-sm mb-8 md:mb-12 border border-stone-200/50 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-pulse"></div>
                  <span className="text-xs md:text-sm font-bold text-stone-600 tracking-wide">Introducing Harbor v2.0</span>
               </div>

               {/* Headline */}
               <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif text-[#1A1A1A] mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] tracking-tight">
                  Meet Harbor.<br />
                  <span className="italic">Redefine data</span> with <br />
                  intelligent design
               </h1>

               {/* Subhead */}
               <p className="text-lg md:text-2xl text-stone-600 mb-10 md:mb-12 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light px-4">
                  It helps you imagine, plan, and refine datasets through natural conversations and enterprise-grade pipelines.
               </p>

               {/* Buttons */}
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
                  <Link
                     to="/auth/signup"
                     className="w-full sm:w-auto bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-lg font-medium shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-transparent"
                  >
                     Get Started
                  </Link>
                  <Link
                     to="/how-it-works"
                     className="w-full sm:w-auto bg-white/80 backdrop-blur-md text-[#1A1A1A] px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hover:bg-white transition-all duration-300 border border-stone-200"
                  >
                     Learn More
                  </Link>
               </div>
            </div>
         </section>

         {/* AGENTIC SOLUTIONS */}
         <section className="py-24 px-6 bg-white rounded-t-[3rem] mt-[-2rem]">
            <div className="max-w-[1400px] mx-auto">
               <div className="text-center mb-24">
                  <h2 className="text-5xl md:text-7xl font-serif mb-6 text-[#1A1A1A]">Agentic Solutions</h2>
                  <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                     Transform your data and expertise into agentic solutions that continuously improve with human interaction.
                  </p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Column 1 - Defense */}
                  <div className="flex flex-col">
                     {/* Text Outside Card */}
                     <div className="mb-8 px-2">
                        <div className="text-xs font-bold tracking-widest text-stone-400 mb-4 uppercase">PUBLIC SECTOR</div>
                        <h3 className="text-3xl md:text-4xl font-serif mb-4 text-[#1A1A1A] leading-tight">Agentic Solutions for <br /> Defense and Intelligence</h3>
                        <p className="text-stone-500 text-lg">Orchestrate agent workflows for decision advantage.</p>
                     </div>

                     {/* Visual Card Only */}
                     <div className="bg-[#121212] rounded-[2rem] p-4 aspect-[4/3] relative overflow-hidden shadow-2xl flex-grow group">
                        <div className="absolute top-6 left-6 z-10 pointer-events-none">
                           <div className="bg-[#1E1E1E] p-3 rounded-xl border border-white/10 max-w-[220px] shadow-lg">
                              <p className="text-[11px] text-stone-300 leading-relaxed font-medium">
                                 Donovan, put any known foreign ship movements over the past 48 hours on the map.
                              </p>
                           </div>
                        </div>
                        <div className="absolute top-6 right-6">
                           <div className="bg-[#1E1E1E] border border-white/10 text-stone-400 text-[10px] px-3 py-1.5 rounded-lg font-medium">Map View</div>
                        </div>
                        {/* Abstract Map Lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
                           <circle cx="200" cy="150" r="100" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                           <circle cx="200" cy="150" r="180" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
                           <path d="M0,150 L400,150" stroke="white" strokeWidth="0.2" />
                           <path d="M200,0 L200,300" stroke="white" strokeWidth="0.2" />
                        </svg>
                        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                     </div>
                  </div>

                  {/* Column 2 - Enterprise */}
                  <div className="flex flex-col">
                     {/* Text Outside Card */}
                     <div className="mb-8 px-2">
                        <div className="text-xs font-bold tracking-widest text-stone-400 mb-4 uppercase">ENTERPRISE</div>
                        <h3 className="text-3xl md:text-4xl font-serif mb-4 text-[#1A1A1A] leading-tight">Agentic Solutions for <br /> Enterprise AI Transformation</h3>
                        <p className="text-stone-500 text-lg">Deploy reliable AI agents that learn to improve outcomes.</p>
                     </div>

                     {/* Visual Card Only */}
                     <div className="bg-[#121212] rounded-[2rem] p-6 aspect-[4/3] flex gap-6 shadow-2xl relative">
                        <div className="w-10 flex flex-col items-center pt-2 gap-4 border-r border-white/5 pr-4">
                           <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20"></div>
                           <div className="w-4 h-4 rounded-sm border border-stone-700"></div>
                           <div className="w-4 h-4 rounded-sm border border-stone-700 opacity-50"></div>
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-8">
                              <span className="text-white text-sm font-semibold">Models</span>
                              <span className="text-[10px] bg-[#1E1E1E] text-stone-400 px-3 py-1.5 rounded-lg border border-white/10">Customize New Model</span>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/5">
                                 <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs text-stone-200 font-medium tracking-wide">GPT-4</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* CRAFT EXPERIENCES */}
         <section className="py-32 px-6 bg-white">
            <div className="max-w-[1400px] mx-auto">
               <div className="text-center mb-24">
                  <h2 className="text-5xl md:text-7xl font-serif mb-6 text-[#1A1A1A]">
                     Craft experiences your <br /> <span className="italic">customers will remember</span>
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  {/* Card 1 - Dark Gradient - Visual Intelligence */}
                  <div className="relative h-[700px] rounded-[2.5rem] bg-[#1a1a1a] overflow-hidden p-8 shadow-2xl flex flex-col justify-end group">
                     {/* Background Glow */}
                     <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-purple-900/10 blur-[80px] rounded-full"></div>

                     {/* Content UI */}
                     <div className="absolute top-16 left-1/2 -translate-x-1/2 w-4/5 flex flex-col gap-5">
                        <div className="bg-white/5 border border-white/5 rounded-2xl h-14 w-full"></div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl h-14 w-full opacity-60"></div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl h-14 w-full opacity-30"></div>

                        {/* Active Toast */}
                        <div className="bg-[#2A2A2A] border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-2xl translate-y-8 group-hover:translate-y-4 transition-transform duration-700 ease-out mt-4">
                           <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                              <ImageIcon size={22} />
                           </div>
                           <div>
                              <div className="text-white font-medium text-base">Object Detection</div>
                              <div className="text-stone-400 text-[11px] tracking-wider font-mono mt-0.5">CONFIDENCE: 98%</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Card 2 - Solid Black - Conversational */}
                  <div className="relative h-[700px] rounded-[2.5rem] bg-black overflow-hidden p-10 shadow-2xl flex flex-col justify-between">

                     <div className="relative z-10 mt-16 flex flex-col gap-6 w-full max-w-[90%] mx-auto">
                        {/* Model Msg */}
                        <div className="bg-[#1E1E1E] p-6 rounded-3xl rounded-tl-none self-start max-w-[90%] border border-white/5">
                           <div className="flex gap-2 mb-3">
                              <div className="w-8 h-2 bg-stone-700 rounded-full opacity-50"></div>
                              <div className="w-12 h-2 bg-stone-700 rounded-full opacity-30"></div>
                           </div>
                           <div className="h-2 w-full bg-stone-800 rounded-full opacity-20"></div>
                        </div>

                        {/* User Msg */}
                        <div className="bg-[#EBE7DF] p-6 rounded-3xl rounded-tr-none self-end max-w-[95%] text-[#1A1A1A] shadow-lg transform translate-x-4">
                           <div className="flex items-center gap-3 mb-3 border-b border-black/5 pb-3">
                              <div className="w-8 h-8 rounded-full bg-stone-300 overflow-hidden">
                                 <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[10px] font-bold tracking-widest opacity-50 uppercase">ML ENGINEER</span>
                           </div>
                           <p className="text-base font-medium leading-relaxed">
                              My model won't converge, any ideas on how to use Harbor's datasets?
                           </p>
                        </div>
                     </div>

                     <div className="relative z-10 pb-4">
                        <h3 className="text-white text-4xl font-serif leading-tight mb-4">Engage and <br /> delight engineers</h3>
                        <div className="flex gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-stone-800"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-stone-800"></div>
                        </div>
                     </div>
                  </div>

                  {/* Card 3 - Warm Stone - Adaptable */}
                  <div className="relative h-[700px] rounded-[2.5rem] bg-[#A8A49B] overflow-hidden p-12 shadow-2xl flex flex-col justify-between">
                     <div>
                        <h3 className="text-white text-5xl font-serif mb-6 leading-[1.1]">It's completely <br />adaptable.</h3>
                        <p className="text-white/80 text-base leading-relaxed max-w-xs">
                           Customize Harbor to fit your pipeline and needs—whether you want automated ingestion, human-in-the-loop, or pure RAG.
                        </p>
                     </div>

                     <div className="flex flex-col gap-4 mt-8">
                        <div className="bg-[#Fdfcfb] rounded-2xl p-5 flex items-center justify-between shadow-lg transform hover:scale-102 transition-transform">
                           <span className="text-[#1A1A1A] text-base font-semibold">Ingestion Pipeline</span>
                           <Plus size={18} className="text-[#1A1A1A]" />
                        </div>
                        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between border border-white/20">
                           <span className="text-[#2a2a2a] text-base font-medium">Annotation Rules</span>
                           <Plus size={18} className="text-[#2a2a2a]" />
                        </div>
                        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between border border-white/20">
                           <span className="text-[#2a2a2a] text-base font-medium">Export Formats</span>
                           <Plus size={18} className="text-[#2a2a2a]" />
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </section>


         {/* PLAN, SCALE & FAQ */}
         <section className="py-32 px-6 bg-white">
            <div className="max-w-[1400px] mx-auto">

               {/* Stats & CTA */}
               <div className="text-center mb-32">
                  <h2 className="text-5xl md:text-7xl font-serif mb-8 text-[#1A1A1A]">
                     Plan, scale, and <span className="italic text-stone-400">personalize</span>
                  </h2>

                  <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mb-16">
                     <div className="text-center">
                        <div className="text-6xl font-serif text-[#1A1A1A] mb-2">98.9%</div>
                        <div className="text-stone-400 text-xs font-bold tracking-[0.2em] uppercase">Uptime</div>
                     </div>
                     <div className="text-center">
                        <div className="text-6xl font-serif text-[#1A1A1A] mb-2">290+</div>
                        <div className="text-stone-400 text-xs font-bold tracking-[0.2em] uppercase">Projects</div>
                     </div>
                  </div>

                  <Link to="/auth/signup" className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-black hover:scale-105 transition-all shadow-xl hover:shadow-2xl duration-300">
                     Get Started
                  </Link>
               </div>

               {/* FAQ */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                  <div>
                     <h2 className="text-4xl md:text-6xl font-serif mb-2 text-[#1A1A1A]">Frequently</h2>
                     <h2 className="text-4xl md:text-6xl font-serif mb-8 text-[#1A1A1A] italic">Asked Questions</h2>
                  </div>

                  <div className="space-y-4">
                     <AccordionItem question="How does Harbor help with ingestion?" />
                     <AccordionItem question="Can I use Harbor for multiple formats?" />
                     <AccordionItem question="Do I need data engineering experience?" />
                     <AccordionItem question="What subscription plan should I choose?" />
                     <AccordionItem question="Is the data licensed for commercial use?" />
                  </div>
               </div>

            </div>
         </section>

      </div>
   );
};

export default Landing;