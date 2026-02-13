import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, ArrowRight, CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../lib/authStore';
import { creatorService, CreatorProfile, Opportunity } from '../../services/creatorSubmissionService';

const CreatorHome: React.FC = () => {
    const user = useAuth();
    const [profile, setProfile] = useState<CreatorProfile | null>(null);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

    useEffect(() => {
        creatorService.getProfile().then(setProfile);
        creatorService.getOpportunities().then(setOpportunities);
    }, []);

    const firstName = (user.name || user.email || 'Creator').split(' ')[0].split('@')[0];

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
            </div>
        );
    }

    const formatCents = (cents: number) => `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {firstName}
                </h1>
                <p className="text-gray-500 mt-1">
                    You're building the future of AI training data.
                </p>
            </div>

            {/* Earnings Snapshot */}
            <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Earned</p>
                        <p className="text-3xl font-bold text-gray-900">{formatCents(profile.totalEarned)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Pending Review</p>
                        <p className="text-3xl font-bold text-orange-600">{formatCents(profile.pendingReview)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Available to Withdraw</p>
                        <p className="text-3xl font-bold text-green-600">{formatCents(profile.availableToWithdraw)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Next payout window: <span className="font-medium text-gray-700">{profile.nextPayoutDate}</span></p>
                    <Link to="/creator/earnings" className="text-sm font-medium text-[#2563EB] hover:text-blue-700 flex items-center gap-1">
                        Withdraw Funds <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Status */}
                <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Active Submissions</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{profile.submissionsUnderReview} Under Review</span>
                            <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">Processing</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{profile.submissionsApproved} Approved</span>
                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Complete</span>
                        </div>
                        {profile.submissionsNeedsRevision > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{profile.submissionsNeedsRevision} Needs Revision</span>
                                <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Action Needed</span>
                            </div>
                        )}
                    </div>
                    <Link
                        to="/creator/submissions"
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                        View All Submissions <ChevronRight size={14} />
                    </Link>
                </div>

                {/* Quick Upload */}
                <Link
                    to="/creator/upload"
                    className="bg-[#2563EB] rounded-2xl p-6 text-white hover:bg-blue-700 transition-colors group cursor-pointer block"
                >
                    <div className="flex items-start justify-between mb-8">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <ArrowRight size={20} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h2 className="text-lg font-semibold mb-1">Upload a Video</h2>
                    <p className="text-sm text-blue-100">
                        Record or upload hands-only build videos to start earning.
                    </p>
                </Link>
            </div>

            {/* Current Opportunities */}
            <div>
                <h2 className="text-base font-semibold text-gray-900 mb-4">Current Opportunities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opportunities.map(opp => (
                        <div key={opp.id} className="bg-[#F7F7F8] rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">{opp.icon}</span>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">{opp.title}</h3>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {opp.requirements.slice(0, 3).map((req, i) => (
                                    <span key={i} className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded-md border border-gray-150">
                                        {req}
                                    </span>
                                ))}
                            </div>
                            <Link
                                to="/creator/upload"
                                className="text-sm font-medium text-[#2563EB] hover:text-blue-700 flex items-center gap-1"
                            >
                                Start Upload <ArrowRight size={14} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Improve Your Earnings */}
            <div className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Improve Your Earnings</h2>
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-gray-600">Profile Completion</span>
                        <span className="text-xs font-bold text-gray-900">{profile.profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-[#2563EB] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${profile.profileCompletion}%` }}
                        />
                    </div>
                </div>
                <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Payment Method Added</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {profile.highQualityCount >= 5 ? (
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        ) : (
                            <Circle size={16} className="text-gray-300 flex-shrink-0" />
                        )}
                        <span className="text-sm text-gray-600">
                            Submit 5 High-Quality Videos ({profile.highQualityCount}/5)
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {profile.referralBonusActive ? (
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        ) : (
                            <Circle size={16} className="text-gray-300 flex-shrink-0" />
                        )}
                        <span className="text-sm text-gray-600">Refer Contributors & Earn $850+ Each</span>
                    </div>
                </div>
            </div>

            {/* Footer Help */}
            <div className="text-center pb-4">
                <Link to="/creator/support" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    Need help? Contact support →
                </Link>
            </div>
        </div>
    );
};

export default CreatorHome;
