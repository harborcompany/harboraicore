/**
 * Harbor ML - Upload Metadata Validation Schemas
 * Zod schemas for validating contributor upload metadata
 */

import { z } from 'zod';

// ISO-3166-1 alpha-2 country codes (subset of common ones)
const iso2CountryCodes = [
    'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'KR', 'CN', 'IN', 'BR', 'MX',
    'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'PL', 'PT', 'AT', 'CH', 'IE', 'NZ', 'SG', 'HK',
    'TW', 'TH', 'MY', 'PH', 'ID', 'VN', 'ZA', 'NG', 'EG', 'AE', 'SA', 'IL', 'TR', 'RU',
] as const;

// Dataset type enum matching Prisma schema
export const DatasetTypeSchema = z.enum([
    'LEGO_VIDEO',
    'AUDIO_SPEECH',
    'MULTIMODAL',
    'OTHER',
]);

// Recording environment enum matching Prisma schema
export const RecordingEnvironmentSchema = z.enum([
    'QUIET',
    'MODERATE',
    'NOISY',
]);

/**
 * Required upload metadata from all contributors
 * Must be included with every media upload
 */
export const UploadMetadataSchema = z.object({
    // Contributor identification
    uploader_id: z.string().uuid({
        message: 'uploader_id must be a valid UUID',
    }),

    // Dataset classification
    dataset_type: z.enum(['lego_video', 'audio_speech', 'multimodal', 'other'], {
        errorMap: () => ({ message: 'dataset_type must be one of: lego_video, audio_speech, multimodal, other' }),
    }).transform((val) => val.toUpperCase().replace('_', '_') as 'LEGO_VIDEO' | 'AUDIO_SPEECH' | 'MULTIMODAL' | 'OTHER'),

    // Device information
    device_model: z.string().min(1, 'device_model is required').max(200),

    // Recording context
    recording_environment: z.enum(['quiet', 'moderate', 'noisy'], {
        errorMap: () => ({ message: 'recording_environment must be one of: quiet, moderate, noisy' }),
    }).transform((val) => val.toUpperCase() as 'QUIET' | 'MODERATE' | 'NOISY'),

    // Consent and rights (must be true)
    consent_signed: z.literal(true, {
        errorMap: () => ({ message: 'consent_signed must be true' }),
    }),
    rights_granted: z.literal(true, {
        errorMap: () => ({ message: 'rights_granted must be true' }),
    }),

    // Geographic location
    country: z.string().length(2, 'country must be ISO-3166-1 alpha-2 code (2 characters)').toUpperCase(),

    // Timestamp
    timestamp: z.string().datetime({
        message: 'timestamp must be ISO-8601 format',
    }),
});

/**
 * Extended metadata for video uploads
 */
export const VideoUploadMetadataSchema = UploadMetadataSchema.extend({
    // Video-specific fields
    resolution: z.string().optional(),
    frame_rate: z.number().positive().optional(),
    duration_seconds: z.number().positive().optional(),
});

/**
 * Extended metadata for audio uploads
 */
export const AudioUploadMetadataSchema = UploadMetadataSchema.extend({
    // Audio-specific fields
    sample_rate: z.number().positive().optional(),
    channels: z.number().int().positive().max(8).optional(),
    bit_depth: z.number().int().positive().optional(),
    duration_seconds: z.number().positive().optional(),
});

/**
 * Preprocessing job creation schema
 */
export const PreprocessingJobSchema = z.object({
    media_asset_id: z.string().uuid(),
    job_type: z.enum([
        'VIDEO_TRANSCODE',
        'VIDEO_FRAME_EXTRACT',
        'AUDIO_EXTRACT',
        'AUDIO_NORMALIZE',
        'METADATA_EXTRACT',
    ]),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

/**
 * Pipeline trigger schema
 */
export const PipelineTriggerSchema = z.object({
    media_asset_id: z.string().uuid(),
    pipeline_type: z.enum([
        'VIDEO_FULL',
        'AUDIO_FULL',
        'VIDEO_AUDIO_FULL',
        'VIDEO_OBJECTS_ONLY',
        'VIDEO_ACTIONS_ONLY',
        'AUDIO_ASR_ONLY',
    ]),
    skip_preprocessing: z.boolean().default(false),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

/**
 * Quality threshold configuration
 */
export const QualityThresholdSchema = z.object({
    min_clarity: z.number().min(0).max(1).default(0.6),
    min_annotation_confidence: z.number().min(0).max(1).default(0.7),
    min_stability: z.number().min(0).max(1).default(0.5),
    min_compliance: z.number().min(0).max(1).default(1.0),
    min_overall: z.number().min(0).max(1).default(0.6),
    premium_threshold: z.number().min(0).max(1).default(0.85),
    exclusion_threshold: z.number().min(0).max(1).default(0.5),
});

/**
 * Dataset manifest generation schema
 */
export const DatasetManifestSchema = z.object({
    dataset_id: z.string().uuid(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic (e.g., 1.0.0)'),
    annotation_types: z.array(z.string()).min(1),
    modalities: z.array(z.enum(['video', 'audio'])).min(1),
    quality_threshold: QualityThresholdSchema.optional(),
    changelog: z.string().optional(),
});

/**
 * Dataset export request schema
 */
export const DatasetExportSchema = z.object({
    dataset_id: z.string().uuid(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
    format: z.enum(['zip', 'parquet', 'tfrecord']).default('zip'),
    include_assets: z.boolean().default(true),
    include_annotations: z.boolean().default(true),
    include_metadata: z.boolean().default(true),
});

// Type exports
export type UploadMetadata = z.infer<typeof UploadMetadataSchema>;
export type VideoUploadMetadata = z.infer<typeof VideoUploadMetadataSchema>;
export type AudioUploadMetadata = z.infer<typeof AudioUploadMetadataSchema>;
export type PreprocessingJob = z.infer<typeof PreprocessingJobSchema>;
export type PipelineTrigger = z.infer<typeof PipelineTriggerSchema>;
export type QualityThreshold = z.infer<typeof QualityThresholdSchema>;
export type DatasetManifest = z.infer<typeof DatasetManifestSchema>;
export type DatasetExport = z.infer<typeof DatasetExportSchema>;
