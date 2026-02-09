import React from 'react';
import { Webhook, CheckCircle } from 'lucide-react';

const DocsWebhooks: React.FC = () => {
    const events = [
        { event: 'dataset.created', description: 'New dataset initialized' },
        { event: 'dataset.ready', description: 'Dataset processing complete' },
        { event: 'annotation.completed', description: 'Auto-annotation finished' },
        { event: 'review.approved', description: 'Human review approved' },
        { event: 'export.ready', description: 'Export file available for download' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-medium text-[#111] mb-4 flex items-center gap-3">
                    <Webhook className="text-indigo-600" />
                    Webhooks & Events
                </h1>
                <p className="text-gray-600 mb-8">Receive real-time notifications for platform events.</p>
            </div>

            <section>
                <h2 className="text-xl font-semibold text-[#111] mb-4">Available Events</h2>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Event</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((item, idx) => (
                                <tr key={item.event} className={idx !== events.length - 1 ? 'border-b border-gray-100' : ''}>
                                    <td className="py-3 px-4">
                                        <code className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{item.event}</code>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{item.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-[#111] mb-4">Webhook Payload Example</h2>
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
            </section>

            <section className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <h3 className="font-semibold text-[#111] mb-3 flex items-center gap-2">
                    <CheckCircle className="text-blue-600" size={20} />
                    Webhook Best Practices
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Respond with 2xx status within 5 seconds</li>
                    <li>• Verify the <code className="bg-blue-100 px-1 rounded">X-Harbor-Signature</code> header</li>
                    <li>• Implement idempotency using the event ID</li>
                    <li>• Configure retry endpoints for failed deliveries</li>
                </ul>
            </section>
        </div>
    );
};

export default DocsWebhooks;
