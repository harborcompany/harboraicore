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
                    Select an action to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                    <Link
                        key={action.title}
                        to={action.link}
                        className="p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                                <action.icon size={20} className="text-[#111]" />
                            </div>
                            <ArrowRight size={16} className="text-gray-300 group-hover:text-[#111] transition-colors" />
                        </div>
                        <h3 className="font-medium text-[#111] mb-1">{action.title}</h3>
                        <p className="text-sm text-stone-500">{action.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Overview;
