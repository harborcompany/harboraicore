/**
 * Referral Service — Harbor ML
 * Milestone-based, tiered referral engine with token rewards.
 * localStorage-backed until backend API integration.
 */

// ============================================
// TYPES
// ============================================

export type ReferralStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export interface Referral {
    id: string;
    referrerId: string;
    referredUserId: string;
    referredName: string; // masked: e.g. "A. Smith"
    status: ReferralStatus;
    approvedHours: number;
    totalCashPaid: number; // matched to schema
    totalTokenPaid: number; // matched to schema
    milestonesHit: string[]; // e.g. ['2h', '5h', '10h']
    fraudFlag: boolean;
    createdAt: string;
}

export interface ReferralPayout {
    id: string;
    referralId: string;
    cashAmount: number;
    tokenAmount: number;
    milestone: string; // matched to schema: '2h milestone', '5h milestone', etc.
    paid: boolean;
    paidAt: string | null;
    createdAt: string;
}

export type TierName = 'none' | 'contributor' | 'data_partner' | 'strategic_partner' | 'ambassador';

export interface ReferralTier {
    name: TierName;
    label: string;
    requiredReferrals: number;
    bonusMultiplier: number; // e.g. 1.0, 1.1, 1.2
    perks: string[];
    icon: string;
}

export interface ReferralStats {
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    approvedContributors: number;
    pendingCount: number;
    rejectedCount: number;
    lifetimeEarningsCents: number;
    tokenEarnedHBR: number;
    totalApprovedHours: number;
    currentTier: ReferralTier;
    nextTier: ReferralTier | null;
    referralsToNextTier: number;
}

export interface MonthlyPerformance {
    month: string; // "Jan", "Feb", etc.
    referrals: number;
    earningsCents: number;
    approvedHours: number;
}

// ============================================
// TIER DEFINITIONS
// ============================================

export const TIERS: ReferralTier[] = [
    {
        name: 'contributor',
        label: 'Contributor',
        requiredReferrals: 1,
        bonusMultiplier: 1.0,
        perks: ['Standard milestone payouts', 'Basic dashboard access'],
        icon: '🌱',
    },
    {
        name: 'data_partner',
        label: 'Data Partner',
        requiredReferrals: 5,
        bonusMultiplier: 1.1,
        perks: ['+10% bonus on all payouts', 'Priority support', 'Early access to campaigns'],
        icon: '⚡',
    },
    {
        name: 'strategic_partner',
        label: 'Strategic Partner',
        requiredReferrals: 15,
        bonusMultiplier: 1.2,
        perks: ['+20% bonus on all payouts', 'Dedicated account manager', 'Custom referral materials'],
        icon: '🔥',
    },
    {
        name: 'ambassador',
        label: 'Ambassador',
        requiredReferrals: 50,
        bonusMultiplier: 1.5,
        perks: ['Private dataset access', 'Token multiplier (1.5×)', 'VIP events', 'Revenue sharing on data products'],
        icon: '👑',
    },
];

// ============================================
// MILESTONE DEFINITIONS
// ============================================

export const MILESTONES = [
    { hours: 2, cashCents: 10000, label: '2h Approved', description: 'Referred contributor reaches 2 hours of approved data' },
    { hours: 5, cashCents: 25000, label: '5h Approved', description: 'Referred contributor reaches 5 hours of approved data' },
    { hours: 10, cashCents: 50000, label: '10h Approved', description: 'Referred contributor reaches 10 hours of approved data' },
];

// ============================================
// STORAGE
// ============================================

const REFERRALS_KEY = 'harbor_referrals';
const PAYOUTS_KEY = 'harbor_referral_payouts';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function loadData<T>(key: string): T[] {
    try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return [];
}

function saveData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
}

// ============================================
// HELPERS
// ============================================

function getCurrentTier(approvedCount: number): ReferralTier {
    // Find the highest tier the user qualifies for
    let current = TIERS[0];
    for (const tier of TIERS) {
        if (approvedCount >= tier.requiredReferrals) {
            current = tier;
        }
    }
    return current;
}

function getNextTier(approvedCount: number): ReferralTier | null {
    for (const tier of TIERS) {
        if (approvedCount < tier.requiredReferrals) {
            return tier;
        }
    }
    return null;
}

function generateReferralCode(): string {
    return 'ref_' + Math.random().toString(36).substring(2, 10);
}

// ============================================
// SERVICE
// ============================================

export const referralService = {
    async getReferralStats(): Promise<ReferralStats> {
        await delay(200);
        const referrals = loadData<Referral>(REFERRALS_KEY);
        const payouts = loadData<ReferralPayout>(PAYOUTS_KEY);

        const approved = referrals.filter(r => r.status === 'approved');
        const pending = referrals.filter(r => r.status === 'pending');
        const rejected = referrals.filter(r => r.status === 'rejected');
        const totalHours = referrals.reduce((sum, r) => sum + r.approvedHours, 0);
        const totalCash = payouts.filter(p => p.paid).reduce((sum, p) => sum + p.cashAmount, 0);
        const totalToken = payouts.filter(p => p.paid).reduce((sum, p) => sum + p.tokenAmount, 0);
        const pendingCash = payouts.filter(p => !p.paid).reduce((sum, p) => sum + p.cashAmount, 0);

        const code = localStorage.getItem('harbor_referral_code') || generateReferralCode();
        localStorage.setItem('harbor_referral_code', code);

        const tier = getCurrentTier(approved.length);
        const next = getNextTier(approved.length);

        return {
            referralCode: code,
            referralLink: `harbor.ai/r/${code}`,
            totalReferrals: referrals.length,
            approvedContributors: approved.length,
            pendingCount: pending.length,
            rejectedCount: rejected.length,
            lifetimeEarningsCents: totalCash + pendingCash,
            tokenEarnedHBR: totalToken,
            totalApprovedHours: Math.round(totalHours * 10) / 10,
            currentTier: tier,
            nextTier: next,
            referralsToNextTier: next ? next.requiredReferrals - approved.length : 0,
        };
    },

    async getReferrals(): Promise<Referral[]> {
        await delay(200);
        return loadData<Referral>(REFERRALS_KEY).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    async getReferralPayouts(): Promise<ReferralPayout[]> {
        await delay(200);
        return loadData<ReferralPayout>(PAYOUTS_KEY).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    async getPerformanceData(): Promise<MonthlyPerformance[]> {
        await delay(200);
        const referrals = loadData<Referral>(REFERRALS_KEY);

        // Generate last 6 months
        const months: MonthlyPerformance[] = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthLabel = d.toLocaleDateString('en-US', { month: 'short' });
            const monthStart = d.getTime();
            const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).getTime();

            const monthReferrals = referrals.filter(r => {
                const ts = new Date(r.createdAt).getTime();
                return ts >= monthStart && ts <= monthEnd;
            });

            months.push({
                month: monthLabel,
                referrals: monthReferrals.length,
                earningsCents: monthReferrals.reduce((s, r) => s + r.totalCashPaid, 0),
                approvedHours: Math.round(monthReferrals.reduce((s, r) => s + r.approvedHours, 0) * 10) / 10,
            });
        }

        return months;
    },

    async copyReferralLink(): Promise<string> {
        const code = localStorage.getItem('harbor_referral_code') || generateReferralCode();
        localStorage.setItem('harbor_referral_code', code);
        const link = `https://harbor.ai/r/${code}`;
        await navigator.clipboard.writeText(link);
        return link;
    },
};
