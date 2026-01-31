import {
    LiveKitRoom,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
    ParticipantTile,
    GridLayout,
    useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";

export const VoiceChat = () => {
    const [token, setToken] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchToken = async () => {
            try {
                // In production, get user from context. Here we let backend gen one.
                const resp = await fetch("/api/realtime/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // "x-user-id": "debug_admin" // Optional: backend handles it
                    },
                    body: JSON.stringify({ roomName: "harbor-debug-room", participantName: "AdminUser" }),
                });

                if (!resp.ok) throw new Error("Failed to fetch token");

                const data = await resp.json();
                setToken(data.data.token);
            } catch (e: any) {
                console.error(e);
                setError(e.message);
            }
        };

        fetchToken();
    }, []);

    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!token) return <div className="p-4 text-gray-400">Connecting to LiveKit...</div>;

    return (
        <div className="voice-chat-container bg-gray-900 rounded-xl overflow-hidden border border-gray-800 h-[600px] flex flex-col">
            <LiveKitRoom
                video={true} // Enable video for testing, though mostly voice focused
                audio={true}
                token={token}
                serverUrl={"ws://localhost:7880"} // Hardcoded local dev URL for now, or use env
                data-lk-theme="default"
                className="flex-1 flex flex-col"
            >
                <div className="flex-1 p-4 relative">
                    <GridLayout tracks={[]}>
                        <ParticipantTile />
                    </GridLayout>
                    {/* Custom track loop if GridLayout isn't enough */}
                    <VideoGrid />
                    <VisionOverlay />
                </div>

                <ControlBar variation="minimal" />
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
};

function VisionOverlay() {
    const [events, setEvents] = useState<any[]>([]);
    const room = useRoomContext();

    useEffect(() => {
        if (!room) return;

        const handleData = (payload: Uint8Array, participant: any) => {
            const str = new TextDecoder().decode(payload);
            try {
                const data = JSON.parse(str);
                // Keep last 5 events
                setEvents(prev => [...prev.slice(-4), { ...data, id: Date.now() }]);
            } catch (e) {
                console.error("Failed to parse data packet", e);
            }
        };

        room.on(RoomEvent.DataReceived, handleData);
        return () => {
            room.off(RoomEvent.DataReceived, handleData);
        };
    }, [room]);

    if (events.length === 0) return null;

    return (
        <div className="absolute top-4 right-4 bg-black/80 border border-gray-700 p-4 rounded-lg text-white w-64 shadow-xl z-50">
            <h3 className="text-xs font-bold uppercase text-blue-400 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                LiveCC Inference
            </h3>
            <div className="space-y-2">
                {events.map((evt) => (
                    <div key={evt.id} className="text-sm border-l-2 border-green-500 pl-2 bg-gray-900/50 p-1 rounded">
                        <div className="font-semibold">{evt.label}</div>
                        <div className="text-xs text-gray-400 flex justify-between">
                            <span>{evt.topic}</span>
                            <span>{(evt.confidence * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function VideoGrid() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100% - var(--lk-control-bar-height))' }}>
            <ParticipantTile />
        </GridLayout>
    );
}
