import React, { useEffect } from 'react';
import { X, ArrowRight, Code, Terminal, BookOpen, Shield, Copy, Check, Database, Activity } from 'lucide-react';
import { uiStore, useUI } from '../../lib/uiStore';

const ApiDocsDrawer: React.FC = () => {
    const { isApiDocsOpen, activeApiTab } = useUI();
    const [copied, setCopied] = React.useState<string | null>(null);

    // Lock body scroll when open
    useEffect(() => {
        if (isApiDocsOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; }
    }, [isApiDocsOpen]);

    // Keyboard listener for Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') uiStore.closeApiDocs();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (!isApiDocsOpen) return null;

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const CodeBlock = ({ code, language, id }: { code: string, language: string, id: string }) => (
        <div className="relative group rounded-lg border border-gray-200 bg-gray-50 overflow-hidden my-4">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => copyToClipboard(code, id)}
                    className="p-1.5 bg-white border border-gray-200 rounded-md hover:text-[#111] text-gray-400"
                >
                    {copied === id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
            </div>
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs text-stone-500 font-mono">
                <span>{language}</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-800 leading-relaxed whitespace-pre-wrap">
                {code}
            </pre>
        </div>
    );

    const Endpoint = ({ method, path, desc }: { method: string, path: string, desc: string }) => (
        <div className="mb-8 last:mb-0">
            <div className="flex items-center gap-3 mb-2 font-mono text-sm">
                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide ${method === 'GET' ? 'bg-blue-50 text-blue-700' :
                    method === 'POST' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {method}
                </span>
                <span className="text-[#111]">{path}</span>
            </div>
            <p className="text-sm text-gray-500">{desc}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => uiStore.closeApiDocs()}
            />

            {/* Drawer */}
            <div className="relative w-full md:w-[85vw] lg:w-[1000px] h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col md:flex-row">

                {/* Left Navigation (Tabs) */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col pt-20 md:pt-0 shrink-0">
                    <div className="p-6 hidden md:block border-b border-gray-100">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#111]">Developer Docs</h2>
                    </div>
                    <nav className="p-4 space-y-1">
                        {[
                            { id: 'overview', label: 'Overview', icon: BookOpen },
                            { id: 'reference', label: 'API Reference', icon: Terminal },
                            { id: 'start', label: 'Getting Started', icon: Code },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => uiStore.setApiTab(item.id as any)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeApiTab === item.id
                                    ? 'bg-white shadow-sm text-[#111] ring-1 ring-gray-200'
                                    : 'text-gray-500 hover:text-[#111] hover:bg-gray-100/50'
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto p-6 hidden md:block">
                        <div className="bg-[#111] text-white p-4 rounded-xl text-xs space-y-3">
                            <p className="opacity-80">Need higher rate limits?</p>
                            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded font-medium transition-colors">
                                Contact Engineering
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
                    {/* Close Button Mobile/Desktop */}
                    <button
                        onClick={() => uiStore.closeApiDocs()}
                        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-stone-400 hover:text-[#111] z-10 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
                        <div className="max-w-3xl mx-auto pb-20">

                            {/* TAB 1: OVERVIEW */}
                            {activeApiTab === 'overview' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="space-y-4">
                                        <h1 className="text-3xl md:text-4xl font-medium text-[#111] tracking-tight">Harbor APIs</h1>
                                        <p className="text-lg text-gray-500 font-light leading-relaxed">
                                            Programmatic access to Harbor’s image, audio, and video datasets — built for training, evaluation, and continuous learning workflows.
                                        </p>
                                    </div>

                                    <div className="prose prose-stone prose-sm">
                                        <p className="text-gray-600 leading-relaxed text-base">
                                            Harbor APIs allow teams to retrieve datasets, stream continuous data, query structured metadata, and integrate training inputs directly into production pipelines.
                                            All endpoints are versioned, auditable, and aligned to enterprise security and compliance requirements.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            onClick={() => uiStore.setApiTab('reference')}
                                            className="px-6 py-3 bg-[#111] text-white rounded-lg font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                                        >
                                            View API Reference <ArrowRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => uiStore.setApiTab('start')}
                                            className="px-6 py-3 border border-gray-200 text-[#111] rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Getting Started
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
                                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4 text-[#111]">
                                                <Database size={20} />
                                            </div>
                                            <h3 className="font-medium text-[#111] mb-2">Manifest API</h3>
                                            <p className="text-sm text-gray-500">Query structured metadata schemas and retrieve immutable change logs for every dataset version.</p>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4 text-[#111]">
                                                <Activity size={20} />
                                            </div>
                                            <h3 className="font-medium text-[#111] mb-2">Streaming Feed</h3>
                                            <p className="text-sm text-gray-500">Subscribe to continuous data ingestion feeds via WebSocket or polling endpoints.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: REFERENCE */}
                            {activeApiTab === 'reference' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div>
                                        <h2 className="text-2xl font-medium text-[#111] mb-6">Authentication</h2>
                                        <p className="text-gray-600 mb-6 text-sm">
                                            All requests require a scoped Bearer token. API keys can be managed in the Integration Center.
                                        </p>
                                        <CodeBlock
                                            id="auth_example"
                                            language="curl"
                                            code={`Authorization: Bearer <API_KEY>`}
                                        />
                                        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3">
                                            <Shield size={16} className="text-emerald-600 mt-0.5" />
                                            <p className="text-xs text-emerald-800">API keys are scoped per project and all requests are auditable.</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-10">
                                        <h2 className="text-2xl font-medium text-[#111] mb-8">Base URL</h2>
                                        <CodeBlock
                                            id="base_url"
                                            language="bash"
                                            code={`https://api.harbor.ai/v1`}
                                        />
                                    </div>

                                    <div className="border-t border-gray-100 pt-10">
                                        <h2 className="text-2xl font-medium text-[#111] mb-8">Datasets</h2>

                                        <Endpoint
                                            method="GET"
                                            path="/datasets"
                                            desc="Returns available datasets the user has access to."
                                        />
                                        <CodeBlock
                                            id="get_datasets"
                                            language="json"
                                            code={`{
  "datasets": [
    {
      "id": "ds_123",
      "name": "Retail Video Actions",
      "modalities": ["video", "audio"],
      "version": "v1.2",
      "license": "commercial",
      "updated_at": "2026-01-15"
    }
  ]
}`}
                                        />

                                        <div className="mt-8"></div>
                                        <Endpoint
                                            method="GET"
                                            path="/datasets/{dataset_id}/manifest"
                                            desc="Returns dataset metadata, structure, and provenance."
                                        />
                                    </div>

                                    <div className="border-t border-gray-100 pt-10">
                                        <h2 className="text-2xl font-medium text-[#111] mb-8">Data Access</h2>

                                        <Endpoint
                                            method="POST"
                                            path="/datasets/{dataset_id}/export"
                                            desc="Initiates bulk export to cloud storage (S3/GCS)."
                                        />

                                        <div className="mt-8"></div>
                                        <Endpoint
                                            method="POST"
                                            path="/datasets/{dataset_id}/stream"
                                            desc="Subscribes to continuous data updates from live sources."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: GETTING STARTED */}
                            {activeApiTab === 'start' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div>
                                        <h1 className="text-3xl font-medium text-[#111] tracking-tight mb-4">Getting Started</h1>
                                        <p className="text-gray-500 font-light text-lg">Go from zero to first dataset pull in 5 minutes.</p>
                                    </div>

                                    <div className="space-y-10 relative border-l border-gray-200 ml-3 pl-8">
                                        {/* Step 1 */}
                                        <div className="relative">
                                            <div className="absolute -left-[39px] top-0 w-6 h-6 rounded-full bg-white border-2 border-stone-800 text-[10px] font-bold flex items-center justify-center text-[#111]">1</div>
                                            <h3 className="font-medium text-[#111] mb-2">Request Access</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Developers request dataset access through Harbor sales or account teams. Once approved, API credentials are issued.
                                            </p>
                                        </div>

                                        {/* Step 2 */}
                                        <div className="relative">
                                            <div className="absolute -left-[39px] top-0 w-6 h-6 rounded-full bg-white border-2 border-stone-800 text-[10px] font-bold flex items-center justify-center text-[#111]">2</div>
                                            <h3 className="font-medium text-[#111] mb-2">Authenticate</h3>
                                            <p className="text-sm text-gray-600 mb-4">Use your API key to make authenticated requests.</p>

                                            <div className="mb-6">
                                                <h4 className="text-xs font-medium text-stone-900 mb-2 uppercase tracking-wide">Python</h4>
                                                <CodeBlock
                                                    id="python_auth"
                                                    language="python"
                                                    code={`import requests

API_KEY = "your_api_key"
headers = {
    "Authorization": f"Bearer {API_KEY}"
}

response = requests.get(
    "https://api.harbor.ai/v1/datasets",
    headers=headers
)

print(response.json())`}
                                                />
                                            </div>

                                            <div>
                                                <h4 className="text-xs font-medium text-stone-900 mb-2 uppercase tracking-wide">JavaScript</h4>
                                                <CodeBlock
                                                    id="js_auth"
                                                    language="javascript"
                                                    code={`const response = await fetch(
  "https://api.harbor.ai/v1/datasets",
  {
    headers: {
      "Authorization": \`Bearer \${process.env.HARBOR_API_KEY}\`
    }
  }
);

const data = await response.json();
console.log(data);`}
                                                />
                                            </div>
                                        </div>

                                        {/* Step 3 */}
                                        <div className="relative">
                                            <div className="absolute -left-[39px] top-0 w-6 h-6 rounded-full bg-white border-2 border-stone-800 text-[10px] font-bold flex items-center justify-center text-[#111]">3</div>
                                            <h3 className="font-medium text-[#111] mb-2">Retrieve a Dataset Manifest</h3>
                                            <p className="text-sm text-gray-600 mb-4">Get the structured metadata for your dataset ID.</p>
                                            <CodeBlock
                                                id="python_manifest"
                                                language="python"
                                                code={`dataset_id = "ds_123"

response = requests.get(
    f"https://api.harbor.ai/v1/datasets/{dataset_id}/manifest",
    headers=headers
)

print(response.json())`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiDocsDrawer;
