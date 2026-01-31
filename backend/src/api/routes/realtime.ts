import { Router, Request, Response } from 'express';
import { requireScope } from '../middleware/auth.js';
import { liveKitService } from '../../services/realtime/livekit-service.js';

export const realtimeRouter = Router();

/**
 * Get LiveKit Connection Token
 * POST /api/realtime/token
 */
realtimeRouter.post('/token', requireScope('realtime:connect'), async (req: Request, res: Response) => {
    const { roomName, participantName } = req.body;

    // In a real app, verify user has access to this room
    // For now, use the user ID from the token or header
    const userId = ((req as any).user)?.id || (req.headers['x-user-id'] as string) || `user_${Math.random().toString(36).substring(7)}`;
    const name = participantName || userId;

    if (!roomName) {
        res.status(400).json({ error: 'roomName is required' });
        return;
    }

    try {
        const token = await liveKitService.generateToken(roomName, name, userId);

        res.json({
            data: {
                token,
                url: process.env.LIVEKIT_URL || 'ws://localhost:7880',
                identity: userId
            }
        });
    } catch (error) {
        console.error('Failed to generate LiveKit token', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

/**
 * LiveKit Webhook Handler
 * POST /api/realtime/webhook
 */
realtimeRouter.post('/webhook', async (req: Request, res: Response) => {
    // Validate webhook signature here in future
    // const event = receiver.receive(req.body, req.get('Authorization'));

    console.log('LiveKit Webhook:', req.body.event);

    res.status(200).send('ok');
});
