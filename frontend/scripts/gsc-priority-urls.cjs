#!/usr/bin/env node
/**
 * Google Search Console Batch Indexing Helper
 * Generates priority URL list for manual GSC submission
 * 
 * NOTE: Google's Indexing API only works for Job Postings and Livestreams.
 * For regular pages, use GSC URL Inspection "Request Indexing" manually.
 * This script generates a prioritized list for manual submission.
 * 
 * Run: node scripts/gsc-priority-urls.cjs
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://harborml.com';

// LEGO keywords prioritized (highest search volume)
const PRIORITY_LEGO_URLS = [
    // Tier 1: Highest volume (60K+)
    '/tools/lego-ideas',
    '/tools/lego-ideas/best-video-training-dataset',
    '/tools/lego-ideas/curated-video-annotation',
    '/tools/lego-ideas/premium-video-object-detection',

    // Tier 2: High volume (5K+)
    '/tools/lego-ideas-sets',
    '/tools/lego-ideas-sets/best-video-training-dataset',
    '/tools/lego-storage-ideas',
    '/tools/lego-build',
    '/tools/lego-building',

    // Tier 3: Medium-high volume  
    '/tools/lego-videos',
    '/tools/lego-videos/curated-video-training-dataset',
    '/tools/lego-tutorial',
    '/tools/lego-tutorial/best-video-tutorial-generation',
    '/tools/lego-moc',
    '/tools/lego-moc/best-video-building-recognition',
    '/tools/lego-stop-motion',
    '/tools/lego-timelapse',
    '/tools/lego-creations',
    '/tools/lego-sets',
    '/tools/lego-instructions',

    // Contributor pages (money pages)
    '/guides/contribute-lego-videos',
    '/guides/lego-video-dataset-earn-money',
    '/guides/how-to-film-lego-builds',

    // LEGO verticals
    '/tools/lego-builders',
    '/tools/lego-education',
    '/tools/lego-robotics',
    '/tools/building-toys',
    '/tools/diy-crafts',
];

// Core site pages
const CORE_PAGES = [
    '/',
    '/product',
    '/datasets',
    '/pricing',
    '/about',
    '/contact',
    '/blog',
    '/docs',
    '/use-cases',
    '/infrastructure',
];

function main() {
    console.log('📋 GSC Priority URL List Generator\n');
    console.log('='.repeat(60));
    console.log('PRIORITY ORDER FOR MANUAL GSC SUBMISSION');
    console.log('Submit these URLs first via GSC → URL Inspection → Request Indexing');
    console.log('='.repeat(60));

    const allUrls = [];

    // Add LEGO priority URLs first
    console.log('\n🧱 TIER 1: LEGO KEYWORDS (Submit First - Highest Traffic Potential)\n');
    PRIORITY_LEGO_URLS.forEach((url, i) => {
        const fullUrl = `${BASE_URL}${url}`;
        console.log(`${(i + 1).toString().padStart(2)}. ${fullUrl}`);
        allUrls.push(fullUrl);
    });

    console.log('\n📄 TIER 2: CORE SITE PAGES\n');
    CORE_PAGES.forEach((url, i) => {
        const fullUrl = `${BASE_URL}${url}`;
        console.log(`${(i + 1).toString().padStart(2)}. ${fullUrl}`);
        allUrls.push(fullUrl);
    });

    // Save to file
    const outputPath = path.join(__dirname, '../public/gsc-priority-urls.txt');
    fs.writeFileSync(outputPath, allUrls.join('\n'));

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Saved ${allUrls.length} priority URLs to: gsc-priority-urls.txt`);
    console.log('='.repeat(60));

    console.log('\n📌 INSTRUCTIONS:');
    console.log('1. Go to https://search.google.com/search-console');
    console.log('2. Select harborml.com property');
    console.log('3. Click URL Inspection (left sidebar)');
    console.log('4. Paste each URL above → Click "Request Indexing"');
    console.log('5. GSC allows ~10-50 requests per day');
    console.log('\nStart with LEGO URLs to attract video contributors!');
}

main();
