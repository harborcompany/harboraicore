/**
 * Marketplace API Routes
 * Dataset revenue ledger and marketplace transactions
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireScope, type AuthenticatedRequest } from '../middleware/auth.js';

export const marketplaceRouter = Router();

/**
 * List all marketplace transactions
 * GET /api/marketplace/transactions
 */
marketplaceRouter.get('/transactions', requireScope('marketplace:read'), async (req: Request, res: Response) => {
    const { datasetId, buyerType, limit = '50', offset = '0' } = req.query;

    try {
        const where: any = {};
        if (datasetId) where.datasetId = String(datasetId);
        if (buyerType) where.buyerType = String(buyerType);

        const [transactions, total] = await Promise.all([
            prisma.datasetRevenueLedger.findMany({
                where,
                take: Number(limit),
                skip: Number(offset),
                orderBy: { createdAt: 'desc' },
            }),
            prisma.datasetRevenueLedger.count({ where }),
        ]);

        res.json({
            data: transactions,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + Number(limit) < total,
            },
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

/**
 * Record a new marketplace transaction
 * POST /api/marketplace/transactions
 */
marketplaceRouter.post('/transactions', requireScope('marketplace:write'), async (req: AuthenticatedRequest, res: Response) => {
    const {
        datasetId,
        buyerType,
        buyerOrgId,
        usageUnits,
        priceUsd,
        revenueShare,
        notes,
    } = req.body;

    if (!datasetId || !buyerType || !usageUnits || !priceUsd) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'datasetId, buyerType, usageUnits, and priceUsd are required',
        });
        return;
    }

    try {
        // Verify dataset exists
        const dataset = await prisma.dataset.findUnique({ where: { id: datasetId } });
        if (!dataset) {
            res.status(404).json({ error: 'Dataset not found' });
            return;
        }

        const transaction = await prisma.datasetRevenueLedger.create({
            data: {
                datasetId,
                buyerType,
                buyerOrgId: buyerOrgId || null,
                usageUnits,
                priceUsd,
                revenueShare: revenueShare || { harbor: 0.25, contributor: 0.75 },
                notes: notes || null,
            },
        });

        res.status(201).json({
            data: transaction,
            message: 'Transaction recorded successfully',
        });
    } catch (error) {
        console.error('Error recording transaction:', error);
        res.status(500).json({ error: 'Failed to record transaction' });
    }
});

/**
 * Get revenue statistics for a dataset
 * GET /api/marketplace/datasets/:datasetId/revenue
 */
marketplaceRouter.get('/datasets/:datasetId/revenue', requireScope('marketplace:read'), async (req: Request, res: Response) => {
    const { datasetId } = req.params;

    try {
        const dataset = await prisma.dataset.findUnique({ where: { id: datasetId } });
        if (!dataset) {
            res.status(404).json({ error: 'Dataset not found' });
            return;
        }

        const transactions = await prisma.datasetRevenueLedger.findMany({
            where: { datasetId },
        });

        const totalRevenue = transactions.reduce((sum: number, t: any) => sum + Number(t.priceUsd), 0);
        const totalUnits = transactions.reduce((sum: number, t: any) => sum + t.usageUnits, 0);
        const buyerBreakdown: Record<string, number> = {};

        transactions.forEach((t: any) => {
            buyerBreakdown[t.buyerType] = (buyerBreakdown[t.buyerType] || 0) + Number(t.priceUsd);
        });

        res.json({
            data: {
                datasetId,
                datasetName: dataset.name,
                totalRevenue,
                totalUnits,
                transactionCount: transactions.length,
                buyerBreakdown,
                averagePrice: transactions.length > 0 ? totalRevenue / transactions.length : 0,
            },
        });
    } catch (error) {
        console.error('Error fetching revenue stats:', error);
        res.status(500).json({ error: 'Failed to fetch revenue statistics' });
    }
});

/**
 * Get platform-wide marketplace statistics
 * GET /api/marketplace/stats
 */
marketplaceRouter.get('/stats', requireScope('marketplace:read'), async (req: Request, res: Response) => {
    try {
        const transactions = await prisma.datasetRevenueLedger.findMany();
        const datasets = await prisma.dataset.count({ where: { datasetStatus: 'PUBLISHED' } });

        const totalRevenue = transactions.reduce((sum: number, t: any) => sum + Number(t.priceUsd), 0);
        const totalUnits = transactions.reduce((sum: number, t: any) => sum + t.usageUnits, 0);

        res.json({
            data: {
                totalRevenue,
                totalUnits,
                transactionCount: transactions.length,
                publishedDatasets: datasets,
                averageTransactionValue: transactions.length > 0 ? totalRevenue / transactions.length : 0,
            },
        });
    } catch (error) {
        console.error('Error fetching marketplace stats:', error);
        res.status(500).json({ error: 'Failed to fetch marketplace statistics' });
    }
});
