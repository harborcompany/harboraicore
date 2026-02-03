/**
 * Harbor ML - Annotation Orchestrator
 * Bridges the gap between Backend and Python Auto-Annotator Service
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { prisma } from '../../lib/prisma.js';
import type { AnnotationPipelineJob } from '@prisma/client';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

export class AnnotationOrchestrator {

    /**
     * Trigger auto-annotation for a pipeline job
     */
    async triggerAnnotation(jobId: string, inputPath: string, pipelineType: string): Promise<void> {
        console.log(`[AnnotationOrchestrator] Triggering annotation for job ${jobId} (${pipelineType})`);

        try {
            // Update job status
            await prisma.annotationPipelineJob.update({
                where: { id: jobId },
                data: {
                    currentStage: 'annotation',
                    status: 'RUNNING'
                }
            });

            // Prepare request to Python service
            const formData = new FormData();
            formData.append('file', fs.createReadStream(inputPath));

            // Configure based on pipeline type
            if (pipelineType.includes('lego') || pipelineType.includes('video')) {
                formData.append('run_hands', 'true');
                formData.append('run_objects', 'true');
                formData.append('run_actions', 'true'); // For lego steps
                formData.append('run_scenes', 'true');
                formData.append('frame_interval', '30'); // 1 fps for standard
            } else if (pipelineType.includes('audio')) {
                formData.append('run_vad', 'true');
                formData.append('run_diarization', 'true');
                formData.append('run_asr', 'true');
            }

            const endpoint = pipelineType.includes('audio') ? '/api/annotate/audio' : '/api/annotate/video';

            // Call Python Service
            const response = await axios.post(`${PYTHON_SERVICE_URL}${endpoint}`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            if (response.data.success) {
                await this.processResults(jobId, response.data.annotations);
            } else {
                throw new Error(response.data.error || 'Unknown annotation error');
            }

        } catch (error) {
            console.error(`[AnnotationOrchestrator] Failed job ${jobId}:`, error);
            await prisma.annotationPipelineJob.update({
                where: { id: jobId },
                data: {
                    status: 'FAILED',
                    errorMessage: error instanceof Error ? error.message : String(error)
                }
            });
        }
    }

    /**
     * Process and store annotation results
     */
    private async processResults(jobId: string, annotations: any[]): Promise<void> {
        console.log(`[AnnotationOrchestrator] Processing ${annotations.length} annotations for job ${jobId}`);

        const job = await prisma.annotationPipelineJob.findUnique({
            where: { id: jobId },
            select: { mediaAssetId: true }
        });

        if (!job) throw new Error(`Job ${jobId} not found`);

        const assetId = job.mediaAssetId;
        const counts: Record<string, number> = {};

        // Transactional write
        await prisma.$transaction(async (tx: typeof prisma) => {
            for (const item of annotations) {
                const type = item.type;
                counts[type] = (counts[type] || 0) + 1;

                if (type === 'hand_pose') {
                    await tx.handPoseDetection.create({
                        data: {
                            mediaAssetId: assetId,
                            timestamp: item.timestamp_ms / 1000,
                            frameId: item.frame_id,
                            confidence: item.confidence,
                            handType: item.data.hand_type,
                            keypoints: item.data.keypoints
                        }
                    });
                } else if (type === 'object_detection') {
                    await tx.objectDetection.create({
                        data: {
                            mediaAssetId: assetId,
                            timestamp: item.timestamp_ms / 1000,
                            frameId: item.frame_id,
                            confidence: item.confidence,
                            label: item.data.label,
                            boundingBox: item.data.bbox,
                            classId: item.data.class_id
                        }
                    });
                } else if (type === 'transcript') {
                    await tx.transcriptSegment.create({
                        data: {
                            mediaAssetId: assetId,
                            startTime: item.data.start,
                            endTime: item.data.end,
                            text: item.data.text,
                            speakerLabel: item.data.speaker,
                            confidence: item.confidence
                        }
                    });
                } else if (type === 'scene_segment') {
                    await tx.sceneSegment.create({
                        data: {
                            mediaAssetId: assetId,
                            startTime: item.data.start_time,
                            endTime: item.data.end_time,
                            sceneType: 'generated', // Default
                            confidence: 1.0
                        }
                    });
                }
            }

            // Mark job complete
            await tx.annotationPipelineJob.update({
                where: { id: jobId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                    progress: 100,
                    annotationCounts: counts
                }
            });
        });

        console.log(`[AnnotationOrchestrator] Job ${jobId} completed successfully`);
    }
}

export const annotationOrchestrator = new AnnotationOrchestrator();
