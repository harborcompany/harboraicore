/**
 * Harbor ML - Staging Bin API Routes
 * HITL Quality Pipeline: Stage 1 - QA Review
 */

import { Router, Request, Response } from 'express';
import { requireScope } from '../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { annotationOrchestrator } from '../../services/annotation/orchestrator.js';
import { z } from 'zod';

export const stagingRouter = Router();

// Validation schemas
const RejectSchema = z.object({
    reason: z.enum(['blur', 'poor_lighting', 'off_topic', 'audio_issue', 'duplicate', 'other']),
    notes: z.string().optional(),
});

const ApproveSchema = z.object({
    qualityScore: z.number().min(0).max(1).optional(),
    notes: z.string().optional(),
});

/**
 * List pending videos in staging bin
 * GET /api/staging/pending
 */
stagingRouter.get('/pending', requireScope('staging:read'), async (req: Request, res: Response) => {
    const { limit = '20', offset = '0', status = 'PENDING' } = req.query;

    try {
        const [entries, total] = await Promise.all([
            prisma.stagingBinEntry.findMany({
                where: { status: status as any },
                take: Number(limit),
                skip: Number(offset),
                orderBy: { createdAt: 'asc' }, // FIFO
                include: {
                    mediaAsset: {
                        select: {
                            id: true,
                            filename: true,
                            type: true,
                            duration: true,
                            storagePointer: true,
                        },
                    },
                },
            }),
            prisma.stagingBinEntry.count({ where: { status: status as any } }),
        ]);

        res.json({
            data: entries,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + Number(limit) < total,
            },
        });
    } catch (error) {
        console.error('Error listing staging bin:', error);
        res.status(500).json({ error: 'Failed to list staging bin' });
    }
});

/**
 * Approve video for annotation
 * POST /api/staging/:id/approve
 */
stagingRouter.post('/:id/approve', requireScope('staging:write'), async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    try {
        const parsed = ApproveSchema.safeParse(req.body);

        const entry = await prisma.stagingBinEntry.findUnique({
            where: { id },
            include: { mediaAsset: true },
        });

        if (!entry) {
            res.status(404).json({ error: 'Staging entry not found' });
            return;
        }

        if (entry.status !== 'PENDING') {
            res.status(400).json({ error: `Cannot approve entry with status: ${entry.status}` });
            return;
        }

        const updated = await prisma.stagingBinEntry.update({
            where: { id },
            data: {
                status: 'APPROVED',
                reviewerId: userId,
                reviewedAt: new Date(),
                qualityScore: parsed.success ? parsed.data.qualityScore : undefined,
                reviewNotes: parsed.success ? parsed.data.notes : undefined,
            },
        });

        res.json({
            data: {
                id: updated.id,
                status: updated.status,
                message: 'Video approved for annotation',
            },
        });
    } catch (error) {
        console.error('Error approving entry:', error);
        res.status(500).json({ error: 'Failed to approve entry' });
    }
});

/**
 * Reject video
 * POST /api/staging/:id/reject
 */
stagingRouter.post('/:id/reject', requireScope('staging:write'), async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    try {
        const parsed = RejectSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: 'Validation error', details: parsed.error.errors });
            return;
        }

        const entry = await prisma.stagingBinEntry.findUnique({ where: { id } });

        if (!entry) {
            res.status(404).json({ error: 'Staging entry not found' });
            return;
        }

        if (entry.status !== 'PENDING') {
            res.status(400).json({ error: `Cannot reject entry with status: ${entry.status}` });
            return;
        }

        const updated = await prisma.stagingBinEntry.update({
            where: { id },
            data: {
                status: 'REJECTED',
                reviewerId: userId,
                reviewedAt: new Date(),
                rejectionReason: parsed.data.reason,
                reviewNotes: parsed.data.notes,
            },
        });

        res.json({
            data: {
                id: updated.id,
                status: updated.status,
                reason: updated.rejectionReason,
                message: 'Video rejected',
            },
        });
    } catch (error) {
        console.error('Error rejecting entry:', error);
        res.status(500).json({ error: 'Failed to reject entry' });
    }
});

/**
 * Trigger annotation for approved video
 * POST /api/staging/:id/annotate
 * This is the "Annotate" button
 */
stagingRouter.post('/:id/annotate', requireScope('staging:write'), async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const entry = await prisma.stagingBinEntry.findUnique({
            where: { id },
            include: { mediaAsset: true },
        });

        if (!entry) {
            res.status(404).json({ error: 'Staging entry not found' });
            return;
        }

        if (entry.status !== 'APPROVED') {
            res.status(400).json({ error: `Can only annotate approved entries. Current status: ${entry.status}` });
            return;
        }

        // Create annotation pipeline job
        const pipelineJob = await prisma.annotationPipelineJob.create({
            data: {
                mediaAssetId: entry.mediaAssetId,
                pipelineType: 'lego_video', // Default to lego for now
                status: 'QUEUED',
                currentStage: 'annotation',
            },
        });

        // Update staging entry
        await prisma.stagingBinEntry.update({
            where: { id },
            data: {
                status: 'IN_ANNOTATION',
                annotationJobId: pipelineJob.id,
            },
        });

        // Trigger annotation (async)
        if (entry.mediaAsset.storagePointer) {
            annotationOrchestrator.triggerAnnotation(
                pipelineJob.id,
                entry.mediaAsset.storagePointer,
                'lego_video'
            ).catch(console.error);
        }

        res.status(202).json({
            data: {
                id: entry.id,
                status: 'IN_ANNOTATION',
                jobId: pipelineJob.id,
                message: 'Annotation pipeline triggered',
            },
        });
    } catch (error) {
        console.error('Error triggering annotation:', error);
        res.status(500).json({ error: 'Failed to trigger annotation' });
    }
});

/**
 * Get staging bin statistics
 * GET /api/staging/stats
 */
stagingRouter.get('/stats', requireScope('staging:read'), async (req: Request, res: Response) => {
    try {
        const [byStatus, recent, avgProcessingTime] = await Promise.all([
            prisma.stagingBinEntry.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
            prisma.stagingBinEntry.count({
                where: {
                    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                },
            }),
            prisma.stagingBinEntry.aggregate({
                where: { status: 'COMPLETED', completedAt: { not: null } },
                _avg: {
                    qualityScore: true,
                },
            }),
        ]);

        res.json({
            data: {
                byStatus: Object.fromEntries(byStatus.map((s: any) => [s.status, s._count.id])),
                last24Hours: recent,
                avgQualityScore: avgProcessingTime._avg.qualityScore,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});
