import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, Lock, Loader2, AlertCircle } from 'lucide-react';
import AuthSplitLayout from '../../components/layouts/AuthSplitLayout';
import { authStore } from '../../lib/authStore';
import { supabase } from '../../lib/supabaseClient';

const Reset: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mode: 'request' (enter email) or 'update' (enter new password)
    const [mode, setMode] = useState<'request' | 'update'>('request');

    useEffect(() => {
        // innovative check: if we are logged in or have a recovery hash, assume update mode
        // Note: supabase usually handles the hash by setting a session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setMode('update');
            }
        });

        // Also listen for hash changes or auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setMode('update');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await authStore.resetPasswordForEmail(email);

        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setSubmitted(true);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const { error } = await authStore.updatePassword(password);

        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            // Password updated, redirect to app or login
            navigate('/creator');
        }
    };

    if (submitted) {
        return (
            <AuthSplitLayout
                title="Check your email"
                subtitle={`We've sent a password reset link to ${email}.`}
                imageSrc="/auth-side-image.png"
            >
                <div className="text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <Link
                        to="/auth/login"
                        className="text-[#1A1A1A] font-medium hover:underline text-sm"
                    >
                        Back to sign in
                    </Link>
                </div>
            </AuthSplitLayout>
        );
    }

    if (mode === 'update') {
        return (
            <AuthSplitLayout
                title="Set new password"
                subtitle="Enter your new password below."
                imageSrc="/auth-side-image.png"
            >
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                        <AlertCircle size={20} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-stone-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-stone-400" />
                            </div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </AuthSplitLayout>
        );
    }

    return (
        <AuthSplitLayout
            title="Reset your password"
            subtitle="Enter your email and we'll send you a reset link."
            imageSrc="/auth-side-image.png"
        >
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-5">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={18} className="text-stone-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent outline-none transition-all"
                            placeholder="you@company.com"
                            required
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin" />
                            <span>Sending...</span>
                        </div>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
                <Link to="/auth/login" className="text-stone-500 text-sm hover:text-[#1A1A1A]">
                    Back to sign in
                </Link>
            </div>
        </AuthSplitLayout>
    );
};

export default Reset;
