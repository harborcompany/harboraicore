import {
    LiveKitRoom,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
    ParticipantTile,
    GridLayout,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
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
                <div className="flex-1 p-4">
                    <GridLayout tracks={[/* We will use default layout logic */]}>
                        <ParticipantTile />
                    </GridLayout>
                    {/* Custom track loop if GridLayout isn't enough */}
                    <VideoGrid />
                </div>

                <ControlBar variation="minimal" />
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
};

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
