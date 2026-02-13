
// Internal Messaging Service
// CRUD for creator-admin communications

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    recipientId: string;
    subject: string;
    body: string;
    read: boolean;
    createdAt: string;
}

// Mock Data
let MESSAGES: Message[] = [
    {
        id: '1',
        senderId: 'admin_id',
        senderName: 'Harbor QA Team',
        recipientId: 'dev-user-id',
        subject: 'Welcome to Harbor Elite!',
        body: 'Congratulations! Your reliability score has crossed the 95% threshold. You are now promoted to the Elite tier.',
        read: false,
        createdAt: '2026-02-12T10:00:00Z',
    },
    {
        id: '2',
        senderId: 'admin_id',
        senderName: 'Harbor Support',
        recipientId: 'dev-user-id',
        subject: 'Update on Referral Payout',
        body: 'Your 10h milestone payout for referred user A. Smith is scheduled for Feb 28.',
        read: true,
        createdAt: '2026-02-11T14:30:00Z',
    }
];

export const messagingService = {
    getInbox: (userId: string): Message[] => {
        return MESSAGES.filter(m => m.recipientId === userId).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    getUnreadCount: (userId: string): number => {
        return MESSAGES.filter(m => m.recipientId === userId && !m.read).length;
    },

    markAsRead: (messageId: string): void => {
        const msg = MESSAGES.find(m => m.id === messageId);
        if (msg) msg.read = true;
    },

    sendMessage: (message: Omit<Message, 'id' | 'read' | 'createdAt'>): void => {
        const newMessage: Message = {
            ...message,
            id: Math.random().toString(36).substr(2, 9),
            read: false,
            createdAt: new Date().toISOString(),
        };
        MESSAGES.push(newMessage);
    },

    // Automated QA Feedback
    sendQaFeedback: (userId: string, uploadId: string, feedback: string): void => {
        messagingService.sendMessage({
            senderId: 'system',
            senderName: 'Harbor QA Engine',
            recipientId: userId,
            subject: `Feedback on Upload ${uploadId.substr(0, 8)}`,
            body: feedback,
        });
    }
};
