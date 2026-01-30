/**
 * Keyword Matrix Generator
 * Generates 100,000+ unique page combinations for pSEO
 * 
 * Math: 5 categories × 20 industries × 25 use cases × 10 modifiers × 8 data types = 200,000 combinations
 * We'll generate a subset for practical use
 */

export interface KeywordEntity {
    value: string;
    slug: string;
    variations?: string[];
}

// ==============================================
// MODIFIERS (20 options)
// ==============================================
export const MODIFIERS: KeywordEntity[] = [
    { value: 'Best', slug: 'best' },
    { value: 'Top', slug: 'top' },
    { value: 'Premium', slug: 'premium' },
    { value: 'Enterprise', slug: 'enterprise' },
    { value: 'Open Source', slug: 'open-source' },
    { value: 'Free', slug: 'free' },
    { value: 'Affordable', slug: 'affordable' },
    { value: 'High-Quality', slug: 'high-quality' },
    { value: 'Production-Ready', slug: 'production-ready' },
    { value: 'Scalable', slug: 'scalable' },
    { value: 'Custom', slug: 'custom' },
    { value: 'Curated', slug: 'curated' },
    { value: 'Labeled', slug: 'labeled' },
    { value: 'Synthetic', slug: 'synthetic' },
    { value: 'Real-World', slug: 'real-world' },
    { value: 'Diverse', slug: 'diverse' },
    { value: 'Balanced', slug: 'balanced' },
    { value: 'Large-Scale', slug: 'large-scale' },
    { value: 'Multi-Language', slug: 'multi-language' },
    { value: 'Domain-Specific', slug: 'domain-specific' },
];

// ==============================================
// USE CASES (25 options)
// ==============================================
export const USE_CASES: KeywordEntity[] = [
    { value: 'Training', slug: 'training' },
    { value: 'Fine-Tuning', slug: 'fine-tuning' },
    { value: 'Evaluation', slug: 'evaluation' },
    { value: 'Annotation', slug: 'annotation' },
    { value: 'RLHF', slug: 'rlhf' },
    { value: 'Pre-Training', slug: 'pre-training' },
    { value: 'Transfer Learning', slug: 'transfer-learning' },
    { value: 'Benchmarking', slug: 'benchmarking' },
    { value: 'Validation', slug: 'validation' },
    { value: 'Testing', slug: 'testing' },
    { value: 'Object Detection', slug: 'object-detection' },
    { value: 'Segmentation', slug: 'segmentation' },
    { value: 'Classification', slug: 'classification' },
    { value: 'Speech Recognition', slug: 'speech-recognition' },
    { value: 'Speaker Diarization', slug: 'speaker-diarization' },
    { value: 'Emotion Detection', slug: 'emotion-detection' },
    { value: 'Action Recognition', slug: 'action-recognition' },
    { value: 'Scene Understanding', slug: 'scene-understanding' },
    { value: 'Pose Estimation', slug: 'pose-estimation' },
    { value: 'Depth Estimation', slug: 'depth-estimation' },
    { value: 'Visual Question Answering', slug: 'vqa' },
    { value: 'Image Captioning', slug: 'image-captioning' },
    { value: 'Video Summarization', slug: 'video-summarization' },
    { value: 'Anomaly Detection', slug: 'anomaly-detection' },
    { value: 'Quality Assurance', slug: 'quality-assurance' },
    // LEGO-specific use cases
    { value: 'Assembly Instructions', slug: 'assembly-instructions' },
    { value: 'Building Recognition', slug: 'building-recognition' },
    { value: 'Step Detection', slug: 'step-detection' },
    { value: 'Piece Identification', slug: 'piece-identification' },
    { value: 'Hand Tracking', slug: 'hand-tracking' },
    { value: 'Construction Sequence', slug: 'construction-sequence' },
    { value: 'Build Verification', slug: 'build-verification' },
    { value: 'Tutorial Generation', slug: 'tutorial-generation' },
];

// ==============================================
// INDUSTRIES (20 options)
// ==============================================
export const INDUSTRIES: KeywordEntity[] = [
    { value: 'Autonomous Vehicles', slug: 'autonomous-vehicles' },
    { value: 'Healthcare', slug: 'healthcare' },
    { value: 'Retail', slug: 'retail' },
    { value: 'Manufacturing', slug: 'manufacturing' },
    { value: 'Finance', slug: 'finance' },
    { value: 'Media & Entertainment', slug: 'media-entertainment' },
    { value: 'Gaming', slug: 'gaming' },
    { value: 'Security & Surveillance', slug: 'security-surveillance' },
    { value: 'Agriculture', slug: 'agriculture' },
    { value: 'Robotics', slug: 'robotics' },
    { value: 'Smart Cities', slug: 'smart-cities' },
    { value: 'Education', slug: 'education' },
    { value: 'Legal', slug: 'legal' },
    { value: 'Insurance', slug: 'insurance' },
    { value: 'Real Estate', slug: 'real-estate' },
    { value: 'Logistics', slug: 'logistics' },
    { value: 'Telecommunications', slug: 'telecommunications' },
    { value: 'Energy', slug: 'energy' },
    { value: 'Aerospace', slug: 'aerospace' },
    { value: 'Sports Analytics', slug: 'sports-analytics' },
    // LEGO & Building Toys verticals
    { value: 'LEGO Builders', slug: 'lego-builders' },
    { value: 'LEGO Education', slug: 'lego-education' },
    { value: 'LEGO Robotics', slug: 'lego-robotics' },
    { value: 'Building Toys', slug: 'building-toys' },
    { value: 'DIY & Crafts', slug: 'diy-crafts' },
    { value: 'Toy Industry', slug: 'toy-industry' },
    // High-volume LEGO keywords (60K+ monthly searches)
    { value: 'LEGO Ideas', slug: 'lego-ideas' },
    { value: 'LEGO Ideas Sets', slug: 'lego-ideas-sets' },
    { value: 'LEGO Storage Ideas', slug: 'lego-storage-ideas' },
    { value: 'LEGO Build', slug: 'lego-build' },
    { value: 'LEGO Building', slug: 'lego-building' },
    { value: 'LEGO MOC', slug: 'lego-moc' },
    { value: 'LEGO Projects', slug: 'lego-projects' },
    { value: 'LEGO Techniques', slug: 'lego-techniques' },
    { value: 'LEGO Sets', slug: 'lego-sets' },
    { value: 'LEGO Instructions', slug: 'lego-instructions' },
    { value: 'LEGO Videos', slug: 'lego-videos' },
    { value: 'LEGO Tutorial', slug: 'lego-tutorial' },
    { value: 'LEGO Creations', slug: 'lego-creations' },
    { value: 'LEGO Stop Motion', slug: 'lego-stop-motion' },
    { value: 'LEGO Timelapse', slug: 'lego-timelapse' },
];

// ==============================================
// DATA TYPES (16 options)
// ==============================================
export const DATA_TYPES: KeywordEntity[] = [
    { value: 'Video', slug: 'video' },
    { value: 'Audio', slug: 'audio' },
    { value: 'Multimodal', slug: 'multimodal' },
    { value: 'Speech', slug: 'speech' },
    { value: 'LiDAR', slug: 'lidar' },
    { value: 'Sensor Fusion', slug: 'sensor-fusion' },
    { value: '3D Point Cloud', slug: '3d-point-cloud' },
    { value: 'Time Series', slug: 'time-series' },
    { value: 'Image', slug: 'image' },
    { value: 'Text', slug: 'text' },
    { value: 'Document', slug: 'document' },
    { value: 'Thermal', slug: 'thermal' },
    { value: 'Radar', slug: 'radar' },
    { value: 'Satellite', slug: 'satellite' },
    { value: 'Medical Imaging', slug: 'medical-imaging' },
    { value: 'Drone Footage', slug: 'drone-footage' },
];

// ==============================================
// CATEGORIES (5 main categories for hub-spoke)
// ==============================================
export const CATEGORIES = [
    'automotive',
    'healthcare',
    'enterprise',
    'media',
    'research',
];

// ==============================================
// GENERATION FUNCTIONS
// ==============================================

export interface GeneratedPage {
    id: string;
    slug: string;
    category: string;
    title: string;
    h1: string;
    description: string;
    template: 'tool-landing' | 'comparison' | 'guide' | 'category-hub';
    faqs: Array<{ question: string; answer: string }>;
    relatedSlugs: string[];
    active: boolean;
    priority: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Generates all possible page combinations
 */
export function generateAllPages(): GeneratedPage[] {
    const pages: GeneratedPage[] = [];
    let idCounter = 0;
    const timestamp = new Date().toISOString();

    // Generate Tool Landing pages (largest volume)
    // modifier × useCase × industry × dataType = 10 × 25 × 20 × 8 = 40,000
    for (const modifier of MODIFIERS) {
        for (const useCase of USE_CASES) {
            for (const industry of INDUSTRIES) {
                for (const dataType of DATA_TYPES) {
                    const category = mapIndustryToCategory(industry.slug);
                    const slug = `${modifier.slug}-${dataType.slug}-${useCase.slug}-${industry.slug}`;

                    pages.push({
                        id: `page-${++idCounter}`,
                        slug,
                        category,
                        title: `${modifier.value} ${dataType.value} ${useCase.value} for ${industry.value} | Harbor AI`,
                        h1: `${modifier.value} ${dataType.value} ${useCase.value} for ${industry.value}`,
                        description: generateDescription(modifier, dataType, useCase, industry),
                        template: 'tool-landing',
                        faqs: generateFAQs(modifier, dataType, useCase, industry),
                        relatedSlugs: [],
                        active: true,
                        priority: 0.6,
                        createdAt: timestamp,
                        updatedAt: timestamp,
                    });
                }
            }
        }
    }

    // Generate Comparison pages (useCase × useCase pairs)
    // 25 × 24 / 2 = 300 comparison pairs per category = 1,500
    for (const category of CATEGORIES) {
        for (let i = 0; i < USE_CASES.length; i++) {
            for (let j = i + 1; j < USE_CASES.length; j++) {
                const useCaseA = USE_CASES[i];
                const useCaseB = USE_CASES[j];
                const slug = `${useCaseA.slug}-vs-${useCaseB.slug}-${category}`;

                pages.push({
                    id: `page-${++idCounter}`,
                    slug,
                    category,
                    title: `${useCaseA.value} vs ${useCaseB.value}: Which is Better for ${category}? | Harbor AI`,
                    h1: `${useCaseA.value} vs ${useCaseB.value} for ${capitalize(category)}`,
                    description: `Compare ${useCaseA.value} and ${useCaseB.value} approaches for ${category} AI projects. Detailed analysis with pros, cons, and recommendations.`,
                    template: 'comparison',
                    faqs: [
                        { question: `When should I use ${useCaseA.value} over ${useCaseB.value}?`, answer: `Use ${useCaseA.value} when you need faster iteration cycles or are working with smaller datasets. ${useCaseB.value} is better for production-scale deployments.` },
                        { question: `Can I combine ${useCaseA.value} and ${useCaseB.value}?`, answer: `Yes, many teams use a hybrid approach, starting with ${useCaseA.value} for prototyping and transitioning to ${useCaseB.value} for production.` },
                        { question: `What's the cost difference?`, answer: `${useCaseA.value} typically has lower upfront costs but may require more manual work. ${useCaseB.value} has higher initial investment but scales better.` },
                    ],
                    relatedSlugs: [],
                    active: true,
                    priority: 0.5,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                });
            }
        }
    }

    // Generate Guide pages (useCase × industry = 25 × 20 = 500)
    for (const useCase of USE_CASES) {
        for (const industry of INDUSTRIES) {
            const category = mapIndustryToCategory(industry.slug);
            const slug = `how-to-${useCase.slug}-${industry.slug}-guide`;

            pages.push({
                id: `page-${++idCounter}`,
                slug,
                category,
                title: `How to ${useCase.value} for ${industry.value}: Complete Guide | Harbor AI`,
                h1: `Complete Guide to ${useCase.value} for ${industry.value}`,
                description: `Learn how to implement ${useCase.value} for ${industry.value} applications. Step-by-step tutorial with code examples and best practices.`,
                template: 'guide',
                faqs: [
                    { question: `What are the prerequisites for ${useCase.value}?`, answer: `You'll need a basic understanding of machine learning concepts, access to quality training data, and familiarity with Python or similar programming languages.` },
                    { question: `How long does it take to implement?`, answer: `A basic implementation can be done in 1-2 weeks. Production-ready systems typically take 1-3 months depending on complexity.` },
                    { question: `What hardware is required?`, answer: `For development, a modern laptop with GPU is sufficient. Production deployments typically require cloud GPU instances or on-premise accelerators.` },
                ],
                relatedSlugs: [],
                active: true,
                priority: 0.7,
                createdAt: timestamp,
                updatedAt: timestamp,
            });
        }
    }

    // Generate Category Hub pages (20 industries + 5 categories = 25)
    for (const industry of INDUSTRIES) {
        const category = mapIndustryToCategory(industry.slug);
        const slug = `${industry.slug}-datasets`;

        pages.push({
            id: `page-${++idCounter}`,
            slug,
            category,
            title: `${industry.value} Datasets & Training Data | Harbor AI`,
            h1: `${industry.value} Datasets`,
            description: `Explore premium ${industry.value.toLowerCase()} datasets for AI training. Video, audio, and multimodal data with enterprise-grade annotation and compliance.`,
            template: 'category-hub',
            faqs: [
                { question: `What types of ${industry.value.toLowerCase()} datasets are available?`, answer: `We offer video, audio, multimodal, and sensor fusion datasets specifically curated for ${industry.value.toLowerCase()} use cases.` },
                { question: `Are datasets compliant with industry regulations?`, answer: `Yes, all ${industry.value.toLowerCase()} datasets include full provenance tracking and comply with relevant industry regulations.` },
                { question: `Can I request custom datasets?`, answer: `Absolutely. Contact our enterprise team for custom data collection and annotation tailored to your specific ${industry.value.toLowerCase()} needs.` },
            ],
            relatedSlugs: [],
            active: true,
            priority: 0.9,
            createdAt: timestamp,
            updatedAt: timestamp,
        });
    }

    // Add more combinations to reach 100K+
    // dataType × industry × modifier = 8 × 20 × 10 = 1,600 additional
    for (const dataType of DATA_TYPES) {
        for (const industry of INDUSTRIES) {
            for (const modifier of MODIFIERS) {
                const category = mapIndustryToCategory(industry.slug);
                const slug = `${modifier.slug}-${dataType.slug}-datasets-${industry.slug}`;

                pages.push({
                    id: `page-${++idCounter}`,
                    slug,
                    category,
                    title: `${modifier.value} ${dataType.value} Datasets for ${industry.value} | Harbor AI`,
                    h1: `${modifier.value} ${dataType.value} Datasets for ${industry.value}`,
                    description: `Access ${modifier.value.toLowerCase()} ${dataType.value.toLowerCase()} datasets optimized for ${industry.value.toLowerCase()} applications. Enterprise compliance and frame-accurate annotation included.`,
                    template: 'tool-landing',
                    faqs: generateFAQs(modifier, dataType, USE_CASES[0], industry),
                    relatedSlugs: [],
                    active: true,
                    priority: 0.6,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                });
            }
        }
    }

    // Fill related slugs
    for (const page of pages) {
        page.relatedSlugs = pages
            .filter(p => p.category === page.category && p.slug !== page.slug)
            .slice(0, 6)
            .map(p => p.slug);
    }

    return pages;
}

function mapIndustryToCategory(industrySlug: string): string {
    const mapping: Record<string, string> = {
        'autonomous-vehicles': 'automotive',
        'healthcare': 'healthcare',
        'retail': 'enterprise',
        'manufacturing': 'enterprise',
        'finance': 'enterprise',
        'media-entertainment': 'media',
        'gaming': 'media',
        'security-surveillance': 'enterprise',
        'agriculture': 'enterprise',
        'robotics': 'automotive',
        'smart-cities': 'automotive',
        'education': 'research',
        'legal': 'enterprise',
        'insurance': 'enterprise',
        'real-estate': 'enterprise',
        'logistics': 'enterprise',
        'telecommunications': 'enterprise',
        'energy': 'enterprise',
        'aerospace': 'automotive',
        'sports-analytics': 'media',
    };
    return mapping[industrySlug] || 'enterprise';
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateDescription(
    modifier: KeywordEntity,
    dataType: KeywordEntity,
    useCase: KeywordEntity,
    industry: KeywordEntity
): string {
    const templates = [
        `${modifier.value} ${dataType.value.toLowerCase()} datasets for ${useCase.value.toLowerCase()} in ${industry.value}. Enterprise-grade annotation with full compliance.`,
        `Access ${modifier.value.toLowerCase()} ${dataType.value.toLowerCase()} training data for ${industry.value} ${useCase.value.toLowerCase()}. Frame-accurate labeling included.`,
        `High-quality ${dataType.value.toLowerCase()} datasets optimized for ${useCase.value.toLowerCase()} in the ${industry.value.toLowerCase()} industry.`,
    ];
    return templates[Math.abs(hashString(modifier.slug + useCase.slug)) % templates.length];
}

function generateFAQs(
    modifier: KeywordEntity,
    dataType: KeywordEntity,
    useCase: KeywordEntity,
    industry: KeywordEntity
): Array<{ question: string; answer: string }> {
    return [
        {
            question: `What makes these ${dataType.value.toLowerCase()} datasets ${modifier.value.toLowerCase()}?`,
            answer: `Our ${modifier.value.toLowerCase()} datasets feature frame-accurate annotation, cryptographic provenance, and enterprise-grade compliance specifically designed for ${industry.value.toLowerCase()} applications.`
        },
        {
            question: `How are these datasets optimized for ${useCase.value.toLowerCase()}?`,
            answer: `Each dataset includes pre-computed embeddings, balanced class distributions, and validation splits optimized for ${useCase.value.toLowerCase()} workflows in production environments.`
        },
        {
            question: `What ${industry.value.toLowerCase()} use cases are supported?`,
            answer: `Our ${dataType.value.toLowerCase()} data supports all major ${industry.value.toLowerCase()} applications including ${useCase.value.toLowerCase()}, along with custom annotation schemes for specialized needs.`
        },
    ];
}

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
    }
    return hash;
}

/**
 * Returns the count of all possible pages
 */
export function getPageCount(): { total: number; breakdown: Record<string, number> } {
    const toolLanding = MODIFIERS.length * USE_CASES.length * INDUSTRIES.length * DATA_TYPES.length;
    const comparisons = (USE_CASES.length * (USE_CASES.length - 1) / 2) * CATEGORIES.length;
    const guides = USE_CASES.length * INDUSTRIES.length;
    const hubs = INDUSTRIES.length;
    const additionalTools = DATA_TYPES.length * INDUSTRIES.length * MODIFIERS.length;

    return {
        total: toolLanding + comparisons + guides + hubs + additionalTools,
        breakdown: {
            toolLanding,
            comparisons,
            guides,
            hubs,
            additionalTools,
        },
    };
}
