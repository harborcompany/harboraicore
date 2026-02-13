import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users } from 'lucide-react';
import { creatorService, Opportunity } from '../../services/creatorSubmissionService';

const CreatorOpportunities: React.FC = () => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        creatorService.getOpportunities().then(data => {
            setOpportunities(data);
            setLoading(false);
        });
    }, []);

    const formatCents = (cents: number) => `$${(cents / 100).toFixed(0)}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
                <p className="text-gray-500 mt-1">Active projects looking for contributors like you.</p>
            </div>

            {/* Featured Project */}
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)' }}>
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.8)' }}>Featured Project</span>
                        <h2 className="text-xl font-bold mt-2 mb-1" style={{ color: '#ffffff' }}>🧱 LEGO Pilot — Phase 1</h2>
                        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Looking for 50 creators to submit hands-only LEGO build videos for AI training data.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 mb-5">
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        <Clock size={14} />
                        5–10 min builds
                    </div>
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        <Users size={14} />
                        50 spots available
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Deadline: March 1, 2026
                </div>
                <Link
                    to="/creator/upload"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#2563EB] rounded-xl font-medium text-sm hover:bg-blue-50 transition-colors"
                >
                    Apply & Upload <ArrowRight size={14} />
                </Link>
            </div>

            {/* Opportunity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opportunities.map(opp => (
                    <div key={opp.id} className="bg-[#F7F7F8] rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex items-start gap-3 mb-4">
                            <span className="text-3xl">{opp.icon}</span>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">{opp.title}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">{opp.description}</p>
                            </div>
                        </div>



                        <div className="space-y-1.5 mb-5">
                            {opp.requirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                                    {req}
                                </div>
                            ))}
                        </div>

                        {opp.deadline && (
                            <p className="text-xs text-gray-500 mb-4">
                                Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        )}

                        <Link
                            to="/creator/upload"
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-[#2563EB] bg-white border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 transition-all"
                        >
                            {opp.category === 'audio' ? 'Learn More' : 'Start Upload'} <ArrowRight size={14} />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Coming Soon */}
            <div className="text-center p-8 bg-[#F7F7F8] rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500">More opportunities coming soon. Stay tuned!</p>
            </div>
        </div>
    );
};

export default CreatorOpportunities;
