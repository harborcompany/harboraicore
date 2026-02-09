import React from 'react';
import { Camera, CheckCircle, Clock, DollarSign, HelpCircle, Video, List, X } from 'lucide-react';

const ModelDataRequests: React.FC = () => {
    const handleApply = () => {
        window.location.href = '/onboarding/lego-experience';
    };

    return (
        <div className="font-sans text-[#1A1A1A] antialiased">
            {/* Hero Section */}
            <header className="py-20 px-6 text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-6 text-[#1A1A1A]">
                    Get Paid for Building LEGO
                </h1>
                <p className="text-xl md:text-2xl font-light text-stone-600 mb-8 leading-relaxed">
                    Turn your builds into real AI training data.
                </p>
                <div className="max-w-2xl mx-auto text-lg text-stone-600 space-y-4 mb-10">
                    <p>
                        Harbor ML is working with AI and robotics research teams to train systems that understand real-world construction and assembly.
                    </p>
                    <p>
                        To do that, we’re collecting high-quality videos of people building LEGO models at home — <span className="font-medium text-[#1A1A1A]">hands only, no talking, no editing.</span>
                    </p>
                    <p>
                        If you already build LEGO, this is a way to earn money from something you already enjoy.
                    </p>
                </div>
                <button
                    onClick={handleApply}
                    className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#333] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    Apply to Participate
                </button>
            </header>

            {/* What You'll Be Doing */}
            <section className="bg-stone-50 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-serif font-medium text-center mb-12">What You’ll Be Doing</h2>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-xl font-light">
                                You’ll record yourself building LEGO models from start to finish.
                            </p>
                            <p className="text-3xl font-serif italic text-stone-400">That’s it.</p>
                            <ul className="space-y-3 text-lg text-stone-600">
                                <li className="flex items-center gap-3">
                                    <X className="text-stone-400" size={20} />
                                    No voiceover
                                </li>
                                <li className="flex items-center gap-3">
                                    <X className="text-stone-400" size={20} />
                                    No face
                                </li>
                                <li className="flex items-center gap-3">
                                    <X className="text-stone-400" size={20} />
                                    No fancy setup
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
                            <h3 className="text-lg font-medium mb-6 uppercase tracking-wider text-stone-500 text-sm">Just Require:</h3>
                            <ul className="space-y-4">
                                {[
                                    'Your hands',
                                    'LEGO bricks',
                                    'A stable camera',
                                    'A continuous build session'
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-lg">
                                        <CheckCircle className="text-green-600" size={24} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 pt-6 border-t border-stone-100 text-sm text-stone-500 italic">
                                These videos are used to train AI systems that learn how humans assemble objects step by step.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We're Looking For */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-serif font-medium text-center mb-12">What We’re Looking For</h2>
                    <p className="text-center text-lg text-stone-600 mb-12">
                        We accept a wide range of builds — from simple to complex.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-stone-200 rounded-xl p-8 hover:border-stone-400 transition-colors">
                            <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                                <Video size={24} /> Accepted Videos
                            </h3>
                            <ul className="space-y-3 text-stone-600">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-800" />
                                    Hands-only LEGO builds
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-800" />
                                    New builds started from scratch
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-800" />
                                    Continuous footage (no cuts or edits)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-800" />
                                    Clear view of bricks and hands
                                </li>
                            </ul>
                        </div>
                        <div className="border border-stone-200 rounded-xl p-8 hover:border-stone-400 transition-colors">
                            <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                                <Clock size={24} /> Build Types
                            </h3>
                            <ul className="space-y-3 text-stone-600">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-800" />
                                    Simple builds (5–10 minutes)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-800" />
                                    Medium builds (15–30 minutes)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-800" />
                                    Longer sessions (up to ~60 minutes)
                                </li>
                            </ul>
                            <p className="mt-4 text-sm text-stone-500">
                                A mix of short and long builds is ideal. You do not need rare sets or advanced filming equipment.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recording Requirements */}
            <section className="bg-[#1A1A1A] text-white py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-serif font-medium text-center mb-4">Recording Requirements (Important)</h2>
                    <p className="text-center text-stone-400 mb-12">To ensure your video can be approved and paid:</p>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {[
                            { icon: Camera, title: 'Camera', desc: 'Fixed position (phone, webcam, or camera)' },
                            { icon: List, title: 'Framing', desc: 'Hands and build area fully visible' }, // Using List as placeholder for Hand icon if unavailable
                            { icon: Video, title: 'Audio', desc: 'No talking, no music, no TV' },
                            { icon: HelpCircle, title: 'Lighting', desc: 'Well-lit, no harsh shadows' }, // Using HelpCircle for Lightbulb
                            { icon: Video, title: 'Editing', desc: 'None — raw, continuous footage only' }
                        ].map((req, i) => (
                            <div key={i} className="bg-white/10 p-6 rounded-xl backdrop-blur-sm text-center">
                                <req.icon className="mx-auto mb-3 text-white/80" size={28} />
                                <h3 className="font-medium mb-2">{req.title}</h3>
                                <p className="text-sm text-white/60">{req.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-serif font-medium text-center mb-12">How the Process Works</h2>
                    <div className="space-y-8 relative before:absolute before:left-[19px] md:before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-stone-200">
                        {[
                            { title: 'Apply', desc: 'Tell us a bit about the LEGO you build and your setup.' },
                            { title: 'Get Approved', desc: 'We review applications to ensure quality and fit.' },
                            { title: 'Submit Videos', desc: 'Upload your build videos through your Harbor account.' },
                            { title: 'Review & Validation', desc: 'Videos are checked for authenticity, quality, and originality.' },
                            { title: 'Get Paid', desc: 'Approved videos are paid out on a rolling basis.' }
                        ].map((step, i) => (
                            <div key={i} className="relative flex items-center md:justify-center">
                                <div className="absolute left-0 md:left-1/2 -ml-3 w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold z-10 md:-translate-x-1/2">
                                    {i + 1}
                                </div>
                                <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right md:mr-auto' : 'md:pl-12 md:text-left md:ml-auto'}`}>
                                    <h3 className="text-xl font-medium mb-1">{step.title}</h3>
                                    <p className="text-stone-600">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment & Bonuses */}
            <section className="bg-stone-50 py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-medium mb-12">Payment & Bonuses</h2>
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <DollarSign className="mx-auto mb-4 text-green-600" size={32} />
                            <h3 className="font-medium">Paid per approved video</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <CheckCircle className="mx-auto mb-4 text-blue-600" size={32} />
                            <h3 className="font-medium">Bonuses for high-quality builds</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <Clock className="mx-auto mb-4 text-purple-600" size={32} />
                            <h3 className="font-medium">Monthly bonus pools</h3>
                        </div>
                    </div>
                    <div className="bg-white inline-block px-8 py-6 rounded-2xl shadow-sm border border-stone-200">
                        <h4 className="font-medium mb-4 uppercase tracking-wide text-xs text-stone-500">Payout Timing</h4>
                        <div className="space-y-2 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>First payout: within 90 days of approval</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>Ongoing payouts: every 30 days thereafter</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-stone-500 text-sm">
                        Exact rates depend on video length, clarity, and usefulness for AI training.
                    </p>
                </div>
            </section>

            {/* What Happens to Videos */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-medium mb-8">What Happens to the Videos?</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
                        <div className="p-6 bg-stone-50 rounded-lg">
                            <h3 className="font-medium text-lg mb-2">Structured</h3>
                            <p className="text-stone-600 text-sm">Annotated and structured by Harbor ML</p>
                        </div>
                        <div className="p-6 bg-stone-50 rounded-lg">
                            <h3 className="font-medium text-lg mb-2">Training</h3>
                            <p className="text-stone-600 text-sm">Used to train AI and robotics systems</p>
                        </div>
                        <div className="p-6 bg-stone-50 rounded-lg">
                            <h3 className="font-medium text-lg mb-2">Licensed</h3>
                            <p className="text-stone-600 text-sm">Licensed to research labs working on real-world AI</p>
                        </div>
                    </div>
                    <div className="text-2xl font-serif italic text-stone-500">
                        "You keep building LEGO. We handle everything else."
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-stone-50 py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif font-medium text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: 'Do I need to talk or explain what I’m doing?', a: 'No. In fact, please don’t. Silence is required.' },
                            { q: 'Do I need to show my face?', a: 'No. Hands and LEGO only.' },
                            { q: 'Can I submit multiple videos?', a: 'Yes. Many contributors submit multiple builds.' },
                            { q: 'Can I build across multiple sessions?', a: 'Yes — as long as each video is continuous and unedited.' },
                            { q: 'Can I submit old footage?', a: 'No. Videos must be newly recorded for this program.' },
                            { q: 'Who owns the LEGO?', a: 'You do. We’re licensing the video data, not the bricks.' },
                            { q: 'What if my video is rejected?', a: 'We’ll explain why and what to fix before resubmitting.' }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                                <h3 className="font-medium text-lg mb-2">{faq.q}</h3>
                                <p className="text-stone-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who This Is For & CTA */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-serif font-medium mb-8">Who This Is For</h2>
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {['LEGO hobbyists', 'Serious builders', 'Community members', 'Anyone who enjoys building'].map((tag) => (
                            <span key={tag} className="px-6 py-3 bg-stone-100 rounded-full text-stone-800 font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-xl text-stone-600 mb-12">
                        You don’t need to be a professional creator.<br />
                        You just need to build carefully and follow the guidelines.
                    </p>

                    <div className="bg-[#1A1A1A] text-white p-12 rounded-3xl">
                        <h2 className="text-3xl font-serif font-medium mb-6">Ready to Start?</h2>
                        <p className="text-lg text-white/80 mb-8">
                            If you already build LEGO, you’re likely a good fit.
                        </p>
                        <button
                            onClick={handleApply}
                            className="bg-white text-[#1A1A1A] px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors"
                        >
                            Apply to Participate
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ModelDataRequests;
