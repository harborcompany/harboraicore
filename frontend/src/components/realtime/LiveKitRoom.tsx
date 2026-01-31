import { LiveKitRoom as LKRoom, VideoConference, useToken } from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";

interface LiveKitRoomProps {
    roomName: string;
    participantName: string;
    children?: React.ReactNode;
}

export function LiveKitRoom({ roomName, participantName, children }: LiveKitRoomProps) {
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch('/api/realtime/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roomName, participantName }),
                });
                const data = await resp.json();
                setToken(data.data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [roomName, participantName]);

    if (token === "") {
        return <div>Getting token...</div>;
    }

    return (
        <LKRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={import.meta.env.VITE_LIVEKIT_URL}
            data-lk-theme="default"
            style={{ height: "100vh" }}
        >
            {children || <VideoConference />}
        </LKRoom>
    );
}
