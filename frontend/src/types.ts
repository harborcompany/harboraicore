export interface Dataset {
    id: string;
    name: string;
    description?: string;
    media_type: 'video' | 'audio' | 'image' | 'text';
    size_bytes: number;
    version: string;
    vertical?: string;
    licenseType?: string;
    status: 'active' | 'processing' | 'draft' | 'archived';
    embedding_status?: 'completed' | 'embedding' | 'failed' | 'pending';
    is_anchor?: boolean;
    created_at: string;
    updated_at: string;
    owner_id: string;
}

export interface DatasetAsset {
    id: string;
    dataset_id: string;
    url: string;
    filename: string;
    size_bytes: number;
    mime_type: string;
    created_at: string;
}

export interface RAGQueryResult {
    asset_id: string;
    score: number;
    content: string;
    metadata?: Record<string, any>;
}

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'contributor' | 'user';
    intent?: 'ai_ml' | 'ads' | 'contributor';
    onboarding_complete: boolean;
}
