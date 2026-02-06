import React from 'react';
import { User, Bell, Shield, CreditCard, Mail } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-medium text-[#111] tracking-tight mb-2">
                    Settings
                </h1>
                <p className="text-stone-500 font-light">
                    Manage your profile, notifications, and security preferences.
                </p>
            </div>

            {/* Profile Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <User size={20} className="text-[#111]" />
                    <h2 className="text-lg font-medium text-[#111]">Profile Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            defaultValue="Akeem Ojuko"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="flex items-center">
                            <Mail size={16} className="text-gray-400 absolute ml-3" />
                            <input
                                type="email"
                                defaultValue="akeem@harbor.ai"
                                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors">
                        Save Changes
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
