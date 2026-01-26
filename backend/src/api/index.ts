/**
 * HARBOR API Router
 * Main API gateway - primary product surface
 */

import { Router } from 'express';
import { datasetsRouter } from './routes/datasets.js';
import { annotationRouter } from './routes/annotation.js';
import { ragRouter } from './routes/rag.js';
import { agentsRouter } from './routes/agents.js';
import { adsRouter } from './routes/ads.js';
import { contactRouter } from './routes/contact.js';
import { contributorRouter } from './routes/contributor.js';
import { enterpriseRouter } from './routes/enterprise.js';
import seoRouter from './seo.js';
import clientRouter from './routes/client.js';
import { authMiddleware } from './middleware/auth.js';
import { meteringMiddleware } from './middleware/metering.js';
import { rightsMiddleware } from './middleware/rights.js';

// Lab-Ready Data Platform Routes
import { governanceRouter } from './routes/governance.js';
import { marketplaceRouter } from './routes/marketplace.js';
import { sandboxRouter } from './routes/sandbox.js';
import { contractsRouter } from './routes/contracts.js';
import { docsRouter } from './routes/docs.js';

export const apiRouter = Router();

// ============================================
// API ROOT
// ============================================

apiRouter.get('/', (req, res) => {
    res.json({
        name: 'HARBOR API',
        version: 'v1',
        description: 'Media-Native Audio & Video Data Infrastructure',
        documentation: 'https://docs.harbor.ai',
        endpoints: {
            // Core Data APIs
            datasets: '/api/datasets',
            annotation: '/api/annotation',
            rag: '/api/rag',

            // Production APIs
            agents: '/api/agents',
            ads: '/api/ads',

            // Identity & Access
            contributor: '/api/contributor',
            enterprise: '/api/enterprise',

            // Lab-Ready Data Platform
            governance: '/api/governance',
            marketplace: '/api/marketplace',
            sandbox: '/api/sandbox',
            contracts: '/api/contracts',
            docs: '/api/docs',

            // Public
            contact: '/api/contact',
        },
        status: 'operational',
    });
});

// ============================================
// ASYMMETRIC API SURFACE (Build Doc Segments)
// ============================================

// Contributor Surface (Supply)
apiRouter.use('/contributor', contributorRouter);

// Enterprise Surface (Demand)
apiRouter.use('/enterprise', enterpriseRouter);

// ============================================
// PUBLIC ROUTES (No auth required)
// ============================================

// Contact form (public)
apiRouter.use('/contact', contactRouter);

// SEO & Sitemaps (public)
apiRouter.use('/seo', seoRouter);

// Documentation API (public read access)
apiRouter.use('/docs', docsRouter);

// Sandbox quickstart (partial public access)
apiRouter.use('/sandbox', sandboxRouter);

// ============================================
// APPLY GLOBAL MIDDLEWARE
// ============================================

// Authentication for all routes below
apiRouter.use(authMiddleware);

// Usage metering
apiRouter.use(meteringMiddleware);

// Rights enforcement
apiRouter.use(rightsMiddleware);

// ============================================
// MOUNT ROUTE HANDLERS
// ============================================

// Dataset Access API
apiRouter.use('/datasets', datasetsRouter);

// Annotation API
apiRouter.use('/annotation', annotationRouter);

// RAG Query API
apiRouter.use('/rag', ragRouter);

// Agent APIs
apiRouter.use('/agents', agentsRouter);

// Harbor Ads Production API
apiRouter.use('/ads', adsRouter);

// Client Portal API (enterprise data browsing)
apiRouter.use('/client', clientRouter);

// ============================================
// LAB-READY DATA PLATFORM APIs
// ============================================

// Governance & Compliance API
apiRouter.use('/governance', governanceRouter);

// Marketplace & Revenue API
apiRouter.use('/marketplace', marketplaceRouter);

// Contract Generation API
apiRouter.use('/contracts', contractsRouter);

// ============================================
// STORAGE API
// ============================================
import { storageRouter } from './routes/storage.js';
apiRouter.use('/storage', storageRouter);

