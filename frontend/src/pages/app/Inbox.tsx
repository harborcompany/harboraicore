import React from 'react';
import { Mail, Video, DollarSign, Megaphone, Database, CheckCircle2 } from 'lucide-react';

const notifications: any[] = [];

const Inbox: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">Inbox</h1>
                <p className="text-stone-500">Notifications and updates</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-stone-100 w-full text-left">
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
                ) : (
                    <div className="flex flex-col items-center max-w-sm">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-stone-300" />
                        </div>
                        <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">All caught up</h3>
                        <p className="text-stone-500 text-sm">
                            You have no new notifications or messages. Alerts about your datasets, payouts, and system updates will appear here.
                        </p>
                    </div>
                )}
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
