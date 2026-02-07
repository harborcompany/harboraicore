import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import AuthSplitLayout from '../../components/layouts/AuthSplitLayout';
import { authStore } from '../../lib/authStore';

const Login = () => {
    const navigate = useNavigate();
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
            setError(error.message);
        } else {
            navigate('/app');
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

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error}</span>
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

// Dev Login Button Component
/*
const DevLoginButton = () => {
    const navigate = useNavigate();
    const handleDevLogin = async () => {
        await authStore.devLogin();
        navigate('/app');
    };

    return (
        <button 
            onClick={handleDevLogin}
            className="mt-4 w-full py-2 bg-stone-100 text-stone-600 rounded-lg text-xs hover:bg-stone-200 transition-colors"
        >
            [DEV] Login as Test User
        </button>
    );
};
*/


export default Login;
