import { CoreGenerator } from '../CoreGenerator';
import { SeoPageData, GeneratorInput } from '../types';

export class TemplateGenerator extends CoreGenerator {
    async generate(inputs: GeneratorInput): Promise<SeoPageData[]> {
        const pages: SeoPageData[] = [];

        if (!inputs.use_cases || !inputs.formats) return [];

        for (const useCase of inputs.use_cases) {
            for (const format of inputs.formats) {
                const title = `Voice Data Collection Template for ${useCase} (${format})`;
                const slug = this.createSlug(title);

                if (this.checkSlug(slug)) {
                    const page: SeoPageData = {
                        url: slug,
                        playbook_type: 'template',
                        seo: {
                            title: `Free ${title} (${format} Format)`,
                            meta_description: `Download a standardized ${format} template for ${useCase} data collection. Ensure high-quality AI training data with our verified schema.`,
                            primary_keyword: `${useCase} data template`,
                            secondary_keywords: [`${format} voice dataset schema`, `AI training data structure`],
                            search_intent: 'commercial'
                        },
                        content: {
                            h1: `Standardized ${useCase} Data Collection Template`,
                            introduction: `Collecting data for **${useCase}** requires strict adherence to metadata standards. Download our **${format}** template to streamline your workflow.`,
                            sections: [
                                {
                                    heading: "Why this template?",
                                    body: `Inconsistent metadata is the #1 reason for failed AI models in ${useCase}. This template enforces required fields like demographics, recording environment, and device specs.`
                                }
                            ],
                            faq: [
                                {
                                    question: `Is this compatible with Python libraries?`,
                                    answer: "Yes, the JSON structure is designed to load directly into Pandas or Hugging Face Datasets."
                                }
                            ],
                            call_to_action: "Download Template"
                        },
                        schema: {
                            type: 'Dataset',
                            structured_data: {
                                "@context": "https://schema.org",
                                "@type": "Dataset",
                                "name": title,
                                "description": `A ${format} template for ${useCase} data collection.`
                            }
                        },
                        internal_links: [],
                        related_pages: [],
                        data_requirements_used: ['use_cases', 'formats']
                    };

                    this.registerSlug(slug);
                    pages.push(page);
                }
            }
        }

        return pages;
    }
}
