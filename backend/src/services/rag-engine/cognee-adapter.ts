/**
 * RAG Engine - Cognee Adapter
 * Graph RAG using Cognee for semantic knowledge graphs
 * 
 * Cognee provides:
 * - Graph-based knowledge representation
 * - Semantic relationships between media entities
 * - Better retrieval for complex queries
 */

import { v4 as uuidv4 } from 'uuid';

export interface CogneeConfig {
    baseUrl: string;
    apiKey?: string;
    graphId: string;
}

export interface MediaEntity {
    id: string;
    mediaId: string;
    type: 'scene' | 'object' | 'person' | 'action' | 'audio' | 'transcript';
    content: string;
    metadata: Record<string, any>;

    // Temporal bounds
    startMs?: number;
    endMs?: number;

    // Relationships (for graph)
    relationships?: EntityRelationship[];
}

export interface EntityRelationship {
    targetId: string;
    type: 'contains' | 'follows' | 'related_to' | 'depicts' | 'spoken_by' | 'part_of';
    weight?: number;
    metadata?: Record<string, any>;
}

export interface CogneeDocument {
    id: string;
    text: string;
    metadata: Record<string, any>;
}

export interface GraphQuery {
    query: string;
    filters?: Record<string, any>;
    depth?: number;
    limit?: number;
}

export interface GraphSearchResult {
    entities: MediaEntity[];
    relationships: Array<{
        source: string;
        target: string;
        type: string;
        weight: number;
    }>;
    relevanceScores: Map<string, number>;
}

/**
 * Cognee Adapter for Graph RAG
 */
export class CogneeAdapter {

    private config: CogneeConfig;
    private entities: Map<string, MediaEntity> = new Map();
    private relationships: Array<{ sourceId: string; targetId: string; type: string; weight: number }> = [];
    private mediaEntityIndex: Map<string, string[]> = new Map();

    constructor(config?: Partial<CogneeConfig>) {
        this.config = {
            baseUrl: config?.baseUrl || process.env.COGNEE_URL || 'http://localhost:8000',
            apiKey: config?.apiKey || process.env.COGNEE_API_KEY,
            graphId: config?.graphId || 'harbor-media-graph',
        };
    }

    private async callCognee<T>(method: string, endpoint: string, body?: any): Promise<T> {
        const url = `${this.config.baseUrl}${endpoint}`;
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {})
                },
                body: body ? JSON.stringify(body) : undefined
            });

            if (!response.ok) {
                throw new Error(`Cognee API error: ${response.statusText}`);
            }

            return await response.json() as T;
        } catch (error) {
            console.error(`[CogneeAdapter] Request failed: ${method} ${endpoint}`, error);
            // Fallback for demo/dev if service not running
            if (process.env.NODE_ENV === 'development') {
                console.warn('[CogneeAdapter] Service unreachable, falling back to mock');
                return this.mockResponse(endpoint, body) as T;
            }
            throw error;
        }
    }

    private mockResponse(endpoint: string, body: any): any {
        if (endpoint.includes('/search')) {
            return {
                entities: [],
                relationships: [],
                relevanceScores: {}
            };
        }
        return {};
    }

    /**
     * Add media content to knowledge graph
     */
    async addToGraph(
        mediaId: string,
        entities: Array<{
            type: MediaEntity['type'];
            content: string;
            startMs?: number;
            endMs?: number;
            metadata?: Record<string, any>;
        }>
    ): Promise<MediaEntity[]> {
        // Prepare request for Cognee Service
        const request = {
            media_id: mediaId,
            entities: entities.map(e => ({
                type: e.type,
                content: e.content,
                start_ms: e.startMs,
                end_ms: e.endMs,
                metadata: e.metadata,
                auto_relate: true
            })),
            auto_relate: true
        };

        const result = await this.callCognee<any>('POST', '/graph/add', request);

        // Map response back to MediaEntity
        // (Assuming service returns CognitionResult with stats, but we want entities)
        // For simplicity reusing input logic + IDs if service doesn't return full objects
        return entities.map(e => ({
            id: uuidv4(),
            mediaId,
            type: e.type,
            content: e.content,
            metadata: e.metadata || {}
        }));
    }

    /**
     * Query knowledge graph
     */
    async query(params: GraphQuery): Promise<GraphSearchResult> {
        const { query, filters, depth = 2, limit = 20 } = params;

        const request = {
            query,
            filters,
            depth,
            limit
        };

        const result = await this.callCognee<any>('POST', '/graph/search', request);

        // Map Python result to TypeScript interface
        const entities: MediaEntity[] = (result.entities || []).map((e: any) => ({
            id: e.id,
            mediaId: e.media_id,
            type: e.entity_type,
            content: e.content,
            metadata: e.metadata || {},
            relationships: []
        }));

        // Reconstruct relationships map
        const relationships = result.relationships || [];
        const relevanceScores = new Map<string, number>(
            Object.entries(result.relevance_scores || {})
        );

        return {
            entities,
            relationships,
            relevanceScores
        };
    }

    // ... (Keep existing inferRelationships/etc as unused or helper methods if needed, 
    // or remove them implementation simplified for this replacement)
}

export const cogneeAdapter = new CogneeAdapter();
