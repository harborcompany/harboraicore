/**
 * Ingestion API Routes
 * Manage media ingestion jobs
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../lib/prisma.js';
import { requireScope } from '../middleware/auth.js';

export const ingestionRouter = Router();

// List all capture sessions (supply side)
ingestionRouter.get('/', requireScope('datasets:read'), async (req: Request, res: Response) => {
    const { status, limit = '20', offset = '0' } = req.query;

    try {
        const where: any = {};
        if (status) where.status = String(status);

        const [sessions, total] = await Promise.all([
            prisma.captureSession.findMany({
                where,
                take: Number(limit),
                skip: Number(offset),
                orderBy: { createdAt: 'desc' },
            }),
            prisma.captureSession.count({ where }),
        ]);

        res.json({
            data: sessions,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + Number(limit) < total,
            },
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed to fetch capture sessions' });
    }
});

// Get a specific capture session
ingestionRouter.get('/:sessionId', requireScope('datasets:read'), async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    try {
        const session = await prisma.captureSession.findUnique({
            where: { id: sessionId },
            include: { assets: true }
        });

        if (!session) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }

        res.json({ data: session });
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

// Create a new capture session
ingestionRouter.post('/', requireScope('datasets:write'), async (req: Request, res: Response) => {
    const { userId, sourceType, deviceId } = req.body;

    if (!userId || !sourceType) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'userId and sourceType are required',
        });
        return;
    }

    try {
        const session = await prisma.captureSession.create({
            data: {
                userId,
                sourceType,
                deviceId,
                status: 'active',
                progress: 0
            },
        });

        res.status(201).json({
            data: session,
            message: 'Capture session initialized',
        });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// Update session progress/status
ingestionRouter.patch('/:sessionId', requireScope('datasets:write'), async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { progress, status, endTime } = req.body;

    try {
        const session = await prisma.captureSession.update({
            where: { id: sessionId },
            data: {
                ...(progress !== undefined && { progress: Number(progress) }),
                ...(status && { status }),
                ...(endTime && { endTime: new Date(endTime) })
            },
        });

        res.json({ data: session });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Session not found' });
            return;
        }
        console.error('Error updating session:', error);
        res.status(500).json({ error: 'Failed to update session' });
    }
});

ingestionRouter.delete('/:sessionId', requireScope('datasets:write'), async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    try {
        await prisma.captureSession.delete({ where: { id: sessionId } });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Session not found' });
            return;
        }
        console.error('Error deleting session:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
});
