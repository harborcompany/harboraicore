import React, { useState } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Clock, CheckCircle } from 'lucide-react';

const apiKeys = [
    {
        id: 1,
        name: 'Main Production Cluster',
        key: 'hbr_live_sk_827x1p9v0k5m8n3q2w',
        scopes: ['datasets:read', 'annotations:write', 'rag:query'],
        created: 'Jan 15, 2026',
        lastUsed: '14 mins ago',
        status: 'Active'
    },
    {
        id: 2,
        name: 'Staging / QA Endpoint',
        key: 'hbr_test_sk_0m5n8b3v7c1x4z9q2w',
        scopes: ['datasets:read', 'search:query'],
        created: 'Jan 10, 2026',
        lastUsed: '2 days ago',
        status: 'Active'
    },
    {
        id: 3,
        name: 'L1 Network Ingest Hook',
        key: 'hbr_live_sk_p9o8i7u6y5t4r3e2w1q',
        scopes: ['ingest:write'],
        created: 'Dec 20, 2025',
        lastUsed: '5h ago',
        status: 'Active'
    }
];

const usageStats = {
    thisMonth: 428902,
    lastMonth: 184530,
    limit: 1000000
};

const ApiPage: React.FC = () => {
    const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});
    const [copied, setCopied] = useState<number | null>(null);

    const toggleKeyVisibility = (id: number) => {
        setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyKey = (id: number, key: string) => {
        navigator.clipboard.writeText(key);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const maskKey = (key: string) => {
        return key.substring(0, 12) + '•'.repeat(20);
    };

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">API</h1>
                    <p className="text-stone-500">Manage API keys and access programmatic features</p>
                </div>
                <button className="bg-[#1A1A1A] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#333] transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    Create API Key
                </button>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock size={20} className="text-blue-500" />
                        <span className="text-stone-500 text-sm">This Month</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">{usageStats.thisMonth.toLocaleString()}</p>
                    <p className="text-stone-500 text-sm mt-1">API calls</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-stone-500 text-sm">Last Month</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">{usageStats.lastMonth.toLocaleString()}</p>
                    <p className="text-stone-500 text-sm mt-1">API calls</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Key size={20} className="text-purple-500" />
                        <span className="text-stone-500 text-sm">Monthly Limit</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">{usageStats.limit.toLocaleString()}</p>
                    <div className="mt-2 w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(usageStats.thisMonth / usageStats.limit) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* API Keys */}
            <div className="mb-6">
                <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">API Keys</h2>
            </div>

            <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                    <div
                        key={apiKey.id}
                        className="p-5 bg-white border border-stone-200 rounded-xl"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-[#1A1A1A] font-medium">{apiKey.name}</h3>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                        {apiKey.status}
                                    </span>
                                </div>
                                <p className="text-stone-500 text-sm">Created {apiKey.created} • Last used {apiKey.lastUsed}</p>
                            </div>
                            <button className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg mb-4">
                            <code className="text-stone-700 text-sm flex-1 font-mono">
                                {visibleKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                            </code>
                            <button
                                onClick={() => toggleKeyVisibility(apiKey.id)}
                                className="p-1.5 text-stone-400 hover:text-[#1A1A1A] transition-colors"
                            >
                                {visibleKeys[apiKey.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                                onClick={() => copyKey(apiKey.id, apiKey.key)}
                                className="p-1.5 text-stone-400 hover:text-[#1A1A1A] transition-colors"
                            >
                                {copied === apiKey.id ? (
                                    <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                    <Copy size={16} />
                                )}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-stone-500 text-sm">Scopes:</span>
                            {apiKey.scopes.map((scope) => (
                                <span key={scope} className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">
                                    {scope}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Documentation Link */}
            <div className="mt-8 p-6 bg-white border border-stone-200 rounded-xl text-center">
                <h3 className="text-[#1A1A1A] font-medium mb-2">Need help integrating?</h3>
                <p className="text-stone-500 text-sm mb-4">Check out our API documentation for code examples and guides.</p>
                <button className="text-[#1A1A1A] hover:underline text-sm font-medium">
                    View API Documentation →
                </button>
            </div>
        </div>
    );
};

export default ApiPage;
