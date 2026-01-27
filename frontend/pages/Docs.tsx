import React, { useState } from 'react';
import SeoHead from '../components/SeoHead';
import { ChevronRight } from 'lucide-react';

const Docs: React.FC = () => {
    const [activeSection, setActiveSection] = useState('Overview');

    const menu = [
        { category: 'Getting Started', items: ['API Overview', 'Authentication', 'Versioning'] },
        { category: 'Data', items: ['Dataset Schemas', 'Manifests', 'Delivery Methods'] },
        { category: 'Engine', items: ['Ingestion Hook', 'Query Usage', 'Rate Limits'] }
    ];

    return (
        <div className="bg-white min-h-screen pt-24">
            <SeoHead
                title="Harbor Developer Documentation"
                description="Technical references for integrating Harbor datasets and infrastructure into your workflows."
            />

            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row">

                {/* Sidebar */}
                <aside className="w-full md:w-64 lg:w-72 shrink-0 border-r border-gray-100 min-h-[calc(100vh-96px)] p-8 md:sticky md:top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden md:block">
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-[#111] mb-1">Documentation</h2>
                        <div className="text-xs text-gray-500">v1.2.0</div>
                    </div>

                    <div className="space-y-8">
                        {menu.map((section) => (
                            <div key={section.category}>
                                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">{section.category}</h3>
                                <ul className="space-y-3">
                                    {section.items.map((item) => (
                                        <li key={item}>
                                            <button
                                                onClick={() => setActiveSection(item)}
                                                className={`text-sm block w-full text-left transition-colors ${activeSection === item ? 'text-[#111] font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 md:p-16 lg:p-24 max-w-4xl">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-4">Developer Resources</span>
                    <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-[#111] mb-6">
                        {activeSection === 'Overview' ? 'API Overview' : activeSection}
                    </h1>

                    <p className="text-lg text-gray-600 font-light leading-relaxed mb-12">
                        Technical references for integrating Harbor datasets and infrastructure into your workflows.
                        Harbor API provides programmatic access to datasets, annotations, and compute resources.
                    </p>

                    {/* Content Placeholder for Demo */}
                    <div className="space-y-12">
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                            <h3 className="font-medium text-[#111] mb-2">Base URL</h3>
                            <code className="text-sm font-mono text-gray-600 bg-white px-3 py-1 rounded border border-gray-200">
                                https://api.harbor.ai/v1
                            </code>
                        </div>

                        <div>
                            <h3 className="text-xl font-medium text-[#111] mb-4">Authentication</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Most endpoints require a valid API key. You can generate keys in the Command Center.
                                Include the key in the Authorization header of your requests.
                            </p>
                            <div className="bg-[#1a1a1a] rounded-lg p-4 overflow-x-auto text-white font-mono text-sm leading-relaxed">
                                <span className="text-purple-400">curl</span> -X GET \<br />
                                &nbsp;&nbsp;https://api.harbor.ai/v1/datasets \<br />
                                &nbsp;&nbsp;-H <span className="text-green-400">"Authorization: Bearer <span className="text-yellow-200">YOUR_API_KEY</span>"</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-medium text-[#111] mb-4">Versioning & Manifests</h3>
                            <p className="text-gray-600 leading-relaxed">
                                All data objects are versioned by default. Manifests are immutable JSON descriptions of a dataset's contents, provenance, and license status at a specific point in time.
                            </p>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Docs;
