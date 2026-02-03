"""
Object Detection Annotator
Uses YOLOv8 for object detection (bricks, hands, tools)
"""

import logging
from typing import Any, Dict, List, Optional
import numpy as np

from .base import BaseAnnotator, AnnotationResult

logger = logging.getLogger(__name__)


class ObjectDetector(BaseAnnotator):
    """YOLOv8-based object detection"""
    
    model_name = "yolov8"
    model_version = "8.0.0"
    
    # Custom class mapping for LEGO domain
    LEGO_CLASSES = {
        "person": "hand",  # Remap person to hand for our use case
        "brick": "brick",
        "piece": "piece",
        "tool": "tool",
    }
    
    def __init__(
        self,
        model_path: str = "yolov8n.pt",  # Use nano model by default
        confidence_threshold: float = 0.5,
        device: str = "auto",
    ):
        super().__init__()
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        self.device = device
        self._model = None
    
    def load_model(self) -> None:
        """Load YOLOv8 model"""
        try:
            from ultralytics import YOLO
            self._model = YOLO(self.model_path)
            
            # Set device
            if self.device == "auto":
                import torch
                self.device = "cuda" if torch.cuda.is_available() else "cpu"
            
            logger.info(f"Loaded {self.model_name} v{self.model_version} on {self.device}")
        except ImportError:
            logger.error("Ultralytics not installed. Run: pip install ultralytics")
            raise
    
    def annotate(
        self,
        frame: np.ndarray,
        frame_id: int = 0,
        timestamp_ms: float = 0.0,
        classes: Optional[List[str]] = None,
        **kwargs
    ) -> List[AnnotationResult]:
        """
        Detect objects in a single frame
        
        Args:
            frame: RGB image as numpy array (H, W, 3)
            frame_id: Frame number
            timestamp_ms: Timestamp in milliseconds
            classes: Filter to specific class names
            
        Returns:
            List of object detection results
        """
        self.ensure_loaded()
        
        # Run inference
        predictions = self._model(
            frame,
            conf=self.confidence_threshold,
            verbose=False,
            device=self.device,
        )
        
        results = []
        for pred in predictions:
            boxes = pred.boxes
            for i, (box, conf, cls) in enumerate(zip(boxes.xyxy, boxes.conf, boxes.cls)):
                class_name = self._model.names[int(cls)]
                
                # Remap class names for LEGO domain
                object_type = self.LEGO_CLASSES.get(class_name, class_name)
                
                # Filter by class if specified
                if classes and object_type not in classes:
                    continue
                
                # Get bounding box
                x1, y1, x2, y2 = box.cpu().numpy()
                bbox = {
                    "x": float(x1),
                    "y": float(y1),
                    "w": float(x2 - x1),
                    "h": float(y2 - y1),
                }
                
                results.append(AnnotationResult(
                    model_name=self.model_name,
                    model_version=self.model_version,
                    confidence=float(conf),
                    frame_id=frame_id,
                    timestamp_ms=timestamp_ms,
                    data={
                        "object_type": object_type,
                        "original_class": class_name,
                        "bbox": bbox,
                        "detection_index": i,
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
        Detect objects in multiple frames
        
        Args:
            frames: List of RGB images
            start_frame_id: Starting frame ID
            frame_interval_ms: Time between frames in ms
            
        Returns:
            List of detection results per frame
        """
        self.ensure_loaded()
        
        # YOLO supports batch inference
        predictions = self._model(
            frames,
            conf=self.confidence_threshold,
            verbose=False,
            device=self.device,
        )
        
        all_results = []
        for idx, pred in enumerate(predictions):
            frame_id = start_frame_id + idx
            timestamp_ms = frame_id * frame_interval_ms
            
            frame_results = []
            boxes = pred.boxes
            for i, (box, conf, cls) in enumerate(zip(boxes.xyxy, boxes.conf, boxes.cls)):
                class_name = self._model.names[int(cls)]
                object_type = self.LEGO_CLASSES.get(class_name, class_name)
                
                x1, y1, x2, y2 = box.cpu().numpy()
                bbox = {
                    "x": float(x1),
                    "y": float(y1),
                    "w": float(x2 - x1),
                    "h": float(y2 - y1),
                }
                
                frame_results.append(AnnotationResult(
                    model_name=self.model_name,
                    model_version=self.model_version,
                    confidence=float(conf),
                    frame_id=frame_id,
                    timestamp_ms=timestamp_ms,
                    data={
                        "object_type": object_type,
                        "original_class": class_name,
                        "bbox": bbox,
                        "detection_index": i,
                    },
                ))
            
            all_results.append(frame_results)
        
        return all_results
    
    def cleanup(self) -> None:
        """Release model resources"""
        self._model = None
        super().cleanup()
