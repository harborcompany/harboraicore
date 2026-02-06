import React from 'react';
import { Mail, Video, DollarSign, Megaphone, Database, CheckCircle2 } from 'lucide-react';

const notifications = [
    {
        id: 1,
        type: 'video',
        title: 'New Video Processing Complete',
        message: 'The batch "Maritime Navigation v2" has finished processing and is ready for annotation.',
        time: '10 mins ago',
        icon: Video,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        id: 2,
        type: 'payout',
        title: 'Monthly Payout Processed',
        message: 'Your earnings for December ($1,240.50) have been sent to your connected account.',
        time: '2 hours ago',
        icon: DollarSign,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    {
        id: 3,
        type: 'ad',
        title: 'Ad Set "Spring Campaign" Read',
        message: 'The generated ad set has been viewed by the review team. Status updated.',
        time: '5 hours ago',
        icon: Megaphone,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    },
    {
        id: 4,
        type: 'dataset',
        title: 'New Dataset Available',
        message: 'A new high-fidelity "Urban Traffic" dataset matches your interest profile.',
        time: '1 day ago',
        icon: Database,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    {
        id: 5,
        type: 'general',
        title: 'System Maintenance Update',
        message: 'Scheduled maintenance for the inference engine is complete. All systems operational.',
        time: '2 days ago',
        icon: CheckCircle2,
        color: 'text-stone-600',
        bg: 'bg-stone-100'
    }
];

const Inbox: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">Inbox</h1>
                <p className="text-stone-500">Notifications and updates</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-stone-100">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="p-6 hover:bg-stone-50 transition-colors cursor-pointer group">
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.bg} ${notification.color}`}>
                                    <notification.icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-medium text-[#1A1A1A] group-hover:text-blue-600 transition-colors">
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-stone-400 whitespace-nowrap ml-4">
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p className="text-stone-500 text-sm leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-8">
                <button className="text-sm text-stone-400 hover:text-[#1A1A1A] transition-colors">
                    View Older Notifications
                </button>
            </div>
        </div>
    );
};

export default Inbox;
