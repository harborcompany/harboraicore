/**
 * Harbor ML - Presentation API Routes
 * Endpoints for generating dataset presentations
 */

import { Router, Request, Response } from 'express';
import { requireScope } from '../middleware/auth.js';
import { datasetPresentationGenerator } from '../../services/dataset/presentation-generator.js';

export const presentationRouter = Router();

/**
 * Generate dataset presentation (JSON)
 * GET /api/presentation/:datasetId
 */
presentationRouter.get('/:datasetId', requireScope('datasets:read'), async (req: Request, res: Response) => {
    const { datasetId } = req.params;

    try {
        const presentation = await datasetPresentationGenerator.generatePresentation(datasetId);
        res.json({ data: presentation });
    } catch (error: any) {
        if (error.message?.includes('not found')) {
            res.status(404).json({ error: 'Dataset not found' });
        } else {
            console.error('Error generating presentation:', error);
            res.status(500).json({ error: 'Failed to generate presentation' });
        }
    }
});

/**
 * Generate dataset presentation (HTML)
 * GET /api/presentation/:datasetId/html
 */
presentationRouter.get('/:datasetId/html', requireScope('datasets:read'), async (req: Request, res: Response) => {
    const { datasetId } = req.params;

    try {
        const html = await datasetPresentationGenerator.generateHTML(datasetId);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error: any) {
        if (error.message?.includes('not found')) {
            res.status(404).json({ error: 'Dataset not found' });
        } else {
            console.error('Error generating HTML presentation:', error);
            res.status(500).json({ error: 'Failed to generate presentation' });
        }
    }
});

/**
 * Download dataset presentation (HTML file)
 * GET /api/presentation/:datasetId/download
 */
presentationRouter.get('/:datasetId/download', requireScope('datasets:read'), async (req: Request, res: Response) => {
    const { datasetId } = req.params;

    try {
        const html = await datasetPresentationGenerator.generateHTML(datasetId);
        const filename = `harbor-dataset-${datasetId.slice(0, 8)}-presentation.html`;

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(html);
    } catch (error: any) {
        if (error.message?.includes('not found')) {
            res.status(404).json({ error: 'Dataset not found' });
        } else {
            console.error('Error generating presentation:', error);
            res.status(500).json({ error: 'Failed to generate presentation' });
        }
    }
});
