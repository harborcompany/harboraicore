import React from 'react';
import { VoiceChat } from '../../components/realtime/VoiceChat';
import { Activity } from 'lucide-react';

export function AdminRealtime() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Activity className="w-8 h-8 text-green-500" />
                    Real-time Debugger
                </h1>
                <p className="text-gray-400">Test voice and video connectivity via local LiveKit server.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="panel">
                    <h3 className="text-lg font-semibold text-white mb-4">Live Room: 'harbor-debug-room'</h3>
                    <VoiceChat />
                </div>
            </div>
        </div>
    );
}
