/**
 * Temporal Memory System
 * Implements time-based decay, reinforcement, and pruning for memory events
 * 
 * Key concepts:
 * - Exponential decay: older memories are weighted less
 * - Reinforcement: accessing a memory increases its weight
 * - Pruning: expired/low-weight memories are removed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

export interface TemporalConfig {
    halfLifeHours: number;      // Time for weight to decay to 50%
    reinforcementBoost: number; // Weight boost on access
    minWeight: number;          // Below this, consider pruning
    maxAge: number;             // Max age in hours before forced prune
}

const DEFAULT_CONFIG: TemporalConfig = {
    halfLifeHours: 168,         // 1 week
    reinforcementBoost: 0.2,    // +20% weight on access
    minWeight: 0.1,             // 10% threshold
    maxAge: 2160,               // 90 days
};

/**
 * Temporal Memory Manager
 * Handles decay calculations, reinforcement, and cleanup
 */
export class TemporalMemory {
    private config: TemporalConfig;

    constructor(config?: Partial<TemporalConfig>) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Calculate decay factor using exponential decay
     * weight = initial_weight * e^(-λ * t)
     * where λ = ln(2) / half_life
     */
    calculateDecay(createdAt: Date, initialWeight: number = 1.0): number {
        const ageMs = Date.now() - createdAt.getTime();
        const ageHours = ageMs / (1000 * 60 * 60);

        // λ = ln(2) / half_life
        const lambda = Math.LN2 / this.config.halfLifeHours;

        // Exponential decay
        const decayFactor = Math.exp(-lambda * ageHours);

        return Math.max(initialWeight * decayFactor, 0);
    }

    /**
     * Get effective weight for a memory event
     * Combines base weight, decay, and reinforcement bonus
     */
    getEffectiveWeight(
        createdAt: Date,
        baseWeight: number,
        reinforcedCount: number
    ): number {
        const decayedWeight = this.calculateDecay(createdAt, baseWeight);

        // Reinforcement bonus (diminishing returns)
        const reinforcementMultiplier = 1 + (
            this.config.reinforcementBoost * Math.log2(reinforcedCount + 1)
        );

        return decayedWeight * reinforcementMultiplier;
    }

    /**
     * Reinforce a memory (boost its weight when accessed)
     */
    async reinforceMemory(memoryId: string): Promise<void> {
        const memory = await prisma.memoryEvent.findUnique({
            where: { id: memoryId }
        });

        if (!memory) return;

        // Calculate new base weight with reinforcement
        const currentEffective = this.getEffectiveWeight(
            memory.createdAt,
            memory.weight,
            memory.reinforced
        );

        await prisma.memoryEvent.update({
            where: { id: memoryId },
            data: {
                reinforced: { increment: 1 },
                weight: Math.min(currentEffective * 1.1, 2.0), // Cap at 2x
                updatedAt: new Date()
            }
        });
    }

    /**
     * Batch reinforce memories by entity
     */
    async reinforceByEntity(entityId: string): Promise<number> {
        const memories = await prisma.memoryEvent.findMany({
            where: { entityId }
        });

        let reinforced = 0;
        for (const memory of memories) {
            await this.reinforceMemory(memory.id);
            reinforced++;
        }

        return reinforced;
    }

    /**
     * Prune expired and low-weight memories
     */
    async pruneExpired(): Promise<{ pruned: number; remaining: number }> {
        const cutoffDate = new Date(
            Date.now() - (this.config.maxAge * 60 * 60 * 1000)
        );

        // Delete expired by TTL
        const expiredResult = await prisma.memoryEvent.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lte: new Date() } },
                    { createdAt: { lte: cutoffDate } }
                ]
            }
        });

        // Find and delete low-weight memories
        const allMemories = await prisma.memoryEvent.findMany({
            select: {
                id: true,
                createdAt: true,
                weight: true,
                reinforced: true
            }
        });

        const lowWeightIds: string[] = [];
        for (const mem of allMemories) {
            const effective = this.getEffectiveWeight(
                mem.createdAt,
                mem.weight,
                mem.reinforced
            );
            if (effective < this.config.minWeight) {
                lowWeightIds.push(mem.id);
            }
        }

        const lowWeightResult = await prisma.memoryEvent.deleteMany({
            where: { id: { in: lowWeightIds } }
        });

        const remaining = await prisma.memoryEvent.count();

        return {
            pruned: expiredResult.count + lowWeightResult.count,
            remaining
        };
    }

    /**
     * Get decay stats for debugging/monitoring
     */
    async getDecayStats(): Promise<{
        total: number;
        avgWeight: number;
        avgAge: number;
        distribution: { range: string; count: number }[];
    }> {
        const memories = await prisma.memoryEvent.findMany({
            select: {
                id: true,
                createdAt: true,
                weight: true,
                reinforced: true
            }
        });

        if (memories.length === 0) {
            return {
                total: 0,
                avgWeight: 0,
                avgAge: 0,
                distribution: []
            };
        }

        let totalWeight = 0;
        let totalAge = 0;
        const buckets = {
            'high (>0.7)': 0,
            'medium (0.3-0.7)': 0,
            'low (<0.3)': 0
        };

        for (const mem of memories) {
            const effective = this.getEffectiveWeight(
                mem.createdAt,
                mem.weight,
                mem.reinforced
            );
            totalWeight += effective;

            const ageHours = (Date.now() - mem.createdAt.getTime()) / (1000 * 60 * 60);
            totalAge += ageHours;

            if (effective > 0.7) buckets['high (>0.7)']++;
            else if (effective > 0.3) buckets['medium (0.3-0.7)']++;
            else buckets['low (<0.3)']++;
        }

        return {
            total: memories.length,
            avgWeight: totalWeight / memories.length,
            avgAge: totalAge / memories.length,
            distribution: Object.entries(buckets).map(([range, count]) => ({
                range,
                count
            }))
        };
    }

    /**
     * Apply decay to all memories (batch update)
     * Call this periodically (e.g., daily cron)
     */
    async applyDecayBatch(): Promise<number> {
        const memories = await prisma.memoryEvent.findMany({
            select: { id: true, createdAt: true, weight: true, reinforced: true }
        });

        let updated = 0;
        for (const mem of memories) {
            const newWeight = this.getEffectiveWeight(
                mem.createdAt,
                mem.weight,
                mem.reinforced
            );

            // Only update if weight changed significantly
            if (Math.abs(newWeight - mem.weight) > 0.01) {
                await prisma.memoryEvent.update({
                    where: { id: mem.id },
                    data: { weight: newWeight }
                });
                updated++;
            }
        }

        return updated;
    }
}

// Singleton instance
export const temporalMemory = new TemporalMemory();
