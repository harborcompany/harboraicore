import React from 'react';

const Quickstart: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div>
                <span className="text-indigo-600 font-mono text-sm tracking-wide font-medium mb-4 block">GETTING STARTED</span>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                    Quickstart Guide
                </h1>
                <p className="text-xl text-gray-500 leading-relaxed max-w-3xl">
                    Follow this guide to generate an API key, install the client SDK, and fetch your first dataset manifest.
                </p>
            </div>

            <div className="space-y-12">
                {/* Step 1 */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                        <h2 className="text-2xl font-bold text-gray-900">Get your API Key</h2>
                    </div>
                    <div className="pl-12">
                        <p className="text-gray-600 mb-6">
                            Navigate to the <a href="/app/settings" className="text-indigo-600 hover:underline">Settings Dashboard</a> in the Harbor console. Generate a new "Read-Only" key for this tutorial.
                        </p>
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
                            <strong>Note:</strong> Keep your API key secure. Do not commit it to version control.
                        </div>
                    </div>
                </section>

                {/* Step 2 */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                        <h2 className="text-2xl font-bold text-gray-900">Install the SDK</h2>
                    </div>
                    <div className="pl-12">
                        <p className="text-gray-600 mb-4">
                            Harbor provides a verified Python SDK for seamless integration.
                        </p>
                        <div className="bg-[#1e1e1e] rounded-xl p-6 overflow-x-auto shadow-2xl">
                            <code className="text-gray-100 font-mono text-sm">
                                pip install harbor-ai-client
                            </code>
                        </div>
                    </div>
                </section>

                {/* Step 3 */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                        <h2 className="text-2xl font-bold text-gray-900">Fetch a Manifest</h2>
                    </div>
                    <div className="pl-12">
                        <p className="text-gray-600 mb-4">
                            Use the client to list available public datasets and retrieve a download manifest.
                        </p>
                        <div className="bg-[#1e1e1e] rounded-xl p-6 overflow-x-auto shadow-2xl group relative">
                            <pre className="text-gray-100 font-mono text-sm leading-relaxed">
                                {`from harbor import HarborClient

client = HarborClient(api_key="hrb_live_...")

# List available datasets
datasets = client.datasets.list(limit=5)
print(datasets)

# Get specific manifest
manifest = client.datasets.get_manifest(
    dataset_id="ds_kinetics_700",
    format="jsonl"
)`}
                            </pre>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-200" />

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="/docs/api" className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all">
                            <div className="font-semibold text-indigo-600 mb-1">Explore the API</div>
                            <div className="text-sm text-gray-500">Deep dive into REST endpoints.</div>
                        </a>
                        <a href="/docs/manifests" className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all">
                            <div className="font-semibold text-indigo-600 mb-1">Understand Manifests</div>
                            <div className="text-sm text-gray-500">Learn about data schema structure.</div>
                        </a>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Quickstart;
