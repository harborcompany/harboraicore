import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, Plus, Minus, Trash2, Check, X } from 'lucide-react';

interface Point {
    x: number;
    y: number;
    label: 1 | 0; // 1 for positive, 0 for negative
}

interface SamCanvasProps {
    imageUrl: string;
    onSave?: (maskData: any) => void;
    onCancel?: () => void;
}

export const SamCanvas: React.FC<SamCanvasProps> = ({ imageUrl, onSave, onCancel }) => {
    const [points, setPoints] = useState<Point[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Default to positive click (1), shift-click for negative (0)
        const label = e.shiftKey ? 0 : 1;

        setPoints([...points, { x, y, label }]);

        // Simulate SAM backend latency
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 300);
    };

    const clearPoints = () => setPoints([]);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#262626]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-[#262626]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-1 border border-[#262626]">
                        <button className="p-1.5 rounded bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                            <MousePointer2 size={16} />
                        </button>
                        <div className="w-px h-4 bg-[#262626] mx-1" />
                        <div className="flex items-center gap-2 px-2 py-1 text-xs text-[#a3a3a3]">
                            <span className="flex items-center gap-1 text-green-500"><Plus size={12} /> Positive</span>
                            <span className="text-[#525252]">/</span>
                            <span className="flex items-center gap-1 text-red-500"><Minus size={12} /> Negative</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={clearPoints}
                        className="p-2 text-[#525252] hover:text-white transition-colors"
                        title="Clear all points"
                    >
                        <Trash2 size={16} />
                    </button>
                    <div className="w-px h-4 bg-[#262626] mx-1" />
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#a3a3a3] hover:text-white transition-colors"
                    >
                        <X size={14} /> Cancel
                    </button>
                    <button
                        onClick={() => onSave?.(points)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Check size={14} /> Commit Label
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div
                ref={containerRef}
                className="relative flex-1 bg-[linear-gradient(45deg,#111_25%,transparent_25%),linear-gradient(-45deg,#111_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#111_75%),linear-gradient(-45deg,transparent_75%,#111_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] flex items-center justify-center overflow-hidden cursor-crosshair"
                onClick={handleCanvasClick}
            >
                <div className="relative inline-block max-w-[90%] max-h-[90%]">
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="SAM Canvas"
                        className="rounded shadow-2xl pointer-events-none select-none"
                    />

                    {/* Points Overlay */}
                    {points.map((p, i) => (
                        <div
                            key={i}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-in zoom-in duration-200 ${p.label === 1 ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        />
                    ))}

                    {/* Simulated Mask Overlay (SVG) */}
                    {points.length > 0 && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                            {/* In a real app, this would be the actual SAM mask polygon */}
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <circle
                                cx={`${points[0].x}%`}
                                cy={`${points[0].y}%`}
                                r="40"
                                fill="rgba(37, 99, 235, 0.6)"
                                className="transition-all duration-500"
                                style={{ filter: 'url(#glow)' }}
                            />
                        </svg>
                    )}

                    {isProcessing && (
                        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">SAM Inference...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="px-4 py-2 bg-[#0a0a0a] border-t border-[#262626] flex items-center justify-between">
                <div className="text-[10px] text-[#525252] font-mono tracking-wider">
                    SAM-VIT-H INFRASTRUCTURE — CUDA 12.1 — RESOLUTION: 1080P
                </div>
                <div className="flex gap-4 text-[10px] text-[#a3a3a3]">
                    <span>Points: <span className="text-white font-bold">{points.length}</span></span>
                    <span>Confidence: <span className="text-green-500 font-bold">0.94</span></span>
                </div>
            </div>
        </div>
    );
};
