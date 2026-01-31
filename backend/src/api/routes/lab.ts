import express from 'express';
import { labService } from '../../services/lab/lab-service.js';

export const labRouter = express.Router();

// GET /api/lab/datasets
labRouter.get('/datasets', async (req, res) => {
    try {
        const datasets = await labService.listDatasets();
        res.json({ data: datasets });
    } catch (error) {
        res.status(500).json({ error: 'Failed to list datasets' });
    }
});

// GET /api/lab/datasets/:id
labRouter.get('/datasets/:id', async (req, res) => {
    try {
        const dataset = await labService.getDataset(req.params.id);
        if (!dataset) return res.status(404).json({ error: 'Dataset not found' });
        res.json({ data: dataset });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get dataset' });
    }
});

// POST /api/lab/datasets
// Create a new dataset container
labRouter.post('/datasets', async (req, res) => {
    try {
        const { title, category, price } = req.body;
        const dataset = await labService.createDataset(title, category, price);
        res.json({ data: dataset });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create dataset' });
    }
});

// POST /api/lab/process-video
// Upload/Process a video into a dataset
labRouter.post('/process-video', async (req, res) => {
    try {
        const { datasetId, filename, duration } = req.body;
        // In real flow, we'd handle Multer file upload here.
        // For simulation, we just take the filename and start mock proc.

        const video = await labService.processVideoUpload(datasetId, filename, duration || 300);
        res.json({ data: video, message: "Video processing started" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to start processing' });
    }
});
