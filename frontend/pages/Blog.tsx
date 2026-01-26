import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Tag } from 'lucide-react';

const blogPosts = [
    {
        slug: 'audio-video-data-harder-than-text',
        title: 'Why Audio & Video Data Is Harder Than Text',
        date: 'March 01, 2024',
        category: 'FOUNDATIONAL AUTHORITY',
        thumbnail: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Text is discrete. Media is continuous. Why treating video like "heavy images" destroys model performance.',
    },
    {
        slug: 'media-data-pipelines-explained',
        title: 'Media Data Pipelines Explained: Steps vs. Streams',
        date: 'March 02, 2024',
        category: 'INFRASTRUCTURE',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Breaking down the difference between file-based ingestion and true stream-based processing for AI.',
    },
    {
        slug: 'frame-accurate-video-annotation',
        title: 'Frame-Accurate Video Annotation: A Technical Deep Dive',
        date: 'March 03, 2024',
        category: 'ANNOTATION DEPTH',
        thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
        excerpt: 'SMPTE timecodes, sampling rates, and the engineering reality of labeling video at scale.',
    },
    {
        slug: 'enterprise-media-data-problems',
        title: 'The Real Problems with Enterprise Media Data',
        date: 'March 04, 2024',
        category: 'ANALYSIS',
        thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800',
        excerpt: 'It\'s not storage. It\'s not bandwidth. It\'s lineage and retrieval. Usage patterns from the Fortune 500.',
    },
    {
        slug: 'ads-as-data-signal',
        title: 'Ad Serving as a Data Signal',
        date: 'March 05, 2024',
        category: 'ADS & FLYWHEEL',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Why creative performance is the highest-signal RLHF input available today.',
    },
    {
        slug: 'infrastructure-vs-saas-tooling',
        title: 'Infrastructure vs. SaaS Tooling: Knowing the Difference',
        date: 'March 06, 2024',
        category: 'INDUSTRY',
        thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Tools are for tasks. Infrastructure is for businesses. How to tell which one you are buying.',
    }
];

const Blog = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-24 px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif mb-6">Research & Insights</h1>
                    <p className="text-stone-400 text-lg max-w-2xl">
                        Deep dives into multimodal infrastructure, data strategy, and the future of agentic intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link
                            to={`/blog/${post.slug}`}
                            key={post.slug}
                            className="bg-[#141414] border border-stone-800/50 rounded-2xl overflow-hidden group hover:border-stone-700 transition-all duration-300 flex flex-col"
                        >
                            {/* Thumbnail */}
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>

                                {/* Category Badge - Floating */}
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase text-stone-300">
                                    {post.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="text-stone-500 text-xs font-mono mb-4 uppercase tracking-wider">
                                    {post.date}
                                </div>
                                <h2 className="text-xl md:text-2xl font-serif mb-4 leading-tight group-hover:text-stone-300 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-8">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto flex items-center text-stone-400 text-sm font-medium group-hover:text-white transition-colors">
                                    Read Article <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Automation Note */}
                <div className="mt-20 pt-10 border-t border-stone-900 text-center">
                    <p className="text-stone-600 text-xs font-mono uppercase tracking-[0.2em]">
                        Auto-Generating 2 New Insights Daily
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Blog;
