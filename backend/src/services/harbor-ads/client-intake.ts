/**
 * Harbor Ads - Client Intake Service
 * Onboard advertisers and collect brand assets
 */

import { prisma } from '../../lib/prisma.js';
import type {
    Platform
} from '../../models/ad-project.js';

export interface IntakeFormData {
    clientId: string;
    projectName: string;
    platforms: Platform[];
    goals?: any;
    targetAudience?: {
        demographics?: string[];
        interests?: string[];
        behaviors?: string[];
    };
    brandGuidelines?: {
        primaryColor?: string;
        secondaryColors?: string[];
        fontFamily?: string;
        tone?: 'professional' | 'casual' | 'playful' | 'luxury' | 'bold';
        doNots?: string[];
    };
}

export interface AssetUpload {
    type: 'logo' | 'video' | 'image' | 'font' | 'audio' | 'brandkit';
    name: string;
    url: string;
    mimeType: string;
    sizeBytes: number;
    metadata?: Record<string, any>;
}

/**
 * Client Intake Service
 */
export class ClientIntakeService {

    /**
     * Create a new ad project
     */
    async createProject(data: IntakeFormData): Promise<any> {
        try {
            const project = await prisma.adProject.create({
                data: {
                    orgId: data.clientId, // Map clientId to orgId
                    name: data.projectName,
                    platform: data.platforms[0] || 'tiktok',
                    goal: data.goals?.primary || 'brand_awareness',
                    status: 'draft'
                },
                include: {
                    runs: true
                },
            });

            console.log(`[Intake] Created project: ${project.id}`);
            return project;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    /**
     * Get project by ID
     */
    async getProject(projectId: string): Promise<any | null> {
        try {
            return await prisma.adProject.findUnique({
                where: { id: projectId },
                include: { runs: true },
            });
        } catch (error) {
            console.error('Error fetching project:', error);
            return null;
        }
    }

    /**
     * List projects for an organization
     */
    async listProjects(orgId: string): Promise<any[]> {
        try {
            return await prisma.adProject.findMany({
                where: { orgId },
                include: { runs: true },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            console.error('Error listing projects:', error);
            return [];
        }
    }

    /**
     * Create an ad generation run (Veo/Sora)
     */
    async createRun(projectId: string, promptVersion: string, model: string): Promise<any> {
        try {
            return await prisma.adGenerationRun.create({
                data: {
                    projectId,
                    promptVersion,
                    model,
                    metrics: {}
                }
            });
        } catch (error) {
            console.error('Error creating generation run:', error);
            throw error;
        }
    }

    /**
     * Update project status
     */
    async updateStatus(
        projectId: string,
        status: string
    ): Promise<any> {
        try {
            return await prisma.adProject.update({
                where: { id: projectId },
                data: { status },
                include: { runs: true },
            });
        } catch (error) {
            console.error('Error updating status:', error);
            throw error;
        }
    }
}

// Singleton instance
export const clientIntakeService = new ClientIntakeService();
