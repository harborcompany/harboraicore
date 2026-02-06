import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import manifest from '../lib/seo-engine/output/manifest.json';
import { SeoPageData } from '../lib/seo-engine/types';

// In a real build, we might lazy load this or fetch from API
// checking typescript casting to avoid strict null checks on direct import
const pageData = manifest as Record<string, SeoPageData>;

const SeoPage = () => {
    const { slug } = useParams();
    const pageUrl = slug || ''; // React Router passes slug as a string

    // Simple normalization to match the key in manifest
    // If the slug comes in as array (Next.js) vs string (React Router) handle accordingly
    const page = pageData[pageUrl];

    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center">
                    <h1 className="text-4xl font-serif text-charcoal mb-4">404</h1>
                    <p className="text-stone-500">Page not found</p>
                    <Link to="/" className="text-stone-800 underline mt-4 block">Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>{page.seo.title}</title>
                <meta name="description" content={page.seo.meta_description} />
                {/* Schema Markup */}
                <script type="application/ld+json">
                    {JSON.stringify(page.schema.structured_data)}
                </script>
            </Helmet>

            {/* Navigation Placeholder */}
            <nav className="border-b border-stone-200 py-4 px-6">
                <Link to="/" className="font-bold text-xl tracking-tight">HARBOR</Link>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <header className="mb-12">
                    <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-4">
                        {page.playbook_type} &bull; {page.seo.search_intent}
                    </div>
                    <h1 className="text-4xlmd:text-5xl font-serif text-charcoal leading-tight mb-6">
                        {page.content.h1}
                    </h1>
                    <div className="prose prose-lg text-stone-600">
                        {page.content.introduction}
                    </div>
                </header>

                {/* Main Content Sections */}
                <div className="space-y-12">
                    {page.content.sections.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-2xl font-bold text-charcoal mb-4">{section.heading}</h2>
                            <div className="prose text-stone-600 whitespace-pre-line">
                                {section.body}
                            </div>
                        </section>
                    ))}
                </div>

                {/* FAQ Section */}
                {page.content.faq.length > 0 && (
                    <section className="mt-16 bg-stone-50 p-8 rounded-2xl border border-stone-100">
                        <h2 className="text-2xl font-bold text-charcoal mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {page.content.faq.map((item, idx) => (
                                <div key={idx}>
                                    <h3 className="font-semibold text-stone-800 mb-2">{item.question}</h3>
                                    <p className="text-stone-600">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Call to Action */}
                <div className="mt-16 py-12 text-center border-t border-stone-200">
                    <h3 className="text-2xl font-serif mb-6">Ready to get started?</h3>
                    <button className="bg-charcoal text-white px-8 py-3 rounded-lg font-medium hover:bg-black transition-colors">
                        {page.content.call_to_action}
                    </button>
                </div>

                {/* Internal Links */}
                <footer className="mt-20 pt-10 border-t border-stone-200 text-sm text-stone-500">
                    <p className="mb-4 font-semibold uppercase tracking-wider">Related Pages</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {page.internal_links.map((link, idx) => (
                            <Link key={idx} to={link.url} className="hover:text-stone-900 transition-colors">
                                {link.text}
                            </Link>
                        ))}
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default SeoPage;
