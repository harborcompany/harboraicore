import React from 'react';
import SeoHead from '../components/SeoHead';

const Privacy: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-12">
            <SeoHead
                title="Privacy Policy"
                description="Harbor Privacy Policy explaining collection, use, and protection of information."
            />

            <div className="max-w-[800px] mx-auto">
                <h1 className="text-3xl font-medium tracking-tight text-[#111] mb-8">
                    Privacy Policy
                </h1>

                <div className="prose prose-stone max-w-none text-gray-600 font-light leading-relaxed">
                    <p className="text-lg mb-8">
                        This policy explains how Harbor collects, uses, and protects information related to visitors, customers, and partners.
                        Harbor is committed to responsible data handling and transparency.
                    </p>

                    <hr className="my-12 border-gray-100" />

                    <h3 className="text-[#111] font-medium text-lg mt-8 mb-4">Information Collection</h3>
                    <p>
                        We collect information necessary to provide our infrastructure services, including account details, usage metrics, and API interaction logs.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-8 mb-4">Data Usage</h3>
                    <p>
                        Information collected is used to operate, maintain, and improve our services, as well as to communicate with you about service updates and security notices.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-8 mb-4">Data Protection</h3>
                    <p>
                        We implement industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, and destruction.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-8 mb-4">Third-Party Sharing</h3>
                    <p>
                        We do not sell your personal data. We may share data with service providers who assist in our operations, under strict confidentiality agreements.
                    </p>

                    <p className="mt-12 text-sm text-gray-400">
                        Last updated: January 1, 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
