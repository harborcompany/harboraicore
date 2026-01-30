#!/usr/bin/env npx ts-node
/**
 * Page Generation Script
 * Generates 100,000+ pSEO pages and populates the database
 * 
 * Usage: npx ts-node scripts/generate-pseo-pages.ts
 */

import { generateAllPages, getPageCount } from '../data/keyword-matrix';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '../data/pseo');
const BATCH_SIZE = 5000;

async function main() {
    console.log('\n🚀 Starting pSEO Page Generation\n');
    console.log('='.repeat(50));

    // Get page count first
    const { total, breakdown } = getPageCount();
    console.log(`\n📊 Page Count Breakdown:`);
    console.log(`   Tool Landing Pages: ${breakdown.toolLanding.toLocaleString()}`);
    console.log(`   Comparison Pages:   ${breakdown.comparisons.toLocaleString()}`);
    console.log(`   Guide Pages:        ${breakdown.guides.toLocaleString()}`);
    console.log(`   Hub Pages:          ${breakdown.hubs.toLocaleString()}`);
    console.log(`   Additional Tools:   ${breakdown.additionalTools.toLocaleString()}`);
    console.log(`   ─────────────────────────────────`);
    console.log(`   TOTAL:              ${total.toLocaleString()} pages\n`);

    // Create data directory
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Generate pages
    console.log('⚙️  Generating pages...');
    const startTime = Date.now();
    const pages = generateAllPages();
    const generationTime = Date.now() - startTime;
    console.log(`   Generated ${pages.length.toLocaleString()} pages in ${(generationTime / 1000).toFixed(2)}s\n`);

    // Group by category
    const byCategory: Record<string, typeof pages> = {};
    for (const page of pages) {
        if (!byCategory[page.category]) {
            byCategory[page.category] = [];
        }
        byCategory[page.category].push(page);
    }

    // Write category directories and files
    console.log('💾 Writing files...');
    let filesWritten = 0;

    for (const [category, categoryPages] of Object.entries(byCategory)) {
        const categoryDir = path.join(DATA_DIR, category);
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }

        // Write individual page files (in batches for performance)
        for (let i = 0; i < categoryPages.length; i += BATCH_SIZE) {
            const batch = categoryPages.slice(i, i + BATCH_SIZE);
            for (const page of batch) {
                const filePath = path.join(categoryDir, `${page.slug}.json`);
                fs.writeFileSync(filePath, JSON.stringify(page, null, 2));
                filesWritten++;
            }
            process.stdout.write(`   ${category}: ${Math.min(i + BATCH_SIZE, categoryPages.length)}/${categoryPages.length}\r`);
        }
        console.log(`   ${category}: ${categoryPages.length.toLocaleString()} pages ✓`);

        // Write category index
        const indexPath = path.join(categoryDir, 'index.json');
        const indexData = categoryPages.map(p => ({
            slug: p.slug,
            title: p.title,
            category: p.category,
            description: p.description,
            template: p.template,
            priority: p.priority,
            updatedAt: p.updatedAt,
        }));
        fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
    }

    // Write master index
    console.log('\n📇 Writing master index...');
    const masterIndex = pages.map(p => ({
        category: p.category,
        slug: p.slug,
    }));
    fs.writeFileSync(path.join(DATA_DIR, 'index.json'), JSON.stringify(masterIndex, null, 2));

    // Write all-pages.json for search
    console.log('📚 Writing all-pages.json...');
    const allPagesData = pages.map(p => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        description: p.description,
        template: p.template,
        priority: p.priority,
        updatedAt: p.updatedAt,
    }));
    fs.writeFileSync(path.join(DATA_DIR, 'all-pages.json'), JSON.stringify(allPagesData, null, 2));

    // Write stats
    const stats = {
        generatedAt: new Date().toISOString(),
        totalPages: pages.length,
        breakdown,
        categories: Object.fromEntries(
            Object.entries(byCategory).map(([k, v]) => [k, v.length])
        ),
    };
    fs.writeFileSync(path.join(DATA_DIR, 'stats.json'), JSON.stringify(stats, null, 2));

    // Summary
    const totalTime = Date.now() - startTime;
    console.log('\n' + '='.repeat(50));
    console.log('✅ GENERATION COMPLETE\n');
    console.log(`   📄 Total Pages:     ${pages.length.toLocaleString()}`);
    console.log(`   📁 Files Written:   ${filesWritten.toLocaleString()}`);
    console.log(`   ⏱️  Total Time:      ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`   💾 Output:          ${DATA_DIR}`);
    console.log('\n' + '='.repeat(50));

    // Verification
    console.log('\n🔍 VERIFICATION:\n');
    console.log(`   Pages generated: ${pages.length >= 100000 ? '✅' : '⚠️'} ${pages.length.toLocaleString()} ${pages.length >= 100000 ? '(100K+ target met)' : '(below 100K target)'}`);

    // If under 100K, show how to scale
    if (pages.length < 100000) {
        const needed = 100000 - pages.length;
        console.log(`\n   📈 To reach 100K+, add ${needed.toLocaleString()} more combinations by:`);
        console.log(`      - Adding ${Math.ceil(needed / (25 * 20 * 8))} more modifiers, OR`);
        console.log(`      - Adding ${Math.ceil(needed / (10 * 20 * 8))} more use cases, OR`);
        console.log(`      - Adding ${Math.ceil(needed / (10 * 25 * 8))} more industries`);
    }
}

main().catch(console.error);
