import React from 'react';

const ApiOverview: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div>
                <span className="text-indigo-600 font-mono text-sm tracking-wide font-medium mb-4 block">API REFERENCE</span>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                    API Overview
                </h1>
                <p className="text-xl text-gray-500 leading-relaxed max-w-3xl">
                    The Harbor API is built on REST principles. We enforce HTTPS in production to ensure data privacy and integrity.
                </p>
            </div>

            <section className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Base URL</h2>
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 font-mono text-gray-800">
                        https://api.harbor.ai/v1
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
                    <p className="text-gray-600 mb-4">
                        Authentication is handled via Bearer tokens. You must include your API key in the `Authorization` header of every request.
                    </p>
                    <div className="bg-[#1e1e1e] rounded-xl p-6 overflow-x-auto shadow-lg">
                        <code className="text-green-400 font-mono text-sm">
                            Authorization: Bearer hrb_live_...
                        </code>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Response Codes</h2>
                    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                <tr>
                                    <td className="px-6 py-4 font-mono font-medium text-green-600">200 OK</td>
                                    <td className="px-6 py-4 text-gray-600">Request succeeded.</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-mono font-medium text-blue-600">201 Created</td>
                                    <td className="px-6 py-4 text-gray-600">Resource created successfully (e.g., ingestion job).</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-mono font-medium text-amber-600">400 Bad Request</td>
                                    <td className="px-6 py-4 text-gray-600">Invalid parameters or malformed body.</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-mono font-medium text-red-600">401 Unauthorized</td>
                                    <td className="px-6 py-4 text-gray-600">API Key missing or invalid.</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-mono font-medium text-red-600">429 Too Many Requests</td>
                                    <td className="px-6 py-4 text-gray-600">Rate limit exceeded. Retry after `Retry-After`.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ApiOverview;
