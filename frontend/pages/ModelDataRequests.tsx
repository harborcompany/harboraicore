import React, { useState } from 'react';
import { ArrowRight, Check, X, Plus, Minus, Play, Upload, Eye, DollarSign } from 'lucide-react';

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-black/10 last:border-0">
      <button 
        className="w-full py-6 flex justify-between items-center text-left hover:bg-black/5 transition-colors px-2 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold pr-8 group-hover:text-black text-stone-900 transition-colors">{question}</span>
        {isOpen ? <Minus size={20} className="shrink-0 text-black" /> : <Plus size={20} className="shrink-0 text-black" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-stone-800 leading-relaxed px-2 text-base max-w-2xl font-medium">{answer}</p>
      </div>
    </div>
  );
};

const LegoData: React.FC = () => {
  const scrollToSteps = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#FEFCE8] text-black font-sans pt-20">
      
      {/* 1. Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
           {/* Left-aligned hero content */}
           <div className="max-w-4xl">
             <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-8 leading-[1] text-black text-left">
               Get Paid for One Thing:<br/>
               Building Models on Video
             </h1>
             <p className="text-xl md:text-2xl text-stone-800 max-w-2xl mb-10 font-medium leading-relaxed text-left">
               No fees. No software. No funnels. No recruiting. <br className="hidden md:block"/>
               If you can record yourself building models, you’re qualified.
             </p>
             
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <button 
                  onClick={scrollToSteps}
                  className="bg-black text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-stone-800 transition-all shadow-md active:transform active:scale-95"
                >
                   See How It Works <ArrowRight size={20} className="inline ml-2" />
                </button>
                <p className="text-sm text-stone-600 font-bold tracking-wide">
                   PERFORMANCE-BASED PAYOUTS. NO UPFRONT COMMITMENT.
                </p>
             </div>
           </div>
        </div>
      </section>

      {/* 2. Hero Video Window */}
      <section className="px-6 pb-24">
         <div className="max-w-[1200px] mx-auto">
            <div className="mb-4">
               <h2 className="text-2xl font-bold mb-2 text-black text-left">Watch What “The Work” Actually Is</h2>
            </div>
            
            <div className="relative aspect-video md:aspect-[2.35/1] bg-black rounded-xl overflow-hidden border-2 border-black group cursor-pointer shadow-lg">
               {/* Placeholder for video */}
               <img 
                  src="https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-[1.01]"
                  alt="Hands building lego" 
               />
               <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105">
                     <Play size={32} className="ml-1 fill-black text-black" />
                  </div>
               </div>
            </div>
            
            {/* Ad Defense / Trust Line */}
            <div className="mt-6 text-left border-l-4 border-black pl-4">
               <p className="text-stone-900 text-sm font-bold">
                  This is the entire job. <br/>
                  <span className="text-stone-600 font-medium">If it’s not model building on video, it’s not part of this.</span>
               </p>
            </div>
         </div>
      </section>

      {/* 3. How It Actually Works (Visual Steps) */}
      <section id="how-it-works" className="py-24 px-6 border-t border-black/10">
        <div className="max-w-[1200px] mx-auto">
           <h2 className="text-4xl md:text-5xl font-bold mb-20 text-black text-left">How It Actually Works</h2>

           <div className="space-y-24">
              
              {/* Step 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="order-2 md:order-1">
                    <span className="text-8xl font-black text-black/5 mb-4 block leading-none">01</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-black leading-tight">Build a model.<br/>Record as you go.</h3>
                    <p className="text-xl text-stone-800 font-medium border-l-4 border-[#DBC057] pl-4">Hands-only. No talking. No face required.</p>
                 </div>
                 <div className="order-1 md:order-2 aspect-[4/3] bg-stone-200 rounded-xl overflow-hidden border-2 border-black shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1606132742915-77633215682c?q=80&w=1000&auto=format&fit=crop" 
                      className="w-full h-full object-cover" 
                      alt="Recording setup"
                    />
                 </div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="order-2 md:order-1">
                    <span className="text-8xl font-black text-black/5 mb-4 block leading-none">02</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-black leading-tight">Submit the video.</h3>
                    <p className="text-xl text-stone-800 font-medium border-l-4 border-[#4B9F98] pl-4">Upload according to the posted guidelines.</p>
                 </div>
                 <div className="order-1 md:order-2 aspect-[4/3] bg-stone-200 rounded-xl overflow-hidden border-2 border-black shadow-md relative group">
                    <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center">
                        <Upload size={64} className="text-stone-400 mb-4" />
                        <div className="w-48 h-2 bg-stone-300 rounded-full overflow-hidden">
                           <div className="w-2/3 h-full bg-black"></div>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="order-2 md:order-1">
                    <span className="text-8xl font-black text-black/5 mb-4 block leading-none">03</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-black leading-tight">We review against<br/>clear criteria.</h3>
                    <p className="text-xl text-stone-800 font-medium border-l-4 border-[#EB6B46] pl-4">No opinions. No “almost counts.”</p>
                 </div>
                 <div className="order-1 md:order-2 aspect-[4/3] bg-stone-200 rounded-xl overflow-hidden border-2 border-black shadow-md relative">
                    <div className="absolute inset-0 bg-white p-8 flex flex-col justify-center gap-4">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-500 text-green-700"><Check size={16} strokeWidth={3} /></div>
                          <div className="h-4 w-3/4 bg-stone-100 rounded"></div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-500 text-green-700"><Check size={16} strokeWidth={3} /></div>
                          <div className="h-4 w-1/2 bg-stone-100 rounded"></div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-500 text-green-700"><Check size={16} strokeWidth={3} /></div>
                          <div className="h-4 w-2/3 bg-stone-100 rounded"></div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Step 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="order-2 md:order-1">
                    <span className="text-8xl font-black text-black/5 mb-4 block leading-none">04</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-black leading-tight">Qualified videos<br/>generate payouts.</h3>
                    <p className="text-xl text-stone-800 font-medium border-l-4 border-[#1A1A1A] pl-4">Fixed rates. Defined caps. Real cash.</p>
                 </div>
                 <div className="order-1 md:order-2 aspect-[4/3] bg-stone-200 rounded-xl overflow-hidden border-2 border-black shadow-md relative">
                     <div className="absolute inset-0 flex items-center justify-center bg-[#F0FDF4]">
                        <div className="text-center">
                           <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
                              <DollarSign size={40} strokeWidth={3} />
                           </div>
                           <div className="text-green-800 font-bold text-xl">PAYMENT SENT</div>
                        </div>
                     </div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* 4. Requirements Section */}
      <section className="py-24 px-6 border-t border-black/10">
         <div className="max-w-[1200px] mx-auto">
            <div className="mb-16">
               <h2 className="text-4xl font-bold mb-4 text-black text-left">Nothing Extra.<br/>Nothing Hidden.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
               {/* Left: Required */}
               <div>
                  <div className="mb-8 pb-4 border-b-2 border-black">
                     <span className="font-bold text-sm uppercase tracking-wider text-black">Requirements</span>
                  </div>
                  <ul className="space-y-6">
                     {[
                        "A phone or camera to record video",
                        "Physical model-building materials",
                        "The ability to follow simple guidelines"
                     ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                           <div className="mt-2 w-2 h-2 rounded-full bg-black shrink-0"></div>
                           <span className="text-xl text-black font-medium leading-snug">{item}</span>
                        </li>
                     ))}
                  </ul>
                  <div className="mt-8">
                     <p className="text-stone-600 font-bold">That’s the full list.</p>
                  </div>
               </div>

               {/* Right: Not Required */}
               <div className="bg-white p-10 rounded-2xl border-2 border-black/10 shadow-sm">
                  <h3 className="text-xl font-bold mb-8 text-black">You do <span className="underline decoration-4 decoration-yellow-400">NOT</span> need:</h3>
                  <ul className="space-y-4">
                     {[
                        "To pay anything",
                        "To buy a course",
                        "To install software",
                        "To run ads",
                        "To promote links",
                        "To show your face",
                        "To talk on camera"
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-stone-600">
                           <X size={20} className="text-stone-400 shrink-0" strokeWidth={3} />
                           <span className="text-lg font-medium">{item}</span>
                        </li>
                     ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-black/5">
                     <p className="text-base font-bold text-stone-500">
                        If it’s not model building on video, it’s not part of this.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Credibility */}
      <section className="py-24 px-6 bg-white border-y border-black/10">
         <div className="max-w-[1200px] mx-auto">
            <div className="max-w-2xl">
               <h2 className="text-3xl font-bold mb-8 text-black text-left">Why Pay for This?</h2>
               <div className="space-y-6 text-xl text-stone-800 font-medium leading-relaxed text-left">
                  <p>
                     We fund model-building content because it’s useful, repeatable, and measurable.
                  </p>
                  <p>
                     Instead of guessing at creators, followers, or engagement—we pay for completed work that meets spec.
                  </p>
                  <p className="text-black font-bold border-l-4 border-black pl-4">
                     That’s why the rules are simple, and the scope is narrow.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. Payout Framing */}
      <section className="py-24 px-6 border-b border-black/10">
         <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
               <div>
                  <h2 className="text-3xl font-bold mb-6 text-black text-left">Clear Payouts.<br/>Defined Caps.</h2>
               </div>
               <div>
                  <p className="text-lg text-stone-800 mb-8 leading-relaxed font-medium text-left">
                     Payouts are fixed per qualified video. Most contributors fall within a predictable range once they understand the guidelines. There are caps in place to keep the program sustainable.
                  </p>
                  <div className="flex gap-8 text-xs font-bold font-mono text-stone-500 uppercase tracking-wide">
                     <span>No inflated examples</span>
                     <span>No upside promises</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 px-6">
         <div className="max-w-[1200px] mx-auto">
            <div className="max-w-[800px]">
               <h2 className="text-3xl font-bold mb-12 text-black text-left">Common Questions</h2>
               <div>
                  <AccordionItem 
                     question="Do I need to pay to join?" 
                     answer="No. There is no buy-in, subscription, or hidden upgrade." 
                  />
                  <AccordionItem 
                     question="Do I need followers or an audience?" 
                     answer="No. These videos are not posted to your personal accounts." 
                  />
                  <AccordionItem 
                     question="Do I have to talk or show my face?" 
                     answer="No. Hands-only videos are acceptable." 
                  />
                  <AccordionItem 
                     question="Is this affiliate marketing or influencing?" 
                     answer="No. You’re paid for completed, qualified work—not promotion." 
                  />
                  <AccordionItem 
                     question="How do I know this isn’t a scam?" 
                     answer="Because there’s no money taken from you, no vague requirements, and no upside promises. Just work → review → payout." 
                  />
                  <AccordionItem 
                     question="What gets rejected?" 
                     answer="Videos that don’t meet the published criteria. The standards are fixed and visible upfront." 
                  />
               </div>
            </div>
         </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-32 px-6 border-t-2 border-black bg-white">
         <div className="max-w-[1200px] mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-black max-w-4xl text-left leading-[1]">
               If You Can Build Models,<br/>
               You Can Do This.
            </h2>
            <p className="text-2xl text-stone-600 mb-12 font-medium max-w-2xl text-left">
               No accounts to grow. No systems to learn. Just build and record.
            </p>
            <div className="flex flex-col items-start gap-6">
               <button className="bg-black text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl w-full md:w-auto">
                  Sign Up and Upload Your Videos Now
               </button>
               <span className="text-sm text-stone-500 font-bold uppercase tracking-wider">Small program. Clear limits. Real payouts.</span>
            </div>
         </div>
      </section>

    </div>
  );
};

export default LegoData;