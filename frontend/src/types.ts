
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
    version: string;
    datasetStatus: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';
    isLocked: boolean;
    formulatedAt?: string;
    formulatedBy?: string;
    mediaType: string;
    totalHours?: number;
    contributorCount?: number;
    assetCount?: number;
    createdAt: string;
    updatedAt: string;
}

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
