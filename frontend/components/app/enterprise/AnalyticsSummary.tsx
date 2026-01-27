import React from 'react';
import { TrendingUp, Coins, Activity, CheckCircle } from 'lucide-react';

const StatCard: React.FC<{
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon: any;
}> = ({ label, value, change, trend, icon: Icon }) => (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">{label}</p>
            <h4 className="text-2xl font-serif text-[#1A1A1A] mb-2">{value}</h4>
            <div className={`text-xs font-medium flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-stone-500'
                }`}>
                <TrendingUp size={12} className={trend === 'down' ? 'rotate-180' : ''} />
                {change} <span className="text-stone-400 font-normal">vs last month</span>
            </div>
        </div>
        <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
            <Icon size={20} />
        </div>
    </div>
);

export const AnalyticsSummary: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
                label="Total Spend"
                value="$12,450"
                change="+12%"
                trend="up"
                icon={Coins}
            />
            <StatCard
                label="Quality Score"
                value="98.2%"
                change="+0.5%"
                trend="up"
                icon={CheckCircle}
            />
            <StatCard
                label="Throughput"
                value="25.4k"
                change="-5%"
                trend="down"
                icon={Activity}
            />
            <StatCard
                label="Active Annotators"
                value="42"
                change="0%"
                trend="neutral"
                icon={TrendingUp}
            />
        </div>
    );
};
