import {
    ControlBar,
    FocusLayout,
    FocusLayoutContainer,
    GridLayout,
    LayoutContextProvider,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

export function VideoConference() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false }
    );

    return (
        <LayoutContextProvider>
            <div className="lk-video-conference" style={{ height: "100%" }}>
                <div className="lk-video-conference-inner" style={{ height: "100%" }}>
                    <GridLayout tracks={tracks}>
                        <ParticipantTile />
                    </GridLayout>
                </div>
                <ControlBar />
                <RoomAudioRenderer />
            </div>
        </LayoutContextProvider>
    );
}
