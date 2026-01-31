/**
 * User Memory Service
 * Manages user-specific memory profiles, preferences, and context
 * 
 * Key features:
 * - Static context: Always-relevant user info (role, org, preferences)
 * - Dynamic context: Recent activity, episodic memories
 * - Search patterns: Learned query patterns for personalization
 * - Knowledge evolution: Updates and forgetfulness handling
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { temporalMemory, TemporalMemory } from './temporal-memory.js';

const prisma = new PrismaClient() as any;

export interface UserProfile {
    userId: string;
    staticContext: {
        role?: string;
        organization?: string;
        preferences?: Record<string, any>;
        expertise?: string[];
    };
    dynamicContext: {
        recentQueries?: string[];
        recentDatasets?: string[];
        currentSession?: {
            startedAt: Date;
            queryCount: number;
        };
    };
    searchPatterns: string[];
    preferredTypes: string[];
    topDatasets: string[];
    stats: {
        totalQueries: number;
        avgQueryDepth: number;
        lastQueryAt: Date | null;
    };
}

export interface MemoryAddRequest {
    userId: string;
    entityId: string;
    entityType: 'query' | 'view' | 'purchase' | 'annotate' | 'search';
    content: string;
    metadata?: Record<string, any>;
    source?: string;
    ttlHours?: number;
}

/**
 * User Memory Service
 * Handles user profile management and memory operations
 */
export class UserMemoryService {
    private temporal: TemporalMemory;
    private sessionCache: Map<string, UserProfile['dynamicContext']['currentSession']>;

    constructor() {
        this.temporal = temporalMemory;
        this.sessionCache = new Map();
    }

    /**
     * Get or create user memory profile
     */
    async getProfile(userId: string): Promise<UserProfile> {
        let memory = await prisma.userMemory.findUnique({
            where: { userId }
        });

        if (!memory) {
            memory = await prisma.userMemory.create({
                data: {
                    userId,
                    staticContext: {},
                    dynamicContext: {},
                    searchPatterns: [],
                    preferredTypes: [],
                    topDatasets: []
                }
            });
        }

        // Include current session if active
        const currentSession = this.sessionCache.get(userId);

        return {
            userId: memory.userId,
            staticContext: memory.staticContext as UserProfile['staticContext'],
            dynamicContext: {
                ...(memory.dynamicContext as UserProfile['dynamicContext']),
                currentSession
            },
            searchPatterns: memory.searchPatterns,
            preferredTypes: memory.preferredTypes,
            topDatasets: memory.topDatasets,
            stats: {
                totalQueries: memory.totalQueries,
                avgQueryDepth: memory.avgQueryDepth,
                lastQueryAt: memory.lastQueryAt
            }
        };
    }

    /**
     * Update static context (preferences, role, etc.)
     */
    async updateStaticContext(
        userId: string,
        context: Partial<UserProfile['staticContext']>
    ): Promise<UserProfile> {
        const existing = await this.getProfile(userId);

        await prisma.userMemory.update({
            where: { userId },
            data: {
                staticContext: {
                    ...existing.staticContext,
                    ...context
                }
            }
        });

        return this.getProfile(userId);
    }

    /**
     * Add a memory event (query, view, etc.)
     */
    async addMemory(request: MemoryAddRequest): Promise<string> {
        const expiresAt = request.ttlHours
            ? new Date(Date.now() + request.ttlHours * 60 * 60 * 1000)
            : undefined;

        const event = await prisma.memoryEvent.create({
            data: {
                id: uuidv4(),
                userId: request.userId,
                entityId: request.entityId,
                entityType: request.entityType,
                content: request.content,
                metadata: request.metadata || {},
                source: request.source,
                expiresAt,
                weight: 1.0,
                reinforced: 0
            }
        });

        // Update user memory stats
        await this.updateStats(request.userId, request.entityType, request.entityId);

        return event.id;
    }

    /**
     * Record a search/query and learn from it
     */
    async recordQuery(
        userId: string,
        query: string,
        datasetId?: string,
        depth: number = 2
    ): Promise<void> {
        // Add as memory event
        await this.addMemory({
            userId,
            entityId: datasetId || 'global',
            entityType: 'query',
            content: query,
            metadata: { depth, datasetId }
        });

        // Update dynamic context with recent query
        const profile = await this.getProfile(userId);
        const recentQueries = profile.dynamicContext.recentQueries || [];

        // Keep last 10 queries
        const updatedQueries = [query, ...recentQueries].slice(0, 10);

        // Update recent datasets
        const recentDatasets = profile.dynamicContext.recentDatasets || [];
        let updatedDatasets = recentDatasets;
        if (datasetId && !recentDatasets.includes(datasetId)) {
            updatedDatasets = [datasetId, ...recentDatasets].slice(0, 5);
        }

        // Learn search patterns (simple: extract keywords)
        const patterns = this.extractPatterns(query, profile.searchPatterns);

        await prisma.userMemory.update({
            where: { userId },
            data: {
                dynamicContext: {
                    ...profile.dynamicContext,
                    recentQueries: updatedQueries,
                    recentDatasets: updatedDatasets
                },
                searchPatterns: patterns,
                totalQueries: { increment: 1 },
                avgQueryDepth: (profile.stats.avgQueryDepth * profile.stats.totalQueries + depth) /
                    (profile.stats.totalQueries + 1),
                lastQueryAt: new Date()
            }
        });

        // Update top datasets if queried
        if (datasetId) {
            await this.updateTopDatasets(userId, datasetId);
        }
    }

    /**
     * Get personalized context for RAG query
     */
    async getQueryContext(userId: string): Promise<{
        preferredTypes: string[];
        topDatasets: string[];
        recentPatterns: string[];
        contextHints: string[];
    }> {
        const profile = await this.getProfile(userId);

        // Build context hints from static context
        const contextHints: string[] = [];
        if (profile.staticContext.role) {
            contextHints.push(`User role: ${profile.staticContext.role}`);
        }
        if (profile.staticContext.expertise?.length) {
            contextHints.push(`Expertise: ${profile.staticContext.expertise.join(', ')}`);
        }

        return {
            preferredTypes: profile.preferredTypes,
            topDatasets: profile.topDatasets,
            recentPatterns: profile.searchPatterns.slice(0, 5),
            contextHints
        };
    }

    /**
     * Get related memories for context augmentation
     */
    async getRelatedMemories(
        userId: string,
        query: string,
        limit: number = 5
    ): Promise<Array<{ content: string; weight: number; type: string }>> {
        // Get user's memories, sorted by effective weight
        const memories = await prisma.memoryEvent.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50 // Get more, then filter by weight
        });

        // Calculate effective weights and sort
        const weighted = memories.map((mem: any) => ({
            id: mem.id,
            content: mem.content,
            type: mem.entityType,
            weight: this.temporal.getEffectiveWeight(
                mem.createdAt,
                mem.weight,
                mem.reinforced
            )
        }));

        weighted.sort((a: any, b: any) => b.weight - a.weight);

        // Simple relevance filter (could be enhanced with embeddings)
        const queryLower = query.toLowerCase();
        const relevant = weighted.filter((mem: any) =>
            mem.content.toLowerCase().includes(queryLower) ||
            queryLower.includes(mem.content.toLowerCase().slice(0, 20))
        );

        return relevant.slice(0, limit).map((m: any) => ({
            content: m.content,
            weight: m.weight,
            type: m.type
        }));
    }

    /**
     * Evolve knowledge - handle updates and forgetfulness
     */
    async evolveKnowledge(userId: string): Promise<{
        reinforced: number;
        pruned: number;
        patternsLearned: number;
    }> {
        // Reinforce frequently accessed memories
        const memories = await prisma.memoryEvent.findMany({
            where: { userId },
            orderBy: { reinforced: 'desc' },
            take: 10
        });

        let reinforced = 0;
        for (const mem of memories) {
            if (mem.reinforced > 0) {
                await this.temporal.reinforceMemory(mem.id);
                reinforced++;
            }
        }

        // Prune low-weight memories
        const { pruned } = await this.temporal.pruneExpired();

        // Learn patterns from recent queries
        const profile = await this.getProfile(userId);
        const newPatterns = this.consolidatePatterns(profile.searchPatterns);

        if (newPatterns.length !== profile.searchPatterns.length) {
            await prisma.userMemory.update({
                where: { userId },
                data: { searchPatterns: newPatterns }
            });
        }

        return {
            reinforced,
            pruned,
            patternsLearned: newPatterns.length - profile.searchPatterns.length
        };
    }

    /**
     * Start a session for a user
     */
    startSession(userId: string): void {
        this.sessionCache.set(userId, {
            startedAt: new Date(),
            queryCount: 0
        });
    }

    /**
     * End session and persist dynamic context
     */
    async endSession(userId: string): Promise<void> {
        const session = this.sessionCache.get(userId);
        if (!session) return;

        // Could persist session stats to dynamic context
        this.sessionCache.delete(userId);
    }

    // --- Private helpers ---

    private async updateStats(
        userId: string,
        eventType: string,
        entityId: string
    ): Promise<void> {
        if (eventType === 'view' || eventType === 'search') {
            await this.updateTopDatasets(userId, entityId);
        }
    }

    private async updateTopDatasets(userId: string, datasetId: string): Promise<void> {
        const profile = await this.getProfile(userId);
        const top = profile.topDatasets;

        // Move to front if exists, or add
        const idx = top.indexOf(datasetId);
        if (idx > 0) {
            top.splice(idx, 1);
            top.unshift(datasetId);
        } else if (idx === -1) {
            top.unshift(datasetId);
        }

        // Keep top 10
        const updated = top.slice(0, 10);

        await prisma.userMemory.update({
            where: { userId },
            data: { topDatasets: updated }
        });
    }

    private extractPatterns(query: string, existing: string[]): string[] {
        // Simple pattern extraction: significant words
        const words = query
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3);

        const newPatterns = [...new Set([...existing, ...words])];
        return newPatterns.slice(0, 50); // Cap at 50 patterns
    }

    private consolidatePatterns(patterns: string[]): string[] {
        // Remove duplicates and very similar patterns
        const unique = [...new Set(patterns)];

        // Could do more sophisticated consolidation here
        // For now, just dedupe
        return unique.slice(0, 50);
    }
}

// Singleton instance
export const userMemoryService = new UserMemoryService();
