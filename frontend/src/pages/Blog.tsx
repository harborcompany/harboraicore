import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { getRecentPosts } from '../lib/blog/blog-loader';

const Blog = () => {
    const posts = getRecentPosts(12);

    // Category display names
    const categoryLabels: Record<string, string> = {
        'voice-ai': 'VOICE AI',
        'data-collection': 'DATA COLLECTION',
        'gig-economy': 'GIG ECONOMY',
        'ai-training': 'AI TRAINING',
        'industry': 'INDUSTRY',
        'how-to': 'HOW-TO',
        'general': 'INSIGHTS'
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] pt-32 pb-24 px-6">
            <Helmet>
                <title>Blog | Harbor - Insights on Voice AI & Data</title>
                <meta name="description" content="Insights on voice AI, data collection, and the future of AI training. Guides for contributors and AI teams." />
            </Helmet>

            <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-semibold text-[#111] mb-6">Research & Insights</h1>
                    <p className="text-gray-500 text-lg max-w-2xl">
                        Deep dives into voice AI, data strategy, and guides for contributors and AI teams.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No posts yet. Run `npm run blog:generate` to create content.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                to={`/blog/${post.slug}`}
                                key={post.slug}
                                className="bg-white border border-gray-100 rounded-xl overflow-hidden group hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-100 px-3 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase text-gray-600">
                                        {categoryLabels[post.category] || post.category.toUpperCase()}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <h2 className="text-lg font-semibold text-[#111] mb-3 leading-tight group-hover:text-gray-700 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto flex items-center text-[#111] text-sm font-medium group-hover:text-gray-600 transition-colors">
                                        Read Article <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Footer Note */}
                <div className="mt-20 pt-10 border-t border-gray-200 text-center">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
                        New insights published daily
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Blog;
