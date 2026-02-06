import React from 'react';
import SeoHead from '../components/SeoHead';

const Terms: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-12">
            <SeoHead
                title="Terms of Service | Harbor"
                description="Harbor Terms of Service governing access to datasets, infrastructure, APIs, and services for AI and machine learning applications."
            />

            <div className="max-w-[800px] mx-auto">
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-[#111] mb-4">
                    Terms of Service
                </h1>
                <p className="text-gray-500 mb-8">Effective Date: February 6, 2026</p>

                <div className="prose prose-stone max-w-none text-gray-600 font-light leading-relaxed">
                    <p className="text-lg mb-8">
                        These Terms of Service ("Terms") govern your access to and use of Harbor's platform,
                        including our datasets, APIs, infrastructure services, and related offerings (collectively, the "Services").
                        By accessing or using the Services, you agree to be bound by these Terms.
                    </p>

                    <hr className="my-12 border-gray-100" />

                    {/* Section 1 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By creating an account, accessing, or using Harbor's Services, you acknowledge that you have read,
                        understood, and agree to be bound by these Terms and our Privacy Policy. If you are using the Services
                        on behalf of an organization, you represent and warrant that you have the authority to bind that
                        organization to these Terms.
                    </p>
                    <p>
                        If you do not agree to these Terms, you must not access or use the Services.
                    </p>

                    {/* Section 2 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">2. Description of Services</h2>
                    <p>Harbor provides:</p>
                    <ul>
                        <li><strong>Multimodal Datasets:</strong> Licensed collections of audio, video, image, and text data for AI/ML training and evaluation</li>
                        <li><strong>Data Infrastructure:</strong> Tools for ingesting, processing, annotating, and managing AI training data</li>
                        <li><strong>APIs:</strong> Programmatic access to datasets, annotation services, and platform features</li>
                        <li><strong>Contributor Platform:</strong> Services enabling individuals to contribute data for AI training</li>
                        <li><strong>Enterprise Solutions:</strong> Custom data collection, annotation, and model evaluation services</li>
                    </ul>

                    {/* Section 3 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">3. Account Registration</h2>
                    <p>To access certain features of the Services, you must create an account. You agree to:</p>
                    <ul>
                        <li>Provide accurate, current, and complete information during registration</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Promptly notify Harbor of any unauthorized use of your account</li>
                        <li>Accept responsibility for all activities that occur under your account</li>
                    </ul>
                    <p>
                        Harbor reserves the right to suspend or terminate accounts that violate these Terms or
                        engage in fraudulent or abusive behavior.
                    </p>

                    {/* Section 4 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">4. License and Usage Rights</h2>
                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">4.1 Platform License</h3>
                    <p>
                        Subject to these Terms, Harbor grants you a limited, non-exclusive, non-transferable,
                        revocable license to access and use the Services for your internal business purposes.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">4.2 Dataset Licenses</h3>
                    <p>
                        Datasets available through Harbor are provided under specific license terms that accompany
                        each dataset. Common license types include:
                    </p>
                    <ul>
                        <li><strong>Research License:</strong> Non-commercial use for academic research and development</li>
                        <li><strong>Commercial License:</strong> Use in commercial products and services</li>
                        <li><strong>Enterprise License:</strong> Customized terms for large-scale enterprise deployment</li>
                    </ul>
                    <p>
                        You must comply with the specific license terms associated with each dataset you access.
                        License terms supersede these general Terms where there is a conflict.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">4.3 Permitted Uses</h3>
                    <p>You may use the Services and datasets to:</p>
                    <ul>
                        <li>Train, fine-tune, and evaluate machine learning models</li>
                        <li>Develop AI-powered products and services</li>
                        <li>Conduct research and development activities</li>
                        <li>Generate synthetic data based on licensed datasets (where permitted by license)</li>
                    </ul>

                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">4.4 Prohibited Uses</h3>
                    <p>You may NOT:</p>
                    <ul>
                        <li>Redistribute, resell, or sublicense datasets without explicit authorization</li>
                        <li>Use data to identify, track, or harm individuals</li>
                        <li>Use Services for illegal activities or to develop harmful applications</li>
                        <li>Attempt to reverse-engineer, de-anonymize, or extract personal information</li>
                        <li>Use datasets to train models that discriminate against protected classes</li>
                        <li>Circumvent technical restrictions or access controls</li>
                        <li>Use automated means to scrape or extract data beyond API limits</li>
                    </ul>

                    {/* Section 5 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">5. Payment Terms</h2>
                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">5.1 Fees</h3>
                    <p>
                        Certain Services require payment. Fees are specified in your order form, subscription agreement,
                        or on our pricing page. All fees are quoted in USD unless otherwise specified.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">5.2 Payment Methods</h3>
                    <p>
                        We accept major credit cards, ACH transfers, and wire transfers for Enterprise customers.
                        By providing payment information, you authorize us to charge all fees incurred.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">5.3 Billing Cycle</h3>
                    <p>
                        Subscription fees are billed in advance on a monthly or annual basis. Usage-based fees
                        are billed monthly in arrears based on actual consumption.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">5.4 Refunds</h3>
                    <p>
                        Fees are generally non-refundable except as required by law or as specified in your
                        Enterprise agreement. We may provide pro-rated refunds at our discretion for extenuating circumstances.
                    </p>

                    {/* Section 6 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">6. Intellectual Property</h2>
                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">6.1 Harbor's IP</h3>
                    <p>
                        Harbor retains all rights, title, and interest in the Services, including all software,
                        interfaces, documentation, and underlying technology. Nothing in these Terms transfers
                        ownership of any Harbor intellectual property to you.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">6.2 Your Content</h3>
                    <p>
                        You retain ownership of data you upload to the Services. By uploading content, you grant
                        Harbor a limited license to process, store, and transmit that content solely to provide the Services.
                    </p>

                    <h3 className="text-[#111] font-medium text-lg mt-6 mb-3">6.3 Model Outputs</h3>
                    <p>
                        Models trained using Harbor datasets and Services are generally owned by you, subject to
                        any restrictions in the applicable dataset license. Some licenses may require attribution
                        or prohibit commercial use of derivative works.
                    </p>

                    {/* Section 7 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">7. Data Protection and Privacy</h2>
                    <p>
                        Our collection and use of personal information is governed by our Privacy Policy.
                        For Enterprise customers processing personal data, we offer Data Processing Agreements (DPAs)
                        compliant with GDPR, CCPA, and other applicable regulations.
                    </p>
                    <p>
                        You are responsible for ensuring your use of the Services complies with applicable
                        data protection laws and for obtaining any necessary consents.
                    </p>

                    {/* Section 8 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">8. Contributor Terms</h2>
                    <p>
                        If you contribute data through Harbor's contributor platform, additional terms apply:
                    </p>
                    <ul>
                        <li>You represent that you have the right to contribute all submitted data</li>
                        <li>You grant Harbor and its customers the rights specified in the contributor agreement</li>
                        <li>Compensation is subject to the terms of individual projects and quality requirements</li>
                        <li>Harbor may reject or request revisions to contributions that don't meet quality standards</li>
                    </ul>

                    {/* Section 9 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">9. Service Level Agreement</h2>
                    <p>
                        For paid subscriptions, Harbor commits to 99.9% API uptime, measured monthly.
                        Scheduled maintenance windows are excluded. Service credits may be available
                        for Enterprise customers per their agreement terms.
                    </p>

                    {/* Section 10 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">10. Confidentiality</h2>
                    <p>
                        Each party agrees to maintain the confidentiality of the other party's confidential
                        information and not to disclose it to third parties except as necessary to perform
                        under these Terms or as required by law.
                    </p>

                    {/* Section 11 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">11. Disclaimers</h2>
                    <p>
                        THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                        EITHER EXPRESS OR IMPLIED. HARBOR DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO
                        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                    <p>
                        Harbor does not warrant that the Services will be uninterrupted, error-free, or completely secure.
                        Datasets may contain biases, inaccuracies, or incomplete information.
                    </p>

                    {/* Section 12 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">12. Limitation of Liability</h2>
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, HARBOR'S TOTAL LIABILITY FOR ANY CLAIMS ARISING
                        FROM THESE TERMS OR USE OF THE SERVICES SHALL NOT EXCEED THE AMOUNTS PAID BY YOU IN THE
                        TWELVE (12) MONTHS PRECEDING THE CLAIM.
                    </p>
                    <p>
                        HARBOR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                        PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION.
                    </p>

                    {/* Section 13 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">13. Indemnification</h2>
                    <p>
                        You agree to indemnify and hold harmless Harbor and its officers, directors, employees,
                        and agents from any claims, damages, or expenses arising from your use of the Services,
                        violation of these Terms, or infringement of any third-party rights.
                    </p>

                    {/* Section 14 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">14. Termination</h2>
                    <p>
                        Either party may terminate these Terms at any time by providing written notice.
                        Harbor may immediately suspend or terminate your access if you breach these Terms.
                    </p>
                    <p>
                        Upon termination, your right to use the Services ceases immediately. You must
                        delete all downloaded datasets unless the applicable license permits retention.
                        Sections relating to IP, confidentiality, liability, and indemnification survive termination.
                    </p>

                    {/* Section 15 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">15. Changes to Terms</h2>
                    <p>
                        Harbor may modify these Terms at any time. We will notify you of material changes
                        via email or through the Services. Continued use after changes take effect constitutes
                        acceptance of the modified Terms.
                    </p>

                    {/* Section 16 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">16. Governing Law and Disputes</h2>
                    <p>
                        These Terms are governed by the laws of the State of Delaware, USA, without regard to
                        conflict of law principles. Any disputes shall be resolved through binding arbitration
                        in accordance with the rules of JAMS, except that either party may seek injunctive relief
                        in a court of competent jurisdiction.
                    </p>

                    {/* Section 17 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">17. General Provisions</h2>
                    <ul>
                        <li><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy and any applicable licenses, constitute the entire agreement between you and Harbor.</li>
                        <li><strong>Severability:</strong> If any provision is held unenforceable, the remaining provisions remain in effect.</li>
                        <li><strong>Waiver:</strong> Failure to enforce any right does not constitute a waiver of that right.</li>
                        <li><strong>Assignment:</strong> You may not assign these Terms without Harbor's written consent. Harbor may assign these Terms in connection with a merger or acquisition.</li>
                        <li><strong>Force Majeure:</strong> Neither party is liable for delays caused by events beyond reasonable control.</li>
                    </ul>

                    {/* Section 18 */}
                    <h2 className="text-[#111] font-medium text-xl mt-8 mb-4">18. Contact Information</h2>
                    <p>For questions about these Terms, please contact:</p>
                    <p>
                        <strong>Harbor AI, Inc.</strong><br />
                        Legal Department<br />
                        Email: legal@harborml.com<br />
                        Address: 548 Market St #35410, San Francisco, CA 94104
                    </p>

                    <p className="mt-12 text-sm text-gray-400">
                        Last updated: February 6, 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
