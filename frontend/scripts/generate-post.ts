#!/usr/bin/env npx ts-node
/**
 * Blog Post Generator Script
 * 
 * Usage:
 *   npx ts-node scripts/generate-post.ts
 *   npm run blog:generate
 * 
 * Environment:
 *   OPENAI_API_KEY - For blog content generation (optional, uses templates if missing)
 *   GEMINI_API_KEY - For image prompt generation and image creation
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { blogTopics, getNextTopic, slugify, BlogTopic } from '../src/lib/blog/keywords.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content/blog');
const IMAGES_DIR = path.join(__dirname, '../public/blog-images');
const USED_TOPICS_PATH = path.join(__dirname, '../src/lib/blog/used-topics.json');

// Generate image prompt using Gemini
async function generateImagePrompt(title: string, category: string): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (!geminiKey) {
        console.log('⚠️  No GEMINI_API_KEY found, using default image prompt');
        return getDefaultImagePrompt(title, category);
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Generate a concise image generation prompt for a blog article thumbnail. The image should be in the HarborML brand style: modern, tech-focused, using navy blue (#1e3a5f), white, and coral (#ff6b6b) as accent colors. Clean lines, subtle gradients, abstract representations.

Blog Title: "${title}"
Category: ${category}

Create a 1-2 sentence prompt that describes a professional, abstract illustration that captures the essence of this topic. Do NOT include any text or words in the image. Focus on visual metaphors and abstract tech imagery.

Return ONLY the image prompt, nothing else.`
                    }]
                }]
            })
        });

        const data = await response.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
        const prompt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (prompt) {
            console.log(`   🎨 Generated image prompt: "${prompt.slice(0, 80)}..."`);
            return prompt;
        }
    } catch (error) {
        console.error('Error generating image prompt with Gemini:', error);
    }

    return getDefaultImagePrompt(title, category);
}

// Default prompts based on category
function getDefaultImagePrompt(title: string, category: string): string {
    const prompts: Record<string, string> = {
        'voice-ai': 'Abstract sound waves transforming into AI neural network patterns, navy blue and coral gradient, modern tech aesthetic, clean minimalist design',
        'data-collection': 'Flowing data streams connecting diverse human silhouettes to a central hub, soft gradients in navy and white, modern illustration style',
        'gig-economy': 'Abstract illustration of flexible work icons (clock, home, laptop) floating in a connected network, navy blue with coral accents, clean lines',
        'ai-training': 'Neural network visualization with training data flowing through layers, abstract tech art, navy and coral color scheme, professional illustration',
        'industry': 'Interconnected industry icons forming a tech-forward pattern, abstract geometric shapes, navy blue and coral palette',
        'how-to': 'Step-by-step visual journey with connected nodes and pathways, clean modern illustration, navy and coral gradient accents'
    };

    return prompts[category] || prompts['voice-ai'];
}

// Generate image using Gemini Imagen
async function generateImage(prompt: string, slug: string): Promise<string | null> {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (!geminiKey) {
        console.log('   ⚠️  No GEMINI_API_KEY, skipping image generation');
        return null;
    }

    // Ensure images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    try {
        // Try Imagen 3 for image generation
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                instances: [{ prompt: prompt }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "16:9",
                    personGeneration: "DONT_ALLOW"
                }
            })
        });

        if (!response.ok) {
            console.log(`   ⚠️  Imagen API returned ${response.status}, trying alternative approach`);
            return await generateImageAlternative(prompt, slug, geminiKey);
        }

        const data = await response.json() as { predictions?: { bytesBase64Encoded?: string }[] };
        const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

        if (base64Image) {
            const imagePath = path.join(IMAGES_DIR, `${slug}.png`);
            fs.writeFileSync(imagePath, Buffer.from(base64Image, 'base64'));
            console.log(`   ✅ Generated image: ${slug}.png`);
            return `/blog-images/${slug}.png`;
        }
    } catch (error) {
        console.error('   Error with Imagen:', error);
    }

    return null;
}

// Alternative: Use Gemini to create a styled placeholder description
async function generateImageAlternative(prompt: string, slug: string, apiKey: string): Promise<string | null> {
    // For now, return a curated stock image based on the prompt keywords
    // In production, this could use Stability AI, DALL-E, or other services

    const stockImages: Record<string, string> = {
        'voice': 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=1200',
        'data': 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1200',
        'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
        'work': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
        'tech': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
        'recording': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200',
        'microphone': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200',
        'money': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200',
        'healthcare': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200'
    };

    // Find best matching stock image based on prompt keywords
    const promptLower = prompt.toLowerCase();
    for (const [keyword, url] of Object.entries(stockImages)) {
        if (promptLower.includes(keyword)) {
            console.log(`   📷 Using curated image for keyword: ${keyword}`);
            return url;
        }
    }

    // Default fallback
    return stockImages['ai'];
}

// OpenAI content generation with opinionated Substack style
async function generateContent(topic: BlogTopic): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.log('⚠️  No OPENAI_API_KEY found, using template-based generation');
        return generateTemplateContent(topic);
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a thoughtful writer for a high-quality newsletter about AI, machine learning, and data infrastructure—similar in tone to Stratechery, The Generalist, or top AI Substacks.

Style guidelines:
- Be OPINIONATED and take clear stances. Don't hedge everything.
- Write like you're explaining to a smart friend, not a corporate audience.
- Include concrete examples, numbers, and real-world implications.
- Acknowledge complexity and tradeoffs honestly.
- NEVER write promotional content or end with "contact us" CTAs.
- The reader should feel smarter after reading, not sold to.
- Be conversational but substantive. First-person "I think" is fine.
- Challenge conventional wisdom when appropriate.

Topics: AI training data, human-in-the-loop ML, data labeling economics, the gig economy of AI work, model fine-tuning, multimodal AI, synthetic vs. human data debates.

Do NOT include markdown headers in the content body—start directly with an engaging opening paragraph.`
                    },
                    {
                        role: 'user',
                        content: `Write a 700-900 word essay about "${topic.keyword}".

Title for context: ${topic.titleTemplate.replace('{year}', new Date().getFullYear().toString())}

Requirements:
- Open with a provocative observation or contrarian take
- Include 3-4 subheadings (use ## for H2) that advance an argument
- Reference real companies, papers, or trends where relevant
- End with a forward-looking thought, NOT a sales pitch
- Be specific—vague platitudes are boring

Write as if this is your personal essay, not corporate marketing.

Return ONLY the markdown content (no frontmatter).`
                    }
                ],
                temperature: 0.8,
                max_tokens: 1800
            })
        });

        const data = await response.json() as { choices?: { message?: { content?: string } }[]; error?: { message: string } };

        if (data.error) {
            console.error('OpenAI API error:', data.error.message);
            return generateTemplateContent(topic);
        }

        return data.choices?.[0]?.message?.content || generateTemplateContent(topic);
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        return generateTemplateContent(topic);
    }
}

// Template-based content generation - Opinionated Substack style
function generateTemplateContent(topic: BlogTopic): string {
    const year = new Date().getFullYear();
    const templates: Record<string, string> = {
        'voice-ai': `Here's an uncomfortable truth that most AI companies won't tell you: the voice assistant you use every day was trained on data collected from people who were paid pennies per hour—if they were paid at all.

## The Hidden Labor Behind Voice AI

When we talk about "breakthrough AI," we rarely talk about the thousands of hours of human recordings that made it possible. GPT-4's voice mode, Alexa's accent recognition, Siri's ability to understand your mumbly morning commands—all of this required massive amounts of human voice data.

The economics are stark: a single high-quality voice AI model requires 10,000+ hours of annotated speech. At fair wages, that's $150,000-$500,000 in data costs alone. Most companies... don't pay fair wages.

## Why Synthetic Data Won't Save Us (Yet)

The industry narrative is that synthetic data will replace human data collection. I'm skeptical. Here's why:

1. **Accent diversity**: Synthetic voices still struggle with the 7,000+ languages and countless regional accents humans speak
2. **Edge cases**: Real speech is messy—interruptions, background noise, emotional variation. Synthetic data is too clean.
3. **Cultural context**: How you speak to your doctor vs. your friend vs. your boss carries meaning that synthetic data can't capture

Will synthetic data handle 80% of use cases eventually? Probably. But that remaining 20% is where products actually differentiate.

## The Gig Economy of AI

What fascinates me is how AI training has created an entirely new labor category. It's not quite manufacturing, not quite creative work, not quite data entry. It's something new—and we haven't figured out how to value it.

The best comparison might be translation in the early internet era. Initially seen as commodity work, it eventually became recognized as skilled labor requiring cultural knowledge, not just language knowledge.

Voice data contribution is heading the same direction. The question is whether the industry will recognize that before burning through its workforce.

## What Actually Needs to Change

Three things would materially improve this space:

- **Transparent pricing**: Contributors should know what their data is worth and how it's being used
- **Attribution rights**: Some form of ongoing compensation when data is used across multiple models
- **Quality premiums**: Pay scales that reward expertise, not just volume

The companies that figure this out will have access to better data. It's not just ethics—it's competitive advantage.`,

        'data-collection': `The ${year} AI discourse is dominated by model architecture debates. Bigger transformers! More efficient attention! Novel training techniques!

Meanwhile, the actual limiting factor for most AI applications is far more mundane: getting enough high-quality training data.

## The Dirty Secret of Data Collection

I've talked to dozens of AI teams, and the pattern is consistent: they spend 70% of their time on data, 20% on infrastructure, and 10% on the "exciting" model work. Yet when they publish papers or announce products, they talk almost exclusively about that 10%.

Why? Partly because data work isn't glamorous. But mostly because admitting you need massive amounts of human-labeled data feels like admitting your AI isn't that intelligent.

## Three Models I'm Watching

The data collection space is fragmenting into distinct approaches:

**1. Crowd platforms (Scale, Surge, etc.)**
High volume, variable quality, racing to the bottom on price. Works for basic labeling tasks but struggles with nuance.

**2. Expert networks (domain-specific)**
Radiologists labeling medical images, lawyers reviewing contracts. Higher cost, dramatically better quality for specialized tasks.

**3. Contributor platforms**
The interesting middle ground—building ongoing relationships with data contributors who improve over time. More expensive than crowd work, but the data quality compounds.

## The Counterintuitive Economics

Here's what surprised me: paying more for data often reduces total costs.

A model trained on 1,000 hours of high-quality data frequently outperforms one trained on 10,000 hours of commodity data. When you factor in compute costs ($100+ per training hour for large models), the math reverses quickly.

The teams I see succeeding are treating data collection as a core competency, not a procurement problem to be outsourced.

## What Changes in 2026

My predictions:
- Synthetic data will handle ~40% of what humans do today
- The remaining human data work will become more specialized and better paid
- We'll see the first "data provenance" requirements in major AI regulation

The age of treating training data as an afterthought is ending. The age of data-centric AI is just beginning.`,

        'gig-economy': `I've been thinking about the parallels between early rideshare drivers and today's AI data contributors. The similarities—and differences—tell us something important about where this industry is heading.

## The Uber Comparison

In 2014, driving for Uber felt like free money. Flexible hours, decent pay, minimal oversight. Then the market saturated, incentives disappeared, and drivers realized the economics didn't work without bonuses.

AI data work in ${year} feels similar but not identical. The demand is genuine and growing—every new AI application needs training data. But the same dynamics are emerging: race-to-bottom pricing, inconsistent work availability, platforms capturing most of the value.

## What's Different This Time

Two structural differences matter:

**First, skill development is real.** Unlike driving, AI data work gets easier and more profitable as you learn. A contributor who understands what ML teams actually need produces 10x better data than a newcomer. This creates career paths that rideshare never did.

**Second, quality directly impacts outcomes.** A mediocre Uber ride is still a ride. Mediocre training data produces a model that hallucinates, fails on edge cases, or exhibits bias. Companies are learning—painfully—that cheap data is expensive.

## The Segmentation I'm Seeing

The market is splitting:

- **High-volume, low-skill**: Image tagging, basic transcription. Rates are falling fast. Will likely be automated.
- **Medium-skill, domain-specific**: Medical, legal, technical content. Stable demand, decent rates if you have expertise.
- **High-skill, relationship-based**: Custom datasets, quality auditing, data strategy consulting. Growing fast, paying well.

The people getting hurt are those stuck in category one. The people thriving are racing to category three.

## What Platforms Get Wrong

Most AI data platforms are optimized for throughput, not quality or contributor experience. They treat people as interchangeable units, measure success in tasks per hour, and wonder why quality is inconsistent.

The platforms that will win are the ones that recognize contributors as partners, invest in training, and create structures where quality work is rewarded.

## Advice if You're Starting Out

If you're considering this space:
- Specialize early. Generalist data work pays poorly.
- Build domain expertise. Know more about the subject than the people asking for data.
- Seek platforms with quality incentives. How they pay tells you how they think.

This isn't passive income. It's skilled work that the market is still learning to value correctly.`
    };

    // Map categories to available templates
    const categoryMap: Record<string, string> = {
        'voice-ai': 'voice-ai',
        'data-collection': 'data-collection',
        'gig-economy': 'gig-economy',
        'ai-training': 'voice-ai',
        'industry': 'data-collection',
        'how-to': 'gig-economy'
    };

    return templates[categoryMap[topic.category] || 'voice-ai'];
}

async function generateFrontmatter(topic: BlogTopic, imageUrl: string | null): Promise<string> {
    const year = new Date().getFullYear();
    const title = topic.titleTemplate.replace('{year}', year.toString());
    const slug = slugify(topic.keyword);
    const date = new Date().toISOString().split('T')[0];

    // Use generated image or fallback
    const thumbnail = imageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200';

    return `---
title: "${title}"
slug: "${slug}"
date: "${date}"
category: "${topic.category}"
author: "Harbor Team"
excerpt: "Everything you need to know about ${topic.keyword}. A comprehensive guide for ${topic.audience === 'contributor' ? 'voice contributors' : topic.audience === 'enterprise' ? 'AI teams' : 'everyone interested in AI'}."
keywords:
  - ${topic.keyword}
  - voice AI
  - data collection
  - AI training
thumbnail: "${thumbnail}"
---

`;
}

function loadUsedTopics(): string[] {
    try {
        if (fs.existsSync(USED_TOPICS_PATH)) {
            return JSON.parse(fs.readFileSync(USED_TOPICS_PATH, 'utf-8'));
        }
    } catch (e) {
        console.log('No used topics file found, starting fresh');
    }
    return [];
}

function saveUsedTopics(slugs: string[]): void {
    fs.writeFileSync(USED_TOPICS_PATH, JSON.stringify(slugs, null, 2));
}

async function main() {
    console.log('🚀 Starting blog post generation...\n');

    // Ensure content directory exists
    if (!fs.existsSync(CONTENT_DIR)) {
        fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }

    // Load used topics
    const usedSlugs = loadUsedTopics();
    console.log(`📊 ${usedSlugs.length} topics already used, ${blogTopics.length - usedSlugs.length} remaining\n`);

    // Get next topic
    const topic = getNextTopic(usedSlugs);
    if (!topic) {
        console.log('✅ All topics have been used! Consider adding more keywords.');
        return;
    }

    const slug = slugify(topic.keyword);
    const year = new Date().getFullYear();
    const title = topic.titleTemplate.replace('{year}', year.toString());

    console.log(`📝 Generating post for: "${topic.keyword}"`);
    console.log(`   Title: ${title}`);
    console.log(`   Category: ${topic.category}`);
    console.log(`   Audience: ${topic.audience}`);
    console.log(`   Priority: ${topic.priority}\n`);

    // Step 1: Generate image prompt using Gemini
    console.log('🎨 Generating contextual image...');
    const imagePrompt = await generateImagePrompt(title, topic.category);

    // Step 2: Generate image
    const imageUrl = await generateImage(imagePrompt, slug);

    // Step 3: Generate content
    console.log('\n📄 Generating blog content...');
    const content = await generateContent(topic);
    const frontmatter = await generateFrontmatter(topic, imageUrl);
    const fullPost = frontmatter + content;

    // Write file
    const filename = `${slug}.md`;
    const filepath = path.join(CONTENT_DIR, filename);
    fs.writeFileSync(filepath, fullPost);

    console.log(`\n✅ Created: ${filename}`);
    console.log(`   Path: ${filepath}`);
    if (imageUrl) {
        console.log(`   Image: ${imageUrl}`);
    }

    // Update used topics
    usedSlugs.push(slug);
    saveUsedTopics(usedSlugs);

    console.log('\n🎉 Done! New blog post generated successfully.');
}

main().catch(console.error);
