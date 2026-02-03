import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

/**
 * Sitemap Index Generator
 * Points to child sitemaps to scale past 50k URLs
 */
/**
 * Sitemap Index Generator
 * EMERGENCY RECOVERY MODE: Only serves core sitemaps to rebuild trust
 */
router.get('/sitemap-index.xml', async (req, res) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 1. Core Pages (Static + Top Hubs) - High Trust Signal
    xml += '  <sitemap>\n';
    xml += `    <loc>${process.env.APP_URL || 'https://harbor.ai'}/sitemap-core.xml</loc>\n`;
    xml += '  </sitemap>\n';

    // 2. Hub Pages (Categories) - High Internal Link Value
    xml += '  <sitemap>\n';
    xml += `    <loc>${process.env.APP_URL || 'https://harbor.ai'}/sitemap-hubs.xml</loc>\n`;
    xml += '  </sitemap>\n';

    // DISABLED: Programmatic pages disabled until trust score > 70%
    // for (let i = 0; i < 5; i++) { ... }

    xml += '</sitemapindex>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

/**
 * Core Sitemap
 * Static pages + Top 100 high-priority hubs
 */
router.get('/sitemap-core.xml', async (req, res) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // A. Static Pages (Manually curated)
    const staticRoutes = [
        '', // Homepage
        '/about',
        '/pricing',
        '/datasets',
        '/infrastructure',
        '/solutions',
        '/contact'
    ];

    const today = new Date().toISOString().split('T')[0];

    staticRoutes.forEach(route => {
        xml += '  <url>\n';
        xml += `    <loc>${process.env.APP_URL || 'https://harbor.ai'}${route}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`; // Static pages are "fresh"
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';
    });

    // B. High Priority Database Pages (e.g. Major Hubs)
    // We assume pages with no parent are top-level hubs/categories
    // Since we don't have a 'priority' field, we'll fetch a limited set of active pages
    // Ideally we'd filter by type, but 'active: true' + limit 100 is safe for now
    const corePages = await prisma.seoPage.findMany({
        take: 100,
        where: { active: true }, // Add condition like type: 'hub' later
        orderBy: { updatedAt: 'desc' },
        select: { slug: true, updatedAt: true }
    });

    corePages.forEach((page: { slug: string; updatedAt: Date }) => {
        xml += '  <url>\n';
        xml += `    <loc>${process.env.APP_URL || 'https://harbor.ai'}/explore/${page.slug}</loc>\n`;
        xml += `    <lastmod>${page.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

/**
 * Hubs Sitemap
 * Next tier of important category pages
 */
router.get('/sitemap-hubs.xml', async (req, res) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Fetch next 500 pages (skipping the core 100)
    const hubPages = await prisma.seoPage.findMany({
        take: 500,
        skip: 100,
        where: { active: true },
        orderBy: { updatedAt: 'desc' },
        select: { slug: true, updatedAt: true }
    });

    hubPages.forEach((page: { slug: string; updatedAt: Date }) => {
        xml += '  <url>\n';
        xml += `    <loc>${process.env.APP_URL || 'https://harbor.ai'}/explore/${page.slug}</loc>\n`;
        xml += `    <lastmod>${page.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

export default router;
