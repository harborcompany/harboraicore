# Harbor ML Auto-Annotator Microservice

A Python FastAPI microservice for running ML inference on video and audio assets.

## Features

- **Video Annotations**: Hand/pose detection (MediaPipe), object detection (YOLO), action recognition, scene segmentation
- **Audio Annotations**: VAD, speaker diarization, ASR (Whisper), quality metrics
- **Batch Processing**: Queue-based processing with progress tracking
- **GPU Optimized**: Designed for GPU deployment (RunPod, AWS GPU instances)

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download models
python scripts/download_models.py
```

## Running

```bash
# Development
uvicorn src.main:app --reload --port 8001

# Production
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001
```

## API Endpoints

- `POST /annotate/video` - Full video annotation pipeline
- `POST /annotate/audio` - Full audio annotation pipeline
- `POST /annotate/hands` - Hand detection only
- `POST /annotate/objects` - Object detection only
- `POST /annotate/asr` - Speech recognition only
- `GET /health` - Health check
- `GET /models` - List available models

## Docker

```bash
docker build -t harbor-annotator .
docker run --gpus all -p 8001:8001 harbor-annotator
```
