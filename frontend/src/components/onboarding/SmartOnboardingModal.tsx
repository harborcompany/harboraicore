import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, Database, Zap, Layout, Play, Terminal, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StepOption {
    id: string;
    label: string;
    icon?: any;
    route?: string;
}

interface Step {
    id: string;
    question: string;
    subhead: string;
    multiSelect: boolean;
    compulsory: boolean;
    options: StepOption[];
}

// ONBOARDING STEPS DEFINITION
const STEPS: Step[] = [
    {
        id: 'interest',
        question: "What are you interested in?",
        subhead: "We'll customize your workspace based on your primary goal.",
        multiSelect: false,
        compulsory: true,
        options: [
            { id: 'ads', label: 'Running Advertising Campaigns', icon: Play, route: '/app/ads' },
            { id: 'supply', label: 'Supplying / Monetizing Data', icon: UploadIcon, route: '/app/contribute' }, // specific icon handling below
            { id: 'purchase', label: 'Purchasing / Accessing Data', icon: Database, route: '/app/marketplace' },
            { id: 'research', label: 'AI Research & Evaluation', icon: Terminal, route: '/app' }
        ]
    },
    {
        id: 'org_profile',
        question: "What best describes your organization?",
        subhead: "Influences SLAs and compliance settings.",
        multiSelect: false,
        compulsory: false,
        options: [
            { id: 'ai_native', label: 'AI / ML company' },
            { id: 'enterprise', label: 'Enterprise (non-AI-native)' },
            { id: 'research', label: 'Research lab / academic' },
            { id: 'agency', label: 'Agency / production studio' },
            { id: 'individual', label: 'Individual / early-stage team' }
        ]
    },
    {
        id: 'modalities',
        question: "Which data types are most relevant?",
        subhead: "Select all that apply.",
        multiSelect: true,
        compulsory: false,
        options: [
            { id: 'video', label: 'Video' },
            { id: 'images', label: 'Images' },
            { id: 'audio', label: 'Audio' },
            { id: 'text', label: 'Text' },
            { id: 'multimodal', label: 'Multimodal combinations' }
        ]
    },
    {
        id: 'compliance',
        question: "Do you have compliance requirements?",
        subhead: "We can filter for regulated data automatically.",
        multiSelect: false,
        compulsory: false,
        options: [
            { id: 'none', label: 'No specific requirements' },
            { id: 'licensing', label: 'Data licensing & provenance' },
            { id: 'privacy', label: 'Privacy / PII handling' },
            { id: 'regulated', label: 'Regulated industry (health, finance)' }
        ]
    }
];

// Helper for icon since we can't use dynamic imports easily in the array above for all
function UploadIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    )
}

interface OnboardingProps {
    onComplete: () => void;
}

const SmartOnboardingModal: React.FC<OnboardingProps> = ({ onComplete }) => {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [isFinished, setIsFinished] = useState(false);

    const currentStep = STEPS[currentStepIndex];

    const handleOptionSelect = (optionId: string) => {
        if (!currentStep) return;

        if (currentStep.multiSelect) {
            const currentAnswers = (answers[currentStep.id] as string[]) || [];
            if (currentAnswers.includes(optionId)) {
                setAnswers({ ...answers, [currentStep.id]: currentAnswers.filter(id => id !== optionId) });
            } else {
                setAnswers({ ...answers, [currentStep.id]: [...currentAnswers, optionId] });
            }
        } else {
            // Single select
            setAnswers({ ...answers, [currentStep.id]: optionId });
        }
    };

    const handleNext = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            finish();
        }
    };

    const handleSkip = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            finish();
        }
    };

    const finish = () => {
        // Determine redirect based on first answer
        const intent = answers['interest'] as string;
        const targetRoute = STEPS[0].options.find(o => o.id === intent)?.route || '/app';

        // Save to local storage or backend
        localStorage.setItem('harbor_user_intent', intent);

        onComplete();
        navigate(targetRoute);
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    const isNextDisabled = () => {
        if (currentStep.compulsory) {
            const val = answers[currentStep.id];
            if (!val) return true;
            if (Array.isArray(val) && val.length === 0) return true;
        }
        return false;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-mono uppercase text-gray-400 tracking-widest">
                            Step {currentStepIndex + 1} of {STEPS.length}
                        </span>
                        {!currentStep.compulsory && (
                            <span className="text-xs text-stone-400 bg-stone-50 px-2 py-0.5 rounded">Optional</span>
                        )}
                    </div>
                    <h2 className="text-2xl font-medium text-[#111] mb-2">{currentStep.question}</h2>
                    <p className="text-gray-500 text-sm">{currentStep.subhead}</p>
                </div>

                {/* Options Logic */}
                <div className="p-8 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 gap-3">
                        {currentStep.options.map((option) => {
                            const isSelected = currentStep.multiSelect
                                ? (answers[currentStep.id] as string[])?.includes(option.id)
                                : answers[currentStep.id] === option.id;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option.id)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${isSelected
                                        ? 'border-[#111] bg-gray-50 ring-1 ring-[#111]'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                                        }`}
                                >
                                    {/* Optional Icon */}
                                    {'icon' in option && option.icon && (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#111] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {React.createElement(option.icon as any, { size: 18 })}
                                        </div>
                                    )}

                                    <span className={`flex-1 font-medium ${isSelected ? 'text-[#111]' : 'text-gray-600'}`}>
                                        {option.label}
                                    </span>

                                    {isSelected && (
                                        <Check size={18} className="text-[#111]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50/50 items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStepIndex === 0}
                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#111] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Back
                    </button>

                    <div className="flex gap-3">
                        {!currentStep.compulsory && (
                            <button
                                onClick={handleSkip}
                                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Skip
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={isNextDisabled()}
                            className="px-6 py-2.5 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {currentStepIndex === STEPS.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartOnboardingModal;
