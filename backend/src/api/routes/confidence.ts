/**
 * Confidence Scoring API Routes
 * Endpoints for annotation confidence scores, user reliability, and leaderboard
 */

import { Router, Request, Response } from 'express';
import { requireScope } from '../middleware/auth.js';
import { confidenceScorer } from '../../services/annotation/confidence-scorer.js';
import { prisma } from '../../lib/prisma.js';

export const confidenceRouter = Router();

/**
 * Get confidence breakdown for an annotation
 * GET /api/confidence/annotations/:annotationId
 */
confidenceRouter.get('/annotations/:annotationId', requireScope('annotation:read'), async (req: Request, res: Response) => {
    const { annotationId } = req.params;

    try {
        const score = await prisma.annotationConfidenceScore.findUnique({
            where: { annotationId },
            include: {
                annotation: {
                    select: {
                        labelType: true,
                        labels: true,
                        mediaId: true,
                        userId: true,
                        timestamp: true
                    }
                }
            }
        });

        if (!score) {
            res.status(404).json({ error: 'Confidence score not found for this annotation' });
            return;
        }

        res.json({
            data: {
                annotationId,
                components: {
                    modelAgreement: { value: score.modelAgreement, weight: 0.4 },
                    crossUserAgreement: { value: score.crossUserAgreement, weight: 0.3 },
                    userReliability: { value: score.userReliability, weight: 0.2 },
                    contextQuality: { value: score.contextQuality, weight: 0.1 }
                },
                confidenceScore: score.confidenceScore,
                trainingWeight: score.trainingWeight,
                computedAt: score.computedAt,
                annotation: score.annotation
            }
        });
    } catch (error) {
        console.error('Error fetching confidence score:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Trigger scoring for an annotation
 * POST /api/confidence/annotations/:annotationId/score
 */
confidenceRouter.post('/annotations/:annotationId/score', requireScope('annotation:write'), async (req: Request, res: Response) => {
    const { annotationId } = req.params;

    try {
        const breakdown = await confidenceScorer.scoreAnnotation(annotationId);
        res.json({
            data: breakdown,
            message: 'Annotation scored successfully'
        });
    } catch (error: any) {
        if (error.message?.includes('not found')) {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Error scoring annotation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

/**
 * Batch score multiple annotations
 * POST /api/confidence/batch-score
 */
confidenceRouter.post('/batch-score', requireScope('annotation:write'), async (req: Request, res: Response) => {
    const { annotationIds } = req.body;

    if (!annotationIds || !Array.isArray(annotationIds)) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'annotationIds array is required'
        });
        return;
    }

    try {
        const results = await confidenceScorer.batchScore(annotationIds);
        const data = Object.fromEntries(results);
        res.json({
            data,
            message: `Scored ${results.size} annotations`
        });
    } catch (error) {
        console.error('Error batch scoring:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Get user reliability profile
 * GET /api/confidence/users/:userId/reliability
 */
confidenceRouter.get('/users/:userId/reliability', requireScope('annotation:read'), async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const profile = await prisma.userReliabilityProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!profile) {
            res.status(404).json({ error: 'No reliability profile found for this user' });
            return;
        }

        res.json({
            data: {
                userId: profile.userId,
                reliabilityScore: profile.reliabilityScore,
                xpMultiplier: profile.xpMultiplier,
                totalAnnotations: profile.totalAnnotations,
                consensusMatches: profile.consensusMatches,
                consensusMismatches: profile.consensusMismatches,
                avgAnnotationTimeMs: profile.avgAnnotationTimeMs,
                fastWrongPenalties: profile.fastWrongPenalties,
                totalXpEarned: profile.totalXpEarned,
                matchRate: profile.totalAnnotations > 0
                    ? (profile.consensusMatches / profile.totalAnnotations * 100).toFixed(1) + '%'
                    : 'N/A',
                user: profile.user
            }
        });
    } catch (error) {
        console.error('Error fetching reliability profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Confidence-weighted leaderboard
 * GET /api/confidence/leaderboard
 */
confidenceRouter.get('/leaderboard', async (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    try {
        const leaderboard = await confidenceScorer.getLeaderboard(limit);
        res.json({ data: leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Re-score all annotations for a media asset
 * POST /api/confidence/media/:mediaId/rescore
 */
confidenceRouter.post('/media/:mediaId/rescore', requireScope('annotation:write'), async (req: Request, res: Response) => {
    const { mediaId } = req.params;

    try {
        await confidenceScorer.rescoreForMedia(mediaId);
        res.json({ message: `Re-scored all annotations for media ${mediaId}` });
    } catch (error) {
        console.error('Error re-scoring media annotations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
