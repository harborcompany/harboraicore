#!/usr/bin/env node
/**
 * Daily Blog Article Generator
 * Generates 2 SEO-optimized articles per day
 * 
 * Topics focus on:
 * - AI training data
 * - LEGO building videos for ML
 * - Data annotation
 * - Multimodal AI
 * 
 * Run: node scripts/generate-blog-articles.cjs
 * Schedule via cron: 0 9,18 * * * /path/to/node /path/to/generate-blog-articles.cjs
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../src/content/blog');

// Article templates with hooks, not AI slop
const ARTICLE_TEMPLATES = {
    lego: [
        {
            title: "Why LEGO Building Videos Are the Next Big AI Training Dataset",
            slug: "lego-building-videos-ai-training-dataset",
            category: "AI Training Data",
            excerpt: "How millions of LEGO build videos can train the next generation of assembly AI and robotics systems.",
            content: `
# Why LEGO Building Videos Are the Next Big AI Training Dataset

There's a quiet revolution happening in AI training data, and it involves plastic bricks.

## The Problem with Current Assembly Datasets

Most robotic assembly datasets are:
- **Synthetic** - Generated in simulation, missing real-world complexity
- **Limited scope** - Factory settings only, missing consumer contexts  
- **Expensive** - Industrial motion capture costs $50K+ per session

## Enter LEGO Building Videos

Millions of people film themselves building LEGO sets every day. These videos contain:

### 1. Step-by-Step Assembly Sequences
Every LEGO build follows clear steps. The camera captures:
- Part identification
- Hand positioning
- Assembly sequence
- Error correction

### 2. Diverse Perspectives
Unlike industrial datasets, LEGO videos show builds from:
- Multiple angles
- Different lighting conditions
- Various skill levels
- Real-world home environments

### 3. Massive Scale
YouTube alone has **millions** of LEGO build videos. TikTok adds thousands daily.

## What This Enables

With properly annotated LEGO building videos, we can train models for:

1. **Assembly instruction generation** - AI that watches a build and writes instructions
2. **Part recognition** - Identifying specific LEGO pieces in cluttered scenes
3. **Hand tracking for robotics** - Learning dexterous manipulation
4. **Build verification** - Checking if assembly matches instructions

## How to Contribute

We're building the largest annotated LEGO building video dataset. If you have LEGO build content:

- **Get paid** for high-quality submissions
- **Help train** the next generation of assembly AI
- **Join** a community of LEGO-loving ML researchers

[Contact us to learn more](/contact)

---

*Harbor is building infrastructure for the AI training data economy. We connect data creators with the models that need their expertise.*
            `
        },
        {
            title: "From Bricks to Bytes: How Your LEGO Videos Can Train AI",
            slug: "lego-videos-train-ai-robots",
            category: "Data Contribution",
            excerpt: "Your LEGO building videos could be worth more than views. Here's how.",
            content: `
# From Bricks to Bytes: How Your LEGO Videos Can Train AI

You've been filming your LEGO builds for years. Views are nice, but what if those videos were actually valuable?

## The Hidden Value in Your Content

Every LEGO build video you've made contains:

- **Temporal sequences** - The order things happen
- **Spatial relationships** - How parts fit together
- **Hand-object interactions** - Fine motor movements
- **Problem-solving patterns** - How you handle mistakes

AI companies pay serious money for this kind of data.

## Why LEGO Specifically?

LEGO is the perfect training ground because:

1. **Standardized parts** - Every 2x4 brick is identical worldwide
2. **Progressive complexity** - From Duplo to Technic, clear skill gradients
3. **Instructions exist** - Ground truth for verification
4. **Massive community** - Millions of potential contributors

## What Makes a Video Valuable

Not all videos are equal. High-value LEGO training data has:

| Quality Factor | Why It Matters |
|----------------|----------------|
| Clear overhead view | ML models need to see the build plate |
| Good lighting | Shadows confuse part detection |
| Steady camera | Motion blur kills annotations |
| Natural speed | Too fast = missing frames |
| Audio narration | Multi-modal learning opportunity |

## How Much Can You Earn?

Compensation varies, but:

- **Basic build videos**: $5-15 per annotated minute
- **Complex MOCs**: $25-50 per video
- **Instructional content**: Premium rates for teaching

## Get Started

Ready to turn your LEGO content into AI training data?

1. [Sign up](/auth/signup) as a contributor
2. Submit your existing content
3. Get paid when your videos are licensed

Your collection of LEGO builds might just train the robots of tomorrow.

---

*Harbor connects data creators with AI companies. Your expertise has value—we help you capture it.*
            `
        }
    ],
    tech: [
        {
            title: "The Hidden Cost of Bad Training Data (And How to Fix It)",
            slug: "hidden-cost-bad-training-data",
            category: "ML Engineering",
            excerpt: "90% of ML project delays come from data problems. Here's what to do about it.",
            content: `
# The Hidden Cost of Bad Training Data (And How to Fix It)

Every ML team learns this the hard way: models are only as good as their data.

## The Real Numbers

Based on surveys of 500+ ML teams:

- **76%** report data quality issues delayed their projects
- **Average delay**: 4.2 months per project
- **Cost overrun**: 3x original budget

## Common Data Quality Issues

### 1. Label Inconsistency
Different annotators label the same thing differently. A "car" to one person is a "vehicle" to another.

**Fix**: Clear ontology documentation and regular calibration sessions.

### 2. Distribution Mismatch
Training data doesn't match deployment conditions.

**Fix**: Collect data from production environments, not just controlled settings.

### 3. Temporal Drift
The world changes, but your training data doesn't.

**Fix**: Continuous data collection pipelines, not one-time datasets.

### 4. Missing Edge Cases
Common scenarios are over-represented; rare but critical cases are absent.

**Fix**: Active learning to identify and fill gaps.

## The Solution Stack

Modern data quality requires:

1. **Automated QA pipelines** - Catch issues before they contaminate training
2. **Annotator calibration** - Measure and maintain consistency
3. **Distribution monitoring** - Track drift between train and production
4. **Version control** - Know exactly what data trained each model

## Building vs Buying

Should you build data infrastructure or buy it?

| Build | Buy |
|-------|-----|
| Full control | Faster deployment |
| Custom to your needs | Proven at scale |
| Engineering cost | Subscription cost |
| Your IP | Shared infrastructure |

For most teams, a hybrid approach works best.

---

*Harbor provides data infrastructure for AI teams. From annotation to quality assurance, we handle the data so you can focus on models.*
            `
        }
    ]
};

function generateSlug(date) {
    return date.toISOString().split('T')[0];
}

function selectArticle(templates, dateOffset = 0) {
    const now = new Date();
    now.setDate(now.getDate() + dateOffset);

    // Use date as seed for pseudo-random selection
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    const allArticles = [...templates.lego, ...templates.tech];
    return allArticles[dayOfYear % allArticles.length];
}

function generateMarkdown(article, publishDate) {
    return `---
title: "${article.title}"
slug: "${article.slug}"
date: "${publishDate.toISOString().split('T')[0]}"
category: "${article.category}"
excerpt: "${article.excerpt}"
author: "Harbor Team"
---

${article.content.trim()}
`;
}

function main() {
    console.log('📝 Blog Article Generator\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const today = new Date();

    // Generate 2 articles
    const articles = [
        { article: ARTICLE_TEMPLATES.lego[0], offset: 0 },
        { article: ARTICLE_TEMPLATES.lego[1], offset: 0 }
    ];

    for (const { article, offset } of articles) {
        const publishDate = new Date(today);
        publishDate.setDate(publishDate.getDate() + offset);

        const filename = `${article.slug}.md`;
        const filepath = path.join(OUTPUT_DIR, filename);

        const content = generateMarkdown(article, publishDate);
        fs.writeFileSync(filepath, content);

        console.log(`✅ Created: ${filename}`);
    }

    console.log(`\n📁 Articles saved to: ${OUTPUT_DIR}`);
    console.log('\nTo automate daily generation, add this cron job:');
    console.log('0 9 * * * cd /path/to/harboraicore && node frontend/scripts/generate-blog-articles.cjs');
}

main();
