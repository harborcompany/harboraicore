import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Users, DollarSign, TrendingUp, Award, Clock, ChevronRight, Coins, Shield, ArrowUpRight, UserPlus } from 'lucide-react';
import {
    referralService,
    ReferralStats,
    Referral,
    MonthlyPerformance,
    TIERS,
    MILESTONES,
    type ReferralTier,
} from '../../services/referralService';

// ============================================
// HELPER FORMATTERS
// ============================================

function formatCents(cents: number): string {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function maskName(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}. ${parts[1]}`;
    return name[0] + '...';
}

// ============================================
// STAT CARD
// ============================================

function StatCard({ label, value, subValue, icon: Icon, color, bg }: {
    label: string;
    value: string;
    subValue?: string;
    icon: React.ElementType;
    color: string;
    bg: string;
}) {
    return (
        <div className="bg-[#F7F7F8] rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-all group">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                    <Icon size={18} className={color} />
                </div>
                <ArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
    );
}

// ============================================
// TIER BADGE + LADDER
// ============================================

function TierLadder({ currentTier, approvedCount }: { currentTier: ReferralTier; approvedCount: number }) {
    const currentIdx = TIERS.findIndex(t => t.name === currentTier.name);

    return (
        <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900">Tier Status</h3>
                <span className="text-xs font-medium text-gray-500">{approvedCount} approved referrals</span>
            </div>

            <div className="flex items-center gap-0">
                {TIERS.map((tier, i) => {
                    const isActive = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    const isLast = i === TIERS.length - 1;
                    const progress = isActive ? 100 : 0;

                    return (
                        <React.Fragment key={tier.name}>
                            <div className="flex flex-col items-center relative group">
                                {/* Badge */}
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 ${isCurrent
                                            ? 'bg-[#2563EB] shadow-lg shadow-blue-200 ring-4 ring-blue-100 scale-110'
                                            : isActive
                                                ? 'bg-[#2563EB]/10'
                                                : 'bg-gray-100'
                                        }`}
                                >
                                    <span className={isCurrent ? 'drop-shadow-sm' : ''}>{tier.icon}</span>
                                </div>

                                {/* Label */}
                                <div className="mt-2 text-center">
                                    <p className={`text-xs font-semibold ${isCurrent ? 'text-[#2563EB]' : isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                                        {tier.label}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{tier.requiredReferrals}+ refs</p>
                                </div>

                                {/* Bonus tag */}
                                {isCurrent && tier.bonusMultiplier > 1 && (
                                    <div className="absolute -top-2 -right-2 bg-[#2563EB] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                        +{Math.round((tier.bonusMultiplier - 1) * 100)}%
                                    </div>
                                )}

                                {/* Perks tooltip on hover */}
                                <div className="invisible group-hover:visible absolute top-full mt-3 z-10 w-44 bg-white shadow-lg border border-gray-100 rounded-xl p-3 text-left">
                                    <p className="text-xs font-semibold text-gray-900 mb-1.5">{tier.label} Perks</p>
                                    {tier.perks.map((p, j) => (
                                        <p key={j} className="text-[11px] text-gray-500 flex items-start gap-1.5 mb-1">
                                            <span className="text-[#2563EB] mt-0.5">•</span> {p}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Connector line */}
                            {!isLast && (
                                <div className="flex-1 h-0.5 mx-1 mt-[-24px] bg-gray-200 rounded-full overflow-hidden min-w-[24px]">
                                    <div
                                        className="h-full bg-[#2563EB] rounded-full transition-all duration-700"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================
// MILESTONE REWARDS
// ============================================

function MilestoneRewards() {
    return (
        <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-5">
                <Award size={18} className="text-[#2563EB]" />
                <h3 className="text-base font-semibold text-gray-900">Milestone Rewards</h3>
            </div>
            <p className="text-xs text-gray-500 mb-5">
                Earn cash rewards when your referred contributors hit approved data milestones. Total possible per strong contributor: <span className="font-bold text-gray-900">$850+</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MILESTONES.map((m, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-[#2563EB]/20 hover:shadow-sm transition-all group relative overflow-hidden">
                        {/* Background accent */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full" />

                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                                    <Clock size={14} className="text-[#2563EB]" />
                                </div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{m.label}</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{formatCents(m.cashCents)}</p>
                            <p className="text-xs text-gray-500">{m.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// TOKEN BONUS SECTION
// ============================================

function TokenBonus() {
    return (
        <div className="rounded-2xl p-6 border border-[#2563EB]/10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F4FF 50%, #F5F3FF 100%)' }}>
            {/* Decorative */}
            <div className="absolute right-4 top-4 w-20 h-20 bg-blue-200/30 rounded-full blur-2xl" />
            <div className="absolute right-12 bottom-4 w-12 h-12 bg-purple-200/30 rounded-full blur-xl" />

            <div className="relative flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                    <Coins size={20} className="text-[#2563EB]" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Harbor Token Bonus (HBR)</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        On top of cash rewards, earn <span className="font-bold text-[#2563EB]">2% of lifetime dataset revenue</span> attributed to your referred contributors — paid in Harbor tokens for 12 months.
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                            <span className="text-xs text-gray-500">Passive income</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span className="text-xs text-gray-500">12-month duration</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs text-gray-500">Real upside</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// PERFORMANCE CHART (SVG)
// ============================================

function PerformanceChart({ data }: { data: MonthlyPerformance[] }) {
    if (data.length === 0) return null;

    const maxRefs = Math.max(...data.map(d => d.referrals), 1);
    const maxEarnings = Math.max(...data.map(d => d.earningsCents), 1);
    const totalHours = data.reduce((s, d) => s + d.approvedHours, 0);

    const width = 400;
    const height = 160;
    const padding = { left: 30, right: 10, top: 10, bottom: 30 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const xStep = chartW / (data.length - 1 || 1);

    const refPoints = data.map((d, i) => ({
        x: padding.left + i * xStep,
        y: padding.top + chartH - (d.referrals / maxRefs) * chartH,
    }));

    const earningsPoints = data.map((d, i) => ({
        x: padding.left + i * xStep,
        y: padding.top + chartH - (d.earningsCents / maxEarnings) * chartH,
    }));

    const makePath = (points: { x: number; y: number }[]) =>
        points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const makeArea = (points: { x: number; y: number }[]) => {
        const base = padding.top + chartH;
        return `${makePath(points)} L ${points[points.length - 1].x} ${base} L ${points[0].x} ${base} Z`;
    };

    return (
        <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#2563EB]" />
                    <h3 className="text-base font-semibold text-gray-900">Performance</h3>
                </div>
                <span className="text-xs text-gray-500">
                    Total Approved Hours: <span className="font-bold text-gray-900">{totalHours.toFixed(1)}h</span>
                </span>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(frac => {
                    const y = padding.top + chartH - frac * chartH;
                    return <line key={frac} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />;
                })}

                {/* Earnings area + line */}
                <path d={makeArea(earningsPoints)} fill="url(#earningsGrad)" opacity="0.4" />
                <path d={makePath(earningsPoints)} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />

                {/* Referrals area + line */}
                <path d={makeArea(refPoints)} fill="url(#refsGrad)" opacity="0.4" />
                <path d={makePath(refPoints)} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />

                {/* Dots */}
                {refPoints.map((p, i) => (
                    <circle key={`r-${i}`} cx={p.x} cy={p.y} r="3" fill="#2563EB" stroke="white" strokeWidth="1.5" />
                ))}
                {earningsPoints.map((p, i) => (
                    <circle key={`e-${i}`} cx={p.x} cy={p.y} r="3" fill="#a78bfa" stroke="white" strokeWidth="1.5" />
                ))}

                {/* X labels */}
                {data.map((d, i) => (
                    <text key={i} x={padding.left + i * xStep} y={height - 5} textAnchor="middle" className="text-[10px] fill-gray-400">{d.month}</text>
                ))}

                {/* Gradients */}
                <defs>
                    <linearGradient id="refsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-3 ml-2">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-[#2563EB] rounded-full" />
                    <span className="text-xs text-gray-500">Referrals</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-purple-400 rounded-full" />
                    <span className="text-xs text-gray-500">Earnings</span>
                </div>
            </div>
        </div>
    );
}

// ============================================
// REFERRAL TABLE
// ============================================

function ReferralTable({ referrals }: { referrals: Referral[] }) {
    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
        pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50' },
        approved: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-50' },
        rejected: { label: 'Rejected', color: 'text-gray-500', bg: 'bg-gray-100' },
        under_review: { label: 'Under Review', color: 'text-blue-700', bg: 'bg-blue-50' },
    };

    if (referrals.length === 0) {
        return (
            <div className="bg-[#F7F7F8] rounded-2xl p-8 border border-gray-100 text-center">
                <UserPlus size={32} className="text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No referrals yet</h3>
                <p className="text-xs text-gray-500">Share your referral link to start earning cash and token rewards.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#F7F7F8] rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">Referral Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                            <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                            <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Your Earnings</th>
                            <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {referrals.map(r => {
                            const sc = statusConfig[r.status] || statusConfig.pending;
                            const paidAll = r.cashPaidCents > 0;
                            return (
                                <tr key={r.id} className="hover:bg-white/60 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                                {r.referredName[0]}
                                            </div>
                                            <span className="font-medium text-gray-900">{maskName(r.referredName)}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                                            {sc.label}
                                        </span>
                                        {r.fraudFlag && (
                                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs text-red-500">
                                                <Shield size={10} /> Flagged
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-mono text-gray-700">{r.approvedHours.toFixed(1)}h</td>
                                    <td className="px-5 py-3.5 text-right font-mono text-gray-700">{formatCents(r.totalRevenueCents)}</td>
                                    <td className="px-5 py-3.5 text-right font-mono font-semibold text-gray-900">{formatCents(r.cashPaidCents)}</td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${paidAll ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            {paidAll ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ============================================
// HOW IT WORKS
// ============================================

function HowItWorks() {
    const steps = [
        { num: '1', title: 'Share your link', desc: 'Send your unique referral link to potential contributors via message, email, or social media.' },
        { num: '2', title: 'They sign up & contribute', desc: 'Your referral creates a Harbor account and starts uploading quality training data.' },
        { num: '3', title: 'Data gets approved', desc: 'Their submissions pass QA review, and their approved hours counter increments toward milestones.' },
        { num: '4', title: 'You earn rewards', desc: 'Cash payouts at each milestone ($100, $250, $500) + 2% token revenue share for 12 months.' },
    ];

    return (
        <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-5">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {steps.map((s, i) => (
                    <div key={i} className="relative">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {s.num}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                        {i < steps.length - 1 && (
                            <ChevronRight size={14} className="hidden md:block absolute top-2 -right-3 text-gray-300" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

const CreatorReferrals: React.FC = () => {
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [performance, setPerformance] = useState<MonthlyPerformance[]>([]);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const [s, r, p] = await Promise.all([
                referralService.getReferralStats(),
                referralService.getReferrals(),
                referralService.getPerformanceData(),
            ]);
            setStats(s);
            setReferrals(r);
            setPerformance(p);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleCopy = async () => {
        try {
            await referralService.copyReferralLink();
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
            if (stats) {
                navigator.clipboard.writeText(`https://${stats.referralLink}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            }
        }
    };

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
                <p className="text-gray-500 mt-1">
                    Earn cash + token rewards for every high-quality contributor you bring to Harbor.
                </p>
            </div>

            {/* Hero Banner */}
            <div
                className="rounded-2xl p-8 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e293b 40%, #0f172a 100%)' }}
            >
                {/* Decorative elements */}
                <div className="absolute right-8 top-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute right-20 bottom-2 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
                <div className="absolute left-1/2 top-0 w-64 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                            <span className="text-2xl">{stats.currentTier.icon}</span>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">Your Tier</span>
                            <p className="text-lg font-bold">{stats.currentTier.label}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs text-blue-200/70 mb-0.5">Lifetime Earnings</p>
                            <p className="text-2xl font-bold">{formatCents(stats.lifetimeEarningsCents)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-200/70 mb-0.5">Token Earned</p>
                            <p className="text-2xl font-bold">{stats.tokenEarnedHBR.toLocaleString()} <span className="text-sm font-normal text-blue-300">HBR</span></p>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-xs text-blue-200/70 mb-0.5">Approved Hours</p>
                            <p className="text-2xl font-bold">{stats.totalApprovedHours}h</p>
                        </div>
                    </div>

                    {stats.nextTier && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-blue-200/70">
                                    {stats.referralsToNextTier} more approved referral{stats.referralsToNextTier !== 1 ? 's' : ''} to reach <span className="font-semibold text-blue-200">{stats.nextTier.label}</span>
                                </span>
                                <span className="text-xs font-medium text-blue-300">{stats.nextTier.icon} +{Math.round((stats.nextTier.bonusMultiplier - 1) * 100)}% bonus</span>
                            </div>
                            <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(100, ((stats.approvedContributors) / stats.nextTier.requiredReferrals) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Referral Link */}
            <div className="bg-[#F7F7F8] rounded-2xl p-5 border border-gray-100">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 block">Your Referral Link</label>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-mono select-all">
                        {stats.referralLink}
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${copied
                                ? 'bg-green-500 text-white'
                                : 'bg-[#2563EB] text-white hover:bg-blue-700'
                            }`}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total Referrals" value={String(stats.totalReferrals)} icon={Users} color="text-[#2563EB]" bg="bg-blue-50" />
                <StatCard label="Approved" value={String(stats.approvedContributors)} subValue={`${stats.pendingCount} pending`} icon={Check} color="text-green-600" bg="bg-green-50" />
                <StatCard label="Lifetime Earnings" value={formatCents(stats.lifetimeEarningsCents)} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard label="Token Earned" value={`${stats.tokenEarnedHBR.toLocaleString()} HBR`} icon={Coins} color="text-purple-600" bg="bg-purple-50" />
            </div>

            {/* Tier Ladder */}
            <TierLadder currentTier={stats.currentTier} approvedCount={stats.approvedContributors} />

            {/* Milestone Rewards */}
            <MilestoneRewards />

            {/* Token Bonus */}
            <TokenBonus />

            {/* Performance Chart */}
            <PerformanceChart data={performance} />

            {/* Referral Table */}
            <ReferralTable referrals={referrals} />

            {/* How It Works */}
            <HowItWorks />

            {/* Fraud Protection Notice */}
            <div className="bg-[#F7F7F8] rounded-2xl p-5 border border-gray-100 flex items-start gap-3">
                <Shield size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Fraud Protection</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Harbor uses IP similarity checks, device fingerprinting, and payment account verification to maintain referral integrity. High-volume referrers may be subject to manual review. Flagged referrals are held until verified.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreatorReferrals;
