import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Zap, Shield } from 'lucide-react';

const Introduction: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div>
                <span className="text-indigo-600 font-mono text-sm tracking-wide font-medium mb-4 block">GETTING STARTED</span>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                    What is Harbor?
                </h1>
                <p className="text-xl text-gray-500 leading-relaxed max-w-3xl">
                    Harbor is the enterprise infrastructure for multimodal AI data. We provide a unified platform to source, annotate, and manage high-fidelity datasets for training and fine-tuning foundation models.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        icon: <Database className="w-6 h-6 text-indigo-600" />,
                        title: "Licensed Sourcing",
                        desc: "Access verified, rights-cleared video and audio from premium content partners."
                    },
                    {
                        icon: <Shield className="w-6 h-6 text-indigo-600" />,
                        title: "Enterprise Compliance",
                        desc: "Full audit trails, indemnification, and SOC 2 Type II compliant infrastructure."
                    },
                    {
                        icon: <Zap className="w-6 h-6 text-indigo-600" />,
                        title: "Real-time Pipelines",
                        desc: "Stream live data directly into your training loops with sub-second latency."
                    }
                ].map((feature, i) => (
                    <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>

            <div className="prose prose-lg prose-indigo max-w-none text-gray-600">
                <h2>Why Harbor?</h2>
                <p>
                    Training state-of-the-art multimodal models requires more than just scraping the web. You need consistency, provenance, and scale. Harbor abstracts the complexity of data logistics, giving you a single API to request, validate, and ingest petabytes of training data.
                </p>
                <div className="not-prose my-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center">
                    <div className="flex-1">
                        <h4 className="text-blue-900 font-semibold mb-2">Ready to start building?</h4>
                        <p className="text-blue-700 text-sm">Get your API key and make your first request in less than 5 minutes.</p>
                    </div>
                    <Link to="/docs/quickstart" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                        Go to Quickstart <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Introduction;
