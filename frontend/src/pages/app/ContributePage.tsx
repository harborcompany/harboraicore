import React from 'react';
import { Upload, DollarSign, Clock, CheckCircle, AlertCircle, Plus, FileAudio, FileVideo } from 'lucide-react';

const ContributePage: React.FC = () => {
    const handleUpload = () => {
        // Placeholder for upload functionality
        alert("Upload feature is currently in development.");
    };

    return (
        <div className="max-w-6xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">Contribute</h1>
                    <p className="text-stone-500">Upload and monetize your audio and video content</p>
                </div>
                <button
                    onClick={handleUpload}
                    className="bg-[#1A1A1A] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#333] transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Upload Content
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Upload size={20} className="text-blue-500" />
                        <span className="text-stone-500 text-sm">Total Uploads</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">0</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock size={20} className="text-purple-500" />
                        <span className="text-stone-500 text-sm">Total Duration</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">0h 0m</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle size={20} className="text-green-500" />
                        <span className="text-stone-500 text-sm">Approved</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">0</p>
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign size={20} className="text-green-500" />
                        <span className="text-stone-500 text-sm">Total Earnings</span>
                    </div>
                    <p className="text-2xl font-mono text-[#1A1A1A]">$0.00</p>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                onClick={handleUpload}
                className="mb-8 p-8 bg-white border-2 border-dashed border-stone-300 rounded-xl text-center hover:border-stone-400 transition-colors cursor-pointer"
            >
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload size={28} className="text-stone-400" />
                </div>
                <p className="text-[#1A1A1A] font-medium mb-2">Drop files here or click to upload</p>
                <p className="text-stone-500 text-sm">Supports MP4, MOV, WAV, MP3, FLAC up to 10GB</p>
            </div>

            {/* Contributions Table */}
            <div className="mb-6">
                <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">Your Contributions</h2>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden min-h-[200px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mb-3">
                    <Upload size={20} className="text-stone-300" />
                </div>
                <h3 className="text-stone-900 font-medium mb-1">No uploads yet</h3>
                <p className="text-stone-500 text-sm">Upload your first dataset to start earning.</p>
            </div>
        </div>
    );
};

export default ContributePage;
