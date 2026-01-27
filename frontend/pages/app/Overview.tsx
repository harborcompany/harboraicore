import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Store, Megaphone, Upload, Key, ArrowRight } from 'lucide-react';
import { useAuth } from '../../lib/authStore';

const quickActions = [
    {
        icon: Database,
        title: 'Upload your first dataset',
        description: 'Get started by uploading audio or video content',
        link: '/app/contribute'
    },
    {
        icon: Store,
        title: 'Browse licensed datasets',
        description: 'Explore production-ready data for your AI models',
        link: '/app/marketplace'
    },
    {
        icon: Key,
        title: 'Request API credentials',
        description: 'Access datasets and annotations programmatically',
        link: '/app/api'
    },
    {
        icon: Megaphone,
        title: 'Talk to Harbor team',
        description: 'Get help with custom requirements',
        link: '/contact'
    }
];

const Overview: React.FC = () => {
    const user = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        // Simple role-based routing
        if (user.intent === 'contributor' || user.role === 'contributor') {
            navigate('/app/contributor', { replace: true });
        } else if (user.intent === 'ai_ml' || user.intent === 'ads' || user.role === 'admin') {
            navigate('/app/enterprise', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="max-w-4xl animate-in fade-in duration-500">
            <div className="mb-8 border-b border-gray-200 pb-6">
                <h1 className="text-2xl font-medium text-[#111] tracking-tight mb-2">
                    Command Center
                </h1>
                <p className="text-stone-500 font-light text-sm">
                    System operational. All services valid.
                </p>
            </div>

            <div className="flex items-center gap-3 text-stone-400 font-mono text-xs uppercase tracking-widest mt-12">
                <div className="w-4 h-4 rounded-full border-2 border-stone-200 border-t-stone-800 animate-spin" />
                Loading Workspace
            </div>
        </div>
    );
};

export default Overview;
