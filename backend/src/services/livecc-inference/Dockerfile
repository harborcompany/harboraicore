FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
# ffmpeg is required for audio processing (Whisper)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage cache
COPY app/requirements.txt .

# Install Python dependencies
# Update pip first
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ .

# Run the agent
CMD ["python", "main.py", "dev"]
