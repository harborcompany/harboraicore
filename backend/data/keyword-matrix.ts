
// Keyword Matrix for Programmatic SEO
// Generates 10,000+ unique pages based on Location x Service x Intent combinations

export interface SeoPageData {
    slug: string;
    title: string;
    h1: string;
    description: string;
    active: boolean;
    tags: string[];
}

const LOCATIONS = [
    // US Major Cities
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
    "Fort Worth", "Columbus", "San Francisco", "Charlotte", "Indianapolis", "Seattle",
    "Denver", "Washington DC", "Boston", "El Paso", "Nashville", "Detroit",
    "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore",
    "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa",
    "Kansas City", "Atlanta", "Long Beach", "Omaha", "Raleigh", "Miami",
    "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans",
    // International Tech Hubs
    "London", "Toronto", "Vancouver", "Berlin", "Singapore", "Sydney", "Bangalore",
    "Tel Aviv", "Paris", "Amsterdam", "Dublin", "Tokyo", "Seoul", "Dubai",
    // More US Cities
    "Newark", "Jersey City", "Chandler", "Scottsdale", "Henderson", "Buffalo",
    "Orlando", "St. Louis", "Norfolk", "Laredo", "Madison", "Durham",
    "Lubbock", "Winston-Salem", "Garland", "Glendale", "Hialeah", "Reno",
    "Baton Rouge", "Irvine", "Chesapeake", "Irving", "Gilbert", "North Las Vegas",
    "Fremont", "Boise", "Richmond", "San Bernardino", "Birmingham", "Spokane",
    "Rochester", "Des Moines", "Modesto", "Fayetteville", "Tacoma", "Oxnard",
    "Fontana", "Montgomery", "Moreno Valley", "Shreveport", "Yonkers", "Akron",
    "Huntington Beach", "Little Rock", "Augusta", "Amarillo", "Grand Rapids",
    "Salt Lake City", "Tallahassee", "Worcester", "Newport News", "Huntsville",
    "Knoxville", "Providence", "Santa Clarita", "Grand Prairie", "Brownsville"
];

const SERVICES = [
    { key: "ai-training", name: "AI Training Data" },
    { key: "data-labeling", name: "Data Labeling" },
    { key: "voice-recording", name: "Voice Recording" },
    { key: "image-annotation", name: "Image Annotation" },
    { key: "content-moderation", name: "Content Moderation" },
    { key: "transcription", name: "Audio Transcription" },
    { key: "rlhf", name: "RLHF" },
    { key: "model-tuning", name: "Model Fine-Tuning" },
    { key: "ocr", name: "OCR Data" },
    { key: "video-annotation", name: "Video Annotation" }
];

const INTENTS = [
    { key: "jobs", suffix: "Jobs", template: "Find {service} Jobs in {location}" },
    { key: "work", suffix: "Work", template: "Remote {service} Work from {location}" },
    { key: "companies", suffix: "Companies", template: "Top {service} Companies in {location}" },
    { key: "platforms", suffix: "Platforms", template: "Best {service} Platforms for {location} Residents" },
    { key: "services", suffix: "Services", template: "Professional {service} Services in {location}" },
    { key: "freelance", suffix: "Freelance", template: "Freelance {service} Opportunities in {location}" },
    { key: "remote", suffix: "Remote", template: "Remote {service} Roles Hiring in {location}" },
    { key: "part-time", suffix: "Part Time", template: "Part-Time {service} Gigs in {location}" },
    { key: "entry-level", suffix: "Entry Level", template: "Entry Level {service} Positions in {location}" },
    { key: "gig", suffix: "Gig", template: "{service} Gig Economy Apps in {location}" }
];

// Helper to slugify text
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export function getPageCount() {
    return {
        total: LOCATIONS.length * SERVICES.length * INTENTS.length,
        breakdown: {
            locations: LOCATIONS.length,
            services: SERVICES.length,
            intents: INTENTS.length
        }
    };
}

export function generateAllPages(): SeoPageData[] {
    const pages: SeoPageData[] = [];

    for (const location of LOCATIONS) {
        for (const service of SERVICES) {
            for (const intent of INTENTS) {
                // Generate logic
                const title = intent.template
                    .replace('{service}', service.name)
                    .replace('{location}', location);

                const h1 = title; // For now H1 matches title

                const slug = slugify(`${service.name} ${intent.suffix} ${location}`);

                const description = `Looking for ${service.name} opportunities in ${location}? Harbor connects you with top AI companies looking for ${intent.suffix.toLowerCase()}. Start earning today.`;

                pages.push({
                    slug,
                    title,
                    h1,
                    description,
                    active: true,
                    tags: [service.key, intent.key, slugify(location)]
                });
            }
        }
    }

    return pages;
}
