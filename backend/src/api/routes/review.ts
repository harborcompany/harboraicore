/**
 * Harbor ML - Review API Routes
 * HITL Quality Pipeline: Stage 3 - Human Review & Completion
 */

import { Router, Request, Response } from 'express';
import { requireScope } from '../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { pdfModuleGenerator } from '../../services/dataset/pdf-generator.js';
import { z } from 'zod';

export const reviewRouter = Router();

// Validation schemas
const UpdateAnnotationSchema = z.object({
    annotationId: z.string().uuid(),
    type: z.enum(['hand_pose', 'object_detection', 'scene_segment', 'transcript']),
    updates: z.record(z.any()),
});

/**
 * Get asset with all annotations for review
 * GET /api/review/:assetId
 */
reviewRouter.get('/:assetId', requireScope('review:read'), async (req: Request, res: Response) => {
    const { assetId } = req.params;

    try {
        const asset = await prisma.mediaAsset.findUnique({
            where: { id: assetId },
            include: {
                handPoseDetections: { orderBy: { frameId: 'asc' } },
                objectDetections: { orderBy: { frameId: 'asc' } },
                sceneSegments: { orderBy: { startTime: 'asc' } },
                transcriptSegments: { orderBy: { startTime: 'asc' } },
                stagingBinEntry: true,
            },
        });

        if (!asset) {
            res.status(404).json({ error: 'Asset not found' });
            return;
        }

        // Calculate summary stats
        const stats = {
            handPoseCount: asset.handPoseDetections.length,
            objectCount: asset.objectDetections.length,
            sceneCount: asset.sceneSegments.length,
            transcriptCount: asset.transcriptSegments.length,
            avgConfidence: calculateAvgConfidence(asset),
        };

        res.json({
            data: {
                asset: {
                    id: asset.id,
                    filename: asset.filename,
                    type: asset.type,
                    duration: asset.duration,
                    storagePointer: asset.storagePointer,
                },
                annotations: {
                    handPose: asset.handPoseDetections,
                    objects: asset.objectDetections,
                    scenes: asset.sceneSegments,
                    transcripts: asset.transcriptSegments,
                },
                stats,
                stagingStatus: asset.stagingBinEntry?.status,
            },
        });
    } catch (error) {
        console.error('Error fetching asset for review:', error);
        res.status(500).json({ error: 'Failed to fetch asset' });
    }
});

/**
 * Update an individual annotation
 * PATCH /api/review/:assetId/annotations
 */
reviewRouter.patch('/:assetId/annotations', requireScope('review:write'), async (req: Request, res: Response) => {
    const { assetId } = req.params;

    try {
        const parsed = UpdateAnnotationSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: 'Validation error', details: parsed.error.errors });
            return;
        }

        const { annotationId, type, updates } = parsed.data;

        // Update appropriate table based on type
        let updated;
        switch (type) {
            case 'hand_pose':
                updated = await prisma.handPoseDetection.update({
                    where: { id: annotationId },
                    data: updates,
                });
                break;
            case 'object_detection':
                updated = await prisma.objectDetection.update({
                    where: { id: annotationId },
                    data: updates,
                });
                break;
            case 'scene_segment':
                updated = await prisma.sceneSegment.update({
                    where: { id: annotationId },
                    data: updates,
                });
                break;
            case 'transcript':
                updated = await prisma.transcriptSegment.update({
                    where: { id: annotationId },
                    data: updates,
                });
                break;
        }

        res.json({
            data: {
                id: annotationId,
                type,
                updated: true,
            },
        });
    } catch (error) {
        console.error('Error updating annotation:', error);
        res.status(500).json({ error: 'Failed to update annotation' });
    }
});

/**
 * Delete an annotation
 * DELETE /api/review/:assetId/annotations/:annotationId
 */
reviewRouter.delete('/:assetId/annotations/:annotationId', requireScope('review:write'), async (req: Request, res: Response) => {
    const { annotationId } = req.params;
    const { type } = req.query;

    try {
        switch (type) {
            case 'hand_pose':
                await prisma.handPoseDetection.delete({ where: { id: annotationId } });
                break;
            case 'object_detection':
                await prisma.objectDetection.delete({ where: { id: annotationId } });
                break;
            case 'scene_segment':
                await prisma.sceneSegment.delete({ where: { id: annotationId } });
                break;
            case 'transcript':
                await prisma.transcriptSegment.delete({ where: { id: annotationId } });
                break;
            default:
                res.status(400).json({ error: 'Invalid annotation type' });
                return;
        }

        res.json({ data: { deleted: true } });
    } catch (error) {
        console.error('Error deleting annotation:', error);
        res.status(500).json({ error: 'Failed to delete annotation' });
    }
});

/**
 * Mark asset as complete and generate PDF module
 * POST /api/review/:assetId/complete
 * This is the "Complete" button
 */
reviewRouter.post('/:assetId/complete', requireScope('review:write'), async (req: Request, res: Response) => {
    const { assetId } = req.params;

    try {
        // Find staging entry for this asset
        const stagingEntry = await prisma.stagingBinEntry.findUnique({
            where: { mediaAssetId: assetId },
        });

        if (!stagingEntry) {
            res.status(404).json({ error: 'Staging entry not found for asset' });
            return;
        }

        if (stagingEntry.status !== 'PENDING_REVIEW' && stagingEntry.status !== 'IN_ANNOTATION') {
            res.status(400).json({
                error: `Cannot complete entry with status: ${stagingEntry.status}. Must be PENDING_REVIEW or IN_ANNOTATION.`
            });
            return;
        }

        // Generate PDF Module
        console.log(`[Review] Generating PDF module for staging entry ${stagingEntry.id}`);
        const pdfPath = await pdfModuleGenerator.generateModule({
            stagingEntryId: stagingEntry.id,
        });

        // Update staging entry
        const updated = await prisma.stagingBinEntry.update({
            where: { id: stagingEntry.id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                pdfModuleUrl: pdfPath,
                pdfGeneratedAt: new Date(),
            },
        });

        res.json({
            data: {
                id: updated.id,
                status: updated.status,
                pdfModuleUrl: updated.pdfModuleUrl,
                message: 'Dataset module completed and PDF generated',
            },
        });
    } catch (error) {
        console.error('Error completing review:', error);
        res.status(500).json({ error: 'Failed to complete review' });
    }
});

/**
 * Generate Lab Schema JSON output
 * GET /api/review/:assetId/lab-schema
 */
reviewRouter.get('/:assetId/lab-schema', requireScope('review:read'), async (req: Request, res: Response) => {
    const { assetId } = req.params;

    try {
        const asset = await prisma.mediaAsset.findUnique({
            where: { id: assetId },
            include: {
                handPoseDetections: true,
                objectDetections: true,
                sceneSegments: true,
                transcriptSegments: true,
            },
        });

        if (!asset) {
            res.status(404).json({ error: 'Asset not found' });
            return;
        }

        // Build Lab Schema output
        const labSchema = {
            dataset_id: `harbor_${assetId.substring(0, 8)}`,
            version: '1.0.0',
            schema_version: 'harbor_lab_v2',
            asset: {
                id: asset.id,
                filename: asset.filename,
                duration_sec: asset.duration,
                resolution: asset.resolution,
                checksum_sha256: asset.checksum,
            },
            annotations: {
                hand_pose: asset.handPoseDetections.map((h: any) => ({
                    frame_id: h.frameId,
                    timestamp_ms: h.timestampMs,
                    confidence: h.confidence,
                    model: { name: h.modelName, version: h.modelVersion },
                    keypoints: h.keypoints,
                })),
                objects: asset.objectDetections.map((o: any) => ({
                    frame_id: o.frameId,
                    timestamp_ms: o.timestampMs,
                    confidence: o.confidence,
                    model: { name: o.modelName, version: o.modelVersion },
                    label: o.label,
                    bbox: o.boundingBox,
                })),
                scenes: asset.sceneSegments.map((s: any) => ({
                    start_time: s.startTime,
                    end_time: s.endTime,
                    scene_type: s.sceneType,
                    confidence: s.confidence,
                })),
                transcripts: asset.transcriptSegments.map((t: any) => ({
                    start_time: t.startTime,
                    end_time: t.endTime,
                    text: t.text,
                    speaker: t.speakerLabel,
                    confidence: t.confidence,
                })),
            },
            provenance: {
                processed_at: new Date().toISOString(),
                pipeline: 'harbor_hitl_v1',
            },
        };

        res.json({ data: labSchema });
    } catch (error) {
        console.error('Error generating lab schema:', error);
        res.status(500).json({ error: 'Failed to generate lab schema' });
    }
});

// Helper function
function calculateAvgConfidence(asset: any): number {
    const allConfidences: number[] = [];

    asset.handPoseDetections?.forEach((h: any) => allConfidences.push(h.confidence));
    asset.objectDetections?.forEach((o: any) => allConfidences.push(o.confidence));
    asset.sceneSegments?.forEach((s: any) => allConfidences.push(s.confidence));
    asset.transcriptSegments?.forEach((t: any) => allConfidences.push(t.confidence));

    if (allConfidences.length === 0) return 0;
    return allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length;
}
