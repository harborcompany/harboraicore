import React from 'react';
import { Helmet } from 'react-helmet';

interface SeoHeadProps {
    // Core metadata
    title: string;
    description: string;

    // Canonical & robots
    canonical?: string;
    robots?: string;

    // Open Graph
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'product';
    ogUrl?: string;

    // Twitter Cards
    twitterCard?: 'summary' | 'summary_large_image';
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    twitterSite?: string;

    // Structured data (JSON-LD)
    jsonLd?: Record<string, unknown> | Record<string, unknown>[];

    // Additional meta tags
    keywords?: string;
    author?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({
    title,
    description,
    canonical,
    robots = 'index, follow',
    ogTitle,
    ogDescription,
    ogImage,
    ogType = 'website',
    ogUrl,
    twitterCard = 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterSite = '@harborai',
    jsonLd,
    keywords,
    author,
}) => {
    // Use og values as fallback for twitter
    const finalTwitterTitle = twitterTitle || ogTitle || title;
    const finalTwitterDescription = twitterDescription || ogDescription || description;
    const finalTwitterImage = twitterImage || ogImage;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {author && <meta name="author" content={author} />}

            {/* Robots */}
            <meta name="robots" content={robots} />

            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={ogTitle || title} />
            <meta property="og:description" content={ogDescription || description} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            {ogUrl && <meta property="og:url" content={ogUrl} />}
            <meta property="og:site_name" content="Harbor AI" />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:site" content={twitterSite} />
            <meta name="twitter:title" content={finalTwitterTitle} />
            <meta name="twitter:description" content={finalTwitterDescription} />
            {finalTwitterImage && <meta name="twitter:image" content={finalTwitterImage} />}

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(Array.isArray(jsonLd) ? { '@context': 'https://schema.org', '@graph': jsonLd } : jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SeoHead;
