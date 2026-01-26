import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';

export const enterpriseRouter = Router();

/**
 * ORGANIZATIONS: Manage orgs and members
 */
enterpriseRouter.get('/orgs/:orgId', async (req, res) => {
    try {
        const org = await prisma.organization.findUnique({
            where: { id: req.params.orgId },
            include: { members: true }
        });
        res.json(org);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch organization' });
    }
});

/**
 * DATASET BUILDS: Trigger a new private dataset build
 */
enterpriseRouter.post('/datasets/build', async (req, res) => {
    try {
        const { orgId, sourceAssets, filters, ragRules } = req.body;
        const build = await prisma.datasetBuild.create({
            data: {
                orgId,
                sourceAssets,
                filters,
                ragRules,
                status: 'queued'
            }
        });
        res.json(build);
    } catch (error) {
        res.status(500).json({ error: 'Failed to queue dataset build' });
    }
});

/**
 * AD GENERATION: Track specialized AI model runs
 */
enterpriseRouter.post('/ads/generate', async (req, res) => {
    try {
        const { projectId, promptVersion, model } = req.body;
        const run = await prisma.adGenerationRun.create({
            data: {
                projectId,
                promptVersion,
                model
            }
        });
        res.json(run);
    } catch (error) {
        res.status(500).json({ error: 'Failed to track ad generation' });
    }
});

/**
 * API KEYS: Manage enterprise credentials
 */
enterpriseRouter.get('/api-keys/:orgId', async (req, res) => {
    try {
        const keys = await prisma.aPICredential.findMany({
            where: { orgId: req.params.orgId }
        });
        res.json(keys);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch API keys' });
    }
});
