import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/layouts/AuthLayout';
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

    const location = useLocation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            authStore.setEmail(email);

            // Capture intent from navigation state if present
            const state = location.state as { intent?: any };
            if (state?.intent) {
                authStore.setIntent(state.intent);
            }

            navigate('/auth/verify');
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-serif text-[#1A1A1A] mb-2">Create your Harbor account</h1>
                <p className="text-stone-500 text-sm">
                    Use a work email. Personal domains may require manual review.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                        Work Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-white border ${errors.email ? 'border-red-400' : 'border-stone-200'} rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors`}
                        placeholder="you@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-white border ${errors.password ? 'border-red-400' : 'border-stone-200'} rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors pr-12`}
                            placeholder="8+ characters"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">
                        Confirm Password
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-400' : 'border-stone-200'} rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#1A1A1A] transition-colors`}
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors mt-6"
                >
                    Continue
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
        </AuthLayout>
    );
};

export default Signup;
