import React from 'react';
import SeoHead from '../components/SeoHead';

const Terms: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-12">
            <SeoHead
                title="Terms of Service"
                description="Harbor Terms of Service governing access to datasets, infrastructure, APIs, and services."
            />

            <div className="max-w-[800px] mx-auto">
                <h1 className="text-3xl font-medium tracking-tight text-[#111] mb-8">
                    Terms of Service
                </h1>

                <div className="prose prose-stone max-w-none text-gray-600 font-light leading-relaxed">
                    <p className="text-lg mb-8">
                        These Terms govern access to and use of Harbor’s datasets, infrastructure, APIs, and services.
                        Use of Harbor services constitutes acceptance of these Terms.
                    </p>

                    <hr className="my-12 border-gray-100" />

                    <h3 className="text-[#111] font-medium text-lg mt-8 mb-4">1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using the Harbor platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-8 mb-4">2. Access and Use</h3>
                    <p>
                        Harbor grants you a limited, non-exclusive, non-transferable, and revocable license to use our services for your internal business purposes, subject to these Terms.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-8 mb-4">3. Data Usage</h3>
                    <p>
                        You agree to use datasets and data provided by Harbor primarily for training, validating, and testing artificial intelligence and machine learning models, in accordance with the specific license terms attached to each dataset.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-8 mb-4">4. Intellectual Property</h3>
                    <p>
                        Harbor retains all rights, title, and interest in and to the Harbor platform, including all related intellectual property rights.
                    </p>

                    <p className="mt-12 text-sm text-gray-400">
                        Last updated: January 1, 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
