/**
 * Governance API Routes
 * Manage governance profiles for compliance & consent tracking
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireScope, type AuthenticatedRequest } from '../middleware/auth.js';

export const governanceRouter = Router();

/**
 * List all governance profiles
 * GET /api/governance
 */
governanceRouter.get('/', requireScope('governance:read'), async (req: Request, res: Response) => {
    const { limit = '20', offset = '0' } = req.query;

    try {
        const [profiles, total] = await Promise.all([
            prisma.governanceProfile.findMany({
                take: Number(limit),
                skip: Number(offset),
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { datasets: true },
                    },
                },
            }),
            prisma.governanceProfile.count(),
        ]);

        res.json({
            data: profiles,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + Number(limit) < total,
            },
        });
    } catch (error) {
        console.error('Error fetching governance profiles:', error);
        res.status(500).json({ error: 'Failed to fetch governance profiles' });
    }
});

/**
 * Get a specific governance profile
 * GET /api/governance/:profileId
 */
governanceRouter.get('/:profileId', requireScope('governance:read'), async (req: Request, res: Response) => {
    const { profileId } = req.params;

    try {
        const profile = await prisma.governanceProfile.findUnique({
            where: { id: profileId },
            include: {
                datasets: {
                    select: {
                        id: true,
                        name: true,
                        version: true,
                        datasetStatus: true,
                    },
                },
            },
        });

        if (!profile) {
            res.status(404).json({ error: 'Not Found', message: `Governance profile '${profileId}' not found` });
            return;
        }

        res.json({ data: profile });
    } catch (error) {
        console.error('Error fetching governance profile:', error);
        res.status(500).json({ error: 'Failed to fetch governance profile' });
    }
});

/**
 * Create a new governance profile
 * POST /api/governance
 */
governanceRouter.post('/', requireScope('governance:write'), async (req: AuthenticatedRequest, res: Response) => {
    const {
        name,
        consentSource,
        usageRights,
        geographicRestrictions,
        dataRetentionPolicy,
        auditLogEnabled,
        complianceTags,
    } = req.body;

    if (!name || !consentSource) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'name and consentSource are required',
        });
        return;
    }

    try {
        const profile = await prisma.governanceProfile.create({
            data: {
                name,
                consentSource,
                usageRights: usageRights || [],
                geographicRestrictions: geographicRestrictions || [],
                dataRetentionPolicy: dataRetentionPolicy || 'indefinite',
                auditLogEnabled: auditLogEnabled ?? true,
                complianceTags: complianceTags || [],
            },
        });

        res.status(201).json({
            data: profile,
            message: 'Governance profile created successfully',
        });
    } catch (error) {
        console.error('Error creating governance profile:', error);
        res.status(500).json({ error: 'Failed to create governance profile' });
    }
});

/**
 * Update a governance profile
 * PATCH /api/governance/:profileId
 */
governanceRouter.patch('/:profileId', requireScope('governance:write'), async (req: Request, res: Response) => {
    const { profileId } = req.params;
    const {
        name,
        consentSource,
        usageRights,
        geographicRestrictions,
        dataRetentionPolicy,
        auditLogEnabled,
        complianceTags,
    } = req.body;

    try {
        const profile = await prisma.governanceProfile.update({
            where: { id: profileId },
            data: {
                ...(name && { name }),
                ...(consentSource && { consentSource }),
                ...(usageRights && { usageRights }),
                ...(geographicRestrictions && { geographicRestrictions }),
                ...(dataRetentionPolicy && { dataRetentionPolicy }),
                ...(auditLogEnabled !== undefined && { auditLogEnabled }),
                ...(complianceTags && { complianceTags }),
            },
        });

        res.json({ data: profile });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Governance profile not found' });
            return;
        }
        console.error('Error updating governance profile:', error);
        res.status(500).json({ error: 'Failed to update governance profile' });
    }
});

/**
 * Delete a governance profile
 * DELETE /api/governance/:profileId
 */
governanceRouter.delete('/:profileId', requireScope('governance:write'), async (req: Request, res: Response) => {
    const { profileId } = req.params;

    try {
        await prisma.governanceProfile.delete({ where: { id: profileId } });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Governance profile not found' });
            return;
        }
        console.error('Error deleting governance profile:', error);
        res.status(500).json({ error: 'Failed to delete governance profile' });
    }
});
