"""
SAM3 (Segment Anything Model 3) Annotator
Pixel-level segmentation for hands, bricks, and objects
"""

import logging
from typing import Any, Dict, List, Optional
import numpy as np

from .base import BaseAnnotator, AnnotationResult

logger = logging.getLogger(__name__)


class SAM3Annotator(BaseAnnotator):
    """Segment Anything Model 3 for instance segmentation"""
    
    model_name = "sam3"
    model_version = "3.0"
    
    def __init__(self, 
                 checkpoint: str = "sam3_hiera_large.pt",
                 device: str = "cuda"):
        super().__init__()
        self.checkpoint = checkpoint
        self.device = device
        self._model = None
        self._predictor = None
    
    def load_model(self) -> None:
        """Load SAM3 model"""
        try:
            # SAM3 import (requires sam3 package)
            # pip install segment-anything-3
            from sam3 import build_sam3, SAM3Predictor
            
            self._model = build_sam3(
                checkpoint=self.checkpoint,
                device=self.device
            )
            self._predictor = SAM3Predictor(self._model)
            logger.info(f"Loaded {self.model_name} v{self.model_version}")
        except ImportError:
            logger.error("SAM3 not installed. Run: pip install segment-anything-3")
            raise
    
    def annotate(
        self,
        frame: np.ndarray,
        frame_id: int = 0,
        timestamp_ms: float = 0.0,
        prompts: Optional[List[Dict]] = None,
        **kwargs
    ) -> List[AnnotationResult]:
        """
        Segment objects in a frame
        
        Args:
            frame: RGB image as numpy array (H, W, 3)
            frame_id: Frame number
            timestamp_ms: Timestamp in milliseconds
            prompts: Optional list of point/box prompts for guided segmentation
            
        Returns:
            List of segmentation masks with metadata
        """
        self.ensure_loaded()
        
        results = []
        
        # Set image for predictor
        self._predictor.set_image(frame)
        
        if prompts:
            # Prompted segmentation (for specific objects)
            for prompt in prompts:
                masks, scores, _ = self._predictor.predict(
                    point_coords=prompt.get("points"),
                    point_labels=prompt.get("labels"),
                    box=prompt.get("box"),
                    multimask_output=True
                )
                
                # Take best mask
                best_idx = scores.argmax()
                mask = masks[best_idx]
                score = float(scores[best_idx])
                
                results.append(AnnotationResult(
                    model_name=self.model_name,
                    model_version=self.model_version,
                    confidence=score,
                    frame_id=frame_id,
                    timestamp_ms=timestamp_ms,
                    data={
                        "mask": self._encode_mask(mask),
                        "prompt_type": "guided",
                        "label": prompt.get("label", "object"),
                    },
                ))
        else:
            # Automatic segmentation (segment everything)
            masks = self._predictor.generate_auto_masks()
            
            for idx, mask_data in enumerate(masks):
                results.append(AnnotationResult(
                    model_name=self.model_name,
                    model_version=self.model_version,
                    confidence=mask_data["stability_score"],
                    frame_id=frame_id,
                    timestamp_ms=timestamp_ms,
                    data={
                        "mask": self._encode_mask(mask_data["segmentation"]),
                        "bbox": mask_data["bbox"],  # [x, y, w, h]
                        "area": mask_data["area"],
                        "prompt_type": "auto",
                        "segment_id": idx,
                    },
                ))
        
        return results
    
    def _encode_mask(self, mask: np.ndarray) -> str:
        """Encode binary mask as RLE for storage"""
        import base64
        import zlib
        
        # Flatten and compress
        flat = mask.flatten().astype(np.uint8)
        compressed = zlib.compress(flat.tobytes())
        encoded = base64.b64encode(compressed).decode('utf-8')
        
        return encoded
    
    def cleanup(self) -> None:
        """Release model resources"""
        if self._model:
            del self._model
            self._model = None
            self._predictor = None
        super().cleanup()
