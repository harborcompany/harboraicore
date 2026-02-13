import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Save, Play, Pause, FastForward, Rewind, Layers, Target, Info } from 'lucide-react';
import { SamCanvas } from '../../components/admin/SamCanvas';
import { type AnnotationQueueItem } from '../../services/annotationService';
import { Button, StatusBadge } from '../../components/admin/AdminComponents';

interface AnnotationDetailProps {
    item: AnnotationQueueItem;
    onClose: () => void;
    onComplete: (id: string, labels: any) => void;
}

export const AnnotationDetail: React.FC<AnnotationDetailProps> = ({ item, onClose, onComplete }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTool, setActiveTool] = useState<'sam' | 'yolo' | 'attributes'>('sam');

    return (
        <div className="fixed inset-0 z-50 flex bg-[#0a0a0a] text-white overflow-hidden animate-in fade-in duration-300">
            {/* Sidebar Controls */}
            <aside className="w-80 border-r border-[#262626] flex flex-col bg-[#141414]">
                <div className="p-4 border-b border-[#262626] flex items-center justify-between">
                    <button onClick={onClose} className="p-2 hover:bg-[#262626] rounded-lg transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-xs font-bold tracking-widest uppercase text-[#525252]">Job Detail</div>
                    <div className="w-10" />
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div>
                        <h2 className="text-xl font-bold mb-1">{item.filename}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <StatusBadge label={item.status} variant="info" />
                            <span className="text-[10px] text-[#525252] font-mono uppercase">{item.id}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-[#525252] uppercase tracking-widest">Annotation Tools</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => setActiveTool('sam')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${activeTool === 'sam' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-[#1a1a1a] border-[#262626] text-[#737373] hover:text-white'
                                    }`}
                            >
                                <Target size={18} />
                                <div className="text-left">
                                    <div className="text-sm font-bold">SAM Segmentation</div>
                                    <div className="text-[10px] opacity-60">Zero-shot object masking</div>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTool('yolo')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${activeTool === 'yolo' ? 'bg-amber-600/10 border-amber-500 text-amber-400' : 'bg-[#1a1a1a] border-[#262626] text-[#737373] hover:text-white'
                                    }`}
                            >
                                <Layers size={18} />
                                <div className="text-left">
                                    <div className="text-sm font-bold">YOLO Bounding Boxes</div>
                                    <div className="text-[10px] opacity-60">Auto-generated detections</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#262626]">
                        <h3 className="text-[10px] font-bold text-[#525252] uppercase tracking-widest">Metadata</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] text-[#525252] uppercase mb-1">Object Class</label>
                                <select className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500">
                                    <option>LEGO Brick</option>
                                    <option>LEGO Humanoid</option>
                                    <option>Hand Interaction</option>
                                    <option>Surface Background</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#525252] uppercase mb-1">Confidence Override</label>
                                <input type="range" className="w-full accent-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[#0a0a0a] border-t border-[#262626]">
                    <button
                        onClick={() => onComplete(item.id, {})}
                        className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-green-500/10 flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        COMPLETE REVIEW
                    </button>
                </div>
            </aside>

            {/* Main Canvas Area */}
            <main className="flex-1 flex flex-col relative bg-[#050505]">
                {/* Canvas Container */}
                <div className="flex-1 p-8">
                    <SamCanvas
                        imageUrl="https://images.unsplash.com/photo-1585366119957-e5769bb7c244?auto=format&fit=crop&q=80&w=1600"
                        onCancel={onClose}
                    />
                </div>

                {/* Timeline / Player Controls */}
                <div className="h-24 bg-[#141414] border-t border-[#262626] px-8 flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button className="text-[#525252] hover:text-white transition-colors"><Rewind size={20} /></button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all"
                        >
                            {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
                        </button>
                        <button className="text-[#525252] hover:text-white transition-colors"><FastForward size={20} /></button>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-[10px] text-[#525252] font-mono">
                            <span>00:04:12</span>
                            <div className="flex gap-4">
                                <span className="text-blue-500">FRAME 124</span>
                                <span>TOTAL 00:15:00</span>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden relative group cursor-pointer">
                            <div className="absolute top-0 left-0 h-full bg-blue-600" style={{ width: '28%' }} />
                            <div className="absolute top-0 left-[28%] w-1 h-full bg-white z-10" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#262626]">
                        <Info size={14} className="text-blue-500" />
                        <span className="text-[10px] text-[#a3a3a3]">Press <kbd className="bg-[#262626] px-1 rounded text-white">SHIFT</kbd> for Negative Click</span>
                    </div>
                </div>
            </main>
        </div>
    );
};
