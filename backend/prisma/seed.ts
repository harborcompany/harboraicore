import 'dotenv/config';
import {
    PrismaClient,
    UserRole,
    OrgRole,
    SourceType,
    MediaStatus,
    DatasetVertical,
    DatasetStatus,
    LicenseType,
    PricingModel
} from '@prisma/client';

const prisma = new PrismaClient({});

async function main() {
    console.log('🌱 Starting database seed (Lab-Ready Data Platform)...');

    // ============================================
    // 1. GOVERNANCE PROFILES
    // ============================================
    console.log('\n📋 Creating Governance Profiles...');

    const gdprProfile = await prisma.governanceProfile.upsert({
        where: { id: 'gov-gdpr-default' },
        update: {},
        create: {
            id: 'gov-gdpr-default',
            name: 'GDPR Compliant - Standard',
            consentSource: 'user_app',
            usageRights: ['training', 'evaluation', 'commercial'],
            geographicRestrictions: ['EU'],
            dataRetentionPolicy: '5y',
            auditLogEnabled: true,
            complianceTags: ['GDPR', 'CCPA'],
        },
    });

    const enterpriseProfile = await prisma.governanceProfile.upsert({
        where: { id: 'gov-enterprise-default' },
        update: {},
        create: {
            id: 'gov-enterprise-default',
            name: 'Enterprise Data Governance',
            consentSource: 'enterprise',
            usageRights: ['training', 'evaluation', 'commercial', 'resale'],
            geographicRestrictions: [],
            dataRetentionPolicy: 'indefinite',
            auditLogEnabled: true,
            complianceTags: ['SOC2', 'ISO27001'],
        },
    });

    console.log(`  ✓ Created governance profiles: ${gdprProfile.name}, ${enterpriseProfile.name}`);

    // ============================================
    // 2. QUALITY PROFILES
    // ============================================
    console.log('\n📊 Creating Quality Profiles...');

    const highQualityProfile = await prisma.qualityProfile.upsert({
        where: { id: 'qp-high-quality' },
        update: {},
        create: {
            id: 'qp-high-quality',
            name: 'High Quality - Production Ready',
            annotationConfidenceAvg: 0.94,
            interAnnotatorAgreement: 0.91,
            reviewPassRate: 0.97,
            benchmarkTasks: ['asr', 'action_detection', 'scene_classification'],
            lastAuditAt: new Date(),
        },
    });

    const standardQualityProfile = await prisma.qualityProfile.upsert({
        where: { id: 'qp-standard' },
        update: {},
        create: {
            id: 'qp-standard',
            name: 'Standard Quality - Development',
            annotationConfidenceAvg: 0.85,
            interAnnotatorAgreement: 0.82,
            reviewPassRate: 0.90,
            benchmarkTasks: ['asr', 'object_detection'],
            lastAuditAt: new Date(),
        },
    });

    console.log(`  ✓ Created quality profiles: ${highQualityProfile.name}, ${standardQualityProfile.name}`);

    // ============================================
    // 3. CONTRACT TEMPLATES
    // ============================================
    console.log('\n📝 Creating Contract Templates...');

    const licenseTemplate = await prisma.contractTemplate.upsert({
        where: { id: 'tmpl-dataset-license' },
        update: {},
        create: {
            id: 'tmpl-dataset-license',
            type: 'license',
            name: 'Dataset License Agreement',
            description: 'Standard license agreement for dataset access',
            content: `DATASET LICENSE AGREEMENT

This Dataset License Agreement ("Agreement") is entered into as of {{effective_date}}.

DATASET INFORMATION:
- Dataset ID: {{dataset_id}}
- Dataset Name: {{dataset_name}}
- Version: {{dataset_version}}
- License Type: {{license_type}}

LICENSEE INFORMATION:
- Organization: {{org_name}}
- Industry: {{org_industry}}

USAGE RIGHTS:
The dataset may be used for: {{usage_rights}}

DATA RETENTION:
Data retention policy: {{data_retention_policy}}

COMPLIANCE:
This dataset complies with: {{compliance_tags}}

PRICING:
Pricing Model: {{pricing_model}}

By accessing this dataset, Licensee agrees to the terms outlined herein.

Signature: _______________________
Date: {{signature_date}}`,
            variables: [
                'effective_date', 'dataset_id', 'dataset_name', 'dataset_version',
                'license_type', 'org_name', 'org_industry', 'usage_rights',
                'data_retention_policy', 'compliance_tags', 'pricing_model', 'signature_date'
            ],
            version: '1.0',
            isActive: true,
        },
    });

    const dpaTemplate = await prisma.contractTemplate.upsert({
        where: { id: 'tmpl-dpa' },
        update: {},
        create: {
            id: 'tmpl-dpa',
            type: 'dpa',
            name: 'Data Processing Agreement',
            description: 'GDPR-compliant data processing agreement',
            content: `DATA PROCESSING AGREEMENT

This Data Processing Agreement ("DPA") establishes the terms of data processing.

PARTIES:
- Data Controller: {{org_name}}
- Data Processor: Harbor AI, Inc.

SCOPE OF PROCESSING:
Dataset(s): {{dataset_name}}
Purpose: AI model training and evaluation

DATA PROTECTION MEASURES:
- Encryption at rest and in transit
- Access controls and audit logging
- Regular security assessments

RETENTION:
{{data_retention_policy}}

COMPLIANCE FRAMEWORKS:
{{compliance_tags}}

SUB-PROCESSORS:
Harbor may engage sub-processors for storage and processing.

AUDIT RIGHTS:
Controller may request audit reports annually.

Agreed and accepted:

Controller Signature: _______________________
Processor Signature: _______________________
Date: {{effective_date}}`,
            variables: [
                'org_name', 'dataset_name', 'data_retention_policy',
                'compliance_tags', 'effective_date'
            ],
            version: '1.0',
            isActive: true,
        },
    });

    const revenueShareTemplate = await prisma.contractTemplate.upsert({
        where: { id: 'tmpl-revenue-share' },
        update: {},
        create: {
            id: 'tmpl-revenue-share',
            type: 'revenue_share',
            name: 'Marketplace Revenue Share Agreement',
            description: 'Revenue sharing agreement for data contributors',
            content: `MARKETPLACE REVENUE SHARE AGREEMENT

This Agreement governs revenue sharing between Harbor AI and Data Contributor.

CONTRIBUTOR:
Name: {{contributor_name}}
Email: {{contributor_email}}

DATASET:
ID: {{dataset_id}}
Name: {{dataset_name}}

REVENUE SPLIT:
- Harbor Platform Fee: 25%
- Contributor Share: 75%

PAYMENT TERMS:
- Monthly payouts for balances over $50 USD
- Payment methods: Bank transfer, Stripe, or crypto

ATTRIBUTION:
Contributor retains attribution rights.

DURATION:
This agreement remains in effect while dataset is published.

Agreed:
Contributor: _______________________
Date: {{effective_date}}`,
            variables: [
                'contributor_name', 'contributor_email', 'dataset_id',
                'dataset_name', 'effective_date'
            ],
            version: '1.0',
            isActive: true,
        },
    });

    console.log(`  ✓ Created contract templates: License, DPA, Revenue Share`);

    // ============================================
    // 4. ANCHOR DATASETS
    // ============================================
    console.log('\n📦 Creating Anchor Datasets...');

    const urbanAVDataset = await prisma.dataset.upsert({
        where: { id: 'ds-urban-av' },
        update: {},
        create: {
            id: 'ds-urban-av',
            name: 'Urban Multi-Speaker AV Dataset',
            version: 'v1.3',
            vertical: DatasetVertical.AUTOMOTIVE,
            modalities: ['video', 'audio'],
            annotationTypes: ['scene', 'action', 'speech', 'emotion'],
            totalHours: 1200,
            datasetStatus: DatasetStatus.PUBLISHED,
            licenseType: LicenseType.COMMERCIAL,
            pricingModel: PricingModel.USAGE,
            mediaType: 'Mixed',
            description: 'High-quality urban driving scenes with multi-speaker audio for autonomous vehicle perception and voice interaction systems.',
            ragEnabled: true,
            isAnchor: true,
            intendedUseCases: ['autonomous perception', 'voice assistant training', 'driver monitoring'],
            modelReadinessScore: 8.7,
            benchmarkResults: {
                task: 'action_detection',
                baseline_accuracy: 89.2,
                model: 'YOLOv8',
                evaluation_date: new Date().toISOString(),
            },
            governanceProfileId: gdprProfile.id,
            qualityProfileId: highQualityProfile.id,
        },
    });

    const therapyVoiceDataset = await prisma.dataset.upsert({
        where: { id: 'ds-therapy-voice' },
        update: {},
        create: {
            id: 'ds-therapy-voice',
            name: 'Therapy Voice & Emotion Dataset',
            version: 'v2.1',
            vertical: DatasetVertical.THERAPY,
            modalities: ['audio'],
            annotationTypes: ['speech', 'emotion', 'sentiment', 'speaker_id'],
            totalHours: 850,
            datasetStatus: DatasetStatus.PUBLISHED,
            licenseType: LicenseType.RESEARCH,
            pricingModel: PricingModel.SUBSCRIPTION,
            mediaType: 'Audio',
            description: 'Consented therapy session audio for mental health AI applications. Full IRB approval and HIPAA compliance.',
            ragEnabled: true,
            isAnchor: true,
            intendedUseCases: ['therapy voice analysis', 'emotion detection', 'mental health monitoring'],
            modelReadinessScore: 9.1,
            benchmarkResults: {
                task: 'emotion_classification',
                baseline_accuracy: 92.4,
                model: 'Whisper-large + custom classifier',
                evaluation_date: new Date().toISOString(),
            },
            governanceProfileId: enterpriseProfile.id,
            qualityProfileId: highQualityProfile.id,
        },
    });

    const broadcastContentDataset = await prisma.dataset.upsert({
        where: { id: 'ds-broadcast' },
        update: {},
        create: {
            id: 'ds-broadcast',
            name: 'Broadcast Content Understanding',
            version: 'v1.0',
            vertical: DatasetVertical.BROADCAST,
            modalities: ['video', 'audio'],
            annotationTypes: ['scene', 'action', 'speech', 'face', 'text_overlay'],
            totalHours: 2500,
            datasetStatus: DatasetStatus.PUBLISHED,
            licenseType: LicenseType.COMMERCIAL,
            pricingModel: PricingModel.USAGE,
            mediaType: 'Mixed',
            description: 'Licensed broadcast content for content understanding, ad insertion, and content moderation AI.',
            ragEnabled: true,
            isAnchor: true,
            intendedUseCases: ['content moderation', 'ad placement', 'content understanding'],
            modelReadinessScore: 8.2,
            benchmarkResults: {
                task: 'scene_classification',
                baseline_accuracy: 87.5,
                model: 'VideoMAE-L',
                evaluation_date: new Date().toISOString(),
            },
            governanceProfileId: enterpriseProfile.id,
            qualityProfileId: standardQualityProfile.id,
        },
    });

    console.log(`  ✓ Created anchor datasets: ${urbanAVDataset.name}, ${therapyVoiceDataset.name}, ${broadcastContentDataset.name}`);

    // ============================================
    // 5A. AUDIT & LEDGER (Mega-Prompt Requirements)
    // ============================================
    console.log('\n🔐 Creating Audit Trails & Revenue Ledger...');

    // Requirement IX: System Audit Log for Dataset Publish
    await prisma.systemAuditLog.create({
        data: {
            action: "DATASET_PUBLISH",
            actorId: "system_admin",
            resourceId: urbanAVDataset.id,
            details: { version: "v1.3", status: "PUBLISHED" },
            status: "SUCCESS"
        }
    });

    // Requirement II.3: Annotation Event (Immutable Audit Trail)
    await prisma.annotationEvent.create({
        data: {
            datasetId: urbanAVDataset.id,
            annotatorType: "model",
            confidence: 0.96,
            reviewed: true,
            version: "v1.3",
            metadata: { source: "harbor-auto-labeler-v2" } // Traceability
        }
    });

    // Requirement II.4: Revenue Ledger (Marketplace Economics)
    await prisma.datasetRevenueLedger.create({
        data: {
            datasetId: urbanAVDataset.id,
            buyerType: "enterprise",
            usageUnits: 340,
            priceUsd: 6800.00,
            revenueShare: { harbor: 0.25, contributor: 0.75 } // Attribution logic
        }
    });

    console.log(`  ✓ Created Audit Log, Annotation Event, and Revenue Ledger for Urban Dataset`);

    // ============================================
    // 5. QUICKSTART PROJECTS
    // ============================================
    console.log('\n🚀 Creating Quickstart Projects...');

    await prisma.quickstartProject.upsert({
        where: { slug: 'action-recognition-30min' },
        update: {},
        create: {
            name: 'Train an Action Recognition Model',
            slug: 'action-recognition-30min',
            description: 'Learn to train an action recognition model using Harbor datasets in 30 minutes.',
            type: 'notebook',
            datasetId: urbanAVDataset.id,
            steps: ['authenticate', 'query_dataset', 'download_samples', 'train_model', 'evaluate'],
            difficulty: 'beginner',
        },
    });

    await prisma.quickstartProject.upsert({
        where: { slug: 'rag-video-search' },
        update: {},
        create: {
            name: 'Build Video Search with RAG',
            slug: 'rag-video-search',
            description: 'Create a semantic video search engine using Harbor RAG API.',
            type: 'api_demo',
            datasetId: broadcastContentDataset.id,
            steps: ['authenticate', 'configure_rag', 'index_content', 'query_examples', 'build_ui'],
            difficulty: 'intermediate',
        },
    });

    await prisma.quickstartProject.upsert({
        where: { slug: 'emotion-detection-api' },
        update: {},
        create: {
            name: 'Emotion Detection API Integration',
            slug: 'emotion-detection-api',
            description: 'Integrate Harbor emotion detection into your application.',
            type: 'api_demo',
            datasetId: therapyVoiceDataset.id,
            steps: ['authenticate', 'test_endpoint', 'batch_processing', 'webhooks', 'production_deploy'],
            difficulty: 'advanced',
        },
    });

    console.log(`  ✓ Created 3 quickstart projects`);

    // ============================================
    // 6. TUTORIALS
    // ============================================
    console.log('\n📚 Creating Tutorials...');

    await prisma.tutorial.upsert({
        where: { slug: 'getting-started-harbor-sdk' },
        update: {},
        create: {
            title: 'Getting Started with Harbor SDK',
            slug: 'getting-started-harbor-sdk',
            summary: 'Learn the basics of the Harbor Python SDK and make your first API calls.',
            datasetsUsed: [urbanAVDataset.id],
            tools: ['Python', 'Harbor SDK'],
            estimatedTime: '15 min',
            content: `# Getting Started with Harbor SDK

## Installation

\`\`\`bash
pip install harbor-sdk
\`\`\`

## Authentication

\`\`\`python
from harbor import Client

client = Client(api_key="YOUR_API_KEY")
\`\`\`

## List Available Datasets

\`\`\`python
datasets = client.datasets.list()
for ds in datasets:
    print(f"{ds.name} - {ds.total_hours} hours")
\`\`\`

## Query a Dataset

\`\`\`python
results = client.datasets.query(
    dataset_id="ds-urban-av",
    prompt="Find scenes with pedestrians at crosswalks"
)
\`\`\`

## Next Steps

- Explore the RAG API for semantic search
- Download sample data for local training
- Set up webhooks for real-time processing
`,
            published: true,
            order: 1,
        },
    });

    await prisma.tutorial.upsert({
        where: { slug: 'training-action-model' },
        update: {},
        create: {
            title: 'Train an Action Recognition Model in 30 Minutes',
            slug: 'training-action-model',
            summary: 'Complete guide to training an action recognition model using Harbor datasets.',
            datasetsUsed: [urbanAVDataset.id],
            tools: ['PyTorch', 'Harbor SDK', 'Jupyter'],
            estimatedTime: '30 min',
            content: `# Train an Action Recognition Model

## Prerequisites

- Harbor API key
- Python 3.9+
- GPU recommended

## Step 1: Setup Environment

\`\`\`bash
pip install harbor-sdk torch torchvision jupyter
\`\`\`

## Step 2: Download Training Data

\`\`\`python
from harbor import Client

client = Client(api_key="YOUR_API_KEY")
samples = client.datasets.sample(
    dataset_id="ds-urban-av",
    count=1000,
    annotation_types=["action"]
)
\`\`\`

## Step 3: Prepare DataLoader

\`\`\`python
from torch.utils.data import DataLoader
from harbor.pytorch import HarborDataset

dataset = HarborDataset(samples)
loader = DataLoader(dataset, batch_size=32, shuffle=True)
\`\`\`

## Step 4: Train Model

\`\`\`python
import torch
from torchvision.models.video import r3d_18

model = r3d_18(pretrained=True)
# Fine-tune on Harbor data...
\`\`\`

## Step 5: Evaluate

Use Harbor benchmark endpoints to compare against baselines.
`,
            published: true,
            order: 2,
        },
    });

    console.log(`  ✓ Created 2 tutorials`);

    // ============================================
    // 7. ENDPOINT DOCUMENTATION
    // ============================================
    console.log('\n📖 Creating Endpoint Documentation...');

    const endpoints = [
        {
            endpoint: '/datasets',
            method: 'GET',
            description: 'List all available datasets with filtering and pagination',
            tags: ['datasets', 'core'],
            commonUseCases: ['browse catalog', 'filter by vertical', 'search datasets'],
            avgLatencyMs: 45,
        },
        {
            endpoint: '/datasets/:id',
            method: 'GET',
            description: 'Get detailed information about a specific dataset',
            tags: ['datasets', 'core'],
            commonUseCases: ['view details', 'check availability', 'review benchmarks'],
            avgLatencyMs: 32,
        },
        {
            endpoint: '/rag/query',
            method: 'POST',
            description: 'Semantic search across dataset content using RAG',
            tags: ['rag', 'search'],
            commonUseCases: ['semantic search', 'content discovery', 'context retrieval'],
            avgLatencyMs: 210,
        },
        {
            endpoint: '/sandbox/create',
            method: 'POST',
            description: 'Create a sandbox account for trial access',
            tags: ['sandbox', 'onboarding'],
            commonUseCases: ['trial signup', 'developer onboarding', 'evaluation'],
            avgLatencyMs: 150,
        },
        {
            endpoint: '/contracts/generate',
            method: 'POST',
            description: 'Generate a contract from template with auto-populated variables',
            tags: ['contracts', 'legal'],
            commonUseCases: ['license generation', 'DPA creation', 'revenue agreements'],
            avgLatencyMs: 180,
        },
    ];

    for (const ep of endpoints) {
        await prisma.endpointDoc.upsert({
            where: { endpoint: ep.endpoint },
            update: ep,
            create: {
                ...ep,
                parameters: {},
                examples: [
                    { language: 'python', code: `client.request("${ep.endpoint}")` },
                    { language: 'curl', code: `curl -X ${ep.method} "https://api.harbor.ai${ep.endpoint}"` },
                ],
            },
        });
    }

    console.log(`  ✓ Created ${endpoints.length} endpoint docs`);

    // ============================================
    // 8. EXISTING SEED DATA (Users, Orgs, etc.)
    // ============================================
    console.log('\n👤 Creating Users & Organizations...');

    const contributor = await prisma.user.upsert({
        where: { email: 'contributor@harbor.ai' },
        update: {},
        create: {
            email: 'contributor@harbor.ai',
            name: 'Alex Contributor',
            role: UserRole.CONTRIBUTOR,
            kycStatus: 'verified',
            walletId: 'wallet_alex_001',
            profile: {
                create: {
                    username: 'alex_capture',
                    bio: 'Mobile capture specialist.',
                    onboardingComplete: true
                }
            }
        },
    });

    const enterpriseOrg = await prisma.organization.upsert({
        where: { id: 'org-visionai' },
        update: {},
        create: {
            id: 'org-visionai',
            name: 'VisionAI Corp',
            industry: 'Autonomous Vehicles',
            billingPlan: 'enterprise'
        }
    });

    const enterpriseUser = await prisma.user.upsert({
        where: { email: 'admin@visionai.com' },
        update: {},
        create: {
            email: 'admin@visionai.com',
            name: 'Sarah Enterprise',
            role: UserRole.ENTERPRISE,
            orgMemberships: {
                create: {
                    orgId: enterpriseOrg.id,
                    role: OrgRole.ADMIN
                }
            }
        }
    });

    console.log(`  ✓ Created contributor: ${contributor.email}`);
    console.log(`  ✓ Created enterprise: ${enterpriseOrg.name} / ${enterpriseUser.email}`);

    // ============================================
    // 9. BLOGS
    // ============================================
    console.log('\n📰 Creating Blog Posts...');

    const blogs = [
        {
            slug: 'human-data-trillion-market',
            title: 'Human Data Will Be a $1 Trillion/Year Market',
            category: 'Article',
            author: 'Harbor Research',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
            excerpt: 'The explosion of multimodal AI is creating unprecedented demand for high-quality human data.',
            content: 'Full content about the trillion dollar human data market...',
            published: true,
        },
        {
            slug: 'building-enterprise-data-governance',
            title: 'Building Enterprise-Grade Data Governance for AI',
            category: 'Guide',
            author: 'Harbor Engineering',
            thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
            excerpt: 'How to implement GDPR and CCPA compliant data governance for your AI training pipelines.',
            content: 'Comprehensive guide to data governance...',
            published: true,
        },
    ];

    for (const b of blogs) {
        await prisma.blog.upsert({
            where: { slug: b.slug },
            update: b,
            create: b,
        });
    }

    console.log(`  ✓ Created ${blogs.length} blog posts`);

    console.log('\n✅ Lab-Ready Data Platform seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 2 Governance Profiles');
    console.log('  - 2 Quality Profiles');
    console.log('  - 3 Contract Templates');
    console.log('  - 3 Anchor Datasets');
    console.log('  - 3 Quickstart Projects');
    console.log('  - 2 Tutorials');
    console.log('  - 5 Endpoint Docs');
    console.log('  - 2 Users + 1 Organization');
    console.log('  - 2 Blog Posts');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
