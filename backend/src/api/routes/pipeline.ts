/**
 * Harbor ML - Pipeline API Routes
 * Endpoints for triggering and managing annotation pipelines
 */

import { Router, Request, Response } from 'express';
import { requireScope } from '../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { PipelineTriggerSchema } from '../../lib/upload-schemas.js';
import { preprocessingOrchestrator } from '../../services/preprocessing/orchestrator.js';
import { v4 as uuidv4 } from 'uuid';

export const pipelineRouter = Router();

/**
 * Trigger annotation pipeline for an asset
 * POST /api/pipeline/trigger
 */
pipelineRouter.post('/trigger', requireScope('pipeline:write'), async (req: Request, res: Response) => {
    try {
        const parsed = PipelineTriggerSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({
                error: 'Validation Error',
                details: parsed.error.errors,
            });
            return;
        }

        const { media_asset_id, pipeline_type, skip_preprocessing, priority } = parsed.data;

        // Verify asset exists
        const asset = await prisma.mediaAsset.findUnique({
            where: { id: media_asset_id },
            select: { id: true, type: true, storagePointer: true },
        });

        if (!asset) {
            res.status(404).json({ error: 'Media asset not found' });
            return;
        }

        // Create pipeline job
        const pipelineJob = await prisma.annotationPipelineJob.create({
            data: {
                mediaAssetId: media_asset_id,
                pipelineType: pipeline_type,
                status: 'QUEUED',
                currentStage: skip_preprocessing ? 'annotation' : 'preprocessing',
            },
        });

        // Trigger preprocessing if not skipped
        if (!skip_preprocessing && asset.storagePointer) {
            const mediaType = asset.type as 'video' | 'audio' | 'multimodal';
            await preprocessingOrchestrator.createFullPipeline({
                mediaAssetId: media_asset_id,
                mediaType,
                inputPath: asset.storagePointer,
                priority,
            });
        }

        res.status(201).json({
            data: {
                jobId: pipelineJob.id,
                status: pipelineJob.status,
                pipelineType: pipeline_type,
                message: 'Pipeline triggered successfully',
            },
        });
    } catch (error) {
        console.error('Error triggering pipeline:', error);
        res.status(500).json({ error: 'Failed to trigger pipeline' });
    }
});

/**
 * Get pipeline job status
 * GET /api/pipeline/status/:jobId
 */
pipelineRouter.get('/status/:jobId', requireScope('pipeline:read'), async (req: Request, res: Response) => {
    const { jobId } = req.params;

    try {
        const job = await prisma.annotationPipelineJob.findUnique({
            where: { id: jobId },
            include: {
                mediaAsset: {
                    select: { id: true, filename: true, type: true },
                },
            },
        });

        if (!job) {
            res.status(404).json({ error: 'Pipeline job not found' });
            return;
        }

        res.json({
            data: {
                id: job.id,
                status: job.status,
                progress: job.progress,
                pipelineType: job.pipelineType,
                currentStage: job.currentStage,
                stagesCompleted: job.stagesCompleted,
                annotationCounts: job.annotationCounts,
                mediaAsset: job.mediaAsset,
                startedAt: job.startedAt,
                completedAt: job.completedAt,
                errorMessage: job.errorMessage,
            },
        });
    } catch (error) {
        console.error('Error fetching job status:', error);
        res.status(500).json({ error: 'Failed to fetch job status' });
    }
});

/**
 * List pipeline jobs
 * GET /api/pipeline/jobs
 */
pipelineRouter.get('/jobs', requireScope('pipeline:read'), async (req: Request, res: Response) => {
    const { status, pipelineType, limit = '20', offset = '0' } = req.query;

    try {
        const where: any = {};
        if (status) where.status = String(status);
        if (pipelineType) where.pipelineType = String(pipelineType);

        const [jobs, total] = await Promise.all([
            prisma.annotationPipelineJob.findMany({
                where,
                take: Number(limit),
                skip: Number(offset),
                orderBy: { createdAt: 'desc' },
                include: {
                    mediaAsset: {
                        select: { id: true, filename: true, type: true },
                    },
                },
            }),
            prisma.annotationPipelineJob.count({ where }),
        ]);

        res.json({
            data: jobs.map((job: typeof jobs[number]) => ({
                id: job.id,
                status: job.status,
                progress: job.progress,
                pipelineType: job.pipelineType,
                currentStage: job.currentStage,
                mediaAsset: job.mediaAsset,
                createdAt: job.createdAt,
            })),
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + Number(limit) < total,
            },
        });
    } catch (error) {
        console.error('Error listing jobs:', error);
        res.status(500).json({ error: 'Failed to list jobs' });
    }
});

/**
 * Cancel a pipeline job
 * POST /api/pipeline/:jobId/cancel
 */
pipelineRouter.post('/:jobId/cancel', requireScope('pipeline:write'), async (req: Request, res: Response) => {
    const { jobId } = req.params;

    try {
        const job = await prisma.annotationPipelineJob.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            res.status(404).json({ error: 'Pipeline job not found' });
            return;
        }

        if (job.status === 'COMPLETED' || job.status === 'FAILED' || job.status === 'CANCELLED') {
            res.status(400).json({ error: `Cannot cancel job with status: ${job.status}` });
            return;
        }

        const updated = await prisma.annotationPipelineJob.update({
            where: { id: jobId },
            data: {
                status: 'CANCELLED',
                completedAt: new Date(),
            },
        });

        res.json({
            data: {
                id: updated.id,
                status: updated.status,
                message: 'Pipeline job cancelled',
            },
        });
    } catch (error) {
        console.error('Error cancelling job:', error);
        res.status(500).json({ error: 'Failed to cancel job' });
    }
});

/**
 * Retry a failed pipeline job
 * POST /api/pipeline/:jobId/retry
 */
pipelineRouter.post('/:jobId/retry', requireScope('pipeline:write'), async (req: Request, res: Response) => {
    const { jobId } = req.params;

    try {
        const job = await prisma.annotationPipelineJob.findUnique({
            where: { id: jobId },
            include: {
                mediaAsset: {
                    select: { id: true, type: true, storagePointer: true },
                },
            },
        });

        if (!job) {
            res.status(404).json({ error: 'Pipeline job not found' });
            return;
        }

        if (job.status !== 'FAILED') {
            res.status(400).json({ error: `Can only retry failed jobs. Current status: ${job.status}` });
            return;
        }

        if (job.retryCount >= job.maxRetries) {
            res.status(400).json({ error: `Max retries (${job.maxRetries}) exceeded` });
            return;
        }

        const updated = await prisma.annotationPipelineJob.update({
            where: { id: jobId },
            data: {
                status: 'QUEUED',
                retryCount: { increment: 1 },
                errorMessage: null,
                currentStage: 'preprocessing',
            },
        });

        res.json({
            data: {
                id: updated.id,
                status: updated.status,
                retryCount: updated.retryCount,
                message: 'Pipeline job queued for retry',
            },
        });
    } catch (error) {
        console.error('Error retrying job:', error);
        res.status(500).json({ error: 'Failed to retry job' });
    }
});

/**
 * Get pipeline statistics
 * GET /api/pipeline/stats
 */
pipelineRouter.get('/stats', requireScope('pipeline:read'), async (req: Request, res: Response) => {
    try {
        const [byStatus, byType, recent] = await Promise.all([
            prisma.annotationPipelineJob.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
            prisma.annotationPipelineJob.groupBy({
                by: ['pipelineType'],
                _count: { id: true },
            }),
            prisma.annotationPipelineJob.count({
                where: {
                    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                },
            }),
        ]);

        res.json({
            data: {
                byStatus: Object.fromEntries(byStatus.map((s: typeof byStatus[number]) => [s.status, s._count.id])),
                byType: Object.fromEntries(byType.map((t: typeof byType[number]) => [t.pipelineType, t._count.id])),
                last24Hours: recent,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});
