/**
 * Datasets API Routes
 * Dataset Access API - primary data access endpoint
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireScope, type AuthenticatedRequest } from '../middleware/auth.js';

export const datasetsRouter = Router();

// List all available datasets
datasetsRouter.get('/', requireScope('datasets:read'), async (req: Request, res: Response) => {
    const { mediaType, limit = '20', offset = '0' } = req.query;

    try {
        const where: any = {};
        if (mediaType) where.mediaType = String(mediaType);

        const [datasets, total] = await Promise.all([
            prisma.dataset.findMany({
                where,
                take: Number(limit),
                skip: Number(offset),
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { mediaAssets: true },
                    },
                },
            }),
            prisma.dataset.count({ where }),
        ]);

        res.json({
            data: datasets,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + Number(limit) < total,
            },
        });
    } catch (error) {
        console.error('Error fetching datasets:', error);
        res.status(500).json({ error: 'Failed to fetch datasets' });
    }
});

// Get a specific dataset by ID
datasetsRouter.get('/:datasetId', requireScope('datasets:read'), async (req: Request, res: Response) => {
    const { datasetId } = req.params;

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id: datasetId },
            include: {
                _count: {
                    select: { mediaAssets: true },
                },
                governanceProfile: true,
                qualityProfile: true,
            },
        });

        if (!dataset) {
            res.status(404).json({ error: 'Not Found', message: `Dataset '${datasetId}' not found` });
            return;
        }

        res.json({ data: dataset });
    } catch (error) {
        console.error('Error fetching dataset:', error);
        res.status(500).json({ error: 'Failed to fetch dataset' });
    }
});

// Get dataset statistics
datasetsRouter.get('/:datasetId/stats', requireScope('datasets:read'), async (req: Request, res: Response) => {
    const { datasetId } = req.params;

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id: datasetId },
            include: {
                _count: {
                    select: { mediaAssets: true },
                },
                mediaAssets: {
                    select: { sizeBytes: true, duration: true },
                },
            },
        });

        if (!dataset) {
            res.status(404).json({ error: 'Not Found' });
            return;
        }

        const totalSize = dataset.mediaAssets.reduce((sum: number, m: any) => sum + Number(m.sizeBytes), 0);
        const totalDuration = dataset.mediaAssets.reduce((sum: number, m: any) => sum + (m.duration || 0), 0);

        res.json({
            data: {
                datasetId,
                totalAssets: dataset._count.mediaAssets,
                totalSize,
                totalDuration,
                lastUpdated: dataset.updatedAt,
            },
        });
    } catch (error) {
        console.error('Error fetching dataset stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

/**
 * Create a new dataset
 * POST /api/datasets
 */
datasetsRouter.post('/', requireScope('datasets:write'), async (req: AuthenticatedRequest, res: Response) => {
    const { name, mediaType, description, annotationSchema } = req.body;

    if (!name || !mediaType) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'name and mediaType are required',
        });
        return;
    }

    try {
        const dataset = await prisma.dataset.create({
            data: {
                name,
                mediaType,
                version: '1.0.0',
                description: description || null,
                annotationSchema: annotationSchema || {},
                ragEnabled: false
            },
        });

        res.status(201).json({
            data: dataset,
            message: 'Dataset created successfully',
        });
    } catch (error: any) {
        console.error('Error creating dataset:', error);
        res.status(500).json({ error: 'Failed to create dataset' });
    }
});

/**
 * Update a dataset
 * PATCH /api/datasets/:datasetId
 */
datasetsRouter.patch('/:datasetId', requireScope('datasets:write'), async (req: Request, res: Response) => {
    const { datasetId } = req.params;
    const { name, description, status, version } = req.body;

    try {
        const dataset = await prisma.dataset.update({
            where: { id: datasetId },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(status && { status: status.toUpperCase() }),
                ...(version && { version }),
            },
        });

        res.json({ data: dataset });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Dataset not found' });
            return;
        }
        console.error('Error updating dataset:', error);
        res.status(500).json({ error: 'Failed to update dataset' });
    }
});

/**
 * Delete a dataset
 * DELETE /api/datasets/:datasetId
 */
datasetsRouter.delete('/:datasetId', requireScope('datasets:write'), async (req: Request, res: Response) => {
    const { datasetId } = req.params;

    try {
        await prisma.dataset.delete({ where: { id: datasetId } });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Dataset not found' });
            return;
        }
        console.error('Error deleting dataset:', error);
        res.status(500).json({ error: 'Failed to delete dataset' });
    }
});
