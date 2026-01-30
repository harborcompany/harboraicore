/**
 * Content Uniqueness Engine
 * Ensures each page has unique content to avoid duplication penalties
 */

import type { FAQItem, FeatureItem } from './types';

/**
 * Sentence variation patterns
 */
const SENTENCE_STARTERS = [
    'Discover',
    'Explore',
    'Learn about',
    'Understand',
    'Master',
    'Unlock',
    'Access',
    'Leverage',
    'Utilize',
    'Implement',
];

const SENTENCE_CONNECTORS = [
    'with our',
    'using our',
    'through our',
    'via our',
    'powered by our',
];

const VALUE_PROPOSITIONS = [
    'enterprise-grade',
    'production-ready',
    'industry-leading',
    'high-quality',
    'premium',
    'comprehensive',
    'advanced',
    'cutting-edge',
];

/**
 * Generates a unique description from a template
 */
export function generateUniqueDescription(
    template: string,
    variables: Record<string, string>,
    seed: number
): string {
    // Apply variable substitution
    let description = template;
    for (const [key, value] of Object.entries(variables)) {
        description = description.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }

    // Add variation based on seed
    const starterIndex = seed % SENTENCE_STARTERS.length;
    const connectorIndex = (seed + 3) % SENTENCE_CONNECTORS.length;
    const valueIndex = (seed + 7) % VALUE_PROPOSITIONS.length;

    // Only modify if template contains placeholders for variation
    if (description.includes('[STARTER]')) {
        description = description.replace('[STARTER]', SENTENCE_STARTERS[starterIndex]);
    }
    if (description.includes('[CONNECTOR]')) {
        description = description.replace('[CONNECTOR]', SENTENCE_CONNECTORS[connectorIndex]);
    }
    if (description.includes('[VALUE]')) {
        description = description.replace('[VALUE]', VALUE_PROPOSITIONS[valueIndex]);
    }

    return description;
}

/**
 * Generates unique FAQs from templates
 */
export function generateUniqueFAQs(
    faqTemplates: FAQItem[],
    variables: Record<string, string>,
    seed: number,
    count = 3
): FAQItem[] {
    // Shuffle FAQs based on seed
    const shuffled = [...faqTemplates].sort(
        (a, b) => hashString(a.question + seed.toString()) - hashString(b.question + seed.toString())
    );

    return shuffled.slice(0, count).map((faq, index) => ({
        question: applyVariables(faq.question, variables),
        answer: applyVariables(faq.answer, variables),
    }));
}

/**
 * Generates unique features from templates
 */
export function generateUniqueFeatures(
    featureTemplates: FeatureItem[],
    variables: Record<string, string>,
    seed: number,
    count = 4
): FeatureItem[] {
    const shuffled = [...featureTemplates].sort(
        (a, b) => hashString(a.title + seed.toString()) - hashString(b.title + seed.toString())
    );

    return shuffled.slice(0, count).map((feature) => ({
        title: applyVariables(feature.title, variables),
        description: applyVariables(feature.description, variables),
        icon: feature.icon,
    }));
}

/**
 * Applies variable substitution to a string
 */
function applyVariables(text: string, variables: Record<string, string>): string {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
}

/**
 * Simple string hash for deterministic shuffling
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}

/**
 * Generates a unique intro paragraph
 */
export function generateUniqueIntro(
    templates: string[],
    variables: Record<string, string>,
    seed: number
): string {
    const templateIndex = seed % templates.length;
    return applyVariables(templates[templateIndex], variables);
}

/**
 * Calculates content similarity score (0-1)
 * Used to detect near-duplicate content
 */
export function calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size; // Jaccard similarity
}

/**
 * Checks if content is too similar to existing content
 */
export function isTooSimilar(
    newContent: string,
    existingContents: string[],
    threshold = 0.7
): boolean {
    for (const existing of existingContents) {
        if (calculateSimilarity(newContent, existing) > threshold) {
            return true;
        }
    }
    return false;
}

/**
 * Generates a seed from a slug for deterministic uniqueness
 */
export function slugToSeed(slug: string): number {
    return Math.abs(hashString(slug));
}
