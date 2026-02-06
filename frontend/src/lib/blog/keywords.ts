// Blog topic keywords for SEO-optimized content generation
// Organized by category for topical authority building

export interface BlogTopic {
    keyword: string;
    titleTemplate: string;
    category: 'voice-ai' | 'data-collection' | 'gig-economy' | 'ai-training' | 'industry' | 'how-to';
    searchIntent: 'informational' | 'commercial' | 'transactional';
    audience: 'contributor' | 'enterprise' | 'general';
    priority: 1 | 2 | 3; // 1 = high priority
}

export const blogTopics: BlogTopic[] = [
    // Voice AI - High Priority
    { keyword: 'voice data for AI training', titleTemplate: 'How Voice Data Powers AI Training in {year}', category: 'voice-ai', searchIntent: 'informational', audience: 'general', priority: 1 },
    { keyword: 'text to speech training data', titleTemplate: 'The Complete Guide to Text-to-Speech Training Data', category: 'voice-ai', searchIntent: 'informational', audience: 'enterprise', priority: 1 },
    { keyword: 'voice cloning dataset', titleTemplate: 'Building a Voice Cloning Dataset: Requirements & Best Practices', category: 'voice-ai', searchIntent: 'commercial', audience: 'enterprise', priority: 1 },
    { keyword: 'speech recognition accuracy', titleTemplate: 'Why Speech Recognition Still Struggles (And How Data Fixes It)', category: 'voice-ai', searchIntent: 'informational', audience: 'general', priority: 2 },
    { keyword: 'multilingual voice AI', titleTemplate: 'Multilingual Voice AI: The Data Challenge No One Talks About', category: 'voice-ai', searchIntent: 'informational', audience: 'enterprise', priority: 2 },
    { keyword: 'accent diversity in AI', titleTemplate: 'Why Accent Diversity Matters for Fair AI Systems', category: 'voice-ai', searchIntent: 'informational', audience: 'general', priority: 1 },
    { keyword: 'conversational AI training', titleTemplate: 'Training Conversational AI: Data Requirements Explained', category: 'voice-ai', searchIntent: 'commercial', audience: 'enterprise', priority: 2 },

    // Data Collection - Contributor Focused
    { keyword: 'get paid to record your voice', titleTemplate: 'How to Get Paid Recording Your Voice for AI in {year}', category: 'data-collection', searchIntent: 'transactional', audience: 'contributor', priority: 1 },
    { keyword: 'voice recording side hustle', titleTemplate: 'Voice Recording as a Side Hustle: What to Expect', category: 'data-collection', searchIntent: 'transactional', audience: 'contributor', priority: 1 },
    { keyword: 'AI data collection jobs', titleTemplate: 'AI Data Collection Jobs: The Complete Guide for Beginners', category: 'data-collection', searchIntent: 'transactional', audience: 'contributor', priority: 1 },
    { keyword: 'remote voice work', titleTemplate: 'Remote Voice Work: How to Earn From Home', category: 'data-collection', searchIntent: 'transactional', audience: 'contributor', priority: 2 },
    { keyword: 'data labeling jobs', titleTemplate: 'Data Labeling Jobs: Skills, Pay, and How to Start', category: 'data-collection', searchIntent: 'transactional', audience: 'contributor', priority: 2 },
    { keyword: 'crowdsourced AI data', titleTemplate: 'Crowdsourced AI Data: Why Companies Need You', category: 'data-collection', searchIntent: 'informational', audience: 'contributor', priority: 3 },

    // Gig Economy
    { keyword: 'AI gig economy', titleTemplate: 'The AI Gig Economy: A New Way to Earn Online', category: 'gig-economy', searchIntent: 'informational', audience: 'contributor', priority: 1 },
    { keyword: 'flexible AI jobs', titleTemplate: 'Flexible AI Jobs You Can Do From Anywhere', category: 'gig-economy', searchIntent: 'transactional', audience: 'contributor', priority: 2 },
    { keyword: 'earn money with AI', titleTemplate: 'How Regular People Are Earning Money With AI (Not Prompts)', category: 'gig-economy', searchIntent: 'commercial', audience: 'contributor', priority: 1 },
    { keyword: 'work from home AI jobs', titleTemplate: 'Work From Home AI Jobs That Actually Pay', category: 'gig-economy', searchIntent: 'transactional', audience: 'contributor', priority: 1 },
    { keyword: 'passive income AI data', titleTemplate: 'Can You Earn Passive Income From AI Data? The Truth', category: 'gig-economy', searchIntent: 'informational', audience: 'contributor', priority: 3 },

    // AI Training - Technical
    { keyword: 'RLHF training data', titleTemplate: 'RLHF Training Data: What It Is and Why It Matters', category: 'ai-training', searchIntent: 'informational', audience: 'enterprise', priority: 2 },
    { keyword: 'synthetic vs real training data', titleTemplate: 'Synthetic vs Real Training Data: The Definitive Comparison', category: 'ai-training', searchIntent: 'informational', audience: 'enterprise', priority: 1 },
    { keyword: 'AI model accuracy data quality', titleTemplate: 'How Data Quality Directly Impacts AI Model Accuracy', category: 'ai-training', searchIntent: 'informational', audience: 'enterprise', priority: 1 },
    { keyword: 'video annotation for AI', titleTemplate: 'Video Annotation for AI: Techniques and Challenges', category: 'ai-training', searchIntent: 'commercial', audience: 'enterprise', priority: 2 },
    { keyword: 'multimodal AI datasets', titleTemplate: 'Building Multimodal AI Datasets: Audio, Video, and Text', category: 'ai-training', searchIntent: 'commercial', audience: 'enterprise', priority: 2 },
    { keyword: 'AI training data pipeline', titleTemplate: 'Designing an AI Training Data Pipeline That Scales', category: 'ai-training', searchIntent: 'commercial', audience: 'enterprise', priority: 3 },

    // Industry Use Cases
    { keyword: 'voice AI healthcare', titleTemplate: 'Voice AI in Healthcare: Applications and Data Needs', category: 'industry', searchIntent: 'commercial', audience: 'enterprise', priority: 2 },
    { keyword: 'AI customer service training', titleTemplate: 'Training AI for Customer Service: A Data Perspective', category: 'industry', searchIntent: 'commercial', audience: 'enterprise', priority: 2 },
    { keyword: 'automotive voice assistant data', titleTemplate: 'Voice Assistants in Cars: The Data Behind the Wheel', category: 'industry', searchIntent: 'informational', audience: 'enterprise', priority: 3 },
    { keyword: 'smart home voice data', titleTemplate: 'Smart Home Voice Control: What Data Makes It Work', category: 'industry', searchIntent: 'informational', audience: 'general', priority: 3 },
    { keyword: 'accessibility AI voice', titleTemplate: 'Voice AI for Accessibility: Building Inclusive Technology', category: 'industry', searchIntent: 'informational', audience: 'general', priority: 2 },

    // How-To Guides
    { keyword: 'how to record voice for AI', titleTemplate: 'How to Record Your Voice for AI: A Step-by-Step Guide', category: 'how-to', searchIntent: 'informational', audience: 'contributor', priority: 1 },
    { keyword: 'best microphone for voice recording', titleTemplate: 'Best Microphones for Voice Recording (Budget to Pro)', category: 'how-to', searchIntent: 'commercial', audience: 'contributor', priority: 2 },
    { keyword: 'quiet recording space tips', titleTemplate: 'How to Create a Quiet Recording Space at Home', category: 'how-to', searchIntent: 'informational', audience: 'contributor', priority: 2 },
    { keyword: 'voice recording best practices', titleTemplate: 'Voice Recording Best Practices for AI Training Data', category: 'how-to', searchIntent: 'informational', audience: 'contributor', priority: 1 },
    { keyword: 'audio quality for AI', titleTemplate: 'Audio Quality Standards for AI Training: What You Need', category: 'how-to', searchIntent: 'informational', audience: 'contributor', priority: 2 },
];

// Track which topics have been used
export const usedTopicsPath = 'src/lib/blog/used-topics.json';

// Helper to get next topic
export function getNextTopic(usedSlugs: string[]): BlogTopic | null {
    const unused = blogTopics.filter(t => !usedSlugs.includes(slugify(t.keyword)));
    if (unused.length === 0) return null;

    // Prioritize by priority level
    const priority1 = unused.filter(t => t.priority === 1);
    if (priority1.length > 0) return priority1[Math.floor(Math.random() * priority1.length)];

    const priority2 = unused.filter(t => t.priority === 2);
    if (priority2.length > 0) return priority2[Math.floor(Math.random() * priority2.length)];

    return unused[Math.floor(Math.random() * unused.length)];
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
