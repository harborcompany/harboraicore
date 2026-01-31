/**
 * RAG Query API Routes
 * Query datasets contextually using retrieval pipelines
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireScope } from '../middleware/auth.js';
import { cogneeAdapter } from '../../services/rag-engine/cognee-adapter.js';
import { userMemoryService } from '../../services/rag-engine/user-memory.js';

export const ragRouter = Router();

/**
 * Query a dataset using RAG (via Cognee V2)
 * POST /api/rag/query
 */
ragRouter.post('/query', requireScope('rag:query'), async (req: Request, res: Response) => {
    const {
        datasetId,
        query,
        topK = 10,
        filters = {},
        depth = 2,
        usePersonalization = true
    } = req.body;

    // In a real app, userId comes from auth middleware
    // For now, use header or default for demo
    const userId = (req.headers['x-user-id'] as string) || 'default_user';

    if (!datasetId || !query) {
        res.status(400).json({ error: 'datasetId and query are required' });
        return;
    }

    try {
        const startTime = Date.now();
        let searchResult;

        if (usePersonalization) {
            // Use Enhanced V2 Query with User Context
            searchResult = await cogneeAdapter.queryWithContext(userId, query, {
                datasetId,
                depth: Number(depth),
                limit: Number(topK),
                filters
            });
        } else {
            // Direct/Legacy Query
            searchResult = await cogneeAdapter.query({
                query,
                filters: { ...filters, media_id: datasetId },
                depth: Number(depth),
                limit: Number(topK)
            });
        }

        // Map Cognee results to API response format
        const results = searchResult.entities.map((entity, i) => ({
            id: entity.id,
            score: searchResult.relevanceScores.get(entity.id) || 0,
            content: entity.content,
            type: entity.type,
            metadata: entity.metadata,
            relationships: entity.relationships,
            weight: entity.weight // V2 new field
        }));

        res.json({
            data: {
                queryId: uuidv4(),
                datasetId,
                query,
                results,
                totalResults: results.length,
                processingTimeMs: Date.now() - startTime,
                relationships: searchResult.relationships,
                userContext: searchResult.userContext // V2 applied context
            },
            meta: {
                engine: 'cognee-graph-rag-v2',
                provider: process.env.COGNEE_LLM_PROVIDER || 'gemini',
                personalized: usePersonalization
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
 * Admin: Trigger Knowledge Evolution
 * POST /api/rag/evolve
 */
ragRouter.post('/evolve', requireScope('rag:admin'), async (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'default_user';
    const { datasetId, entityId } = req.body;

    try {
        // Trigger generic evolution/pruning
        const pruneStat = await cogneeAdapter.prune();

        // Evolve specific entity if provided
        if (entityId) {
            await cogneeAdapter.evolve(entityId);
        }

        // Update user knowledge stats
        const userStats = await userMemoryService.evolveKnowledge(userId);

        res.json({
            data: {
                status: 'evolved',
                pruned: pruneStat.pruned,
                reinforced: userStats.reinforced,
                patternsLearned: userStats.patternsLearned
            }
        });
    } catch (error) {
        console.error('Evolution error:', error);
        res.status(500).json({ error: 'Failed to evolve knowledge graph' });
    }
});

/**
 * Get User Memory Profile
 * GET /api/rag/profile
 */
ragRouter.get('/profile', requireScope('rag:read'), async (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'default_user';

    try {
        const profile = await userMemoryService.getProfile(userId);
        res.json({ data: profile });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

/**
 * Get RAG Status
 */
ragRouter.get('/status', async (req: Request, res: Response) => {
    res.json({
        data: {
            status: 'operational',
            engine: 'cognee-v2',
            features: [
                'temporal-memory',
                'user-personalization',
                'knowledge-evolution'
            ],
            graph_db: process.env.COGNEE_GRAPH_DB || 'networkx',
            llm_provider: process.env.COGNEE_LLM_PROVIDER || 'gemini'
        }
    });
});
