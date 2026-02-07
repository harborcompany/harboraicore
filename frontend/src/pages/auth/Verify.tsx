import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import AuthSplitLayout from '../../components/layouts/AuthSplitLayout';
import { authStore, useAuth } from '../../lib/authStore';

const Verify: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuth();
    const [status, setStatus] = useState<'waiting' | 'resending' | 'verified'>('waiting');
    const [countdown, setCountdown] = useState(0);

    // Simulate auto-verification after 3 seconds (for demo)
    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('verified');
            authStore.verifyEmail();
            authStore.login(user.email);
            setTimeout(() => {
                navigate('/onboarding/intent');
            }, 1500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate, user.email]);

    const handleResend = () => {
        if (countdown > 0) return;
        setStatus('resending');
        setCountdown(30);
        setTimeout(() => setStatus('waiting'), 1000);
    };

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <AuthSplitLayout
            title={status === 'verified' ? 'Email Verified' : 'Verify your email'}
            subtitle={status === 'verified'
                ? 'Redirecting to onboarding...'
                : `We've sent a verification link to ${user.email || 'your email address'}.`
            }
            imageSrc="/auth-side-image.png"
        >
            <div className="text-center">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    {status === 'verified' ? (
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                            <Mail className="w-8 h-8 text-stone-600" />
                        </div>
                    )}
                </div>

                {status !== 'verified' && (
                    <>
                        {/* Status Indicator */}
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <RefreshCw className={`w-4 h-4 text-stone-400 ${status === 'resending' ? 'animate-spin' : ''}`} />
                            <span className="text-stone-500 text-sm">
                                {status === 'resending' ? 'Sending...' : 'Waiting for verification'}
                            </span>
                        </div>

                        {/* Resend Button */}
                        <button
                            onClick={handleResend}
                            disabled={countdown > 0 || status === 'resending'}
                            className="text-[#1A1A1A] font-medium hover:underline text-sm disabled:text-stone-400 disabled:no-underline"
                        >
                            {countdown > 0
                                ? `Resend in ${countdown}s`
                                : 'Resend verification link'
                            }
                        </button>
                    </>
                )}
            </div>
        </AuthSplitLayout>
    );
};

export default Verify;
