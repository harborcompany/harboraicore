import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Bell, Check, Trash2, ChevronRight, CheckCircle,
    AlertCircle, Target, DollarSign, Info, MoreVertical
} from 'lucide-react';
import { notificationService, Notification } from '../../services/creatorNotificationService';

const CreatorNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        const data = await notificationService.getNotifications();
        setNotifications(data);
        setLoading(false);
    };

    const handleMarkAsRead = async (id: string) => {
        await notificationService.markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleMarkAllAsRead = async () => {
        await notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleDelete = async (id: string) => {
        await notificationService.deleteNotification(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filtered = notifications.filter(n => filter === 'all' || !n.read);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'submission_approved': return <CheckCircle className="text-green-500" size={20} />;
            case 'revision_requested': return <AlertCircle className="text-amber-500" size={20} />;
            case 'new_opportunity': return <Target className="text-blue-500" size={20} />;
            case 'payment_sent': return <DollarSign className="text-emerald-500" size={20} />;
            default: return <Info className="text-gray-400" size={20} />;
        }
    };

    const formatDate = (iso: string) => {
        const date = new Date(iso);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 mt-1">Updates on your activity and earnings.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm font-medium text-[#2563EB] hover:text-blue-700 flex items-center gap-1.5"
                    >
                        <Check size={16} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'unread' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Unread {unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-[#2563EB] text-white text-[10px] rounded-full">{unreadCount}</span>}
                </button>
            </div>

            {/* Notification List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-[#F7F7F8] rounded-2xl p-12 text-center border border-gray-100 border-dashed">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Bell size={20} className="text-gray-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">No notifications here</h3>
                        <p className="text-xs text-gray-500 mt-1">We'll notify you when your submissions are reviewed or new datasets are ready.</p>
                    </div>
                ) : (
                    filtered.map(notification => (
                        <div
                            key={notification.id}
                            className={`group relative bg-white border rounded-2xl p-4 transition-all hover:border-gray-300 ${!notification.read ? 'border-blue-100 bg-blue-50/10 shadow-sm' : 'border-gray-100'}`}
                        >
                            {!notification.read && (
                                <div className="absolute top-4 right-4 w-2 h-2 bg-[#2563EB] rounded-full shadow-sm" />
                            )}

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 mt-0.5">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0 pr-8">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {formatDate(notification.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                        {notification.message}
                                    </p>
                                    {notification.description && (
                                        <p className="text-xs text-gray-400 mb-3 italic">
                                            {notification.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3">
                                        {notification.actionUrl && (
                                            <Link
                                                to={notification.actionUrl}
                                                className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 group/btn"
                                            >
                                                {notification.actionLabel || 'View'}
                                                <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                            </Link>
                                        )}
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="text-xs font-medium text-gray-400 hover:text-gray-600"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className="ml-auto md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50"
                                            title="Delete notification"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <p className="text-center text-[10px] text-gray-400">
                Notifications older than 30 days are automatically cleared.
            </p>
        </div>
    );
};

export default CreatorNotifications;
