export interface Job {
    id: string;
    title: string;
    department: 'Data Collection' | 'Engineering' | 'Creative' | 'Linguistics';
    location: string;
    type: 'Contract' | 'Full-time' | 'Freelance';
    rate: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    howItWorks?: string[];
    faq?: { question: string; answer: string }[];
    disclaimer?: string;
}

// LEGO® Trademark Disclaimer (required for brick builder roles)
const LEGO_DISCLAIMER = 'LEGO® is a trademark of the LEGO Group, which does not sponsor, authorize, or endorse this opportunity. Harbor is an independent data collection platform with no affiliation to the LEGO Group.';

export const jobs: Job[] = [
    // --- Brick/Block Builder Roles (4) with LEGO® Compliance ---
    {
        id: 'block-model-architect',
        title: 'Precision Block Model Architect',
        department: 'Data Collection',
        location: 'Remote (Global)',
        type: 'Contract',
        rate: '$25 - $40 / hr',
        description: 'Harbor is seeking detail-oriented builders to construct complex architectural sets using LEGO bricks and other standard plastic interlocking components. You will record your assembly process from a first-person perspective to train vision models on fine-motor assembly tasks. We capture data on how humans manipulate small LEGO elements to teach robots precision handling.',
        requirements: [
            'Expertise in large-scale LEGO brick assembly',
            '4K camera setup for top-down recording',
            'Ability to follow complex schematics',
            'Collection of 1000+ LEGO elements preferred'
        ],
        responsibilities: [
            'Assemble designated LEGO sets while recording from multiple angles',
            'Follow strict lighting and framing guidelines',
            'Complete builds within specified timeframes',
            'Submit recordings through our secure platform'
        ],
        benefits: [
            'Flexible scheduling—work when it suits you',
            'Compensation for each approved recording session',
            'Contribute to cutting-edge robotics research',
            'Keep all LEGO sets used in recordings'
        ],
        howItWorks: [
            'Sign up and complete your builder profile',
            'Receive a project brief with set and recording specifications',
            'Record your build session following our guidelines',
            'Upload your footage for quality review',
            'Get paid within 60-90 days of approval'
        ],
        faq: [
            { question: 'Do I need to own the LEGO sets?', answer: 'Yes, you should have access to the sets specified in project briefs. Some projects may ship sets to you.' },
            { question: 'What camera equipment is required?', answer: 'A 4K camera with stable mounting (tripod or overhead rig). Smartphone cameras with good stabilization are acceptable for some projects.' },
            { question: 'How long are typical recording sessions?', answer: 'Most sessions are 2-4 hours depending on set complexity.' }
        ],
        disclaimer: LEGO_DISCLAIMER
    },
    {
        id: 'miniature-vehicle-assembler',
        title: 'Miniature Vehicle Assembler',
        department: 'Data Collection',
        location: 'Remote (Europe/US)',
        type: 'Contract',
        rate: '$150 / project',
        description: 'We need enthusiasts who specialize in vehicular model kits built from LEGO Technic elements and similar interlocking components. Your task is to build specified car, aircraft, and machinery models using LEGO bricks, documenting every step of the mechanical assembly for robotic imitation learning.',
        requirements: [
            'Collection of LEGO Technic vehicle kits',
            'Stable rig for continuous video capture',
            'Patience for 1000+ piece builds',
            'Understanding of mechanical assemblies'
        ],
        responsibilities: [
            'Build LEGO Technic vehicles according to project specifications',
            'Document gear mechanisms and moving parts in detail',
            'Explain your assembly decisions via audio commentary',
            'Submit completed recordings and photos'
        ],
        benefits: [
            'Per-project compensation (not hourly)',
            'Work on your favorite LEGO Technic sets',
            'Flexible deadlines',
            'Priority access to new projects'
        ],
        faq: [
            { question: 'Can I use third-party Technic-compatible parts?', answer: 'Projects specify which components are acceptable. Official LEGO Technic parts are always preferred.' }
        ],
        disclaimer: LEGO_DISCLAIMER
    },
    {
        id: 'structural-diorama-designer',
        title: 'Structural Diorama Designer',
        department: 'Creative',
        location: 'Remote (Global)',
        type: 'Freelance',
        rate: '$30 / hr',
        description: 'Create immersive cityscapes, environments, and dioramas using modular LEGO bricks. This role focuses on the creative placement and "free-building" aspect of model construction using LEGO elements, providing data on unstructured assembly workflows where builders make real-time creative decisions.',
        requirements: [
            'Portfolio of custom (MOC) LEGO brick creations',
            'Good lighting setup',
            'Experience with time-lapse documentation',
            'Large collection of LEGO elements for freeform building'
        ],
        responsibilities: [
            'Design original scenes using LEGO bricks',
            'Record time-lapse and real-time footage of creative process',
            'Document your decision-making and design rationale',
            'Create buildings, vehicles, and figures from scratch'
        ],
        benefits: [
            'Showcase your creativity to AI researchers',
            'Hourly compensation plus bonuses for exceptional work',
            'Featured in Harbor\'s contributor spotlights',
            'Full creative ownership of your designs'
        ],
        faq: [
            { question: 'Do I follow instructions or design freely?', answer: 'This role is specifically for freeform MOC (My Own Creation) building. No instructions provided.' }
        ],
        disclaimer: LEGO_DISCLAIMER
    },
    {
        id: 'mechanical-technic-specialist',
        title: 'Mechanical Technic Specialist',
        department: 'Engineering',
        location: 'Remote (Global)',
        type: 'Contract',
        rate: '$45 / hr',
        description: 'Construct functional gear systems, motors, and robotic arms using advanced LEGO Technic elements. We are capturing data on the physics and kinematics of plastic gear interaction using LEGO models as a standardized reference platform for robotics research.',
        requirements: [
            'Deep knowledge of gear ratios and LEGO Technic mechanisms',
            'Engineering background preferred',
            'High-frame-rate camera equipment',
            'Extensive LEGO Technic collection including motors and pneumatics'
        ],
        responsibilities: [
            'Build functional mechanical systems using LEGO Technic',
            'Test and demonstrate gear ratios, torque, and motion',
            'Capture slow-motion footage of mechanisms in action',
            'Document failure modes and optimization attempts'
        ],
        benefits: [
            'Premium hourly rate for technical expertise',
            'Engineering-focused projects',
            'Access to experimental LEGO Technic components (select projects)',
            'Collaborate with robotics researchers'
        ],
        faq: [
            { question: 'What types of mechanisms are most needed?', answer: 'Gearboxes, differential drives, pneumatic systems, and articulated joints are high priority.' }
        ],
        disclaimer: LEGO_DISCLAIMER
    },

    // --- Art Process Roles (3) ---
    {
        id: 'digital-illustration-recorder',
        title: 'Digital Illustration Process Recorder',
        department: 'Creative',
        location: 'Remote (Global)',
        type: 'Freelance',
        rate: '$200 / piece',
        description: 'Record your full screen and hand movements while creating high-fidelity digital character art. We are studying the "stroke-by-stroke" decision process of professional illustrators to improve generative styling and understand how artists translate concepts into finished pieces.',
        requirements: [
            'Professional tablet (Wacom/iPad Pro)',
            'Screen recording software (OBS or similar)',
            'Character design portfolio',
            'Proficiency in Photoshop, Procreate, or Clip Studio Paint'
        ],
        responsibilities: [
            'Create original character illustrations from scratch',
            'Record entire process from blank canvas to completion',
            'Provide audio commentary explaining your decisions',
            'Submit layered source files alongside recordings'
        ],
        benefits: [
            'Per-piece compensation ($200-500 depending on complexity)',
            'Retain full rights to your artwork',
            'Commission-style prompts with creative freedom',
            'Exposure to AI art research community'
        ],
        howItWorks: [
            'Apply with your portfolio',
            'Receive character brief (subject, style, mood)',
            'Record yourself creating the piece (3-8 hours typical)',
            'Upload recording and source files',
            'Payment processed after quality review'
        ],
        faq: [
            { question: 'Can I use AI tools in my workflow?', answer: 'We prefer fully manual work for most projects, but some specifically request AI-assisted workflows.' },
            { question: 'What resolution is required?', answer: 'Minimum 1080p screen recording, 4K preferred for detail clarity.' }
        ]
    },
    {
        id: 'traditional-canvas-documentarian',
        title: 'Traditional Canvas Documentarian',
        department: 'Creative',
        location: 'Remote (Global)',
        type: 'Contract',
        rate: '$500 / commission',
        description: 'Oil and acrylic painters needed. You will paint a commissioned piece while recording the physical mixing of colors and brush applications. This data helps bridge the gap between digital generative art and real-world physics, teaching AI how pigments actually behave.',
        requirements: [
            'Studio space with controlled lighting',
            'Overhead 4K camera rig',
            'Experience with oil or acrylic mediums',
            'Minimum 5 years painting experience'
        ],
        responsibilities: [
            'Complete commissioned paintings on specified subjects',
            'Record from palette through final brushstroke',
            'Document color mixing ratios and techniques',
            'Ship completed artwork if requested'
        ],
        benefits: [
            'Premium commission rates',
            'Keep most paintings (some projects require submission)',
            'Materials stipend for some projects',
            'Your work contributes to next-gen art AI'
        ],
        faq: [
            { question: 'What subjects are typically requested?', answer: 'Portraits, still life, and landscapes are most common. Abstract work is occasionally requested.' }
        ]
    },
    {
        id: 'sketching-workflow-capture',
        title: 'Sketching Workflow Capture Specialist',
        department: 'Data Collection',
        location: 'Remote',
        type: 'Contract',
        rate: '$25 / hr',
        description: 'Rapid sketch artists needed to perform "speed drawing" sessions. We need high-volume data on the early stages of ideation—specifically how rough shapes evolve into defined forms. Your sketches help AI understand the foundational principles of visual construction.',
        requirements: [
            'Strong traditional sketching skills',
            'Graphite or charcoal proficiency',
            'Ability to produce 20+ sketches per hour',
            'Overhead camera setup for paper documentation'
        ],
        responsibilities: [
            'Complete timed sketching sessions (5-20 min each)',
            'Draw from prompts covering objects, figures, and scenes',
            'Record your hand movements and sketching process',
            'Annotate sketches with construction line explanations'
        ],
        benefits: [
            'Consistent hourly work available',
            'Simple setup requirements',
            'Fast approval turnaround',
            'Volume bonuses for high output'
        ],
        faq: [
            { question: 'Do sketches need to be "finished"?', answer: 'No—we specifically want rough, construction-phase sketches showing your thinking process.' }
        ]
    },

    // --- Voice Model Roles (5) ---
    {
        id: 'slovakian-voice-model',
        title: 'Slovakian Voice Model',
        department: 'Linguistics',
        location: 'Remote (Slovakia)',
        type: 'Contract',
        rate: '$60 / hr',
        description: 'Native Slovak speakers needed to record emotionally expressive scripts. This project focuses on capturing subtle intonations and regional dialects to build the world\'s most natural-sounding Slovakian text-to-speech system.',
        requirements: [
            'Native Slovak speaker',
            'Home studio or quiet environment',
            'Professional microphone (XLR preferred)',
            'Clear pronunciation across emotional ranges'
        ],
        responsibilities: [
            'Record scripted sentences with varied emotions',
            'Perform spontaneous conversational recordings',
            'Complete pronunciation assessments',
            'Maintain consistent recording quality across sessions'
        ],
        benefits: [
            'Premium rates for underrepresented languages',
            'Flexible session scheduling',
            'Long-term project availability',
            'Contribute to Slovak language preservation'
        ],
        howItWorks: [
            'Complete language assessment',
            'Set up your recording environment',
            'Receive daily script batches',
            'Record and submit via Harbor platform',
            'Payment processed after quality approval'
        ],
        faq: [
            { question: 'What dialects are you looking for?', answer: 'All Slovak dialects are valuable. Please note your regional background in your profile.' }
        ]
    },
    {
        id: 'tagalog-speech-contributor',
        title: 'Tagalog Speech Contributor',
        department: 'Linguistics',
        location: 'Remote (Philippines)',
        type: 'Freelance',
        rate: '$15 / hr',
        description: 'We are expanding our Southeast Asian language dataset. Record conversational prompts in Tagalog, focusing on casual, modern slang and code-switching (Taglish) natural to daily life in the Philippines.',
        requirements: [
            'Native Tagalog speaker',
            'Clear speaking voice',
            'Android or iOS device with high-quality mic',
            'Familiarity with modern Filipino slang'
        ],
        responsibilities: [
            'Record natural conversation samples',
            'Perform scripted readings in formal and informal registers',
            'Capture Taglish code-switching examples',
            'Submit recordings via mobile app'
        ],
        benefits: [
            'Work from your phone',
            'Flexible hours—record anytime',
            'Weekly payment options',
            'Help build Filipino AI voice technology'
        ],
        faq: [
            { question: 'Is Taglish acceptable?', answer: 'Yes! We specifically want natural code-switching between Tagalog and English.' }
        ]
    },
    {
        id: 'finnish-audio-data-specialist',
        title: 'Finnish Audio Data Specialist',
        department: 'Data Collection',
        location: 'Remote (Finland)',
        type: 'Contract',
        rate: '$55 / hr',
        description: 'Help evaluate and record Finnish language datasets. This role involves both recording new prompts and verifying the accuracy of existing automated transcriptions. Finnish is a priority language for AI accessibility.',
        requirements: [
            'Native Finnish speaker',
            'Linguistics degree or student',
            'Detail-oriented ear for accents',
            'Professional audio setup'
        ],
        responsibilities: [
            'Record reading passages and conversational samples',
            'Review and correct AI-generated transcriptions',
            'Flag pronunciation errors in existing datasets',
            'Annotate dialectal variations'
        ],
        benefits: [
            'Dual role: recording + evaluation',
            'Academic-friendly scheduling',
            'Linguistics research experience',
            'Premium Nordic language rates'
        ],
        faq: [
            { question: 'What dialects are covered?', answer: 'Standard Finnish and regional dialects from across Finland.' }
        ]
    },
    {
        id: 'vietnamese-dialect-recorder',
        title: 'Vietnamese Dialect Recorder',
        department: 'Linguistics',
        location: 'Remote (Vietnam)',
        type: 'Contract',
        rate: '$20 / hr',
        description: 'Seeking speakers of Northern (Hanoi), Central (Hue), and Southern (Saigon) dialects. You will read specific phonetic balance sentences to help our models distinguish between regional tonal variations in Vietnamese.',
        requirements: [
            'Native Vietnamese speaker',
            'Access to quiet recording space',
            'Ability to read formal scripts',
            'Knowledge of your specific dialect characteristics'
        ],
        responsibilities: [
            'Record standardized sentence sets',
            'Perform tonal pronunciation exercises',
            'Complete comparative dialect recordings',
            'Self-identify dialectal features'
        ],
        benefits: [
            'Short recording sessions (15-30 min)',
            'Simple scripts provided',
            'Consistent ongoing work',
            'Dialect diversity bonuses'
        ],
        faq: [
            { question: 'Do I need all three dialects?', answer: 'No, we recruit separately for each dialect. Apply for your native region.' }
        ]
    },
    {
        id: 'urdu-narrative-voice',
        title: 'Urdu Narrative Voice',
        department: 'Creative',
        location: 'Remote (Pakistan/Global)',
        type: 'Freelance',
        rate: '$35 / hr',
        description: 'Storytellers wanted. Record long-form narrative content in Urdu, maintaining consistent tone and character voices. Ideal for audiobook narrators looking to license their voice print for AI narration projects.',
        requirements: [
            'Professional narration experience',
            'High-quality demo reel',
            'Native Urdu fluency',
            'Home recording studio'
        ],
        responsibilities: [
            'Narrate short stories and book chapters',
            'Perform character voices for dialogue',
            'Maintain consistent pacing and tone',
            'Complete full audiobook samples (some projects)'
        ],
        benefits: [
            'Voice licensing opportunities',
            'Credit in AI audiobook credits',
            'Long-form consistent work',
            'Creative narration freedom'
        ],
        howItWorks: [
            'Submit audition recording',
            'Receive sample text for voice matching',
            'Complete narrator profile assessment',
            'Begin receiving project assignments',
            'Monthly payment cycle for ongoing work'
        ],
        faq: [
            { question: 'Will my voice be cloned?', answer: 'Only with explicit consent and separate licensing agreement. Standard projects use recordings for training only.' }
        ]
    }
];
