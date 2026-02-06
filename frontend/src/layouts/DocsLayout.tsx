import React from 'react';
import { Outlet } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import DocsSidebar from '../components/docs/DocsSidebar';

const DocsLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <SeoHead
                title="Harbor Documentation"
                description="Complete guide to using Harbor's enterprise data infrastructure and API."
            />

            {/* Main Wrapper */}
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row pt-16">

                {/* Sidebar */}
                <DocsSidebar />

                {/* Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="px-6 py-12 md:px-12 md:py-16 max-w-4xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DocsLayout;
