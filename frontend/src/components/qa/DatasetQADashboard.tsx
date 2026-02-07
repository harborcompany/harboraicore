import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Download, RefreshCw } from 'lucide-react';

interface DatasetQAData {
    overallScore: number;
    medianAssetScore: number;
    meanAssetScore: number;
    lowQualityPenalty: number;
    status: 'PRODUCTION_GRADE' | 'TRAINING_READY' | 'RESEARCH_ONLY' | 'NOT_DELIVERABLE';
    distributionBuckets: {
        '90-100': number;
        '80-89': number;
        '70-79': number;
        '<70': number;
    };
    totalAssets: number;
    exportReady: boolean;
    lastCalculatedAt: string;
}

interface DatasetQADashboardProps {
    data: DatasetQAData;
    datasetName?: string;
    onRecalculate?: () => void;
    onExport?: () => void;
}

const StatusBadge: React.FC<{ status: DatasetQAData['status'] }> = ({ status }) => {
    const configs = {
        PRODUCTION_GRADE: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Production-grade' },
        TRAINING_READY: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Training-ready' },
        RESEARCH_ONLY: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Research-only' },
        NOT_DELIVERABLE: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Not deliverable' }
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
            <Icon size={16} />
            {config.label}
        </span>
    );
};

const DistributionBar: React.FC<{ buckets: DatasetQAData['distributionBuckets']; total: number }> = ({ buckets, total }) => {
    const segments = [
        { key: '90-100', color: 'bg-green-500', label: '90-100' },
        { key: '80-89', color: 'bg-emerald-500', label: '80-89' },
        { key: '70-79', color: 'bg-yellow-500', label: '70-79' },
        { key: '<70', color: 'bg-red-500', label: '<70' },
    ];

    return (
        <div>
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-800 mb-3">
                {segments.map(seg => {
                    const count = buckets[seg.key as keyof typeof buckets] || 0;
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div
                            key={seg.key}
                            className={`${seg.color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                            title={`${seg.label}: ${count} assets (${pct.toFixed(1)}%)`}
                        />
                    );
                })}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
                {segments.map(seg => (
                    <div key={seg.key} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${seg.color}`} />
                        <span>{seg.label}: {buckets[seg.key as keyof typeof buckets] || 0}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DatasetQADashboard: React.FC<DatasetQADashboardProps> = ({
    data,
    datasetName,
    onRecalculate,
    onExport
}) => {
    const getScoreColor = (v: number) => {
        if (v >= 90) return 'text-green-400';
        if (v >= 80) return 'text-emerald-400';
        if (v >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <div>
                    {datasetName && <h2 className="text-lg font-medium text-white mb-1">{datasetName}</h2>}
                    <p className="text-sm text-gray-500">Quality Assessment Dashboard</p>
                </div>
                <div className="flex gap-2">
                    {onRecalculate && (
                        <button
                            onClick={onRecalculate}
                            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 flex items-center gap-2 transition-colors"
                        >
                            <RefreshCw size={14} /> Recalculate
                        </button>
                    )}
                    {onExport && data.exportReady && (
                        <button
                            onClick={onExport}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white flex items-center gap-2 transition-colors"
                        >
                            <Download size={14} /> Export Dataset
                        </button>
                    )}
                </div>
            </div>

            {/* Top-Level Score */}
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-transparent">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Dataset QA Score</div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-6xl font-bold ${getScoreColor(data.overallScore)}`}>
                                {data.overallScore.toFixed(0)}
                            </span>
                            <span className="text-2xl text-gray-600">/ 100</span>
                        </div>
                    </div>
                    <div className="border-l border-gray-800 pl-6">
                        <StatusBadge status={data.status} />
                        <div className="mt-2 text-xs text-gray-600">
                            {data.totalAssets} assets • Last updated {new Date(data.lastCalculatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 divide-x divide-gray-800 border-b border-gray-800">
                <div className="p-5 text-center">
                    <div className="text-2xl font-bold text-white">{data.medianAssetScore.toFixed(1)}</div>
                    <div className="text-xs text-gray-500 mt-1">Median Score (50%)</div>
                </div>
                <div className="p-5 text-center">
                    <div className="text-2xl font-bold text-white">{data.meanAssetScore.toFixed(1)}</div>
                    <div className="text-xs text-gray-500 mt-1">Mean Score (30%)</div>
                </div>
                <div className="p-5 text-center">
                    <div className={`text-2xl font-bold ${data.lowQualityPenalty < 10 ? 'text-green-400' : data.lowQualityPenalty < 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {(100 - data.lowQualityPenalty).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Quality Penalty (20%)</div>
                </div>
            </div>

            {/* Distribution Chart */}
            <div className="p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Score Distribution</h3>
                <DistributionBar buckets={data.distributionBuckets} total={data.totalAssets} />
            </div>

            {/* Export Readiness */}
            <div className="px-6 pb-6">
                <div className={`p-4 rounded-lg border ${data.exportReady ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                    <div className="flex items-center gap-3">
                        {data.exportReady ? (
                            <>
                                <CheckCircle className="text-green-400" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-green-400">Export Ready</div>
                                    <div className="text-xs text-gray-500">This dataset meets quality thresholds for delivery</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="text-yellow-400" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-yellow-400">Not Export Ready</div>
                                    <div className="text-xs text-gray-500">Review and improve low-scoring assets before export</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatasetQADashboard;
