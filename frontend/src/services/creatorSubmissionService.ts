/**
 * Creator Submission Service
 * API-ready shape, localStorage-backed for now.
 */

// ============================================
// TYPES
// ============================================

export type SubmissionStatus =
    | 'uploaded'
    | 'auto_reviewed'
    | 'in_annotation_bin'
    | 'human_review'
    | 'approved'
    | 'rejected';

export type SubmissionCategory = 'lego' | 'voice';

export interface CreatorSubmission {
    id: string;
    userId: string;
    title: string;
    category: SubmissionCategory;
    fileUrl: string;
    duration: string; // formatted "6:12"
    durationSeconds: number;
    resolution: string;
    status: SubmissionStatus;
    reviewNotes: string | null;
    autoQaScore: number | null;
    humanQaScore: number | null;
    metadataComplete: boolean;
    blurScore: number | null;
    lightingScore: number | null;
    objectConfidence: number | null;
    estimatedPayment: number; // cents
    finalPayment: number | null; // cents
    createdAt: string;
    reviewedAt: string | null;
}

export interface CreatorEarning {
    id: string;
    userId: string;
    submissionId: string;
    submissionTitle: string;
    amount: number; // cents
    status: 'pending' | 'approved' | 'paid';
    paidAt: string | null;
    createdAt: string;
}

export interface Opportunity {
    id: string;
    title: string;
    description: string;
    category: SubmissionCategory;
    icon: string;
    payoutRangeMin: number; // cents
    payoutRangeMax: number; // cents
    requirements: string[];
    deadline: string | null;
    slotsAvailable: number | null;
    active: boolean;
}

export interface CreatorProfile {
    totalEarned: number; // cents
    pendingReview: number; // cents
    availableToWithdraw: number; // cents
    nextPayoutDate: string;
    submissionsApproved: number;
    submissionsUnderReview: number;
    submissionsNeedsRevision: number;
    submissionsRejected: number;
    profileCompletion: number; // 0-100
    identityVerified: boolean;
    paymentMethodAdded: boolean;
    highQualityCount: number;
    referralBonusActive: boolean;
}

// ============================================
// STORAGE
// ============================================

const STORAGE_KEY = 'harbor_creator_submissions';
const EARNINGS_KEY = 'harbor_creator_earnings';

const loadData = <T>(key: string, fallback: T[]): T[] => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
};

const saveData = <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// ============================================
// REFERENCE DATA — Active Opportunities
// ============================================

const OPPORTUNITIES: Opportunity[] = [
    {
        id: 'opp_001', title: 'LEGO Build Videos', icon: '🧱',
        description: 'Record hands-only LEGO build videos for AI training data.',
        category: 'lego', payoutRangeMin: 800, payoutRangeMax: 2000,
        requirements: ['5–10 minutes', 'No audio', 'Hands only', 'Build from scratch', 'Clean background', 'Good lighting'],
        deadline: '2026-03-01T00:00:00Z', slotsAvailable: 50, active: true,
    },
    {
        id: 'opp_002', title: 'Audio Data Collection', icon: '🎙',
        description: 'Submit clear audio recordings for speech model training.',
        category: 'voice', payoutRangeMin: 300, payoutRangeMax: 1000,
        requirements: ['Clear speech', 'No background noise', '1–5 minutes', 'Quiet environment'],
        deadline: null, slotsAvailable: null, active: true,
    },
];

// ============================================
// SERVICE
// ============================================

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// No seed data initialization — production mode

export const creatorService = {
    async getSubmissions(): Promise<CreatorSubmission[]> {
        await delay(300);
        return loadData<CreatorSubmission>(STORAGE_KEY, []);
    },

    async createSubmission(data: {
        title: string;
        category: SubmissionCategory;
        fileName: string;
        fileUrl?: string;
    }): Promise<CreatorSubmission> {
        await delay(300);
        const submissions = loadData<CreatorSubmission>(STORAGE_KEY, []);
        const newSub: CreatorSubmission = {
            id: `sub_${Date.now()}`,
            userId: 'user_1',
            title: data.title,
            category: data.category,
            fileUrl: data.fileUrl || '',
            duration: '0:00',
            durationSeconds: 0,
            resolution: '1920x1080',
            status: 'uploaded',
            reviewNotes: null,
            autoQaScore: null,
            humanQaScore: null,
            metadataComplete: false,
            blurScore: null,
            lightingScore: null,
            objectConfidence: null,
            estimatedPayment: data.category === 'lego' ? 1500 : 500,
            finalPayment: null,
            createdAt: new Date().toISOString(),
            reviewedAt: null,
        };
        submissions.unshift(newSub);
        saveData(STORAGE_KEY, submissions);

        // Simulate auto-review after 8 seconds
        setTimeout(() => {
            const subs = loadData<CreatorSubmission>(STORAGE_KEY, []);
            const idx = subs.findIndex(s => s.id === newSub.id);
            if (idx !== -1) {
                subs[idx].status = 'auto_reviewed';
                subs[idx].autoQaScore = 92;
                saveData(STORAGE_KEY, subs);
            }
        }, 8000);

        return newSub;
    },

    async getEarnings(): Promise<CreatorEarning[]> {
        await delay(200);
        return loadData<CreatorEarning>(EARNINGS_KEY, []);
    },

    async getOpportunities(): Promise<Opportunity[]> {
        await delay(200);
        return [...OPPORTUNITIES];
    },

    async getProfile(): Promise<CreatorProfile> {
        await delay(200);
        const submissions = loadData<CreatorSubmission>(STORAGE_KEY, []);
        const earnings = loadData<CreatorEarning>(EARNINGS_KEY, []);

        const approved = submissions.filter(s => s.status === 'approved');
        const underReview = submissions.filter(s => ['uploaded', 'auto_reviewed', 'in_annotation_bin', 'human_review'].includes(s.status));
        const rejected = submissions.filter(s => s.status === 'rejected');

        const totalPaid = earnings.filter(e => e.status === 'paid').reduce((a, e) => a + e.amount, 0);
        const pending = earnings.filter(e => e.status === 'pending').reduce((a, e) => a + e.amount, 0);

        return {
            totalEarned: totalPaid + pending,
            pendingReview: pending,
            availableToWithdraw: totalPaid,
            nextPayoutDate: '2026-02-28',
            submissionsApproved: approved.length,
            submissionsUnderReview: underReview.length,
            submissionsNeedsRevision: 0, // Revision status removed in new naming
            submissionsRejected: rejected.length,
            profileCompletion: 80,
            identityVerified: true,
            paymentMethodAdded: true,
            highQualityCount: approved.filter(s => (s.autoQaScore || 0) >= 90).length,
            referralBonusActive: false,
        };
    },
};
