
// Ledger-based Analytics Service
// These derive from the revenue_ledger and payout_ledger mock data

export interface AnalyticsSummary {
    revenueMTD: number;
    revenueQTD: number;
    revenueTotal: number;
    pendingPayouts: number;
    averageMargin: number;
    revenueBySource: {
        dataset_license: number;
        api_usage: number;
        ads_platform: number;
        enterprise: number;
    };
    payoutForecast: {
        date: string;
        amount: number;
    }[];
}

// Mock Ledger Data
const REVENUE_LEDGER = [
    { id: '1', source_type: 'dataset_license', amount: 12500, margin_percent: 85, recognized_at: '2026-02-01' },
    { id: '2', source_type: 'api_usage', amount: 3200, margin_percent: 92, recognized_at: '2026-02-05' },
    { id: '3', source_type: 'ads_platform', amount: 4500, margin_percent: 78, recognized_at: '2026-02-10' },
    { id: '4', source_type: 'enterprise', amount: 25000, margin_percent: 82, recognized_at: '2026-01-15' },
    { id: '5', source_type: 'dataset_license', amount: 8000, margin_percent: 85, recognized_at: '2026-02-12' },
];

const PAYOUT_LEDGER = [
    { id: 'p1', amount: 450, payout_status: 'pending', scheduled_for: '2026-02-28' },
    { id: 'p2', amount: 1200, payout_status: 'scheduled', scheduled_for: '2026-02-28' },
    { id: 'p3', amount: 350, payout_status: 'pending', scheduled_for: '2026-03-05' },
    { id: 'p4', amount: 800, payout_status: 'paid', scheduled_for: '2026-01-30' },
];

export const analyticsService = {
    getSummary: (): AnalyticsSummary => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);

        const mtdRevenue = REVENUE_LEDGER
            .filter(r => new Date(r.recognized_at) >= startOfMonth)
            .reduce((sum, r) => sum + r.amount, 0);

        const qtdRevenue = REVENUE_LEDGER
            .filter(r => new Date(r.recognized_at) >= startOfQuarter)
            .reduce((sum, r) => sum + r.amount, 0);

        const totalRevenue = REVENUE_LEDGER.reduce((sum, r) => sum + r.amount, 0);

        const pendingPayouts = PAYOUT_LEDGER
            .filter(p => p.payout_status === 'pending' || p.payout_status === 'scheduled')
            .reduce((sum, p) => sum + p.amount, 0);

        const avgMargin = REVENUE_LEDGER.reduce((sum, r) => sum + r.margin_percent, 0) / REVENUE_LEDGER.length;

        const breakdown = {
            dataset_license: REVENUE_LEDGER.filter(r => r.source_type === 'dataset_license').reduce((s, r) => s + r.amount, 0),
            api_usage: REVENUE_LEDGER.filter(r => r.source_type === 'api_usage').reduce((s, r) => s + r.amount, 0),
            ads_platform: REVENUE_LEDGER.filter(r => r.source_type === 'ads_platform').reduce((s, r) => s + r.amount, 0),
            enterprise: REVENUE_LEDGER.filter(r => r.source_type === 'enterprise').reduce((s, r) => s + r.amount, 0),
        };

        const forecast = PAYOUT_LEDGER
            .filter(p => p.payout_status !== 'paid')
            .map(p => ({ date: p.scheduled_for, amount: p.amount }));

        return {
            revenueMTD: mtdRevenue,
            revenueQTD: qtdRevenue,
            revenueTotal: totalRevenue,
            pendingPayouts,
            averageMargin: avgMargin,
            revenueBySource: breakdown,
            payoutForecast: forecast,
        };
    }
};
