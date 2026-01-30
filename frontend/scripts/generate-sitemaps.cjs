#!/usr/bin/env node
/**
 * Generate static sitemap XML files for pSEO pages
 * Run: node scripts/generate-sitemaps.js
 */

const fs = require('fs');
const path = require('path');

// Import matrix data (simplified version for script)
const MODIFIERS = [
    'best', 'premium', 'curated', 'enterprise', 'open-source',
    'synthetic', 'large-scale', 'domain-specific', 'diverse', 'annotated',
    'validated', 'structured', 'real-time', 'historical', 'multilingual',
    'multimodal', 'high-quality', 'scalable', 'custom', 'benchmark'
];

const USE_CASES = [
    'object-detection', 'image-classification', 'semantic-segmentation',
    'nlp-training', 'speech-recognition', 'translation', 'sentiment-analysis',
    'rlhf', 'fine-tuning', 'annotation', 'emotion-detection', 'action-recognition',
    'scene-understanding', 'pose-estimation', 'depth-estimation', 'vqa',
    'image-captioning', 'video-summarization', 'anomaly-detection', 'quality-assurance',
    'assembly-instructions', 'building-recognition', 'step-detection',
    'piece-identification', 'hand-tracking', 'construction-sequence',
    'build-verification', 'tutorial-generation'
];

const INDUSTRIES = [
    'autonomous-vehicles', 'healthcare', 'retail', 'manufacturing', 'finance',
    'media-entertainment', 'gaming', 'security-surveillance', 'agriculture',
    'robotics', 'smart-cities', 'education', 'legal', 'insurance', 'real-estate',
    'logistics', 'telecommunications', 'energy', 'aerospace', 'sports-analytics',
    // LEGO & Building verticals
    'lego-builders', 'lego-education', 'lego-robotics', 'building-toys', 'diy-crafts', 'toy-industry',
    // High-volume LEGO keywords
    'lego-ideas', 'lego-ideas-sets', 'lego-storage-ideas', 'lego-build', 'lego-building',
    'lego-moc', 'lego-projects', 'lego-techniques', 'lego-sets', 'lego-instructions',
    'lego-videos', 'lego-tutorial', 'lego-creations', 'lego-stop-motion', 'lego-timelapse'
];

const DATA_TYPES = [
    'video', 'image', 'audio', 'text', 'sensor', 'lidar', '3d-point-cloud',
    'medical-imaging', 'satellite', 'thermal', 'multimodal', 'speech',
    'document', 'tabular', 'graph', 'time-series'
];

const BASE_URL = 'https://harborml.com';
const OUTPUT_DIR = path.join(__dirname, '../public');
const MAX_URLS_PER_SITEMAP = 40000;

function generateUrlEntry(loc, priority = 0.7) {
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>2026-01-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSitemap(urls) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function main() {
    const allUrls = [];

    // Generate tool landing page URLs
    console.log('Generating tool landing page URLs...');
    for (const modifier of MODIFIERS) {
        for (const dataType of DATA_TYPES) {
            for (const useCase of USE_CASES) {
                for (const industry of INDUSTRIES) {
                    const slug = `${modifier}-${dataType}-${useCase}-${industry}`;
                    allUrls.push(generateUrlEntry(`${BASE_URL}/tools/${industry}/${slug}`));
                }
            }
        }
    }

    console.log(`Total URLs generated: ${allUrls.length.toLocaleString()}`);

    // Split into multiple sitemaps
    const sitemapCount = Math.ceil(allUrls.length / MAX_URLS_PER_SITEMAP);
    console.log(`Splitting into ${sitemapCount} sitemaps...`);

    for (let i = 0; i < sitemapCount; i++) {
        const start = i * MAX_URLS_PER_SITEMAP;
        const end = Math.min(start + MAX_URLS_PER_SITEMAP, allUrls.length);
        const chunk = allUrls.slice(start, end);

        const content = generateSitemap(chunk);
        const filename = `sitemap-tools-${i}.xml`;
        fs.writeFileSync(path.join(OUTPUT_DIR, filename), content);
        console.log(`  Created ${filename} with ${chunk.length.toLocaleString()} URLs`);
    }

    console.log('\n✅ Sitemaps generated successfully!');
    console.log(`Total pages: ${allUrls.length.toLocaleString()}`);
}

main();
