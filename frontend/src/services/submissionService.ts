import { DatasetAsset } from '../types';

export interface Submission {
    id: string;
    filename: string;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected';
    submittedAt: string;
    payoutAmount: number | null;
    datasetId?: string;
}

// Mock Submission Store (persisted in localStorage)
const STORAGE_KEY = 'harbor_submissions';

const loadSubmissions = (): Submission[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

const saveSubmissions = (subs: Submission[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
};

let submissions: Submission[] = loadSubmissions();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const submissionService = {
    async getSubmissions(): Promise<Submission[]> {
        await delay(500);
        return [...submissions];
    },

    async createSubmission(file: File, datasetAsset?: DatasetAsset): Promise<Submission> {
        await delay(800);
        const newSubmission: Submission = {
            id: `sub_${Date.now()}`,
            filename: file.name,
            status: 'pending', // Default to pending
            submittedAt: new Date().toISOString(),
            payoutAmount: null,
            datasetId: datasetAsset?.dataset_id
        };
        submissions.unshift(newSubmission);
        saveSubmissions(submissions);

        // Simulate background processing -> approval after 10 seconds
        setTimeout(() => {
            const index = submissions.findIndex(s => s.id === newSubmission.id);
            if (index !== -1) {
                submissions[index].status = 'approved';
                submissions[index].payoutAmount = Number((Math.random() * 50 + 10).toFixed(2));
                saveSubmissions(submissions);
            }
        }, 10000);

        return newSubmission;
    },

    async getRecentActivity(): Promise<Submission[]> {
        await delay(300);
        return submissions.slice(0, 5);
    }
};
