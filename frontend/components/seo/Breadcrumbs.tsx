import React from 'react';
import { Link } from 'react-router-dom';
import type { LinkItem } from '../../lib/seo/linking';
import { generateBreadcrumbSchema } from '../../lib/seo/schema';

interface BreadcrumbsProps {
    items: LinkItem[];
    separator?: string;
    className?: string;
    includeSchema?: boolean;
}

/**
 * Breadcrumbs Component
 * Renders a breadcrumb trail with optional JSON-LD schema
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    separator = '/',
    className = '',
    includeSchema = true,
}) => {
    const schema = includeSchema ? generateBreadcrumbSchema(items) : null;

    return (
        <>
            {/* JSON-LD Schema */}
            {schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            )}

            {/* Visual Breadcrumbs */}
            <nav
                aria-label="Breadcrumb"
                className={`flex items-center gap-2 text-sm text-stone-400 ${className}`}
            >
                <ol className="flex items-center gap-2">
                    {items.map((item, index) => (
                        <li key={item.url} className="flex items-center gap-2">
                            {index > 0 && (
                                <span className="text-stone-300" aria-hidden="true">
                                    {separator}
                                </span>
                            )}
                            {index === items.length - 1 ? (
                                <span className="text-stone-600" aria-current="page">
                                    {item.title}
                                </span>
                            ) : (
                                <Link
                                    to={item.url}
                                    className="hover:text-stone-600 transition-colors"
                                >
                                    {item.title}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
};

export default Breadcrumbs;
