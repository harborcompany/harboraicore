import React from 'react';
import { Terminal, Code } from 'lucide-react';

const DocsPythonSdk: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-medium text-[#111] mb-4">SDKs & Libraries</h1>
                <p className="text-gray-600 mb-8">Official client libraries for integrating with Harbor.</p>
            </div>

            <div className="space-y-10">
                <section>
                    <h2 className="text-xl font-medium text-[#111] mb-4 flex items-center gap-2">
                        <Terminal size={20} className="text-blue-600" />
                        Python SDK
                    </h2>

                    <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">INSTALLATION</div>
                        <code>pip install harbor-sdk</code>
                    </div>

                    <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">USAGE</div>
                        <pre className="whitespace-pre-wrap">{`from harbor import Harbor

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
                    <h2 className="text-xl font-medium text-[#111] mb-4 flex items-center gap-2">
                        <Code size={20} className="text-green-600" />
                        Node.js SDK
                    </h2>

                    <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">INSTALLATION</div>
                        <code>npm install @harbor-ai/sdk</code>
                    </div>

                    <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">USAGE</div>
                        <pre className="whitespace-pre-wrap">{`import Harbor from '@harbor-ai/sdk';

const client = new Harbor({ apiKey: 'hb_...' });

// List all datasets
const datasets = await client.datasets.list();

// Stream annotations
for await (const annotation of client.annotations.stream(datasetId)) {
  console.log(annotation);
}`}</pre>
                    </div>
                </section>

                <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-[#111] mb-2">Need another language?</h3>
                    <p className="text-sm text-gray-600">
                        We're actively developing SDKs for Go, Ruby, and Java.
                        <a href="/contact" className="text-blue-600 hover:underline ml-1">Contact us</a>
                        {' '}if you need priority support for a specific language.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default DocsPythonSdk;
