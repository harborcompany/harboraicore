import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers } from 'lucide-react';
import type { LinkItem } from '../../lib/seo/linking';

interface HubLinksProps {
    hubLink: LinkItem | null;
    siblingLinks?: LinkItem[];
    className?: string;
}

/**
 * HubLinks Component
 * Links to parent hub page and sibling pages in the same category
 */
const HubLinks: React.FC<HubLinksProps> = ({
    hubLink,
    siblingLinks = [],
    className = '',
}) => {
    if (!hubLink && siblingLinks.length === 0) {
        return null;
    }

    return (
        <div className={`bg-stone-50 rounded-2xl p-6 ${className}`}>
            {/* Hub Link */}
            {hubLink && (
                <Link
                    to={hubLink.url}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-colors mb-4"
                >
                    <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                        <Layers size={18} className="text-stone-500" />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs text-stone-400 uppercase tracking-wider">
                            Category Hub
                        </span>
                        <div className="font-medium text-[#1A1A1A]">
                            {hubLink.title}
                        </div>
                    </div>
                    <ArrowUpRight size={16} className="text-stone-400" />
                </Link>
            )}

            {/* Sibling Links */}
            {siblingLinks.length > 0 && (
                <div>
                    <h4 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-3">
                        Also in this category
                    </h4>
                    <ul className="space-y-2">
                        {siblingLinks.map((link) => (
                            <li key={link.url}>
                                <Link
                                    to={link.url}
                                    className="text-sm text-stone-600 hover:text-[#1A1A1A] hover:underline transition-colors block py-1"
                                >
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HubLinks;
