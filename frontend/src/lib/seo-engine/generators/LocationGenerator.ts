import { CoreGenerator } from '../CoreGenerator';
import { SeoPageData, GeneratorInput } from '../types';

export class LocationGenerator extends CoreGenerator {
    async generate(inputs: GeneratorInput): Promise<SeoPageData[]> {
        const pages: SeoPageData[] = [];

        if (!inputs.locations || !inputs.roles) return [];

        for (const location of inputs.locations) {
            for (const role of inputs.roles) {
                const title = `${role} Jobs in ${location}`;
                const slug = this.createSlug(title);

                if (this.checkSlug(slug)) {
                    const page: SeoPageData = {
                        url: slug,
                        playbook_type: 'location',
                        seo: {
                            title: `${title} | Remote & Flexible | Harbor`,
                            meta_description: `Find high-paying ${role} jobs in ${location}. Work from home, contribute your voice to AI research, and get paid securely.`,
                            primary_keyword: `${role} Jobs ${location}`,
                            secondary_keywords: [`Remote work in ${location}`, `Voice recording jobs ${location}`, `AI data collection ${location}`],
                            search_intent: 'transactional'
                        },
                        content: {
                            h1: `Top ${role} Opportunities in ${location}`,
                            introduction: `Are you looking for **${role}** work in **${location}**? Harbor connects you with leading AI labs that need your unique voice.`,
                            sections: [
                                {
                                    heading: `Why Join Harbor in ${location}?`,
                                    body: `For residents of ${location}, Harbor offers a unique opportunity to earn income by training the next generation of AI. Unlike traditional studios that require you to travel, our distributed platform lets you work from the comfort of your home in ${location}.`
                                },
                                {
                                    heading: "How much can I earn?",
                                    body: "Compensation varies by project complexity and language requirements. Typically, contributors earn between $15-$50 per hour of audio data submitted."
                                }
                            ],
                            faq: [
                                {
                                    question: `Is this available for everyone in ${location}?`,
                                    answer: "Yes, as long as you have a quiet recording environment and a native or near-native accent."
                                }
                            ],
                            call_to_action: "Start Recording Now"
                        },
                        schema: {
                            type: 'JobPosting',
                            structured_data: {
                                "@context": "https://schema.org",
                                "@type": "JobPosting",
                                "title": title,
                                "jobLocation": {
                                    "@type": "Place",
                                    "address": {
                                        "@type": "PostalAddress",
                                        "addressLocality": location
                                    }
                                }
                            }
                        },
                        internal_links: [],
                        related_pages: [],
                        data_requirements_used: ['roles', 'locations']
                    };

                    this.registerSlug(slug);
                    pages.push(page);
                }
            }
        }

        return pages;
    }
}
