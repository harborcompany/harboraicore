"""
Hand & Pose Detection Annotator
Uses MediaPipe for hand landmark detection
"""

import logging
from typing import Any, Dict, List, Optional
import numpy as np

from .base import BaseAnnotator, AnnotationResult

logger = logging.getLogger(__name__)


class HandPoseAnnotator(BaseAnnotator):
    """MediaPipe-based hand and pose detection"""
    
    model_name = "mediapipe_hands"
    model_version = "0.10.7"
    
    def __init__(self, max_hands: int = 2, min_confidence: float = 0.5):
        super().__init__()
        self.max_hands = max_hands
        self.min_confidence = min_confidence
        self._hands = None
    
    def load_model(self) -> None:
        """Load MediaPipe hands model"""
        try:
            import mediapipe as mp
            self._hands = mp.solutions.hands.Hands(
                static_image_mode=False,
                max_num_hands=self.max_hands,
                min_detection_confidence=self.min_confidence,
                min_tracking_confidence=self.min_confidence,
            )
            logger.info(f"Loaded {self.model_name} v{self.model_version}")
        except ImportError:
            logger.error("MediaPipe not installed. Run: pip install mediapipe")
            raise
    
    def annotate(
        self,
        frame: np.ndarray,
        frame_id: int = 0,
        timestamp_ms: float = 0.0,
        **kwargs
    ) -> List[AnnotationResult]:
        """
        Detect hands in a single frame
        
        Args:
            frame: RGB image as numpy array (H, W, 3)
            frame_id: Frame number
            timestamp_ms: Timestamp in milliseconds
            
        Returns:
            List of hand detection results
        """
        self.ensure_loaded()
        
        results = []
        detection = self._hands.process(frame)
        
        if detection.multi_hand_landmarks:
            for idx, (hand_landmarks, handedness) in enumerate(
                zip(detection.multi_hand_landmarks, detection.multi_handedness)
            ):
                hand_type = handedness.classification[0].label  # "Left" or "Right"
                confidence = handedness.classification[0].score
                
                # Extract keypoints
                keypoints = []
                for landmark_idx, landmark in enumerate(hand_landmarks.landmark):
                    keypoints.append({
                        "x": landmark.x,
                        "y": landmark.y,
                        "z": landmark.z,
                        "name": self._landmark_name(landmark_idx),
                    })
                
                results.append(AnnotationResult(
                    model_name=self.model_name,
                    model_version=self.model_version,
                    confidence=confidence,
                    frame_id=frame_id,
                    timestamp_ms=timestamp_ms,
                    data={
                        "hand_type": hand_type.upper(),
                        "keypoints": keypoints,
                        "hand_index": idx,
                    },
                ))
        
        return results
    
    def annotate_batch(
        self,
        frames: List[np.ndarray],
        start_frame_id: int = 0,
        frame_interval_ms: float = 33.33,
        **kwargs
    ) -> List[List[AnnotationResult]]:
        """
        Detect hands in multiple frames
        
        Args:
            frames: List of RGB images
            start_frame_id: Starting frame ID
            frame_interval_ms: Time between frames in ms
            
        Returns:
            List of detection results per frame
        """
        all_results = []
        for idx, frame in enumerate(frames):
            frame_id = start_frame_id + idx
            timestamp_ms = frame_id * frame_interval_ms
            results = self.annotate(frame, frame_id, timestamp_ms)
            all_results.append(results)
        return all_results
    
    def cleanup(self) -> None:
        """Release MediaPipe resources"""
        if self._hands:
            self._hands.close()
            self._hands = None
        super().cleanup()
    
    @staticmethod
    def _landmark_name(idx: int) -> str:
        """Get landmark name from index"""
        names = [
            "WRIST", "THUMB_CMC", "THUMB_MCP", "THUMB_IP", "THUMB_TIP",
            "INDEX_FINGER_MCP", "INDEX_FINGER_PIP", "INDEX_FINGER_DIP", "INDEX_FINGER_TIP",
            "MIDDLE_FINGER_MCP", "MIDDLE_FINGER_PIP", "MIDDLE_FINGER_DIP", "MIDDLE_FINGER_TIP",
            "RING_FINGER_MCP", "RING_FINGER_PIP", "RING_FINGER_DIP", "RING_FINGER_TIP",
            "PINKY_MCP", "PINKY_PIP", "PINKY_DIP", "PINKY_TIP",
        ]
        return names[idx] if idx < len(names) else f"LANDMARK_{idx}"
