import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../../components/layouts/AuthLayout';
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
        <AuthLayout>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-serif text-[#1A1A1A] mb-2">Welcome back</h1>
                <p className="text-stone-500 text-sm">
                    Sign in to your Harbor account
                </p>
            </div>

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
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
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
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
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
                    <Link to="/auth/forgot-password" className="text-[#1A1A1A] font-medium hover:underline">
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
        </AuthLayout>
    );
};

export default Login;
