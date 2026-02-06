import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Video, Layers } from 'lucide-react';
import OnboardingLayout from '../../components/layouts/OnboardingLayout';
import { authStore } from '../../lib/authStore';

const videoFormats = [
    'Egocentric (POV)',
    'Surveillance & Security',
    'Cinematic & Linear',
    'Synthetic & Simulation'
];

const DataTypes: React.FC = () => {
    const navigate = useNavigate();
    const [audio, setAudio] = useState(false);
    const [video, setVideo] = useState(false);
    const [multimodal, setMultimodal] = useState(false);
    const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

    const handleFormatToggle = (format: string) => {
        if (selectedFormats.includes(format)) {
            setSelectedFormats(selectedFormats.filter(f => f !== format));
        } else {
            setSelectedFormats([...selectedFormats, format]);
        }
    };

    const handleContinue = () => {
        authStore.setDataTypes({
            audio,
            video,
            multimodal,
            videoFormats: selectedFormats
        });
        navigate('/onboarding/consent');
    };

    const hasSelection = audio || video || multimodal;

    return (
        <OnboardingLayout currentStep={3} totalSteps={4} title="What type of data are you working with?">
            <div className="space-y-4">
                {/* Audio */}
                <button
                    onClick={() => setAudio(!audio)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${audio
                        ? 'bg-[#1A1A1A] border-[#1A1A1A]'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${audio ? 'bg-white text-[#1A1A1A]' : 'bg-stone-100 text-stone-500'
                        }`}>
                        <Mic size={24} />
                    </div>
                    <div>
                        <h3 className={`font-medium ${audio ? 'text-white' : 'text-[#1A1A1A]'}`}>Audio</h3>
                        <p className={`text-sm ${audio ? 'text-white/70' : 'text-stone-500'}`}>Speech, music, environmental sounds</p>
                    </div>
                </button>

                {/* Video */}
                <button
                    onClick={() => setVideo(!video)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${video
                        ? 'bg-[#1A1A1A] border-[#1A1A1A]'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${video ? 'bg-white text-[#1A1A1A]' : 'bg-stone-100 text-stone-500'
                        }`}>
                        <Video size={24} />
                    </div>
                    <div>
                        <h3 className={`font-medium ${video ? 'text-white' : 'text-[#1A1A1A]'}`}>Video</h3>
                        <p className={`text-sm ${video ? 'text-white/70' : 'text-stone-500'}`}>Visual content with or without audio</p>
                    </div>
                </button>

                {/* Multimodal */}
                <button
                    onClick={() => setMultimodal(!multimodal)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${multimodal
                        ? 'bg-[#1A1A1A] border-[#1A1A1A]'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${multimodal ? 'bg-white text-[#1A1A1A]' : 'bg-stone-100 text-stone-500'
                        }`}>
                        <Layers size={24} />
                    </div>
                    <div>
                        <h3 className={`font-medium ${multimodal ? 'text-white' : 'text-[#1A1A1A]'}`}>Temporally-Aligned Multimodal</h3>
                        <p className={`text-sm ${multimodal ? 'text-white/70' : 'text-stone-500'}`}>Synchronized audio and video pairs with unified metadata</p>
                    </div>
                </button>

                {/* Video Format Sub-options */}
                {video && (
                    <div className="mt-6 pt-6 border-t border-stone-200">
                        <p className="text-sm text-stone-600 mb-3">What type of video content?</p>
                        <div className="grid grid-cols-2 gap-2">
                            {videoFormats.map((format) => (
                                <button
                                    key={format}
                                    onClick={() => handleFormatToggle(format)}
                                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedFormats.includes(format)
                                        ? 'bg-[#1A1A1A] text-white'
                                        : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
                                        }`}
                                >
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleContinue}
                disabled={!hasSelection}
                className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#333] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue
            </button>
        </OnboardingLayout>
    );
};

export default DataTypes;
