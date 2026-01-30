import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, ArrowRight, Database, Layers } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import type { FullPageData, PageListItem } from '../lib/pseo/types';
import { generateMetadata } from '../lib/seo/metadata';
import { generatePageSchema } from '../lib/seo/schema';
import { generateBreadcrumbTrail } from '../lib/seo/linking';

interface CategoryHubTemplateProps {
    page: FullPageData;
    childPages: PageListItem[];
}

/**
 * Category Hub Template
 * For hub pages that link to spoke pages (industry category pages)
 */
const CategoryHubTemplate: React.FC<CategoryHubTemplateProps> = ({ page, childPages = [] }) => {
    const hub = page.categoryHub;

    // Generate SEO metadata
    const metadata = generateMetadata({
        title: page.title,
        description: page.description,
        slug: page.slug,
        category: page.category,
        type: 'website',
    });

    // Generate breadcrumbs
    const breadcrumbs = generateBreadcrumbTrail(page.category, page.h1, page.slug);

    // Generate schema
    const schema = generatePageSchema({
        breadcrumbs,
        faqs: page.faqs,
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
                ogType="website"
                ogUrl={metadata.ogUrl}
                jsonLd={schema}
            />

            <div className="min-h-screen bg-[#F9F8F6] pt-32 pb-24 px-6">
                <div className="max-w-6xl mx-auto">
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

                    {/* Category badge */}
                    <div className="inline-flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full text-xs font-mono text-stone-500 mb-6">
                        <Layers size={14} />
                        <span className="uppercase tracking-wider">{page.category} Hub</span>
                    </div>

                    {/* H1 */}
                    <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 leading-[1.1]">
                        {page.h1}
                    </h1>

                    {/* Intro */}
                    <p className="text-xl md:text-2xl text-stone-600 mb-12 leading-relaxed font-light max-w-3xl">
                        {hub?.categoryDescription || page.description}
                    </p>

                    {/* Stats */}
                    {hub?.stats && (
                        <div className="grid grid-cols-3 gap-6 mb-16">
                            <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center">
                                <div className="text-4xl font-serif text-[#1A1A1A] mb-2">
                                    {hub.stats.totalDatasets.toLocaleString()}+
                                </div>
                                <div className="text-sm text-stone-500">Datasets</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center">
                                <div className="text-4xl font-serif text-[#1A1A1A] mb-2">
                                    {hub.stats.totalHours.toLocaleString()}+
                                </div>
                                <div className="text-sm text-stone-500">Hours of Data</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center">
                                <div className="text-4xl font-serif text-[#1A1A1A] mb-2">
                                    {hub.stats.industries}
                                </div>
                                <div className="text-sm text-stone-500">Sub-Industries</div>
                            </div>
                        </div>
                    )}

                    {/* Child Pages Grid */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-serif mb-6 text-[#1A1A1A] flex items-center gap-2">
                            <Grid size={24} /> Browse All Datasets
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {childPages.map((child) => (
                                <Link
                                    key={child.slug}
                                    to={`/tools/${child.category}/${child.slug}`}
                                    className="group p-6 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all"
                                >
                                    <Database className="text-stone-400 group-hover:text-[#1A1A1A] transition-colors mb-3" size={20} />
                                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2 group-hover:underline">
                                        {child.title.replace(' | Harbor AI', '')}
                                    </h3>
                                    <p className="text-sm text-stone-500 line-clamp-2">
                                        {child.description}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        {childPages.length > 12 && (
                            <div className="text-center mt-8">
                                <button className="text-stone-500 hover:text-[#1A1A1A] text-sm font-medium transition-colors">
                                    View All ({childPages.length} datasets)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* FAQ Section */}
                    {page.faqs && page.faqs.length > 0 && (
                        <div className="border-t border-stone-200 pt-16">
                            <h2 className="text-3xl font-serif mb-8 text-[#1A1A1A]">
                                Frequently Asked Questions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {page.faqs.map((faq, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl border border-stone-200">
                                        <h4 className="text-lg font-serif text-[#1A1A1A] mb-3">
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
                    <div className="mt-20 text-center">
                        <h3 className="text-2xl font-serif mb-4 text-[#1A1A1A]">
                            Need a custom dataset?
                        </h3>
                        <p className="text-stone-500 mb-8 max-w-xl mx-auto">
                            Our team can help you build custom {page.h1.toLowerCase()} tailored to your specific requirements.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:bg-black transition-all"
                        >
                            Contact Sales <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryHubTemplate;
