import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Globe,
    Shield,
    Zap,
    Users,
    DollarSign,
    Briefcase,
    Building2,
    Code2,
    Database,
    Glasses,
    Layers,
    Cpu,
    Workflow
} from 'lucide-react';
import SeoHead from '../components/SeoHead';

const Ambassadors: React.FC = () => {
    return (
        <div className="bg-[#FAFAFA] min-h-screen text-[#111] font-sans selection:bg-blue-100 selection:text-blue-900">
            <SeoHead
                title="Ambassador Program: Earn Cash Building AI Data (2026) | Harbor"
                description="Join Harbor's Ambassador Program and earn cash by contributing AI training data. Get paid monthly, access exclusive tools, and shape the future of AI. Apply now →"
                canonical="https://harbor.ai/ambassadors"
                keywords="ambassador program, AI data, earn money, data contribution, Harbor AI, referral program"
                ogTitle="Become a Harbor Ambassador | Earn Cash Building AI Data"
                ogDescription="Join Harbor's Ambassador Program. Contribute data, refer creators, and earn monthly payouts while shaping the future of AI."
                ogImage="https://harbor.ai/og-ambassador.png"
                ogType="website"
                twitterCard="summary_large_image"
                jsonLd={[
                    {
                        "@type": "Organization",
                        "name": "Harbor AI",
                        "url": "https://harbor.ai",
                        "logo": "https://harbor.ai/logo.png",
                        "sameAs": [
                            "https://twitter.com/harborai"
                        ]
                    },
                    {
                        "@type": "WebPage",
                        "name": "Harbor Ambassador Program",
                        "description": "Earn cash by contributing AI training data through Harbor's Ambassador Program",
                        "url": "https://harbor.ai/ambassadors",
                        "mainEntity": {
                            "@type": "Product",
                            "name": "Harbor Ambassador Program",
                            "description": "A participation-based program where contributors earn cash by submitting audio/video data and referring other creators.",
                            "brand": {
                                "@type": "Brand",
                                "name": "Harbor AI"
                            }
                        }
                    }
                ]}
            />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium mb-8 shadow-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Accepting New Ambassadors
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.1] text-black"
                    >
                        Become a <br className="hidden md:block" />
                        <span className="text-blue-600">Harbor Ambassador</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
                    >
                        The Harbor Ambassador Program lets you earn cash, get early access to next-generation tools, and help shape how real-world data powers AI.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/auth/signup?ref=ambassador"
                            className="inline-flex items-center gap-2 bg-[#111] text-white px-8 py-4 rounded-full font-medium hover:bg-black p-1 pr-2 transition-all hover:scale-105 shadow-lg shadow-black/5"
                        >
                            Apply to Become an Ambassador <ArrowUpRight size={18} />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-all"
                        >
                            Learn How It Works
                        </a>
                    </motion.div>
                </div>

                {/* 3D Dashboard Mockup - Light Mode */}
                <div className="mt-32 max-w-6xl mx-auto px-4 perspective-1000">
                    <motion.div
                        initial={{ opacity: 0, rotateX: 20, y: 40 }}
                        animate={{ opacity: 1, rotateX: 0, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                        className="relative rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
                    >
                        {/* Mockup Header */}
                        <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 bg-gray-50/50">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                            </div>
                            <div className="mx-auto w-64 h-6 bg-gray-200/50 rounded-md" />
                        </div>

                        {/* Mockup Content - Dashboard View */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white min-h-[400px]">
                            {/* Sidebar Mock */}
                            <div className="hidden md:block col-span-1 space-y-4 border-r border-gray-100 pr-6">
                                <div className="h-8 w-3/4 bg-gray-100 rounded mb-6" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-blue-50 text-blue-600 rounded px-2 py-1 text-xs font-mono">DASHBOARD</div>
                                    <div className="h-4 w-5/6 bg-white rounded px-2 text-xs text-gray-400">DATASETS</div>
                                    <div className="h-4 w-4/6 bg-white rounded px-2 text-xs text-gray-400">REFERRALS</div>
                                    <div className="h-4 w-full bg-white rounded px-2 text-xs text-gray-400">EARNINGS</div>
                                </div>
                            </div>

                            {/* Main Content Mock */}
                            <div className="col-span-1 md:col-span-3">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <div className="h-6 w-48 bg-gray-100 rounded mb-2" />
                                        <div className="h-4 w-32 bg-gray-50 rounded" />
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="text-xs text-gray-500 mb-1">PENDING SUBMISSIONS</div>
                                        <div className="text-2xl font-bold text-gray-900">12</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="text-xs text-gray-500 mb-1">APPROVED REFERRALS</div>
                                        <div className="text-2xl font-bold text-gray-900">5</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="text-xs text-gray-500 mb-1">TOTAL EARNINGS</div>
                                        <div className="text-2xl font-bold text-green-600">$1,250.00</div>
                                    </div>
                                </div>

                                <div className="border border-gray-100 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 text-xs font-medium text-gray-500">RECENT ACTIVITY</div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="text-sm text-gray-700">Video Submission: Hand Gestures #402</span>
                                            </div>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Approved (+ $50)</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="text-sm text-gray-700">Referral: A. Smith (Data Scientist)</span>
                                            </div>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Joined</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                                <span className="text-sm text-gray-700">Audio Set: Urban Environment</span>
                                            </div>
                                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">In Review</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* WHAT IS HARBOR AMBASSADOR */}
            <section className="py-24 px-6 bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black">What is the Harbor Ambassador Program?</h2>
                    <p className="text-xl text-gray-600 mb-12 leading-relaxed font-light">
                        Harbor Ambassadors are trusted contributors who help grow Harbor’s data ecosystem by sourcing, creating, and referring high-quality audio and video data.
                        <br /><br />
                        Unlike traditional referral programs, this is not about links or signups.
                        It’s about <strong className="font-semibold text-gray-900">participation</strong> in building real datasets used by AI labs, enterprises, and creative systems.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: "Contribute Data", icon: <Database className="text-blue-600 mb-4" size={32} />, desc: "Create or submit approved audio and video content (e.g. voice recordings, hands-only build videos, real-world activities)." },
                            { title: "Refer Contributors", icon: <Users className="text-purple-600 mb-4" size={32} />, desc: "Invite creators, builders, or specialists who can contribute valuable data." },
                            { title: "Shape the Platform", icon: <Layers className="text-green-600 mb-4" size={32} />, desc: "Early ambassadors help define new data categories, workflows, and tools." }
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                                {item.icon}
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW YOU EARN */}
            <section className="py-24 px-6 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black">How You Earn</h2>
                        <p className="text-gray-500 text-lg">This is not a one-time payout program. It’s a long-term participation model.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Cash Payouts */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                                <DollarSign size={28} />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Cash Payouts</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex gap-2">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Paid for approved data submissions</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Paid for successful contributor referrals</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>Payments issued monthly once approved</span>
                                </li>
                            </ul>
                        </div>

                        {/* Compounding Rewards */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                <Workflow size={28} />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Compounding Rewards</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex gap-2">
                                    <CheckCircle size={18} className="text-blue-500 mt-1 shrink-0" />
                                    <span>Ongoing earnings from datasets that continue to be licensed</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle size={18} className="text-blue-500 mt-1 shrink-0" />
                                    <span>Priority access to higher-value data programs</span>
                                </li>
                            </ul>
                        </div>

                        {/* Hardware Access */}
                        <div className="bg-gradient-to-b from-gray-900 to-black text-white p-8 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="text-[10px] font-mono border border-white/20 px-2 py-1 rounded-full uppercase tracking-wider bg-white/10">Coming 2026</span>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-all" />

                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white border border-white/10">
                                <Glasses size={28} />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Hardware Access</h3>
                            <p className="text-gray-400 mb-4 text-sm">Top ambassadors receive Harbor-enabled AR glasses, unlocking:</p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                                    <span>Real-world data capture</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                                    <span>Passive earning through contextual data processing</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                                    <span>Early access to new data pipelines</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY HARBOR IS DIFFERENT */}
            <section className="py-24 px-6 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">Why Harbor Is Different</h2>
                            <p className="text-gray-600">Most platforms treat data as a commodity. Harbor is building media-native infrastructure.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            {[
                                { head: "Audio + Video at Scale", sub: "Not just text or static layout" },
                                { head: "Annotation & QA", sub: "Provenance built-in from day 1" },
                                { head: "Continuous Improvement", sub: "Systems that learn from usage" },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="font-semibold text-gray-900 mb-2">{item.head}</div>
                                    <div className="text-sm text-gray-500">{item.sub}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 text-center border-t border-gray-200 pt-8">
                            <p className="text-lg font-medium text-gray-800">
                                "As an ambassador, you’re not just contributing content — you’re helping train systems that interact with the real world."
                            </p>
                        </div>
                    </div>

                    <div className="mt-20">
                        <h3 className="text-2xl font-semibold mb-8 text-center">Who This Is For</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {["Builders and makers", "Creators and editors", "Engineers and technologists", "People curious about AI", "Anyone wanting meaningful work"].map((tag, i) => (
                                <span key={i} className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:border-gray-300 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <p className="text-center text-gray-400 mt-6 text-sm">No prior AI experience required.</p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS STEPS */}
            <section id="how-it-works" className="py-24 px-6 bg-[#FAFAFA]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black">How the Program Works</h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

                        <div className="space-y-12 relative">
                            {[
                                { step: "Step 1", title: "Apply to the Ambassador Program", icon: <Briefcase size={20} /> },
                                { step: "Step 2", title: "Get approved and access your dashboard", icon: <Shield size={20} /> },
                                { step: "Step 3", title: "Submit data or refer contributors", icon: <Users size={20} /> },
                                { step: "Step 4", title: "Content is reviewed, annotated, and approved", icon: <CheckCircle size={20} /> },
                                { step: "Step 5", title: "Get paid + unlock higher-tier programs", icon: <DollarSign size={20} /> },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}>
                                    <div className={`flex-1 text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="text-sm font-mono text-blue-600 mb-1">{item.step}</div>
                                        <div className="text-lg font-medium text-gray-900">{item.title}</div>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* LONG TERM VISION */}
            <section className="py-24 px-6 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/10" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Cpu className="mx-auto text-blue-500 mb-6" size={48} />
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8">Long-Term Vision</h2>
                    <p className="text-xl text-gray-400 mb-12 font-light">
                        Harbor Ambassadors will be the first users of real-time data capture tools, wearable-enabled data collection, and AI-assisted workflows that reward participation.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 inline-block">
                        <p className="font-mono text-sm text-blue-300">This program evolves as the platform evolves.</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 px-6 bg-white border-t border-gray-200">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-black">Frequently asked questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Who can refer candidates?", a: "Anyone with a Harbor account can join the Ambassador program. You do not need to be a contributor yourself." },
                            { q: "How will I know what's happening with my referrals?", a: "Your dashboard tracks every click, signup, and status change in real-time." },
                            { q: "When do payouts happen?", a: "Payouts are processed on the 1st of every month for all referrals verified in the previous period." },
                            { q: "Is there a limit to how many referrals I can submit?", a: "No limit. Top ambassadors earning over $10k/month get access to VIP tier benefits." }
                        ].map((item, i) => (
                            <FAQItem key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-32 px-6 text-center bg-[#FAFAFA]">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-black">
                        Help Build What AI Learns From
                    </h2>
                    <p className="text-xl text-gray-500 mb-10">
                        Join Harbor’s Ambassador Program and be part of the data layer powering future systems.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link
                            to="/auth/signup?ref=ambassador"
                            className="inline-block bg-[#111] text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-black hover:scale-105 transition-all shadow-xl shadow-black/10"
                        >
                            Apply Now
                        </Link>
                        <a
                            href="#faq"
                            className="inline-block bg-white text-gray-700 border border-gray-200 px-10 py-4 rounded-full font-medium text-lg hover:bg-gray-50 transition-colors"
                        >
                            Read Ambassador FAQ
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden hover:border-gray-300 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-medium text-lg text-gray-900">{question}</span>
                {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-gray-500 leading-relaxed bg-gray-50/50">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default Ambassadors;
