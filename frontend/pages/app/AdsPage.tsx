import React from 'react';
import { Plus, Play, Pause, BarChart2, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const campaigns = [
    {
        id: 1,
        name: 'Global Enterprise Branding v2',
        status: 'Active',
        budget: '$450,000',
        spent: '$284,340',
        impressions: '14.2M',
        ctr: '3.42%',
        startDate: 'Jan 1, 2026',
        endDate: 'Jun 30, 2026'
    },
    {
        id: 2,
        name: 'Automotive Vertical - Series X',
        status: 'Active',
        budget: '$2,400,000',
        spent: '$678,890',
        impressions: '42.1M',
        ctr: '4.85%',
        startDate: 'Feb 1, 2026',
        endDate: 'Dec 31, 2026'
    },
    {
        id: 3,
        name: 'Egocentric Ad Lab - Alpha Test',
        status: 'Paused',
        budget: '$150,000',
        spent: '$149,100',
        impressions: '12.8M',
        ctr: '2.95%',
        startDate: 'Nov 1, 2025',
        endDate: 'Jan 15, 2026'
    }
];

const AdsPage: React.FC = () => {
    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Harbor Ads</h1>
                    <p className="text-stone-400">Create and manage data-driven video campaigns</p>
                </div>
                <button className="bg-white text-black px-4 py-2.5 rounded-lg font-medium hover:bg-stone-200 transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    New Campaign
                </button>
            </div>

            {/* Overhauled Ads Stats */}
            <div className="grid grid-cols-4 gap-6 mb-12">
                <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] shadow-sm hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign size={24} className="text-emerald-500" />
                        <span className="text-stone-500 text-xs font-mono uppercase tracking-widest">Total Managed Budget</span>
                    </div>
                    <p className="text-4xl font-serif text-white">$3,000,000</p>
                </div>
                <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] shadow-sm hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart2 size={24} className="text-blue-500" />
                        <span className="text-stone-500 text-xs font-mono uppercase tracking-widest">Total Impressions</span>
                    </div>
                    <p className="text-4xl font-serif text-white">69.1M</p>
                </div>
                <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] shadow-sm hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp size={24} className="text-purple-500" />
                        <span className="text-stone-500 text-xs font-mono uppercase tracking-widest">Average Conversion</span>
                    </div>
                    <p className="text-4xl font-serif text-white">4.12%</p>
                </div>
                <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] shadow-sm hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <Play size={24} className="text-stone-600" />
                        <span className="text-stone-500 text-xs font-mono uppercase tracking-widest">Active Corridors</span>
                    </div>
                    <p className="text-4xl font-serif text-white">42</p>
                </div>
            </div>

            {/* Campaigns */}
            <div className="mb-6">
                <h2 className="text-lg font-medium text-white mb-4">Campaigns</h2>
            </div>

            <div className="space-y-4">
                {campaigns.map((campaign) => (
                    <div
                        key={campaign.id}
                        className="p-6 bg-[#0A0A0A] border border-white/10 rounded-xl hover:border-white/20 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-medium text-white">{campaign.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs ${campaign.status === 'Active'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                        {campaign.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-stone-500">
                                    <Calendar size={14} />
                                    {campaign.startDate} — {campaign.endDate}
                                </div>
                            </div>
                            <button className="p-2 bg-white/5 rounded-lg text-stone-400 hover:bg-white/10 hover:text-white transition-colors">
                                {campaign.status === 'Active' ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-6">
                            <div>
                                <p className="text-stone-500 text-sm mb-1">Budget</p>
                                <p className="text-white font-mono">{campaign.budget}</p>
                            </div>
                            <div>
                                <p className="text-stone-500 text-sm mb-1">Spent</p>
                                <p className="text-white font-mono">{campaign.spent}</p>
                            </div>
                            <div>
                                <p className="text-stone-500 text-sm mb-1">Impressions</p>
                                <p className="text-white font-mono">{campaign.impressions}</p>
                            </div>
                            <div>
                                <p className="text-stone-500 text-sm mb-1">CTR</p>
                                <p className="text-white font-mono">{campaign.ctr}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdsPage;
