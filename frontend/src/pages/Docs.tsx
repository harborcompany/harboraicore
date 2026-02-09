import React, { useState } from 'react';
import { Book, Code, Layers, FileText, ChevronRight, Menu, X, Terminal, Database, Shield, Zap } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { Link } from 'react-router-dom';

const Docs: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
                                Documentation 2.0
                            </div>
                            <h1 className="text-4xl font-medium text-[#111] mb-6">Harbor Platform Documentation</h1>
                            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
                                The unified infrastructure for media-native AI. Ingest, annotate, and train on audio/video data at scale with enterprise-grade security and compliance.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-all cursor-pointer group bg-white hover:shadow-sm"
                                onClick={() => setActiveSection('quickstart')}
                            >
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                                    <Zap size={20} />
                                </div>
                                <h3 className="text-lg font-medium text-[#111] mb-2">Quickstart</h3>
                                <p className="text-gray-500 text-sm">Deploy your first agent and ingest a dataset in under 5 minutes using our CLI or API.</p>
                            </div>
                            <div
                                className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-all cursor-pointer group bg-white hover:shadow-sm"
                                onClick={() => setActiveSection('architecture')}
                            >
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 transition-transform">
                                    <Layers size={20} />
                                </div>
                                <h3 className="text-lg font-medium text-[#111] mb-2">Architecture</h3>
                                <p className="text-gray-500 text-sm">Understand the core components: Data Fabric, RAG Engine, and Contributor Pipeline.</p>
                            </div>
                            <div
                                className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-all cursor-pointer group bg-white hover:shadow-sm"
                                onClick={() => setActiveSection('pipeline')}
                            >
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600 group-hover:scale-110 transition-transform">
                                    <Database size={20} />
                                </div>
                                <h3 className="text-lg font-medium text-[#111] mb-2">Data Pipeline</h3>
                                <p className="text-gray-500 text-sm">Learn how data moves from ingestion to annotation to training readiness.</p>
                            </div>
                            <div
                                className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-all cursor-pointer group bg-white hover:shadow-sm"
                                onClick={() => setActiveSection('security')}
                            >
                                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-4 text-orange-600 group-hover:scale-110 transition-transform">
                                    <Shield size={20} />
                                </div>
                                <h3 className="text-lg font-medium text-[#111] mb-2">Security</h3>
                                <p className="text-gray-500 text-sm">Enterprise security model, SOC 2 compliance, and data governance best practices.</p>
                            </div>
                        </div>
                    </div>
                );

            case 'quickstart':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-3xl font-medium text-[#111] mb-4">Quickstart Guide</h1>
                            <p className="text-gray-600 mb-8">Get up and running with Harbor in minutes.</p>

                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-lg font-medium text-[#111] mb-4">1. Install the CLI</h3>
                                    <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">BASH</div>
                                        <p>npm install -g harbor-cli</p>
                                        <p>harbor login</p>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-medium text-[#111] mb-4">2. Create a Project</h3>
                                    <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                        <p>harbor init my-first-agent</p>
                                        <p>cd my-first-agent</p>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-medium text-[#111] mb-4">3. Ingest Data</h3>
                                    <p className="text-gray-600 mb-4">You can ingest data from S3, GCS, or local files.</p>
                                    <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">PYTHON SDK</div>
                                        <pre>{`from harbor import Harbor

client = Harbor(api_key="your_key")

dataset = client.datasets.create(name="voice-samples-v1")
client.ingest.from_s3(
    dataset_id=dataset.id,
    bucket="my-raw-audio",
    prefix="training/"
)`}</pre>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                );

            case 'architecture':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-3xl font-medium text-[#111] mb-6">System Architecture</h1>
                            <p className="text-gray-600 mb-8">
                                Harbor acts as the semantic layer between raw storage and your model training infrastructure.
                            </p>

                            <div className="prose prose-stone max-w-none">
                                <h3>The Three Layers</h3>
                                <ul className="list-none pl-0 space-y-6">
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
                                        <div>
                                            <h4 className="font-semibold text-[#111] m-0">Ingestion & Processing Layer</h4>
                                            <p className="m-0 text-gray-600">Handles normalizing diverse formats (mp4, wav, json) into a unified columnar format. Automatic de-duplication, resizing, and transcoding happens here.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold shrink-0">2</div>
                                        <div>
                                            <h4 className="font-semibold text-[#111] m-0">Semantic Indexing Layer</h4>
                                            <p className="m-0 text-gray-600">Runs embeddings and metadata extraction. This is where "raw files" become "searchable knowledge".</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0">3</div>
                                        <div>
                                            <h4 className="font-semibold text-[#111] m-0">Serving & Training Layer</h4>
                                            <p className="m-0 text-gray-600">Delivers data tailored for RAG (vector search) or Fine-tuning (jsonl/parquet exports).</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'pipeline':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-3xl font-medium text-[#111] mb-6">Data Pipeline</h1>
                            <p className="text-gray-600 mb-8">
                                From raw contributor upload to production-ready dataset.
                            </p>

                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-8">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-sm font-medium text-gray-500">
                                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-[#111]">Upload</div>
                                    <div className="hidden md:block h-px w-8 bg-gray-300"></div>
                                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-[#111]">Auto-Annotate</div>
                                    <div className="hidden md:block h-px w-8 bg-gray-300"></div>
                                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-[#111]">Human Review</div>
                                    <div className="hidden md:block h-px w-8 bg-gray-300"></div>
                                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-[#111]">Dataset Lock</div>
                                </div>
                            </div>

                            <div className="prose prose-stone max-w-none">
                                <h3>Pipeline Stages</h3>

                                <h4 className="text-[#111] font-medium mt-6">1. Ingestion & Auto-Labeling</h4>
                                <p>
                                    As soon as data is uploaded, Harbor triggers a workflow of pre-trained models (e.g., YOLO, Whisper) to generate initial ground truth. This reduces human labeler time by up to 80%.
                                </p>

                                <h4 className="text-[#111] font-medium mt-6">2. Human-in-the-Loop Review</h4>
                                <p>
                                    Low-confidence samples are routed to expert human reviewers. Their corrections are fed back into the auto-labeling models, creating a flywheel of improving accuracy.
                                </p>

                                <h4 className="text-[#111] font-medium mt-6">3. Quality Assurance</h4>
                                <p>
                                    Statistical sampling is performed on every batch. If error rates exceed thresholds (e.g., 3%), the entire batch is flagged for re-review.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'api':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-3xl font-medium text-[#111] mb-4">API Reference</h1>
                            <p className="text-gray-600">REST API endpoints for managing datasets and jobs.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-[#111] mb-2">List Datasets</h3>
                                <div className="bg-[#1e1e1e] text-gray-300 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-lg">
                                    <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                                        <span className="text-green-400 font-bold">GET</span>
                                        <span className="text-white">/v1/datasets</span>
                                    </div>
                                    <pre>{`{
  "data": [
    {
      "id": "ds_8x92m",
      "name": "Global News Archive",
      "type": "video",
      "size": "4.2TB",
      "status": "ready",
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "total": 12,
    "page": 1
  }
}`}</pre>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-[#111] mb-2">Submit Job</h3>
                                <div className="bg-[#1e1e1e] text-gray-300 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-lg">
                                    <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                                        <span className="text-blue-400 font-bold">POST</span>
                                        <span className="text-white">/v1/jobs</span>
                                    </div>
                                    <pre>{`{
  "type": "annotation",
  "dataset_id": "ds_8x92m",
  "config": {
    "model": "yolov8-x",
    "classes": ["person", "car", "bus"]
  }
}`}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-3xl font-medium text-[#111] mb-4">Security & Compliance</h1>
                            <p className="text-gray-600 mb-8">Enterprise-grade security for sensitive data operations.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-6 bg-green-50 border border-green-100 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Shield className="text-green-600" size={24} />
                                    <h3 className="font-semibold text-[#111]">SOC 2 Type II</h3>
                                </div>
                                <p className="text-sm text-gray-600">Annual audits covering security, availability, and confidentiality.</p>
                            </div>
                            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Database className="text-blue-600" size={24} />
                                    <h3 className="font-semibold text-[#111]">GDPR & CCPA</h3>
                                </div>
                                <p className="text-sm text-gray-600">Full compliance with data protection regulations.</p>
                            </div>
                        </div>

                        <div className="prose prose-stone max-w-none">
                            <h3>Data Encryption</h3>
                            <ul>
                                <li><strong>At Rest:</strong> AES-256 encryption for all stored data</li>
                                <li><strong>In Transit:</strong> TLS 1.3 for all connections</li>
                                <li><strong>Key Management:</strong> AWS KMS with customer-managed keys (BYOK)</li>
                            </ul>

                            <h3>Access Control</h3>
                            <ul>
                                <li>Role-based access control (RBAC) with granular permissions</li>
                                <li>SSO integration (SAML 2.0, OIDC)</li>
                                <li>API key scoping with IP allowlists</li>
                                <li>Audit logging for all data access events</li>
                            </ul>

                            <h3>Infrastructure</h3>
                            <ul>
                                <li>VPC isolation with private subnets</li>
                                <li>Multi-region redundancy</li>
                                <li>99.9% uptime SLA</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'sdks':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-3xl font-medium text-[#111] mb-4">SDKs & Libraries</h1>
                            <p className="text-gray-600 mb-8">Official client libraries for integrating with Harbor.</p>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-lg font-medium text-[#111] mb-4 flex items-center gap-2">
                                    <Terminal size={20} className="text-blue-600" />
                                    Python SDK
                                </h3>
                                <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">INSTALLATION</div>
                                    <p>pip install harbor-sdk</p>
                                </div>
                                <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">USAGE</div>
                                    <pre>{`from harbor import Harbor

client = Harbor(api_key="hb_...")

# Create a dataset
dataset = client.datasets.create(
    name="voice-intent-v2",
    type="audio",
    tags=["production", "voice"]
)

# Upload files
client.datasets.upload(
    dataset_id=dataset.id,
    files=["./recordings/*.wav"]
)`}</pre>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-medium text-[#111] mb-4 flex items-center gap-2">
                                    <Code size={20} className="text-green-600" />
                                    Node.js SDK
                                </h3>
                                <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">INSTALLATION</div>
                                    <p>npm install @harbor-ai/sdk</p>
                                </div>
                                <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">USAGE</div>
                                    <pre>{`import Harbor from '@harbor-ai/sdk';

const client = new Harbor({ apiKey: 'hb_...' });

// List all datasets
const datasets = await client.datasets.list();

// Stream annotations
for await (const annotation of client.annotations.stream(datasetId)) {
  console.log(annotation);
}`}</pre>
                                </div>
                            </section>
                        </div>
                    </div>
                );

            case 'webhooks':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-3xl font-medium text-[#111] mb-4">Webhooks & Events</h1>
                            <p className="text-gray-600 mb-8">Receive real-time notifications for platform events.</p>
                        </div>

                        <div className="prose prose-stone max-w-none mb-8">
                            <h3>Available Events</h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Event</th>
                                        <th className="text-left py-2">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2 font-mono text-xs bg-gray-100 px-2 rounded">dataset.created</td>
                                        <td className="py-2 text-gray-600">New dataset initialized</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2 font-mono text-xs bg-gray-100 px-2 rounded">dataset.ready</td>
                                        <td className="py-2 text-gray-600">Dataset processing complete</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2 font-mono text-xs bg-gray-100 px-2 rounded">annotation.completed</td>
                                        <td className="py-2 text-gray-600">Auto-annotation finished</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2 font-mono text-xs bg-gray-100 px-2 rounded">review.approved</td>
                                        <td className="py-2 text-gray-600">Human review approved</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-mono text-xs bg-gray-100 px-2 rounded">export.ready</td>
                                        <td className="py-2 text-gray-600">Export file available for download</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-[#111] mb-4">Webhook Payload Example</h3>
                            <div className="bg-[#1e1e1e] text-gray-300 p-6 rounded-xl font-mono text-sm overflow-x-auto">
                                <pre>{`{
  "id": "evt_abc123",
  "type": "dataset.ready",
  "created_at": "2026-02-07T10:00:00Z",
  "data": {
    "dataset_id": "ds_8x92m",
    "name": "Voice Commands v3",
    "total_samples": 15420,
    "qa_score": 0.94
  }
}`}</pre>
                            </div>
                        </div>
                    </div>
                );

            case 'authentication':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-3xl font-medium text-[#111] mb-4">Authentication</h1>
                            <p className="text-gray-600 mb-8">Secure your API requests with Harbor authentication.</p>
                        </div>

                        <div className="prose prose-stone max-w-none">
                            <h3>API Keys</h3>
                            <p>
                                API keys are the primary authentication method. Generate keys from your
                                <Link to="/app/settings" className="text-blue-600 hover:underline mx-1">Dashboard Settings</Link>.
                            </p>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                                <p className="text-amber-800 text-sm m-0">
                                    <strong>Important:</strong> API keys grant full access to your account. Never expose them in client-side code.
                                </p>
                            </div>

                            <h3>Using Your API Key</h3>
                        </div>

                        <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">HTTP HEADER</div>
                            <p>Authorization: Bearer hb_live_xxxxxxxxxxxx</p>
                        </div>

                        <div className="prose prose-stone max-w-none">
                            <h3>Key Types</h3>
                            <ul>
                                <li><strong>Live Keys</strong> (<code>hb_live_</code>): Production use</li>
                                <li><strong>Test Keys</strong> (<code>hb_test_</code>): Sandbox environment</li>
                                <li><strong>Scoped Keys</strong>: Limited to specific datasets or operations</li>
                            </ul>

                            <h3>OAuth 2.0 (Enterprise)</h3>
                            <p>
                                For enterprise SSO integration, Harbor supports OAuth 2.0 with PKCE flow.
                                Contact your account manager for configuration.
                            </p>
                        </div>
                    </div>
                );

            case 'contributors':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h1 className="text-3xl font-medium text-[#111] mb-4">Contributor Guide</h1>
                            <p className="text-gray-600 mb-8">Everything you need to know about contributing data to Harbor.</p>
                        </div>

                        <div className="prose prose-stone max-w-none">
                            <h3>Getting Started</h3>
                            <ol>
                                <li><Link to="/auth/signup" className="text-blue-600 hover:underline">Create an account</Link></li>
                                <li>Complete the onboarding questionnaire</li>
                                <li>Browse available data programs from your Dashboard</li>
                                <li>Submit your first contribution</li>
                            </ol>

                            <h3>Submission Guidelines</h3>
                            <h4>Video Submissions</h4>
                            <ul>
                                <li>Minimum resolution: 720p</li>
                                <li>Formats: MP4, MOV, WebM</li>
                                <li>Hands-only builds: Keep face out of frame</li>
                                <li>Good lighting, stable camera</li>
                            </ul>

                            <h4>Audio Submissions</h4>
                            <ul>
                                <li>Minimum quality: 16-bit, 44.1kHz</li>
                                <li>Formats: WAV, MP3, FLAC</li>
                                <li>Clear voice, minimal background noise</li>
                                <li>Follow provided script prompts exactly</li>
                            </ul>

                            <h3>Payment Schedule</h3>
                            <p>
                                Approved submissions are paid out on the <strong>1st of each month</strong>.
                                View your pending and approved submissions in your
                                <Link to="/app/contribute" className="text-blue-600 hover:underline mx-1">Contributor Dashboard</Link>.
                            </p>
                        </div>
                    </div>
                );

            default:
                return <div>Select a section</div>;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#111]">
            <SeoHead
                title="Documentation | Harbor"
                description="Technical documentation for the Harbor AI platform."
            />

            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 md:px-8">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#111] rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-xs">H</span>
                        </div>
                        <span className="font-bold tracking-tight">Harbor Docs</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-500">
                    <a href="#" className="hover:text-[#111] transition-colors">Support</a>
                    <a href="#" className="hover:text-[#111] transition-colors">API Status</a>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <Link to="/app" className="text-blue-600 hover:text-blue-700">Go to Dashboard</Link>
                </div>

                <button onClick={toggleSidebar} className="md:hidden p-2 -mr-2 text-gray-600">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            <div className="flex pt-16 h-screen overflow-hidden">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={toggleSidebar}></div>
                )}

                {/* Sidebar */}
                <aside className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-gray-50 border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                    <div className="p-6">
                        <nav className="space-y-8">
                            <div>
                                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Getting Started</h5>
                                <ul className="space-y-1">
                                    <li>
                                        <button onClick={() => { setActiveSection('overview'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'overview' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>Overview</button>
                                    </li>
                                    <li>
                                        <button onClick={() => { setActiveSection('quickstart'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'quickstart' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>Quickstart</button>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Core Platform</h5>
                                <ul className="space-y-1">
                                    <li>
                                        <button onClick={() => { setActiveSection('architecture'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'architecture' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>Architecture</button>
                                    </li>
                                    <li>
                                        <button onClick={() => { setActiveSection('pipeline'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'pipeline' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>Data Pipeline</button>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Developers</h5>
                                <ul className="space-y-1">
                                    <li>
                                        <button onClick={() => { setActiveSection('api'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'api' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>API Reference</button>
                                    </li>
                                    <li>
                                        <button onClick={() => { setActiveSection('sdks'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'sdks' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>SDKs & Libraries</button>
                                    </li>
                                    <li>
                                        <button onClick={() => { setActiveSection('webhooks'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'webhooks' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>Webhooks & Events</button>
                                    </li>
                                    <li>
                                        <button onClick={() => { setActiveSection('authentication'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'authentication' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>Authentication</button>
                                    </li>
                                    <li>
                                        <button onClick={() => { setActiveSection('security'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'security' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>Security</button>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contributors</h5>
                                <ul className="space-y-1">
                                    <li>
                                        <button onClick={() => { setActiveSection('contributors'); setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'contributors' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}>Contributor Guide</button>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full overflow-y-auto h-[calc(100vh-4rem)]">
                    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
                        {renderContent()}

                        <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                            <p>© 2026 Harbor AI, Inc.</p>
                            <div className="flex gap-6">
                                <Link to="/terms" className="hover:text-black">Terms</Link>
                                <Link to="/privacy" className="hover:text-black">Privacy</Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Docs;
