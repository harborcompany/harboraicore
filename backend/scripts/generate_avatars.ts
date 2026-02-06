
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVATAR_DIR = path.join(__dirname, '../../frontend/public/avatars');

// Ensure directory exists
if (!fs.existsSync(AVATAR_DIR)) {
    fs.mkdirSync(AVATAR_DIR, { recursive: true });
}

// Initialize Gemini
const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || 'dummy_key';
const genAI = new GoogleGenerativeAI(apiKey);
// Using gemini-pro as standard, but we wrap in try/catch so it doesn't matter if it fails
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Agents Definition
const agents = [
    {
        slug: 'agent_marketing_v1',
        name: 'Marketing Content Agent',
        description: 'A creative, trendy, professional AI marketing strategist.',
    },
    {
        slug: 'agent_sales_v1',
        name: 'Sales Enablement Agent',
        description: 'A sharp, professional, corporate sales executive AI.',
    }
];

async function generateAvatar(agent: any) {
    console.log(`Generating avatar for ${agent.name} (${agent.slug})...`);

    let seed = '';

    try {
        // 1. Try to generate a creative seed using Gemini
        if (apiKey === 'dummy_key') throw new Error('No API Key');

        const prompt = `Generate a single short, unique, random string (max 10 chars) to be used as a random seed for an avatar generator. Base it loosely on this persona: ${agent.description}. Return ONLY the string.`;
        const result = await model.generateContent(prompt);
        seed = result.response.text().trim().replace(/\s/g, '');
        console.log(`   > Seed generated: ${seed}`);
    } catch (e: any) {
        // Fallback if Gemini fails (404, 401, etc)
        console.warn(`   ! Gemini generation failed (${e.message}), using fallback seed.`);
        // Create a deterministic but unique-looking seed based on agent slug + random hash
        seed = `${agent.slug}_${Math.floor(Math.random() * 10000)}`;
    }

    try {
        // 2. Fetch from DiceBear (Bottts style for Agents)
        // Using 'bottts-neutral' for professional agent look
        const style = 'bottts-neutral';
        const url = `https://api.dicebear.com/9.x/${style}/png?seed=${seed}&size=512&backgroundColor=transparent`;

        const imgResponse = await fetch(url);
        if (!imgResponse.ok) throw new Error(`Failed to fetch image: ${imgResponse.statusText}`);

        const buffer = await imgResponse.arrayBuffer();

        const filePath = path.join(AVATAR_DIR, `${agent.slug}.png`);
        fs.writeFileSync(filePath, Buffer.from(buffer));

        console.log(`✓ Saved to ${filePath}`);
    } catch (error: any) {
        console.error(`✗ Failed to save avatar for ${agent.slug}:`, error.message);
    }
}

async function main() {
    console.log('Starting Batch Avatar Generation (Gemini + DiceBear)...');

    for (const agent of agents) {
        await generateAvatar(agent);
    }

    console.log('Done.');
}

main();
