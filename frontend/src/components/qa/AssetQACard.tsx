import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface AssetQAScoreData {
    overallScore: number;
    accuracyScore: number;
    consistencyScore: number;
    technicalScore: number;
    completenessScore: number;
    confidenceScore: number;
    status: 'APPROVED' | 'NEEDS_REVIEW' | 'REJECTED';
    criticalFailure: boolean;
    failureReasons?: string[];
}

interface AssetQACardProps {
    score: AssetQAScoreData;
    assetName?: string;
}

const ScoreBar: React.FC<{ label: string; value: number; weight: string }> = ({ label, value, weight }) => {
    const getBarColor = (v: number) => {
        if (v >= 90) return 'bg-green-500';
        if (v >= 80) return 'bg-emerald-500';
        if (v >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{label} <span className="text-gray-600">({weight})</span></span>
                <span className="font-medium text-white">{value.toFixed(0)}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(value)}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
};

export const AssetQACard: React.FC<AssetQACardProps> = ({ score, assetName }) => {
    const [expanded, setExpanded] = React.useState(false);

    const getStatusConfig = (status: AssetQAScoreData['status']) => {
        switch (status) {
            case 'APPROVED':
                return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10', label: 'Approved' };
            case 'NEEDS_REVIEW':
                return { icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', label: 'Needs Review' };
            case 'REJECTED':
                return { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10', label: 'Rejected' };
        }
    };

    const statusConfig = getStatusConfig(score.status);
    const StatusIcon = statusConfig.icon;

    const getScoreColor = (v: number) => {
        if (v >= 90) return 'text-green-400';
        if (v >= 80) return 'text-emerald-400';
        if (v >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    {assetName && <span className="text-sm text-gray-400">{assetName}</span>}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                        <StatusIcon size={14} />
                        {statusConfig.label}
                    </span>
                </div>

                {/* Large Score Display */}
                <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${getScoreColor(score.overallScore)}`}>
                        {score.overallScore.toFixed(0)}
                    </span>
                    <span className="text-2xl text-gray-600">/ 100</span>
                </div>

                {score.criticalFailure && (
                    <div className="mt-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                        ⚠ Critical failure detected — score capped at 60
                    </div>
                )}
            </div>

            {/* Score Breakdown */}
            <div className="p-5">
                <ScoreBar label="Accuracy" value={score.accuracyScore} weight="35%" />
                <ScoreBar label="Consistency" value={score.consistencyScore} weight="20%" />
                <ScoreBar label="Technical Quality" value={score.technicalScore} weight="20%" />
                <ScoreBar label="Completeness" value={score.completenessScore} weight="15%" />
                <ScoreBar label="Confidence" value={score.confidenceScore} weight="10%" />
            </div>

            {/* Expandable "Why this score?" */}
            {score.failureReasons && score.failureReasons.length > 0 && (
                <div className="border-t border-gray-800">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full px-5 py-3 flex items-center justify-between text-sm text-gray-400 hover:bg-gray-800/50 transition-colors"
                    >
                        <span>Why this score?</span>
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expanded && (
                        <div className="px-5 pb-4 space-y-2">
                            {score.failureReasons.map((reason, i) => (
                                <div key={i} className="text-xs text-red-400 bg-red-500/5 px-3 py-2 rounded">
                                    • {reason}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AssetQACard;
