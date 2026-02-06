/**
 * Programmatic SEO Data Layer
 * Handles fetching and caching of pSEO page data
 */

import type { PSEOPage, PageListItem, FullPageData } from './types';

// In-memory cache for build-time performance
const pageCache = new Map<string, FullPageData>();
const listCache: PageListItem[] = [];

/**
 * Fetches a single page by slug
 * Uses static JSON files in production, API in development
 */
export async function getPageBySlug(
    category: string,
    slug: string
): Promise<FullPageData | null> {
    const cacheKey = `${category}/${slug}`;

    // Check cache first
    if (pageCache.has(cacheKey)) {
        return pageCache.get(cacheKey)!;
    }

    try {
        // In production, fetch from static JSON
        // In development, could use API
        const response = await fetch(`/data/pseo/${category}/${slug}.json`);

        if (!response.ok) {
            console.warn(`Page not found: ${cacheKey}`);
            return null;
        }

        const data: FullPageData = await response.json();

        // Cache for subsequent requests
        pageCache.set(cacheKey, data);

        return data;
    } catch (error) {
        console.error(`Error fetching page ${cacheKey}:`, error);
        return null;
    }
}

/**
 * Gets all page slugs for static generation
 */
export async function getAllSlugs(): Promise<Array<{ category: string; slug: string }>> {
    try {
        const response = await fetch('/data/pseo/index.json');

        if (!response.ok) {
            return [];
        }

        const index: Array<{ category: string; slug: string }> = await response.json();
        return index;
    } catch (error) {
        console.error('Error fetching page index:', error);
        return [];
    }
}

/**
 * Gets pages by category for hub pages
 */
export async function getPagesByCategory(
    category: string,
    limit = 50
): Promise<PageListItem[]> {
    try {
        const response = await fetch(`/data/pseo/${category}/index.json`);

        if (!response.ok) {
            return [];
        }

        const pages: PageListItem[] = await response.json();
        return pages.slice(0, limit);
    } catch (error) {
        console.error(`Error fetching category ${category}:`, error);
        return [];
    }
}

/**
 * Gets related pages for internal linking
 */
export async function getRelatedPages(
    category: string,
    currentSlug: string,
    limit = 6
): Promise<PageListItem[]> {
    const categoryPages = await getPagesByCategory(category, limit + 1);

    return categoryPages
        .filter((page) => page.slug !== currentSlug)
        .slice(0, limit);
}

/**
 * Searches pages by keyword
 */
export async function searchPages(
    query: string,
    limit = 20
): Promise<PageListItem[]> {
    // In a real implementation, this would use a search index
    // For now, we fetch all and filter client-side
    const allPages = await getAllPages();

    const queryLower = query.toLowerCase();

    return allPages
        .filter(
            (page) =>
                page.title.toLowerCase().includes(queryLower) ||
                page.description.toLowerCase().includes(queryLower)
        )
        .slice(0, limit);
}

/**
 * Gets all pages (for build-time use)
 */
export async function getAllPages(): Promise<PageListItem[]> {
    if (listCache.length > 0) {
        return listCache;
    }

    try {
        const response = await fetch('/data/pseo/all-pages.json');

        if (!response.ok) {
            return [];
        }

        const pages: PageListItem[] = await response.json();
        listCache.push(...pages);

        return pages;
    } catch (error) {
        console.error('Error fetching all pages:', error);
        return [];
    }
}

/**
 * Preloads pages into cache (for performance)
 */
export async function preloadPages(
    slugs: Array<{ category: string; slug: string }>
): Promise<void> {
    await Promise.all(
        slugs.map(({ category, slug }) => getPageBySlug(category, slug))
    );
}

/**
 * Clears the page cache (for development)
 */
export function clearCache(): void {
    pageCache.clear();
    listCache.length = 0;
}

/**
 * Gets page count by category
 */
export async function getPageCountByCategory(): Promise<Record<string, number>> {
    const allPages = await getAllPages();

    return allPages.reduce((acc, page) => {
        acc[page.category] = (acc[page.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}

/**
 * Validates page data integrity
 */
export function validatePageData(page: Partial<PSEOPage>): string[] {
    const errors: string[] = [];

    if (!page.slug) errors.push('Missing slug');
    if (!page.title) errors.push('Missing title');
    if (!page.h1) errors.push('Missing h1');
    if (!page.description) errors.push('Missing description');
    if (!page.category) errors.push('Missing category');
    if (!page.template) errors.push('Missing template');

    if (page.title && page.title.length > 60) {
        errors.push(`Title too long: ${page.title.length} chars (max 60)`);
    }

    if (page.description && page.description.length > 160) {
        errors.push(`Description too long: ${page.description.length} chars (max 160)`);
    }

    return errors;
}
