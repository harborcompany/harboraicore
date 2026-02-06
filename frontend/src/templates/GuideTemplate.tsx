import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import type { FullPageData } from '../lib/pseo/types';
import { generateMetadata } from '../lib/seo/metadata';
import { generatePageSchema } from '../lib/seo/schema';
import { generateBreadcrumbTrail } from '../lib/seo/linking';

interface GuideTemplateProps {
    page: FullPageData;
    relatedGuides?: Array<{ slug: string; title: string; category: string }>;
}

/**
 * Guide Template
 * For long-form educational programmatic SEO pages
 */
const GuideTemplate: React.FC<GuideTemplateProps> = ({ page, relatedGuides = [] }) => {
    const guide = page.guide;

    // Generate SEO metadata
    const metadata = generateMetadata({
        title: page.title,
        description: page.description,
        slug: page.slug,
        category: page.category,
        type: 'article',
    });

    // Generate breadcrumbs
    const breadcrumbs = generateBreadcrumbTrail(page.category, page.h1, page.slug);

    // Generate schema
    const schema = generatePageSchema({
        breadcrumbs,
        faqs: page.faqs,
        article: {
            headline: page.h1,
            description: page.description,
            datePublished: page.createdAt,
            dateModified: page.updatedAt,
        },
    });

    return (
        <>
            <SeoHead
                title={metadata.title}
                description={metadata.description}
                canonical={metadata.canonical}
                robots={metadata.robots}
                ogTitle={metadata.ogTitle}
                ogDescription={metadata.ogDescription}
                ogType="article"
                ogUrl={metadata.ogUrl}
                jsonLd={schema}
            />

            <div className="min-h-screen bg-[#F9F8F6]">
                <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Sidebar - Table of Contents */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-32">
                                <h3 className="text-sm font-medium text-stone-500 mb-4">
                                    Table of Contents
                                </h3>
                                {guide?.tableOfContents && (
                                    <nav className="space-y-2">
                                        {guide.tableOfContents.map((item) => (
                                            <a
                                                key={item.anchor}
                                                href={`#${item.anchor}`}
                                                className={`block text-sm hover:text-[#1A1A1A] transition-colors ${item.level === 1 ? 'text-stone-700 font-medium' :
                                                        item.level === 2 ? 'text-stone-500 pl-3' :
                                                            'text-stone-400 pl-6'
                                                    }`}
                                            >
                                                {item.title}
                                            </a>
                                        ))}
                                    </nav>
                                )}

                                {/* Related Guides */}
                                {relatedGuides.length > 0 && (
                                    <div className="mt-12">
                                        <h3 className="text-sm font-medium text-stone-500 mb-4">
                                            Related Guides
                                        </h3>
                                        <div className="space-y-2">
                                            {relatedGuides.slice(0, 5).map((related) => (
                                                <Link
                                                    key={related.slug}
                                                    to={`/guides/${related.slug}`}
                                                    className="block text-sm text-stone-600 hover:text-[#1A1A1A] transition-colors"
                                                >
                                                    {related.title.replace(' | Harbor AI', '').replace('How to ', '').replace(': Complete Guide', '')}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="lg:col-span-3">
                            {/* Breadcrumbs */}
                            <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={crumb.url}>
                                        {index > 0 && <span>/</span>}
                                        <Link to={crumb.url} className="hover:text-stone-600 transition-colors">
                                            {crumb.title}
                                        </Link>
                                    </React.Fragment>
                                ))}
                            </nav>

                            {/* Category and reading time */}
                            <div className="flex items-center gap-4 text-xs font-mono text-stone-400 mb-6">
                                <span className="uppercase tracking-[0.3em]">{page.category} Guide</span>
                                {guide?.readingTime && (
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {guide.readingTime}
                                    </span>
                                )}
                            </div>

                            {/* H1 */}
                            <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-8 leading-[1.1]">
                                {page.h1}
                            </h1>

                            {/* Intro */}
                            <p className="text-xl text-stone-600 mb-12 leading-relaxed font-light">
                                {page.intro || page.description}
                            </p>

                            {/* Article Content */}
                            {guide?.sections && (
                                <article className="prose prose-stone max-w-none">
                                    {guide.sections.map((section) => (
                                        <section key={section.id} id={section.id} className="mb-12">
                                            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
                                                {section.title}
                                            </h2>
                                            <div
                                                className="text-stone-600 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                            />
                                        </section>
                                    ))}
                                </article>
                            )}

                            {/* Default content if no sections */}
                            {!guide?.sections && (
                                <article className="prose prose-stone max-w-none mb-12">
                                    <p className="text-stone-600 leading-relaxed">
                                        {page.description}
                                    </p>
                                </article>
                            )}

                            {/* FAQ Section */}
                            {page.faqs && page.faqs.length > 0 && (
                                <div className="border-t border-stone-200 pt-12 mt-12">
                                    <h2 className="text-2xl font-serif mb-8 text-[#1A1A1A] flex items-center gap-2">
                                        <BookOpen size={24} /> Frequently Asked Questions
                                    </h2>
                                    <div className="space-y-6">
                                        {page.faqs.map((faq, index) => (
                                            <div key={index} className="group">
                                                <h4 className="text-lg font-serif text-[#1A1A1A] mb-2">
                                                    {faq.question}
                                                </h4>
                                                <p className="text-stone-500 text-sm leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="mt-16 p-8 bg-[#1A1A1A] rounded-2xl text-center">
                                <h3 className="text-2xl font-serif text-white mb-4">
                                    Ready to get started?
                                </h3>
                                <p className="text-stone-300 mb-6">
                                    Access enterprise-grade datasets for your AI projects.
                                </p>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] px-8 py-4 rounded-full font-bold hover:bg-stone-100 transition-colors"
                                >
                                    Request Access <ArrowRight size={16} />
                                </Link>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GuideTemplate;
