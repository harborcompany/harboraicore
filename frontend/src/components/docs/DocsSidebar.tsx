import React from 'react';
import { NavLink } from 'react-router-dom';

const DocsSidebar: React.FC = () => {
    const sections = [
        {
            category: 'Getting Started',
            items: [
                { label: 'Introduction', path: '/docs' }, // Exact match handled by NavLink end prop if needed, or just /docs for index
                { label: 'Quickstart', path: '/docs/quickstart' },
                { label: 'Architecture', path: '/docs/architecture' },
            ]
        },
        {
            category: 'API Reference',
            items: [
                { label: 'Overview', path: '/docs/api' },
                { label: 'Authentication', path: '/docs/api/auth' },
                { label: 'Datasets', path: '/docs/api/datasets' },
                { label: 'Ingestion', path: '/docs/api/ingestion' },
                { label: 'Webhooks', path: '/docs/webhooks' },
            ]
        },
        {
            category: 'Guides',
            items: [
                { label: 'SDKs & Libraries', path: '/docs/sdks' },
                { label: 'Contributor Guide', path: '/docs/contributors' },
                { label: 'Best Practices', path: '/docs/best-practices' },
            ]
        },
        {
            category: 'Security',
            items: [
                { label: 'Security & Compliance', path: '/docs/security' },
            ]
        }
    ];

    return (
        <aside className="w-full md:w-64 lg:w-72 border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 hidden md:block bg-[#F9F9F9]">
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">Documentation</h2>
                    <div className="text-xs text-gray-500 font-mono">v1.2.0</div>
                </div>

                <div className="space-y-8">
                    {sections.map((section) => (
                        <div key={section.category}>
                            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 font-semibold">
                                {section.category}
                            </h3>
                            <ul className="space-y-2">
                                {section.items.map((item) => (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            end={item.path === '/docs'}
                                            className={({ isActive }) =>
                                                `block text-sm transition-colors duration-200 ${isActive
                                                    ? 'text-indigo-600 font-medium translate-x-1'
                                                    : 'text-gray-600 hover:text-gray-900 hover:translate-x-0.5'
                                                }`
                                            }
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default DocsSidebar;
