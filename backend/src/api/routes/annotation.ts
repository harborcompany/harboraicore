/**
 * Annotation API Routes
 * Frame-accurate annotation and curation endpoints
 */

import { Router, Request, Response } from 'express';
import { requireScope } from '../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

export const annotationRouter = Router();

// Get annotations for an asset
annotationRouter.get('/:assetId', requireScope('annotation:read'), async (req: Request, res: Response) => {
    const { assetId } = req.params;
    const { labelType, status, limit = 100, offset = 0 } = req.query;

    try {
        const where: any = { mediaId: assetId };

        if (labelType) where.labelType = labelType as string;
        if (status) where.status = status as string;

        const [annotations, total] = await Promise.all([
            prisma.userAnnotation.findMany({
                where,
                skip: Number(offset),
                take: Number(limit),
                orderBy: { timestamp: 'desc' },
            }),
            prisma.userAnnotation.count({ where }),
        ]);

        res.json({
            data: annotations,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
            },
        });
    } catch (error) {
        console.error('Error fetching annotations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create new annotation
annotationRouter.post('/', requireScope('annotation:write'), async (req: Request, res: Response) => {
    const {
        assetId,
        labelType,
        startTime,
        endTime,
        labels,
        boundingBox,
        confidence = 1.0,
    } = req.body;

    if (!assetId || !labelType) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'assetId and labelType are required',
        });
        return;
    }

    try {
        const annotation = await prisma.userAnnotation.create({
            data: {
                mediaId: assetId,
                labelType,
                startTime: startTime ? Number(startTime) : null,
                endTime: endTime ? Number(endTime) : null,
                labels: labels || [],
                boundingBox: boundingBox || null,
                confidence: Number(confidence),
                status: 'pending',
                userId: (req as any).user?.id || 'user_demo',
            },
        });

        res.status(201).json({
            data: annotation,
            message: 'Annotation created successfully',
        });
    } catch (error) {
        console.error('Error creating annotation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update an annotation
annotationRouter.patch('/:annotationId', requireScope('annotation:write'), async (req: Request, res: Response) => {
    const { annotationId } = req.params;
    const updates = req.body;

    try {
        const data: any = {};
        if (updates.labelType) data.labelType = updates.labelType;
        if (updates.startTime !== undefined) data.startTime = Number(updates.startTime);
        if (updates.endTime !== undefined) data.endTime = Number(updates.endTime);
        if (updates.labels) data.labels = updates.labels;
        if (updates.boundingBox !== undefined) data.boundingBox = updates.boundingBox;
        if (updates.status) data.status = updates.status;
        if (updates.confidence !== undefined) data.confidence = Number(updates.confidence);

        const annotation = await prisma.userAnnotation.update({
            where: { id: annotationId },
            data,
        });

        res.json({ data: annotation });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Not Found', message: `Annotation '${annotationId}' not found` });
        } else {
            console.error('Error updating annotation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

/**
 * Submit annotation for review
 * POST /api/annotation/:annotationId/review
 */
annotationRouter.post('/:annotationId/review', requireScope('annotation:write'), async (req: Request, res: Response) => {
    const { annotationId } = req.params;
    const { action, notes } = req.body;

    if (!action || !['approve', 'reject', 'request_changes'].includes(action)) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'action must be one of: approve, reject, request_changes',
        });
        return;
    }

    try {
        const status = action === 'approve' ? 'approved' :
            action === 'reject' ? 'rejected' : 'in_review';

        const annotation = await prisma.userAnnotation.update({
            where: { id: annotationId },
            data: {
                status,
                // In a full implementation, you might want a separate Review table
                // but for now we'll just update the status
            },
        });

        res.json({
            data: annotation,
            message: `Annotation ${action}d`,
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Annotation not found' });
        } else {
            console.error('Error reviewing annotation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

/**
 * Get annotation types
 * GET /api/annotation/meta/types
 */
annotationRouter.get('/meta/types', async (req: Request, res: Response) => {
    res.json({
        data: {
            types: [
                { id: 'scene', name: 'Scene Detection', description: 'Scene boundaries and transitions' },
                { id: 'action', name: 'Action Recognition', description: 'Human actions and activities' },
                { id: 'object', name: 'Object Detection', description: 'Object localization and classification' },
                { id: 'speech', name: 'Speech Transcription', description: 'Speech-to-text transcription' },
                { id: 'emotion', name: 'Emotion Recognition', description: 'Emotion classification in speech/video' },
                { id: 'speaker', name: 'Speaker Identification', description: 'Speaker diarization and ID' },
                { id: 'event', name: 'Event Detection', description: 'Temporal event detection' },
                { id: 'segment', name: 'Segmentation', description: 'Temporal or spatial segmentation' },
            ],
        },
    });
});

/**
 * Bulk create annotations
 * POST /api/annotation/bulk
 */
annotationRouter.post('/bulk', requireScope('annotation:write'), async (req: Request, res: Response) => {
    const { annotations } = req.body;

    if (!annotations || !Array.isArray(annotations)) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'annotations array is required',
        });
        return;
    }

    try {
        const creatorId = (req as any).user?.id || 'user_demo';

        const preparedAnnotations = annotations.map(ann => ({
            mediaId: ann.assetId,
            labelType: ann.type,
            startTime: ann.startTime ? Number(ann.startTime) : null,
            endTime: ann.endTime ? Number(ann.endTime) : null,
            labels: ann.labels || [],
            boundingBox: ann.boundingBox || null,
            confidence: Number(ann.confidence || 1.0),
            status: 'pending',
            userId: creatorId,
        }));

        // Prisma doesn't return created records for createMany in some DBs, 
        // but it does for PostgreSQL. However, for simplicity and compatibility:
        const result = await prisma.userAnnotation.createMany({
            data: preparedAnnotations,
        });

        res.status(201).json({
            data: {
                created: result.count,
                message: `${result.count} annotations created successfully`,
            },
        });
    } catch (error) {
        console.error('Error bulk creating annotations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
