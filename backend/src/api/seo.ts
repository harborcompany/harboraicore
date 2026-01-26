import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

/**
 * Sitemap Index Generator
 * Points to child sitemaps to scale past 50k URLs
 */
router.get('/sitemap-index.xml', async (req, res) => {
    // For 100k pages, we need at least 2 sitemaps
    const sitemapCount = 5; // We'll pre-allocate 5 to handle growth

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (let i = 0; i < sitemapCount; i++) {
        xml += '  <sitemap>\n';
        xml += `    <loc>${process.env.APP_URL || 'https://harbor.ai'}/sitemap-${i}.xml</loc>\n`;
        xml += '  </sitemap>\n';
    }

    xml += '</sitemapindex>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

/**
 * Dynamic Child Sitemap
 * Serves chunks of the 100k page library
 */
router.get('/sitemap-:index.xml', async (req, res) => {
    const index = parseInt(req.params.index);
    const pageSize = 20000;

    // Fetch a slice of SEO pages
    const pages = await prisma.seoPage.findMany({
        take: pageSize,
        skip: index * pageSize,
        where: { active: true },
        select: { slug: true, updatedAt: true }
    });

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    pages.forEach((page: { slug: string; updatedAt: Date }) => {
        xml += '  <url>\n';
        xml += `    <loc>${process.env.APP_URL || 'https://harbor.ai'}/explore/${page.slug}</loc>\n`;
        xml += `    <lastmod>${page.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

export default router;
