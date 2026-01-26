/**
 * Documentation API Routes
 * Auto-generated API documentation and tutorials
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireScope } from '../middleware/auth.js';

export const docsRouter = Router();

// ==========================================
// ENDPOINT DOCUMENTATION
// ==========================================

/**
 * List all documented endpoints
 * GET /api/docs/endpoints
 */
docsRouter.get('/endpoints', async (req: Request, res: Response) => {
    const { tags, method } = req.query;

    try {
        const where: any = {};
        if (method) where.method = String(method).toUpperCase();
        if (tags) {
            where.tags = {
                has: String(tags),
            };
        }

        const endpoints = await prisma.endpointDoc.findMany({
            where,
            orderBy: { endpoint: 'asc' },
            select: {
                id: true,
                endpoint: true,
                method: true,
                description: true,
                tags: true,
                avgLatencyMs: true,
            },
        });

        res.json({
            data: endpoints,
            total: endpoints.length,
        });
    } catch (error) {
        console.error('Error fetching endpoint docs:', error);
        res.status(500).json({ error: 'Failed to fetch endpoint documentation' });
    }
});

/**
 * Get detailed documentation for an endpoint
 * GET /api/docs/endpoints/:endpointId
 */
docsRouter.get('/endpoints/:endpointId', async (req: Request, res: Response) => {
    const { endpointId } = req.params;

    try {
        const endpoint = await prisma.endpointDoc.findUnique({
            where: { id: endpointId },
        });

        if (!endpoint) {
            res.status(404).json({ error: 'Endpoint documentation not found' });
            return;
        }

        res.json({ data: endpoint });
    } catch (error) {
        console.error('Error fetching endpoint doc:', error);
        res.status(500).json({ error: 'Failed to fetch endpoint documentation' });
    }
});

/**
 * Create/update endpoint documentation (admin)
 * POST /api/docs/endpoints
 */
docsRouter.post('/endpoints', requireScope('docs:admin'), async (req: Request, res: Response) => {
    const { endpoint, method, description, parameters, examples, avgLatencyMs, commonUseCases, tags } = req.body;

    if (!endpoint || !method || !description) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'endpoint, method, and description are required',
        });
        return;
    }

    try {
        const doc = await prisma.endpointDoc.upsert({
            where: { endpoint },
            update: {
                method,
                description,
                parameters: parameters || null,
                examples: examples || [],
                avgLatencyMs: avgLatencyMs || null,
                commonUseCases: commonUseCases || [],
                tags: tags || [],
            },
            create: {
                endpoint,
                method,
                description,
                parameters: parameters || null,
                examples: examples || [],
                avgLatencyMs: avgLatencyMs || null,
                commonUseCases: commonUseCases || [],
                tags: tags || [],
            },
        });

        res.status(201).json({
            data: doc,
            message: 'Endpoint documentation saved successfully',
        });
    } catch (error) {
        console.error('Error saving endpoint doc:', error);
        res.status(500).json({ error: 'Failed to save endpoint documentation' });
    }
});

// ==========================================
// TUTORIALS
// ==========================================

/**
 * List all tutorials
 * GET /api/docs/tutorials
 */
docsRouter.get('/tutorials', async (req: Request, res: Response) => {
    const { published = 'true' } = req.query;

    try {
        const where: any = {};
        if (published === 'true') where.published = true;

        const tutorials = await prisma.tutorial.findMany({
            where,
            orderBy: { order: 'asc' },
            select: {
                id: true,
                title: true,
                slug: true,
                summary: true,
                tools: true,
                estimatedTime: true,
                published: true,
            },
        });

        res.json({
            data: tutorials,
            total: tutorials.length,
        });
    } catch (error) {
        console.error('Error fetching tutorials:', error);
        res.status(500).json({ error: 'Failed to fetch tutorials' });
    }
});

/**
 * Get a specific tutorial by slug
 * GET /api/docs/tutorials/:slug
 */
docsRouter.get('/tutorials/:slug', async (req: Request, res: Response) => {
    const { slug } = req.params;

    try {
        const tutorial = await prisma.tutorial.findUnique({
            where: { slug },
        });

        if (!tutorial) {
            res.status(404).json({ error: 'Tutorial not found' });
            return;
        }

        res.json({ data: tutorial });
    } catch (error) {
        console.error('Error fetching tutorial:', error);
        res.status(500).json({ error: 'Failed to fetch tutorial' });
    }
});

/**
 * Create a tutorial (admin)
 * POST /api/docs/tutorials
 */
docsRouter.post('/tutorials', requireScope('docs:admin'), async (req: Request, res: Response) => {
    const { title, slug, summary, datasetsUsed, tools, estimatedTime, content, published, order } = req.body;

    if (!title || !slug || !content) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'title, slug, and content are required',
        });
        return;
    }

    try {
        const tutorial = await prisma.tutorial.create({
            data: {
                title,
                slug,
                summary: summary || null,
                datasetsUsed: datasetsUsed || [],
                tools: tools || [],
                estimatedTime: estimatedTime || '30 min',
                content,
                published: published ?? false,
                order: order ?? 0,
            },
        });

        res.status(201).json({
            data: tutorial,
            message: 'Tutorial created successfully',
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'Tutorial with this slug already exists' });
            return;
        }
        console.error('Error creating tutorial:', error);
        res.status(500).json({ error: 'Failed to create tutorial' });
    }
});

/**
 * Update a tutorial
 * PATCH /api/docs/tutorials/:slug
 */
docsRouter.patch('/tutorials/:slug', requireScope('docs:admin'), async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { title, summary, datasetsUsed, tools, estimatedTime, content, published, order } = req.body;

    try {
        const tutorial = await prisma.tutorial.update({
            where: { slug },
            data: {
                ...(title && { title }),
                ...(summary !== undefined && { summary }),
                ...(datasetsUsed && { datasetsUsed }),
                ...(tools && { tools }),
                ...(estimatedTime && { estimatedTime }),
                ...(content && { content }),
                ...(published !== undefined && { published }),
                ...(order !== undefined && { order }),
            },
        });

        res.json({ data: tutorial });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Tutorial not found' });
            return;
        }
        console.error('Error updating tutorial:', error);
        res.status(500).json({ error: 'Failed to update tutorial' });
    }
});

// ==========================================
// AUTO-GENERATED SDK EXAMPLES
// ==========================================

/**
 * Get SDK code examples for an endpoint
 * GET /api/docs/sdk/:endpoint
 */
docsRouter.get('/sdk/:endpointPath(*)', async (req: Request, res: Response) => {
    const endpoint = '/' + req.params.endpointPath;

    try {
        const doc = await prisma.endpointDoc.findUnique({
            where: { endpoint },
        });

        if (!doc) {
            // Generate basic example if no doc exists
            res.json({
                data: {
                    endpoint,
                    examples: [
                        {
                            language: 'python',
                            code: `from harbor import Client\n\nclient = Client(api_key="YOUR_API_KEY")\nresponse = client.request("${endpoint}")\nprint(response)`,
                        },
                        {
                            language: 'javascript',
                            code: `import { HarborClient } from '@harbor/sdk';\n\nconst client = new HarborClient({ apiKey: 'YOUR_API_KEY' });\nconst response = await client.request('${endpoint}');\nconsole.log(response);`,
                        },
                        {
                            language: 'curl',
                            code: `curl -X GET "https://api.harbor.ai${endpoint}" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
                        },
                    ],
                },
            });
            return;
        }

        res.json({ data: doc });
    } catch (error) {
        console.error('Error generating SDK examples:', error);
        res.status(500).json({ error: 'Failed to generate SDK examples' });
    }
});
