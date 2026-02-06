/**
 * Programmatic SEO Types
 * Core interfaces for the pSEO system
 */

/**
 * FAQ Item for page FAQs
 */
export interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Core pSEO page data structure
 */
export interface PSEOPage {
    // Identifiers
    id: string;
    slug: string;
    category: string;

    // SEO metadata
    title: string;
    h1: string;
    description: string;

    // Template selection
    template: 'tool-landing' | 'comparison' | 'guide' | 'category-hub';

    // Content
    intro?: string;
    features?: FeatureItem[];
    faqs: FAQItem[];

    // Linking
    relatedSlugs: string[];
    parentCategory?: string;

    // Indexing
    active: boolean;
    priority: number; // 0.0 - 1.0 for sitemap

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

/**
 * Feature item for tool landing pages
 */
export interface FeatureItem {
    title: string;
    description: string;
    icon?: string;
}

/**
 * Keyword entity for combinatorial generation
 */
export interface KeywordEntity {
    type: 'modifier' | 'useCase' | 'industry' | 'dataType' | 'platform';
    value: string;
    slug: string;
    variations?: string[];
}

/**
 * Keyword matrix for page generation
 */
export interface KeywordMatrix {
    modifiers: KeywordEntity[];
    useCases: KeywordEntity[];
    industries: KeywordEntity[];
    dataTypes: KeywordEntity[];
    platforms: KeywordEntity[];
}

/**
 * Page generation config
 */
export interface PageGenerationConfig {
    template: PSEOPage['template'];
    titleTemplate: string;
    descriptionTemplates: string[];
    faqTemplates: FAQItem[];
    featureTemplates?: FeatureItem[];
}

/**
 * Comparison page specific data
 */
export interface ComparisonData {
    toolA: {
        name: string;
        slug: string;
        pros: string[];
        cons: string[];
    };
    toolB: {
        name: string;
        slug: string;
        pros: string[];
        cons: string[];
    };
    comparisonTable: Array<{
        feature: string;
        toolAValue: string;
        toolBValue: string;
        winner?: 'A' | 'B' | 'tie';
    }>;
}

/**
 * Guide page specific data
 */
export interface GuideData {
    readingTime: string;
    tableOfContents: Array<{
        title: string;
        anchor: string;
        level: 1 | 2 | 3;
    }>;
    sections: Array<{
        id: string;
        title: string;
        content: string;
    }>;
}

/**
 * Category hub specific data
 */
export interface CategoryHubData {
    categoryName: string;
    categoryDescription: string;
    childPages: Array<{
        title: string;
        slug: string;
        description: string;
    }>;
    stats?: {
        totalDatasets: number;
        totalHours: number;
        industries: number;
    };
}

/**
 * Full page data with template-specific extensions
 */
export type FullPageData = PSEOPage & {
    comparison?: ComparisonData;
    guide?: GuideData;
    categoryHub?: CategoryHubData;
};

/**
 * Page list item (lightweight for listings)
 */
export interface PageListItem {
    slug: string;
    title: string;
    category: string;
    description: string;
    template: PSEOPage['template'];
    priority: number;
    updatedAt: string;
}

/**
 * Sitemap entry
 */
export interface SitemapEntry {
    loc: string;
    lastmod: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
}
