import React, { useState, useEffect } from 'react';
import {
    Activity,
    Brain,
    Database,
    RefreshCw,
    Search,
    User,
    Zap,
    Trash2,
    Clock
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

interface MemoryProfile {
    userId: string;
    preferredTypes: string[];
    interactionHistory: Array<{
        query: string;
        timestamp: Date;
        weight: number;
    }>;
    recentPatterns: string[];
    semanticClusterHelpers: any;
    lastUpdated: Date;
}

interface EvolutionStats {
    pruned: number;
    reinforced: number;
    patternsLearned: number;
}

export function AdminMemory() {
    const [userId, setUserId] = useState('default_user');
    const [profile, setProfile] = useState<MemoryProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<EvolutionStats | null>(null);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/rag/profile', {
                headers: {
                    'x-user-id': userId
                }
            });
            const data = await res.json();
            if (data.data) {
                setProfile(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const triggerEvolution = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/rag/evolve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId
                },
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (data.data) {
                setStats(data.data);
                fetchProfile(); // Refresh profile
            }
        } catch (err) {
            console.error('Evolution failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    // Transform preferred types for chart
    const typeData = profile?.preferredTypes.reduce((acc: any[], type) => {
        const existing = acc.find(t => t.name === type);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ name: type, count: 1 });
        }
        return acc;
    }, []) || [];

    return (
        <div className="admin-memory-page p-6 max-w-7xl mx-auto">
            <div className="header mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Brain className="w-8 h-8 text-blue-500" />
                        Elite Memory System
                    </h1>
                    <p className="text-gray-400">Real-time inspection of user memory profiles and temporal decay.</p>
                </div>

                <div className="actions flex gap-4">
                    <div className="search-box relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border focus:border-blue-500 outline-none"
                            placeholder="Inspect User ID..."
                        />
                    </div>
                    <button
                        onClick={triggerEvolution}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Trigger Evolution
                    </button>
                </div>
            </div>

            {stats && (
                <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="stat-card bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-500/10 rounded-lg">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 uppercase">Pruned</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stats.pruned}</h3>
                        <p className="text-sm text-gray-400">Expired memories removed</p>
                    </div>

                    <div className="stat-card bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <Zap className="w-6 h-6 text-green-500" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 uppercase">Reinforced</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stats.reinforced}</h3>
                        <p className="text-sm text-gray-400">Active memories strengthened</p>
                    </div>

                    <div className="stat-card bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <Activity className="w-6 h-6 text-purple-500" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 uppercase">Patterns</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stats.patternsLearned}</h3>
                        <p className="text-sm text-gray-400">New behaviors identified</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Preference Profile */}
                <div className="panel bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-800 bg-gray-800/50">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-400" />
                            Content Type Affinity
                        </h3>
                    </div>
                    <div className="p-6 h-80">
                        {typeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={typeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#F3F4F6' }}
                                    />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No preference data yet. Perform some queries!
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Patterns & History */}
                <div className="panel bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-800 bg-gray-800/50">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-400" />
                            Recent Context Patterns
                        </h3>
                    </div>
                    <div className="p-6 flex-1 overflow-auto">
                        {profile?.recentPatterns && profile.recentPatterns.length > 0 ? (
                            <div className="space-y-4">
                                {profile.recentPatterns.map((pattern, i) => (
                                    <div key={i} className="pattern-item flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                                        <span className="text-gray-300 font-mono text-sm">{pattern}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No patterns detected yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
