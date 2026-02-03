"""
Transcript Annotator (ASR)
Uses OpenAI Whisper for automatic speech recognition
"""

import logging
from typing import Any, Dict, List, Optional
import numpy as np

from .base import BaseAnnotator, AnnotationResult

logger = logging.getLogger(__name__)


class TranscriptAnnotator(BaseAnnotator):
    """Whisper-based automatic speech recognition"""
    
    model_name = "whisper"
    model_version = "large-v3"
    
    def __init__(
        self,
        model_size: str = "large-v3",
        language: Optional[str] = None,
        device: str = "auto",
    ):
        super().__init__()
        self.model_size = model_size
        self.language = language
        self.device = device
        self._model = None
    
    def load_model(self) -> None:
        """Load Whisper model"""
        try:
            import whisper
            import torch
            
            if self.device == "auto":
                self.device = "cuda" if torch.cuda.is_available() else "cpu"
            
            self._model = whisper.load_model(self.model_size, device=self.device)
            self.model_version = self.model_size
            
            logger.info(f"Loaded {self.model_name} {self.model_size} on {self.device}")
            
        except ImportError:
            logger.error("Whisper not installed. Run: pip install openai-whisper")
            raise
    
    def annotate(
        self,
        audio_path: str,
        word_timestamps: bool = True,
        **kwargs
    ) -> List[AnnotationResult]:
        """
        Transcribe audio file
        
        Args:
            audio_path: Path to audio file
            word_timestamps: Whether to include word-level timing
            
        Returns:
            List of transcript segment results
        """
        self.ensure_loaded()
        
        try:
            # Transcribe with Whisper
            result = self._model.transcribe(
                audio_path,
                language=self.language,
                word_timestamps=word_timestamps,
                verbose=False,
            )
            
            results = []
            
            for segment in result["segments"]:
                # Build word timings if available
                word_timings = None
                if word_timestamps and "words" in segment:
                    word_timings = [
                        {
                            "word": w["word"],
                            "start_ms": w["start"] * 1000,
                            "end_ms": w["end"] * 1000,
                        }
                        for w in segment["words"]
                    ]
                
                # Calculate confidence from logprob
                avg_logprob = segment.get("avg_logprob", -0.5)
                confidence = min(1.0, max(0.0, 1.0 + avg_logprob))
                
                results.append(AnnotationResult(
                    model_name=self.model_name,
                    model_version=self.model_version,
                    confidence=confidence,
                    timestamp_ms=segment["start"] * 1000,
                    data={
                        "text": segment["text"].strip(),
                        "start_ms": segment["start"] * 1000,
                        "end_ms": segment["end"] * 1000,
                        "language": result.get("language", self.language),
                        "word_timings": word_timings,
                        "no_speech_prob": segment.get("no_speech_prob", 0),
                    },
                ))
            
            return results
            
        except Exception as e:
            logger.error(f"Transcription failed: {e}")
            return []
    
    def annotate_batch(
        self,
        audio_paths: List[str],
        **kwargs
    ) -> List[List[AnnotationResult]]:
        """Process multiple audio files"""
        return [self.annotate(path, **kwargs) for path in audio_paths]
    
    def detect_language(self, audio_path: str) -> Dict[str, Any]:
        """
        Detect language of audio
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Dict with detected language and probabilities
        """
        self.ensure_loaded()
        
        try:
            import whisper
            
            # Load audio
            audio = whisper.load_audio(audio_path)
            audio = whisper.pad_or_trim(audio)
            
            # Make log-Mel spectrogram
            mel = whisper.log_mel_spectrogram(audio).to(self._model.device)
            
            # Detect language
            _, probs = self._model.detect_language(mel)
            
            # Get top 5 languages
            sorted_probs = sorted(probs.items(), key=lambda x: x[1], reverse=True)[:5]
            
            return {
                "detected_language": sorted_probs[0][0],
                "confidence": sorted_probs[0][1],
                "top_languages": [
                    {"language": lang, "probability": prob}
                    for lang, prob in sorted_probs
                ],
            }
            
        except Exception as e:
            logger.error(f"Language detection failed: {e}")
            return {"detected_language": "unknown", "confidence": 0.0}
    
    def cleanup(self) -> None:
        """Release resources"""
        self._model = None
        super().cleanup()
