export type MediaType = 'audio' | 'video' | 'image' | 'text' | 'multimodal';
export type DatasetStatus = 'draft' | 'processing' | 'active' | 'archived';

export interface GovernanceProfile {
    id: string;
    consentSource?: string;
    usageRights?: string;
    geoRestrictions?: string[]; // or JSON in backend, typcasted here
    retentionPolicy?: string;
    complianceTags?: string[];
}

export interface QualityProfile {
    id: string;
    annotationConfidenceAvg?: number;
    interAnnotatorAgreement?: number;
    benchmarkTasks?: string[]; // or JSON
    errorRate?: number;
}

export interface Dataset {
    id: string;
    name: string;
    description?: string;
    media_type: string; // Kept for compat, but backend has modalities
    version: string;
    license: string;
    status: DatasetStatus;
    privacy: 'public' | 'private' | 'org-restricted';
    created_at: string;
    updated_at: string;

    // Lab-Ready Data Platform Extensions
    vertical?: 'AUTONOMOUS_DRIVING' | 'MEDICAL_IMAGING' | 'ROBOTICS' | 'SECURITY' | 'RETAIL' | 'OTHER';
    modalities?: string[];
    license_type?: 'COMMERCIAL' | 'ACADEMIC' | 'OPEN_SOURCE';
    pricing_model?: 'USAGE' | 'SUBSCRIPTION' | 'ONE_TIME';
    is_anchor?: boolean;
    intended_use_cases?: string[];
    model_readiness_score?: number;

    // Links
    governance_profile_id?: string;
    quality_profile_id?: string;
    governanceProfile?: GovernanceProfile;
    qualityProfile?: QualityProfile;

    // Stats
    asset_count: number;
    size_bytes: number;
    total_hours?: number;

    // RAG State
    embedding_status: 'none' | 'queued' | 'embedding' | 'completed' | 'failed';
    vector_index_id?: string;
    last_indexed_at?: string;
}

export interface DatasetAsset {
    id: string;
    dataset_id: string;
    media_uri: string; // Internal storage URI
    preview_uri?: string; // For UI display
    filename: string;
    media_type: MediaType;
    duration_seconds?: number;
    file_size_bytes: number;

    // Metadata
    metadata: Record<string, any>;
    annotations_uri?: string;

    created_at: string;
    status: 'uploading' | 'processing' | 'ready' | 'error';
}

export interface RAGQueryResult {
    asset_id: string;
    dataset_id: string;
    score: number;
    snippet_time_start?: number;
    snippet_time_end?: number;
    text_content?: string; // For multimodal/text results
    preview_uri?: string;
}

export interface DatasetRevenueLedger {
    id: string;
    dataset_id: string;
    transaction_date: string;
    transaction_type: 'purchase' | 'usage' | 'subscription_fee';
    amount_usd: number;
    buyer_name?: string; // or org
    status: 'pending' | 'cleared' | 'failed';
}
