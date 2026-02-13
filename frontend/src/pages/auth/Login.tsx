import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import AuthSplitLayout from '../../components/layouts/AuthSplitLayout';
import { authStore } from '../../lib/authStore';
import { useLocation } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || null;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await authStore.signIn(email, password);

        setLoading(false);
        if (error) {
            // Check for various forms of email verification errors
            const errorMessage = error.message.toLowerCase();
            if (errorMessage.includes('email not confirmed') ||
                errorMessage.includes('email link is invalid') ||
                errorMessage.includes('verify your email')) {
                navigate('/auth/verify', { state: { email } });
            } else {
                setError(error.message);
            }
        } else {
            const user = authStore.getUser();
            const destination = from || (user.role === 'admin' ? '/admin' : '/creator');
            navigate(destination);
        }
    };

    // Update title
    React.useEffect(() => {
        document.title = 'HARBOR | Login';
    }, []);

    return (
        <AuthSplitLayout
            title="Welcome back"
            subtitle="Sign in to your Harbor account"
            imageSrc="/auth-side-image.png"
        >

            {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800">
                    <AlertCircle size={20} />
                    <div className="text-sm">
                        <p className="font-bold">Configuration Error</p>
                        <p>Supabase Environment Variables are missing. Please check your deployment configuration.</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-3 text-red-700">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span className="text-sm">{error}</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={18} className="text-stone-400" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-stone-400" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-stone-600">
                        <input type="checkbox" className="rounded border-stone-300" />
                        Remember me
                    </label>
                    <Link to="/auth/reset" className="text-[#1A1A1A] font-medium hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign in'
                    )}
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-stone-200"></div>
                    <span className="flex-shrink-0 mx-4 text-stone-400 text-xs">DEV TOOLS</span>
                    <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        authStore.devLogin().then(() => {
                            const user = authStore.getUser();
                            const destination = from || (user.role === 'admin' ? '/admin' : '/creator');
                            navigate(destination);
                        });
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-600 py-3 px-4 rounded-lg font-medium hover:bg-stone-200 transition-colors"
                >
                    Bypass Login (Dev Mode)
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-stone-500 text-sm">
                    Don't have an account?{' '}
                    <Link to="/auth/signup" className="text-[#1A1A1A] font-medium hover:underline">
                        Create one
                    </Link>
                </p>
            </div>



        </AuthSplitLayout>
    );
};




export default Login;
