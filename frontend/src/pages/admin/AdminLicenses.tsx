
import React from 'react';
import { Download, Search, Filter, ShieldCheck } from 'lucide-react';

const AdminLicenses: React.FC = () => {
    // Mock Data
    const licenses = [
        { id: 'lic_992', licensee: 'Acme Robotics Inc.', dataset: 'LEGO Assembly V1', type: 'COMMERCIAL', issued: '2026-02-01', expires: '2027-02-01', status: 'ACTIVE' },
        { id: 'lic_993', licensee: 'University of Tech', dataset: 'LEGO Assembly V1', type: 'RESEARCH', issued: '2026-01-15', expires: '2026-07-15', status: 'ACTIVE' },
        { id: 'lic_994', licensee: 'StartUp AI', dataset: 'Audio Conversational', type: 'PILOT', issued: '2026-02-05', expires: '2026-05-05', status: 'ACTIVE' },
    ];

    return (
        <div className="p-6">
            <header className="mb-8">
                <h1 className="text-2xl font-semibold text-white">License Management</h1>
                <p className="text-gray-500">Track active dataset licenses and compliance.</p>
            </header>

            <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#262626] flex justify-between items-center bg-[#0a0a0a]">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search licensee..."
                                className="pl-9 pr-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-sm w-64 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        + Issue License
                    </button>
                </div>
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-[#0a0a0a] border-b border-[#262626] text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">License ID</th>
                            <th className="px-6 py-3">Licensee</th>
                            <th className="px-6 py-3">Dataset</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Expires</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                        {licenses.map((lic) => (
                            <tr key={lic.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{lic.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{lic.licensee}</td>
                                <td className="px-6 py-4">{lic.dataset}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${lic.type === 'COMMERCIAL' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            lic.type === 'PILOT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                        {lic.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-green-500 text-xs font-medium">
                                        <ShieldCheck size={14} /> {lic.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{lic.expires}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-white p-1">
                                        <Download size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLicenses;
