import React, { useState } from 'react';
import { EarningsChart } from '../../components/app/contributor/EarningsChart';
import { TaskQueue } from '../../components/app/contributor/TaskQueue';
import { Camera, HelpCircle, Trophy } from 'lucide-react';

const ContributorDashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                        Contributor Portal
                    </h1>
                    <p className="text-stone-500 mt-1">Monetize your world. Supply the models.</p>
                </div>
                <button className="px-5 py-2.5 bg-[#1A1A1A] text-white font-medium rounded-lg flex items-center gap-2 hover:bg-black transition-colors shadow-lg shadow-stone-200">
                    <Camera className="w-5 h-5" />
                    New Capture
                </button>
            </div>

            {/* Earnings Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <EarningsChart />
                </div>

                {/* Status / Gamification */}
                <div className="space-y-6">
                    <div className="bg-[#1A1A1A] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-stone-400 text-xs font-medium uppercase tracking-widest mb-2 font-mono">Current Status</p>
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="text-amber-400" size={24} />
                                <h3 className="text-2xl font-bold">Tier 2 Verified</h3>
                            </div>
                            <div className="w-full bg-stone-800 h-1.5 rounded-full mb-2">
                                <div className="bg-emerald-500 h-1.5 rounded-full w-[65%]"></div>
                            </div>
                            <p className="text-xs text-stone-400">1,250 XP to Elite status</p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-[#1A1A1A]">Quick Stats</h3>
                            <HelpCircle size={16} className="text-stone-400" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-stone-600">Verification Rate</span>
                                <span className="text-sm font-bold text-emerald-600">98.5%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-stone-600">Avg. Payout Time</span>
                                <span className="text-sm font-bold text-[#1A1A1A]">2 hours</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-stone-600">Total Contributions</span>
                                <span className="text-sm font-bold text-[#1A1A1A]">4,129</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Queue */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <TaskQueue />
            </div>
        </div>
    );
};

export default ContributorDashboard;
