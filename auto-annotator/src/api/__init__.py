"""FastAPI routes for annotation endpoints"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import tempfile
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


# Request/Response models
class AnnotationRequest(BaseModel):
    """Base annotation request"""
    file_url: Optional[str] = None
    callback_url: Optional[str] = None
    media_asset_id: Optional[str] = None


class VideoAnnotationRequest(AnnotationRequest):
    """Video annotation request"""
    run_hands: bool = True
    run_objects: bool = True
    run_actions: bool = True
    run_scenes: bool = True
    run_sam3: bool = False      # SAM3 segmentation (GPU intensive)
    run_livecc: bool = False    # LiveCC dense captioning (GPU intensive)
    frame_interval: int = 30    # Annotate every N frames


class AudioAnnotationRequest(AnnotationRequest):
    """Audio annotation request"""
    run_vad: bool = True
    run_diarization: bool = True
    run_asr: bool = True
    language: Optional[str] = None


class AnnotationResponse(BaseModel):
    """Standard annotation response"""
    success: bool
    job_id: Optional[str] = None
    annotations: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None


# Health endpoint
@router.get("/health")
async def api_health():
    """API health check"""
    return {"status": "ok", "api": "annotator"}


# Video annotation endpoints
@router.post("/annotate/video", response_model=AnnotationResponse)
async def annotate_video(
    file: UploadFile = File(...),
    run_hands: bool = Form(True),
    run_objects: bool = Form(True),
    run_actions: bool = Form(True),
    run_scenes: bool = Form(True),
    run_sam3: bool = Form(False),
    run_livecc: bool = Form(False),
    frame_interval: int = Form(30),
    background_tasks: BackgroundTasks = None,
):
    """
    Full video annotation pipeline
    
    Runs hand detection, object detection, action recognition, scene segmentation,
    SAM3 segmentation, and LiveCC dense captioning.
    """
    try:
        from ..main import get_annotator
        import cv2
        import numpy as np
        
        # Save uploaded file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            content = await file.read()
            tmp.write(content)
            video_path = tmp.name
        
        all_annotations = []
        
        try:
            # Open video
            cap = cv2.VideoCapture(video_path)
            fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            frame_id = 0
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Only annotate every N frames
                if frame_id % frame_interval != 0:
                    frame_id += 1
                    continue
                
                # Convert BGR to RGB
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                timestamp_ms = (frame_id / fps) * 1000
                
                # Hand detection (MediaPipe)
                if run_hands:
                    hand_annotator = get_annotator("hand_pose")
                    hand_results = hand_annotator.annotate(frame_rgb, frame_id, timestamp_ms)
                    for r in hand_results:
                        all_annotations.append({
                            "type": "hand_pose",
                            **r.model_dump(),
                        })
                
                # Object detection (YOLOv8)
                if run_objects:
                    object_annotator = get_annotator("object")
                    object_results = object_annotator.annotate(frame_rgb, frame_id, timestamp_ms)
                    for r in object_results:
                        all_annotations.append({
                            "type": "object_detection",
                            **r.model_dump(),
                        })
                
                # SAM3 Segmentation (GPU intensive)
                if run_sam3:
                    sam3_annotator = get_annotator("sam3")
                    sam3_results = sam3_annotator.annotate(frame_rgb, frame_id, timestamp_ms)
                    for r in sam3_results:
                        all_annotations.append({
                            "type": "sam3_segmentation",
                            **r.model_dump(),
                        })
                
                frame_id += 1
            
            cap.release()
            
            # Scene segmentation (on full video)
            if run_scenes:
                scene_annotator = get_annotator("scene")
                scene_results = scene_annotator.annotate(video_path, fps)
                for r in scene_results:
                    all_annotations.append({
                        "type": "scene_segment",
                        **r.model_dump(),
                    })
            
            # LiveCC Dense Captioning (on full video)
            if run_livecc:
                livecc_annotator = get_annotator("livecc")
                livecc_results = livecc_annotator.annotate(
                    video_path, 
                    fps, 
                    context="LEGO assembly video - describe each building step"
                )
                for r in livecc_results:
                    all_annotations.append({
                        "type": "dense_caption",
                        **r.model_dump(),
                    })
            
            return AnnotationResponse(
                success=True,
                annotations=all_annotations,
            )
            
        finally:
            os.unlink(video_path)
            
    except Exception as e:
        logger.error(f"Video annotation failed: {e}")
        return AnnotationResponse(success=False, error=str(e))


@router.post("/annotate/audio", response_model=AnnotationResponse)
async def annotate_audio(
    file: UploadFile = File(...),
    run_vad: bool = Form(True),
    run_diarization: bool = Form(True),
    run_asr: bool = Form(True),
    language: Optional[str] = Form(None),
):
    """
    Full audio annotation pipeline
    
    Runs VAD, speaker diarization, and ASR.
    """
    try:
        from ..main import get_annotator
        
        # Save uploaded file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await file.read()
            tmp.write(content)
            audio_path = tmp.name
        
        all_annotations = []
        
        try:
            # Speech detection (VAD + diarization)
            if run_vad:
                speech_annotator = get_annotator("speech")
                speech_results = speech_annotator.annotate(
                    audio_path,
                    run_diarization=run_diarization,
                )
                for r in speech_results:
                    all_annotations.append({
                        "type": "speech_segment",
                        **r.model_dump(),
                    })
            
            # ASR
            if run_asr:
                transcript_annotator = get_annotator("transcript")
                transcript_results = transcript_annotator.annotate(audio_path)
                for r in transcript_results:
                    all_annotations.append({
                        "type": "transcript",
                        **r.model_dump(),
                    })
            
            return AnnotationResponse(
                success=True,
                annotations=all_annotations,
            )
            
        finally:
            os.unlink(audio_path)
            
    except Exception as e:
        logger.error(f"Audio annotation failed: {e}")
        return AnnotationResponse(success=False, error=str(e))


# Individual annotation endpoints
@router.post("/annotate/hands", response_model=AnnotationResponse)
async def annotate_hands_only(file: UploadFile = File(...)):
    """Hand detection only"""
    try:
        from ..main import get_annotator
        import cv2
        import numpy as np
        
        content = await file.read()
        nparr = np.frombuffer(content, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        annotator = get_annotator("hand_pose")
        results = annotator.annotate(frame_rgb)
        
        return AnnotationResponse(
            success=True,
            annotations=[r.model_dump() for r in results],
        )
    except Exception as e:
        return AnnotationResponse(success=False, error=str(e))


@router.post("/annotate/objects", response_model=AnnotationResponse)
async def annotate_objects_only(file: UploadFile = File(...)):
    """Object detection only"""
    try:
        from ..main import get_annotator
        import cv2
        import numpy as np
        
        content = await file.read()
        nparr = np.frombuffer(content, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        annotator = get_annotator("object")
        results = annotator.annotate(frame_rgb)
        
        return AnnotationResponse(
            success=True,
            annotations=[r.model_dump() for r in results],
        )
    except Exception as e:
        return AnnotationResponse(success=False, error=str(e))


@router.post("/annotate/asr", response_model=AnnotationResponse)
async def annotate_asr_only(file: UploadFile = File(...)):
    """ASR transcription only"""
    try:
        from ..main import get_annotator
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await file.read()
            tmp.write(content)
            audio_path = tmp.name
        
        try:
            annotator = get_annotator("transcript")
            results = annotator.annotate(audio_path)
            
            return AnnotationResponse(
                success=True,
                annotations=[r.model_dump() for r in results],
            )
        finally:
            os.unlink(audio_path)
            
    except Exception as e:
        return AnnotationResponse(success=False, error=str(e))
