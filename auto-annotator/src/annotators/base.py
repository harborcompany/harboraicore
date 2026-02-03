"""
Base Annotator Interface
All annotators must implement this interface for consistent behavior
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class AnnotationResult(BaseModel):
    """Standard annotation result format"""
    model_name: str
    model_version: str
    confidence: float
    timestamp_ms: Optional[float] = None
    frame_id: Optional[int] = None
    data: Dict[str, Any]


class BaseAnnotator(ABC):
    """Abstract base class for all annotators"""
    
    model_name: str = "base"
    model_version: str = "0.0.0"
    
    def __init__(self):
        self._is_loaded = False
    
    @abstractmethod
    def load_model(self) -> None:
        """Load the ML model into memory"""
        pass
    
    @abstractmethod
    def annotate(self, input_data: Any, **kwargs) -> List[AnnotationResult]:
        """
        Run annotation on input data
        
        Args:
            input_data: Input to annotate (frame, audio segment, etc.)
            **kwargs: Additional parameters
            
        Returns:
            List of annotation results
        """
        pass
    
    @abstractmethod
    def annotate_batch(self, inputs: List[Any], **kwargs) -> List[List[AnnotationResult]]:
        """
        Run batch annotation
        
        Args:
            inputs: List of inputs to annotate
            **kwargs: Additional parameters
            
        Returns:
            List of annotation result lists
        """
        pass
    
    def cleanup(self) -> None:
        """Release resources"""
        self._is_loaded = False
    
    @property
    def is_loaded(self) -> bool:
        return self._is_loaded
    
    def ensure_loaded(self) -> None:
        """Ensure model is loaded"""
        if not self._is_loaded:
            self.load_model()
            self._is_loaded = True
