/**
 * Content Validation System
 * Prevents thin content and ensures SEO quality
 */

import type { PSEOPage, FAQItem } from './types';

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    score: number; // 0-100
}

/**
 * Minimum thresholds for content quality
 */
const THRESHOLDS = {
    titleMinLength: 30,
    titleMaxLength: 60,
    descriptionMinLength: 120,
    descriptionMaxLength: 160,
    h1MinLength: 20,
    h1MaxLength: 70,
    faqMinCount: 3,
    faqAnswerMinLength: 50,
    introMinWords: 50,
    featureMinCount: 3,
};

/**
 * Validates a complete pSEO page
 */
export function validatePage(page: PSEOPage): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Title validation
    if (!page.title) {
        errors.push('Missing title');
        score -= 20;
    } else {
        if (page.title.length < THRESHOLDS.titleMinLength) {
            warnings.push(`Title too short: ${page.title.length} chars (min ${THRESHOLDS.titleMinLength})`);
            score -= 5;
        }
        if (page.title.length > THRESHOLDS.titleMaxLength) {
            errors.push(`Title too long: ${page.title.length} chars (max ${THRESHOLDS.titleMaxLength})`);
            score -= 10;
        }
    }

    // Description validation
    if (!page.description) {
        errors.push('Missing description');
        score -= 20;
    } else {
        if (page.description.length < THRESHOLDS.descriptionMinLength) {
            warnings.push(`Description too short: ${page.description.length} chars (min ${THRESHOLDS.descriptionMinLength})`);
            score -= 5;
        }
        if (page.description.length > THRESHOLDS.descriptionMaxLength) {
            errors.push(`Description too long: ${page.description.length} chars (max ${THRESHOLDS.descriptionMaxLength})`);
            score -= 10;
        }
    }

    // H1 validation
    if (!page.h1) {
        errors.push('Missing H1');
        score -= 15;
    } else {
        if (page.h1.length < THRESHOLDS.h1MinLength) {
            warnings.push(`H1 too short: ${page.h1.length} chars`);
            score -= 3;
        }
        if (page.h1.length > THRESHOLDS.h1MaxLength) {
            warnings.push(`H1 too long: ${page.h1.length} chars`);
            score -= 3;
        }
    }

    // FAQ validation
    if (!page.faqs || page.faqs.length === 0) {
        errors.push('Missing FAQs');
        score -= 15;
    } else {
        if (page.faqs.length < THRESHOLDS.faqMinCount) {
            warnings.push(`Too few FAQs: ${page.faqs.length} (min ${THRESHOLDS.faqMinCount})`);
            score -= 5;
        }

        const shortAnswers = page.faqs.filter(
            (faq) => faq.answer.length < THRESHOLDS.faqAnswerMinLength
        );
        if (shortAnswers.length > 0) {
            warnings.push(`${shortAnswers.length} FAQ answers are too short`);
            score -= shortAnswers.length * 2;
        }
    }

    // Intro validation
    if (page.intro) {
        const wordCount = page.intro.split(/\s+/).length;
        if (wordCount < THRESHOLDS.introMinWords) {
            warnings.push(`Intro too short: ${wordCount} words (min ${THRESHOLDS.introMinWords})`);
            score -= 5;
        }
    }

    // Features validation (for tool-landing template)
    if (page.template === 'tool-landing') {
        if (!page.features || page.features.length < THRESHOLDS.featureMinCount) {
            warnings.push(`Too few features: ${page.features?.length || 0}`);
            score -= 5;
        }
    }

    // Related pages validation
    if (!page.relatedSlugs || page.relatedSlugs.length === 0) {
        warnings.push('No related pages linked');
        score -= 3;
    }

    // Ensure score doesn't go negative
    score = Math.max(0, score);

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        score,
    };
}

/**
 * Validates that a title is unique across all pages
 */
export function validateTitleUniqueness(
    title: string,
    existingTitles: string[]
): { isUnique: boolean; duplicate?: string } {
    const normalizedTitle = title.toLowerCase().trim();

    for (const existing of existingTitles) {
        if (existing.toLowerCase().trim() === normalizedTitle) {
            return { isUnique: false, duplicate: existing };
        }
    }

    return { isUnique: true };
}

/**
 * Validates that H1s are unique (critical for SEO)
 */
export function validateH1Uniqueness(
    h1: string,
    existingH1s: string[]
): { isUnique: boolean; duplicate?: string } {
    const normalizedH1 = h1.toLowerCase().trim();

    for (const existing of existingH1s) {
        if (existing.toLowerCase().trim() === normalizedH1) {
            return { isUnique: false, duplicate: existing };
        }
    }

    return { isUnique: true };
}

/**
 * Batch validates multiple pages
 */
export function validatePages(pages: PSEOPage[]): {
    valid: number;
    invalid: number;
    averageScore: number;
    issues: Array<{ slug: string; errors: string[]; warnings: string[] }>;
} {
    let valid = 0;
    let invalid = 0;
    let totalScore = 0;
    const issues: Array<{ slug: string; errors: string[]; warnings: string[] }> = [];

    for (const page of pages) {
        const result = validatePage(page);
        totalScore += result.score;

        if (result.isValid) {
            valid++;
        } else {
            invalid++;
        }

        if (result.errors.length > 0 || result.warnings.length > 0) {
            issues.push({
                slug: page.slug,
                errors: result.errors,
                warnings: result.warnings,
            });
        }
    }

    return {
        valid,
        invalid,
        averageScore: pages.length > 0 ? totalScore / pages.length : 0,
        issues,
    };
}

/**
 * Checks for thin content (low word count)
 */
export function checkThinContent(page: PSEOPage): boolean {
    const allText = [
        page.title,
        page.h1,
        page.description,
        page.intro || '',
        ...(page.faqs?.map((f) => f.question + ' ' + f.answer) || []),
        ...(page.features?.map((f) => f.title + ' ' + f.description) || []),
    ].join(' ');

    const wordCount = allText.split(/\s+/).filter((w) => w.length > 0).length;

    // Pages should have at least 300 words of unique content
    return wordCount < 300;
}
