/**
 * Internal Linking System
 * Hub-and-spoke architecture for SEO
 * Prevents orphan pages and maximizes link equity
 */

const SITE_URL = 'https://harbor.ai';

/**
 * Hub page definitions
 */
const HUBS = {
    datasets: {
        path: '/datasets.html',
        title: 'Datasets',
        description: 'Browse all AI training datasets',
    },
    product: {
        path: '/product.html',
        title: 'Product',
        description: 'Explore HARBOR\'s annotation and API infrastructure',
    },
    blog: {
        path: '/blog/',
        title: 'Blog',
        description: 'Insights on AI training data',
    },
    pricing: {
        path: '/pricing.html',
        title: 'Pricing',
        description: 'Plans and pricing for HARBOR',
    },
    useCases: {
        path: '/use-cases/',
        title: 'Use Cases',
        description: 'Industry-specific AI data solutions',
    },
    faq: {
        path: '/faq/',
        title: 'FAQ',
        description: 'Frequently asked questions',
    },
};

/**
 * Category to hub mapping
 */
const CATEGORY_HUBS = {
    audio: '/datasets.html#audio',
    video: '/datasets.html#video',
    multimodal: '/datasets.html#multimodal',
    research: '/blog/?category=research',
    tutorials: '/blog/?category=tutorials',
    industry: '/blog/?category=industry',
    product: '/blog/?category=product',
};

/**
 * Generate breadcrumbs for a page
 * @param {string} path - Current page path
 * @param {Object} pageData - Optional page-specific data
 * @returns {Array} Breadcrumb items [{name, url}]
 */
function getBreadcrumbs(path, pageData = {}) {
    const breadcrumbs = [
        { name: 'Home', url: '/' }
    ];

    // Parse path segments
    const segments = path.replace(/^\/|\/$/g, '').split('/');
    let currentPath = '';

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += `/${segment}`;

        // Skip file extensions for cleaner URLs
        const cleanSegment = segment.replace(/\.html$/, '');

        // Map segments to readable names
        const segmentName = getSegmentName(cleanSegment, i, pageData);

        if (segmentName) {
            breadcrumbs.push({
                name: segmentName,
                url: i === segments.length - 1 ? currentPath : currentPath + '/',
            });
        }
    }

    return breadcrumbs;
}

/**
 * Convert URL segment to readable name
 */
function getSegmentName(segment, depth, pageData) {
    // Known segment mappings
    const segmentMap = {
        'datasets': 'Datasets',
        'blog': 'Blog',
        'faq': 'FAQ',
        'use-cases': 'Use Cases',
        'product': 'Product',
        'pricing': 'Pricing',
        'about': 'About',
        'contact': 'Contact',
        'infrastructure': 'Infrastructure',
        'ads': 'Harbor Ads',
        'contributors': 'Contributors',
        'engineering': 'Engineering',
    };

    // Use mapped name or convert slug to title case
    if (segmentMap[segment]) {
        return segmentMap[segment];
    }

    // For deep pages, use page data title if available
    if (depth > 0 && pageData.title) {
        return pageData.title;
    }

    // Convert slug to title case
    return segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Get parent hub for a page
 * @param {string} path - Current page path
 * @returns {Object|null} Hub page data
 */
function getParentHub(path) {
    // Determine hub based on path
    if (path.startsWith('/datasets/')) {
        return HUBS.datasets;
    }
    if (path.startsWith('/blog/')) {
        return HUBS.blog;
    }
    if (path.startsWith('/faq/')) {
        return HUBS.faq;
    }
    if (path.startsWith('/use-cases/')) {
        return HUBS.useCases;
    }

    return null;
}

/**
 * Get related pages based on category and tags
 * @param {Object} currentPage - Current page data
 * @param {Array} allPages - All pages in the site
 * @param {number} limit - Maximum number of related pages
 * @returns {Array} Related pages sorted by relevance
 */
function getRelatedPages(currentPage, allPages, limit = 5) {
    if (!currentPage || !allPages) return [];

    const related = [];

    for (const page of allPages) {
        // Skip current page
        if (page.path === currentPage.path) continue;

        let score = 0;

        // Same category = high relevance
        if (page.category === currentPage.category) {
            score += 10;
        }

        // Shared tags = relevance boost
        if (page.tags && currentPage.tags) {
            const sharedTags = page.tags.filter(tag =>
                currentPage.tags.includes(tag)
            );
            score += sharedTags.length * 3;
        }

        // Same type = moderate relevance
        if (page.type === currentPage.type) {
            score += 5;
        }

        // Similar topic (check title/description overlap)
        if (currentPage.title && page.title) {
            const currentWords = currentPage.title.toLowerCase().split(/\s+/);
            const pageWords = page.title.toLowerCase().split(/\s+/);
            const sharedWords = currentWords.filter(word =>
                word.length > 3 && pageWords.includes(word)
            );
            score += sharedWords.length * 2;
        }

        if (score > 0) {
            related.push({ ...page, _relevanceScore: score });
        }
    }

    // Sort by relevance and return top N
    return related
        .sort((a, b) => b._relevanceScore - a._relevanceScore)
        .slice(0, limit)
        .map(({ _relevanceScore, ...page }) => page);
}

/**
 * Get sibling pages (same category/hub)
 * @param {Object} currentPage - Current page data
 * @param {Array} allPages - All pages in the site
 * @param {number} limit - Maximum number of siblings
 * @returns {Array} Sibling pages
 */
function getSiblingPages(currentPage, allPages, limit = 10) {
    if (!currentPage || !allPages) return [];

    return allPages
        .filter(page =>
            page.path !== currentPage.path &&
            page.category === currentPage.category
        )
        .slice(0, limit);
}

/**
 * Get spoke pages for a hub
 * @param {string} hubPath - Hub page path
 * @param {Array} allPages - All pages in the site
 * @returns {Array} Child/spoke pages
 */
function getSpokePages(hubPath, allPages) {
    if (!allPages) return [];

    // Get pages that belong under this hub
    return allPages.filter(page => {
        if (hubPath === '/datasets.html') {
            return page.path.startsWith('/datasets/') && page.path !== hubPath;
        }
        if (hubPath === '/blog/') {
            return page.path.startsWith('/blog/') && page.path !== '/blog/';
        }
        if (hubPath === '/faq/') {
            return page.path.startsWith('/faq/') && page.path !== '/faq/';
        }
        return false;
    });
}

/**
 * Generate internal link HTML
 * @param {Object} page - Page to link to
 * @param {Object} options - Link options
 * @returns {string} HTML anchor tag
 */
function renderInternalLink(page, options = {}) {
    const { className = '', showDescription = false } = options;

    let html = `<a href="${page.path}" class="internal-link ${className}">`;
    html += `<span class="link-title">${escapeHtml(page.title)}</span>`;

    if (showDescription && page.description) {
        html += `<span class="link-description">${escapeHtml(page.description)}</span>`;
    }

    html += '</a>';
    return html;
}

/**
 * Generate breadcrumb HTML
 * @param {Array} breadcrumbs - Breadcrumb items
 * @returns {string} HTML breadcrumb navigation
 */
function renderBreadcrumbs(breadcrumbs) {
    if (!breadcrumbs || breadcrumbs.length === 0) return '';

    const items = breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        if (isLast) {
            return `<li class="breadcrumb-item active" aria-current="page">${escapeHtml(crumb.name)}</li>`;
        }

        return `<li class="breadcrumb-item"><a href="${crumb.url}">${escapeHtml(crumb.name)}</a></li>`;
    });

    return `
<nav aria-label="Breadcrumb" class="breadcrumbs">
    <ol class="breadcrumb-list">
        ${items.join('\n        ')}
    </ol>
</nav>`;
}

/**
 * Generate related pages section HTML
 * @param {Array} relatedPages - Related page data
 * @returns {string} HTML related pages section
 */
function renderRelatedPages(relatedPages) {
    if (!relatedPages || relatedPages.length === 0) return '';

    const links = relatedPages.map(page =>
        `<li>${renderInternalLink(page, { showDescription: true })}</li>`
    );

    return `
<aside class="related-pages">
    <h3>Related Content</h3>
    <ul class="related-list">
        ${links.join('\n        ')}
    </ul>
</aside>`;
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

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HUBS,
        CATEGORY_HUBS,
        getBreadcrumbs,
        getParentHub,
        getRelatedPages,
        getSiblingPages,
        getSpokePages,
        renderInternalLink,
        renderBreadcrumbs,
        renderRelatedPages,
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.InternalLinking = {
        getBreadcrumbs,
        getRelatedPages,
        renderBreadcrumbs,
        renderRelatedPages,
    };
}
