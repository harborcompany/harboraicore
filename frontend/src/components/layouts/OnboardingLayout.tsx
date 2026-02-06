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
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white selection:text-black">
            <header className="px-6 py-8 border-b border-white/5 bg-[#050505]">
                <div className="max-w-6xl mx-auto relative flex items-center justify-between">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium hidden sm:inline">Back</span>
                    </button>

                    {/* Logo (Centered) */}
                    <Link to="/" className="flex items-center absolute left-1/2 -translate-x-1/2 gap-2">
                        <div className="flex items-center gap-1 text-white">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="6" cy="12" r="5" />
                                <rect x="13" y="7" width="10" height="10" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold tracking-tight uppercase">HARBOR</span>
                    </Link>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
                        title="Exit onboarding"
                    >
                        <X size={20} />
                    </button>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-1">
                <div
                    className="h-full bg-white transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </div>

            {/* Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-full max-w-xl">
                    {/* Step Tabs */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-12">
                        {['Intent', 'Organization', 'Data Types', 'Support'].map((label, i) => {
                            const stepNum = i + 1;
                            const isActive = stepNum === currentStep;
                            const isCompleted = stepNum < currentStep;

                            return (
                                <div key={label} className={`flex items-center gap-2 ${isActive ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono border ${isActive ? 'bg-white text-black border-white' :
                                            isCompleted ? 'bg-transparent text-gray-400 border-gray-400' :
                                                'bg-transparent text-gray-600 border-gray-600'
                                        }`}>
                                        {stepNum}
                                    </div>
                                    <span className="text-sm font-medium hidden sm:block">{label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {title && (
                        <h1 className="text-3xl md:text-5xl font-serif text-center mb-12 text-white leading-tight">
                            {title}
                        </h1>
                    )}

                    {children}

                    {/* Skip Option */}
                    {showSkip && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleSkip}
                                className="text-xs text-gray-500 hover:text-white transition-colors font-medium border-b border-transparent hover:border-white/50 pb-0.5"
                            >
                                Skip setup and go to dashboard
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer with navigation links */}
            <footer className="px-6 py-6 border-t border-white/5 bg-[#050505]">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <nav className="flex items-center gap-6 text-[11px] text-gray-500 font-medium uppercase tracking-wide">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/product" className="hover:text-white transition-colors">Product</Link>
                        <Link to="/datasets" className="hover:text-white transition-colors">Datasets</Link>
                    </nav>
                    <p className="text-[11px] text-gray-600">
                        Need help? <a href="mailto:support@harbor.ai" className="text-gray-400 underline underline-offset-2 hover:text-white">Contact support</a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingLayout;
