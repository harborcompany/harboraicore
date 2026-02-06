import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { authStore, useAuth } from '../../lib/authStore';

const Complete: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuth();

    useEffect(() => {
        // Mark onboarding as complete
        authStore.completeOnboarding();

        // Smart routing based on intent
        const timer = setTimeout(() => {
            switch (user.intent) {
                case 'ai_ml':
                    navigate('/app/datasets');
                    break;
                case 'ads':
                    navigate('/app/ads');
                    break;
                case 'dataset_licensing':
                    navigate('/app/marketplace');
                    break;
                case 'contributor':
                    navigate('/app/contribute');
                    break;
                default:
                    navigate('/app');
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate, user.intent]);

    return (
        <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center px-4">
            <div className="text-center">
                {/* Victory Visual */}
                <div className="mb-12 relative group flex justify-center">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse transition-all group-hover:scale-110"></div>
                    <img
                        src="/assets/onboarding_success_harbor_1769158790376.png"
                        alt="Infrastructure Deployment Successful"
                        className="relative w-[500px] h-[300px] object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20"
                    />
                </div>

                <h1 className="text-5xl font-serif text-[#1A1A1A] mb-4">Infrastructure Provisioned</h1>
                <p className="text-stone-500 text-xl mb-12 max-w-lg mx-auto leading-relaxed">
                    Your secure enclave on the Harbor L1 network is now active. Routing you to your commander's dashboard...
                </p>

                {/* Loading indicator */}
                <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Complete;
