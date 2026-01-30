/**
 * Schema.org Structured Data Builders
 * Generates JSON-LD for rich results in search
 */

export interface FAQItem {
    question: string;
    answer: string;
}

// BreadcrumbItem supports both 'name' (schema.org) and 'title' (LinkItem) naming
export interface BreadcrumbItem {
    name?: string;
    title?: string;
    url: string;
}

export interface ArticleData {
    headline: string;
    description: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
}

export interface ProductData {
    name: string;
    description: string;
    image?: string;
    brand?: string;
    offers?: {
        price: number;
        priceCurrency: string;
        availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    };
}

const ORGANIZATION_SCHEMA = {
    '@type': 'Organization',
    name: 'Harbor AI',
    url: 'https://harborml.com',
    logo: 'https://harborml.com/harbor-logo.png',
    sameAs: [
        'https://twitter.com/harborai',
        'https://linkedin.com/company/harborai',
        'https://github.com/harborai',
    ],
};

/**
 * Generates FAQPage schema for FAQ sections
 */
export function generateFAQSchema(faqs: FAQItem[]): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
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
 * Generates BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(
    items: BreadcrumbItem[],
    baseUrl = 'https://harborml.com'
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name || item.title || '',
            item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
        })),
    };
}

/**
 * Generates Article schema for guides and blog posts
 */
export function generateArticleSchema(
    article: ArticleData,
    baseUrl = 'https://harborml.com'
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.headline,
        description: article.description,
        image: article.image
            ? (article.image.startsWith('http') ? article.image : `${baseUrl}${article.image}`)
            : `${baseUrl}/og-image.png`,
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        author: {
            '@type': 'Organization',
            name: article.author || 'Harbor AI',
        },
        publisher: ORGANIZATION_SCHEMA,
    };
}

/**
 * Generates Product schema for dataset pages
 */
export function generateProductSchema(
    product: ProductData,
    baseUrl = 'https://harborml.com'
): Record<string, unknown> {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: product.brand || 'Harbor AI',
        },
    };

    if (product.image) {
        schema.image = product.image.startsWith('http')
            ? product.image
            : `${baseUrl}${product.image}`;
    }

    if (product.offers) {
        schema.offers = {
            '@type': 'Offer',
            price: product.offers.price,
            priceCurrency: product.offers.priceCurrency,
            availability: `https://schema.org/${product.offers.availability}`,
        };
    }

    return schema;
}

/**
 * Generates Organization schema (site-wide)
 */
export function generateOrganizationSchema(): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        ...ORGANIZATION_SCHEMA,
    };
}

/**
 * Generates WebSite schema with search action
 */
export function generateWebSiteSchema(baseUrl = 'https://harborml.com'): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Harbor AI',
        url: baseUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

/**
 * Combines multiple schemas into a single graph
 */
export function combineSchemas(
    schemas: Record<string, unknown>[]
): Record<string, unknown> {
    // Filter out schemas that already have @context
    const cleanedSchemas = schemas.map((schema) => {
        const { '@context': _, ...rest } = schema;
        return rest;
    });

    return {
        '@context': 'https://schema.org',
        '@graph': cleanedSchemas,
    };
}

/**
 * Generates complete schema for a pSEO page
 */
export function generatePageSchema(options: {
    breadcrumbs: BreadcrumbItem[];
    faqs?: FAQItem[];
    article?: ArticleData;
    product?: ProductData;
}): Record<string, unknown> {
    const schemas: Record<string, unknown>[] = [
        generateOrganizationSchema(),
        generateBreadcrumbSchema(options.breadcrumbs),
    ];

    if (options.faqs && options.faqs.length > 0) {
        schemas.push(generateFAQSchema(options.faqs));
    }

    if (options.article) {
        schemas.push(generateArticleSchema(options.article));
    }

    if (options.product) {
        schemas.push(generateProductSchema(options.product));
    }

    return combineSchemas(schemas);
}
