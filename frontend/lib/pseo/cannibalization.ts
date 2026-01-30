/**
 * Keyword Cannibalization Prevention
 * Ensures pages don't compete for the same keywords
 */

import type { PSEOPage } from './types';

export interface KeywordAssignment {
    slug: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
}

export interface CannibalizationConflict {
    keyword: string;
    pages: string[];
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
}

/**
 * Extracts keywords from page content
 */
export function extractKeywords(page: PSEOPage): string[] {
    const text = [
        page.title,
        page.h1,
        page.description,
        page.intro || '',
    ].join(' ').toLowerCase();

    // Extract multi-word phrases (2-4 words)
    const words = text.split(/\s+/).filter((w) => w.length > 3);
    const keywords: string[] = [];

    // Single important words
    for (const word of words) {
        if (isImportantWord(word)) {
            keywords.push(word);
        }
    }

    // Two-word phrases
    for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`;
        if (isValidPhrase(phrase)) {
            keywords.push(phrase);
        }
    }

    // Three-word phrases
    for (let i = 0; i < words.length - 2; i++) {
        const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        if (isValidPhrase(phrase)) {
            keywords.push(phrase);
        }
    }

    return [...new Set(keywords)];
}

/**
 * Common stop words to filter out
 */
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall',
    'can', 'this', 'that', 'these', 'those', 'with', 'for', 'from',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few',
    'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same',
    'than', 'too', 'very', 'just', 'also', 'about', 'your', 'our',
]);

function isImportantWord(word: string): boolean {
    const cleaned = word.replace(/[^a-z]/g, '');
    return cleaned.length > 4 && !STOP_WORDS.has(cleaned);
}

function isValidPhrase(phrase: string): boolean {
    const words = phrase.split(' ');
    // At least one important word
    return words.some(isImportantWord);
}

/**
 * Assigns primary keyword to a page
 */
export function assignPrimaryKeyword(page: PSEOPage): KeywordAssignment {
    const keywords = extractKeywords(page);

    // Primary keyword is typically in the H1 or title
    const h1Words = page.h1.toLowerCase().split(/\s+/);
    const titleWords = page.title.toLowerCase().split(/\s+/);

    // Score keywords by their presence in H1/title
    const scored = keywords.map((kw) => {
        let score = 0;
        const kwWords = kw.split(' ');

        // High score for exact match in H1
        if (page.h1.toLowerCase().includes(kw)) {
            score += 10;
        }

        // Medium score for partial match in H1
        for (const word of kwWords) {
            if (h1Words.includes(word)) score += 3;
            if (titleWords.includes(word)) score += 2;
        }

        return { keyword: kw, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
        slug: page.slug,
        primaryKeyword: scored[0]?.keyword || page.h1.toLowerCase(),
        secondaryKeywords: scored.slice(1, 5).map((s) => s.keyword),
    };
}

/**
 * Detects keyword cannibalization across pages
 */
export function detectCannibalization(
    pages: PSEOPage[]
): CannibalizationConflict[] {
    const keywordMap = new Map<string, string[]>();

    // Build keyword-to-pages map
    for (const page of pages) {
        const assignment = assignPrimaryKeyword(page);

        // Track primary keyword
        const existing = keywordMap.get(assignment.primaryKeyword) || [];
        existing.push(page.slug);
        keywordMap.set(assignment.primaryKeyword, existing);
    }

    // Find conflicts
    const conflicts: CannibalizationConflict[] = [];

    for (const [keyword, slugs] of keywordMap.entries()) {
        if (slugs.length > 1) {
            conflicts.push({
                keyword,
                pages: slugs,
                severity: slugs.length > 3 ? 'high' : slugs.length > 2 ? 'medium' : 'low',
                recommendation: generateRecommendation(keyword, slugs),
            });
        }
    }

    return conflicts.sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    });
}

/**
 * Generates a recommendation for resolving conflicts
 */
function generateRecommendation(keyword: string, pages: string[]): string {
    if (pages.length === 2) {
        return `Consider making one page a hub and the other a spoke, or differentiate with modifiers (e.g., "best ${keyword}" vs "${keyword} guide")`;
    }

    if (pages.length > 3) {
        return `Strong risk of cannibalization. Consider consolidating into one comprehensive page or creating a clear hub-and-spoke structure with distinct sub-topics.`;
    }

    return `Differentiate titles and H1s to target different search intents for "${keyword}"`;
}

/**
 * Calculates semantic distance between two pages
 */
export function calculateSemanticDistance(
    page1: PSEOPage,
    page2: PSEOPage
): number {
    const keywords1 = new Set(extractKeywords(page1));
    const keywords2 = new Set(extractKeywords(page2));

    const intersection = new Set([...keywords1].filter((x) => keywords2.has(x)));
    const union = new Set([...keywords1, ...keywords2]);

    // Jaccard distance (1 - similarity)
    return 1 - intersection.size / union.size;
}

/**
 * Finds pages that are too similar (potential cannibalization)
 */
export function findSimilarPages(
    pages: PSEOPage[],
    threshold = 0.3
): Array<{ page1: string; page2: string; distance: number }> {
    const similar: Array<{ page1: string; page2: string; distance: number }> = [];

    for (let i = 0; i < pages.length; i++) {
        for (let j = i + 1; j < pages.length; j++) {
            const distance = calculateSemanticDistance(pages[i], pages[j]);

            if (distance < threshold) {
                similar.push({
                    page1: pages[i].slug,
                    page2: pages[j].slug,
                    distance,
                });
            }
        }
    }

    return similar.sort((a, b) => a.distance - b.distance);
}
