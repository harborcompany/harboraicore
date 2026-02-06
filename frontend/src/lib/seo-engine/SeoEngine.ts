import { roles, locations, useCases, formats, personas, industries } from './data/inputs';
import { SeoPageData, GeneratorInput } from './types';
import { LocationGenerator } from './generators/LocationGenerator';
import { TemplateGenerator } from './generators/TemplateGenerator';
import { PersonaGenerator } from './generators/PersonaGenerator';

export class SeoEngine {
    private generators = [
        new LocationGenerator(),
        new TemplateGenerator(),
        new PersonaGenerator(),
    ];

    private inputs: GeneratorInput = {
        roles,
        locations,
        use_cases: useCases,
        formats,
        personas,
        industries,
    };


    async generateAllPages(): Promise<SeoPageData[]> {
        let allPages: SeoPageData[] = [];

        console.log("Starting pSEO Generation...");

        for (const generator of this.generators) {
            const pages = await generator.generate(this.inputs);
            console.log(`Generated ${pages.length} pages from ${generator.constructor.name}`);
            allPages = [...allPages, ...pages];
        }

        // Post-processing: Internal Linking
        this.addInternalLinks(allPages);

        console.log(`Total Pages Generated: ${allPages.length}`);
        return allPages;
    }

    private addInternalLinks(pages: SeoPageData[]) {
        // Simple naive linking strategy for demonstration
        // In production, build a graph
        for (const page of pages) {
            // Link to up to 5 random other pages
            const otherPages = pages.filter(p => p.url !== page.url).sort(() => 0.5 - Math.random()).slice(0, 5);
            page.internal_links = otherPages.map(p => ({
                text: p.seo.title,
                url: `/r/${p.url}`,
                type: 'cross-playbook'
            }));
        }
    }
}
