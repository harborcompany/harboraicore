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
            if (slug === 'screensnap-pro-agents') {
                return {
                    title: "How I Built a Content Team with AI Agents",
                    date: "March 15, 2024",
                    author: "ScreenSnap Founder",
                    category: "How-To",
                    readTime: "12 min read",
                    content: [
                        {
                            type: 'hook',
                            text: `I'm building ScreenSnap Pro, a Mac screenshot app. Like every indie SaaS founder, I needed content marketing — blog posts, SEO, social media. But hiring a content team wasn't in the budget.`
                        },
                        {
                            type: 'hook',
                            text: `So I built one. Out of OpenClaw AI agents. Not one agent doing everything. A squad of specialized agents, each with a specific job, running autonomously on cron schedules, coordinating through a shared Notion database.`
                        },
                        {
                            type: 'header',
                            text: 'The Architecture'
                        },
                        {
                            type: 'paragraph',
                            text: `I run on OpenClaw — an open-source framework that lets you orchestrate AI agents with cron jobs, isolated sessions, and tool access. The agents are Claude-powered, each with their own skill file (instructions + tools + constraints).`
                        },
                        {
                            type: 'header',
                            text: 'Meet the Squad'
                        },
                        {
                            type: 'paragraph',
                            text: `🔍 **Scout**: Finds topics with real keyword data - Every 6h`
                        },
                        {
                            type: 'paragraph',
                            text: `✍️ **Quill**: Writes 2000+ word SEO articles - Every hour`
                        },
                        {
                            type: 'paragraph',
                            text: `📚 **Sage**: Reviews quality, plagiarism, readability 3x/day`
                        },
                        {
                            type: 'paragraph',
                            text: `📢 **Ezra**: Publishes to production - Every 3h`
                        },
                        {
                            type: 'paragraph',
                            text: `📣 **Herald**: Amplifies on social media - 2x/day`
                        },
                        {
                            type: 'paragraph',
                            text: `👀 **Lurker**: Scouts Reddit for outreach Every 8h`
                        },
                        {
                            type: 'paragraph',
                            text: `📊 **Archie**: Weekly analytics reports - Weekly`
                        },
                        {
                            type: 'paragraph',
                            text: `📋 **Morgan**: Project manager — unblocks bottlenecks - 3x/day`
                        },
                        {
                            type: 'header',
                            text: 'The Pipeline'
                        },
                        {
                            type: 'paragraph',
                            text: `Scout (research) → Quill (write) → Sage (edit) → Ezra (publish) → Herald (promote) → Archie (measure)`
                        },
                        {
                            type: 'paragraph',
                            text: `Each agent reads from and writes to a shared Notion database. Articles flow through statuses: Backlog → To Do → In Progress → Review → Ready to Publish → Done. No human in the loop for most of it. I check in once a day and review what shipped.`
                        },
                        {
                            type: 'header',
                            text: 'What I Got Right'
                        },
                        {
                            type: 'sub-header', // We might need to handle this type, or just use bold in paragraph
                            text: '1. Specialization Over Generalization'
                        },
                        {
                            type: 'paragraph',
                            text: `My first attempt was one agent doing everything — research, write, edit, publish. It was mediocre at all of it. Splitting into specialists was the breakthrough. Scout has keyword research tools and competition analysis. Quill has brand voice guidelines and SEO rules. Sage has a plagiarism checker (Copyscape) and a 100-point scoring rubric with a 90+ pass threshold.`
                        },
                        {
                            type: 'sub-header',
                            text: '2. Quality Gates That Actually Reject'
                        },
                        {
                            type: 'paragraph',
                            text: `Sage isn't a rubber stamp. It checks plagiarism via Copyscape API (~3¢ per check), SEO scoring on a 100-point rubric, and readability (Flesch-Kincaid 60+). If an article fails, Sage sends it back to Quill with specific notes. About 40% of first drafts get sent back. After revision, 95%+ pass.`
                        },
                        {
                            type: 'sub-header',
                            text: '3. Notion as the Central System'
                        },
                        {
                            type: 'paragraph',
                            text: `Every agent reads and writes to the same Notion database. Any agent can see what every other agent has done. Status transitions are atomic and visible. I can monitor the entire pipeline from one board.`
                        },
                        {
                            type: 'sub-header',
                            text: '4. The Project Manager Agent'
                        },
                        {
                            type: 'paragraph',
                            text: `Morgan (📋) was a game-changer. 3x/day, Morgan checks if there are enough topics, if articles are stuck in review, or if publishing is lagging. Morgan can spawn other agents on demand to fix bottlenecks. It's the closest thing to a self-healing pipeline.`
                        },
                        {
                            type: 'header',
                            text: 'What Broke (And How I Fixed It)'
                        },
                        {
                            type: 'paragraph',
                            text: `**Problem 1: The Race Condition** 💥. Day 3. I scaled Quill to 5 parallel writers. All 5 grabbed the same article. The fix? Claim locking. Each Quill instance generates a unique claim ID and atomically updates Notion. I also added 25-second staggered spawning.`
                        },
                        {
                            type: 'paragraph',
                            text: `**Problem 2: Feature Hallucinations** 🤥. Day 5. Sage caught two articles claiming ScreenSnap Pro can take scrolling screenshots. It can't. The fix? I created a strict PRODUCT_CONTEXT.md file that every agent loads.`
                        },
                        {
                            type: 'paragraph',
                            text: `**Problem 3: Cron Sessions Didn't Execute** 😤. Day 1. Jobs queued up waiting for a "main" session. The fix? Changed all agents to sessionTarget: "isolated".`
                        },
                        {
                            type: 'paragraph',
                            text: `**Problem 4: Agents Writing Novels** 📚. Early articles were 3000+ words of waffle. The fix? Readability gate. Sage enforces a minimum 60 Flesch-Kincaid score.`
                        },
                        {
                            type: 'paragraph',
                            text: `**Problem 5: 404 Links From Draft Articles** 🔗. Published articles were linking to drafts. The fix? Writer skill now enforces: "ONLY link to articles with Status = Done in Notion."`
                        },
                        {
                            type: 'paragraph',
                            text: `**Problem 6: Duplicate Social Posts** 📣. Herald promoting twice. The fix? Added Social Status and Herald Claim columns to Notion.`
                        },
                        {
                            type: 'close',
                            text: `This squad now runs my entire content operation. It's not perfect, but it scales.` // Fallback close
                        }
                    ]
                };
            }

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
                                    <span dangerouslySetInnerHTML={{ __html: block.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>') }} />
                                </p>
                            );
                        }
                        if (block.type === 'sub-header') {
                            return (
                                <h3 key={index} className="text-xl font-serif text-white mt-8 mb-4">
                                    {block.text}
                                </h3>
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
