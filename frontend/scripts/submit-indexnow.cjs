#!/usr/bin/env node
/**
 * IndexNow Bulk Submission Script
 * Submits URLs to Bing/Yandex for instant indexing
 * Features: Robust retry logic, exponential backoff, reduced batch size
 * Run: node scripts/submit-indexnow.cjs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const INDEXNOW_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
const HOST = 'harborml.com';
const BATCH_SIZE = 500; // Drastically reduced to ensure delivery
const INITIAL_DELAY_MS = 2000;
const MAX_RETRIES = 5;

// Load URLs from sitemaps
function extractUrlsFromSitemap(sitemapPath) {
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const urls = [];
    const regex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

async function submitToIndexNow(urls, attempt = 1) {
    const payload = JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls
    });

    const options = {
        hostname: 'api.indexnow.org',
        port: 443,
        path: '/indexnow',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                // Handle Rate Limiting (429) and Server Errors
                if (res.statusCode === 429 || res.statusCode >= 500) {
                    if (attempt <= MAX_RETRIES) {
                        const delay = Math.pow(2, attempt) * 5000 + (Math.random() * 1000); // Exponential backoff + jitter
                        console.log(`    ⚠️ Rate limit hit (Status: ${res.statusCode}). Retrying in ${(delay/1000).toFixed(1)}s (Attempt ${attempt}/${MAX_RETRIES})...`);
                        await new Promise(r => setTimeout(r, delay));
                        try {
                            const retryResult = await submitToIndexNow(urls, attempt + 1);
                            resolve(retryResult);
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        resolve({ status: res.statusCode, data, error: 'Max retries exceeded' });
                    }
                } else {
                    resolve({ status: res.statusCode, data });
                }
            });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

async function main() {
    console.log('🚀 IndexNow Bulk Submission Starting (Robust Mode)...\n');
    
    const publicDir = path.join(__dirname, '../public');
    const sitemapFiles = fs.readdirSync(publicDir)
        .filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'));
    
    let allUrls = [];
    
    // Extract all URLs from sitemaps
    for (const file of sitemapFiles) {
        const urls = extractUrlsFromSitemap(path.join(publicDir, file));
        allUrls = allUrls.concat(urls);
    }
    
    console.log(`Total URLs to submit: ${allUrls.length.toLocaleString()}`);
    
    // Submit in batches
    const batches = Math.ceil(allUrls.length / BATCH_SIZE);
    console.log(`Submitting in ${batches} batches (Size: ${BATCH_SIZE})...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < batches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, allUrls.length);
        const batch = allUrls.slice(start, end);
        
        try {
            const result = await submitToIndexNow(batch);
            if (result.status === 200 || result.status === 202) {
                successCount += batch.length;
                console.log(`  ✅ Batch ${i + 1}/${batches}: ${batch.length} URLs submitted (Status: ${result.status})`);
            } else {
                errorCount += batch.length;
                console.log(`  ❌ Batch ${i + 1}/${batches}: Failed (Status: ${result.status})`);
            }
        } catch (err) {
            errorCount += batch.length;
            console.log(`  ❌ Batch ${i + 1}/${batches}: Error - ${err.message}`);
        }
        
        // Steady delay between successful batches
        await new Promise(r => setTimeout(r, 2000));
    }
    
    console.log('\n========================================');
    console.log(`✅ Successfully submitted: ${successCount.toLocaleString()}`);
    console.log(`❌ Errors: ${errorCount.toLocaleString()}`);
    console.log('========================================');
}

main().catch(console.error);
