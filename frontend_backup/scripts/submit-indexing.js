#!/usr/bin/env node
/**
 * Google Indexing API Submitter
 * Submits all sitemap URLs for fast indexing
 * 
 * Setup:
 * 1. Create a Google Cloud project
 * 2. Enable the Indexing API
 * 3. Create a service account with Indexing API access
 * 4. Download the JSON key as 'google-service-account.json'
 * 5. Add the service account email as an owner in Search Console
 * 6. Run: npm install googleapis
 * 7. Run: node scripts/submit-indexing.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    sitemapPath: path.join(__dirname, '../dist/sitemap.xml'),
    serviceAccountPath: path.join(__dirname, '../google-service-account.json'),
    baseUrl: 'https://harbor.ai',
    batchSize: 100, // Google allows 200/day for new sites
    delayMs: 1000,  // Delay between requests
};

/**
 * Parse sitemap.xml and extract URLs
 */
function extractUrlsFromSitemap(sitemapPath) {
    const content = fs.readFileSync(sitemapPath, 'utf8');
    const urls = [];
    const regex = /<loc>(.*?)<\/loc>/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
    }

    return urls;
}

/**
 * Submit URLs to Google Indexing API
 */
async function submitToIndexingAPI(urls) {
    // Check if googleapis is available
    let google;
    try {
        google = require('googleapis').google;
    } catch (e) {
        console.log('\n⚠️  googleapis not installed. Run: npm install googleapis\n');
        console.log('For now, here are the URLs to manually submit in Search Console:\n');
        urls.forEach((url, i) => console.log(`${i + 1}. ${url}`));
        return;
    }

    // Check for service account
    if (!fs.existsSync(CONFIG.serviceAccountPath)) {
        console.log('\n⚠️  Service account key not found at:', CONFIG.serviceAccountPath);
        console.log('\nSetup instructions:');
        console.log('1. Go to https://console.cloud.google.com/');
        console.log('2. Create a project and enable "Indexing API"');
        console.log('3. Create a service account and download JSON key');
        console.log('4. Save as "google-service-account.json" in frontend/');
        console.log('5. Add service account email as owner in Search Console\n');

        console.log('URLs to submit manually:\n');
        urls.slice(0, 20).forEach((url, i) => console.log(`${i + 1}. ${url}`));
        return;
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: CONFIG.serviceAccountPath,
        scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing({ version: 'v3', auth });

    console.log(`\n📤 Submitting ${Math.min(urls.length, CONFIG.batchSize)} URLs to Google Indexing API...\n`);

    let submitted = 0;
    let errors = 0;

    for (const url of urls.slice(0, CONFIG.batchSize)) {
        try {
            await indexing.urlNotifications.publish({
                requestBody: {
                    url: url,
                    type: 'URL_UPDATED',
                },
            });
            submitted++;
            console.log(`✓ ${submitted}. ${url}`);

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, CONFIG.delayMs));
        } catch (error) {
            errors++;
            console.log(`✗ Error: ${url} - ${error.message}`);
        }
    }

    console.log(`\n========================================`);
    console.log(`Submitted: ${submitted}`);
    console.log(`Errors: ${errors}`);
    console.log(`========================================\n`);
}

/**
 * Generate ping URLs for search engines
 */
function generatePingUrls(sitemapUrl) {
    return [
        `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
        `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    ];
}

/**
 * Main function
 */
async function main() {
    console.log('🔍 HARBOR Indexing Submitter');
    console.log('============================\n');

    // Extract URLs from sitemap
    if (!fs.existsSync(CONFIG.sitemapPath)) {
        console.log('❌ Sitemap not found. Run build first: node scripts/build-pages.js');
        process.exit(1);
    }

    const urls = extractUrlsFromSitemap(CONFIG.sitemapPath);
    console.log(`Found ${urls.length} URLs in sitemap\n`);

    // Show ping URLs
    const sitemapUrl = `${CONFIG.baseUrl}/sitemap.xml`;
    console.log('📡 Ping these URLs to notify search engines:\n');
    generatePingUrls(sitemapUrl).forEach(url => console.log(`   ${url}\n`));

    // Try to submit via API
    await submitToIndexingAPI(urls);

    // Manual submission guide
    console.log('\n📋 Priority Pages to Submit Manually in Search Console:');
    console.log('(URL Inspection → Request Indexing)\n');

    const priorityPages = urls
        .sort((a, b) => {
            // Prioritize home, datasets hub, then detail pages
            if (a === `${CONFIG.baseUrl}/`) return -1;
            if (b === `${CONFIG.baseUrl}/`) return 1;
            if (a.includes('datasets.html')) return -1;
            if (b.includes('datasets.html')) return 1;
            return 0;
        })
        .slice(0, 10);

    priorityPages.forEach((url, i) => console.log(`${i + 1}. ${url}`));
}

main().catch(console.error);
