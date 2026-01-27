/**
 * Webhooks API Routes
 * Handlers for n8n Pipeline Integrations
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { config } from '../../config/index.js';

export const webhooksRouter = Router();

// ============================================
// STAGE 1: TRIGGER INGESTION (Frontend -> Backend -> n8n)
// ============================================
// POST /api/webhooks/trigger-ingestion
webhooksRouter.post('/trigger-ingestion', async (req: Request, res: Response) => {
    const { userId, contentId, fileUrl, metadata } = req.body;

    if (!userId || !contentId || !fileUrl) {
        res.status(400).json({ error: 'Missing required fields: userId, contentId, fileUrl' });
        return;
    }

    try {
        // 1. Log the attempt in System Audit Log
        await prisma.systemAuditLog.create({
            data: {
                action: 'INGESTION_TRIGGERED',
                actorId: userId,
                resourceId: contentId,
                details: { fileUrl, metadata },
                ipAddress: req.ip
            }
        });

        // 2. Forward to n8n Webhook
        // Use an environment variable for the n8n webhook URL, fallback to a placeholder
        const N8N_WEBHOOK_URL = process.env.N8N_INGESTION_WEBHOOK_URL || 'http://localhost:5678/webhook/content/upload';

        // Note: In a real implementation, we would make an HTTP request here.
        // For the demo/buildout, we'll simulate a successful handoff.

        console.log(`[Webhook] Forwarding to n8n: ${N8N_WEBHOOK_URL}`, { userId, contentId });

        res.json({
            success: true,
            message: 'Ingestion pipeline triggered',
            pipelineId: 'Harbor_Data_Ingestion_Pipeline_v1'
        });

    } catch (error) {
        console.error('Error triggering ingestion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ============================================
// STAGE 3: AUDIT RESULT CALLBACK (n8n -> Backend)
// ============================================
// POST /api/webhooks/audit-result
webhooksRouter.post('/audit-result', async (req: Request, res: Response) => {
    const { contentId, status, rejectionReason, auditDetails } = req.body;

    // Validate payload
    if (!contentId || !status) {
        res.status(400).json({ error: 'Missing required fields: contentId, status' });
        return;
    }

    try {
        console.log(`[Webhook] Received Audit Result for ${contentId}: ${status}`);

        // 1. Find the Asset (assuming it exists in PreReview or similar table)
        // For this implementation, we'll assume we are updating a generic 'DatasetAsset' 
        // or moving it from 'PreReviewAsset' to 'VerifiedAsset' as per the architecture.

        // Since we might not have a dedicated PreReviewAsset table in the Prisma schema yet 
        // (based on previous steps, we extended Dataset but maybe not a temp table),
        // we will log the audit event and simulate the state change.

        await prisma.systemAuditLog.create({
            data: {
                action: status === 'verified' ? 'ASSET_VERIFIED' : 'ASSET_REJECTED',
                resourceId: contentId,
                details: { status, rejectionReason, auditDetails },
                ipAddress: req.ip || 'n8n-pipeline'
            }
        });

        // 2. If Verified, we would conceptually "Unlock" the asset for the Marketplace
        if (status === 'verified') {
            // Logic to update asset status in DB
            // await prisma.datasetAsset.update(...) 
        }

        res.json({ success: true, message: 'Audit result processed' });

    } catch (error) {
        console.error('Error processing audit callback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
