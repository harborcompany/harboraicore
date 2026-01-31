import asyncio
import os
import logging
from livekit import agents, rtc
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, JobRequest
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("livecc-agent")
logger.setLevel(logging.INFO)

async def entrypoint(ctx: JobContext):
    logger.info("starting livecc agent")
    
    await ctx.connect(auto_subscribe=AutoSubscribe.VIDEO_ONLY)

    @ctx.room.on("track_subscribed")
    def on_track_subscribed(track: rtc.Track, publication: rtc.TrackPublication, participant: rtc.RemoteParticipant):
        logger.info(f"subscribed to track {track.sid} from {participant.identity}")
        
        if track.kind == rtc.TrackKind.KIND_VIDEO:
             asyncio.create_task(process_video_track(track))

async def process_video_track(track: rtc.VideoTrack):
    video_stream = rtc.VideoStream(track)
    async for frame in video_stream:
        # Placeholder for frame analysis logic
        # Here we would send the frame to an inference model (e.g. CLIP/LLaVA)
        # For now, just log every 100th frame
        pass

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
