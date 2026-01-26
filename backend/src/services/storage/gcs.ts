/**
 * Google Cloud Storage Service
 * Handles media asset uploads, dataset storage, and exports
 */

import { Storage, Bucket, File } from '@google-cloud/storage';
import crypto from 'crypto';
import path from 'path';

// Initialize GCS client
const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    // Credentials loaded from GOOGLE_APPLICATION_CREDENTIALS env var
});

// Bucket references
const mediaBucket = storage.bucket(process.env.GCS_BUCKET_NAME || 'harbor-media-assets');
const datasetsBucket = storage.bucket(process.env.GCS_BUCKET_DATASETS || 'harbor-datasets');
const exportsBucket = storage.bucket(process.env.GCS_BUCKET_EXPORTS || 'harbor-exports');

export interface UploadOptions {
    contentType?: string;
    metadata?: Record<string, string>;
    public?: boolean;
}

export interface SignedUrlOptions {
    action: 'read' | 'write';
    expires: Date;
    contentType?: string;
}

/**
 * Generate a unique filename with original extension
 */
function generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(8).toString('hex');
    return `${timestamp}-${randomId}${ext}`;
}

/**
 * Upload a file to media bucket
 */
export async function uploadMediaAsset(
    buffer: Buffer,
    originalFilename: string,
    options: UploadOptions = {}
): Promise<{ url: string; path: string; size: number }> {
    const filename = generateUniqueFilename(originalFilename);
    const filePath = `media/${filename}`;
    const file = mediaBucket.file(filePath);

    await file.save(buffer, {
        contentType: options.contentType || 'application/octet-stream',
        metadata: {
            metadata: options.metadata || {},
        },
    });

    if (options.public) {
        await file.makePublic();
    }

    const [metadata] = await file.getMetadata();

    return {
        url: options.public
            ? `https://storage.googleapis.com/${mediaBucket.name}/${filePath}`
            : `gs://${mediaBucket.name}/${filePath}`,
        path: filePath,
        size: Number(metadata.size),
    };
}

/**
 * Upload dataset files
 */
export async function uploadDatasetFile(
    buffer: Buffer,
    datasetId: string,
    filename: string,
    options: UploadOptions = {}
): Promise<{ url: string; path: string; size: number }> {
    const filePath = `datasets/${datasetId}/${filename}`;
    const file = datasetsBucket.file(filePath);

    await file.save(buffer, {
        contentType: options.contentType || 'application/octet-stream',
        metadata: {
            metadata: {
                datasetId,
                ...options.metadata,
            },
        },
    });

    const [metadata] = await file.getMetadata();

    return {
        url: `gs://${datasetsBucket.name}/${filePath}`,
        path: filePath,
        size: Number(metadata.size),
    };
}

/**
 * Generate signed URL for upload (resumable uploads)
 */
export async function getSignedUploadUrl(
    bucket: 'media' | 'datasets' | 'exports',
    filename: string,
    contentType: string,
    expiresInMinutes: number = 60
): Promise<{ uploadUrl: string; filePath: string }> {
    const bucketRef = bucket === 'media'
        ? mediaBucket
        : bucket === 'datasets'
            ? datasetsBucket
            : exportsBucket;

    const filePath = `${bucket}/${generateUniqueFilename(filename)}`;
    const file = bucketRef.file(filePath);

    const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + expiresInMinutes * 60 * 1000,
        contentType,
    });

    return { uploadUrl: url, filePath };
}

/**
 * Generate signed URL for download
 */
export async function getSignedDownloadUrl(
    bucket: 'media' | 'datasets' | 'exports',
    filePath: string,
    expiresInMinutes: number = 60
): Promise<string> {
    const bucketRef = bucket === 'media'
        ? mediaBucket
        : bucket === 'datasets'
            ? datasetsBucket
            : exportsBucket;

    const file = bucketRef.file(filePath);

    const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiresInMinutes * 60 * 1000,
    });

    return url;
}

/**
 * Delete a file
 */
export async function deleteFile(
    bucket: 'media' | 'datasets' | 'exports',
    filePath: string
): Promise<void> {
    const bucketRef = bucket === 'media'
        ? mediaBucket
        : bucket === 'datasets'
            ? datasetsBucket
            : exportsBucket;

    await bucketRef.file(filePath).delete();
}

/**
 * List files in a directory
 */
export async function listFiles(
    bucket: 'media' | 'datasets' | 'exports',
    prefix: string
): Promise<Array<{ name: string; size: number; updated: Date }>> {
    const bucketRef = bucket === 'media'
        ? mediaBucket
        : bucket === 'datasets'
            ? datasetsBucket
            : exportsBucket;

    const [files] = await bucketRef.getFiles({ prefix });

    return files.map(file => ({
        name: file.name,
        size: Number(file.metadata.size || 0),
        updated: new Date(file.metadata.updated as string),
    }));
}

/**
 * Copy file between buckets
 */
export async function copyFile(
    sourceBucket: 'media' | 'datasets' | 'exports',
    sourcePath: string,
    destBucket: 'media' | 'datasets' | 'exports',
    destPath: string
): Promise<void> {
    const srcBucketRef = sourceBucket === 'media'
        ? mediaBucket
        : sourceBucket === 'datasets'
            ? datasetsBucket
            : exportsBucket;

    const dstBucketRef = destBucket === 'media'
        ? mediaBucket
        : destBucket === 'datasets'
            ? datasetsBucket
            : exportsBucket;

    await srcBucketRef.file(sourcePath).copy(dstBucketRef.file(destPath));
}

/**
 * Get file metadata
 */
export async function getFileMetadata(
    bucket: 'media' | 'datasets' | 'exports',
    filePath: string
): Promise<{ size: number; contentType: string; updated: Date; metadata: Record<string, string> }> {
    const bucketRef = bucket === 'media'
        ? mediaBucket
        : bucket === 'datasets'
            ? datasetsBucket
            : exportsBucket;

    const [metadata] = await bucketRef.file(filePath).getMetadata();

    return {
        size: Number(metadata.size || 0),
        contentType: metadata.contentType || 'application/octet-stream',
        updated: new Date(metadata.updated as string),
        metadata: (metadata.metadata as Record<string, string>) || {},
    };
}

export const gcsService = {
    uploadMediaAsset,
    uploadDatasetFile,
    getSignedUploadUrl,
    getSignedDownloadUrl,
    deleteFile,
    listFiles,
    copyFile,
    getFileMetadata,
};

export default gcsService;
