import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, CreditCard, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

import { useAuth } from '../../lib/authStore';

const Settings: React.FC = () => {
    const user = useAuth();
    const [name, setName] = useState(user.name || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user.name) setName(user.name);
    }, [user.name]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name, name: name } // Identify both for safety
            });

            if (error) throw error;

            // Optimistically update local state if needed, though auth listener should catch it
            // Ideally we'd call a method on user store to refresh, but supabase auth listener handles it

            setMessage({ type: 'success', text: 'Profile updated successfully.' });

            // Refresh page/auth state logic would go here if needed
            // For now, let's assume authStore updates on event or we force a reload if strictly needed, 
            // but usually we just wait.
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-medium text-brand-dark tracking-tight mb-2">
                    Settings
                </h1>
                <p className="text-stone-500 font-light">
                    Manage your profile, notifications, and security preferences.
                </p>
            </div>

            {/* Profile Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <User size={20} className="text-brand-dark" />
                    <h2 className="text-lg font-medium text-brand-dark">Profile Information</h2>
                </div>
                {/* Success/Error Messages */}
                {message && (
                    <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-colors outline-none"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="flex items-center relative">
                            <Mail size={16} className="text-gray-400 absolute left-3" />
                            <input
                                type="email"
                                value={user.email || ''}
                                readOnly
                                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-brand-dark text-white text-sm font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Bell size={20} className="text-[#111]" />
                    <h2 className="text-lg font-medium text-[#111]">Notifications</h2>
                </div>
                <div className="space-y-4">
                    {['Product Updates', 'Security Alerts', 'Usage Reports'].map((item) => (
                        <div key={item} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <span className="text-sm text-gray-700">{item}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#111]"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security Section (Placeholder) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm opacity-60">
                <div className="flex items-center gap-3 mb-4">
                    <Shield size={20} className="text-[#111]" />
                    <h2 className="text-lg font-medium text-[#111]">Security</h2>
                </div>
                <p className="text-sm text-gray-500">SSO configuration is managed by your organization admin.</p>
            </div>
        </div>
    );
};

export default Settings;
