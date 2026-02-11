
import React from 'react';

export function AdminDashboard() {
    return (
        <div className="admin-dashboard p-6 text-white">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <MetricCard label="Videos Submitted" value="12" subtext="This month" />
                <MetricCard label="Videos Approved" value="8" subtext="66% rate" />
                <MetricCard label="Total Footage" value="48h" subtext="Usable" />
                <MetricCard label="Active Licenses" value="3" subtext="2 Pilot, 1 Comm." />
            </div>

            {/* Pipeline Status */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Pipeline Status</h2>
                <div className="flex items-center justify-between bg-[#141414] p-4 rounded-lg border border-[#262626]">
                    <Stage label="Uploaded" count={4} color="gray" />
                    <Arrow />
                    <Stage label="Processing" count={2} color="blue" />
                    <Arrow />
                    <Stage label="Annotated" count={5} color="purple" />
                    <Arrow />
                    <Stage label="Reviewed" count={30} color="green" />
                    <Arrow />
                    <Stage label="Dataset Ready" count={25} color="indigo" />
                </div>
            </div>

            {/* Alerts */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">System Alerts</h2>
                <div className="space-y-2">
                    <AlertMessage type="warning" message="3 videos pending review > 72h" />
                    <AlertMessage type="info" message="Creator payouts pending for Feb" />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, subtext }: { label: string, value: string, subtext: string }) {
    return (
        <div className="bg-[#141414] p-4 rounded-lg border border-[#262626]">
            <div className="text-[#a3a3a3] text-sm">{label}</div>
            <div className="text-3xl font-bold mt-1 mb-1">{value}</div>
            <div className="text-xs text-[#525252]">{subtext}</div>
        </div>
    );
}

function Stage({ label, count, color }: { label: string, count: number, color: string }) {
    const colors: Record<string, string> = {
        gray: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        green: 'bg-green-500/10 text-green-500 border-green-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    };

    return (
        <div className={`flex flex-col items-center justify-center p-3 rounded-md border min-w-[100px] ${colors[color] || colors.gray}`}>
            <span className="text-2xl font-bold">{count}</span>
            <span className="text-xs uppercase tracking-wider mt-1">{label}</span>
        </div>
    );
}

function Arrow() {
    return <div className="text-[#262626]">→</div>;
}

function AlertMessage({ type, message }: { type: 'warning' | 'info' | 'error', message: string }) {
    const icons = {
        warning: '⚠️',
        info: 'ℹ️',
        error: '❌'
    };
    const styles = {
        warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
        error: 'bg-red-500/10 border-red-500/20 text-red-500'
    };

    return (
        <div className={`p-3 rounded-md border flex items-center gap-3 ${styles[type]}`}>
            <span>{icons[type]}</span>
            <span className="font-medium">{message}</span>
        </div>
    );
}
