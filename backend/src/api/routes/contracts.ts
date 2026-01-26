/**
 * Contracts API Routes
 * Contract template management and auto-generation
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireScope, type AuthenticatedRequest } from '../middleware/auth.js';

export const contractsRouter = Router();

/**
 * List all contract templates
 * GET /api/contracts/templates
 */
contractsRouter.get('/templates', requireScope('contracts:read'), async (req: Request, res: Response) => {
    const { type, isActive = 'true' } = req.query;

    try {
        const where: any = {
            isActive: isActive === 'true',
        };
        if (type) where.type = String(type);

        const templates = await prisma.contractTemplate.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { contracts: true },
                },
            },
        });

        res.json({
            data: templates,
            total: templates.length,
        });
    } catch (error) {
        console.error('Error fetching contract templates:', error);
        res.status(500).json({ error: 'Failed to fetch contract templates' });
    }
});

/**
 * Get a specific contract template
 * GET /api/contracts/templates/:templateId
 */
contractsRouter.get('/templates/:templateId', requireScope('contracts:read'), async (req: Request, res: Response) => {
    const { templateId } = req.params;

    try {
        const template = await prisma.contractTemplate.findUnique({
            where: { id: templateId },
        });

        if (!template) {
            res.status(404).json({ error: 'Contract template not found' });
            return;
        }

        res.json({ data: template });
    } catch (error) {
        console.error('Error fetching contract template:', error);
        res.status(500).json({ error: 'Failed to fetch contract template' });
    }
});

/**
 * Create a contract template (admin)
 * POST /api/contracts/templates
 */
contractsRouter.post('/templates', requireScope('contracts:admin'), async (req: Request, res: Response) => {
    const { type, name, description, content, variables, version } = req.body;

    if (!type || !name || !content) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'type, name, and content are required',
        });
        return;
    }

    try {
        const template = await prisma.contractTemplate.create({
            data: {
                type,
                name,
                description: description || null,
                content,
                variables: variables || [],
                version: version || '1.0',
                isActive: true,
            },
        });

        res.status(201).json({
            data: template,
            message: 'Contract template created successfully',
        });
    } catch (error) {
        console.error('Error creating contract template:', error);
        res.status(500).json({ error: 'Failed to create contract template' });
    }
});

/**
 * Generate a contract from template + dataset/org
 * POST /api/contracts/generate
 */
contractsRouter.post('/generate', requireScope('contracts:write'), async (req: AuthenticatedRequest, res: Response) => {
    const { templateId, orgId, datasetId, variables = {} } = req.body;

    if (!templateId) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'templateId is required',
        });
        return;
    }

    try {
        // Fetch template
        const template = await prisma.contractTemplate.findUnique({
            where: { id: templateId },
        });

        if (!template) {
            res.status(404).json({ error: 'Contract template not found' });
            return;
        }

        // Auto-populate variables from dataset/org if provided
        const populatedVariables: Record<string, any> = { ...variables };

        if (datasetId) {
            const dataset = await prisma.dataset.findUnique({
                where: { id: datasetId },
                include: {
                    governanceProfile: true,
                    qualityProfile: true,
                },
            });
            if (dataset) {
                populatedVariables.dataset_id = dataset.id;
                populatedVariables.dataset_name = dataset.name;
                populatedVariables.dataset_version = dataset.version;
                populatedVariables.license_type = dataset.licenseType;
                populatedVariables.pricing_model = dataset.pricingModel;
                if (dataset.governanceProfile) {
                    populatedVariables.data_retention_policy = dataset.governanceProfile.dataRetentionPolicy;
                    populatedVariables.compliance_tags = dataset.governanceProfile.complianceTags.join(', ');
                    populatedVariables.usage_rights = dataset.governanceProfile.usageRights.join(', ');
                }
            }
        }

        if (orgId) {
            const org = await prisma.organization.findUnique({
                where: { id: orgId },
            });
            if (org) {
                populatedVariables.org_id = org.id;
                populatedVariables.org_name = org.name;
                populatedVariables.org_industry = org.industry;
            }
        }

        // Interpolate variables into content
        let renderedContent = template.content;
        for (const [key, value] of Object.entries(populatedVariables)) {
            const placeholder = `{{${key}}}`;
            renderedContent = renderedContent.split(placeholder).join(String(value || ''));
        }

        // Calculate expiration (default 90 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 90);

        const contract = await prisma.generatedContract.create({
            data: {
                templateId,
                orgId: orgId || null,
                datasetId: datasetId || null,
                variables: populatedVariables,
                content: renderedContent,
                status: 'draft',
                expiresAt,
            },
        });

        res.status(201).json({
            data: contract,
            message: 'Contract generated successfully',
        });
    } catch (error) {
        console.error('Error generating contract:', error);
        res.status(500).json({ error: 'Failed to generate contract' });
    }
});

/**
 * Get a generated contract
 * GET /api/contracts/:contractId
 */
contractsRouter.get('/:contractId', requireScope('contracts:read'), async (req: Request, res: Response) => {
    const { contractId } = req.params;

    try {
        const contract = await prisma.generatedContract.findUnique({
            where: { id: contractId },
            include: {
                template: true,
            },
        });

        if (!contract) {
            res.status(404).json({ error: 'Contract not found' });
            return;
        }

        res.json({ data: contract });
    } catch (error) {
        console.error('Error fetching contract:', error);
        res.status(500).json({ error: 'Failed to fetch contract' });
    }
});

/**
 * List generated contracts (with filters)
 * GET /api/contracts
 */
contractsRouter.get('/', requireScope('contracts:read'), async (req: Request, res: Response) => {
    const { orgId, datasetId, status, limit = '50', offset = '0' } = req.query;

    try {
        const where: any = {};
        if (orgId) where.orgId = String(orgId);
        if (datasetId) where.datasetId = String(datasetId);
        if (status) where.status = String(status);

        const [contracts, total] = await Promise.all([
            prisma.generatedContract.findMany({
                where,
                take: Number(limit),
                skip: Number(offset),
                orderBy: { createdAt: 'desc' },
                include: {
                    template: {
                        select: { name: true, type: true },
                    },
                },
            }),
            prisma.generatedContract.count({ where }),
        ]);

        res.json({
            data: contracts,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + Number(limit) < total,
            },
        });
    } catch (error) {
        console.error('Error fetching contracts:', error);
        res.status(500).json({ error: 'Failed to fetch contracts' });
    }
});

/**
 * Sign a contract
 * PATCH /api/contracts/:contractId/sign
 */
contractsRouter.patch('/:contractId/sign', requireScope('contracts:write'), async (req: AuthenticatedRequest, res: Response) => {
    const { contractId } = req.params;
    const userId = req.user?.id;

    try {
        const contract = await prisma.generatedContract.findUnique({
            where: { id: contractId },
        });

        if (!contract) {
            res.status(404).json({ error: 'Contract not found' });
            return;
        }

        if (contract.status === 'signed') {
            res.status(400).json({ error: 'Contract already signed' });
            return;
        }

        if (contract.expiresAt && new Date() > contract.expiresAt) {
            res.status(400).json({ error: 'Contract has expired' });
            return;
        }

        const updated = await prisma.generatedContract.update({
            where: { id: contractId },
            data: {
                status: 'signed',
                signedAt: new Date(),
                signedByUserId: userId || null,
            },
        });

        res.json({
            data: updated,
            message: 'Contract signed successfully',
        });
    } catch (error) {
        console.error('Error signing contract:', error);
        res.status(500).json({ error: 'Failed to sign contract' });
    }
});
