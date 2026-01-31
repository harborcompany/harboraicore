import asyncio
import os
import logging
import json
from livekit import agents, rtc
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, JobRequest
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("livecc-agent")
logger.setLevel(logging.INFO)

async def entrypoint(ctx: JobContext):
    logger.info("starting livecc agent")
    
    # Subscribe to Video only (we are a vision agent)
    await ctx.connect(auto_subscribe=AutoSubscribe.VIDEO_ONLY)

    @ctx.room.on("track_subscribed")
    def on_track_subscribed(track: rtc.Track, publication: rtc.TrackPublication, participant: rtc.RemoteParticipant):
        logger.info(f"subscribed to track {track.sid} from {participant.identity}")
        
        if track.kind == rtc.TrackKind.KIND_VIDEO:
            # Pass room reference so we can publish data back
            asyncio.create_task(process_video_track(track, ctx.room))

async def process_video_track(track: rtc.VideoTrack, room: rtc.Room):
    video_stream = rtc.VideoStream(track)
    iteration = 0
    
    logger.info("processing video stream...")

    async for frame in video_stream:
        # In a real scenario, 'frame' (VideoFrame) is passed to a model
        # frame_buffer = frame.buffer
        
        # Simulate inference every 30 frames (approx 1 second at 30fps)
        if iteration % 30 == 0:
            
            # Mock Data: Rotate through some concepts
            concepts = ["Person", "Smile", " Hand Gesture", "Laptop", "Whiteboard"]
            concept = concepts[iteration % len(concepts)]
            confidence = 0.85 + (0.01 * (iteration % 10))

            payload = json.dumps({
                "topic": "vision",
                "label": f"{concept} detected",
                "confidence": round(confidence, 2),
                "timestamp": asyncio.get_event_loop().time()
            })
            
            logger.info(f"emitting inference: {payload}")
            
            try:
                # payload must be bytes
                await room.local_participant.publish_data(
                    payload=payload.encode("utf-8"),
                    reliable=True
                )
            except Exception as e:
                logger.error(f"failed to publish data: {e}")

        iteration += 1

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
