import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, ArrowRight } from 'lucide-react';

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState<any>(null);

    // Mock content generation to match the "editorial" standard requested
    useEffect(() => {
        // In production, this would fetch from the API: /api/blog/:slug
        const generateMockContent = () => {
            const title = slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Harbor Insight';

            return {
                title: title,
                date: 'March 2024',
                author: 'Harbor Editorial',
                category: 'Infrastructure & Analysis',
                readTime: '8 min read',
                content: [
                    {
                        type: 'hook',
                        text: `The assumption that ${title.toLowerCase()} is merely a scaling problem is the most dangerous misconception in modern AI development. Most organizations treat audio and video data like "heavy images" - binary blobs to be stored, retrieved, and fed into models. They fail to understand the temporal dimension.`
                    },
                    {
                        type: 'hook',
                        text: `But temporal data is not static. It is a stream of context, frequency, and intent. When you strip away the metadata to save storage costs, you aren't just compressing the file; you are lobotomizing the model.`
                    },
                    {
                        type: 'header',
                        text: 'The Latency of Truth'
                    },
                    {
                        type: 'paragraph',
                        text: `In a real-time multimodal system, the "truth" of a dataset changes every millisecond. A frame at 00:00:01.05 might show a pedestrian on the curb; at 00:00:01.10, they are in the street. Static labeling pipelines (the industry standard) flatten this reality into a single bounding box that says "pedestrian."`
                    },
                    {
                        type: 'paragraph',
                        text: `This is why we see hallucinations in frontier models. The model isn't hallucinating; it's remembering a blurred average of a dynamic event. We call this "temporal smear," and it is the silent killer of agentic reliability.`
                    },
                    {
                        type: 'header',
                        text: 'Harbor’s Approach: Media-Native Ingestion'
                    },
                    {
                        type: 'paragraph',
                        text: `At Harbor, we do not treat media as files. We treat them as streams. Our ingestion engine decomposes video into temporal primitives (visual embeddings, audio waveforms, and speech transcripts) before they ever hit cold storage.`
                    },
                    {
                        type: 'paragraph',
                        text: `This allows us to index "moments," not just files. When a model queries our infrastructure for "high-tension interactions," it doesn't get a 2-hour movie file; it gets the exact 14-second clip where the tone of voice shifted and the visual velocity increased.`
                    },
                    {
                        type: 'header',
                        text: 'The Economic Reality'
                    },
                    {
                        type: 'paragraph',
                        text: `Critics argue this depth of processing is too expensive. We argue that training valid models on invalid data is the true extravagance. Every compute cycle spent training on "smeared" temporal data is capital burned.`
                    },
                    {
                        type: 'close',
                        text: `The future of AI infrastructure is not bigger buckets. It is smarter pipes. As we move toward agents that navigate the physical world, the ability to query reality with frame-perfect accuracy will not be a luxury feature. It will be table stakes.`
                    }
                ]
            };
        };

        setContent(generateMockContent());
    }, [slug]);

    if (!content) return <div className="min-h-screen bg-[#0A0A0A]"></div>;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-stone-200 font-sans selection:bg-stone-700 selection:text-white">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-stone-900 z-50">
                <div className="h-full bg-white w-1/3"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
                {/* Back Link */}
                <Link to="/blog" className="inline-flex items-center text-stone-500 hover:text-white transition-colors mb-12 text-sm font-mono tracking-wide uppercase">
                    <ArrowLeft size={16} className="mr-2" /> Back to Intelligence
                </Link>

                {/* Header */}
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-6 text-xs font-mono tracking-widest uppercase text-stone-500">
                        <span className="text-white border border-stone-800 px-3 py-1 rounded-full">{content.category}</span>
                        <span className="flex items-center gap-2"><Calendar size={12} /> {content.date}</span>
                        <span className="flex items-center gap-2"><User size={12} /> {content.author}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif text-white leading-[1.1] mb-8">
                        {content.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-stone-900 py-6">
                        <div className="text-stone-400 font-mono text-sm">
                            {content.readTime}
                        </div>
                        <button className="text-stone-400 hover:text-white transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>
                </header>

                {/* Article Content */}
                <article className="prose prose-invert prose-lg max-w-none">
                    {content.content.map((block: any, index: number) => {
                        if (block.type === 'hook') {
                            return (
                                <p key={index} className="text-xl md:text-2xl leading-relaxed text-stone-300 font-light mb-8 border-l-2 border-stone-800 pl-6">
                                    {block.text}
                                </p>
                            );
                        }
                        if (block.type === 'header') {
                            return (
                                <h2 key={index} className="text-3xl font-serif text-white mt-16 mb-6">
                                    {block.text}
                                </h2>
                            );
                        }
                        if (block.type === 'paragraph') {
                            return (
                                <p key={index} className="text-stone-400 leading-loose mb-6 text-lg">
                                    {block.text}
                                </p>
                            );
                        }
                        if (block.type === 'close') {
                            return (
                                <div key={index} className="bg-[#111] p-8 md:p-12 rounded-3xl mt-16 border border-stone-800">
                                    <p className="text-xl font-serif italic text-stone-300 mb-6">
                                        "{block.text}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold font-serif">H</div>
                                        <div>
                                            <div className="text-white text-sm font-bold">Harbor Editorial</div>
                                            <div className="text-stone-500 text-xs">Infrastructure Team</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </article>

                {/* Footer / CTA */}
                <div className="mt-24 pt-12 border-t border-stone-900 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-serif text-white mb-4">Build on Reality</h3>
                    <p className="text-stone-500 max-w-xl mb-8">
                        Stop training on static files. Start building with media-native infrastructure that understands the world as it happens.
                    </p>
                    <Link to="/auth/signup" className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-stone-200 transition-colors">
                        Get Ecosystem Access <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
