import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
    ToolLandingTemplate,
    ComparisonTemplate,
    GuideTemplate,
    CategoryHubTemplate
} from '../templates';
import { getPageBySlug, getPagesByCategory, getRelatedPages } from '../lib/pseo/data';
import type { FullPageData, PageListItem } from '../lib/pseo/types';

/**
 * PSEORouter
 * Dynamic router that fetches page data and renders the appropriate template
 */
const PSEORouter: React.FC = () => {
    const { category, slug } = useParams<{ category: string; slug: string }>();
    const [page, setPage] = useState<FullPageData | null>(null);
    const [relatedPages, setRelatedPages] = useState<PageListItem[]>([]);
    const [childPages, setChildPages] = useState<PageListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadPage() {
            if (!category || !slug) {
                setError(true);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(false);

            try {
                const pageData = await getPageBySlug(category, slug);

                if (!pageData) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setPage(pageData);

                // Load related pages for linking
                if (pageData.template === 'category-hub') {
                    const children = await getPagesByCategory(category, 50);
                    setChildPages(children);
                } else {
                    const related = await getRelatedPages(category, slug, 6);
                    setRelatedPages(related);
                }
            } catch (err) {
                console.error('Error loading pSEO page:', err);
                setError(true);
            }

            setLoading(false);
        }

        loadPage();
    }, [category, slug]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
                <div className="text-stone-400">Loading...</div>
            </div>
        );
    }

    // Error state - redirect to 404 or explore page
    if (error || !page) {
        return <Navigate to="/explore" replace />;
    }

    // Render the appropriate template based on page type
    switch (page.template) {
        case 'tool-landing':
            return (
                <ToolLandingTemplate
                    page={page}
                    relatedPages={relatedPages}
                />
            );

        case 'comparison':
            return <ComparisonTemplate page={page} />;

        case 'guide':
            return (
                <GuideTemplate
                    page={page}
                    relatedGuides={relatedPages}
                />
            );

        case 'category-hub':
            return (
                <CategoryHubTemplate
                    page={page}
                    childPages={childPages}
                />
            );

        default:
            // Fallback to tool landing
            return (
                <ToolLandingTemplate
                    page={page}
                    relatedPages={relatedPages}
                />
            );
    }
};

export default PSEORouter;
