
import React, { useState, useEffect } from 'react';
import { Mail, Search, MessageSquare, Send, User, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { messagingService, type Message } from '../../services/messagingService';
import { useAuth } from '../../lib/authStore';

export default function CreatorMessages() {
    const user = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        if (user.id) {
            setMessages(messagingService.getInbox(user.id));
        }
    }, [user.id]);

    function handleSelect(msg: Message) {
        setSelectedMessage(msg);
        if (!msg.read) {
            messagingService.markAsRead(msg.id);
            setMessages(messagingService.getInbox(user.id));
        }
    }

    function handleSendReply() {
        if (!replyText.trim() || !selectedMessage) return;

        messagingService.sendMessage({
            senderId: user.id,
            senderName: user.name || 'Creator',
            recipientId: selectedMessage.senderId,
            subject: `Re: ${selectedMessage.subject}`,
            body: replyText,
        });

        setReplyText('');
        // In a real app we'd refresh or the message would show in a thread
        alert('Reply sent to administrator.');
    }

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Internal Messages</h1>
                <p className="text-gray-500">Direct coordination with Harbor administrators and QA team.</p>
            </div>

            <div className="flex-1 flex bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {/* List */}
                <div className="w-1/3 border-r border-gray-100 flex flex-col">
                    <div className="p-4 border-b border-gray-50">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-xs focus:ring-1 focus:ring-black outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {messages.map(msg => (
                            <button
                                key={msg.id}
                                onClick={() => handleSelect(msg)}
                                className={`w-full p-4 text-left border-b border-gray-50 transition-colors flex gap-3 relative ${selectedMessage?.id === msg.id ? 'bg-gray-50' : 'hover:bg-gray-50/50'
                                    }`}
                            >
                                {!msg.read && (
                                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                )}
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                                    <User size={18} className="text-stone-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <span className="text-sm font-semibold text-gray-900 truncate">{msg.senderName}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-700 truncate">{msg.subject}</p>
                                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{msg.body}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedMessage ? (
                        <>
                            <div className="p-6 border-b border-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{selectedMessage.subject}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-medium text-gray-700">{selectedMessage.senderName}</span>
                                            <span className="text-gray-300">·</span>
                                            <span className="text-xs text-gray-400">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                                            <Clock size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                                            <CheckCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                                    {selectedMessage.body}
                                </div>
                            </div>

                            {/* Reply Box */}
                            <div className="p-6 mt-auto bg-gray-50/50">
                                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm focus-within:ring-1 focus-within:ring-black transition-all">
                                    <textarea
                                        rows={3}
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        placeholder="Type your reply to the administrator..."
                                        className="w-full border-none p-0 focus:ring-0 text-sm placeholder:text-gray-400 resize-none"
                                    />
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                        <span className="text-[10px] text-gray-400">Direct encrypted channel</span>
                                        <button
                                            onClick={handleSendReply}
                                            disabled={!replyText.trim()}
                                            className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                                        >
                                            Send Reply
                                            <Send size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Mail size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">Select a message</h3>
                            <p className="text-xs text-gray-500 max-w-[200px] mt-1">Read and respond to communications from the Harbor team.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
