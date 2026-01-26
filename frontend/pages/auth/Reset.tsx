import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import AuthLayout from '../../components/layouts/AuthLayout';

const Reset: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
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

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors"
                >
                    Send Reset Link
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
