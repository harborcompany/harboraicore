import { Dataset, DatasetAsset, DatasetStatus, RAGQueryResult } from '../types';

// Mock Data Store
let datasets: Dataset[] = [
    {
        id: 'ds_1',
        name: 'Harbor-Core-Action-v1',
        description: 'High-fidelity humuan action alignment dataset.',
        media_type: 'video',
        mediaType: 'video',
        version: '1.0.0',
        license: 'Harbor-Commercial-v1',
        status: 'active',
        datasetStatus: 'active',
        isLocked: false,
        privacy: 'public',
        org_id: 'org_harbor',
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        asset_count: 14205,
        size_bytes: 45 * 1024 * 1024 * 1024, // 45 GB
        embedding_status: 'completed',
        vector_index_id: 'idx_vb829s',
        last_indexed_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'ds_2',
        name: 'Urban-Audio-Soundscape',
        description: 'City environment audio event detection.',
        media_type: 'audio',
        mediaType: 'audio',
        version: '0.9.beta',
        license: 'CC-BY-4.0',
        status: 'processing',
        datasetStatus: 'processing',
        isLocked: false,
        privacy: 'org-restricted',
        org_id: 'org_harbor',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
        asset_count: 850,
        size_bytes: 12 * 1024 * 1024 * 1024,
        embedding_status: 'embedding',
    }
];

let assets: Record<string, DatasetAsset[]> = {
    'ds_1': [
        {
            id: 'as_1',
            dataset_id: 'ds_1',
            media_uri: 's3://harbor-core/v1/vid_001.mp4',
            filename: 'action_parkour_01.mp4',
            media_type: 'video',
            file_size_bytes: 25000000,
            duration_seconds: 15,
            metadata: { resolution: '4k', fps: 60 },
            created_at: new Date().toISOString(),
            status: 'ready'
        },
        {
            id: 'as_2',
            dataset_id: 'ds_1',
            media_uri: 's3://harbor-core/v1/vid_002.mp4',
            filename: 'action_parkour_02.mp4',
            media_type: 'video',
            file_size_bytes: 32000000,
            duration_seconds: 18,
            metadata: { resolution: '4k', fps: 60 },
            created_at: new Date().toISOString(),
            status: 'ready'
        }
    ]
};

// Utilities to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDatasetService = {
    async getDatasets(orgId?: string): Promise<Dataset[]> {
        await delay(600);
        if (orgId) {
            return datasets.filter(d => d.org_id === orgId || d.privacy === 'public');
        }
        return [...datasets];
    },

    async getDatasetById(id: string): Promise<Dataset | undefined> {
        await delay(300);
        return datasets.find(d => d.id === id);
    },

    async createDataset(payload: Partial<Dataset>): Promise<Dataset> {
        await delay(1000);
        const newDataset: Dataset = {
            id: `ds_${Date.now()}`,
            name: payload.name || 'Untitled Dataset',
            description: payload.description || '',
            media_type: payload.media_type || 'multimodal',
            mediaType: payload.media_type || 'multimodal',
            version: '0.1.0',
            license: payload.license || 'Proprietary',
            status: 'draft',
            datasetStatus: 'draft',
            isLocked: false,
            privacy: 'private',
            org_id: payload.org_id || 'org_harbor',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            asset_count: 0,
            size_bytes: 0,
            embedding_status: 'none',
        };
        datasets.unshift(newDataset);
        assets[newDataset.id] = [];
        return newDataset;
    },

    async getAssets(datasetId: string): Promise<DatasetAsset[]> {
        await delay(400);
        return assets[datasetId] || [];
    },

    async ingestAsset(datasetId: string, file: File): Promise<DatasetAsset> {
        await delay(1500); // Simulate upload
        const newAsset: DatasetAsset = {
            id: `as_${Date.now()}`,
            dataset_id: datasetId,
            media_uri: `harbor://${datasetId}/${file.name}`,
            filename: file.name,
            media_type: file.type.startsWith('audio') ? 'audio' : 'video',
            file_size_bytes: file.size,
            metadata: { original_name: file.name },
            created_at: new Date().toISOString(),
            status: 'processing',
        };

        if (!assets[datasetId]) assets[datasetId] = [];
        assets[datasetId].unshift(newAsset);

        // Update dataset stats
        const dsIndex = datasets.findIndex(d => d.id === datasetId);
        if (dsIndex >= 0) {
            datasets[dsIndex].asset_count++;
            datasets[dsIndex].size_bytes += file.size;
            datasets[dsIndex].updated_at = new Date().toISOString();
        }

        // Simulate processing completion after a bit
        setTimeout(() => {
            newAsset.status = 'ready';
        }, 5000);

        return newAsset;
    },

    async triggerEmbedding(datasetId: string): Promise<void> {
        await delay(500);
        const ds = datasets.find(d => d.id === datasetId);
        if (!ds) throw new Error('Dataset not found');

        ds.embedding_status = 'queued';

        // Simulate pipeline
        setTimeout(() => { ds.embedding_status = 'embedding'; }, 2000);
        setTimeout(() => {
            ds.embedding_status = 'completed';
            ds.vector_index_id = `idx_${Math.random().toString(36).substr(2, 6)}`;
            ds.last_indexed_at = new Date().toISOString();
        }, 10000);
    },

    async queryDataset(datasetId: string, query: string): Promise<RAGQueryResult[]> {
        await delay(1200); // Simulate RAG latency
        // Return fake results based on existing assets if possible, or generic ones
        return [
            {
                asset_id: 'as_1',
                dataset_id: datasetId,
                score: 0.92,
                snippet_time_start: 3.5,
                snippet_time_end: 8.2,
                preview_uri: '/assets/preview_1.jpg'
            },
            {
                asset_id: 'as_2',
                dataset_id: datasetId,
                score: 0.88,
                snippet_time_start: 12.0,
                snippet_time_end: 15.5,
                preview_uri: '/assets/preview_2.jpg'
            }
        ];
    }
};
