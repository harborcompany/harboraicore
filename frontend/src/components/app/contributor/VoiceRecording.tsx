import React, { useState, useRef } from 'react';
import { Mic, Upload, CheckCircle, AlertCircle, Volume2, Play, Square, Info } from 'lucide-react';

interface VoiceRecordingProps {
    onComplete?: (audioBlob: Blob) => void;
}

const VoiceRecording: React.FC<VoiceRecordingProps> = ({ onComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [currentStep, setCurrentStep] = useState<'record' | 'metadata' | 'processing'>('record');
    const [isPlaying, setIsPlaying] = useState(false);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const MINIMUM_DURATION = 30; // 30 seconds minimum

    const sampleScript = `"The quick brown fox jumps over the lazy dog near the riverbank. Yesterday, I walked through the park and noticed how the autumn leaves had turned golden and crimson. Technology continues to evolve at a rapid pace, transforming how we communicate, work, and live our daily lives. It's remarkable to think about all the advancements we've seen in recent years."`;

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const playPreview = () => {
        if (audioBlob && !isPlaying) {
            const url = URL.createObjectURL(audioBlob);
            audioRef.current = new Audio(url);
            audioRef.current.onended = () => setIsPlaying(false);
            audioRef.current.play();
            setIsPlaying(true);
        } else if (audioRef.current && isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setRecordingTime(0);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioBlob(file);
            // Get duration would require loading the file
            setRecordingTime(MINIMUM_DURATION); // Assume valid for uploaded files
        }
    };

    const handleSubmit = () => {
        if (audioBlob && recordingTime >= MINIMUM_DURATION) {
            setCurrentStep('metadata');
            onComplete?.(audioBlob);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const meetsRequirement = recordingTime >= MINIMUM_DURATION;

    const steps = [
        { id: 'record', label: 'UPLOAD AUDIO' },
        { id: 'metadata', label: 'VOICE METADATA' },
        { id: 'processing', label: 'PROCESSING' }
    ];

    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-stone-100">
                <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                    Record Your Voice
                </h2>
                <p className="text-stone-500 mt-1">Contribute your voice to help train AI systems.</p>
            </div>

            <div className="flex">
                {/* Sidebar Steps */}
                <div className="w-56 p-6 border-r border-stone-100 bg-stone-50">
                    <ul className="space-y-4">
                        {steps.map((step, index) => (
                            <li 
                                key={step.id}
                                className={`flex items-center gap-3 text-sm font-medium ${
                                    currentStep === step.id 
                                        ? 'text-[#1A1A1A]' 
                                        : 'text-stone-400'
                                }`}
                            >
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                    currentStep === step.id 
                                        ? 'bg-[#1A1A1A] ring-4 ring-stone-200' 
                                        : index < steps.findIndex(s => s.id === currentStep)
                                            ? 'bg-emerald-500'
                                            : 'bg-stone-300'
                                }`} />
                                {step.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-stone-700">
                            <strong>Recording Requirements:</strong> We need at least 30 seconds of clear audio. 
                            Find a quiet space, speak naturally and clearly, and follow the script below.
                        </p>
                    </div>

                    {/* Tips */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Mic className="w-4 h-4 text-stone-600" />
                                <span className="font-medium text-sm text-[#1A1A1A]">Quiet Environment</span>
                            </div>
                            <p className="text-xs text-stone-500">Ensure minimal background noise for best quality.</p>
                        </div>
                        <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Volume2 className="w-4 h-4 text-stone-600" />
                                <span className="font-medium text-sm text-[#1A1A1A]">Natural Speech</span>
                            </div>
                            <p className="text-xs text-stone-500">Speak naturally as you would in conversation.</p>
                        </div>
                        <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-stone-600" />
                                <span className="font-medium text-sm text-[#1A1A1A]">Clear Audio</span>
                            </div>
                            <p className="text-xs text-stone-500">Hold phone 6-8 inches from your mouth.</p>
                        </div>
                    </div>

                    {/* Script */}
                    <div className="bg-stone-50 rounded-xl p-5 mb-6 border border-stone-100">
                        <p className="text-xs uppercase tracking-widest text-stone-400 mb-3 font-medium">
                            Please read the following text aloud
                        </p>
                        <p className="text-stone-700 leading-relaxed font-light">
                            {sampleScript}
                        </p>
                    </div>

                    {/* Recording Area */}
                    <div 
                        className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all ${
                            isRecording 
                                ? 'border-red-300 bg-red-50' 
                                : audioBlob 
                                    ? 'border-emerald-300 bg-emerald-50'
                                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                        }`}
                    >
                        {!audioBlob ? (
                            <>
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-all shadow-lg ${
                                        isRecording 
                                            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                                            : 'bg-[#1A1A1A] hover:bg-black'
                                    }`}
                                >
                                    {isRecording ? (
                                        <Square className="w-8 h-8 text-white" />
                                    ) : (
                                        <Mic className="w-8 h-8 text-white" />
                                    )}
                                </button>
                                <p className="text-lg font-medium text-[#1A1A1A] mb-1">
                                    {isRecording ? 'Recording...' : 'Click to Record'}
                                </p>
                                {isRecording && (
                                    <p className="text-2xl font-bold text-red-600 mb-2">
                                        {formatTime(recordingTime)}
                                    </p>
                                )}
                                <p className="text-sm text-stone-400">or drag and drop audio file</p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-lg font-medium text-[#1A1A1A] mb-1">Recording Complete</p>
                                <p className="text-sm text-stone-500 mb-4">Duration: {formatTime(recordingTime)}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={playPreview}
                                        className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                                    >
                                        <Play className="w-4 h-4" />
                                        {isPlaying ? 'Stop' : 'Preview'}
                                    </button>
                                    <button
                                        onClick={resetRecording}
                                        className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
                                    >
                                        Re-record
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Requirements Check */}
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            meetsRequirement 
                                ? 'border-emerald-500 bg-emerald-500' 
                                : 'border-stone-300'
                        }`}>
                            {meetsRequirement && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className={meetsRequirement ? 'text-emerald-600' : 'text-stone-400'}>
                            30 seconds of audio required
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-stone-200" />
                        <span className="text-xs text-stone-400">or</span>
                        <div className="flex-1 h-px bg-stone-200" />
                    </div>

                    {/* Upload Option */}
                    <div className="text-center">
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            Upload existing audio file
                            <input 
                                type="file" 
                                accept="audio/*" 
                                className="hidden" 
                                onChange={handleFileUpload}
                            />
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-8">
                        <button
                            onClick={handleSubmit}
                            disabled={!meetsRequirement || !audioBlob}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                meetsRequirement && audioBlob
                                    ? 'bg-[#1A1A1A] text-white hover:bg-black shadow-lg shadow-stone-200'
                                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            }`}
                        >
                            NEXT →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceRecording;
