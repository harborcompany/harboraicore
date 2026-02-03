/**
 * Harbor ML - Preprocessing Job Orchestrator
 * Manages video/audio preprocessing jobs using Bull queue
 */

import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../lib/prisma.js';
import type { PreprocessingType, JobStatus } from '@prisma/client';
import { annotationOrchestrator } from '../annotation/orchestrator.js';

// Job types for the preprocessing pipeline
export interface PreprocessingJobData {
    jobId: string;
    mediaAssetId: string;
    jobType: PreprocessingType;
    inputPath: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    metadata?: Record<string, unknown>;
}

export interface PreprocessingResult {
    jobId: string;
    success: boolean;
    outputPath?: string;
    metrics?: Record<string, unknown>;
    error?: string;
}

// Priority to Bull priority mapping
const PRIORITY_MAP = {
    urgent: 1,
    high: 2,
    normal: 3,
    low: 4,
};

/**
 * Preprocessing Orchestrator Service
 * Coordinates preprocessing jobs across the pipeline
 */
export class PreprocessingOrchestrator {
    private isInitialized = false;

    constructor() {
        console.log('[PreprocessingOrchestrator] Initialized');
    }

    /**
     * Initialize the orchestrator (connect to Redis, etc.)
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        // In production, this would initialize Bull queues with Redis
        // For now, we'll use in-memory processing
        this.isInitialized = true;
        console.log('[PreprocessingOrchestrator] Ready');
    }

    /**
     * Create a preprocessing job
     */
    async createJob(params: {
        mediaAssetId: string;
        jobType: PreprocessingType;
        inputPath: string;
        priority?: 'low' | 'normal' | 'high' | 'urgent';
        metadata?: Record<string, unknown>;
    }): Promise<string> {
        const jobId = uuidv4();

        // Create job record in database
        await prisma.preprocessingJob.create({
            data: {
                id: jobId,
                mediaAssetId: params.mediaAssetId,
                jobType: params.jobType,
                status: 'QUEUED',
                inputPath: params.inputPath,
                progress: 0,
            },
        });

        console.log(`[PreprocessingOrchestrator] Created job ${jobId} for asset ${params.mediaAssetId}`);

        // In production, this would add to Bull queue
        // For now, we trigger processing asynchronously
        this.processJob({
            jobId,
            mediaAssetId: params.mediaAssetId,
            jobType: params.jobType,
            inputPath: params.inputPath,
            priority: params.priority || 'normal',
            metadata: params.metadata,
        }).catch(console.error);

        return jobId;
    }

    /**
     * Create a full preprocessing pipeline for an asset
     * Returns the pipeline job ID
     */
    async createFullPipeline(params: {
        mediaAssetId: string;
        mediaType: 'video' | 'audio' | 'multimodal';
        inputPath: string;
        priority?: 'low' | 'normal' | 'high' | 'urgent';
    }): Promise<string[]> {
        const jobIds: string[] = [];
        const priority = params.priority || 'normal';

        if (params.mediaType === 'video' || params.mediaType === 'multimodal') {
            // Video preprocessing jobs
            jobIds.push(await this.createJob({
                mediaAssetId: params.mediaAssetId,
                jobType: 'VIDEO_TRANSCODE',
                inputPath: params.inputPath,
                priority,
            }));

            jobIds.push(await this.createJob({
                mediaAssetId: params.mediaAssetId,
                jobType: 'VIDEO_FRAME_EXTRACT',
                inputPath: params.inputPath,
                priority,
            }));

            jobIds.push(await this.createJob({
                mediaAssetId: params.mediaAssetId,
                jobType: 'AUDIO_EXTRACT',
                inputPath: params.inputPath,
                priority,
            }));
        }

        if (params.mediaType === 'audio' || params.mediaType === 'multimodal') {
            // Audio preprocessing jobs
            jobIds.push(await this.createJob({
                mediaAssetId: params.mediaAssetId,
                jobType: 'AUDIO_NORMALIZE',
                inputPath: params.inputPath,
                priority,
            }));
        }

        // Always extract metadata
        jobIds.push(await this.createJob({
            mediaAssetId: params.mediaAssetId,
            jobType: 'METADATA_EXTRACT',
            inputPath: params.inputPath,
            priority,
        }));

        console.log(`[PreprocessingOrchestrator] Created pipeline with ${jobIds.length} jobs for asset ${params.mediaAssetId}`);

        // [Glue] Trigger Annotation Pipeline Hand-off
        // In a real queue, this would listen for job completion events.
        // Here we simulate it by calling the annotation trigger after a delay or directly.
        // We need the pipeline job ID to associate it.
        // For now, we assume one active pipeline job per asset for simplicity in this bridge.

        return jobIds;
    }

    /**
     * Process a single job (called by worker)
     */
    private async processJob(jobData: PreprocessingJobData): Promise<PreprocessingResult> {
        const { jobId, mediaAssetId, jobType, inputPath } = jobData;

        try {
            // Update job status to running
            await prisma.preprocessingJob.update({
                where: { id: jobId },
                data: {
                    status: 'RUNNING',
                    startedAt: new Date(),
                },
            });

            // Process based on job type
            let result: PreprocessingResult;

            switch (jobType) {
                case 'VIDEO_TRANSCODE':
                    result = await this.transcodeVideo(jobData);
                    break;
                case 'VIDEO_FRAME_EXTRACT':
                    result = await this.extractFrames(jobData);
                    break;
                case 'AUDIO_EXTRACT':
                    result = await this.extractAudio(jobData);
                    break;
                case 'AUDIO_NORMALIZE':
                    result = await this.normalizeAudio(jobData);
                    break;
                case 'METADATA_EXTRACT':
                    result = await this.extractMetadata(jobData);
                    break;
                default:
                    throw new Error(`Unknown job type: ${jobType}`);
            }

            // Update job with results
            await prisma.preprocessingJob.update({
                where: { id: jobId },
                data: {
                    status: result.success ? 'COMPLETED' : 'FAILED',
                    completedAt: new Date(),
                    outputPath: result.outputPath,
                    metrics: result.metrics as any,
                    progress: 100,
                    errorMessage: result.error,
                },
            });

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            await prisma.preprocessingJob.update({
                where: { id: jobId },
                data: {
                    status: 'FAILED',
                    completedAt: new Date(),
                    errorMessage,
                },
            });

            return {
                jobId,
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Get job status
     */
    async getJobStatus(jobId: string): Promise<{
        status: JobStatus;
        progress: number;
        outputPath?: string | null;
        metrics?: unknown;
        error?: string | null;
    } | null> {
        const job = await prisma.preprocessingJob.findUnique({
            where: { id: jobId },
            select: {
                status: true,
                progress: true,
                outputPath: true,
                metrics: true,
                errorMessage: true,
            },
        });

        if (!job) return null;

        return {
            status: job.status,
            progress: job.progress,
            outputPath: job.outputPath,
            metrics: job.metrics,
            error: job.errorMessage,
        };
    }

    /**
     * Get all jobs for an asset
     */
    async getAssetJobs(mediaAssetId: string): Promise<Array<{
        id: string;
        jobType: PreprocessingType;
        status: JobStatus;
        progress: number;
    }>> {
        const jobs = await prisma.preprocessingJob.findMany({
            where: { mediaAssetId },
            select: {
                id: true,
                jobType: true,
                status: true,
                progress: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        return jobs;
    }

    // ========================================
    // Job Processing Methods
    // ========================================

    /**
     * Transcode video to standardized format
     * In production: FFmpeg to h.264 1080p
     */
    private async transcodeVideo(jobData: PreprocessingJobData): Promise<PreprocessingResult> {
        const { jobId, inputPath } = jobData;

        // Simulate processing time
        await this.updateProgress(jobId, 25);

        // In production: Run FFmpeg transcode
        // ffmpeg -i input.mp4 -vcodec h264 -acodec aac -vf scale=1920:1080 output.mp4
        const outputPath = inputPath.replace(/\.[^/.]+$/, '_preview.mp4');

        await this.updateProgress(jobId, 75);

        return {
            jobId,
            success: true,
            outputPath,
            metrics: {
                codec: 'h264',
                resolution: '1920x1080',
                format: 'mp4',
            },
        };
    }

    /**
     * Extract frames from video at intervals
     * In production: FFmpeg frame extraction
     */
    private async extractFrames(jobData: PreprocessingJobData): Promise<PreprocessingResult> {
        const { jobId, inputPath } = jobData;

        await this.updateProgress(jobId, 25);

        // In production: Extract frames at N-frame intervals
        // ffmpeg -i input.mp4 -vf "fps=1" frame_%04d.jpg
        const outputPath = inputPath.replace(/\.[^/.]+$/, '_frames/');

        await this.updateProgress(jobId, 75);

        return {
            jobId,
            success: true,
            outputPath,
            metrics: {
                frameInterval: 30, // Every 30 frames (1 per second at 30fps)
                totalFrames: 0, // Would be calculated
                format: 'jpg',
            },
        };
    }

    /**
     * Extract audio track from video
     * In production: FFmpeg audio extraction
     */
    private async extractAudio(jobData: PreprocessingJobData): Promise<PreprocessingResult> {
        const { jobId, inputPath } = jobData;

        await this.updateProgress(jobId, 50);

        // In production: Extract audio as WAV 16kHz
        // ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 16000 output.wav
        const outputPath = inputPath.replace(/\.[^/.]+$/, '_audio.wav');

        return {
            jobId,
            success: true,
            outputPath,
            metrics: {
                sampleRate: 16000,
                channels: 1,
                bitDepth: 16,
                format: 'wav',
            },
        };
    }

    /**
     * Normalize audio levels (EBU R128)
     * In production: FFmpeg loudnorm filter
     */
    private async normalizeAudio(jobData: PreprocessingJobData): Promise<PreprocessingResult> {
        const { jobId, inputPath } = jobData;

        await this.updateProgress(jobId, 50);

        // In production: Apply EBU R128 loudness normalization
        // ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 output_normalized.wav
        const outputPath = inputPath.replace(/\.[^/.]+$/, '_normalized.wav');

        return {
            jobId,
            success: true,
            outputPath,
            metrics: {
                loudness: -16, // LUFS
                truePeak: -1.5, // dBTP
                loudnessRange: 11, // LU
                standard: 'EBU_R128',
            },
        };
    }

    /**
     * Extract metadata from media file
     * In production: FFprobe + EXIF parsing
     */
    private async extractMetadata(jobData: PreprocessingJobData): Promise<PreprocessingResult> {
        const { jobId, inputPath } = jobData;

        await this.updateProgress(jobId, 50);

        // In production: Run FFprobe and parse EXIF
        // ffprobe -v quiet -print_format json -show_format -show_streams input.mp4

        return {
            jobId,
            success: true,
            metrics: {
                duration: 0, // Would be extracted
                resolution: null,
                fps: null,
                codec: null,
                device: null,
                captureDate: null,
                gps: null,
            },
        };
    }

    /**
     * Update job progress
     */
    private async updateProgress(jobId: string, progress: number): Promise<void> {
        await prisma.preprocessingJob.update({
            where: { id: jobId },
            data: { progress },
        });
    }
}

// Singleton instance
export const preprocessingOrchestrator = new PreprocessingOrchestrator();
