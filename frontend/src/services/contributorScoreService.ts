/**
 * Contributor Scoring System
 * Ranks contributors based on performance signals.
 */

export type ContributorTier = 'Elite' | 'Trusted' | 'Standard' | 'At Risk';

export interface ContributorScore {
    userId: string;
    score: number; // 0-100
    tier: ContributorTier;
    signals: {
        approvedHours: number;
        rejectionCount: number;
        avgAnnotationAgreement: number;
        recentMetadataErrors: number;
        policyViolations: number;
        fraudFlags: number;
    };
    updatedAt: string;
}

const STORAGE_KEY = 'harbor_contributor_scores';

// --- Scoring Logic ---

const BASE_SCORE = 75;

export const contributorScoreService = {
    calculateScore(signals: ContributorScore['signals']): number {
        let score = BASE_SCORE;

        // Positive Signals
        score += Math.min(20, signals.approvedHours * 2); // +2 per approved hour (capped at +20)
        if (signals.avgAnnotationAgreement > 92) score += 5;
        if (signals.rejectionCount === 0 && signals.approvedHours > 0) score += 3;
        if (signals.approvedHours >= 10) score += 10;

        // Negative Signals
        score -= signals.rejectionCount * 5;
        score -= signals.recentMetadataErrors * 3;
        score -= signals.policyViolations * 10;
        score -= signals.fraudFlags * 15;

        // Bounds 0-100
        return Math.max(0, Math.min(100, score));
    },

    getTier(score: number): ContributorTier {
        if (score >= 90) return 'Elite';
        if (score >= 80) return 'Trusted';
        if (score >= 70) return 'Standard';
        return 'At Risk';
    },

    async updateScore(userId: string, signals: ContributorScore['signals']): Promise<ContributorScore> {
        const scoreValue = this.calculateScore(signals);
        const tier = this.getTier(scoreValue);

        const newScore: ContributorScore = {
            userId,
            score: scoreValue,
            tier,
            signals,
            updatedAt: new Date().toISOString()
        };

        const allScores = this.getAllScores();
        allScores[userId] = newScore;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allScores));

        return newScore;
    },

    async getScore(userId: string): Promise<ContributorScore> {
        const allScores = this.getAllScores();
        if (allScores[userId]) return allScores[userId];

        // Default setup
        return this.updateScore(userId, {
            approvedHours: 0,
            rejectionCount: 0,
            avgAnnotationAgreement: 85,
            recentMetadataErrors: 0,
            policyViolations: 0,
            fraudFlags: 0
        });
    },

    getAllScores(): Record<string, ContributorScore> {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    }
};
