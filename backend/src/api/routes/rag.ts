/**
 * RAG Query API Routes
 * Query datasets contextually using retrieval pipelines
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireScope } from '../middleware/auth.js';
import { CogneeAdapter } from '../../services/rag-engine/cognee-adapter.js';

export const ragRouter = Router();
const cogneeAdapter = new CogneeAdapter();

/**
 * Query a dataset using RAG (via Cognee)
 * POST /api/rag/query
 */
ragRouter.post('/query', requireScope('rag:query'), async (req: Request, res: Response) => {
    const {
        datasetId,
        query,
        topK = 10,
        filters = {},
        depth = 2
    } = req.body;

    if (!datasetId || !query) {
        res.status(400).json({ error: 'datasetId and query are required' });
        return;
    }

    try {
        const startTime = Date.now();

        // Use Cognee Adapter for Graph RAG search
        const searchResult = await cogneeAdapter.query({
            query,
            filters: { ...filters, media_id: datasetId }, // filtering by dataset/media
            depth: Number(depth),
            limit: Number(topK)
        });

        // Map Cognee results to API response format
        const results = searchResult.entities.map((entity, i) => ({
            id: entity.id,
            score: searchResult.relevanceScores.get(entity.id) || 0,
            content: entity.content,
            type: entity.type,
            metadata: entity.metadata,
            relationships: entity.relationships
        }));

        res.json({
            data: {
                queryId: uuidv4(),
                datasetId,
                query,
                results,
                totalResults: results.length,
                processingTimeMs: Date.now() - startTime,
                relationships: searchResult.relationships // Include graph edges
            },
            meta: {
                engine: 'cognee-graph-rag',
                provider: process.env.COGNEE_LLM_PROVIDER || 'gemini', // Default to what we set
            }
        });

    } catch (error) {
        console.error('RAG query error:', error);
        res.status(500).json({ error: 'Failed to process RAG query' });
    }
});

/**
 * Add content to RAG Graph
 * POST /api/rag/ingest
 */
ragRouter.post('/ingest', requireScope('rag:write'), async (req: Request, res: Response) => {
    const { datasetId, content, type = 'text', metadata = {} } = req.body;

    if (!datasetId || !content) {
        res.status(400).json({ error: 'datasetId and content are required' });
        return;
    }

    try {
        const entities = await cogneeAdapter.addToGraph(datasetId, [{
            type,
            content,
            metadata
        }]);

        res.json({
            data: {
                datasetId,
                entitiesCreated: entities.length,
                entities
            }
        });
    } catch (error) {
        console.error('RAG ingest error:', error);
        res.status(500).json({ error: 'Failed to ingest content' });
    }
});

/**
 * Get RAG Status
 */
ragRouter.get('/status', async (req: Request, res: Response) => {
    res.json({
        data: {
            status: 'operational',
            engine: 'cognee',
            graph_db: process.env.COGNEE_GRAPH_DB || 'networkx',
            llm_provider: process.env.COGNEE_LLM_PROVIDER || 'gemini'
        }
    });
});
