/**
 * SEO Metadata Generator
 * Dynamic metadata for all page types
 * Supports 100k+ programmatic pages
 */

const SITE_NAME = 'HARBOR';
const SITE_URL = 'https://harbor.ai';
const DEFAULT_IMAGE = '/images/og-default.jpg';

/**
 * Page type configurations
 */
const PAGE_CONFIGS = {
    home: {
        titleSuffix: 'Media-Native Data Infrastructure',
        descriptionTemplate: 'The vertically integrated data infrastructure for real-world audio and video.',
    },
    dataset: {
        titleSuffix: 'AI Training Dataset',
        descriptionTemplate: (data) => `${data.title} — ${data.stats?.clips || 0} clips with ${data.stats?.annotations || 0} annotations. Licensed for AI training.`,
    },
    blog: {
        titleSuffix: 'HARBOR Blog',
        descriptionTemplate: (data) => data.excerpt || data.description,
    },
    faq: {
        titleSuffix: 'FAQ',
        descriptionTemplate: (data) => `${data.question} — Get answers about ${data.category} from HARBOR.`,
    },
    useCase: {
        titleSuffix: 'Use Cases',
        descriptionTemplate: (data) => `How ${data.industry} teams use HARBOR for ${data.task}. Explore datasets and solutions.`,
    },
    category: {
        titleSuffix: 'Dataset Category',
        descriptionTemplate: (data) => `Browse ${data.count}+ ${data.name} datasets. Licensed, annotated, and ready for AI training.`,
    },
    product: {
        titleSuffix: 'Product',
        descriptionTemplate: 'Explore HARBOR\'s annotation, curation, and API infrastructure for AI data.',
    },
    pricing: {
        titleSuffix: 'Pricing',
        descriptionTemplate: 'Transparent pricing for HARBOR datasets and API access. Start from $500/month.',
    },
};

/**
 * Generate page title
 * @param {string} pageType - Type of page
 * @param {Object} data - Page-specific data
 * @returns {string} SEO-optimized title
 */
function generateTitle(pageType, data = {}) {
    const config = PAGE_CONFIGS[pageType] || PAGE_CONFIGS.home;
    const primaryTitle = data.title || data.name || SITE_NAME;

    // Keep titles under 60 characters
    const fullTitle = `${primaryTitle} — ${config.titleSuffix} | ${SITE_NAME}`;
    if (fullTitle.length > 60) {
        return `${primaryTitle} | ${SITE_NAME}`;
    }
    return fullTitle;
}

/**
 * Generate meta description
 * @param {string} pageType - Type of page
 * @param {Object} data - Page-specific data
 * @returns {string} SEO-optimized description (max 160 chars)
 */
function generateDescription(pageType, data = {}) {
    const config = PAGE_CONFIGS[pageType] || PAGE_CONFIGS.home;

    let description;
    if (typeof config.descriptionTemplate === 'function') {
        description = config.descriptionTemplate(data);
    } else {
        description = data.description || config.descriptionTemplate;
    }

    // Truncate to 160 characters
    if (description.length > 160) {
        return description.substring(0, 157) + '...';
    }
    return description;
}

/**
 * Generate canonical URL
 * @param {string} path - Page path
 * @returns {string} Full canonical URL
 */
function generateCanonical(path) {
    // Remove trailing slash, ensure leading slash
    const cleanPath = path.replace(/\/+$/, '').replace(/^([^/])/, '/$1');
    return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate Open Graph meta tags
 * @param {string} pageType - Type of page
 * @param {Object} data - Page-specific data
 * @returns {Object} OG tag values
 */
function generateOpenGraph(pageType, data = {}) {
    const title = generateTitle(pageType, data);
    const description = generateDescription(pageType, data);

    return {
        'og:title': title,
        'og:description': description,
        'og:type': pageType === 'blog' ? 'article' : 'website',
        'og:url': generateCanonical(data.path || '/'),
        'og:image': data.image || `${SITE_URL}${DEFAULT_IMAGE}`,
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:site_name': SITE_NAME,
        'og:locale': 'en_US',
    };
}

/**
 * Generate Twitter Card meta tags
 * @param {string} pageType - Type of page
 * @param {Object} data - Page-specific data
 * @returns {Object} Twitter card values
 */
function generateTwitterCard(pageType, data = {}) {
    const title = generateTitle(pageType, data);
    const description = generateDescription(pageType, data);

    return {
        'twitter:card': 'summary_large_image',
        'twitter:site': '@harbor_ai',
        'twitter:creator': data.author?.twitter || '@harbor_ai',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': data.image || `${SITE_URL}${DEFAULT_IMAGE}`,
    };
}

/**
 * Generate robots meta content
 * @param {string} pageType - Type of page
 * @param {Object} options - Additional options
 * @returns {string} Robots directive
 */
function generateRobots(pageType, options = {}) {
    // Default to index, follow
    const directives = ['index', 'follow'];

    // Noindex for paginated pages (except page 1)
    if (options.page && options.page > 1) {
        directives[0] = 'noindex';
    }

    // Noindex for filter/sort pages
    if (options.hasFilters) {
        directives[0] = 'noindex';
    }

    // Add max-snippet and max-image-preview
    directives.push('max-snippet:-1');
    directives.push('max-image-preview:large');

    return directives.join(', ');
}

/**
 * Generate complete page metadata
 * @param {string} pageType - Type of page
 * @param {Object} data - Page-specific data
 * @returns {Object} Complete metadata object
 */
function generatePageMeta(pageType, data = {}) {
    return {
        title: generateTitle(pageType, data),
        description: generateDescription(pageType, data),
        canonical: generateCanonical(data.path || '/'),
        robots: generateRobots(pageType, data),
        openGraph: generateOpenGraph(pageType, data),
        twitter: generateTwitterCard(pageType, data),
    };
}

/**
 * Render metadata as HTML
 * @param {Object} meta - Metadata object from generatePageMeta
 * @returns {string} HTML meta tags
 */
function renderMetaTags(meta) {
    const lines = [
        `<title>${escapeHtml(meta.title)}</title>`,
        `<meta name="description" content="${escapeHtml(meta.description)}">`,
        `<link rel="canonical" href="${meta.canonical}">`,
        `<meta name="robots" content="${meta.robots}">`,
    ];

    // Open Graph
    for (const [key, value] of Object.entries(meta.openGraph)) {
        lines.push(`<meta property="${key}" content="${escapeHtml(value)}">`);
    }

    // Twitter
    for (const [key, value] of Object.entries(meta.twitter)) {
        lines.push(`<meta name="${key}" content="${escapeHtml(value)}">`);
    }

    return lines.join('\n    ');
}

/**
 * Escape HTML entities
 */
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Export for use in templates and build scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generatePageMeta,
        generateTitle,
        generateDescription,
        generateCanonical,
        generateOpenGraph,
        generateTwitterCard,
        generateRobots,
        renderMetaTags,
        PAGE_CONFIGS,
        SITE_NAME,
        SITE_URL,
    };
}

// Also expose globally for browser use
if (typeof window !== 'undefined') {
    window.SEOMetadata = {
        generatePageMeta,
        renderMetaTags,
    };
}
