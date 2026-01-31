import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { LiveKitRoom } from '../../src/components/realtime/LiveKitRoom';

const MeetingPage: React.FC = () => {
    const { room } = useParams<{ room: string }>();
    const [searchParams] = useSearchParams();
    const username = searchParams.get('user') || 'Guest';

    if (!room) {
        return <div>Room name is required</div>;
    }

    return (
        <div className="h-[calc(100vh-4rem)] p-4 flex flex-col gap-4">
            <div className="h-full border border-gray-200 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 dark:border-zinc-800 shadow-sm flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Meeting Room: {room}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Participating as {username}</p>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <LiveKitRoom roomName={room} participantName={username} />
                </div>
            </div>
        </div>
    );
};

export default MeetingPage;
