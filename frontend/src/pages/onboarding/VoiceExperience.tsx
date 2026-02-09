import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Video, Radio, Volume2 } from 'lucide-react';
import OnboardingLayout from '../../components/layouts/OnboardingLayout';
import { authStore } from '../../lib/authStore';

const dataTypes = [
    { id: 'scripted', label: 'Scripted Speech', desc: 'Reading provided text', icon: Mic },
    { id: 'conversation', label: 'Natural Conversation', desc: 'Unscripted dialogue', icon: Radio },
    { id: 'noise', label: 'Environmental / Noise', desc: 'Background sounds', icon: Volume2 }
];

const devices = [
    'Smartphone', 'Professional Mic', 'Headset', 'Laptop Mic'
];

const VoiceExperience: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [device, setDevice] = useState<string>('');
    const [hasQuietSpace, setHasQuietSpace] = useState<boolean | null>(null);

    const toggleType = (id: string) => {
        if (selectedTypes.includes(id)) {
            setSelectedTypes(selectedTypes.filter(t => t !== id));
        } else {
            setSelectedTypes([...selectedTypes, id]);
        }
    };

    const handleContinue = () => {
        navigate('/app/contribute');
    };

    const isValid = selectedTypes.length > 0 && device && hasQuietSpace !== null;

    return (
        <OnboardingLayout currentStep={2} totalSteps={5} title="Voice & Audio Setup">
            <div className="space-y-8">

                {/* 1. Content Types */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">What can you record?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {dataTypes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => toggleType(t.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${selectedTypes.includes(t.id)
                                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                                    }`}
                            >
                                <t.icon size={24} className="mb-2" />
                                <span className="font-semibold text-sm">{t.label}</span>
                                <span className="text-xs opacity-70">{t.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Device */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Primary Recording Device</label>
                    <div className="flex flex-wrap gap-2">
                        {devices.map((d) => (
                            <button
                                key={d}
                                onClick={() => setDevice(d)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${device === d
                                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Environment */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Do you have a quiet recording space?</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setHasQuietSpace(true)}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${hasQuietSpace === true
                                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                                }`}
                        >
                            <Volume2 size={20} />
                            <div>
                                <span className="block font-medium">Yes, quiet room</span>
                                <span className="text-xs opacity-70">Little to no echo/noise</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setHasQuietSpace(false)}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${hasQuietSpace === false
                                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                                }`}
                        >
                            <Mic size={20} />
                            <div>
                                <span className="block font-medium">No, normal room</span>
                                <span className="text-xs opacity-70">Some background noise</span>
                            </div>
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!isValid}
                    className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                </button>

            </div>
        </OnboardingLayout>
    );
};

export default VoiceExperience;
