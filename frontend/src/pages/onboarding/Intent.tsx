import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Database, Megaphone, Upload, Search, Blocks } from 'lucide-react';
import OnboardingLayout from '../../components/layouts/OnboardingLayout';
import { authStore } from '../../lib/authStore';

interface IntentOption {
    id: 'lego_builder' | 'ai_ml' | 'dataset_licensing' | 'ads' | 'contributor' | 'explore';
    icon: React.ElementType;
    title: string;
    description: string;
}

const intentOptions: IntentOption[] = [
    {
        id: 'lego_builder',
        icon: Blocks,
        title: 'Lego Data Contributor',
        description: 'Join the Lego AI Data Program'
    },
    {
        id: 'ai_ml',
        icon: Brain,
        title: 'Training AI or ML models',
        description: 'Access datasets for model training and fine-tuning'
    },
    {
        id: 'dataset_licensing',
        icon: Database,
        title: 'Licensing audio or video datasets',
        description: 'Browse and license production-ready datasets'
    },
    {
        id: 'ads',
        icon: Megaphone,
        title: 'Running ads or content campaigns',
        description: 'Create high-performance video advertising'
    },
    {
        id: 'contributor',
        icon: Upload,
        title: 'Contributing or monetizing data',
        description: 'Upload and earn from your audio/video content'
    },
    {
        id: 'explore',
        icon: Search,
        title: 'Exploring the platform',
        description: 'Learn what Harbor can do for your team'
    }
];

const Intent: React.FC = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = React.useState<IntentOption['id'] | null>(null);

    // Initial state check
    React.useEffect(() => {
        const user = authStore.getUser();
        if (user.intent) {
            setSelected(user.intent);
        }
    }, []);

    const handleContinue = () => {
        if (selected) {
            authStore.setIntent(selected);
            if (selected === 'lego_builder') {
                navigate('/onboarding/lego-experience');
            } else {
                navigate('/onboarding/organization');
            }
        }
    };

    return (
        <OnboardingLayout currentStep={1} totalSteps={4} title="How will you use Harbor?">
            <div className="grid grid-cols-1 gap-3">
                {intentOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setSelected(option.id)}
                        className={`w-full flex items-center gap-5 p-5 rounded-xl border transition-all text-left group ${selected === option.id
                            ? 'bg-[#1A1A1A] border-white/20'
                            : 'bg-[#0F0F0F] border-white/5 hover:border-white/10'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors bg-[#1A1A1A] border border-white/5 text-gray-400 group-hover:text-white ${selected === option.id ? 'text-white border-white/10' : ''}`}>
                            <option.icon size={20} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="font-serif text-lg mb-1 text-white">
                                {option.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-light">
                                {option.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <button
                onClick={handleContinue}
                disabled={!selected}
                className="w-full bg-[#888] text-black py-4 px-6 rounded-md font-medium text-base hover:bg-white transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue
            </button>
        </OnboardingLayout>
    );
};

export default Intent;
