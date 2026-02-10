/**
 * Harbor ML - Annotation Confidence Scorer
 * 
 * 4-component confidence scoring for every user annotation:
 *   confidence = 0.4 × model_agreement
 *              + 0.3 × cross_user_agreement
 *              + 0.2 × user_reliability
 *              + 0.1 × context_quality
 * 
 * Final training weight = confidence × base_weight
 */

import { prisma } from '../../lib/prisma.js';

// ============================================
// CONSTANTS
// ============================================

const WEIGHTS = {
    MODEL_AGREEMENT: 0.4,
    CROSS_USER_AGREEMENT: 0.3,
    USER_RELIABILITY: 0.2,
    CONTEXT_QUALITY: 0.1
} as const;

const RELIABILITY = {
    INITIAL: 0.5,
    MIN: 0.2,
    MAX: 0.95,
    INCREMENT: 0.02,
    DECREMENT: 0.02,
    FAST_WRONG_THRESHOLD_MS: 2000, // annotation < 2s = suspicious
    FAST_WRONG_PENALTY: 0.05
} as const;

const XP = {
    BASE_PER_ANNOTATION: 10,
    THROTTLE_THRESHOLD: 0.35,   // reliability below this = throttled
    THROTTLE_CAP: 0.25          // cap XP at 25% if throttled
} as const;

const BASE_TRAINING_WEIGHT = 1.0;

// ============================================
// TYPES
// ============================================

interface ConfidenceBreakdown {
    modelAgreement: number;
    crossUserAgreement: number;
    userReliability: number;
    contextQuality: number;
    confidenceScore: number;
    trainingWeight: number;
}

interface ReliabilityUpdate {
    matchedConsensus: boolean;
    annotationTimeMs?: number;
}

// ============================================
// CONFIDENCE SCORER SERVICE
// ============================================

export class ConfidenceScorer {

    // ------------------------------------------
    // PUBLIC: Score a single annotation
    // ------------------------------------------

    async scoreAnnotation(annotationId: string): Promise<ConfidenceBreakdown> {
        console.log(`[ConfidenceScorer] Scoring annotation ${annotationId}`);

        const annotation = await prisma.userAnnotation.findUnique({
            where: { id: annotationId },
            include: { asset: true }
        });

        if (!annotation) {
            throw new Error(`Annotation ${annotationId} not found`);
        }

        // Compute all 4 components
        const [modelAgreement, crossUserAgreement, userReliability, contextQuality] = await Promise.all([
            this.computeModelAgreement(annotation.mediaId, annotation.labelType, annotation.labels),
            this.computeCrossUserAgreement(annotation.mediaId, annotation.labelType, annotation.id),
            this.getUserReliability(annotation.userId),
            this.computeContextQuality(annotation.mediaId)
        ]);

        // Weighted formula
        const confidenceScore =
            WEIGHTS.MODEL_AGREEMENT * modelAgreement +
            WEIGHTS.CROSS_USER_AGREEMENT * crossUserAgreement +
            WEIGHTS.USER_RELIABILITY * userReliability +
            WEIGHTS.CONTEXT_QUALITY * contextQuality;

        const trainingWeight = confidenceScore * BASE_TRAINING_WEIGHT;

        const breakdown: ConfidenceBreakdown = {
            modelAgreement,
            crossUserAgreement,
            userReliability,
            contextQuality,
            confidenceScore,
            trainingWeight
        };

        // Persist the score
        await prisma.$transaction([
            // Upsert the detailed breakdown
            prisma.annotationConfidenceScore.upsert({
                where: { annotationId },
                create: {
                    annotationId,
                    modelAgreement,
                    crossUserAgreement,
                    userReliability,
                    contextQuality,
                    confidenceScore,
                    trainingWeight,
                    modelVersion: '1.0.0'
                },
                update: {
                    modelAgreement,
                    crossUserAgreement,
                    userReliability,
                    contextQuality,
                    confidenceScore,
                    trainingWeight,
                    computedAt: new Date()
                }
            }),
            // Write back the confidence to the annotation itself
            prisma.userAnnotation.update({
                where: { id: annotationId },
                data: { confidence: confidenceScore }
            })
        ]);

        console.log(`[ConfidenceScorer] Annotation ${annotationId} scored: ${confidenceScore.toFixed(3)}`);
        return breakdown;
    }

    // ------------------------------------------
    // PUBLIC: Batch score multiple annotations
    // ------------------------------------------

    async batchScore(annotationIds: string[]): Promise<Map<string, ConfidenceBreakdown>> {
        console.log(`[ConfidenceScorer] Batch scoring ${annotationIds.length} annotations`);
        const results = new Map<string, ConfidenceBreakdown>();

        for (const id of annotationIds) {
            try {
                const breakdown = await this.scoreAnnotation(id);
                results.set(id, breakdown);
            } catch (error) {
                console.error(`[ConfidenceScorer] Failed to score ${id}:`, error);
            }
        }

        return results;
    }

    // ------------------------------------------
    // PUBLIC: Re-score all annotations for a media asset
    // ------------------------------------------

    async rescoreForMedia(mediaId: string): Promise<void> {
        const annotations = await prisma.userAnnotation.findMany({
            where: { mediaId },
            select: { id: true }
        });

        if (annotations.length > 0) {
            console.log(`[ConfidenceScorer] Re-scoring ${annotations.length} annotations for media ${mediaId}`);
            await this.batchScore(annotations.map((a: { id: string }) => a.id));
        }
    }

    // ------------------------------------------
    // COMPONENT 1: Model Agreement (0–1)
    // ------------------------------------------

    async computeModelAgreement(
        mediaId: string,
        labelType: string,
        userLabels: string[]
    ): Promise<number> {
        // Find the auto-annotation for this media asset's submission
        const autoAnnotations = await prisma.autoAnnotation.findMany({
            where: {
                submission: {
                    contributor: {
                        submissions: {
                            some: {}
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 1
        });

        // Also check for object detections directly on the media asset
        const objectDetections = await prisma.objectDetection.findMany({
            where: { mediaAssetId: mediaId },
            select: { objectType: true, category: true, confidence: true },
            take: 20
        });

        if (objectDetections.length === 0 && autoAnnotations.length === 0) {
            // No model predictions available — neutral score
            return 0.5;
        }

        // Compare user labels against model detections
        const modelLabels = objectDetections.map((d: { objectType: string }) => d.objectType.toLowerCase());
        const userLabelSet = new Set(userLabels.map(l => l.toLowerCase()));

        let matches = 0;
        let partialMatches = 0;
        let total = Math.max(userLabelSet.size, 1);

        for (const userLabel of userLabelSet) {
            if (modelLabels.includes(userLabel)) {
                matches++;
            } else {
                // Check for partial match (same category)
                const categoryMatch = objectDetections.some((d: { category: string | null; objectType: string }) =>
                    d.category?.toLowerCase() === userLabel ||
                    userLabel.includes(d.objectType.toLowerCase())
                );
                if (categoryMatch) {
                    partialMatches++;
                }
            }
        }

        // Score: exact = 1.0, partial = 0.6, mismatch = 0.2
        const exactScore = matches / total;
        const partialScore = partialMatches / total;
        const mismatchRatio = 1 - exactScore - partialScore;

        return Math.min(1.0,
            exactScore * 1.0 +
            partialScore * 0.6 +
            mismatchRatio * 0.2
        );
    }

    // ------------------------------------------
    // COMPONENT 2: Cross-User Agreement (0–1)
    // ------------------------------------------

    async computeCrossUserAgreement(
        mediaId: string,
        labelType: string,
        excludeAnnotationId?: string
    ): Promise<number> {
        // Get all annotations for the same media + label type
        const annotations = await prisma.userAnnotation.findMany({
            where: {
                mediaId,
                labelType,
                ...(excludeAnnotationId ? { id: { not: excludeAnnotationId } } : {})
            },
            select: { labels: true, userId: true }
        });

        if (annotations.length === 0) {
            // No other annotations — neutral score
            return 0.5;
        }

        // Count label frequency across users
        const labelCounts = new Map<string, number>();
        for (const ann of annotations) {
            for (const label of ann.labels) {
                const key = label.toLowerCase();
                labelCounts.set(key, (labelCounts.get(key) || 0) + 1);
            }
        }

        // Find the max agreement count
        const maxAgreement = Math.max(...labelCounts.values());
        const totalAnnotators = annotations.length + 1; // +1 for current user

        if (maxAgreement >= 3) return 1.0;
        if (maxAgreement >= 2) return 0.7;
        return 0.4; // disagreement
    }

    // ------------------------------------------
    // COMPONENT 3: User Reliability (0–1)
    // ------------------------------------------

    async getUserReliability(userId: string): Promise<number> {
        let profile = await prisma.userReliabilityProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            // Initialize new user at 0.5
            profile = await prisma.userReliabilityProfile.create({
                data: {
                    userId,
                    reliabilityScore: RELIABILITY.INITIAL
                }
            });
        }

        return profile.reliabilityScore;
    }

    // ------------------------------------------
    // COMPONENT 4: Context Quality (0–1)
    // ------------------------------------------

    async computeContextQuality(mediaId: string): Promise<number> {
        // Pull from existing CompositeQualityScore
        const quality = await prisma.compositeQualityScore.findUnique({
            where: { mediaAssetId: mediaId }
        });

        if (!quality) {
            // No quality data — neutral
            return 0.5;
        }

        // Normalize the 0-100 scores to 0-1, weighted by relevance
        const clarity = quality.clarityScore / 100;
        const stability = quality.stabilityScore / 100;
        const overall = quality.overallScore / 100;

        // Context quality = blend of clarity, stability, overall
        return Math.min(1.0,
            clarity * 0.4 +
            stability * 0.4 +
            overall * 0.2
        );
    }

    // ------------------------------------------
    // PUBLIC: Update User Reliability
    // ------------------------------------------

    async updateUserReliability(userId: string, update: ReliabilityUpdate): Promise<number> {
        let profile = await prisma.userReliabilityProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            profile = await prisma.userReliabilityProfile.create({
                data: {
                    userId,
                    reliabilityScore: RELIABILITY.INITIAL
                }
            });
        }

        let newScore = profile.reliabilityScore;
        const updates: Record<string, any> = {
            totalAnnotations: { increment: 1 }
        };

        if (update.matchedConsensus) {
            // Positive: matched consensus
            newScore += RELIABILITY.INCREMENT;
            updates.consensusMatches = { increment: 1 };
        } else {
            // Negative: mismatched consensus
            newScore -= RELIABILITY.DECREMENT;
            updates.consensusMismatches = { increment: 1 };
        }

        // Fast-but-wrong penalty
        if (
            !update.matchedConsensus &&
            update.annotationTimeMs != null &&
            update.annotationTimeMs < RELIABILITY.FAST_WRONG_THRESHOLD_MS
        ) {
            newScore -= RELIABILITY.FAST_WRONG_PENALTY;
            updates.fastWrongPenalties = { increment: 1 };
        }

        // Clamp
        newScore = Math.max(RELIABILITY.MIN, Math.min(RELIABILITY.MAX, newScore));

        // Compute XP multiplier from reliability
        const xpMultiplier = newScore < XP.THROTTLE_THRESHOLD
            ? XP.THROTTLE_CAP
            : Math.min(1.0, newScore / RELIABILITY.MAX);

        // Update rolling average annotation time
        if (update.annotationTimeMs != null) {
            const currentAvg = profile.avgAnnotationTimeMs || update.annotationTimeMs;
            const newAvg = currentAvg * 0.9 + update.annotationTimeMs * 0.1; // EMA
            updates.avgAnnotationTimeMs = newAvg;
        }

        updates.reliabilityScore = newScore;
        updates.xpMultiplier = xpMultiplier;

        await prisma.userReliabilityProfile.update({
            where: { userId },
            data: updates
        });

        console.log(`[ConfidenceScorer] User ${userId} reliability: ${newScore.toFixed(3)} (multiplier: ${xpMultiplier.toFixed(2)})`);
        return newScore;
    }

    // ------------------------------------------
    // PUBLIC: Compute XP for an annotation
    // ------------------------------------------

    async computeAnnotationXP(annotationId: string): Promise<number> {
        const score = await prisma.annotationConfidenceScore.findUnique({
            where: { annotationId },
            include: { annotation: true }
        });

        if (!score) return 0;

        const profile = await prisma.userReliabilityProfile.findUnique({
            where: { userId: score.annotation.userId }
        });

        const xpMultiplier = profile?.xpMultiplier ?? 1.0;
        const xp = XP.BASE_PER_ANNOTATION * score.confidenceScore * xpMultiplier;

        // Record XP in earnings ledger
        await prisma.earningsLedger.create({
            data: {
                userId: score.annotation.userId,
                mediaId: score.annotation.mediaId,
                eventType: 'annotation_xp',
                amount: xp,
                currency: 'XP'
            }
        });

        // Update total XP on profile
        if (profile) {
            await prisma.userReliabilityProfile.update({
                where: { userId: score.annotation.userId },
                data: { totalXpEarned: { increment: xp } }
            });
        }

        console.log(`[ConfidenceScorer] Annotation ${annotationId} earned ${xp.toFixed(1)} XP`);
        return xp;
    }

    // ------------------------------------------
    // PUBLIC: Get confidence leaderboard
    // ------------------------------------------

    async getLeaderboard(limit: number = 20): Promise<Array<{
        userId: string;
        reliabilityScore: number;
        totalAnnotations: number;
        totalXpEarned: number;
        xpMultiplier: number;
    }>> {
        const profiles = await prisma.userReliabilityProfile.findMany({
            orderBy: { totalXpEarned: 'desc' },
            take: limit,
            select: {
                userId: true,
                reliabilityScore: true,
                totalAnnotations: true,
                totalXpEarned: true,
                xpMultiplier: true
            }
        });

        return profiles;
    }
}

// Singleton
export const confidenceScorer = new ConfidenceScorer();
