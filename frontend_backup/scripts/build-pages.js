#!/usr/bin/env node
/**
 * Static Site Generator for HARBOR
 * Generates programmatic pages from data files
 * Designed for 100,000+ pages at scale
 */

const fs = require('fs');
const path = require('path');

// Import SEO modules
const metadata = require('../lib/seo/metadata.js');
const schema = require('../lib/seo/schema.js');
const linking = require('../lib/seo/internal-linking.js');

// Configuration
const CONFIG = {
    dataDir: path.join(__dirname, '../data'),
    distDir: path.join(__dirname, '../dist'),
    templatesDir: path.join(__dirname, '../templates'),
    baseUrl: 'https://harbor.ai',
};

// Statistics
const stats = {
    pagesGenerated: 0,
    errors: [],
    startTime: Date.now(),
};

/**
 * Main build function
 */
async function build() {
    console.log('🚀 Starting HARBOR static site generation...\n');

    // Ensure dist directory exists
    ensureDir(CONFIG.distDir);

    // Load all data
    const datasets = loadJSON('datasets.json');
    const faqs = loadJSON('faqs.json');

    // Collect all pages for sitemap and internal linking
    const allPages = [];

    // Generate dataset detail pages
    console.log('📦 Generating dataset pages...');
    if (datasets.datasets) {
        ensureDir(path.join(CONFIG.distDir, 'datasets'));
        for (const dataset of datasets.datasets) {
            const page = generateDatasetPage(dataset, datasets.datasets);
            allPages.push(page);
        }
        console.log(`   ✓ Generated ${datasets.datasets.length} dataset pages\n`);
    }

    // Generate FAQ pages
    console.log('❓ Generating FAQ pages...');
    if (faqs.categories) {
        ensureDir(path.join(CONFIG.distDir, 'faq'));
        for (const [categorySlug, category] of Object.entries(faqs.categories)) {
            ensureDir(path.join(CONFIG.distDir, 'faq', categorySlug));

            // Category index page
            const categoryPage = generateFAQCategoryPage(categorySlug, category);
            allPages.push(categoryPage);

            // Individual FAQ pages
            if (category.faqs) {
                for (const faq of category.faqs) {
                    const page = generateFAQPage(faq, categorySlug, category);
                    allPages.push(page);
                }
            }
        }
        const faqCount = Object.values(faqs.categories).reduce((sum, cat) => sum + (cat.faqs?.length || 0), 0);
        console.log(`   ✓ Generated ${faqCount} FAQ pages\n`);
    }

    // Generate sitemap
    console.log('🗺️  Generating sitemap...');
    generateSitemap(allPages);
    console.log('   ✓ Generated sitemap.xml\n');

    // Generate robots.txt
    generateRobotsTxt();
    console.log('   ✓ Generated robots.txt\n');

    // Print summary
    const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);
    console.log('═'.repeat(50));
    console.log(`✅ Build complete!`);
    console.log(`   Pages generated: ${stats.pagesGenerated}`);
    console.log(`   Time: ${duration}s`);
    console.log(`   Output: ${CONFIG.distDir}`);

    if (stats.errors.length > 0) {
        console.log(`\n⚠️  Errors: ${stats.errors.length}`);
        stats.errors.forEach(err => console.log(`   - ${err}`));
    }
}

/**
 * Generate a dataset detail page
 */
function generateDatasetPage(dataset, allDatasets) {
    const pagePath = `/datasets/${dataset.slug}.html`;

    // Get related datasets
    const related = dataset.relatedDatasets?.map(slug =>
        allDatasets.find(d => d.slug === slug)
    ).filter(Boolean) || [];

    // Generate breadcrumbs
    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Datasets', url: '/datasets.html' },
        { name: dataset.title, url: pagePath },
    ];

    // Generate metadata
    const meta = metadata.generatePageMeta('dataset', {
        ...dataset,
        path: pagePath,
    });

    // Generate schema
    const schemaJson = schema.generatePageSchema('dataset', {
        ...dataset,
        breadcrumbs,
        faqs: dataset.faqs,
    });

    // Generate HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${metadata.renderMetaTags(meta)}
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    ${schemaJson}
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: #fff; }
    </style>
</head>
<body class="bg-black text-neutral-300 antialiased">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-white font-medium">
                <i data-lucide="anchor" class="w-5 h-5"></i>
                <span>HARBOR</span>
            </a>
            <div class="hidden md:flex items-center gap-8 text-sm text-neutral-400">
                <a href="/product.html" class="hover:text-white">Product</a>
                <a href="/datasets.html" class="text-white">Datasets</a>
                <a href="/pricing.html" class="hover:text-white">Pricing</a>
            </div>
            <a href="/contact.html" class="text-xs font-medium bg-white text-black px-4 py-2 rounded-full">Request Demo</a>
        </div>
    </nav>

    <main class="pt-24 pb-20 px-4 sm:px-6">
        <!-- Breadcrumbs -->
        <nav class="max-w-7xl mx-auto mb-8" aria-label="Breadcrumb">
            <ol class="flex items-center gap-2 text-sm text-neutral-500">
                ${breadcrumbs.map((crumb, i) => `
                    <li class="flex items-center gap-2">
                        ${i > 0 ? '<span>/</span>' : ''}
                        ${i === breadcrumbs.length - 1
            ? `<span class="text-white">${crumb.name}</span>`
            : `<a href="${crumb.url}" class="hover:text-white">${crumb.name}</a>`
        }
                    </li>
                `).join('')}
            </ol>
        </nav>

        <!-- Dataset Header -->
        <section class="max-w-7xl mx-auto mb-16">
            <div class="flex items-center gap-4 mb-6">
                <span class="bg-${getCategoryColor(dataset.category)}-500/10 text-${getCategoryColor(dataset.category)}-400 px-3 py-1 rounded-full text-xs font-medium uppercase">${dataset.category}</span>
                <span class="text-xs text-neutral-600 font-mono">v${dataset.version}</span>
            </div>
            <h1 class="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">${dataset.title}</h1>
            <p class="text-xl text-neutral-400 max-w-3xl">${dataset.description}</p>
        </section>

        <!-- Stats Grid -->
        <section class="max-w-7xl mx-auto mb-16">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${Object.entries(dataset.stats || {}).map(([key, value]) => `
                    <div class="bg-neutral-900/30 border border-white/10 rounded-xl p-6">
                        <div class="text-2xl font-medium text-white mb-1">${formatStat(value)}</div>
                        <div class="text-sm text-neutral-500 capitalize">${key}</div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Tags -->
        <section class="max-w-7xl mx-auto mb-16">
            <h2 class="text-lg font-medium text-white mb-4">Tags</h2>
            <div class="flex flex-wrap gap-2">
                ${(dataset.tags || []).map(tag => `
                    <span class="bg-white/5 border border-white/10 px-3 py-1 rounded text-sm text-neutral-300">${tag}</span>
                `).join('')}
            </div>
        </section>

        ${dataset.faqs ? `
        <!-- FAQs -->
        <section class="max-w-7xl mx-auto mb-16 border-t border-white/10 pt-16">
            <h2 class="text-2xl font-medium text-white mb-8">Frequently Asked Questions</h2>
            <div class="space-y-6">
                ${dataset.faqs.map(faq => `
                    <div class="bg-neutral-900/30 border border-white/10 rounded-xl p-6">
                        <h3 class="text-lg font-medium text-white mb-3">${faq.question}</h3>
                        <p class="text-neutral-400">${faq.answer}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${related.length > 0 ? `
        <!-- Related Datasets -->
        <section class="max-w-7xl mx-auto mb-16 border-t border-white/10 pt-16">
            <h2 class="text-2xl font-medium text-white mb-8">Related Datasets</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${related.map(rel => `
                    <a href="/datasets/${rel.slug}.html" class="bg-neutral-900/30 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                        <span class="text-xs text-${getCategoryColor(rel.category)}-400 uppercase">${rel.category}</span>
                        <h3 class="text-lg font-medium text-white mt-2 mb-2">${rel.title}</h3>
                        <p class="text-sm text-neutral-500 line-clamp-2">${rel.description}</p>
                    </a>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- CTA -->
        <section class="max-w-xl mx-auto text-center border-t border-white/10 pt-16">
            <h2 class="text-2xl font-medium text-white mb-4">Ready to get started?</h2>
            <p class="text-neutral-400 mb-8">Request access to ${dataset.title} and start training.</p>
            <a href="/contact.html" class="bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors">Request Access</a>
        </section>
    </main>

    <footer class="border-t border-white/5 bg-black py-12 px-6">
        <div class="max-w-7xl mx-auto text-center text-xs text-neutral-600">
            <p>© 2026 HARBOR Inc. All rights reserved.</p>
        </div>
    </footer>

    <script>lucide.createIcons();</script>
</body>
</html>`;

    // Write file
    const filePath = path.join(CONFIG.distDir, 'datasets', `${dataset.slug}.html`);
    fs.writeFileSync(filePath, html);
    stats.pagesGenerated++;

    return {
        path: pagePath,
        title: dataset.title,
        type: 'dataset',
        category: dataset.category,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.8,
    };
}

/**
 * Generate FAQ category index page
 */
function generateFAQCategoryPage(slug, category) {
    const pagePath = `/faq/${slug}/`;

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'FAQ', url: '/faq/' },
        { name: category.name, url: pagePath },
    ];

    const meta = metadata.generatePageMeta('category', {
        title: category.name,
        description: category.description,
        count: category.faqs?.length || 0,
        path: pagePath,
    });

    const schemaJson = schema.generatePageSchema('faq', {
        breadcrumbs,
        faqs: category.faqs,
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${metadata.renderMetaTags(meta)}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    ${schemaJson}
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: #fff; }
    </style>
</head>
<body class="bg-black text-neutral-300 antialiased">
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-white font-medium">⚓ HARBOR</a>
        </div>
    </nav>

    <main class="pt-24 pb-20 px-4 sm:px-6">
        <section class="max-w-3xl mx-auto">
            <nav class="mb-8 text-sm text-neutral-500">
                <a href="/" class="hover:text-white">Home</a> / 
                <a href="/faq/" class="hover:text-white">FAQ</a> / 
                <span class="text-white">${category.name}</span>
            </nav>

            <h1 class="text-4xl font-medium text-white mb-4">${category.name}</h1>
            <p class="text-neutral-400 mb-12">${category.description}</p>

            <div class="space-y-4">
                ${(category.faqs || []).map(faq => `
                    <a href="/faq/${slug}/${faq.slug}.html" class="block bg-neutral-900/30 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                        <h2 class="text-lg font-medium text-white mb-2">${faq.question}</h2>
                        <p class="text-sm text-neutral-500 line-clamp-2">${faq.answer.substring(0, 150)}...</p>
                    </a>
                `).join('')}
            </div>
        </section>
    </main>

    <footer class="border-t border-white/5 bg-black py-12 px-6">
        <div class="max-w-7xl mx-auto text-center text-xs text-neutral-600">
            <p>© 2026 HARBOR Inc.</p>
        </div>
    </footer>
</body>
</html>`;

    const filePath = path.join(CONFIG.distDir, 'faq', slug, 'index.html');
    fs.writeFileSync(filePath, html);
    stats.pagesGenerated++;

    return {
        path: pagePath,
        title: category.name,
        type: 'faq-category',
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.6,
    };
}

/**
 * Generate individual FAQ page
 */
function generateFAQPage(faq, categorySlug, category) {
    const pagePath = `/faq/${categorySlug}/${faq.slug}.html`;

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'FAQ', url: '/faq/' },
        { name: category.name, url: `/faq/${categorySlug}/` },
        { name: faq.question.substring(0, 50) + '...', url: pagePath },
    ];

    const meta = metadata.generatePageMeta('faq', {
        question: faq.question,
        category: category.name,
        path: pagePath,
    });

    const schemaJson = schema.generatePageSchema('faq', {
        breadcrumbs,
        faqs: [faq],
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${metadata.renderMetaTags(meta)}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    ${schemaJson}
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: #fff; }
    </style>
</head>
<body class="bg-black text-neutral-300 antialiased">
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-white font-medium">⚓ HARBOR</a>
        </div>
    </nav>

    <main class="pt-24 pb-20 px-4 sm:px-6">
        <article class="max-w-3xl mx-auto">
            <nav class="mb-8 text-sm text-neutral-500">
                <a href="/" class="hover:text-white">Home</a> / 
                <a href="/faq/" class="hover:text-white">FAQ</a> / 
                <a href="/faq/${categorySlug}/" class="hover:text-white">${category.name}</a>
            </nav>

            <h1 class="text-3xl font-medium text-white mb-8">${faq.question}</h1>
            
            <div class="prose prose-invert max-w-none">
                <p class="text-lg text-neutral-300 leading-relaxed">${faq.answer}</p>
            </div>

            ${faq.tags ? `
            <div class="mt-8 pt-8 border-t border-white/10">
                <div class="flex flex-wrap gap-2">
                    ${faq.tags.map(tag => `
                        <span class="bg-white/5 border border-white/10 px-3 py-1 rounded text-sm text-neutral-400">${tag}</span>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <div class="mt-12 pt-8 border-t border-white/10">
                <h2 class="text-lg font-medium text-white mb-4">More questions about ${category.name}</h2>
                <div class="space-y-3">
                    ${category.faqs?.filter(f => f.slug !== faq.slug).slice(0, 3).map(f => `
                        <a href="/faq/${categorySlug}/${f.slug}.html" class="block text-neutral-400 hover:text-white transition-colors">
                            → ${f.question}
                        </a>
                    `).join('')}
                </div>
            </div>
        </article>
    </main>

    <footer class="border-t border-white/5 bg-black py-12 px-6">
        <div class="max-w-7xl mx-auto text-center text-xs text-neutral-600">
            <p>© 2026 HARBOR Inc.</p>
        </div>
    </footer>
</body>
</html>`;

    const filePath = path.join(CONFIG.distDir, 'faq', categorySlug, `${faq.slug}.html`);
    fs.writeFileSync(filePath, html);
    stats.pagesGenerated++;

    return {
        path: pagePath,
        title: faq.question,
        type: 'faq',
        category: categorySlug,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.5,
    };
}

/**
 * Generate sitemap.xml
 */
function generateSitemap(pages) {
    // Add static pages
    const staticPages = [
        { path: '/', priority: 1.0, changefreq: 'weekly' },
        { path: '/product.html', priority: 0.9, changefreq: 'monthly' },
        { path: '/datasets.html', priority: 0.9, changefreq: 'weekly' },
        { path: '/pricing.html', priority: 0.8, changefreq: 'monthly' },
        { path: '/about.html', priority: 0.7, changefreq: 'monthly' },
        { path: '/contact.html', priority: 0.7, changefreq: 'monthly' },
        { path: '/infrastructure.html', priority: 0.8, changefreq: 'monthly' },
        { path: '/ads.html', priority: 0.7, changefreq: 'monthly' },
    ];

    const allPages = [...staticPages, ...pages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `    <url>
        <loc>${CONFIG.baseUrl}${page.path}</loc>
        <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${page.changefreq || 'monthly'}</changefreq>
        <priority>${page.priority || 0.5}</priority>
    </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(CONFIG.distDir, 'sitemap.xml'), xml);
}

/**
 * Generate robots.txt
 */
function generateRobotsTxt() {
    const robots = `# HARBOR robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Disallow admin/internal paths
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
`;

    fs.writeFileSync(path.join(CONFIG.distDir, 'robots.txt'), robots);
}

// Utility functions
function loadJSON(filename) {
    const filePath = path.join(CONFIG.dataDir, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: ${filename} not found`);
        return {};
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function getCategoryColor(category) {
    const colors = {
        audio: 'blue',
        video: 'purple',
        multimodal: 'green',
    };
    return colors[category] || 'neutral';
}

function formatStat(value) {
    if (typeof value === 'number') {
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
        return value.toString();
    }
    return value;
}

// Run build
build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
