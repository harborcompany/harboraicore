import { CoreGenerator } from '../CoreGenerator';
import { SeoPageData, GeneratorInput } from '../types';

export class PersonaGenerator extends CoreGenerator {
    async generate(inputs: GeneratorInput): Promise<SeoPageData[]> {
        const pages: SeoPageData[] = [];

        if (!inputs.personas) return [];

        for (const persona of inputs.personas) {
            const title = `How ${persona}s Make Money Recording Voice Data`;
            const slug = this.createSlug(title);

            if (this.checkSlug(slug)) {
                const page: SeoPageData = {
                    url: slug,
                    playbook_type: 'persona',
                    seo: {
                        title: `${persona} Voice Recording Jobs | Earn $15-50/hr | Harbor`,
                        meta_description: `Are you a ${persona}? Turn your voice into income. Join Harbor to record voice data for AI training and earn flexible income on your schedule.`,
                        primary_keyword: `${persona} voice recording jobs`,
                        secondary_keywords: [`side hustle for ${persona}s`, `${persona} make money from home`, `AI voice data ${persona}`],
                        search_intent: 'transactional'
                    },
                    content: {
                        h1: `Voice Recording Opportunities for ${persona}s`,
                        introduction: `**${persona}s** are uniquely positioned to earn extra income through voice data contribution. Your natural speaking patterns and schedule flexibility make you an ideal candidate for Harbor's AI training projects.`,
                        sections: [
                            {
                                heading: `Why ${persona}s Excel at Voice Recording`,
                                body: `As a ${persona}, you likely have:\n- Flexible time blocks throughout your day\n- Experience speaking clearly and expressively\n- A quiet space for recording\n\nThese qualities make ${persona}s some of our top earners on the platform.`
                            },
                            {
                                heading: "What You'll Be Recording",
                                body: "Projects vary from simple command phrases to conversational dialogue. Most sessions take 30-60 minutes and can be completed on your phone or computer."
                            },
                            {
                                heading: "Getting Started",
                                body: "1. Create your Harbor profile\n2. Complete a 5-minute voice sample\n3. Get matched to relevant projects\n4. Record on your schedule\n5. Get paid within 60-90 days"
                            }
                        ],
                        faq: [
                            {
                                question: `How much can a ${persona} earn per month?`,
                                answer: "Active contributors typically earn $200-$800/month depending on availability and project match. Some power users earn $1,500+."
                            },
                            {
                                question: "Do I need professional equipment?",
                                answer: "No! A modern smartphone with a quiet room is sufficient for most projects. Pro-tier projects may require USB microphones."
                            },
                            {
                                question: "How do I get paid?",
                                answer: "Payments are processed via direct deposit, PayPal, or wire transfer, typically within 60-90 days of approved submissions."
                            }
                        ],
                        call_to_action: "Start Earning Today"
                    },
                    schema: {
                        type: 'Article',
                        structured_data: {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": title,
                            "description": `Guide for ${persona}s looking to earn income through voice recording`,
                            "author": {
                                "@type": "Organization",
                                "name": "Harbor"
                            }
                        }
                    },
                    internal_links: [
                        { text: "View all voice recording jobs", url: "/jobs", type: "cross-playbook" },
                        { text: "Browse available projects", url: "/contribute", type: "cross-playbook" }
                    ],
                    related_pages: [],
                    data_requirements_used: ['personas']
                };

                this.registerSlug(slug);
                pages.push(page);
            }
        }

        return pages;
    }
}
