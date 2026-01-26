import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';

interface OnboardingLayoutProps {
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
    title?: string;
    showSkip?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
    children,
    currentStep,
    totalSteps,
    title,
    showSkip = true
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Step path mapping for back navigation
    const stepPaths = [
        '/onboarding/intent',
        '/onboarding/organization',
        '/onboarding/data-types',
        '/onboarding/consent',
        '/onboarding/complete'
    ];

    const handleBack = () => {
        if (currentStep > 1) {
            navigate(stepPaths[currentStep - 2]);
        } else {
            navigate('/');
        }
    };

    const handleClose = () => {
        // Navigate back to homepage
        navigate('/');
    };

    const handleSkip = () => {
        // Skip to dashboard directly
        navigate('/app');
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
            <header className="px-6 py-8 border-b border-stone-200 bg-white">
                <div className="max-w-6xl mx-auto relative flex items-center justify-between">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-stone-500 hover:text-[#1A1A1A] transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium hidden sm:inline">Back</span>
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex items-center absolute left-1/2 -translate-x-1/2">
                        <img
                            src="/harbor-logo.png"
                            alt="Harbor"
                            className="h-10 w-auto"
                        />
                    </Link>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="p-2 text-stone-400 hover:text-[#1A1A1A] hover:bg-stone-100 rounded-full transition-all"
                        title="Exit onboarding"
                    >
                        <X size={20} />
                    </button>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100">
                <div
                    className="h-1 bg-[#1A1A1A] transition-all duration-500"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </div>

            {/* Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-xl">
                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-xs text-stone-400 font-mono uppercase tracking-widest">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <div className="flex gap-1.5">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-colors ${i < currentStep ? 'bg-[#1A1A1A]' : 'bg-stone-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {title && (
                        <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-8 text-center">
                            {title}
                        </h1>
                    )}
                    {children}

                    {/* Skip Option */}
                    {showSkip && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleSkip}
                                className="text-sm text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-4"
                            >
                                Skip setup and go to dashboard
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer with navigation links */}
            <footer className="px-6 py-4 border-t border-stone-200 bg-white">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <nav className="flex items-center gap-4 text-xs text-stone-400">
                        <Link to="/" className="hover:text-stone-600 transition-colors">Home</Link>
                        <Link to="/product" className="hover:text-stone-600 transition-colors">Product</Link>
                        <Link to="/datasets" className="hover:text-stone-600 transition-colors">Datasets</Link>
                        <Link to="/pricing" className="hover:text-stone-600 transition-colors">Pricing</Link>
                    </nav>
                    <p className="text-xs text-stone-500">
                        Need help? <a href="mailto:support@harbor.ai" className="text-stone-700 hover:text-[#1A1A1A]">Contact support</a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingLayout;

