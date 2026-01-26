import React, { useState } from 'react';
import { Play, Pause, Maximize2, FileText, Image as ImageIcon, Music, Video, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MediaAsset {
    id: string;
    type: 'image' | 'video' | 'audio' | 'text';
    url: string;
    thumbnail?: string;
    title: string;
    duration?: number; // in seconds, for audio/video
    content?: string; // for text
}

interface Props {
    asset: MediaAsset;
    onClose?: () => void;
}

const MediaPlayer: React.FC<Props> = ({ asset, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const renderContent = () => {
        switch (asset.type) {
            case 'video':
                return (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
                        <video
                            src={asset.url}
                            className="w-full h-full object-contain"
                            controls
                            poster={asset.thumbnail}
                        />
                    </div>
                );
            case 'audio':
                return (
                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 flex flex-col items-center justify-center gap-4">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-2 shadow-inner">
                            <Music size={40} />
                        </div>
                        <h4 className="font-medium text-stone-800">{asset.title}</h4>
                        <audio src={asset.url} controls className="w-full" />
                    </div>
                );
            case 'image':
                return (
                    <div className="relative bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
                        <img
                            src={asset.url}
                            alt={asset.title}
                            className="max-w-full max-h-[500px] object-contain"
                        />
                    </div>
                );
            case 'text':
            default:
                return (
                    <div className="bg-white p-6 rounded-xl border border-stone-200 h-[400px] overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-stone-700 shadow-inner">
                        <pre className="whitespace-pre-wrap">{asset.content || "No content available preview."}</pre>
                    </div>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4 w-full"
        >
            <div className="flex justify-between items-center bg-stone-900 text-white p-4 rounded-t-xl" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-stone-800 rounded-md">
                        {asset.type === 'video' && <Video size={16} />}
                        {asset.type === 'audio' && <Music size={16} />}
                        {asset.type === 'image' && <ImageIcon size={16} />}
                        {asset.type === 'text' && <FileText size={16} />}
                    </div>
                    <span className="font-medium truncate max-w-[300px]">{asset.title}</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-stone-800 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="bg-white p-4 rounded-b-xl border border-t-0 border-stone-200 shadow-lg">
                {renderContent()}

                {asset.type !== 'text' && (
                    <div className="mt-4 flex justify-between items-center text-xs text-stone-500 font-mono border-t border-stone-100 pt-3">
                        <span>ID: {asset.id}</span>
                        <span>Lab-Ready Data Asset</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MediaPlayer;
