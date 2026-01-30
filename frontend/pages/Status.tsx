import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Activity, Server, Database, Globe, Cpu } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { Link } from 'react-router-dom';

const StatusPage: React.FC = () => {
    // Mock status data - in a real app this would fetch from an API
    const systems = [
        { name: 'API Gateway', status: 'operational', icon: Globe },
        { name: 'Database Clusters', status: 'operational', icon: Database },
        { name: 'Auth Services', status: 'operational', icon: Server },
        { name: 'S3 Storage', status: 'operational', icon: Database },
        { name: 'GPU Inference Cluster', status: 'degraded', icon: Cpu, message: 'High latency on A100 nodes' },
        { name: 'Scheduler', status: 'operational', icon: Activity },
    ];

    const incidents = [
        {
            date: 'Jan 28, 2026',
            title: 'GPU Cluster Latency',
            status: 'investigating',
            updates: [
                { time: '14:30 UTC', message: 'We are investigating increased latency on the A100 inference cluster.' }
            ]
        },
        {
            date: 'Jan 25, 2026',
            title: 'Scheduled Maintenance',
            status: 'completed',
            updates: [
                { time: '02:00 UTC', message: 'Maintenance completed successfully.' }
            ]
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'text-green-500 bg-green-50 border-green-200';
            case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'down': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'operational': return <CheckCircle2 size={18} />;
            case 'degraded': return <AlertTriangle size={18} />;
            case 'down': return <XCircle size={18} />;
            default: return <Activity size={18} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#111] pt-32 pb-24 px-6">
            <SeoHead
                title="Harbor System Status"
                description="Real-time performance and availability of Harbor services."
            />

            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">System Status</h1>
                        <p className="text-stone-500">Current status of Harbor services and API.</p>
                    </div>
                    <Link to="/contact" className="mt-4 md:mt-0 text-sm font-medium border border-stone-200 px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all bg-stone-50">
                        Report an Issue
                    </Link>
                </div>

                {/* Overall Status */}
                <div className="bg-white border border-stone-200 rounded-2xl p-8 mb-12 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-medium mb-1">All Systems Operational</h2>
                        <p className="text-stone-500">99.99% uptime in the last 30 days.</p>
                    </div>
                </div>

                {/* System Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                    {systems.map((sys) => (
                        <div key={sys.name} className="bg-white border border-stone-200 p-6 rounded-xl flex items-center justify-between group hover:border-stone-300 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-stone-50 rounded-lg text-stone-600">
                                    <sys.icon size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-stone-900">{sys.name}</div>
                                    {sys.message && <div className="text-xs text-yellow-600 mt-0.5">{sys.message}</div>}
                                </div>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(sys.status)}`}>
                                {getStatusIcon(sys.status)}
                                <span className="capitalize">{sys.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Incident History */}
                <h2 className="text-2xl font-medium mb-6">Incident History</h2>
                <div className="space-y-6">
                    {incidents.map((incident, i) => (
                        <div key={i} className="border-l-2 border-stone-200 pl-6 pb-6 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-stone-200 border-2 border-[#FAFAFA]"></div>
                            <div className="mb-2 flex items-center gap-3">
                                <span className="text-sm font-medium text-stone-400 font-mono">{incident.date}</span>
                                <h3 className="text-lg font-medium">{incident.title}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${incident.status === 'resolved' || incident.status === 'completed'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    }`}>
                                    {incident.status}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {incident.updates.map((update, j) => (
                                    <div key={j} className="text-stone-600 text-sm">
                                        <span className="text-stone-400 font-mono mr-2">{update.time}</span>
                                        {update.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default StatusPage;
