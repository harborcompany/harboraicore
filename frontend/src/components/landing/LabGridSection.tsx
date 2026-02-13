import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Placeholder avatar generator using dicebear or similar if local images aren't available
// For now, using initials/colors to match the "Harbor" aesthetic
const avatars = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    color: ['bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'][i % 5],
    initial: String.fromCharCode(65 + (i % 26)), // A, B, C...
    delay: i * 0.05
}));

const LabGridSection = () => {
    return (
        <section className="bg-[#0A0A0A] text-white py-32 overflow-hidden relative">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div className="space-y-8 z-10 relative">
                    <div className="inline-block px-3 py-1 bg-stone-800/50 rounded-full border border-stone-700 text-xs font-mono tracking-wider text-emerald-400">
                        WE'RE BUILDING THE FUTURE
                    </div>

                    <h2 className="text-5xl md:text-6xl font-serif leading-tight">
                        Join the <br />
                        <span className="text-emerald-500">Physical Intelligence</span> <br />
                        Lab.
                    </h2>

                    <p className="text-stone-400 text-lg max-w-xl leading-relaxed">
                        We are seeking the most ambitious engineers to build the operating system for robotics.
                        Help us create the proprietary stack that turns raw reality into intelligent action.
                    </p>

                    <div className="pt-4">
                        <Link
                            to="/careers"
                            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-stone-200 transition-colors group"
                        >
                            JOIN HARBOR <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Grid Visual */}
                <div className="relative">
                    {/* The Grid Container */}
                    <div className="grid grid-cols-6 gap-2 opacity-90 scale-100 lg:scale-110 origin-center">
                        {/* Interactive "Add" Block */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-square bg-stone-900 border border-stone-800 flex items-center justify-center cursor-pointer hover:bg-stone-800 transition-colors group"
                        >
                            <Plus size={24} className="text-stone-500 group-hover:text-white transition-colors" />
                        </motion.div>

                        {/* Avatars */}
                        {avatars.map((avatar) => (
                            <motion.div
                                key={avatar.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: avatar.delay, duration: 0.4 }}
                                className="relative aspect-square overflow-hidden group"
                            >
                                <div className={`w-full h-full ${avatar.color} flex items-center justify-center text-black font-bold text-xl opacity-90 group-hover:opacity-100 transition-opacity`}>
                                    {avatar.initial}
                                </div>
                                {/* Hover overlay effect */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                </div>
            </div>

            {/* Background Texture/Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />
        </section>
    );
};

export default LabGridSection;
