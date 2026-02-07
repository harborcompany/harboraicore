import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import AuthSplitLayout from '../../components/layouts/AuthSplitLayout';
import { authStore } from '../../lib/authStore';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            setLoading(true);
            const { error } = await authStore.signUp(email, password);
            setLoading(false);

            if (error) {
                setErrors({ ...errors, form: error.message });
            } else {
                // Determine destination
                const state = location.state as { intent?: any };
                if (state?.intent) {
                    authStore.setIntent(state.intent);
                }
                navigate('/auth/verify');
            }
        }
    };

    return (
        <AuthSplitLayout
            title="Create your account"
            subtitle="Use a work email. Personal domains may require manual review."
            imageSrc="/auth-side-image.png"
        >

            {errors.form && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {errors.form}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                        Work Email
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
                            className={`w-full bg-white border ${errors.email ? 'border-red-400' : 'border-stone-200'} rounded-lg pl-10 pr-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors`}
                            placeholder="you@company.com"
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-stone-400" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-white border ${errors.password ? 'border-red-400' : 'border-stone-200'} rounded-lg pl-10 pr-12 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors`}
                            placeholder="8+ characters"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-stone-400 hover:text-stone-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-stone-400" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-400' : 'border-stone-200'} rounded-lg pl-10 pr-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors`}
                            placeholder="Confirm your password"
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating Account...' : 'Continue'}
                </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
                <p className="text-stone-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-[#1A1A1A] font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthSplitLayout>
    );
};

export default Signup;
