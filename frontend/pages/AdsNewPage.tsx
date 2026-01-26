import React from 'react';
import { Link } from 'react-router-dom';
import {
    Play,
    Layers,
    Globe,
    ShieldCheck,
    Zap,
    BarChart2,
    RefreshCw,
    ArrowRight,
    PlayCircle,
    Check,
    X,
    Facebook,
    Instagram,
    Youtube,
    Twitter,
    Linkedin,
    Github
} from 'lucide-react';

const AdsNewPage: React.FC = () => {
    return (
        <div className="w-full bg-[#000000] text-slate-400 font-sans selection:bg-blue-500/30 selection:text-blue-200 min-h-screen">
            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)'
            }} />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="text-white font-semibold tracking-tighter text-lg flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-black rounded-sm"></div>
                            </div>
                            HARBOR
                        </Link>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                            <Link to="/platform" className="hover:text-white transition-colors">Platform</Link>
                            <Link to="/ads" className="hover:text-white transition-colors">Creative</Link>
                            <Link to="/enterprise" className="hover:text-white transition-colors">Enterprise</Link>
                            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden md:block text-sm font-medium hover:text-white transition-colors">Login</Link>
                        <Link to="/auth/signup" state={{ intent: 'ads' }} className="text-xs font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-10 px-6 relative overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">

                    <h1 className="text-6xl md:text-8xl font-medium text-white tracking-tight mb-8 leading-[1]" style={{ textShadow: '0 0 40px rgba(255,255,255,0.15)' }}>
                        Get Winning Ads Faster
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        A new kind of hybrid creative platform: not AI, not humans – the best of both.
                    </p>

                    <Link to="/auth/signup" state={{ intent: 'ads' }} className="bg-[#3B82F6] hover:bg-blue-600 text-white font-medium text-base px-8 py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                        See a Demo
                    </Link>

                </div>

                {/* Trusted By Section */}
                <div className="mt-24 mb-12 text-center">
                    <p className="text-sm text-slate-500 mb-8 font-medium">Trusted by:</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-90">
                        <div className="flex items-center gap-2 text-white">
                            <span className="font-bold tracking-tight text-xl">futurhealth</span>
                        </div>
                        <div className="flex items-center gap-1 text-white">
                            <span className="font-bold text-xl tracking-tighter">coinbase</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                            <span className="font-medium tracking-[0.2em] text-sm">TOVALA</span>
                        </div>
                        <div className="text-white font-bold tracking-widest text-sm uppercase">
                            BUTCHERBOX
                        </div>
                        <div className="text-white font-serif font-bold text-2xl tracking-tight">
                            Ollie
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            {/* Replaced Iconify with text for simplicity or keep if needed */}
                            <span className="font-bold tracking-tight text-lg italic">DOORDASH</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <span className="font-medium">classpass</span>
                        </div>
                    </div>
                </div>

                {/* Video Section */}
                <div className="mt-16 max-w-7xl mx-auto relative group">
                    <div className="relative w-full aspect-[2.35/1] rounded-lg overflow-hidden border border-white/10 bg-[#111]">
                        <img src="https://images.unsplash.com/photo-1576049519901-ef17971a3c46?q=80&w=2500&auto=format&fit=crop" alt="Cinematic Launch Video" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out" />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        <div className="absolute inset-0 flex items-end justify-center pb-12">
                            <button className="group/btn flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3 rounded-lg text-white text-sm font-medium transition-all hover:scale-105">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Play className="w-4 h-4 fill-white text-white" />
                                </div>
                                Watch Our Launch Video
                            </button>
                            <div className="absolute bottom-4 right-4 bg-white/90 text-black text-xs px-2 py-1 rounded shadow-lg hidden md:block">
                                Google Chrome
                                <div className="absolute -bottom-1 right-2 w-2 h-2 bg-white/90 rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Bento Grid */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-4">Complete control over<br />your creative workflow.</h2>
                        <p className="text-lg text-slate-400 max-w-xl">Abstract away the complexities of creative production, editing, and compliance into a single unified platform.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="col-span-1 md:col-span-2 rounded-2xl p-8 border border-white/10 bg-white/[0.02] relative overflow-hidden group hover:border-white/20 hover:bg-white/[0.04] transition-all">
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl text-white font-medium mb-2">Multi-Format Generation</h3>
                                <p className="text-sm text-slate-400 max-w-sm">Automatically generate assets for TikTok, Instagram Reels, and YouTube Shorts from a single source file.</p>
                            </div>
                            {/* UI Snippet Visual */}
                            <div className="absolute right-0 bottom-0 w-[60%] h-[80%] bg-[#0F0F0F] rounded-tl-xl border-t border-l border-white/10 p-4 font-mono text-xs text-slate-300 translate-y-4 translate-x-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2">
                                <div className="flex gap-1.5 mb-3 opacity-50">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Format</span>
                                        <span className="text-blue-400">9:16 Vertical</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Duration</span>
                                        <span className="text-blue-400">0:15s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Hooks</span>
                                        <span className="text-green-400">Optimized</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="rounded-2xl p-8 border border-white/10 bg-white/[0.02] relative overflow-hidden hover:border-white/20 hover:bg-white/[0.04] transition-all">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl text-white font-medium mb-2">Global Localization</h3>
                            <p className="text-sm text-slate-400">Translate and dub ads into 30+ languages instantly with native-level accuracy.</p>
                            <div className="absolute bottom-0 right-0 left-0 h-32 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
                        </div>

                        {/* Card 3 */}
                        <div className="rounded-2xl p-8 border border-white/10 bg-white/[0.02] relative overflow-hidden hover:border-white/20 hover:bg-white/[0.04] transition-all">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl text-white font-medium mb-2">Brand Compliance</h3>
                            <p className="text-sm text-slate-400">Automated checks ensure every frame meets your brand guidelines before export.</p>
                        </div>

                        {/* Card 4 */}
                        <div className="col-span-1 md:col-span-2 rounded-2xl p-8 border border-white/10 bg-white/[0.02] relative overflow-hidden group hover:border-white/20 hover:bg-white/[0.04] transition-all">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl text-white font-medium mb-2">Performance Data</h3>
                                    <p className="text-sm text-slate-400">Feed performance data back into the creative engine to iterate on winning concepts automatically.</p>
                                </div>
                                <div className="relative h-full min-h-[160px] flex items-center justify-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white shadow-lg">
                                            <BarChart2 className="w-6 h-6" />
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse"></div>
                                            <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse delay-75"></div>
                                            <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse delay-150"></div>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white shadow-lg">
                                            <RefreshCw className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Integration Section */}
            <section className="py-32 px-6 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                        {/* Left Content */}
                        <div className="space-y-16">
                            <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight leading-[1.1]">
                                Fits Your<br />Workflow
                            </h2>

                            <div className="space-y-12">
                                <div className="group">
                                    <h3 className="text-xl text-white font-medium mb-3 group-hover:text-blue-400 transition-colors flex items-center gap-3">
                                        Upload ads easily
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed max-w-md">
                                        We match your naming conventions automatically. Bulk upload your assets and let our system organize them exactly how you want, when you want.
                                    </p>
                                </div>

                                <div className="group">
                                    <h3 className="text-xl text-white font-medium mb-3 group-hover:text-blue-400 transition-colors flex items-center gap-3">
                                        Follows your specs
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed max-w-md">
                                        No changing existing workflows. Deep integration with Google Sheets means that when an ad is approved or uploaded, your media buying team knows instantly.
                                    </p>
                                </div>

                                <div className="group">
                                    <h3 className="text-xl text-white font-medium mb-3 group-hover:text-blue-400 transition-colors flex items-center gap-3">
                                        Multi-Platform Native
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed max-w-md">
                                        Export directly to Meta, TikTok, and YouTube ad managers with a single click, preserving all metadata and campaign structures.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="relative w-full aspect-square md:aspect-[4/3] lg:h-[600px] rounded-3xl border border-white/10 bg-[#050505] overflow-hidden flex flex-col items-center justify-center p-8 lg:p-12 shadow-2xl">
                            {/* Background Grid Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

                            {/* Diagram Container */}
                            <div className="relative z-10 w-full max-w-lg flex flex-col items-center">

                                {/* Top Icons Row */}
                                <div className="flex items-center justify-between w-full px-4 mb-12 relative">
                                    {/* Connecting Lines would go here as SVGs - simplifying for React */}
                                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"></div>

                                    {/* Icons */}
                                    <div className="w-12 h-12 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group cursor-default z-10">
                                        <Facebook className="text-blue-500" size={24} />
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group cursor-default z-10">
                                        <Instagram className="text-pink-500" size={24} />
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group cursor-default z-10">
                                        <Zap className="text-yellow-400" size={24} />
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group cursor-default z-10">
                                        <Youtube className="text-red-500" size={24} />
                                    </div>
                                </div>

                                {/* Engine Box */}
                                <div className="w-full bg-[#0F0F0F] rounded-xl border border-white/10 p-1 relative overflow-hidden shadow-2xl z-10">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                                    <div className="bg-[#141414] rounded-lg p-6 border border-white/5">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Hybrid Engine</span>
                                            <div className="flex gap-1.5 items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[10px] font-medium text-emerald-500 tracking-wide">ONLINE</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-5 gap-3">
                                            {/* Mock Ad Cards */}
                                            {['blue', 'blue', 'processing', 'none', 'none'].map((status, i) => (
                                                <div key={i} className={`aspect-[9/16] rounded bg-[#222] relative overflow-hidden group hover:ring-1 ring-blue-500/50 transition-all border border-white/5 ${status === 'processing' ? 'transform -translate-y-2 border-blue-500/30' : ''}`}>
                                                    <div className="w-full h-full bg-gray-800 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                                                    {status === 'blue' && (
                                                        <div className="absolute bottom-1 left-1 right-1 h-1 rounded-full bg-white/10 overflow-hidden">
                                                            <div className={`h-full bg-blue-500 ${i === 0 ? 'w-1/2' : 'w-3/4'}`}></div>
                                                        </div>
                                                    )}

                                                    {status === 'processing' && (
                                                        <>
                                                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-lg h-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,1)]"></div>
                                                            <div className="absolute bottom-2 left-2 right-2">
                                                                <div className="text-[6px] text-white/70 font-mono mb-0.5 tracking-tighter">processing...</div>
                                                                <div className="h-0.5 w-full bg-blue-500/30 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-blue-500 w-[60%] animate-pulse"></div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-32 px-6 relative overflow-hidden border-t border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.06),transparent_50%)]"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-8 leading-[1.1]">
                        Build your creative<br />engine today.
                    </h2>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Stop manually editing thousands of variations. Start automating with Harbor and scale your winners instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/auth/signup" className="group bg-white text-black text-sm font-medium px-8 py-4 rounded-full hover:bg-slate-200 transition-all flex items-center gap-2">
                            Get Started
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-black" />
                        </Link>
                        <button className="text-slate-400 text-sm font-medium hover:text-white transition-colors flex items-center gap-2">
                            <PlayCircle className="w-5 h-5" />
                            Watch 2-min demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#030303] py-16 px-6 text-sm">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="text-white font-semibold tracking-tighter text-lg flex items-center gap-2 mb-6">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                            HARBOR
                        </Link>
                        <p className="text-slate-500 mb-6">
                            New York, NY<br />
                            © 2024 Harbor Inc.
                        </p>
                        <div className="flex gap-4 text-slate-400">
                            <Twitter className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                            <Github className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                            <Linkedin className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-medium">Product</h4>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Video Ads</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Static Assets</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">UGC</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Pricing</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-medium">Resources</h4>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Blog</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Ad Library</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Community</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Help Center</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-medium">Company</h4>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">About</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Careers</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Contact</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors">Legal</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdsNewPage;
