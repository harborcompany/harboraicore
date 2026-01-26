import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Github, Loader2 } from 'lucide-react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { authStore } from '../../lib/authStore';

const AuthGateway = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<'google' | 'github' | null>(null);

    const handleOAuth = async (provider: 'google' | 'github') => {
        setLoading(provider);
        const { error } = await authStore.signInWithOAuth(provider);
        if (error) {
            console.error('OAuth error:', error);
            setLoading(null);
        }
        // If successful, Supabase will redirect
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-serif text-[#1A1A1A] mb-2">Welcome to Harbor</h1>
                <p className="text-stone-500 text-sm">
                    Sign in or create an account to access datasets, APIs, and services.
                </p>
            </div>

            <div className="space-y-4">
                {/* Email Continue */}
                <button
                    onClick={() => navigate('/auth/signup')}
                    className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors"
                >
                    <Mail size={20} />
                    Continue with Email
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-stone-200"></div>
                    <span className="text-stone-400 text-xs uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-stone-200"></div>
                </div>

                {/* Google OAuth */}
                <button
                    onClick={() => handleOAuth('google')}
                    disabled={loading !== null}
                    className="w-full flex items-center justify-center gap-3 bg-white text-stone-600 py-3 px-4 rounded-lg font-medium border border-stone-200 hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                    {loading === 'google' ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    )}
                    Sign in with Google
                </button>

                {/* GitHub OAuth */}
                <button
                    onClick={() => handleOAuth('github')}
                    disabled={loading !== null}
                    className="w-full flex items-center justify-center gap-3 bg-white text-stone-600 py-3 px-4 rounded-lg font-medium border border-stone-200 hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                    {loading === 'github' ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Github size={20} />
                    )}
                    Sign in with GitHub
                </button>
            </div>

            {/* Footer Link */}
            <div className="mt-8 text-center">
                <p className="text-stone-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-[#1A1A1A] font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default AuthGateway;
