export interface SeoPageData {
    url: string;
    playbook_type: 'template' | 'curation' | 'conversion' | 'comparison' | 'example' | 'location' | 'persona' | 'integration' | 'glossary' | 'translation' | 'directory' | 'profile';
    seo: {
        title: string;
        meta_description: string;
        primary_keyword: string;
        secondary_keywords: string[];
        search_intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
    };
    content: {
        h1: string;
        introduction: string; // Markdown supported
        sections: {
            heading: string;
            body: string; // Markdown supported
            image_alt?: string;
        }[];
        faq: {
            question: string;
            answer: string;
        }[];
        call_to_action: string;
    };
    schema: {
        type: 'Article' | 'FAQPage' | 'Product' | 'JobPosting' | 'Dataset' | 'Person';
        structured_data: Record<string, any>;
    };
    internal_links: {
        text: string;
        url: string;
        type: 'parent' | 'sibling' | 'cross-playbook';
    }[];
    related_pages: {
        title: string;
        url: string;
        description: string;
    }[];
    data_requirements_used: string[];
}

export interface GeneratorInput {
    roles?: string[];
    locations?: string[];
    use_cases?: string[];
    tools?: string[];
    formats?: string[];
    languages?: string[];
    industries?: string[];
    personas?: string[];
}
