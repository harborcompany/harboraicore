/**
 * QA Service — Frontend
 * 
 * Mirrors the backend QA pipeline types and either:
 * 1. Calls the backend API when available
 * 2. Runs a client-side simulation via localStorage
 * 
 * This gives the frontend full type coverage and simulated data
 * until the backend QA endpoints are deployed.
 */

// ============================================
// TYPES (Mirror backend exports)
// ============================================

export interface PreprocessingResult {
    originalFormat: string;
    convertedFormat: 'wav';
    sampleRate: 44100;
    channels: 'mono';
    normalizedAmplitude: boolean;
    fileSizeBytes: number;
    processedAt: string;
}

export interface QualityMetrics {
    duration_seconds: number;
    average_volume_db: number;
    clipping_ratio: number;
    silence_ratio: number;
    background_noise_score: number;
    speech_to_noise_ratio: number;
    language_detected: string;
    speech_rate_wpm: number;
}

export interface TranscriptSegment {
    start: number;
    end: number;
    text: string;
    confidence: number;
}

export interface TranscriptionResult {
    transcript: string;
    segments: TranscriptSegment[];
    wer_estimate: number;
    model: string;
    processingTimeMs: number;
}

export interface EmotionSegment {
    segment_id: number;
    predicted_emotion: string;
    confidence: number;
}

export interface EmotionResult {
    segments: EmotionSegment[];
    dominantEmotion: string;
    averageConfidence: number;
    emotionDistribution: Record<string, number>;
}

export interface SpeakerFingerprint {
    embeddingHash: string;
    speakerCount: number;
    duplicateVoiceDetected: boolean;
    identityFraudRisk: 'none' | 'low' | 'medium' | 'high';
    matchedSpeakerIds: string[];
    processedAt: string;
}

export interface AutoScoreBreakdown {
    audio_quality: { score: number; weight: number };
    transcript_alignment: { score: number; weight: number };
    emotion_confidence: { score: number; weight: number };
    silence_ratio: { score: number; weight: number };
    speech_clarity: { score: number; weight: number };
}

export interface AutoScore {
    auto_score: number;
    status: 'NEEDS_HUMAN_REVIEW' | 'FAIL_AUTOMATED';
    breakdown: AutoScoreBreakdown;
    computedAt: string;
}

export interface QAPipelineResult {
    submissionId: string;
    pipelineVersion: string;
    startedAt: string;
    completedAt: string;
    processingTimeMs: number;
    steps: {
        preprocessing: PreprocessingResult;
        qualityMetrics: QualityMetrics;
        transcription: TranscriptionResult;
        emotion: EmotionResult;
        speakerFingerprint: SpeakerFingerprint;
        autoScore: AutoScore;
    };
    humanReviewRequired: boolean;
    humanReviewReasons: string[];
}

// ============================================
// STORAGE
// ============================================

const QA_STORAGE_KEY = 'harbor_qa_results';
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function loadQAResults(): Record<string, QAPipelineResult> {
    try {
        const raw = localStorage.getItem(QA_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return {};
}

function saveQAResults(data: Record<string, QAPipelineResult>): void {
    localStorage.setItem(QA_STORAGE_KEY, JSON.stringify(data));
}

// ============================================
// CLIENT-SIDE PIPELINE SIMULATION
// ============================================

function simulatePipeline(submissionId: string, category: string, durationSeconds: number): QAPipelineResult {
    const isAudio = category === 'audio';
    const startedAt = new Date().toISOString();

    // Quality Metrics
    const volume = -(Math.random() * 10 + 14);
    const clipping = Math.random() * 0.01;
    const silence = Math.random() * 0.2 + 0.05;
    const noise = Math.random() * 0.3;
    const snr = isAudio ? Math.random() * 15 + 20 : Math.random() * 10 + 5;
    const speechRate = isAudio ? Math.floor(Math.random() * 50 + 130) : 0;

    const qualityMetrics: QualityMetrics = {
        duration_seconds: durationSeconds,
        average_volume_db: Math.round(volume * 10) / 10,
        clipping_ratio: Math.round(clipping * 10000) / 10000,
        silence_ratio: Math.round(silence * 100) / 100,
        background_noise_score: Math.round(noise * 100) / 100,
        speech_to_noise_ratio: Math.round(snr * 10) / 10,
        language_detected: 'en',
        speech_rate_wpm: speechRate,
    };

    // Transcription
    const segmentCount = Math.max(1, Math.floor(durationSeconds / 15));
    const texts = [
        'The quick brown fox jumps over the lazy dog.',
        'Moving on to the next section of this recording.',
        'Clear articulation with natural pacing demonstrated.',
        'Several key points are covered in this segment.',
    ];
    const segments: TranscriptSegment[] = Array.from({ length: segmentCount }, (_, i) => ({
        start: Math.round(((durationSeconds / segmentCount) * i) * 10) / 10,
        end: Math.round(((durationSeconds / segmentCount) * (i + 1)) * 10) / 10,
        text: isAudio ? texts[i % texts.length] : '[Visual content — no speech]',
        confidence: isAudio ? 0.85 + Math.random() * 0.14 : 1.0,
    }));

    const transcription: TranscriptionResult = {
        transcript: segments.map(s => s.text).join(' '),
        segments,
        wer_estimate: isAudio ? Math.round(Math.random() * 0.08 * 100) / 100 : 0,
        model: 'whisper-large-v3',
        processingTimeMs: Math.floor(durationSeconds * 300),
    };

    // Emotion
    const emotionLabels = ['neutral', 'happy', 'excited', 'neutral', 'neutral', 'happy', 'neutral', 'surprised'];
    const emotionSegments: EmotionSegment[] = segments.map((_, i) => ({
        segment_id: i,
        predicted_emotion: isAudio ? emotionLabels[i % emotionLabels.length] : 'neutral',
        confidence: isAudio ? Math.round((0.7 + Math.random() * 0.28) * 100) / 100 : 0.95,
    }));
    const avgEmotionConf = emotionSegments.reduce((a, s) => a + s.confidence, 0) / emotionSegments.length;
    const distribution: Record<string, number> = {};
    emotionSegments.forEach(e => {
        distribution[e.predicted_emotion] = (distribution[e.predicted_emotion] || 0) + 1;
    });
    Object.keys(distribution).forEach(k => {
        distribution[k] = Math.round((distribution[k] / emotionSegments.length) * 100) / 100;
    });

    const emotion: EmotionResult = {
        segments: emotionSegments,
        dominantEmotion: Object.entries(distribution).reduce((a, b) => b[1] > a[1] ? b : a, ['neutral', 0])[0],
        averageConfidence: Math.round(avgEmotionConf * 100) / 100,
        emotionDistribution: distribution,
    };

    // Speaker Fingerprint
    const speakerFingerprint: SpeakerFingerprint = {
        embeddingHash: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        speakerCount: 1,
        duplicateVoiceDetected: false,
        identityFraudRisk: 'none',
        matchedSpeakerIds: [],
        processedAt: new Date().toISOString(),
    };

    // Auto Score
    const noiseScore = Math.max(0, 100 - noise * 200);
    const clippingScore = Math.max(0, 100 - clipping * 5000);
    const snrScore = Math.min(100, (snr / 30) * 100);
    const audioQuality = (noiseScore + clippingScore + snrScore) / 3;
    const avgSegConf = segments.reduce((a, s) => a + s.confidence, 0) / segments.length;
    const werScore = Math.max(0, 100 - transcription.wer_estimate * 500);
    const transcriptAlign = isAudio ? avgSegConf * 100 * 0.6 + werScore * 0.4 : 95;
    const emotionScore = avgEmotionConf * 100;
    const silenceScore = silence < 0.25 ? 100 - silence * 200 : Math.max(0, 100 - silence * 300);
    let clarityScore: number;
    if (isAudio) {
        const rateScore = speechRate >= 120 && speechRate <= 170 ? 100 : Math.max(0, 100 - Math.abs(speechRate - 145) * 2);
        const volScore = volume >= -22 && volume <= -14 ? 100 : Math.max(0, 100 - Math.abs(volume + 18) * 10);
        clarityScore = (rateScore + volScore) / 2;
    } else { clarityScore = 90; }

    const totalScore = audioQuality * 0.30 + transcriptAlign * 0.25 + emotionScore * 0.20 + silenceScore * 0.10 + clarityScore * 0.15;
    const roundedScore = Math.round(totalScore * 10) / 10;

    let status: AutoScore['status'];
    // No auto-pass — all passing submissions require human review
    if (roundedScore >= 60) status = 'NEEDS_HUMAN_REVIEW';
    else status = 'FAIL_AUTOMATED';

    const autoScore: AutoScore = {
        auto_score: roundedScore,
        status,
        breakdown: {
            audio_quality: { score: Math.round(audioQuality * 10) / 10, weight: 0.30 },
            transcript_alignment: { score: Math.round(transcriptAlign * 10) / 10, weight: 0.25 },
            emotion_confidence: { score: Math.round(emotionScore * 10) / 10, weight: 0.20 },
            silence_ratio: { score: Math.round(silenceScore * 10) / 10, weight: 0.10 },
            speech_clarity: { score: Math.round(clarityScore * 10) / 10, weight: 0.15 },
        },
        computedAt: new Date().toISOString(),
    };

    // Human Review Trigger
    const reasons: string[] = [];
    if (roundedScore < 85) reasons.push(`Auto score ${roundedScore} below 85 threshold`);
    if (avgEmotionConf < 0.70) reasons.push(`Emotion confidence ${avgEmotionConf.toFixed(2)} below 0.70`);
    if (clipping > 0.005) reasons.push(`Clipping ratio ${clipping.toFixed(4)} above 0.005`);
    if (avgSegConf < 0.85) reasons.push(`Transcript confidence ${avgSegConf.toFixed(2)} below 0.85`);
    if (Math.random() < 0.10) reasons.push('Random 10% quality sampling');

    // All non-failing submissions require human review
    if (reasons.length > 0) {
        autoScore.status = 'NEEDS_HUMAN_REVIEW';
    }

    const completedAt = new Date().toISOString();

    return {
        submissionId,
        pipelineVersion: '4.6',
        startedAt,
        completedAt,
        processingTimeMs: Math.floor(Math.random() * 2000 + 800),
        steps: {
            preprocessing: {
                originalFormat: 'mp4',
                convertedFormat: 'wav',
                sampleRate: 44100,
                channels: 'mono',
                normalizedAmplitude: true,
                fileSizeBytes: Math.floor(Math.random() * 50000000) + 5000000,
                processedAt: startedAt,
            },
            qualityMetrics,
            transcription,
            emotion,
            speakerFingerprint,
            autoScore,
        },
        humanReviewRequired: reasons.length > 0,
        humanReviewReasons: reasons,
    };
}

// No seed data initialization — production mode

// ============================================
// SERVICE
// ============================================

export const qaService = {
    async getQAResult(submissionId: string): Promise<QAPipelineResult | null> {
        await delay(200);
        const results = loadQAResults();
        return results[submissionId] || null;
    },

    async getAllQAResults(): Promise<Record<string, QAPipelineResult>> {
        await delay(200);
        return loadQAResults();
    },

    async runAnalysis(submissionId: string, category: string, durationSeconds: number): Promise<QAPipelineResult> {
        await delay(1500); // Simulate longer processing
        const result = simulatePipeline(submissionId, category, durationSeconds);
        const results = loadQAResults();
        results[submissionId] = result;
        saveQAResults(results);
        return result;
    },

    async getStats(): Promise<{
        totalAnalyzed: number;
        passRate: number;
        avgScore: number;
        humanReviewRate: number;
    }> {
        await delay(200);
        const results = Object.values(loadQAResults());
        if (results.length === 0) {
            return { totalAnalyzed: 0, passRate: 0, avgScore: 0, humanReviewRate: 0 };
        }
        const scores = results.map(r => r.steps.autoScore.auto_score);
        const passCount = results.filter(r => r.steps.autoScore.status !== 'FAIL_AUTOMATED').length;
        const humanCount = results.filter(r => r.humanReviewRequired).length;
        return {
            totalAnalyzed: results.length,
            passRate: Math.round((passCount / results.length) * 100) / 100,
            avgScore: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
            humanReviewRate: Math.round((humanCount / results.length) * 100) / 100,
        };
    },
};
