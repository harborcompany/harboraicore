/**
 * Sandbox API Routes
 * Trial/demo access with scoped API keys
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireScope, type AuthenticatedRequest } from '../middleware/auth.js';
import crypto from 'crypto';

export const sandboxRouter = Router();

/**
 * Create a sandbox account for trial access
 * POST /api/sandbox/create
 */
sandboxRouter.post('/create', requireScope('sandbox:write'), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const {
        apiKeyScope = ['query', 'rag'],
        rateLimit = 100,
        durationDays = 30,
    } = req.body;

    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        // Check if user already has a sandbox account
        const existing = await prisma.sandboxAccount.findUnique({
            where: { userId },
        });

        if (existing && existing.isActive) {
            res.status(409).json({
                error: 'Conflict',
                message: 'User already has an active sandbox account',
                data: {
                    expiresAt: existing.expiresAt,
                    isActive: existing.isActive,
                },
            });
            return;
        }

        // Fetch anchor datasets to preload
        const anchorDatasets = await prisma.dataset.findMany({
            where: { isAnchor: true },
            select: { id: true },
        });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);

        const sandboxAccount = await prisma.sandboxAccount.upsert({
            where: { userId },
            update: {
                apiKeyScope,
                rateLimit,
                datasetsPreloaded: anchorDatasets.map((d: any) => d.id),
                expiresAt,
                isActive: true,
            },
            create: {
                userId,
                apiKeyScope,
                rateLimit,
                datasetsPreloaded: anchorDatasets.map((d: any) => d.id),
                expiresAt,
                isActive: true,
            },
        });

        res.status(201).json({
            data: {
                id: sandboxAccount.id,
                apiKeyScope: sandboxAccount.apiKeyScope,
                rateLimit: sandboxAccount.rateLimit,
                datasetsPreloaded: sandboxAccount.datasetsPreloaded,
                expiresAt: sandboxAccount.expiresAt,
                daysRemaining: durationDays,
            },
            message: 'Sandbox account created successfully',
        });
    } catch (error) {
        console.error('Error creating sandbox account:', error);
        res.status(500).json({ error: 'Failed to create sandbox account' });
    }
});

/**
 * Get current sandbox account status
 * GET /api/sandbox/status
 */
sandboxRouter.get('/status', requireScope('sandbox:read'), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const sandboxAccount = await prisma.sandboxAccount.findUnique({
            where: { userId },
        });

        if (!sandboxAccount) {
            res.status(404).json({
                error: 'Not Found',
                message: 'No sandbox account found. Create one via POST /api/sandbox/create',
            });
            return;
        }

        const now = new Date();
        const daysRemaining = Math.max(
            0,
            Math.ceil((sandboxAccount.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        );
        const isExpired = now > sandboxAccount.expiresAt;

        res.json({
            data: {
                id: sandboxAccount.id,
                apiKeyScope: sandboxAccount.apiKeyScope,
                rateLimit: sandboxAccount.rateLimit,
                datasetsPreloaded: sandboxAccount.datasetsPreloaded,
                expiresAt: sandboxAccount.expiresAt,
                isActive: sandboxAccount.isActive && !isExpired,
                isExpired,
                daysRemaining,
            },
        });
    } catch (error) {
        console.error('Error fetching sandbox status:', error);
        res.status(500).json({ error: 'Failed to fetch sandbox status' });
    }
});

/**
 * Extend sandbox account
 * POST /api/sandbox/extend
 */
sandboxRouter.post('/extend', requireScope('sandbox:write'), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { additionalDays = 14 } = req.body;

    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const existing = await prisma.sandboxAccount.findUnique({
            where: { userId },
        });

        if (!existing) {
            res.status(404).json({ error: 'No sandbox account found' });
            return;
        }

        const newExpiry = new Date(existing.expiresAt);
        newExpiry.setDate(newExpiry.getDate() + additionalDays);

        const updated = await prisma.sandboxAccount.update({
            where: { userId },
            data: {
                expiresAt: newExpiry,
                isActive: true,
            },
        });

        res.json({
            data: updated,
            message: `Sandbox extended by ${additionalDays} days`,
        });
    } catch (error) {
        console.error('Error extending sandbox:', error);
        res.status(500).json({ error: 'Failed to extend sandbox account' });
    }
});

/**
 * List quickstart projects
 * GET /api/sandbox/quickstart
 */
sandboxRouter.get('/quickstart', async (req: Request, res: Response) => {
    const { type, difficulty } = req.query;

    try {
        const where: any = {};
        if (type) where.type = String(type);
        if (difficulty) where.difficulty = String(difficulty);

        const projects = await prisma.quickstartProject.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            data: projects,
            total: projects.length,
        });
    } catch (error) {
        console.error('Error fetching quickstart projects:', error);
        res.status(500).json({ error: 'Failed to fetch quickstart projects' });
    }
});

/**
 * Get a specific quickstart project
 * GET /api/sandbox/quickstart/:projectId
 */
sandboxRouter.get('/quickstart/:projectId', async (req: Request, res: Response) => {
    const { projectId } = req.params;

    try {
        const project = await prisma.quickstartProject.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            res.status(404).json({ error: 'Quickstart project not found' });
            return;
        }

        res.json({ data: project });
    } catch (error) {
        console.error('Error fetching quickstart project:', error);
        res.status(500).json({ error: 'Failed to fetch quickstart project' });
    }
});

/**
 * Create a quickstart project (admin)
 * POST /api/sandbox/quickstart
 */
sandboxRouter.post('/quickstart', requireScope('sandbox:admin'), async (req: Request, res: Response) => {
    const { name, slug, description, type, datasetId, steps, difficulty } = req.body;

    if (!name || !slug || !type) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'name, slug, and type are required',
        });
        return;
    }

    try {
        const project = await prisma.quickstartProject.create({
            data: {
                name,
                slug,
                description: description || null,
                type,
                datasetId: datasetId || null,
                steps: steps || ['authenticate', 'query', 'evaluate'],
                difficulty: difficulty || 'beginner',
            },
        });

        res.status(201).json({
            data: project,
            message: 'Quickstart project created successfully',
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'Slug already exists' });
            return;
        }
        console.error('Error creating quickstart project:', error);
        res.status(500).json({ error: 'Failed to create quickstart project' });
    }
});
