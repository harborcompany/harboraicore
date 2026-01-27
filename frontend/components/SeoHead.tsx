import React from 'react';
import { Helmet } from 'react-helmet';

interface SeoHeadProps {
    title: string;
    description: string;
    jsonLd?: Record<string, any> | Record<string, any>[];
}

const SeoHead: React.FC<SeoHeadProps> = ({ title, description, jsonLd }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Social */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SeoHead;
