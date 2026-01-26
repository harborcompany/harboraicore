/**
 * JSON-LD Schema Generator
 * Structured data for rich search results
 * Supports Organization, Article, Product, FAQ, Breadcrumb, and more
 */

const SITE_URL = 'https://harbor.ai';
const SITE_NAME = 'HARBOR';

/**
 * Generate Organization schema (site-wide)
 * @returns {Object} Organization JSON-LD
 */
function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/logo.png`,
            width: 512,
            height: 512,
        },
        sameAs: [
            'https://twitter.com/harbor_ai',
            'https://linkedin.com/company/harbor-ai',
            'https://github.com/harborcompany',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: 'contact@harbor.ai',
            url: `${SITE_URL}/contact`,
        },
        description: 'Media-native data infrastructure for AI training. Licensed datasets, annotation, and API access.',
    };
}

/**
 * Generate WebSite schema with search action
 * @returns {Object} WebSite JSON-LD
 */
function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: 'Media-native data infrastructure for real-world audio and video AI.',
        publisher: {
            '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

/**
 * Generate Article schema for blog posts
 * @param {Object} post - Blog post data
 * @returns {Object} Article JSON-LD
 */
function generateArticleSchema(post) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${SITE_URL}${post.path}#article`,
        headline: post.title,
        description: post.excerpt || post.description,
        image: post.image || `${SITE_URL}/images/og-default.jpg`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
            '@type': 'Person',
            name: post.author?.name || 'HARBOR Team',
            url: post.author?.url || SITE_URL,
        },
        publisher: {
            '@id': `${SITE_URL}/#organization`,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}${post.path}`,
        },
        articleSection: post.category,
        keywords: post.tags?.join(', '),
    };
}

/**
 * Generate Product schema for datasets
 * @param {Object} dataset - Dataset data
 * @returns {Object} Product JSON-LD
 */
function generateProductSchema(dataset) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${SITE_URL}/datasets/${dataset.slug}#product`,
        name: dataset.title,
        description: dataset.description,
        image: dataset.image || `${SITE_URL}/images/datasets/${dataset.slug}.jpg`,
        brand: {
            '@type': 'Brand',
            name: SITE_NAME,
        },
        offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/datasets/${dataset.slug}`,
            priceCurrency: 'USD',
            price: dataset.price || 'Contact for pricing',
            availability: 'https://schema.org/InStock',
            seller: {
                '@id': `${SITE_URL}/#organization`,
            },
        },
        category: dataset.category,
        additionalProperty: [
            {
                '@type': 'PropertyValue',
                name: 'Clips',
                value: dataset.stats?.clips,
            },
            {
                '@type': 'PropertyValue',
                name: 'Annotations',
                value: dataset.stats?.annotations,
            },
            {
                '@type': 'PropertyValue',
                name: 'Resolution',
                value: dataset.stats?.resolution,
            },
        ],
    };
}

/**
 * Generate FAQ schema
 * @param {Array} faqs - Array of FAQ objects with question and answer
 * @returns {Object} FAQPage JSON-LD
 */
function generateFAQSchema(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/**
 * Generate Breadcrumb schema
 * @param {Array} breadcrumbs - Array of {name, url} objects
 * @returns {Object} BreadcrumbList JSON-LD
 */
function generateBreadcrumbSchema(breadcrumbs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
        })),
    };
}

/**
 * Generate CollectionPage schema for hub/category pages
 * @param {Object} collection - Collection data
 * @returns {Object} CollectionPage JSON-LD
 */
function generateCollectionSchema(collection) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}${collection.path}#collection`,
        name: collection.title,
        description: collection.description,
        url: `${SITE_URL}${collection.path}`,
        numberOfItems: collection.count,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: collection.count,
            itemListElement: collection.items?.slice(0, 10).map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${SITE_URL}${item.path}`,
                name: item.title,
            })),
        },
    };
}

/**
 * Generate HowTo schema for tutorial content
 * @param {Object} tutorial - Tutorial data with steps
 * @returns {Object} HowTo JSON-LD
 */
function generateHowToSchema(tutorial) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: tutorial.title,
        description: tutorial.description,
        totalTime: tutorial.duration,
        step: tutorial.steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.title,
            text: step.description,
            url: `${SITE_URL}${tutorial.path}#step-${index + 1}`,
        })),
    };
}

/**
 * Generate Service schema for product offerings
 * @param {Object} service - Service data
 * @returns {Object} Service JSON-LD
 */
function generateServiceSchema(service) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
            '@id': `${SITE_URL}/#organization`,
        },
        serviceType: service.type,
        areaServed: 'Worldwide',
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${service.name} Plans`,
            itemListElement: service.plans?.map(plan => ({
                '@type': 'Offer',
                name: plan.name,
                price: plan.price,
                priceCurrency: 'USD',
                description: plan.description,
            })),
        },
    };
}

/**
 * Combine multiple schemas into a single graph
 * @param {...Object} schemas - Schema objects to combine
 * @returns {Object} Combined JSON-LD with @graph
 */
function combineSchemas(...schemas) {
    return {
        '@context': 'https://schema.org',
        '@graph': schemas.map(schema => {
            // Remove individual @context since we have a global one
            const { '@context': _, ...rest } = schema;
            return rest;
        }),
    };
}

/**
 * Render schema as script tag
 * @param {Object} schema - JSON-LD schema object
 * @returns {string} HTML script tag
 */
function renderSchema(schema) {
    return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
}

/**
 * Generate complete page schema based on page type
 * @param {string} pageType - Type of page
 * @param {Object} data - Page data
 * @returns {string} HTML script tag with all relevant schemas
 */
function generatePageSchema(pageType, data = {}) {
    const schemas = [generateOrganizationSchema()];

    // Add WebSite schema only on homepage
    if (pageType === 'home') {
        schemas.push(generateWebSiteSchema());
    }

    // Add breadcrumbs if available
    if (data.breadcrumbs && data.breadcrumbs.length > 0) {
        schemas.push(generateBreadcrumbSchema(data.breadcrumbs));
    }

    // Add page-type specific schemas
    switch (pageType) {
        case 'blog':
            schemas.push(generateArticleSchema(data));
            break;
        case 'dataset':
            schemas.push(generateProductSchema(data));
            break;
        case 'faq':
            if (data.faqs) {
                schemas.push(generateFAQSchema(data.faqs));
            }
            break;
        case 'category':
            schemas.push(generateCollectionSchema(data));
            break;
        case 'tutorial':
            schemas.push(generateHowToSchema(data));
            break;
        case 'pricing':
            schemas.push(generateServiceSchema({
                name: 'HARBOR Data Platform',
                description: 'Licensed AI training datasets and API access',
                type: 'Data Infrastructure',
                plans: data.plans,
            }));
            break;
    }

    // Add FAQ schema to any page with FAQs
    if (data.faqs && pageType !== 'faq') {
        schemas.push(generateFAQSchema(data.faqs));
    }

    return renderSchema(combineSchemas(...schemas));
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateOrganizationSchema,
        generateWebSiteSchema,
        generateArticleSchema,
        generateProductSchema,
        generateFAQSchema,
        generateBreadcrumbSchema,
        generateCollectionSchema,
        generateHowToSchema,
        generateServiceSchema,
        combineSchemas,
        renderSchema,
        generatePageSchema,
        SITE_URL,
        SITE_NAME,
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.SEOSchema = {
        generatePageSchema,
        renderSchema,
    };
}
