"""
Harbor ML Auto-Annotator Microservice
FastAPI entry point for ML annotation services
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging

from .api import router as api_router
from .annotators import (
    HandPoseAnnotator,
    ObjectDetector,
    ActionRecognizer,
    SceneSegmenter,
    SpeechAnnotator,
    TranscriptAnnotator,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global annotator instances
annotators: Dict[str, Any] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML models on startup, cleanup on shutdown"""
    logger.info("Loading ML models...")
    
    try:
        # Initialize annotators (lazy loading for GPU efficiency)
        annotators["hand_pose"] = HandPoseAnnotator()
        annotators["object"] = ObjectDetector()
        annotators["action"] = ActionRecognizer()
        annotators["scene"] = SceneSegmenter()
        annotators["speech"] = SpeechAnnotator()
        annotators["transcript"] = TranscriptAnnotator()
        
        logger.info("All models loaded successfully")
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        raise
    
    yield
    
    # Cleanup
    logger.info("Shutting down annotators...")
    for name, annotator in annotators.items():
        if hasattr(annotator, "cleanup"):
            annotator.cleanup()


# Create FastAPI app
app = FastAPI(
    title="Harbor ML Auto-Annotator",
    description="ML inference service for video and audio annotation",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": list(annotators.keys()),
        "gpu_available": _check_gpu(),
    }


@app.get("/models")
async def list_models():
    """List available annotation models"""
    return {
        "video": {
            "hand_pose": {
                "name": "MediaPipe Hands",
                "version": "0.10.7",
                "loaded": "hand_pose" in annotators,
            },
            "object_detection": {
                "name": "YOLOv8",
                "version": "8.0.0",
                "loaded": "object" in annotators,
            },
            "action_recognition": {
                "name": "TimesFormer",
                "version": "1.0.0",
                "loaded": "action" in annotators,
            },
            "scene_segmentation": {
                "name": "PySceneDetect",
                "version": "0.6.2",
                "loaded": "scene" in annotators,
            },
        },
        "audio": {
            "vad_diarization": {
                "name": "pyannote.audio",
                "version": "3.0.0",
                "loaded": "speech" in annotators,
            },
            "asr": {
                "name": "Whisper",
                "version": "large-v3",
                "loaded": "transcript" in annotators,
            },
        },
    }


def _check_gpu() -> bool:
    """Check if GPU is available"""
    try:
        import torch
        return torch.cuda.is_available()
    except ImportError:
        return False


# Export annotators for route handlers
def get_annotator(name: str):
    """Get annotator instance by name"""
    if name not in annotators:
        raise HTTPException(status_code=500, detail=f"Annotator {name} not loaded")
    return annotators[name]
