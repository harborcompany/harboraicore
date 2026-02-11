
import { Submission, Creator, MediaAsset } from '../types';

// Mock API Client for Admin Actions

export const AdminAPI = {
    async getSubmission(id: string): Promise<Submission> {
        // Mock response
        return {
            id,
            contributorId: 'creator_123',
            filePath: '/videos/demo.mp4',
            uploadStatus: 'UPLOADED',
            createdAt: new Date().toISOString(),
            contributor: {
                id: 'creator_123',
                userId: 'user_456',
                email: 'alex@example.com',
                status: 'APPROVED',
                videosThisMonth: 1,
                reliabilityScore: 0.85
            }
        };
    },

    async submitReview(submissionId: string, verdict: 'APPROVED' | 'PARTIAL' | 'REJECTED', reason: string, note: string): Promise<void> {
        console.log(`Submitting review for ${submissionId}: ${verdict} - ${reason}`);
        // In real impl: await axios.post(`/api/admin/submission/${submissionId}/review`, { verdict, reason, note });
        return new Promise(resolve => setTimeout(resolve, 500));
    },

    async getSystemMetrics(): Promise<any> {
        return {
            videosSubmitted: 12,
            videosApproved: 8,
            totalFootage: '48h',
            activeLicenses: 3
        };
    }
};
