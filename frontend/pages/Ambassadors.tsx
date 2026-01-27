import React from 'react';
import SeoHead from '../components/SeoHead';
import { ArrowUpRight } from 'lucide-react';

const Ambassadors: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24 px-6">
            <SeoHead
                title="Harbor Ambassadors"
                description="Harbor works with a global network of researchers, engineers, and domain experts who contribute to dataset design, validation, and governance."
            />

            <div className="max-w-[640px] mx-auto pt-20">
                <h1 className="text-4xl font-medium tracking-tight text-[#111] mb-6">
                    Coming soon
                </h1>
            </div>
        </div>
    );
};

export default Ambassadors;
