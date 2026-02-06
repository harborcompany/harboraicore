import { SeoPageData } from './types';

export abstract class CoreGenerator {
    protected generatedSlugs: Set<string> = new Set();

    abstract generate(inputs: any): Promise<SeoPageData[]>;

    protected checkSlug(slug: string): boolean {
        if (this.generatedSlugs.has(slug)) {
            console.warn(`Duplicate slug detected: ${slug}`);
            return false;
        }
        return true;
    }

    protected validate(page: SeoPageData): boolean {
        // Rule 1: Unique Slug (Double check)
        if (!this.checkSlug(page.url)) return false;

        // Rule 2: Minimum Content Length (Approx)
        if (!page.content) {
            console.warn(`Missing content for: ${page.url}`);
            return false;
        }
        const contentString = JSON.stringify(page.content);
        if (contentString.length < 500) {
            console.warn(`Thin content detected for: ${page.url}`);
            return false;
        }

        // Rule 3: Valid Intent
        if (!page.seo.search_intent) {
            console.warn(`Missing search intent for: ${page.url}`);
            return false;
        }

        return true;
    }

    protected createSlug(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    protected registerSlug(slug: string) {
        this.generatedSlugs.add(slug);
    }
}
