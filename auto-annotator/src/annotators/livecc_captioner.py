"""
LiveCC Dense Video Captioning Annotator
Generates step-by-step action descriptions for instruction videos
"""

import logging
from typing import Any, Dict, List, Optional
import numpy as np

from .base import BaseAnnotator, AnnotationResult

logger = logging.getLogger(__name__)


class LiveCCAnnotator(BaseAnnotator):
    """LiveCC for dense video captioning and step description"""
    
    model_name = "livecc"
    model_version = "1.0"
    
    def __init__(self, 
                 model_path: str = "livecc_7b",
                 device: str = "cuda",
                 caption_interval_sec: float = 2.0):
        super().__init__()
        self.model_path = model_path
        self.device = device
        self.caption_interval_sec = caption_interval_sec
        self._model = None
        self._processor = None
    
    def load_model(self) -> None:
        """Load LiveCC model"""
        try:
            # LiveCC import (requires livecc package or HuggingFace)
            # pip install livecc or transformers
            from transformers import AutoModelForCausalLM, AutoProcessor
            
            self._processor = AutoProcessor.from_pretrained(self.model_path)
            self._model = AutoModelForCausalLM.from_pretrained(
                self.model_path,
                device_map=self.device,
                torch_dtype="auto"
            )
            logger.info(f"Loaded {self.model_name} v{self.model_version}")
        except ImportError:
            logger.error("LiveCC/Transformers not installed. Run: pip install transformers")
            raise
    
    def annotate(
        self,
        video_path: str,
        fps: float = 30.0,
        context: Optional[str] = None,
        **kwargs
    ) -> List[AnnotationResult]:
        """
        Generate dense captions for a video
        
        Args:
            video_path: Path to video file
            fps: Video FPS for timestamp calculation
            context: Optional context prompt (e.g., "LEGO assembly video")
            
        Returns:
            List of caption segments with timestamps
        """
        self.ensure_loaded()
        
        import cv2
        
        results = []
        cap = cv2.VideoCapture(video_path)
        video_fps = cap.get(cv2.CAP_PROP_FPS) or fps
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Sample frames at caption_interval_sec intervals
        frame_interval = int(video_fps * self.caption_interval_sec)
        
        prompt = context or "Describe what the person is doing in this video segment."
        
        frame_buffer = []
        segment_start_frame = 0
        
        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # Collect frames for this segment
            if frame_idx % frame_interval < 8:  # Take 8 frames per segment
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frame_buffer.append(frame_rgb)
            
            # Process segment
            if len(frame_buffer) >= 8 or frame_idx == total_frames - 1:
                if frame_buffer:
                    caption = self._generate_caption(frame_buffer, prompt)
                    
                    start_time = segment_start_frame / video_fps
                    end_time = frame_idx / video_fps
                    
                    results.append(AnnotationResult(
                        model_name=self.model_name,
                        model_version=self.model_version,
                        confidence=0.85,  # LiveCC doesn't output confidence, use default
                        frame_id=segment_start_frame,
                        timestamp_ms=start_time * 1000,
                        data={
                            "caption": caption,
                            "start_time": start_time,
                            "end_time": end_time,
                            "is_step": self._is_step_description(caption),
                        },
                    ))
                    
                    frame_buffer = []
                    segment_start_frame = frame_idx
            
            frame_idx += 1
        
        cap.release()
        
        # Post-process to identify steps
        self._identify_steps(results)
        
        return results
    
    def _generate_caption(self, frames: List[np.ndarray], prompt: str) -> str:
        """Generate caption from frames using LiveCC"""
        import torch
        
        # Stack frames into video tensor
        video_tensor = np.stack(frames)
        
        inputs = self._processor(
            text=prompt,
            videos=video_tensor,
            return_tensors="pt"
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self._model.generate(
                **inputs,
                max_new_tokens=150,
                do_sample=True,
                temperature=0.7
            )
        
        caption = self._processor.decode(outputs[0], skip_special_tokens=True)
        return caption
    
    def _is_step_description(self, caption: str) -> bool:
        """Check if caption describes a distinct step"""
        step_keywords = [
            "attach", "connects", "places", "picks up", "installs",
            "rotates", "aligns", "presses", "snaps", "builds",
            "assembles", "adds", "removes", "flips", "adjusts"
        ]
        caption_lower = caption.lower()
        return any(kw in caption_lower for kw in step_keywords)
    
    def _identify_steps(self, results: List[AnnotationResult]) -> None:
        """Post-process to number sequential steps"""
        step_num = 0
        for result in results:
            if result.data.get("is_step"):
                step_num += 1
                result.data["step_number"] = step_num
    
    def cleanup(self) -> None:
        """Release model resources"""
        if self._model:
            del self._model
            del self._processor
            self._model = None
            self._processor = None
        super().cleanup()
