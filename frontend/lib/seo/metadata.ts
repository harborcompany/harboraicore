/**
 * SEO Metadata Generator
 * Generates dynamic metadata for programmatic SEO pages
 */

export interface PageMetadata {
    title: string;
    description: string;
    canonical: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'product';
    ogUrl?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
}

export interface MetadataOptions {
    title: string;
    description: string;
    slug: string;
    category?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    noIndex?: boolean;
    baseUrl?: string;
}

const DEFAULT_BASE_URL = 'https://harborml.com';
const BRAND_SUFFIX = ' | Harbor AI';
const DEFAULT_OG_IMAGE = '/og-image.png';

/**
 * Generates complete metadata for a page
 */
export function generateMetadata(options: MetadataOptions): PageMetadata {
    const baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    const fullTitle = options.title.includes('Harbor')
        ? options.title
        : `${options.title}${BRAND_SUFFIX}`;

    // Ensure description is optimal length (150-160 chars)
    const description = truncateDescription(options.description, 160);

    // Build canonical URL (no trailing slash, lowercase)
    const canonical = buildCanonicalUrl(baseUrl, options.slug, options.category);

    // Determine robots directive
    const robots = options.noIndex ? 'noindex, follow' : 'index, follow';

    // Build OG image URL
    const ogImage = options.image
        ? (options.image.startsWith('http') ? options.image : `${baseUrl}${options.image}`)
        : `${baseUrl}${DEFAULT_OG_IMAGE}`;

    return {
        title: fullTitle,
        description,
        canonical,
        robots,
        ogTitle: fullTitle,
        ogDescription: description,
        ogImage,
        ogType: options.type || 'website',
        ogUrl: canonical,
        twitterCard: 'summary_large_image',
        twitterTitle: fullTitle,
        twitterDescription: description,
        twitterImage: ogImage,
    };
}

/**
 * Truncates description to optimal SEO length
 */
function truncateDescription(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;

    // Try to cut at sentence boundary
    const truncated = text.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastPeriod > maxLength * 0.7) {
        return truncated.substring(0, lastPeriod + 1);
    }

    return truncated.substring(0, lastSpace) + '...';
}

/**
 * Builds canonical URL with proper formatting
 */
function buildCanonicalUrl(baseUrl: string, slug: string, category?: string): string {
    const cleanBase = baseUrl.replace(/\/$/, '');
    const cleanSlug = slug.replace(/^\//, '').replace(/\/$/, '').toLowerCase();

    if (category) {
        const cleanCategory = category.toLowerCase();
        return `${cleanBase}/tools/${cleanCategory}/${cleanSlug}`;
    }

    return `${cleanBase}/${cleanSlug}`;
}

/**
 * Generates unique title based on template and variables
 */
export function generateDynamicTitle(
    template: string,
    variables: Record<string, string>
): string {
    let title = template;

    for (const [key, value] of Object.entries(variables)) {
        title = title.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }

    return title;
}

/**
 * Generates unique description with sentence variation
 */
export function generateDynamicDescription(
    templates: string[],
    variables: Record<string, string>,
    seed?: number
): string {
    // Use seed or random selection for template
    const index = seed !== undefined
        ? seed % templates.length
        : Math.floor(Math.random() * templates.length);

    let description = templates[index];

    for (const [key, value] of Object.entries(variables)) {
        description = description.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }

    return description;
}

/**
 * Title templates for different page types
 */
export const TITLE_TEMPLATES = {
    toolLanding: '{useCase} {dataType} Datasets for {industry}',
    comparison: '{toolA} vs {toolB}: Which is Better for {useCase}?',
    guide: 'How to {action} with {dataType} Data: Complete Guide',
    categoryHub: '{category} Datasets & Training Data | Harbor AI',
};

/**
 * Description templates with variations to prevent duplication
 */
export const DESCRIPTION_TEMPLATES = {
    toolLanding: [
        'High-quality {dataType} datasets for {industry} {useCase}. Enterprise-grade annotation, frame-accurate labeling, and full compliance.',
        'Accelerate your {industry} AI with premium {dataType} training data. {useCase} datasets with rigorous quality assurance.',
        'Production-ready {dataType} datasets optimized for {useCase} in {industry}. Sub-frame accuracy and cryptographic provenance.',
    ],
    comparison: [
        'Compare {toolA} and {toolB} for {useCase}. Detailed feature comparison, pricing, and recommendations.',
        'Choosing between {toolA} and {toolB}? Our in-depth comparison covers performance, pricing, and use cases.',
    ],
    guide: [
        'Learn how to {action} with {dataType} data. Step-by-step tutorial with code examples and best practices.',
        'Complete guide to {action} using {dataType} datasets. From setup to production deployment.',
    ],
};
