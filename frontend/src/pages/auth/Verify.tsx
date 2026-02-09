import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import AuthSplitLayout from '../../components/layouts/AuthSplitLayout';
import { authStore, useAuth } from '../../lib/authStore';

const Verify: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuth();

    // Get email from router state (passed from Login) or auth store
    const email = location.state?.email || user.email;

    const [status, setStatus] = useState<'waiting' | 'resending' | 'sent' | 'error'>('waiting');
    const [countdown, setCountdown] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleResend = async () => {
        if (countdown > 0 || !email) return;

        setStatus('resending');
        setErrorMessage(null);

        const { error } = await authStore.resendConfirmationEmail(email);

        if (error) {
            setStatus('error');
            setErrorMessage(error.message);
        } else {
            setStatus('sent');
            setCountdown(60); // 60s cooldown
        }
    };

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <AuthSplitLayout
            title={status === 'sent' ? 'Email Sent' : 'Verify your email'}
            subtitle={status === 'sent'
                ? 'Check your inbox.'
                : `We need to verify ${email || 'your email'} before you can log in.`
            }
            imageSrc="/auth-side-image.png"
        >
            <div className="text-center">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    {status === 'sent' ? (
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                            <Mail className="w-8 h-8 text-stone-600" />
                        </div>
                    )}
                </div>

                {status === 'error' && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {errorMessage || 'Failed to send email. Please try again.'}
                    </div>
                )}

                {status === 'sent' ? (
                    <div className="mb-8">
                        <p className="text-stone-600 mb-4">
                            We've sent a fresh verification link to <strong>{email}</strong>.
                        </p>
                        <p className="text-sm text-stone-500">
                            Please check your inbox and click the link to activate your account.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <RefreshCw className={`w-4 h-4 text-stone-400 ${status === 'resending' ? 'animate-spin' : ''}`} />
                            <span className="text-stone-500 text-sm">
                                {status === 'resending' ? 'Sending...' : 'Waiting for verification'}
                            </span>
                        </div>

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
