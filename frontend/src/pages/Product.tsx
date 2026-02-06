import React, { useState } from 'react';
import { ArrowRight, Play, Wand2, Layers, ChevronRight, Upload } from 'lucide-react';
import SeoHead from '../components/SeoHead';

const Product: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Virtual Staging');

  const features = [
    'Transform Video', 'Mood Boards', 'Virtual Staging', 'Character Performance', 'Virtual Try-On', 'Design Explorations'
  ];

  return (
    <div className="w-full bg-white text-black animate-in fade-in duration-700 min-h-screen font-sans">
      <SeoHead
        title="Harbor Product: AI Video Generation & Media Data Stack"
        description="Harbor product: media-native ingestion, frame-accurate annotation fabric, RAG dataset engine, APIs, and ad creative execution."
        canonical="https://harborml.com/product"
        ogImage="https://harborml.com/harbor-architecture-stack-diagram.webp"
        keywords="AI video generation, media data stack, video annotation API, dataset engine, creative automation"
        jsonLd={{
          "@type": "SoftwareApplication",
          "@id": "https://harborml.com/product#software",
          "name": "Harbor ML Platform",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Enterprise data infrastructure for multimodal AI training with video generation, annotation, and dataset management",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "description": "Free tier available, enterprise pricing on request"
          },
          "featureList": [
            "Video Generation",
            "Frame-accurate Annotation",
            "RAG Dataset Engine",
            "API Access",
            "Ad Creative Automation"
          ],
          "screenshot": "https://harborml.com/harbor-architecture-stack-diagram.webp",
          "provider": {
            "@type": "Organization",
            "name": "Harbor ML",
            "url": "https://harborml.com"
          }
        }}
      />

      {/* 1. Hero Section (Dark, Video Background) - Boxed Style */}
      <section className="relative w-full px-4 md:px-6 py-4 max-w-[1600px] mx-auto">
        <div className="relative w-full h-[75vh] min-h-[600px] rounded-2xl overflow-hidden bg-black text-white flex items-center justify-center border border-white/5">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop"
              alt="Harbor ML video generation platform hero background with abstract AI visualization"
              width={2874}
              height={1916}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 text-center mt-0">
            <span className="text-gray-300 text-sm md:text-base font-medium mb-4 block tracking-wide">
              Introducing Gen-4.5
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-8 leading-[0.95]">
              A new frontier for <br />
              video generation.
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full px-6 sm:px-0">
              <button className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto">
                Learn More <ChevronRight size={14} />
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto">
                Get Started <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Logo Strip (Light) */}
      {/* Matching Screenshot 2: White background, grayscale logos */}


      {/* 3. "Creative Toolkit" Statement (Light) */}
      {/* Matching Screenshot 2 middle: Large centered text on white */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#1A1A1A] leading-[1.1]">
            A new kind of creative toolkit with everything you need to generate any video, image or piece of content you want.
          </h2>
        </div>
      </section>

      {/* 4. "Dozens of Tools" + Tabs + Feature Demo (Light) */}
      {/* Matching Screenshot 2 bottom & Screenshot 3: Interactive tab section */}
      <section className="py-20 px-6 max-w-[1600px] mx-auto bg-white">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A] mb-2">
            Dozens of tools.
          </h2>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A]">
            Endless ways to create.
          </h2>
        </div>

        {/* Navigation Tabs (Pills) */}
        <div className="flex flex-wrap gap-2 mb-16 border-b border-gray-100 pb-4 overflow-x-auto">
          {features.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                ? 'bg-[#1A1A1A] text-white shadow-lg'
                : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Feature Showcase Component */}
        <div className="flex flex-col lg:flex-row gap-16 items-center min-h-[500px]">
          {/* Text Side */}
          <div className="lg:w-1/3 animate-in fade-in slide-in-from-left-4 duration-500" key={`text-${activeTab}`}>
            <h3 className="text-2xl font-medium text-[#1A1A1A] mb-4">
              {activeTab === 'Transform Video' && 'Video-to-Video Transformation'}
              {activeTab === 'Mood Boards' && 'Intelligent Mood Boarding'}
              {activeTab === 'Virtual Staging' && 'Stage Any Space in Seconds'}
              {activeTab === 'Character Performance' && 'Direct Character Performances'}
              {activeTab === 'Virtual Try-On' && 'Photorealistic Virtual Try-On'}
              {activeTab === 'Design Explorations' && 'Rapid Design Iteration'}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              {activeTab === 'Transform Video' && 'Apply style transfers, verify temporal consistency, and alter lighting conditions across video sequences without manual rotoscoping.'}
              {activeTab === 'Mood Boards' && 'Generate cohesive aesthetic directions. Combine reference images, textures, and color palettes into unified visual concepts instantaneously.'}
              {activeTab === 'Virtual Staging' && 'Dress a space without any complex 3D workflows or compositing. Simply provide a reference image of your room alongside the items you\'d like to see in it.'}
              {activeTab === 'Character Performance' && 'Transfer facial expressions and motion from reference video to generated characters with frame-perfect synchronization.'}
              {activeTab === 'Virtual Try-On' && 'Visualize garments on any model or avatar. Handles complex drape, lighting, and fabric textures automatically.'}
              {activeTab === 'Design Explorations' && 'Generate hundreds of variations for product designs, packaging, or architectural concepts in minutes based on simple sketches.'}
            </p>

            {/* Dynamic Mockup UI Element */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm max-w-sm">
              <div className="flex gap-3 mb-3">
                <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                  {/* content specific thumbnails could go here */}
                  <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900 mb-1">
                    {activeTab === 'Mood Boards' ? 'Generate concept from...' : 'Processing input...'}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {activeTab === 'Virtual Staging' && (
                      <>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 border border-gray-200">a couch</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 border border-gray-200">classic rug</span>
                      </>
                    )}
                    {activeTab === 'Mood Boards' && (
                      <>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 border border-gray-200">cyberpunk city</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 border border-gray-200">neon rain</span>
                      </>
                    )}
                    {activeTab !== 'Virtual Staging' && activeTab !== 'Mood Boards' && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 border border-gray-200">analyzing...</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="lg:w-2/3 w-full animate-in fade-in slide-in-from-right-4 duration-500" key={`img-${activeTab}`}>
            <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-gray-50 shadow-2xl shadow-gray-200/50 relative group">
              <img
                src={
                  activeTab === 'Transform Video' ? "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2940&auto=format&fit=crop" :
                    activeTab === 'Mood Boards' ? "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop" :
                      activeTab === 'Virtual Staging' ? "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=3000&auto=format&fit=crop" :
                        activeTab === 'Character Performance' ? "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2825&auto=format&fit=crop" :
                          activeTab === 'Virtual Try-On' ? "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=2864&auto=format&fit=crop" :
                            "https://images.unsplash.com/photo-1614726365723-498aa46c0052?q=80&w=2787&auto=format&fit=crop"
                }
                alt={activeTab}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay for some text/ui feel */}
              <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-mono border border-white/10">
                GEN_MODE: {activeTab.toUpperCase().replace(' ', '_')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Stories (Light) */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest">Customer Stories</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-[16/9] bg-black rounded-lg overflow-hidden mb-6 relative">
                <img
                  src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2825&auto=format&fit=crop"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-white font-bold text-xl tracking-tight">harbor <span className="font-light mx-2">|</span> <span className="font-serif">HOUSE OF DAVID</span></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Customer Stories</p>
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-3 leading-tight group-hover:underline decoration-1 underline-offset-4">
                How "House of David" Used Harbor to Become Amazon's Latest Hit Series
              </h3>
              <div className="text-sm font-medium text-[#1A1A1A] border-b border-black/10 pb-0.5 inline-block">Read More</div>
            </div>

            {/* Story 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-[16/9] bg-black rounded-lg overflow-hidden mb-6 relative">
                <img
                  src="https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=2864&auto=format&fit=crop"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-white font-bold text-xl tracking-tight">harbor <span className="font-light mx-2">|</span> <span className="font-mono">H</span> HISTORY</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Customer Stories</p>
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-3 leading-tight group-hover:underline decoration-1 underline-offset-4">
                How Eggplant Picture & Sound transformed History Channel's "Life After People"
              </h3>
              <div className="text-sm font-medium text-[#1A1A1A] border-b border-black/10 pb-0.5 inline-block">Read More</div>
            </div>

            {/* Story 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-[16/9] bg-black rounded-lg overflow-hidden mb-6 relative">
                <img
                  src="https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2940&auto=format&fit=crop"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-white font-bold text-xl tracking-tight">harbor <span className="font-light mx-2">|</span> <span className="font-sans font-black">UNDER ARMOUR</span></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Customer Stories</p>
              <h3 className="text-xl font-medium text-[#1A1A1A] mb-3 leading-tight group-hover:underline decoration-1 underline-offset-4">
                Behind the Scenes of an Under Armour TV Commercial, Powered by Harbor
              </h3>
              <div className="text-sm font-medium text-[#1A1A1A] border-b border-black/10 pb-0.5 inline-block">Read More</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA (Light) */}
      <section className="py-24 px-6 text-center bg-gray-50 border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A] mb-8">
            Start creating today.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary px-8 py-3.5 text-lg w-full sm:w-auto shadow-xl shadow-black/5">
              Get Started for Free
            </button>
            <button className="px-8 py-3.5 bg-white border border-gray-200 text-[#1A1A1A] rounded-full font-medium text-lg hover:bg-gray-50 transition-colors w-full sm:w-auto">
              Contact Sales
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-500">No credit card required for developer tier.</p>
        </div>
      </section>
    </div>
  );
};

export default Product;