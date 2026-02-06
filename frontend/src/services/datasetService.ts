import { Dataset, DatasetAsset, RAGQueryResult } from '../types';

const API_BASE_URL = '/api'; // Assumes proxy in vite.config.ts

export const datasetService = {
    async getDatasets(filters?: Record<string, any>): Promise<Dataset[]> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
        }

        const response = await fetch(`${API_BASE_URL}/datasets?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch datasets: ${response.statusText}`);
        }
        return response.json();
    },

    async getDatasetById(id: string): Promise<Dataset> {
        const response = await fetch(`${API_BASE_URL}/datasets/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch dataset ${id}`);
        }
        return response.json();
    },

    async createDataset(payload: Partial<Dataset>): Promise<Dataset> {
        const response = await fetch(`${API_BASE_URL}/datasets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to create dataset');
        return response.json();
    },

    async getAssets(datasetId: string): Promise<DatasetAsset[]> {
        const response = await fetch(`${API_BASE_URL}/datasets/${datasetId}/assets`);
        if (!response.ok) throw new Error('Failed to fetch assets');
        return response.json();
    },

    // RAG specific
    async queryDataset(datasetId: string, query: string): Promise<RAGQueryResult[]> {
        const response = await fetch(`${API_BASE_URL}/rag/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ datasetId, query })
        });
        if (!response.ok) throw new Error('RAG query failed');
        return response.json();
    }
};
