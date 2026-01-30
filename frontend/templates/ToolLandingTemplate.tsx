import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Shield, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import type { FullPageData } from '../lib/pseo/types';
import { generateMetadata } from '../lib/seo/metadata';
import { generatePageSchema } from '../lib/seo/schema';
import { generateBreadcrumbTrail, getHubLink } from '../lib/seo/linking';

interface ToolLandingTemplateProps {
    page: FullPageData;
    relatedPages?: Array<{ slug: string; title: string; category: string }>;
}

const ICONS = [Database, Shield, Zap, CheckCircle2];

/**
 * Tool Landing Template
 * For product-focused programmatic SEO pages
 */
const ToolLandingTemplate: React.FC<ToolLandingTemplateProps> = ({ page, relatedPages = [] }) => {
    // Generate SEO metadata
    const metadata = generateMetadata({
        title: page.title,
        description: page.description,
        slug: page.slug,
        category: page.category,
        type: 'product',
    });

    // Generate breadcrumbs
    const breadcrumbs = generateBreadcrumbTrail(page.category, page.h1, page.slug);

    // Generate schema
    const schema = generatePageSchema({
        breadcrumbs,
        faqs: page.faqs,
        product: {
            name: page.h1,
            description: page.description,
        },
    });

    // Get hub link
    const hubLink = getHubLink(page.category);

    return (
        <>
            <SeoHead
                title={metadata.title}
                description={metadata.description}
                canonical={metadata.canonical}
                robots={metadata.robots}
                ogTitle={metadata.ogTitle}
                ogDescription={metadata.ogDescription}
                ogImage={metadata.ogImage}
                ogType="product"
                ogUrl={metadata.ogUrl}
                twitterCard="summary_large_image"
                jsonLd={schema}
            />

            <div className="min-h-screen bg-[#F9F8F6] pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.url}>
                                {index > 0 && <span>/</span>}
                                <Link
                                    to={crumb.url}
                                    className="hover:text-stone-600 transition-colors"
                                >
                                    {crumb.title}
                                </Link>
                            </React.Fragment>
                        ))}
                    </nav>

                    {/* Category tag */}
                    <div className="text-xs font-mono font-medium tracking-[0.3em] text-stone-400 mb-6 uppercase">
                        {page.category} | {page.template}
                    </div>

                    {/* H1 */}
                    <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 leading-[1.1]">
                        {page.h1}
                    </h1>

                    {/* Intro */}
                    <p className="text-xl md:text-2xl text-stone-600 mb-12 leading-relaxed font-light">
                        {page.intro || page.description}
                    </p>

                    {/* Features Grid */}
                    {page.features && page.features.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            {page.features.map((feature, index) => {
                                const Icon = ICONS[index % ICONS.length];
                                return (
                                    <div
                                        key={index}
                                        className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm"
                                    >
                                        <Icon className="text-[#1A1A1A] mb-4" size={32} />
                                        <h3 className="text-xl font-serif mb-2">{feature.title}</h3>
                                        <p className="text-stone-500 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* FAQ Section */}
                    {page.faqs && page.faqs.length > 0 && (
                        <div className="border-t border-stone-200 pt-16">
                            <h2 className="text-3xl font-serif mb-8 text-[#1A1A1A]">
                                Frequently Asked Questions
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

                    {/* Related Pages */}
                    {relatedPages.length > 0 && (
                        <div className="border-t border-stone-200 pt-16 mt-16">
                            <h2 className="text-2xl font-serif mb-6 text-[#1A1A1A]">
                                Related Datasets
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {relatedPages.slice(0, 6).map((related) => (
                                    <Link
                                        key={related.slug}
                                        to={`/tools/${related.category}/${related.slug}`}
                                        className="p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-colors"
                                    >
                                        <span className="text-sm font-medium text-[#1A1A1A]">
                                            {related.title.replace(' | Harbor AI', '')}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-20 flex flex-col items-center">
                        <Link
                            to="/contact"
                            className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:bg-black transition-all"
                        >
                            Request Access
                        </Link>
                        {hubLink && (
                            <Link
                                to={hubLink.url}
                                className="mt-6 text-stone-400 text-sm hover:text-stone-600 transition-colors flex items-center gap-2"
                            >
                                {hubLink.title} <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ToolLandingTemplate;
