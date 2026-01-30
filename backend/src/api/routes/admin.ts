import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// ADMIN OVERVIEW ENDPOINTS
// ==========================================

// GET /admin/overview - Executive dashboard KPIs
router.get('/overview', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [
            totalActiveUsers,
            uploads24h,
            uploads7d,
            approvedAssets,
            rejectedAssets,
            totalAssets,
            activeDatasets,
            pendingPayouts
        ] = await Promise.all([
            prisma.user.count({ where: { updatedAt: { gte: thirtyDaysAgo } } }),
            prisma.mediaAsset.count({ where: { createdAt: { gte: twentyFourHoursAgo } } }),
            prisma.mediaAsset.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
            prisma.mediaAsset.count({ where: { status: 'READY' } }),
            prisma.mediaAsset.count({ where: { status: 'ERROR' } }),
            prisma.mediaAsset.count(),
            prisma.dataset.count({ where: { datasetStatus: 'PUBLISHED' } }),
            prisma.payout.aggregate({
                where: { status: 'pending' },
                _sum: { amount: true }
            })
        ]);

        res.json({
            kpis: {
                totalActiveUsers,
                uploads24h,
                uploads7d,
                approvalRate: totalAssets > 0 ? (approvedAssets / totalAssets * 100).toFixed(1) : 0,
                rejectionRate: totalAssets > 0 ? (rejectedAssets / totalAssets * 100).toFixed(1) : 0,
                activeDatasets,
                pendingPayoutLiability: pendingPayouts._sum.amount || 0
            }
        });
    } catch (error) {
        console.error('Admin overview error:', error);
        res.status(500).json({ error: 'Failed to fetch overview' });
    }
});

// GET /admin/overview/charts - Time series data for charts
router.get('/overview/charts', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Get daily upload counts for last 30 days
        const uploads = await prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM "MediaAsset"
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

        // Get content by type
        const contentByType = await prisma.mediaAsset.groupBy({
            by: ['type'],
            _count: true
        });

        res.json({
            uploadTrend: uploads,
            contentByType: contentByType.map(c => ({ type: c.type, count: c._count }))
        });
    } catch (error) {
        console.error('Admin charts error:', error);
        res.status(500).json({ error: 'Failed to fetch chart data' });
    }
});

// ==========================================
// USERS MANAGEMENT
// ==========================================

// GET /admin/users - List all users with filters
router.get('/users', async (req, res) => {
    try {
        const {
            page = '1',
            limit = '50',
            role,
            accountType,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const where: any = {};
        if (role) where.role = role;
        if (accountType) where.accountType = accountType;
        if (search) {
            where.OR = [
                { email: { contains: search as string, mode: 'insensitive' } },
                { name: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take,
                orderBy: { [sortBy as string]: sortOrder },
                include: {
                    profile: true,
                    _count: {
                        select: {
                            captureSessions: true,
                            payouts: true
                        }
                    }
                }
            }),
            prisma.user.count({ where })
        ]);

        // Enrich with aggregated stats
        const enrichedUsers = await Promise.all(users.map(async (user) => {
            const [totalEarnings, approvedAssets] = await Promise.all([
                prisma.earningsLedger.aggregate({
                    where: { userId: user.id },
                    _sum: { amount: true }
                }),
                prisma.mediaAsset.count({
                    where: {
                        session: { userId: user.id },
                        status: 'READY'
                    }
                })
            ]);

            return {
                ...user,
                totalEarnings: totalEarnings._sum.amount || 0,
                approvedAssets,
                totalUploads: user._count.captureSessions
            };
        }));

        res.json({
            data: enrichedUsers,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                pages: Math.ceil(total / parseInt(limit as string))
            }
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /admin/users/:id - User detail view
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                captureSessions: {
                    include: {
                        assets: true
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                payouts: {
                    orderBy: { timestamp: 'desc' },
                    take: 10
                },
                earnings: {
                    orderBy: { timestamp: 'desc' },
                    take: 20
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [totalEarnings, totalPayouts] = await Promise.all([
            prisma.earningsLedger.aggregate({
                where: { userId: id },
                _sum: { amount: true }
            }),
            prisma.payout.aggregate({
                where: { userId: id, status: 'paid' },
                _sum: { amount: true }
            })
        ]);

        res.json({
            ...user,
            stats: {
                totalEarnings: totalEarnings._sum.amount || 0,
                totalPayouts: totalPayouts._sum.amount || 0,
                pendingBalance: (totalEarnings._sum.amount || 0) - (totalPayouts._sum.amount || 0)
            }
        });
    } catch (error) {
        console.error('Admin user detail error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// PATCH /admin/users/:id/flags - Update user risk/trust flags
router.patch('/users/:id/flags', async (req, res) => {
    try {
        const { id } = req.params;
        const { riskScore, verified, role, kycStatus } = req.body;

        const updateData: any = {};
        if (riskScore !== undefined) updateData.riskScore = riskScore;
        if (verified !== undefined) updateData.verified = verified;
        if (role !== undefined) updateData.role = role;
        if (kycStatus !== undefined) updateData.kycStatus = kycStatus;

        const user = await prisma.user.update({
            where: { id },
            data: updateData
        });

        // Log admin action
        await prisma.systemAuditLog.create({
            data: {
                action: 'USER_FLAGS_UPDATED',
                actorId: (req as any).user?.id,
                resourceId: id,
                details: updateData,
                status: 'SUCCESS'
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Admin user flags error:', error);
        res.status(500).json({ error: 'Failed to update user flags' });
    }
});

// ==========================================
// CONTENT INGESTION
// ==========================================

// GET /admin/assets - Asset queue with filters
router.get('/assets', async (req, res) => {
    try {
        const {
            status,
            type,
            page = '1',
            limit = '50',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const where: any = {};
        if (status) where.status = status;
        if (type) where.type = type;

        const [assets, total] = await Promise.all([
            prisma.mediaAsset.findMany({
                where,
                skip,
                take,
                orderBy: { [sortBy as string]: sortOrder },
                include: {
                    session: {
                        include: {
                            user: {
                                select: { id: true, email: true, name: true }
                            }
                        }
                    },
                    auditLogs: {
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    }
                }
            }),
            prisma.mediaAsset.count({ where })
        ]);

        res.json({
            data: assets,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                pages: Math.ceil(total / parseInt(limit as string))
            }
        });
    } catch (error) {
        console.error('Admin assets error:', error);
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
});

// GET /admin/assets/:id - Asset detail with full audit trail
router.get('/assets/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const asset = await prisma.mediaAsset.findUnique({
            where: { id },
            include: {
                session: {
                    include: {
                        user: true
                    }
                },
                consent: true,
                annotations: true,
                auditLogs: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        reviewer: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }
            }
        });

        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        res.json(asset);
    } catch (error) {
        console.error('Admin asset detail error:', error);
        res.status(500).json({ error: 'Failed to fetch asset' });
    }
});

// POST /admin/assets/:id/review - Manual review decision
router.post('/assets/:id/review', async (req, res) => {
    try {
        const { id } = req.params;
        const { decision, notes } = req.body; // decision: 'approve' | 'reject'

        const newStatus = decision === 'approve' ? 'READY' : 'ERROR';

        const [asset, auditLog] = await Promise.all([
            prisma.mediaAsset.update({
                where: { id },
                data: { status: newStatus }
            }),
            prisma.assetAuditLog.create({
                data: {
                    assetId: id,
                    stage: 'human_review',
                    result: decision === 'approve' ? 'passed' : 'failed',
                    reviewerId: (req as any).user?.id,
                    metadata: { notes, decision }
                }
            })
        ]);

        res.json({ asset, auditLog });
    } catch (error) {
        console.error('Admin asset review error:', error);
        res.status(500).json({ error: 'Failed to review asset' });
    }
});

// ==========================================
// DATASETS
// ==========================================

// GET /admin/datasets - Dataset registry
router.get('/datasets', async (req, res) => {
    try {
        const {
            status,
            vertical,
            page = '1',
            limit = '50'
        } = req.query;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const where: any = {};
        if (status) where.datasetStatus = status;
        if (vertical) where.vertical = vertical;

        const [datasets, total] = await Promise.all([
            prisma.dataset.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { mediaAssets: true, access: true }
                    },
                    qualityProfile: true
                }
            }),
            prisma.dataset.count({ where })
        ]);

        // Enrich with revenue data
        const enrichedDatasets = await Promise.all(datasets.map(async (dataset) => {
            const revenue = await prisma.datasetRevenueLedger.aggregate({
                where: { datasetId: dataset.id },
                _sum: { priceUsd: true }
            });

            return {
                ...dataset,
                assetCount: dataset._count.mediaAssets,
                clientCount: dataset._count.access,
                totalRevenue: revenue._sum.priceUsd || 0
            };
        }));

        res.json({
            data: enrichedDatasets,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                pages: Math.ceil(total / parseInt(limit as string))
            }
        });
    } catch (error) {
        console.error('Admin datasets error:', error);
        res.status(500).json({ error: 'Failed to fetch datasets' });
    }
});

// POST /admin/datasets/:id/publish - Publish dataset
router.post('/datasets/:id/publish', async (req, res) => {
    try {
        const { id } = req.params;

        const dataset = await prisma.dataset.update({
            where: { id },
            data: { datasetStatus: 'PUBLISHED' }
        });

        await prisma.systemAuditLog.create({
            data: {
                action: 'DATASET_PUBLISH',
                actorId: (req as any).user?.id,
                resourceId: id,
                status: 'SUCCESS'
            }
        });

        res.json(dataset);
    } catch (error) {
        console.error('Admin dataset publish error:', error);
        res.status(500).json({ error: 'Failed to publish dataset' });
    }
});

// ==========================================
// REVENUE & PAYOUTS
// ==========================================

// GET /admin/revenue/summary - Revenue overview
router.get('/revenue/summary', async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);

        const [mtdRevenue, qtdRevenue, totalRevenue, pendingPayouts] = await Promise.all([
            prisma.datasetRevenueLedger.aggregate({
                where: { createdAt: { gte: startOfMonth } },
                _sum: { priceUsd: true }
            }),
            prisma.datasetRevenueLedger.aggregate({
                where: { createdAt: { gte: startOfQuarter } },
                _sum: { priceUsd: true }
            }),
            prisma.datasetRevenueLedger.aggregate({
                _sum: { priceUsd: true }
            }),
            prisma.payout.aggregate({
                where: { status: 'pending' },
                _sum: { amount: true }
            })
        ]);

        res.json({
            mtdRevenue: mtdRevenue._sum.priceUsd || 0,
            qtdRevenue: qtdRevenue._sum.priceUsd || 0,
            totalRevenue: totalRevenue._sum.priceUsd || 0,
            pendingPayoutLiability: pendingPayouts._sum.amount || 0
        });
    } catch (error) {
        console.error('Admin revenue summary error:', error);
        res.status(500).json({ error: 'Failed to fetch revenue summary' });
    }
});

// GET /admin/payouts - Payout queue
router.get('/payouts', async (req, res) => {
    try {
        const { status, page = '1', limit = '50' } = req.query;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const where: any = {};
        if (status) where.status = status;

        const [payouts, total] = await Promise.all([
            prisma.payout.findMany({
                where,
                skip,
                take,
                orderBy: { timestamp: 'desc' },
                include: {
                    user: {
                        select: { id: true, email: true, name: true }
                    }
                }
            }),
            prisma.payout.count({ where })
        ]);

        res.json({
            data: payouts,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                pages: Math.ceil(total / parseInt(limit as string))
            }
        });
    } catch (error) {
        console.error('Admin payouts error:', error);
        res.status(500).json({ error: 'Failed to fetch payouts' });
    }
});

// POST /admin/payouts/:id/execute - Execute payout
router.post('/payouts/:id/execute', async (req, res) => {
    try {
        const { id } = req.params;

        const payout = await prisma.payout.update({
            where: { id },
            data: { status: 'paid' }
        });

        await prisma.systemAuditLog.create({
            data: {
                action: 'PAYOUT_EXECUTED',
                actorId: (req as any).user?.id,
                resourceId: id,
                status: 'SUCCESS'
            }
        });

        res.json(payout);
    } catch (error) {
        console.error('Admin payout execute error:', error);
        res.status(500).json({ error: 'Failed to execute payout' });
    }
});

// ==========================================
// INFRASTRUCTURE & METRICS
// ==========================================

// GET /admin/metrics/api - API usage metrics
router.get('/metrics/api', async (req, res) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const usageByService = await prisma.usageRecord.groupBy({
            by: ['service'],
            where: { timestamp: { gte: sevenDaysAgo } },
            _sum: { units: true },
            _count: true
        });

        res.json({
            services: usageByService.map(s => ({
                service: s.service,
                totalRequests: s._count,
                totalUnits: s._sum.units
            }))
        });
    } catch (error) {
        console.error('Admin API metrics error:', error);
        res.status(500).json({ error: 'Failed to fetch API metrics' });
    }
});

// GET /admin/metrics/storage - Storage metrics
router.get('/metrics/storage', async (req, res) => {
    try {
        const totalStorage = await prisma.mediaAsset.aggregate({
            _sum: { sizeBytes: true },
            _count: true
        });

        const storageByType = await prisma.mediaAsset.groupBy({
            by: ['type'],
            _sum: { sizeBytes: true },
            _count: true
        });

        res.json({
            totalBytes: totalStorage._sum.sizeBytes || 0,
            totalAssets: totalStorage._count,
            byType: storageByType.map(s => ({
                type: s.type,
                bytes: s._sum.sizeBytes,
                count: s._count
            }))
        });
    } catch (error) {
        console.error('Admin storage metrics error:', error);
        res.status(500).json({ error: 'Failed to fetch storage metrics' });
    }
});

// ==========================================
// COMPLIANCE & AUDIT LOGS
// ==========================================

// GET /admin/audit-logs - System audit logs
router.get('/audit-logs', async (req, res) => {
    try {
        const { action, status, page = '1', limit = '100' } = req.query;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const where: any = {};
        if (action) where.action = action;
        if (status) where.status = status;

        const [logs, total] = await Promise.all([
            prisma.systemAuditLog.findMany({
                where,
                skip,
                take,
                orderBy: { timestamp: 'desc' }
            }),
            prisma.systemAuditLog.count({ where })
        ]);

        res.json({
            data: logs,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                pages: Math.ceil(total / parseInt(limit as string))
            }
        });
    } catch (error) {
        console.error('Admin audit logs error:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});

export default router;
