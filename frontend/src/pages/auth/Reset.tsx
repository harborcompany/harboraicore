import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, Lock, Loader2, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/layouts/AuthLayout';
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
            navigate('/app');
        }
    };

    if (submitted) {
        return (
            <AuthLayout>
                <div className="text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-serif text-[#1A1A1A] mb-2">Check your email</h1>
                    <p className="text-stone-500 text-sm mb-8">
                        We've sent a password reset link to {email}.
                    </p>

                    <Link
                        to="/auth/login"
                        className="text-[#1A1A1A] font-medium hover:underline text-sm"
                    >
                        Back to sign in
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    if (mode === 'update') {
        return (
            <AuthLayout>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif text-[#1A1A1A] mb-2">Set new password</h1>
                    <p className="text-stone-500 text-sm">
                        Enter your new password below.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                        <AlertCircle size={20} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-stone-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-serif text-[#1A1A1A] mb-2">Reset your password</h1>
                <p className="text-stone-500 text-sm">
                    Enter your email and we'll send you a reset link.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-5">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                        placeholder="you@company.com"
                        required
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
                <Link to="/auth/login" className="text-stone-500 text-sm hover:text-[#1A1A1A]">
                    Back to sign in
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Reset;
