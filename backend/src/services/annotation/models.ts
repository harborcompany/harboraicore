import { cogneeAdapter } from '../rag-engine';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

/**
 * AI Model Integration Service
 * Connects to the Python auto-annotator microservice for:
 *   - YOLOv8 object detection
 *   - SAM3 instance segmentation  
 *   - Cognee Graph RAG
 *   - MediaPipe hand pose
 *   - Whisper speech-to-text
 */
export class AIModelService {

    /**
     * Check if the Python auto-annotator service is reachable
     */
    async healthCheck(): Promise<{ healthy: boolean; models: string[]; gpu: boolean }> {
        try {
            const res = await fetch(`${PYTHON_SERVICE_URL}/health`, { signal: AbortSignal.timeout(5000) });
            if (!res.ok) return { healthy: false, models: [], gpu: false };
            const data = await res.json() as { models_loaded?: string[]; gpu_available?: boolean };
            return {
                healthy: true,
                models: data.models_loaded || [],
                gpu: data.gpu_available || false,
            };
        } catch {
            return { healthy: false, models: [], gpu: false };
        }
    }

    /**
     * List all available ML models and their status
     */
    async listModels(): Promise<any> {
        try {
            const res = await fetch(`${PYTHON_SERVICE_URL}/models`, { signal: AbortSignal.timeout(5000) });
            if (!res.ok) throw new Error(`Model list failed: ${res.statusText}`);
            return await res.json();
        } catch (error) {
            console.warn('[AIModelService] Cannot reach Python service, returning defaults');
            return {
                video: {
                    hand_pose: { name: 'MediaPipe Hands', version: '0.10.7', loaded: false },
                    object_detection: { name: 'YOLOv8', version: '8.0.0', loaded: false },
                    action_recognition: { name: 'TimesFormer', version: '1.0.0', loaded: false },
                    scene_segmentation: { name: 'PySceneDetect', version: '0.6.2', loaded: false },
                },
                audio: {
                    vad_diarization: { name: 'pyannote.audio', version: '3.0.0', loaded: false },
                    asr: { name: 'Whisper', version: 'large-v3', loaded: false },
                },
            };
        }
    }

    /**
     * Run YOLOv8 object detection via the Python auto-annotator
     */
    async detectObjectsYOLO(imageUrl: string): Promise<any[]> {
        console.log(`[AI-YOLO] Requesting detection: ${imageUrl}`);
        try {
            const formData = new FormData();
            // If imageUrl is a URL, fetch the image first
            const imageRes = await fetch(imageUrl);
            const blob = await imageRes.blob();
            formData.append('file', blob, 'frame.jpg');

            const res = await fetch(`${PYTHON_SERVICE_URL}/api/annotate/objects`, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(30000),
            });

            if (!res.ok) throw new Error(`YOLO detection failed: ${res.statusText}`);
            const data = await res.json() as { annotations?: any[] };
            return data.annotations || [];
        } catch (error) {
            console.error('[AI-YOLO] Detection failed, returning fallback:', error);
            // Fallback for dev/testing when Python service is not running
            return [
                { label: 'brick', confidence: 0.92, bbox: [100, 100, 200, 400], model: 'yolov8', fallback: true },
            ];
        }
    }

    /**
     * Run SAM3 segmentation via the Python auto-annotator
     */
    async segmentAnythingSAM(imageUrl: string, prompts?: any[]): Promise<any> {
        console.log(`[AI-SAM3] Requesting segmentation: ${imageUrl}`);
        try {
            const formData = new FormData();
            const imageRes = await fetch(imageUrl);
            const blob = await imageRes.blob();
            formData.append('file', blob, 'frame.jpg');

            if (prompts) {
                formData.append('prompts', JSON.stringify(prompts));
            }

            const res = await fetch(`${PYTHON_SERVICE_URL}/api/annotate/video`, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(60000),
            });

            if (!res.ok) throw new Error(`SAM3 segmentation failed: ${res.statusText}`);
            const data = await res.json() as { annotations?: any };
            return data.annotations || { masks: [], segments: 0 };
        } catch (error) {
            console.error('[AI-SAM3] Segmentation failed, returning fallback:', error);
            return { masks: [], segments: 0, fallback: true };
        }
    }

    /**
     * Run full video annotation pipeline (all models)
     */
    async annotateVideo(
        videoUrl: string,
        options: {
            runHands?: boolean;
            runObjects?: boolean;
            runActions?: boolean;
            runScenes?: boolean;
            runSam3?: boolean;
            runLivecc?: boolean;
            frameInterval?: number;
        } = {}
    ): Promise<any> {
        console.log(`[AIModelService] Full video annotation: ${videoUrl}`);
        try {
            const formData = new FormData();
            const videoRes = await fetch(videoUrl);
            const blob = await videoRes.blob();
            formData.append('file', blob, 'video.mp4');
            formData.append('run_hands', String(options.runHands ?? true));
            formData.append('run_objects', String(options.runObjects ?? true));
            formData.append('run_actions', String(options.runActions ?? true));
            formData.append('run_scenes', String(options.runScenes ?? true));
            formData.append('run_sam3', String(options.runSam3 ?? false));
            formData.append('run_livecc', String(options.runLivecc ?? false));
            formData.append('frame_interval', String(options.frameInterval ?? 30));

            const res = await fetch(`${PYTHON_SERVICE_URL}/api/annotate/video`, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(300000), // 5 min timeout for video
            });

            if (!res.ok) throw new Error(`Video annotation failed: ${res.statusText}`);
            return await res.json();
        } catch (error) {
            console.error('[AIModelService] Video annotation failed:', error);
            throw error;
        }
    }

    /**
     * Run audio annotation pipeline (Whisper ASR + VAD)
     */
    async annotateAudio(
        audioUrl: string,
        options: { runVad?: boolean; runDiarization?: boolean; runAsr?: boolean; language?: string } = {}
    ): Promise<any> {
        console.log(`[AIModelService] Audio annotation: ${audioUrl}`);
        try {
            const formData = new FormData();
            const audioRes = await fetch(audioUrl);
            const blob = await audioRes.blob();
            formData.append('file', blob, 'audio.wav');
            formData.append('run_vad', String(options.runVad ?? true));
            formData.append('run_diarization', String(options.runDiarization ?? true));
            formData.append('run_asr', String(options.runAsr ?? true));
            if (options.language) formData.append('language', options.language);

            const res = await fetch(`${PYTHON_SERVICE_URL}/api/annotate/audio`, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(120000),
            });

            if (!res.ok) throw new Error(`Audio annotation failed: ${res.statusText}`);
            return await res.json();
        } catch (error) {
            console.error('[AIModelService] Audio annotation failed:', error);
            throw error;
        }
    }

    /**
     * Run Cognee Graph RAG knowledge extraction
     */
    async processKnowledgeGraph(text: string): Promise<any> {
        console.log(`[AI-Cognee] Processing graph for text length: ${text.length}`);
        const mediaId = 'doc_' + Date.now();
        return cogneeAdapter.addToGraph(mediaId, [{
            type: 'transcript',
            content: text,
            metadata: { source: 'ai-service' }
        }]);
    }
}

export const aiService = new AIModelService();
