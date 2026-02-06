/**
 * Internal Linking System
 * Hub-and-spoke architecture for SEO link equity distribution
 */

export interface LinkItem {
    title: string;
    url: string;
    description?: string;
}

// BreadcrumbItem for schema.org compatibility  
export interface BreadcrumbItem {
    name: string;
    url: string;
}

/**
 * Convert LinkItem[] to BreadcrumbItem[] for schema generation
 */
export function toBreadcrumbItems(items: LinkItem[]): BreadcrumbItem[] {
    return items.map(item => ({
        name: item.title,
        url: item.url,
    }));
}

export interface CategoryHierarchy {
    name: string;
    slug: string;
    parent?: string;
    children?: string[];
}

/**
 * Category hierarchy for hub-spoke linking
 */
export const CATEGORY_HIERARCHY: Record<string, CategoryHierarchy> = {
    automotive: {
        name: 'Automotive',
        slug: 'automotive',
        children: ['autonomous-vehicles', 'adas', 'fleet-management', 'ev-charging'],
    },
    healthcare: {
        name: 'Healthcare',
        slug: 'healthcare',
        children: ['medical-imaging', 'patient-monitoring', 'drug-discovery', 'telehealth'],
    },
    retail: {
        name: 'Retail',
        slug: 'retail',
        children: ['inventory-management', 'customer-analytics', 'visual-search', 'checkout-automation'],
    },
    media: {
        name: 'Media & Entertainment',
        slug: 'media',
        children: ['content-moderation', 'video-analytics', 'recommendation-systems', 'ad-tech'],
    },
    gaming: {
        name: 'Gaming',
        slug: 'gaming',
        children: ['player-behavior', 'game-testing', 'npc-ai', 'anti-cheat'],
    },
};

/**
 * Generates breadcrumb trail for a page
 */
export function generateBreadcrumbTrail(
    category: string,
    pageTitle: string,
    pageSlug: string
): LinkItem[] {
    const breadcrumbs: LinkItem[] = [
        { title: 'Home', url: '/' },
        { title: 'Tools', url: '/tools' },
    ];

    const categoryData = CATEGORY_HIERARCHY[category];
    if (categoryData) {
        breadcrumbs.push({
            title: categoryData.name,
            url: `/tools/${categoryData.slug}`,
        });
    }

    breadcrumbs.push({
        title: pageTitle,
        url: `/tools/${category}/${pageSlug}`,
    });

    return breadcrumbs;
}

/**
 * Gets hub page link for a category
 */
export function getHubLink(category: string): LinkItem | null {
    const categoryData = CATEGORY_HIERARCHY[category];
    if (!categoryData) return null;

    return {
        title: `All ${categoryData.name} Datasets`,
        url: `/tools/${categoryData.slug}`,
        description: `Explore all ${categoryData.name.toLowerCase()} training data and datasets`,
    };
}

/**
 * Gets sibling pages in the same category
 */
export function getSiblingLinks(
    category: string,
    currentSlug: string,
    allPages: Array<{ slug: string; title: string; category: string }>,
    limit = 4
): LinkItem[] {
    return allPages
        .filter((page) => page.category === category && page.slug !== currentSlug)
        .slice(0, limit)
        .map((page) => ({
            title: page.title,
            url: `/tools/${category}/${page.slug}`,
        }));
}

/**
 * Gets related pages based on semantic similarity
 * Uses simple keyword matching for now, can be upgraded to embeddings
 */
export function getRelatedPages(
    currentPage: { title: string; category: string; slug: string },
    allPages: Array<{ slug: string; title: string; category: string; keywords?: string[] }>,
    limit = 6
): LinkItem[] {
    const currentWords = currentPage.title.toLowerCase().split(/\s+/);

    // Score each page by keyword overlap
    const scored = allPages
        .filter((page) => page.slug !== currentPage.slug)
        .map((page) => {
            const pageWords = page.title.toLowerCase().split(/\s+/);
            const overlap = currentWords.filter((word) =>
                pageWords.some((pw) => pw.includes(word) || word.includes(pw))
            ).length;

            // Boost same-category pages
            const categoryBoost = page.category === currentPage.category ? 2 : 0;

            return {
                page,
                score: overlap + categoryBoost,
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scored.map((item) => ({
        title: item.page.title,
        url: `/tools/${item.page.category}/${item.page.slug}`,
    }));
}

/**
 * Generates internal link structure for a page
 */
export function generateInternalLinks(
    currentPage: { title: string; category: string; slug: string },
    allPages: Array<{ slug: string; title: string; category: string }>
): {
    breadcrumbs: LinkItem[];
    hubLink: LinkItem | null;
    siblingLinks: LinkItem[];
    relatedLinks: LinkItem[];
} {
    return {
        breadcrumbs: generateBreadcrumbTrail(
            currentPage.category,
            currentPage.title,
            currentPage.slug
        ),
        hubLink: getHubLink(currentPage.category),
        siblingLinks: getSiblingLinks(currentPage.category, currentPage.slug, allPages),
        relatedLinks: getRelatedPages(currentPage, allPages),
    };
}

/**
 * Calculates optimal internal link density
 * Target: 3-5 internal links per 1000 words
 */
export function calculateLinkDensity(
    wordCount: number,
    currentLinkCount: number
): { optimal: number; status: 'low' | 'optimal' | 'high' } {
    const optimal = Math.floor(wordCount / 250); // ~4 links per 1000 words

    if (currentLinkCount < optimal * 0.6) {
        return { optimal, status: 'low' };
    }
    if (currentLinkCount > optimal * 1.5) {
        return { optimal, status: 'high' };
    }
    return { optimal, status: 'optimal' };
}
