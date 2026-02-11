/**
 * Storage API Routes
 * File upload, download, and management endpoints
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { requireScope, type AuthenticatedRequest } from '../middleware/auth.js';
import { gcsService } from '../../services/storage/gcs.js';

export const storageRouter = Router();

// Configure multer for disk storage (local)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024, // 1GB max
    },
});

/**
 * Upload a media asset
 * POST /api/storage/upload
 */
storageRouter.post(
    '/upload',
    // requireScope('storage:write'), // Temporarily disabled for demo ease
    upload.single('file'),
    async (req: AuthenticatedRequest, res: Response) => {
        if (!req.file) {
            res.status(400).json({ error: 'No file provided' });
            return;
        }

        try {
            // Simulate GCS return structure
            const result = {
                url: `/uploads/${req.file.filename}`, // Local static URL
                path: req.file.path,
                size: req.file.size,
                contentType: req.file.mimetype,
                metadata: {
                    originalName: req.file.originalname,
                    uploadedBy: req.user?.id || 'demo-user'
                }
            };

            res.status(201).json({
                data: result,
                message: 'File uploaded successfully (Local)',
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Failed to upload file' });
        }
    }
);

/**
 * Get signed URL for direct upload (large files)
 * POST /api/storage/upload-url
 */
storageRouter.post('/upload-url', requireScope('storage:write'), async (req: Request, res: Response) => {
    const { filename, contentType, bucket = 'media' } = req.body;

    if (!filename || !contentType) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'filename and contentType are required',
        });
        return;
    }

    try {
        const result = await gcsService.getSignedUploadUrl(
            bucket as 'media' | 'datasets' | 'exports',
            filename,
            contentType,
            60 // 1 hour expiry
        );

        res.json({
            data: result,
            expiresIn: 3600,
        });
    } catch (error) {
        console.error('Signed URL error:', error);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
});

/**
 * Get signed download URL
 * POST /api/storage/download-url
 */
storageRouter.post('/download-url', requireScope('storage:read'), async (req: Request, res: Response) => {
    const { filePath, bucket = 'media' } = req.body;

    if (!filePath) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'filePath is required',
        });
        return;
    }

    try {
        const url = await gcsService.getSignedDownloadUrl(
            bucket as 'media' | 'datasets' | 'exports',
            filePath,
            60 // 1 hour expiry
        );

        res.json({
            data: { downloadUrl: url },
            expiresIn: 3600,
        });
    } catch (error) {
        console.error('Download URL error:', error);
        res.status(500).json({ error: 'Failed to generate download URL' });
    }
});

/**
 * List files
 * GET /api/storage/files
 */
storageRouter.get('/files', requireScope('storage:read'), async (req: Request, res: Response) => {
    const { bucket = 'media', prefix = '' } = req.query;

    try {
        const files = await gcsService.listFiles(
            bucket as 'media' | 'datasets' | 'exports',
            String(prefix)
        );

        res.json({
            data: files,
            total: files.length,
        });
    } catch (error) {
        console.error('List files error:', error);
        res.status(500).json({ error: 'Failed to list files' });
    }
});

/**
 * Delete a file
 * DELETE /api/storage/files
 */
storageRouter.delete('/files', requireScope('storage:write'), async (req: Request, res: Response) => {
    const { filePath, bucket = 'media' } = req.body;

    if (!filePath) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'filePath is required',
        });
        return;
    }

    try {
        await gcsService.deleteFile(
            bucket as 'media' | 'datasets' | 'exports',
            filePath
        );

        res.status(204).send();
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

/**
 * Get file metadata
 * GET /api/storage/files/:filePath
 */
storageRouter.get('/files/*', requireScope('storage:read'), async (req: Request, res: Response) => {
    const filePath = req.params[0];
    const { bucket = 'media' } = req.query;

    try {
        const metadata = await gcsService.getFileMetadata(
            bucket as 'media' | 'datasets' | 'exports',
            filePath
        );

        res.json({ data: metadata });
    } catch (error) {
        console.error('Get metadata error:', error);
        res.status(500).json({ error: 'Failed to get file metadata' });
    }
});
