import { AnnotationCanvas } from '../annotation/AnnotationCanvas';
import React, { useState } from 'react';
import { Play, Pause, Maximize2, FileText, Image as ImageIcon, Music, Video, X, Loader2, Bot } from 'lucide-react';
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
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isDetecting, setIsDetecting] = useState(false);
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

    const handleSmartDetect = async () => {
        setIsDetecting(true);
        try {
            // Retrieve token if using AuthStore, or mock for demo
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/annotation/smart/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    assetId: asset.id,
                    classes: ['lego', 'brick', 'hand', 'instruction manual'], // Default classes for demo
                    mode: '2d'
                })
            });
            const result = await response.json();
            if (result.data && result.data.predictions) {
                setPredictions(result.data.predictions);
            }
        } catch (e) {
            console.error("Smart detect failed", e);
        } finally {
            setIsDetecting(false);
        }
    };

    // ... renderContent ... (updated to include Overlay)

    const onMediaLoad = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>) => {
        const { clientWidth, clientHeight } = e.currentTarget;
        setContainerDimensions({ width: clientWidth, height: clientHeight });
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSmartDetect}
                        disabled={isDetecting || asset.type === 'audio' || asset.type === 'text'}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDetecting ? <Loader2 size={14} className="animate-spin" /> : <Bot size={14} />}
                        {isDetecting ? 'Analyzing...' : 'Smart Label'}
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-stone-800 rounded-lg transition-colors ml-2"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white p-4 rounded-b-xl border border-t-0 border-stone-200 shadow-lg relative">
                <div className="relative inline-block w-full flex justify-center bg-black rounded-lg overflow-hidden">
                    {asset.type === 'video' && (
                        <video
                            src={asset.url}
                            className="max-h-[700px] object-contain"
                            controls
                            poster={asset.thumbnail}
                            onLoadedMetadata={onMediaLoad}
                        />
                    )}
                    {asset.type === 'image' && (
                        <img
                            src={asset.url}
                            alt={asset.title}
                            className="max-h-[700px] object-contain"
                            onLoad={onMediaLoad}
                        />
                    )}
                    {/* Fallback for audio/text */}
                    {(asset.type === 'audio' || asset.type === 'text') && renderContent()}

                    {/* Annotation Overlay */}
                    {(asset.type === 'video' || asset.type === 'image') && predictions.length > 0 && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                            {/* 
                                Note: In a real implementation, we need to match the key/video dimensions exactly 
                                effectively. For this demo, we'll try to rely on the centered positioning 
                                or just overlay on the container.
                             */}
                            <AnnotationCanvas
                                width={containerDimensions.width}
                                height={containerDimensions.height}
                                boxes2D={predictions}
                            />
                        </div>
                    )}
                </div>

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
