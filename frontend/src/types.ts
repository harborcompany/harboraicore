
export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'CONTRIBUTOR' | 'VIEWER' | 'EDITOR';
    name?: string;
    avatarUrl?: string;
}

export interface Dataset {
    id: string;
    name: string;
    description?: string;
    version: string;
    datasetStatus: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED' | 'active' | 'processing' | 'draft';
    status?: string;
    isLocked: boolean;
    formulatedAt?: string;
    formulatedBy?: string;
    mediaType: string;
    media_type?: 'video' | 'audio' | 'multimodal';
    totalHours?: number;
    contributorCount?: number;
    assetCount?: number;
    asset_count?: number;
    size_bytes?: number;
    privacy?: 'public' | 'private' | 'org-restricted';
    license?: string;
    org_id?: string;
    embedding_status?: 'none' | 'queued' | 'embedding' | 'completed';
    vector_index_id?: string;
    last_indexed_at?: string;
    createdAt: string;
    updatedAt: string;
    created_at?: string;
    updated_at?: string;
}

export interface RAGQueryResult {
    asset_id: string;
    dataset_id: string;
    score: number;
    snippet_time_start: number;
    snippet_time_end: number;
    preview_uri: string;
}

export type DatasetStatus = Dataset['datasetStatus'];

export interface MediaAsset {
    id: string;
    filename: string;
    status: 'UPLOADED' | 'PROCESSING' | 'ANNOTATED' | 'REVIEWED' | 'READY' | 'ERROR';
    duration?: number;
    resolution?: string;
    createdAt: string;
    autoQCScore?: number;
    reviewNotes?: string;
    reviewedBy?: string;
    reviewedAt?: string;
}

export interface Creator {
    id: string;
    userId: string;
    email: string;
    status: 'APPLIED' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    videosThisMonth: number;
    lastUploadDate?: string;
    reliabilityScore: number;
    user?: User;
}

export interface Submission {
    id: string;
    contributorId: string;
    datasetId?: string;
    filePath: string;
    uploadStatus: 'UPLOADED' | 'PROCESSING' | 'ANNOTATED' | 'REVIEWED';
    createdAt: string;
    contributor?: Creator;
}

export interface License {
    id: string;
    datasetId: string;
    licenseeName: string;
    type: 'PILOT' | 'COMMERCIAL' | 'RESEARCH' | 'HYBRID';
    status: string;
    issuedAt: string;
    expiresAt?: string;
}

export interface SystemLog {
    id: string;
    action: string;
    actorId: string;
    targetId?: string;
    targetType: string;
    details?: any;
    timestamp: string;
}

export interface Payout {
    id: string;
    contributorId: string;
    amountUsd: number;
    status: 'PENDING' | 'SCHEDULED' | 'PAID';
    platformFee: number;
    netAmount: number;
    paidAt?: string;
    createdAt: string;
}
export interface DatasetAsset {
    id: string;
    dataset_id: string;
    media_uri: string;
    filename: string;
    media_type: 'video' | 'audio' | 'image' | 'text';
    file_size_bytes: number;
    metadata: Record<string, any>;
    status: 'processing' | 'ready' | 'error';
    created_at: string;
    duration_seconds?: number;
}
export interface ExperimentConfig {
    model: {
        name: string;
    };
    orchestrator: {
        batch_size: number;
        rollouts_per_example: number;
        sampling: {
            max_tokens: number;
        };
        env: Array<{
            id: string;
            name: string;
            args?: Record<string, any>;
        }>;
    };
    trainer: Record<string, any>;
    wandb?: {
        project: string;
        name: string;
    };
}

export interface TrainingLog {
    step: number;
    timestamp: string;
    metrics: {
        loss?: number;
        reward?: number;
        kl_divergence?: number;
        entropy?: number;
        [key: string]: number | undefined;
    };
    message?: string;
}

export interface Experiment {
    id: string;
    name: string;
    status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    config: ExperimentConfig;
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    logs: TrainingLog[];
    currentStep: number;
    totalSteps: number;
    hardware: {
        gpu_type: string;
        gpu_count: number;
    };
}

export interface LabStats {
    activeExperiments: number;
    queuedExperiments: number;
    totalGpuHours: number;
    availableNodes: number;
}
