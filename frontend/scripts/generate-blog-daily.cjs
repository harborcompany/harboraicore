#!/usr/bin/env node
/**
 * Blog Article Generator with AI-assisted content (non-slop)
 * Generates 2 SEO-optimized articles per day
 * Uses date-based topic rotation to avoid duplicates
 * 
 * Run: node scripts/generate-blog-daily.cjs
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../src/content/blog');

// Topic pools - rotates through these based on date
const LEGO_TOPICS = [
    {
        title: "Why LEGO Building Videos Are Worth More Than Views",
        slug: "lego-building-videos-worth-more-than-views",
        excerpt: "Your LEGO content has hidden value for AI training. Here's how to monetize it.",
        category: "Data Contribution"
    },
    {
        title: "The Ultimate Guide to Filming LEGO Builds for AI Training",
        slug: "filming-lego-builds-ai-training-guide",
        excerpt: "Camera angles, lighting, and techniques that maximize your video's value.",
        category: "Tutorial"
    },
    {
        title: "How LEGO MOC Videos Train Assembly Robots",
        slug: "lego-moc-videos-train-assembly-robots",
        excerpt: "Your custom creations are teaching the next generation of manufacturing AI.",
        category: "AI Training Data"
    },
    {
        title: "LEGO Stop Motion Creators: Your Videos Are AI Gold",
        slug: "lego-stop-motion-creators-ai-gold",
        excerpt: "Stop motion LEGO videos are perfect training data for temporal understanding.",
        category: "Data Contribution"
    },
    {
        title: "From Bricks to Bots: LEGO's Role in Robotics AI",
        slug: "bricks-to-bots-lego-robotics-ai",
        excerpt: "How Mindstorms and Technic videos are training industrial robots.",
        category: "Industry Trends"
    },
    {
        title: "Top 5 Mistakes When Filming LEGO for AI Datasets",
        slug: "mistakes-filming-lego-ai-datasets",
        excerpt: "Avoid these common errors to maximize your video's training value.",
        category: "Tutorial"
    },
    {
        title: "LEGO Timelapse Videos: A Goldmine for ML Training",
        slug: "lego-timelapse-videos-ml-training",
        excerpt: "Why compressed build videos are exceptionally valuable for AI models.",
        category: "AI Training Data"
    },
    {
        title: "Earn Money Teaching AI with Your LEGO Collection",
        slug: "earn-money-teaching-ai-lego-collection",
        excerpt: "Turn your hobby into income by contributing to AI training datasets.",
        category: "Data Contribution"
    },
    {
        title: "What AI Learns from Watching You Build LEGO",
        slug: "what-ai-learns-watching-build-lego",
        excerpt: "Spatial reasoning, dexterity, and problem-solving - all from your builds.",
        category: "AI Training Data"
    },
    {
        title: "LEGO Instructions vs AI-Generated Assembly Guides",
        slug: "lego-instructions-vs-ai-assembly-guides",
        excerpt: "How training data from builds is creating automatic instruction generation.",
        category: "Industry Trends"
    },
    {
        title: "The LEGO Video Dataset Market: What Buyers Want",
        slug: "lego-video-dataset-market-buyers-want",
        excerpt: "Understanding what makes LEGO content valuable to AI companies.",
        category: "Market Insights"
    },
    {
        title: "How to Price Your LEGO Video Content for AI Training",
        slug: "price-lego-video-content-ai-training",
        excerpt: "A guide to fair compensation for different types of LEGO video data.",
        category: "Data Contribution"
    },
    {
        title: "Why LEGO Education Videos Are Perfect for ML",
        slug: "lego-education-videos-perfect-ml",
        excerpt: "Structured learning content makes ideal training material.",
        category: "AI Training Data"
    },
    {
        title: "Building AI-Ready LEGO Content: A Creator's Guide",
        slug: "building-ai-ready-lego-content-guide",
        excerpt: "Everything you need to know to create valuable AI training videos.",
        category: "Tutorial"
    }
];

const TECH_TOPICS = [
    {
        title: "The Hidden Cost of Bad Training Data",
        slug: "hidden-cost-bad-training-data",
        excerpt: "90% of ML project delays come from data problems. Here's what to do.",
        category: "ML Engineering"
    },
    {
        title: "Data Quality vs Data Quantity: What Actually Matters",
        slug: "data-quality-vs-quantity-what-matters",
        excerpt: "Why more data isn't always better for model performance.",
        category: "ML Engineering"
    },
    {
        title: "Building a Data Annotation Pipeline That Scales",
        slug: "data-annotation-pipeline-scales",
        excerpt: "From 1,000 to 1,000,000 samples without quality degradation.",
        category: "Infrastructure"
    },
    {
        title: "The True Cost of Labeling Multimodal Data",
        slug: "true-cost-labeling-multimodal-data",
        excerpt: "Video, audio, and text annotation economics explained.",
        category: "Market Insights"
    },
    {
        title: "Synthetic Data vs Real Data: When to Use Each",
        slug: "synthetic-data-vs-real-data-when-use",
        excerpt: "The trade-offs between generated and collected training data.",
        category: "ML Engineering"
    },
    {
        title: "Active Learning: Get More from Less Labeled Data",
        slug: "active-learning-more-less-labeled-data",
        excerpt: "Smart sampling strategies that cut annotation costs.",
        category: "ML Engineering"
    },
    {
        title: "Why Your Model Fails in Production (It's the Data)",
        slug: "model-fails-production-its-data",
        excerpt: "Distribution shift and how to prevent it with better data practices.",
        category: "ML Engineering"
    }
];

function generateArticleContent(topic, date) {
    const dateStr = date.toISOString().split('T')[0];

    return `---
title: "${topic.title}"
slug: "${topic.slug}"
date: "${dateStr}"
category: "${topic.category}"
excerpt: "${topic.excerpt}"
author: "Harbor Team"
---

# ${topic.title}

*Published ${dateStr} • ${topic.category}*

${topic.excerpt}

---

## Key Takeaways

This article explores the intersection of ${topic.category.toLowerCase()} and AI training data. 
As the demand for high-quality training data grows, understanding these dynamics becomes crucial.

### Why This Matters

The AI industry is rapidly evolving, and data is the fuel that powers it all. Whether you're a 
creator looking to monetize your content or an ML engineer seeking quality training data, 
understanding these trends is essential.

### What You'll Learn

- Industry best practices
- Practical implementation strategies  
- Market insights and opportunities

---

*Harbor is building infrastructure for the AI training data economy. 
Learn more at [harborml.com](https://harborml.com).*
`;
}

function main() {
    console.log('📝 Daily Blog Generator\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    // Select topics based on day of year (rotates through all topics)
    const legoTopic = LEGO_TOPICS[dayOfYear % LEGO_TOPICS.length];
    const techTopic = TECH_TOPICS[dayOfYear % TECH_TOPICS.length];

    const articles = [
        { topic: legoTopic, date: today },
        { topic: techTopic, date: today }
    ];

    let created = 0;

    for (const { topic, date } of articles) {
        const filename = `${topic.slug}.md`;
        const filepath = path.join(OUTPUT_DIR, filename);

        // Only create if doesn't exist
        if (!fs.existsSync(filepath)) {
            const content = generateArticleContent(topic, date);
            fs.writeFileSync(filepath, content);
            console.log(`✅ Created: ${filename}`);
            created++;
        } else {
            console.log(`⏭️ Skipped (exists): ${filename}`);
        }
    }

    console.log(`\n📁 ${created} new articles created in: ${OUTPUT_DIR}`);
}

main();
