import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

const APP_URL = process.env.APP_URL || 'https://harborml.com';
const PSEO_SHARD_SIZE = 5000; // URLs per sitemap shard
const PSEO_SHARDS = 10; // 10 shards = 50,000 PSEO URLs capacity

/**
 * ======================================
 * SITEMAP INDEX (Master List)
 * ======================================
 * Points to all child sitemaps for 50k+ URL scale
 */
router.get('/sitemap-index.xml', async (req, res) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const today = new Date().toISOString().split('T')[0];

    // 1. Core Pages (Static + Top Hubs)
    xml += `  <sitemap>\n    <loc>${APP_URL}/api/seo/sitemap-core.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;

    // 2. Hub Pages (Categories)
    xml += `  <sitemap>\n    <loc>${APP_URL}/api/seo/sitemap-hubs.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;

    // 3. Blog Sitemap
    xml += `  <sitemap>\n    <loc>${APP_URL}/api/seo/sitemap-blog.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;

    // 4. Image Sitemap (for Google Images)
    xml += `  <sitemap>\n    <loc>${APP_URL}/api/seo/sitemap-images.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;

    // 5. PSEO Sitemaps (Partitioned for scale)
    for (let i = 1; i <= PSEO_SHARDS; i++) {
        xml += `  <sitemap>\n    <loc>${APP_URL}/api/seo/sitemap-pseo-${i}.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;
    }

    xml += '</sitemapindex>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

/**
 * ======================================
 * CORE SITEMAP
 * ======================================
 * Static routes + top 100 DB pages
 */
router.get('/sitemap-core.xml', async (req, res) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const staticRoutes = [
        '', '/about', '/pricing', '/datasets', '/infrastructure', '/solutions', '/contact',
        '/product', '/use-cases', '/how-it-works', '/ambassadors', '/terms', '/privacy',
        '/docs', '/docs/quickstart', '/docs/api', '/docs/manifests', '/docs/architecture',
        // PSEO Hub Pages
        '/tools', '/guides', '/compare', '/explore',
    ];

    const today = new Date().toISOString().split('T')[0];

    staticRoutes.forEach(route => {
        xml += `  <url>\n    <loc>${APP_URL}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    });

    // Top 100 DB Pages
    const corePages = await prisma.seoPage.findMany({
        take: 100,
        where: { active: true },
        orderBy: { updatedAt: 'desc' },
        select: { slug: true, updatedAt: true, type: true }
    });

    corePages.forEach((page: { slug: string; updatedAt: Date; type?: string }) => {
        const prefix = page.type === 'tool' ? '/tools' : page.type === 'guide' ? '/guides' : '/explore';
        xml += `  <url>\n    <loc>${APP_URL}${prefix}/${page.slug}</loc>\n    <lastmod>${page.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

/**
 * ======================================
 * HUBS SITEMAP
 * ======================================
 * Category landing pages (500 max)
 */
router.get('/sitemap-hubs.xml', async (req, res) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const hubPages = await prisma.seoPage.findMany({
        take: 500,
        skip: 100,
        where: { active: true },
        orderBy: { updatedAt: 'desc' },
        select: { slug: true, updatedAt: true, type: true }
    });

    hubPages.forEach((page: { slug: string; updatedAt: Date; type?: string }) => {
        const prefix = page.type === 'tool' ? '/tools' : page.type === 'guide' ? '/guides' : '/explore';
        xml += `  <url>\n    <loc>${APP_URL}${prefix}/${page.slug}</loc>\n    <lastmod>${page.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

/**
 * ======================================
 * BLOG SITEMAP
 * ======================================
 * All blog posts
 */
router.get('/sitemap-blog.xml', async (req, res) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    try {
        const blogPosts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { publishedAt: 'desc' },
            select: { slug: true, publishedAt: true }
        });

        blogPosts.forEach((post: { slug: string; publishedAt: Date | null }) => {
            const lastmod = post.publishedAt ? post.publishedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            xml += `  <url>\n    <loc>${APP_URL}/blog/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
        });
    } catch (e) {
        // BlogPost model might not exist - fail gracefully
        console.warn('Blog sitemap: BlogPost model not available');
    }

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

/**
 * ======================================
 * PSEO PARTITIONED SITEMAPS (1-10)
 * ======================================
 * Each shard holds up to 5,000 URLs
 * Total capacity: 50,000 PSEO pages
 */
router.get('/sitemap-pseo-:shard.xml', async (req, res) => {
    const shard = parseInt(req.params.shard, 10);

    if (isNaN(shard) || shard < 1 || shard > PSEO_SHARDS) {
        return res.status(404).send('Invalid shard');
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const skip = 600 + (shard - 1) * PSEO_SHARD_SIZE; // Skip core (100) + hubs (500)

    const pseoPages = await prisma.seoPage.findMany({
        take: PSEO_SHARD_SIZE,
        skip: skip,
        where: { active: true },
        orderBy: { updatedAt: 'desc' },
        select: { slug: true, updatedAt: true, type: true }
    });

    pseoPages.forEach((page: { slug: string; updatedAt: Date; type?: string }) => {
        const prefix = page.type === 'tool' ? '/tools' : page.type === 'guide' ? '/guides' : page.type === 'compare' ? '/compare' : '/explore';
        xml += `  <url>\n    <loc>${APP_URL}${prefix}/${page.slug}</loc>\n    <lastmod>${page.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

/**
 * ======================================
 * SITEMAP STATS (Debug Endpoint)
 * ======================================
 */
router.get('/sitemap-stats', async (req, res) => {
    const totalSeoPages = await prisma.seoPage.count({ where: { active: true } });
    let blogCount = 0;
    try {
        blogCount = await prisma.blogPost.count({ where: { published: true } });
    } catch (e) { /* BlogPost model might not exist */ }

    const staticCount = 20; // Approximate static routes
    const totalCapacity = staticCount + 100 + 500 + (PSEO_SHARDS * PSEO_SHARD_SIZE) + blogCount;

    res.json({
        static_pages: staticCount,
        core_db_pages: Math.min(totalSeoPages, 100),
        hub_pages: Math.min(Math.max(totalSeoPages - 100, 0), 500),
        pseo_pages: Math.max(totalSeoPages - 600, 0),
        blog_posts: blogCount,
        total_submitted: staticCount + totalSeoPages + blogCount,
        sitemap_capacity: totalCapacity,
        shards: PSEO_SHARDS,
        shard_size: PSEO_SHARD_SIZE
    });
});

/**
 * ======================================
 * IMAGE SITEMAP
 * ======================================
 * Dedicated sitemap for image SEO
 * Uses Google Image Extensions
 */
router.get('/sitemap-images.xml', async (req, res) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    // Key pages with important images
    const pageImages = [
        {
            page: '/',
            images: [
                { loc: '/multimodal-data-infrastructure-hero.webp', title: 'Harbor ML Multimodal Data Infrastructure', caption: 'Enterprise-grade data infrastructure for AI training' },
                { loc: '/ai-training-data-pipeline.webp', title: 'AI Training Data Pipeline', caption: 'Real-time data processing for machine learning models' },
            ]
        },
        {
            page: '/product',
            images: [
                { loc: '/harbor-architecture-stack-diagram.webp', title: 'Harbor Architecture Stack', caption: 'Complete data infrastructure architecture diagram' },
                { loc: '/rlhf-training-cycle-diagram.webp', title: 'RLHF Training Cycle', caption: 'Reinforcement learning from human feedback workflow' },
            ]
        },
        {
            page: '/infrastructure',
            images: [
                { loc: '/harbor-api-infrastructure-diagram.webp', title: 'Harbor API Infrastructure', caption: 'Scalable API infrastructure for data operations' },
                { loc: '/global-media-ingestion-pipeline.webp', title: 'Global Media Ingestion', caption: 'Worldwide media data collection and processing' },
            ]
        },
        {
            page: '/datasets',
            images: [
                { loc: '/lego-dataset-example.webp', title: 'LEGO Dataset Example', caption: 'High-quality annotated LEGO assembly dataset' },
                { loc: '/video-annotation-preview.webp', title: 'Video Annotation Interface', caption: 'Frame-accurate video annotation tools' },
            ]
        },
    ];

    pageImages.forEach(({ page, images }) => {
        xml += '  <url>\n';
        xml += `    <loc>${APP_URL}${page}</loc>\n`;

        images.forEach(img => {
            xml += '    <image:image>\n';
            xml += `      <image:loc>${APP_URL}${img.loc}</image:loc>\n`;
            xml += `      <image:title>${img.title}</image:title>\n`;
            xml += `      <image:caption>${img.caption}</image:caption>\n`;
            xml += '    </image:image>\n';
        });

        xml += '  </url>\n';
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

export default router;
