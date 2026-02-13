
import React, { useState } from 'react';
import { Upload, FileText, Database, Shield, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageHeader, Button } from '../../components/admin/AdminComponents';
import { registerUpload } from '../../services/adminPipelineService';

export default function AdminManualUpload() {
    const [datasetType, setDatasetType] = useState('lego');
    const [isInternal, setIsInternal] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    function handleUpload() {
        setIsUploading(true);
        setTimeout(() => {
            registerUpload({
                filename: datasetType === 'lego' ? `manual_lego_${Date.now()}.mp4` : `manual_test_${Date.now()}.mp4`,
                modality: datasetType === 'voice' ? 'audio' : 'video',
                uploaderName: 'Admin Manual Tool'
            });
            setIsUploading(false);
            setStatus('success');
        }, 2000);
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <PageHeader
                title="Admin Manual Upload"
                subtitle="Bypass referral checks and upload internal test data directly to the pipeline."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Database size={16} /> Dataset Configuration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Dataset Type</label>
                                <select
                                    className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-black"
                                    value={datasetType}
                                    onChange={e => setDatasetType(e.target.value)}
                                >
                                    <option value="lego">LEGO Models (Physical Intelligence)</option>
                                    <option value="voice">Voice Samples (Audio AI)</option>
                                    <option value="video">Human Activity (Video AI)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Mark as Internal</p>
                                    <p className="text-[10px] text-blue-700">Skips referral payout logic and marks as Harbor-owned.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-blue-600"
                                    checked={isInternal}
                                    onChange={e => setIsInternal(e.target.checked)}
                                />
                            </div>

                            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex gap-3">
                                <Shield size={18} className="text-amber-600 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900">Annotation Mode</p>
                                    <p className="text-[10px] text-amber-700">Internal uploads are prioritized in the professional annotation bin.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-xl">
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-yellow-400" /> Pipeline Automation
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center">
                                    <CheckCircle size={10} className="text-stone-500" />
                                </div>
                                <span className="text-xs text-stone-400">Trigger Auto QA (YOLO/SAM)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center">
                                    <CheckCircle size={10} className="text-stone-500" />
                                </div>
                                <span className="text-xs text-stone-400">Auto-assign to Admin Queue</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center">
                                    <CheckCircle size={10} className="text-stone-500" />
                                </div>
                                <span className="text-xs text-stone-400">Bypass Creator Notifications</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${isUploading ? 'bg-gray-50 border-blue-200' : 'bg-white border-gray-200 hover:border-black'
                        }`}>
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload size={32} className={isUploading ? 'text-blue-500 animate-bounce' : 'text-gray-300'} />
                        </div>
                        <h3 className="font-semibold text-gray-900">Upload Media</h3>
                        <p className="text-xs text-gray-500 mt-1 mb-6">MP4, MOV, or ZIP containing assets</p>

                        <Button
                            variant="primary"
                            disabled={isUploading}
                            onClick={handleUpload}
                        >
                            {isUploading ? 'Uploading...' : 'Select Files'}
                        </Button>
                    </div>

                    {status === 'success' && (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle className="text-green-600 shrink-0" size={20} />
                            <div>
                                <p className="text-sm font-bold text-green-900">Upload Successful</p>
                                <p className="text-[11px] text-green-700">Internal dataset registered. PIPELINE_AUTO_QA_TRIGGERED.</p>
                                <div className="mt-3 flex gap-2">
                                    <button className="text-[11px] font-bold text-green-700 hover:underline">Track in Queue</button>
                                    <button className="text-[11px] font-bold text-green-700 hover:underline" onClick={() => setStatus('idle')}>Upload Another</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={14} className="text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Recent Admin Uploads</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">lego_test_suite_v1.zip</span>
                                <span className="text-gray-400 italic">2h ago</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">voice_benchmarking_05.mp3</span>
                                <span className="text-gray-400 italic">Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
