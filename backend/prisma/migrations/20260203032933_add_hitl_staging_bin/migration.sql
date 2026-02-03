-- CreateEnum
CREATE TYPE "DatasetType" AS ENUM ('LEGO_VIDEO', 'AUDIO_SPEECH', 'MULTIMODAL', 'OTHER');

-- CreateEnum
CREATE TYPE "RecordingEnvironment" AS ENUM ('QUIET', 'MODERATE', 'NOISY');

-- CreateEnum
CREATE TYPE "PreprocessingType" AS ENUM ('VIDEO_TRANSCODE', 'VIDEO_FRAME_EXTRACT', 'AUDIO_EXTRACT', 'AUDIO_NORMALIZE', 'METADATA_EXTRACT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "HandType" AS ENUM ('LEFT', 'RIGHT');

-- CreateEnum
CREATE TYPE "ActionLabel" AS ENUM ('SEARCH', 'ALIGN', 'ATTACH', 'DETACH', 'ROTATE', 'ADJUST', 'PAUSE', 'INSPECT', 'OTHER');

-- CreateEnum
CREATE TYPE "FailureType" AS ENUM ('MISALIGNMENT', 'WRONG_PIECE', 'DROP', 'COLLISION', 'STUCK', 'OTHER');

-- CreateEnum
CREATE TYPE "NoiseLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateEnum
CREATE TYPE "PipelineType" AS ENUM ('VIDEO_FULL', 'AUDIO_FULL', 'VIDEO_AUDIO_FULL', 'VIDEO_OBJECTS_ONLY', 'VIDEO_ACTIONS_ONLY', 'AUDIO_ASR_ONLY');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('NOVICE', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "ExtendedFailureType" AS ENUM ('MISALIGNMENT', 'WRONG_PIECE', 'FORCE_ERROR', 'SEQUENCE_ERROR', 'DROP', 'COLLISION', 'STUCK', 'OTHER');

-- CreateEnum
CREATE TYPE "FailureSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "StagingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'IN_ANNOTATION', 'PENDING_REVIEW', 'COMPLETED');

-- CreateTable
CREATE TABLE "UploadMetadata" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "datasetType" "DatasetType" NOT NULL,
    "deviceModel" TEXT NOT NULL,
    "recordingEnvironment" "RecordingEnvironment" NOT NULL,
    "consentSigned" BOOLEAN NOT NULL DEFAULT true,
    "rightsGranted" BOOLEAN NOT NULL DEFAULT true,
    "country" CHAR(2) NOT NULL,
    "uploadTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalFilename" TEXT NOT NULL,
    "originalSizeBytes" BIGINT NOT NULL,
    "originalHash" TEXT NOT NULL,
    "ipRegion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreprocessingJob" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "jobType" "PreprocessingType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "inputPath" TEXT NOT NULL,
    "outputPath" TEXT,
    "metrics" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreprocessingJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandPoseDetection" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "frameId" INTEGER NOT NULL,
    "timestampMs" DOUBLE PRECISION NOT NULL,
    "handId" "HandType" NOT NULL,
    "keypoints" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "modelName" TEXT NOT NULL DEFAULT 'mediapipe_hands',
    "modelVersion" TEXT NOT NULL DEFAULT '0.10.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HandPoseDetection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectDetection" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "frameId" INTEGER NOT NULL,
    "timestampMs" DOUBLE PRECISION NOT NULL,
    "objectType" TEXT NOT NULL,
    "bbox" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "category" TEXT,
    "orientation" JSONB,
    "pieceId" TEXT,
    "modelName" TEXT NOT NULL DEFAULT 'yolov8',
    "modelVersion" TEXT NOT NULL DEFAULT '8.0.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObjectDetection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporalAction" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "startMs" DOUBLE PRECISION NOT NULL,
    "endMs" DOUBLE PRECISION NOT NULL,
    "action" "ActionLabel" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "modelName" TEXT NOT NULL DEFAULT 'timesformer',
    "modelVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "humanReviewed" BOOLEAN NOT NULL DEFAULT false,
    "humanLabel" "ActionLabel",
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemporalAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FailureRecoveryEvent" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "timestampMs" DOUBLE PRECISION NOT NULL,
    "failureType" "FailureType" NOT NULL,
    "recoveryAction" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "detectionMethod" TEXT NOT NULL DEFAULT 'hybrid',
    "modelName" TEXT,
    "modelVersion" TEXT,
    "humanVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FailureRecoveryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SceneSegment" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "startMs" DOUBLE PRECISION NOT NULL,
    "endMs" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "sceneType" TEXT,
    "modelName" TEXT NOT NULL DEFAULT 'pyscenedetect',
    "modelVersion" TEXT NOT NULL DEFAULT '0.6.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SceneSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeechSegment" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "startMs" DOUBLE PRECISION NOT NULL,
    "endMs" DOUBLE PRECISION NOT NULL,
    "isSpeech" BOOLEAN NOT NULL DEFAULT true,
    "speakerId" TEXT,
    "modelName" TEXT NOT NULL DEFAULT 'pyannote_vad',
    "modelVersion" TEXT NOT NULL DEFAULT '3.0.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpeechSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptSegment" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "startMs" DOUBLE PRECISION NOT NULL,
    "endMs" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "wordTimings" JSONB,
    "language" TEXT NOT NULL DEFAULT 'en',
    "accent" TEXT,
    "accentConfidence" DOUBLE PRECISION,
    "modelName" TEXT NOT NULL DEFAULT 'whisper',
    "modelVersion" TEXT NOT NULL DEFAULT 'large-v3',
    "humanCorrected" BOOLEAN NOT NULL DEFAULT false,
    "correctedText" TEXT,
    "correctedBy" TEXT,
    "correctedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranscriptSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioQualityMetrics" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "snrDb" DOUBLE PRECISION NOT NULL,
    "noiseLevel" "NoiseLevel" NOT NULL,
    "clipping" BOOLEAN NOT NULL DEFAULT false,
    "peakDb" DOUBLE PRECISION,
    "avgDb" DOUBLE PRECISION,
    "dynamicRange" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioQualityMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompositeQualityScore" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "clarityScore" DOUBLE PRECISION NOT NULL,
    "annotationConfidence" DOUBLE PRECISION NOT NULL,
    "stabilityScore" DOUBLE PRECISION NOT NULL,
    "complianceScore" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "isPremiumQuality" BOOLEAN NOT NULL DEFAULT false,
    "excludedFromDatasets" BOOLEAN NOT NULL DEFAULT false,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelVersions" JSONB,

    CONSTRAINT "CompositeQualityScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetManifest" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "contributorCount" INTEGER NOT NULL,
    "assetCount" INTEGER NOT NULL,
    "annotationTypes" TEXT[],
    "modalities" TEXT[],
    "manifestJson" JSONB NOT NULL,
    "changeType" TEXT,
    "previousVersion" TEXT,
    "changelog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DatasetManifest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProvenanceRecord" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "originalHash" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "originalSizeBytes" BIGINT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "agreementId" TEXT,
    "uploadTimestamp" TIMESTAMP(3) NOT NULL,
    "ipRegion" TEXT,
    "deviceFingerprint" TEXT,
    "annotationModels" JSONB NOT NULL,
    "annotationRuns" JSONB,
    "accessLog" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProvenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnotationPipelineJob" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "pipelineType" "PipelineType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "currentStage" TEXT,
    "stagesCompleted" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "annotationCounts" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnnotationPipelineJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetCommercialMetadata" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "intendedUse" TEXT[],
    "notSuitableFor" TEXT[],
    "trainingReadinessScore" DOUBLE PRECISION NOT NULL,
    "estimatedModelGain" TEXT,
    "knownBiases" TEXT[],
    "containsFailureRecovery" BOOLEAN NOT NULL DEFAULT false,
    "longHorizonSequences" BOOLEAN NOT NULL DEFAULT false,
    "humanSkillVariance" BOOLEAN NOT NULL DEFAULT false,
    "rightsCleared" BOOLEAN NOT NULL DEFAULT true,
    "multiViewCapture" BOOLEAN NOT NULL DEFAULT false,
    "temporalConsistency" BOOLEAN NOT NULL DEFAULT true,
    "trainSplit" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "validationSplit" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "testSplit" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "splitMethod" TEXT NOT NULL DEFAULT 'by_contributor',
    "canAddContributors" BOOLEAN NOT NULL DEFAULT true,
    "canAddObjectIdentity" BOOLEAN NOT NULL DEFAULT true,
    "canAddMultiView" BOOLEAN NOT NULL DEFAULT false,
    "canAddLongerSessions" BOOLEAN NOT NULL DEFAULT true,
    "oneLiner" TEXT,
    "bestFor" TEXT[],
    "notFor" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatasetCommercialMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributorSkillProfile" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "estimatedSkillLevel" "SkillLevel" NOT NULL,
    "inferenceMethod" TEXT NOT NULL DEFAULT 'action_speed_variance_plus_error_rate',
    "confidence" DOUBLE PRECISION NOT NULL,
    "avgActionDuration" DOUBLE PRECISION,
    "errorRate" DOUBLE PRECISION,
    "recoveryEfficiency" DOUBLE PRECISION,
    "skillProgression" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributorSkillProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionNormalization" (
    "id" TEXT NOT NULL,
    "canonicalAction" TEXT NOT NULL,
    "rawVariants" TEXT[],
    "mappingConfidence" DOUBLE PRECISION NOT NULL,
    "datasetScope" TEXT,
    "occurrenceCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionNormalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskComplexityMetrics" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "totalSteps" INTEGER NOT NULL,
    "branchingFactor" INTEGER NOT NULL,
    "avgStepDurationMs" DOUBLE PRECISION NOT NULL,
    "complexityScore" DOUBLE PRECISION NOT NULL,
    "longestSequence" INTEGER,
    "failureRecoveryCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskComplexityMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtendedFailureEvent" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "timestampMs" DOUBLE PRECISION NOT NULL,
    "failureType" "ExtendedFailureType" NOT NULL,
    "severity" "FailureSeverity" NOT NULL,
    "humanCorrectionTimeMs" DOUBLE PRECISION,
    "precedingAction" TEXT,
    "recoveryAction" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "modelName" TEXT,
    "modelVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExtendedFailureEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinguisticFeatures" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "speechRateWpm" DOUBLE PRECISION NOT NULL,
    "prosodyVariance" DOUBLE PRECISION NOT NULL,
    "pronunciationEntropy" DOUBLE PRECISION NOT NULL,
    "avgPauseDurationMs" DOUBLE PRECISION,
    "fillerWordRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinguisticFeatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScriptAlignment" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "expectedTextId" TEXT NOT NULL,
    "deviations" INTEGER NOT NULL,
    "alignmentScore" DOUBLE PRECISION NOT NULL,
    "deviationDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScriptAlignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetAutoSummary" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "oneLiner" TEXT NOT NULL,
    "bestFor" TEXT[],
    "notFor" TEXT[],
    "totalHours" DOUBLE PRECISION NOT NULL,
    "totalContributors" INTEGER NOT NULL,
    "totalAssets" INTEGER NOT NULL,
    "avgQualityScore" DOUBLE PRECISION,
    "failureRecoveryHours" DOUBLE PRECISION,
    "skillVarianceRange" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generationModel" TEXT,

    CONSTRAINT "DatasetAutoSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StagingBinEntry" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "status" "StagingStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerId" TEXT,
    "reviewNotes" TEXT,
    "qualityScore" DOUBLE PRECISION,
    "rejectionReason" TEXT,
    "annotationJobId" TEXT,
    "labSchemaOutput" JSONB,
    "pdfModuleUrl" TEXT,
    "pdfGeneratedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "StagingBinEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UploadMetadata_mediaAssetId_key" ON "UploadMetadata"("mediaAssetId");

-- CreateIndex
CREATE INDEX "UploadMetadata_uploaderId_idx" ON "UploadMetadata"("uploaderId");

-- CreateIndex
CREATE INDEX "UploadMetadata_datasetType_idx" ON "UploadMetadata"("datasetType");

-- CreateIndex
CREATE INDEX "PreprocessingJob_status_idx" ON "PreprocessingJob"("status");

-- CreateIndex
CREATE INDEX "PreprocessingJob_mediaAssetId_idx" ON "PreprocessingJob"("mediaAssetId");

-- CreateIndex
CREATE INDEX "HandPoseDetection_mediaAssetId_idx" ON "HandPoseDetection"("mediaAssetId");

-- CreateIndex
CREATE INDEX "HandPoseDetection_frameId_idx" ON "HandPoseDetection"("frameId");

-- CreateIndex
CREATE INDEX "ObjectDetection_mediaAssetId_idx" ON "ObjectDetection"("mediaAssetId");

-- CreateIndex
CREATE INDEX "ObjectDetection_frameId_idx" ON "ObjectDetection"("frameId");

-- CreateIndex
CREATE INDEX "ObjectDetection_objectType_idx" ON "ObjectDetection"("objectType");

-- CreateIndex
CREATE INDEX "TemporalAction_mediaAssetId_idx" ON "TemporalAction"("mediaAssetId");

-- CreateIndex
CREATE INDEX "TemporalAction_action_idx" ON "TemporalAction"("action");

-- CreateIndex
CREATE INDEX "FailureRecoveryEvent_mediaAssetId_idx" ON "FailureRecoveryEvent"("mediaAssetId");

-- CreateIndex
CREATE INDEX "FailureRecoveryEvent_failureType_idx" ON "FailureRecoveryEvent"("failureType");

-- CreateIndex
CREATE INDEX "SceneSegment_mediaAssetId_idx" ON "SceneSegment"("mediaAssetId");

-- CreateIndex
CREATE INDEX "SpeechSegment_mediaAssetId_idx" ON "SpeechSegment"("mediaAssetId");

-- CreateIndex
CREATE INDEX "SpeechSegment_speakerId_idx" ON "SpeechSegment"("speakerId");

-- CreateIndex
CREATE INDEX "TranscriptSegment_mediaAssetId_idx" ON "TranscriptSegment"("mediaAssetId");

-- CreateIndex
CREATE INDEX "TranscriptSegment_language_idx" ON "TranscriptSegment"("language");

-- CreateIndex
CREATE UNIQUE INDEX "AudioQualityMetrics_mediaAssetId_key" ON "AudioQualityMetrics"("mediaAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "CompositeQualityScore_mediaAssetId_key" ON "CompositeQualityScore"("mediaAssetId");

-- CreateIndex
CREATE INDEX "DatasetManifest_datasetId_idx" ON "DatasetManifest"("datasetId");

-- CreateIndex
CREATE UNIQUE INDEX "DatasetManifest_datasetId_version_key" ON "DatasetManifest"("datasetId", "version");

-- CreateIndex
CREATE INDEX "ProvenanceRecord_mediaAssetId_idx" ON "ProvenanceRecord"("mediaAssetId");

-- CreateIndex
CREATE INDEX "ProvenanceRecord_contributorId_idx" ON "ProvenanceRecord"("contributorId");

-- CreateIndex
CREATE INDEX "AnnotationPipelineJob_status_idx" ON "AnnotationPipelineJob"("status");

-- CreateIndex
CREATE INDEX "AnnotationPipelineJob_mediaAssetId_idx" ON "AnnotationPipelineJob"("mediaAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "DatasetCommercialMetadata_datasetId_key" ON "DatasetCommercialMetadata"("datasetId");

-- CreateIndex
CREATE UNIQUE INDEX "ContributorSkillProfile_sessionId_key" ON "ContributorSkillProfile"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionNormalization_canonicalAction_datasetScope_key" ON "ActionNormalization"("canonicalAction", "datasetScope");

-- CreateIndex
CREATE UNIQUE INDEX "TaskComplexityMetrics_mediaAssetId_key" ON "TaskComplexityMetrics"("mediaAssetId");

-- CreateIndex
CREATE INDEX "ExtendedFailureEvent_mediaAssetId_idx" ON "ExtendedFailureEvent"("mediaAssetId");

-- CreateIndex
CREATE INDEX "ExtendedFailureEvent_failureType_idx" ON "ExtendedFailureEvent"("failureType");

-- CreateIndex
CREATE UNIQUE INDEX "LinguisticFeatures_mediaAssetId_key" ON "LinguisticFeatures"("mediaAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "ScriptAlignment_mediaAssetId_key" ON "ScriptAlignment"("mediaAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "DatasetAutoSummary_datasetId_key" ON "DatasetAutoSummary"("datasetId");

-- CreateIndex
CREATE UNIQUE INDEX "StagingBinEntry_mediaAssetId_key" ON "StagingBinEntry"("mediaAssetId");

-- CreateIndex
CREATE INDEX "StagingBinEntry_status_idx" ON "StagingBinEntry"("status");

-- CreateIndex
CREATE INDEX "StagingBinEntry_reviewerId_idx" ON "StagingBinEntry"("reviewerId");

-- AddForeignKey
ALTER TABLE "UploadMetadata" ADD CONSTRAINT "UploadMetadata_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreprocessingJob" ADD CONSTRAINT "PreprocessingJob_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandPoseDetection" ADD CONSTRAINT "HandPoseDetection_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectDetection" ADD CONSTRAINT "ObjectDetection_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporalAction" ADD CONSTRAINT "TemporalAction_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FailureRecoveryEvent" ADD CONSTRAINT "FailureRecoveryEvent_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneSegment" ADD CONSTRAINT "SceneSegment_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeechSegment" ADD CONSTRAINT "SpeechSegment_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptSegment" ADD CONSTRAINT "TranscriptSegment_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioQualityMetrics" ADD CONSTRAINT "AudioQualityMetrics_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompositeQualityScore" ADD CONSTRAINT "CompositeQualityScore_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetManifest" ADD CONSTRAINT "DatasetManifest_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvenanceRecord" ADD CONSTRAINT "ProvenanceRecord_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnotationPipelineJob" ADD CONSTRAINT "AnnotationPipelineJob_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetCommercialMetadata" ADD CONSTRAINT "DatasetCommercialMetadata_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributorSkillProfile" ADD CONSTRAINT "ContributorSkillProfile_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CaptureSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComplexityMetrics" ADD CONSTRAINT "TaskComplexityMetrics_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtendedFailureEvent" ADD CONSTRAINT "ExtendedFailureEvent_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinguisticFeatures" ADD CONSTRAINT "LinguisticFeatures_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptAlignment" ADD CONSTRAINT "ScriptAlignment_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetAutoSummary" ADD CONSTRAINT "DatasetAutoSummary_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StagingBinEntry" ADD CONSTRAINT "StagingBinEntry_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
