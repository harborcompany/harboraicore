"""
Scene Segmentation Annotator
Uses PySceneDetect for automatic scene boundary detection
"""

import logging
from typing import Any, Dict, List, Optional
import numpy as np

from .base import BaseAnnotator, AnnotationResult

logger = logging.getLogger(__name__)


class SceneSegmenter(BaseAnnotator):
    """PySceneDetect-based scene segmentation"""
    
    model_name = "pyscenedetect"
    model_version = "0.6.2"
    
    def __init__(
        self,
        threshold: float = 27.0,   # Content detector threshold
        min_scene_len: int = 15,   # Minimum scene length in frames
    ):
        super().__init__()
        self.threshold = threshold
        self.min_scene_len = min_scene_len
        self._detector = None
    
    def load_model(self) -> None:
        """Initialize scene detector"""
        try:
            from scenedetect import ContentDetector
            self._detector = ContentDetector(
                threshold=self.threshold,
                min_scene_len=self.min_scene_len,
            )
            logger.info(f"Loaded {self.model_name} v{self.model_version}")
        except ImportError:
            logger.error("scenedetect not installed. Run: pip install scenedetect")
            raise
    
    def annotate(
        self,
        video_path: str,
        fps: float = 30.0,
        **kwargs
    ) -> List[AnnotationResult]:
        """
        Detect scene boundaries in a video file
        
        Args:
            video_path: Path to video file
            fps: Frames per second (used for timing)
            
        Returns:
            List of scene segment results
        """
        self.ensure_loaded()
        
        try:
            from scenedetect import open_video, detect
            
            video = open_video(video_path)
            scene_list = detect(video, self._detector)
            
            results = []
            for idx, (start, end) in enumerate(scene_list):
                start_ms = start.get_seconds() * 1000
                end_ms = end.get_seconds() * 1000
                
                results.append(AnnotationResult(
                    model_name=self.model_name,
                    model_version=self.model_version,
                    confidence=1.0,  # Scene detect is deterministic
                    timestamp_ms=start_ms,
                    data={
                        "scene_index": idx,
                        "start_ms": start_ms,
                        "end_ms": end_ms,
                        "start_frame": start.get_frames(),
                        "end_frame": end.get_frames(),
                        "duration_ms": end_ms - start_ms,
                    },
                ))
            
            return results
            
        except Exception as e:
            logger.error(f"Scene detection failed: {e}")
            return []
    
    def annotate_frames(
        self,
        frames: np.ndarray,
        fps: float = 30.0,
        **kwargs
    ) -> List[AnnotationResult]:
        """
        Detect scene boundaries from frame array
        
        Args:
            frames: Video frames as numpy array (T, H, W, 3)
            fps: Frames per second
            
        Returns:
            List of scene segment results
        """
        self.ensure_loaded()
        
        # Use content-based detection on frames
        results = []
        current_scene_start = 0
        scene_index = 0
        
        try:
            import cv2
        except ImportError:
            return results
        
        prev_frame = frames[0] if len(frames) > 0 else None
        
        for i, frame in enumerate(frames[1:], 1):
            # Calculate frame difference
            diff = cv2.absdiff(prev_frame, frame)
            mean_diff = np.mean(diff)
            
            # Threshold for scene change
            if mean_diff > self.threshold:
                if i - current_scene_start >= self.min_scene_len:
                    start_ms = (current_scene_start / fps) * 1000
                    end_ms = (i / fps) * 1000
                    
                    results.append(AnnotationResult(
                        model_name=self.model_name,
                        model_version=self.model_version,
                        confidence=min(mean_diff / 100, 1.0),
                        timestamp_ms=start_ms,
                        data={
                            "scene_index": scene_index,
                            "start_ms": start_ms,
                            "end_ms": end_ms,
                            "start_frame": current_scene_start,
                            "end_frame": i,
                            "duration_ms": end_ms - start_ms,
                        },
                    ))
                    scene_index += 1
                    current_scene_start = i
            
            prev_frame = frame
        
        # Add final scene
        if len(frames) - current_scene_start >= self.min_scene_len:
            start_ms = (current_scene_start / fps) * 1000
            end_ms = (len(frames) / fps) * 1000
            
            results.append(AnnotationResult(
                model_name=self.model_name,
                model_version=self.model_version,
                confidence=1.0,
                timestamp_ms=start_ms,
                data={
                    "scene_index": scene_index,
                    "start_ms": start_ms,
                    "end_ms": end_ms,
                    "start_frame": current_scene_start,
                    "end_frame": len(frames),
                    "duration_ms": end_ms - start_ms,
                },
            ))
        
        return results
    
    def annotate_batch(
        self,
        video_paths: List[str],
        **kwargs
    ) -> List[List[AnnotationResult]]:
        """Process multiple videos"""
        return [self.annotate(path, **kwargs) for path in video_paths]
    
    def cleanup(self) -> None:
        """Release resources"""
        self._detector = None
        super().cleanup()
