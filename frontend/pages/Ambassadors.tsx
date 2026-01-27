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

            <div className="max-w-[640px] mx-auto">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-8">Network</span>

                <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#111] mb-12 leading-[1.1]">
                    Industry Contributors
                </h1>

                <div className="space-y-8 text-lg md:text-xl font-light text-gray-600 leading-relaxed mb-16">
                    <p>
                        Harbor works with a global network of researchers, engineers, and domain experts who contribute to dataset design, validation, and governance.
                    </p>
                    <p>
                        Ambassadors support:
                    </p>
                    <ul className="list-none space-y-4 pl-0 mt-4">
                        <li className="flex items-start gap-3">
                            <span className="block w-1.5 h-1.5 mt-2.5 rounded-full bg-gray-300"></span>
                            Dataset evaluation and quality standards
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="block w-1.5 h-1.5 mt-2.5 rounded-full bg-gray-300"></span>
                            Annotation protocol development
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="block w-1.5 h-1.5 mt-2.5 rounded-full bg-gray-300"></span>
                            Domain-specific feedback for model training
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="block w-1.5 h-1.5 mt-2.5 rounded-full bg-gray-300"></span>
                            Ethical and compliance review
                        </li>
                    </ul>
                    <p>
                        Participation is selective and aligned with long-term platform integrity.
                    </p>
                </div>

                <div className="pt-12 border-t border-gray-100">
                    <a href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors">
                        Contact Us <ArrowUpRight size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Ambassadors;
