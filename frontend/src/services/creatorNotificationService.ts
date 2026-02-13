/**
 * Creator Notification Service
 * Manages system notifications for creators.
 */

export interface Notification {
    id: string;
    type: 'submission_approved' | 'revision_requested' | 'new_opportunity' | 'payment_sent' | 'system';
    title: string;
    message: string;
    description?: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
}

const STORAGE_KEY = 'harbor_creator_notifications';

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'submission_approved',
        title: 'Submission Approved! 🎉',
        message: 'Your video "LEGO Technic Assembly" has been approved.',
        description: 'Earnings of $45.00 have been added to your balance.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2h ago
        read: false,
        actionUrl: '/creator/submissions',
        actionLabel: 'View Submission'
    },
    {
        id: '2',
        type: 'new_opportunity',
        title: 'New Project: Audio Sarcasm Detection',
        message: 'A new high-paying audio project is now available.',
        description: 'Earn up to $150/hr for voice dataset collection.',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1d ago
        read: true,
        actionUrl: '/creator/opportunities',
        actionLabel: 'See Details'
    },
    {
        id: '3',
        type: 'revision_requested',
        title: 'Revision Requested',
        message: 'Reviewer requested a change for "Kitchen Demo".',
        description: 'Please ensure hands are fully visible in the second half.',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2d ago
        read: false,
        actionUrl: '/creator/submissions',
        actionLabel: 'Fix Now'
    }
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const notificationService = {
    async getNotifications(): Promise<Notification[]> {
        await delay(300);
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);

        // Initialize with mocks if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
        return MOCK_NOTIFICATIONS;
    },

    async markAsRead(id: string): Promise<void> {
        const notifications = await this.getNotifications();
        const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    async markAllAsRead(): Promise<void> {
        const notifications = await this.getNotifications();
        const updated = notifications.map(n => ({ ...n, read: true }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    async deleteNotification(id: string): Promise<void> {
        const notifications = await this.getNotifications();
        const updated = notifications.filter(n => n.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
};
