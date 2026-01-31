/**
 * RAG Engine - Enhanced Cognee Adapter v2
 * Graph RAG using Cognee for semantic knowledge graphs
 * 
 * V2 Enhancements:
 * - User context integration
 * - Temporal memory weighting
 * - Knowledge evolution
 * - SuperMemory fallback
 */

import { v4 as uuidv4 } from 'uuid';
import { userMemoryService, UserProfile } from './user-memory.js';
import { temporalMemory } from './temporal-memory.js';


export interface CogneeConfig {
    baseUrl: string;
    apiKey?: string;
    graphId: string;
    useTemporalWeighting: boolean;
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

    // V2: Weight and relevance
    weight?: number;
    relevanceScore?: number;
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
    // V2: User context
    userId?: string;
    includeUserContext?: boolean;
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
    // V2: Context used
    userContext?: {
        preferredTypes: string[];
        patternsApplied: string[];
    };
}

/**
 * Enhanced Cognee Adapter for Graph RAG (V2)
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
            useTemporalWeighting: config?.useTemporalWeighting ?? true,
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
        return entities.map(e => ({
            id: uuidv4(),
            mediaId,
            type: e.type,
            content: e.content,
            metadata: e.metadata || {},
            weight: 1.0
        }));
    }

    /**
     * Query knowledge graph (basic)
     */
    async query(params: GraphQuery): Promise<GraphSearchResult> {
        const { query, filters, depth = 2, limit = 20, userId, includeUserContext } = params;

        // Get user context if requested
        let userContext: GraphSearchResult['userContext'] = undefined;
        let enhancedFilters = { ...filters };

        if (userId && includeUserContext) {
            const context = await userMemoryService.getQueryContext(userId);
            userContext = {
                preferredTypes: context.preferredTypes,
                patternsApplied: context.recentPatterns
            };

            // Boost preferred types in filters
            if (context.preferredTypes.length > 0) {
                enhancedFilters.preferred_types = context.preferredTypes;
            }

            // Record this query for learning
            await userMemoryService.recordQuery(
                userId,
                query,
                filters?.media_id,
                depth
            );
        }

        const request = {
            query,
            filters: enhancedFilters,
            depth,
            limit
        };

        const result = await this.callCognee<any>('POST', '/graph/search', request);

        // Map Python result to TypeScript interface
        let entities: MediaEntity[] = (result.entities || []).map((e: any) => ({
            id: e.id,
            mediaId: e.media_id,
            type: e.entity_type,
            content: e.content,
            metadata: e.metadata || {},
            relationships: [],
            weight: 1.0
        }));

        // Apply temporal weighting if enabled
        if (this.config.useTemporalWeighting) {
            entities = await this.applyTemporalWeighting(entities);
        }

        // Reconstruct relationships map
        const relationships = result.relationships || [];
        const relevanceScores = new Map<string, number>(
            Object.entries(result.relevance_scores || {})
        );

        return {
            entities,
            relationships,
            relevanceScores,
            userContext
        };
    }

    /**
     * Query with full user context (V2 main method)
     */
    async queryWithContext(
        userId: string,
        query: string,
        options?: {
            datasetId?: string;
            depth?: number;
            limit?: number;
            filters?: Record<string, any>;
        }
    ): Promise<GraphSearchResult> {
        // Start user session if not active
        userMemoryService.startSession(userId);

        // Get user's related memories for context augmentation
        const relatedMemories = await userMemoryService.getRelatedMemories(userId, query, 3);

        // Build enhanced query with memory context
        let enhancedQuery = query;
        if (relatedMemories.length > 0) {
            const contextStr = relatedMemories.map(m => m.content).join('; ');
            enhancedQuery = `${query} (context: ${contextStr})`;
        }

        // Perform graph search with user context
        const result = await this.query({
            query: enhancedQuery,
            filters: {
                ...options?.filters,
                ...(options?.datasetId ? { media_id: options.datasetId } : {})
            },
            depth: options?.depth || 2,
            limit: options?.limit || 20,
            userId,
            includeUserContext: true
        });



        return result;
    }

    /**
     * Evolve knowledge based on entity access
     */
    async evolve(entityId: string): Promise<void> {
        // Reinforce the accessed entity in temporal memory
        await temporalMemory.reinforceByEntity(entityId);


    }

    /**
     * Apply temporal weighting to entities
     */
    private async applyTemporalWeighting(entities: MediaEntity[]): Promise<MediaEntity[]> {
        // For now, apply mock weighting (would need entity creation dates)
        // In production, this would query the MemoryEvent table
        return entities.map(e => ({
            ...e,
            weight: e.weight || 1.0
        }));
    }

    /**
     * Get memory stats for an entity
     */
    async getEntityStats(entityId: string): Promise<{
        accessCount: number;
        avgWeight: number;
        lastAccessed: Date | null;
    }> {
        const stats = await temporalMemory.getDecayStats();

        return {
            accessCount: 0, // Would need entity-specific tracking
            avgWeight: stats.avgWeight,
            lastAccessed: null
        };
    }

    /**
     * Prune old/irrelevant knowledge
     */
    async prune(): Promise<{ pruned: number }> {
        const result = await temporalMemory.pruneExpired();
        return { pruned: result.pruned };
    }
}

export const cogneeAdapter = new CogneeAdapter();
