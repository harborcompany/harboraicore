"""
Speech Annotator (VAD + Diarization)
Uses pyannote.audio for voice activity detection and speaker diarization
"""

import logging
from typing import Any, Dict, List, Optional
import numpy as np

from .base import BaseAnnotator, AnnotationResult

logger = logging.getLogger(__name__)


class SpeechAnnotator(BaseAnnotator):
    """pyannote.audio-based VAD and speaker diarization"""
    
    model_name = "pyannote_vad"
    model_version = "3.0.0"
    
    def __init__(
        self,
        use_diarization: bool = True,
        num_speakers: Optional[int] = None,
        hf_token: Optional[str] = None,
    ):
        super().__init__()
        self.use_diarization = use_diarization
        self.num_speakers = num_speakers
        self.hf_token = hf_token
        self._vad_pipeline = None
        self._diarization_pipeline = None
    
    def load_model(self) -> None:
        """Load pyannote pipelines"""
        try:
            from pyannote.audio import Pipeline
            import os
            
            token = self.hf_token or os.getenv("HF_TOKEN")
            
            # Load VAD pipeline
            self._vad_pipeline = Pipeline.from_pretrained(
                "pyannote/voice-activity-detection",
                use_auth_token=token,
            )
            
            # Load diarization pipeline if needed
            if self.use_diarization:
                self._diarization_pipeline = Pipeline.from_pretrained(
                    "pyannote/speaker-diarization-3.0",
                    use_auth_token=token,
                )
            
            logger.info(f"Loaded {self.model_name} v{self.model_version}")
            
        except ImportError:
            logger.error("pyannote.audio not installed. Run: pip install pyannote.audio")
            raise
        except Exception as e:
            logger.warning(f"Failed to load pyannote: {e}. Using fallback VAD.")
            self._vad_pipeline = "fallback"
    
    def annotate(
        self,
        audio_path: str,
        run_diarization: bool = True,
        **kwargs
    ) -> List[AnnotationResult]:
        """
        Detect speech segments and optionally diarize speakers
        
        Args:
            audio_path: Path to audio file
            run_diarization: Whether to run speaker diarization
            
        Returns:
            List of speech segment results
        """
        self.ensure_loaded()
        
        results = []
        
        if self._vad_pipeline == "fallback":
            # Use fallback VAD
            return self._fallback_vad(audio_path)
        
        try:
            # Run VAD
            vad_output = self._vad_pipeline(audio_path)
            
            for segment in vad_output.get_timeline():
                results.append(AnnotationResult(
                    model_name=self.model_name,
                    model_version=self.model_version,
                    confidence=1.0,
                    timestamp_ms=segment.start * 1000,
                    data={
                        "start_ms": segment.start * 1000,
                        "end_ms": segment.end * 1000,
                        "is_speech": True,
                        "speaker_id": None,
                    },
                ))
            
            # Run diarization if requested
            if run_diarization and self._diarization_pipeline and self.use_diarization:
                diarization = self._diarization_pipeline(
                    audio_path,
                    num_speakers=self.num_speakers,
                )
                
                # Update results with speaker IDs
                speaker_segments = []
                for turn, _, speaker in diarization.itertracks(yield_label=True):
                    speaker_segments.append(AnnotationResult(
                        model_name="pyannote_diarization",
                        model_version="3.0.0",
                        confidence=1.0,
                        timestamp_ms=turn.start * 1000,
                        data={
                            "start_ms": turn.start * 1000,
                            "end_ms": turn.end * 1000,
                            "is_speech": True,
                            "speaker_id": speaker,
                        },
                    ))
                
                # Return diarization results instead if available
                if speaker_segments:
                    return speaker_segments
            
            return results
            
        except Exception as e:
            logger.error(f"Speech annotation failed: {e}")
            return self._fallback_vad(audio_path)
    
    def _fallback_vad(self, audio_path: str) -> List[AnnotationResult]:
        """Simple energy-based VAD fallback"""
        try:
            import librosa
            
            y, sr = librosa.load(audio_path, sr=16000)
            
            # Frame-based energy calculation
            frame_length = int(sr * 0.025)  # 25ms frames
            hop_length = int(sr * 0.010)    # 10ms hop
            
            energy = librosa.feature.rms(
                y=y, frame_length=frame_length, hop_length=hop_length
            )[0]
            
            # Threshold
            threshold = np.mean(energy) * 0.5
            is_speech = energy > threshold
            
            # Convert to segments
            results = []
            in_speech = False
            speech_start = 0
            
            for i, frame_is_speech in enumerate(is_speech):
                time_ms = (i * hop_length / sr) * 1000
                
                if frame_is_speech and not in_speech:
                    speech_start = time_ms
                    in_speech = True
                elif not frame_is_speech and in_speech:
                    results.append(AnnotationResult(
                        model_name="energy_vad",
                        model_version="1.0.0",
                        confidence=0.7,
                        timestamp_ms=speech_start,
                        data={
                            "start_ms": speech_start,
                            "end_ms": time_ms,
                            "is_speech": True,
                            "speaker_id": None,
                        },
                    ))
                    in_speech = False
            
            return results
            
        except Exception as e:
            logger.error(f"Fallback VAD failed: {e}")
            return []
    
    def annotate_batch(
        self,
        audio_paths: List[str],
        **kwargs
    ) -> List[List[AnnotationResult]]:
        """Process multiple audio files"""
        return [self.annotate(path, **kwargs) for path in audio_paths]
    
    def cleanup(self) -> None:
        """Release resources"""
        self._vad_pipeline = None
        self._diarization_pipeline = None
        super().cleanup()
