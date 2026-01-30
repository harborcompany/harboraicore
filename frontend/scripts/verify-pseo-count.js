#!/usr/bin/env node
/**
 * Page Generation Script - Proof of 100K+ Pages
 * Run with: node scripts/verify-pseo-count.js
 */

const { generateAllPages, getPageCount } = require('../data/keyword-matrix');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 Starting pSEO Page Generation\n');
console.log('='.repeat(50));

const { total, breakdown } = getPageCount();
console.log('\n📊 Page Count Breakdown:');
console.log('   Tool Landing Pages: ' + breakdown.toolLanding.toLocaleString());
console.log('   Comparison Pages:   ' + breakdown.comparisons.toLocaleString());
console.log('   Guide Pages:        ' + breakdown.guides.toLocaleString());
console.log('   Hub Pages:          ' + breakdown.hubs.toLocaleString());
console.log('   Additional Tools:   ' + breakdown.additionalTools.toLocaleString());
console.log('   ─────────────────────────────────────────');
console.log('   TOTAL:              ' + total.toLocaleString() + ' pages\n');

console.log('⚙️  Generating pages (this may take a moment)...');
const startTime = Date.now();
const pages = generateAllPages();
const genTime = Date.now() - startTime;
console.log('   Generated ' + pages.length.toLocaleString() + ' pages in ' + (genTime / 1000).toFixed(2) + 's\n');

// Ensure directory exists
const DATA_DIR = path.join(__dirname, '../data/pseo');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Build category counts
const categoryStats = {};
for (const page of pages) {
    categoryStats[page.category] = (categoryStats[page.category] || 0) + 1;
}

// Create stats object
const stats = {
    generatedAt: new Date().toISOString(),
    totalPages: pages.length,
    targetMet: pages.length >= 100000,
    breakdown: breakdown,
    categories: categoryStats,
    samplePages: pages.slice(0, 20).map(p => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        template: p.template,
    })),
};

// Write proof files
fs.writeFileSync(path.join(DATA_DIR, 'stats.json'), JSON.stringify(stats, null, 2));
console.log('💾 Wrote stats.json with proof of generation');

// Write master index (first 1000 for reference)
const indexData = {
    totalPages: pages.length,
    generatedAt: stats.generatedAt,
    sampleSlugs: pages.slice(0, 1000).map(p => p.slug),
};
fs.writeFileSync(path.join(DATA_DIR, 'index.json'), JSON.stringify(indexData, null, 2));
console.log('📇 Wrote index.json with page catalog\n');

// Summary
console.log('='.repeat(50));
console.log('✅ GENERATION COMPLETE\n');
console.log('   📄 Total Pages:     ' + pages.length.toLocaleString());
console.log('   ⏱️  Generation Time: ' + (genTime / 1000).toFixed(2) + 's');
console.log('   💾 Proof Files:     data/pseo/stats.json, data/pseo/index.json');
console.log('');
console.log('   Categories:');
Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log('     - ' + cat + ': ' + count.toLocaleString());
});
console.log('');
console.log('   🎯 100K+ TARGET: ' + (pages.length >= 100000 ? 'MET ✓' : 'NOT MET'));
console.log('='.repeat(50) + '\n');
