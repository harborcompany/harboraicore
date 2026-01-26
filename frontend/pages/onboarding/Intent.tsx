import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Database, Megaphone, Upload, Search } from 'lucide-react';
import OnboardingLayout from '../../components/layouts/OnboardingLayout';
import { authStore } from '../../lib/authStore';

interface IntentOption {
    id: 'ai_ml' | 'dataset_licensing' | 'ads' | 'contributor' | 'explore';
    icon: React.ElementType;
    title: string;
    description: string;
}

const intentOptions: IntentOption[] = [
    {
        id: 'ai_ml',
        icon: Brain,
        title: 'Model Training & Fine-Tuning',
        description: 'Access high-fidelity datasets for scale-aware model optimization'
    },
    {
        id: 'dataset_licensing',
        icon: Database,
        title: 'Multimodal Dataset Licensing',
        description: 'Browse and license production-grade, commercially-ready datasets'
    },
    {
        id: 'ads',
        icon: Megaphone,
        title: 'Managed Creative Services',
        description: 'Generate vertical-optimized creative leveraging Harbor data assets'
    },
    {
        id: 'contributor',
        icon: Upload,
        title: 'Data Ingestion & Monetization',
        description: 'Ingest proprietary assets into the Harbor data fabric for monetization'
    },
    {
        id: 'explore',
        icon: Search,
        title: 'Infrastructure Research',
        description: 'Evaluate Harbor’s L1 network and architectural capabilities'
    }
];

const Intent: React.FC = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = React.useState<IntentOption['id'] | null>(null);

    React.useEffect(() => {
        const user = authStore.getUser();
        if (user.intent) {
            setSelected(user.intent);
        }
    }, []);

    const handleContinue = () => {
        if (selected) {
            authStore.setIntent(selected);
            navigate('/onboarding/organization');
        }
    };

    return (
        <OnboardingLayout currentStep={1} totalSteps={4} title="How will you use Harbor?">
            <div className="space-y-3">
                {intentOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setSelected(option.id)}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${selected === option.id
                            ? 'bg-[#1A1A1A] border-[#1A1A1A]'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selected === option.id ? 'bg-white text-[#1A1A1A]' : 'bg-stone-100 text-stone-500'
                            }`}>
                            <option.icon size={20} />
                        </div>
                        <div>
                            <h3 className={`font-medium ${selected === option.id ? 'text-white' : 'text-[#1A1A1A]'}`}>
                                {option.title}
                            </h3>
                            <p className={`text-sm mt-0.5 ${selected === option.id ? 'text-white/70' : 'text-stone-500'}`}>
                                {option.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <button
                onClick={handleContinue}
                disabled={!selected}
                className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue
            </button>
        </OnboardingLayout>
    );
};

export default Intent;
