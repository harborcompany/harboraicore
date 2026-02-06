import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RelatedPage {
    slug: string;
    title: string;
    category: string;
    description?: string;
}

interface RelatedPagesProps {
    pages: RelatedPage[];
    title?: string;
    maxItems?: number;
    className?: string;
}

/**
 * RelatedPages Component
 * Displays a grid of related page cards for internal linking
 */
const RelatedPages: React.FC<RelatedPagesProps> = ({
    pages,
    title = 'Related Pages',
    maxItems = 6,
    className = '',
}) => {
    const displayPages = pages.slice(0, maxItems);

    if (displayPages.length === 0) {
        return null;
    }

    return (
        <div className={`${className}`}>
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                {title}
                <ArrowRight size={18} className="text-stone-400" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayPages.map((page) => (
                    <Link
                        key={page.slug}
                        to={`/tools/${page.category}/${page.slug}`}
                        className="group p-5 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all"
                    >
                        <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                            {page.category}
                        </span>
                        <h4 className="font-medium text-[#1A1A1A] mt-2 group-hover:underline line-clamp-2">
                            {page.title.replace(' | Harbor AI', '')}
                        </h4>
                        {page.description && (
                            <p className="text-sm text-stone-500 mt-2 line-clamp-2">
                                {page.description}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedPages;
