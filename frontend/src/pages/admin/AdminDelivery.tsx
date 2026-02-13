import React, { useState, useEffect } from 'react';
import {
    getDatasetBuilds,
    getClientDeliveries,
    createDelivery,
    markDelivered,
    formatDate,
    type DatasetBuild,
    type ClientDelivery,
} from '../../services/adminPipelineService';

export function AdminDelivery() {
    const [builds, setBuilds] = useState<DatasetBuild[]>([]);
    const [deliveries, setDeliveries] = useState<ClientDelivery[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedBuildId, setSelectedBuildId] = useState('');
    const [clientName, setClientName] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        setBuilds(getDatasetBuilds());
        setDeliveries(getClientDeliveries());
    }, []);

    function handleCreate() {
        if (!selectedBuildId || !clientName) return;
        createDelivery({
            datasetBuildId: selectedBuildId,
            clientOrgId: 'org_client',
            clientName,
            notes,
        });
        setDeliveries(getClientDeliveries());
        setShowCreate(false);
        setSelectedBuildId('');
        setClientName('');
        setNotes('');
    }

    function handleDeliver(id: string) {
        markDelivered(id);
        setDeliveries(getClientDeliveries());
    }

    return (
        <div className="p-6 text-white max-w-[1400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Client Delivery</h1>
                    <p className="text-[#737373] mt-1">Package and deliver datasets to clients</p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    + New Delivery
                </button>
            </div>

            {/* Create delivery */}
            {showCreate && (
                <div className="bg-[#141414] border border-blue-500/20 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold mb-4">Create Delivery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs text-[#737373] mb-1">Dataset Build</label>
                            <select
                                value={selectedBuildId}
                                onChange={e => setSelectedBuildId(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[#0a0a0a] border border-[#262626] text-sm text-white"
                            >
                                <option value="">Select build...</option>
                                {builds.filter(b => b.status === 'ready' || b.status === 'building').map(b => (
                                    <option key={b.datasetId} value={b.datasetId}>{b.title} ({b.version})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-[#737373] mb-1">Client Name</label>
                            <input
                                value={clientName}
                                onChange={e => setClientName(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[#0a0a0a] border border-[#262626] text-sm text-white focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. Acme Robotics"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[#737373] mb-1">Delivery Notes</label>
                            <input
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[#0a0a0a] border border-[#262626] text-sm text-white focus:border-blue-500 focus:outline-none"
                                placeholder="Include QA report + manifest"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-[#a3a3a3] hover:text-white">Cancel</button>
                        <button onClick={handleCreate} disabled={!selectedBuildId || !clientName}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg">
                            Create Delivery
                        </button>
                    </div>
                </div>
            )}

            {/* Deliveries list */}
            {deliveries.length > 0 ? (
                <div className="space-y-4">
                    {deliveries.map(d => {
                        const build = builds.find(b => b.datasetId === d.datasetBuildId);
                        return (
                            <div key={d.id} className="bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-[#404040] transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold">{build?.title || 'Unknown Dataset'}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === 'delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                d.status === 'acknowledged' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                            {d.status}
                                        </span>
                                    </div>
                                    {d.status === 'pending' && (
                                        <button
                                            onClick={() => handleDeliver(d.id)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg"
                                        >
                                            Mark as Delivered ✓
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-xs text-[#525252]">Client</span>
                                        <div className="text-[#a3a3a3]">{d.clientName}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#525252]">Created</span>
                                        <div className="text-[#a3a3a3]">{formatDate(d.createdAt)}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#525252]">Delivered</span>
                                        <div className="text-[#a3a3a3]">{d.deliveredAt ? formatDate(d.deliveredAt) : '—'}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#525252]">Notes</span>
                                        <div className="text-[#a3a3a3]">{d.deliveryNotes || '—'}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-[#141414] border border-[#262626] rounded-xl p-12 text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <h2 className="text-xl font-bold mb-2">No Deliveries Yet</h2>
                    <p className="text-[#737373]">Create a delivery when a dataset build is ready for a client.</p>
                </div>
            )}
        </div>
    );
}

export default AdminDelivery;
