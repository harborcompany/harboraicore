import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Minus, ArrowRight } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import type { FullPageData } from '../lib/pseo/types';
import { generateMetadata } from '../lib/seo/metadata';
import { generatePageSchema } from '../lib/seo/schema';
import { generateBreadcrumbTrail } from '../lib/seo/linking';

interface ComparisonTemplateProps {
    page: FullPageData;
}

/**
 * Comparison Template
 * For "X vs Y" programmatic SEO pages
 */
const ComparisonTemplate: React.FC<ComparisonTemplateProps> = ({ page }) => {
    const comparison = page.comparison;

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

            <div className="min-h-screen bg-[#F9F8F6] pt-32 pb-24 px-6">
                <div className="max-w-5xl mx-auto">
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

                    {/* Category tag */}
                    <div className="text-xs font-mono font-medium tracking-[0.3em] text-stone-400 mb-6 uppercase">
                        Comparison | {page.category}
                    </div>

                    {/* H1 */}
                    <h1 className="text-4xl md:text-6xl font-serif text-[#1A1A1A] mb-8 leading-[1.1]">
                        {page.h1}
                    </h1>

                    {/* Intro */}
                    <p className="text-xl text-stone-600 mb-12 leading-relaxed font-light max-w-3xl">
                        {page.description}
                    </p>

                    {/* Comparison Table */}
                    {comparison && (
                        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden mb-16">
                            {/* Header */}
                            <div className="grid grid-cols-3 border-b border-stone-200">
                                <div className="p-6 bg-stone-50">
                                    <span className="text-sm font-medium text-stone-500">Feature</span>
                                </div>
                                <div className="p-6 text-center border-l border-stone-200">
                                    <h3 className="font-serif text-lg">{comparison.toolA.name}</h3>
                                </div>
                                <div className="p-6 text-center border-l border-stone-200">
                                    <h3 className="font-serif text-lg">{comparison.toolB.name}</h3>
                                </div>
                            </div>

                            {/* Rows */}
                            {comparison.comparisonTable?.map((row, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-3 border-b border-stone-100 last:border-b-0"
                                >
                                    <div className="p-4 bg-stone-50">
                                        <span className="text-sm text-stone-700">{row.feature}</span>
                                    </div>
                                    <div className="p-4 text-center border-l border-stone-100 flex items-center justify-center">
                                        <span className="text-sm text-stone-600">{row.toolAValue}</span>
                                        {row.winner === 'A' && (
                                            <span className="ml-2 text-green-500"><Check size={16} /></span>
                                        )}
                                    </div>
                                    <div className="p-4 text-center border-l border-stone-100 flex items-center justify-center">
                                        <span className="text-sm text-stone-600">{row.toolBValue}</span>
                                        {row.winner === 'B' && (
                                            <span className="ml-2 text-green-500"><Check size={16} /></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pros and Cons */}
                    {comparison && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            <div className="bg-white rounded-2xl p-8 border border-stone-200">
                                <h3 className="font-serif text-xl mb-4">{comparison.toolA.name}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
                                            <Check size={14} /> Pros
                                        </h4>
                                        <ul className="space-y-1">
                                            {comparison.toolA.pros?.map((pro, i) => (
                                                <li key={i} className="text-sm text-stone-600">{pro}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-2">
                                            <X size={14} /> Cons
                                        </h4>
                                        <ul className="space-y-1">
                                            {comparison.toolA.cons?.map((con, i) => (
                                                <li key={i} className="text-sm text-stone-600">{con}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-8 border border-stone-200">
                                <h3 className="font-serif text-xl mb-4">{comparison.toolB.name}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
                                            <Check size={14} /> Pros
                                        </h4>
                                        <ul className="space-y-1">
                                            {comparison.toolB.pros?.map((pro, i) => (
                                                <li key={i} className="text-sm text-stone-600">{pro}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-2">
                                            <X size={14} /> Cons
                                        </h4>
                                        <ul className="space-y-1">
                                            {comparison.toolB.cons?.map((con, i) => (
                                                <li key={i} className="text-sm text-stone-600">{con}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FAQ Section */}
                    {page.faqs && page.faqs.length > 0 && (
                        <div className="border-t border-stone-200 pt-16">
                            <h2 className="text-3xl font-serif mb-8 text-[#1A1A1A]">
                                Common Questions
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
                    <div className="mt-20 flex flex-col items-center">
                        <Link
                            to="/contact"
                            className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:bg-black transition-all"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/explore"
                            className="mt-6 text-stone-400 text-sm hover:text-stone-600 transition-colors flex items-center gap-2"
                        >
                            View All Comparisons <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ComparisonTemplate;
