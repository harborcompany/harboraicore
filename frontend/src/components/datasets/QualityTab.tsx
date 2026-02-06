import React from 'react';
import { QualityProfile } from '../../types';
import { Target, Users, BarChart3, AlertTriangle } from 'lucide-react';

interface Props {
    profile?: QualityProfile;
}

const QualityTab: React.FC<Props> = ({ profile }) => {
    if (!profile) {
        return (
            <div className="p-8 text-center bg-stone-50 rounded-lg border border-stone-200 border-dashed">
                <BarChart3 className="mx-auto h-12 w-12 text-stone-300 mb-3" />
                <h3 className="text-stone-900 font-medium">No Quality Profile</h3>
                <p className="text-stone-500 text-sm">Quality metrics have not been calculated for this dataset.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <Target size={24} />
                    </div>
                    <div className="text-3xl font-serif text-[#1A1A1A] mb-1">
                        {(profile.annotationConfidenceAvg || 0) * 100}%
                    </div>
                    <div className="text-xs text-stone-500 uppercase tracking-widest font-medium">Confidence Score</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Users size={24} />
                    </div>
                    <div className="text-3xl font-serif text-[#1A1A1A] mb-1">
                        {profile.interAnnotatorAgreement || 0}
                    </div>
                    <div className="text-xs text-stone-500 uppercase tracking-widest font-medium">Agreement (Kappa)</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-3">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="text-3xl font-serif text-[#1A1A1A] mb-1">
                        {((profile.errorRate || 0.02) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-stone-500 uppercase tracking-widest font-medium">Error Rate</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="font-medium text-[#1A1A1A] mb-4">Benchmark Performance</h3>
                <div className="space-y-3">
                    {profile.benchmarkTasks && profile.benchmarkTasks.length > 0 ? (
                        profile.benchmarkTasks.map((task, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                                <span className="text-sm font-medium text-stone-700">{task}</span>
                                <span className="text-xs bg-white border border-stone-200 px-2 py-1 rounded text-stone-500">Evaluated</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-stone-500 text-sm italic">No benchmarks recorded.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QualityTab;
