#!/usr/bin/env npx ts-node
/**
 * Database Population Script for pSEO Pages
 * Inserts generated pages into the PostgreSQL database via Prisma
 * 
 * Usage: npx ts-node scripts/populate-pseo-database.ts
 */

import { PrismaClient } from '@prisma/client';
import { generateAllPages, getPageCount } from '../data/keyword-matrix';

const prisma = new PrismaClient();
const BATCH_SIZE = 1000;

async function main() {
    console.log('\n🚀 Starting pSEO Database Population\n');
    console.log('='.repeat(50));

    // Get page count
    const { total, breakdown } = getPageCount();
    console.log(`\n📊 Expected Page Count: ${total.toLocaleString()}\n`);

    // Generate pages
    console.log('⚙️  Generating pages...');
    const startTime = Date.now();
    const pages = generateAllPages();
    console.log(`   Generated ${pages.length.toLocaleString()} pages in ${((Date.now() - startTime) / 1000).toFixed(2)}s\n`);

    // Check existing pages
    const existingCount = await prisma.seoPage.count();
    console.log(`📋 Existing pages in database: ${existingCount.toLocaleString()}`);

    if (existingCount > 0) {
        console.log('   Clearing existing pages...');
        await prisma.seoPage.deleteMany();
        console.log('   ✓ Cleared\n');
    }

    // Insert in batches
    console.log('💾 Inserting pages into database...');
    const insertStart = Date.now();
    let inserted = 0;

    for (let i = 0; i < pages.length; i += BATCH_SIZE) {
        const batch = pages.slice(i, i + BATCH_SIZE);

        await prisma.seoPage.createMany({
            data: batch.map(page => ({
                slug: page.slug,
                title: page.title,
                h1: page.h1,
                description: page.description,
                content: page as any, // Store full page data as JSON
                active: page.active,
            })),
            skipDuplicates: true,
        });

        inserted += batch.length;
        process.stdout.write(`   Progress: ${inserted.toLocaleString()}/${pages.length.toLocaleString()} (${((inserted / pages.length) * 100).toFixed(1)}%)\r`);
    }

    const insertTime = Date.now() - insertStart;
    console.log(`\n   ✓ Inserted ${inserted.toLocaleString()} pages in ${(insertTime / 1000).toFixed(2)}s\n`);

    // Verify
    console.log('🔍 Verifying...');
    const finalCount = await prisma.seoPage.count();
    console.log(`   Database now has: ${finalCount.toLocaleString()} pages`);

    // Sample random pages
    const samples = await prisma.seoPage.findMany({
        take: 5,
        orderBy: { createdAt: 'asc' },
    });

    console.log('\n📝 Sample pages:');
    for (const sample of samples) {
        console.log(`   - ${sample.slug}`);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE POPULATION COMPLETE\n');
    console.log(`   📄 Total Pages:     ${finalCount.toLocaleString()}`);
    console.log(`   ⏱️  Total Time:      ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
    console.log(`   ✅ 100K+ Target:    ${finalCount >= 100000 ? 'MET ✓' : 'NOT MET ✗'}`);
    console.log('\n' + '='.repeat(50) + '\n');

    await prisma.$disconnect();
}

main().catch(async (error) => {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
});
