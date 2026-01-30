#!/usr/bin/env node
/**
 * Ping Search Engines Script
 * Notifies all major search engines about sitemap updates
 * Run: node scripts/ping-search-engines.cjs
 */

const https = require('https');
const http = require('http');

const SITEMAP_URL = 'https://harborml.com/sitemap-index.xml';

const SEARCH_ENGINES = [
    {
        name: 'Google',
        url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    {
        name: 'Bing',
        url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    {
        name: 'Yandex',
        url: `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    {
        name: 'IndexNow (Bing)',
        url: `https://www.bing.com/indexnow?url=${encodeURIComponent(SITEMAP_URL)}&key=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
    },
    {
        name: 'IndexNow (Yandex)',
        url: `https://yandex.com/indexnow?url=${encodeURIComponent(SITEMAP_URL)}&key=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
    }
];

async function pingEngine(engine) {
    return new Promise((resolve) => {
        const protocol = engine.url.startsWith('https') ? https : http;

        protocol.get(engine.url, (res) => {
            resolve({ name: engine.name, status: res.statusCode, success: res.statusCode < 400 });
        }).on('error', (err) => {
            resolve({ name: engine.name, status: 0, success: false, error: err.message });
        });
    });
}

async function main() {
    console.log('🔔 Pinging Search Engines...\n');
    console.log(`Sitemap: ${SITEMAP_URL}\n`);

    const results = await Promise.all(SEARCH_ENGINES.map(pingEngine));

    console.log('Results:');
    console.log('─'.repeat(50));

    for (const result of results) {
        const icon = result.success ? '✅' : '❌';
        const status = result.error ? `Error: ${result.error}` : `Status: ${result.status}`;
        console.log(`${icon} ${result.name.padEnd(20)} ${status}`);
    }

    console.log('─'.repeat(50));
    console.log('\nDone! Search engines have been notified.');
}

main().catch(console.error);
