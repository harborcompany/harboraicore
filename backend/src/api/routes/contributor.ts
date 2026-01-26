import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';

export const contributorRouter = Router();

/**
 * CAPTURE: Create a new capture session
 */
contributorRouter.post('/capture/session', async (req, res) => {
    try {
        const { userId, sourceType, deviceId } = req.body;
        const session = await prisma.captureSession.create({
            data: {
                userId,
                sourceType,
                deviceId
            }
        });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create capture session' });
    }
});

/**
 * ASSETS: Link media assets to a session
 */
contributorRouter.post('/capture/assets', async (req, res) => {
    try {
        const { sessionId, type, filename, sizeBytes, duration, storagePointer } = req.body;
        const asset = await prisma.mediaAsset.create({
            data: {
                sessionId,
                type,
                filename,
                sizeBytes: BigInt(sizeBytes),
                duration,
                storagePointer,
                status: 'PROCESSING'
            }
        });
        res.json({ ...asset, sizeBytes: asset.sizeBytes.toString() });
    } catch (error) {
        res.status(500).json({ error: 'Failed to ingest asset' });
    }
});

/**
 * CONSENT: Record immutable consent for an asset
 */
contributorRouter.post('/consent', async (req, res) => {
    try {
        const { userId, mediaId, licenseType, usageScope, revSharePct } = req.body;
        const consent = await prisma.consentRecord.create({
            data: {
                userId,
                mediaId,
                licenseType,
                usageScope,
                revSharePct
            }
        });
        res.json(consent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to record consent' });
    }
});

/**
 * EARNINGS: Get contributor ledger
 */
contributorRouter.get('/earnings/:userId', async (req, res) => {
    try {
        const earnings = await prisma.earningsLedger.findMany({
            where: { userId: req.params.userId },
            orderBy: { timestamp: 'desc' }
        });
        res.json(earnings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch earnings' });
    }
});
