import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Blocks, Camera, Hammer, Trophy } from 'lucide-react';
import OnboardingLayout from '../../components/layouts/OnboardingLayout';
import { authStore } from '../../lib/authStore';

const themes = [
    'Technic', 'City', 'Star Wars', 'Architecture', 'Creator Expert', 'Ideas', 'Speed Champions', 'Harry Potter', 'MOC (Custom)'
];

const levels = [
    { id: 'beginner', label: 'Beginner', desc: '< 10 Sets', icon: Blocks },
    { id: 'intermediate', label: 'Intermediate', desc: '10-50 Sets', icon: Hammer },
    { id: 'expert', label: 'Expert', desc: '50+ Sets / MOC Builder', icon: Trophy }
];

const LegoExperience: React.FC = () => {
    const navigate = useNavigate();
    const [level, setLevel] = useState<string>('');
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [filmsBuilds, setFilmsBuilds] = useState<boolean | null>(null);

    const toggleTheme = (theme: string) => {
        if (selectedThemes.includes(theme)) {
            setSelectedThemes(selectedThemes.filter(t => t !== theme));
        } else {
            setSelectedThemes([...selectedThemes, theme]);
        }
    };

    const handleContinue = () => {
        // Save to store
        authStore.setLegoProfile({
            level,
            themes: selectedThemes,
            filmsBuilds
        });

        navigate('/app/contribute');
    };

    const isValid = level && selectedThemes.length > 0 && filmsBuilds !== null;

    return (
        <OnboardingLayout currentStep={2} totalSteps={5} title="Tell us about your Lego Journey">
            <div className="space-y-8">

                {/* 1. Experience Level */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Experience Level</label>
                    <div className="grid grid-cols-3 gap-3">
                        {levels.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setLevel(l.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${level === l.id
                                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                                    }`}
                            >
                                <l.icon size={24} className="mb-2" />
                                <span className="font-semibold text-sm">{l.label}</span>
                                <span className="text-xs opacity-70">{l.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Themes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Favorite Themes</label>
                    <div className="flex flex-wrap gap-2">
                        {themes.map((t) => (
                            <button
                                key={t}
                                onClick={() => toggleTheme(t)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedThemes.includes(t)
                                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Filming Habits */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Do you film your build process?</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setFilmsBuilds(true)}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${filmsBuilds === true
                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                                }`}
                        >
                            <Camera size={20} />
                            <div>
                                <span className="block font-medium">Yes, I record builds</span>
                                <span className="text-xs opacity-70">Time-lapses, reviews, streams</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setFilmsBuilds(false)}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${filmsBuilds === false
                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                                }`}
                        >
                            <div className="w-5 h-5 flex items-center justify-center rounded-full border border-current">
                                <span className="block w-2.5 h-[1px] bg-current transform rotate-45"></span>
                            </div>
                            <div>
                                <span className="block font-medium">No, I just build</span>
                                <span className="text-xs opacity-70">Personal enjoyment only</span>
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

export default LegoExperience;
