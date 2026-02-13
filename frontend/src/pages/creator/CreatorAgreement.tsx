import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';

const CreatorAgreement: React.FC = () => {
    const handlePrint = () => window.print();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link to="/creator/settings" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ArrowLeft size={18} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contributor Agreement</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Last updated: February 1, 2026</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <Printer size={14} /> Print
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <Download size={14} /> Download PDF
                </button>
            </div>

            {/* Agreement Body */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6 text-sm text-gray-700 leading-relaxed print:border-0 print:p-0">

                <div className="text-center border-b border-gray-100 pb-6">
                    <h2 className="text-lg font-bold text-gray-900">HARBOR ML, INC.</h2>
                    <h3 className="text-base font-semibold text-gray-800 mt-1">Individual Contributor License Agreement</h3>
                    <p className="text-xs text-gray-500 mt-2">Version 2.0 — Effective February 1, 2026</p>
                </div>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">1. PARTIES</h4>
                    <p>
                        This Individual Contributor License Agreement (&quot;Agreement&quot;) is entered into between Harbor ML, Inc.,
                        a Delaware corporation (&quot;Harbor&quot;, &quot;we&quot;, &quot;us&quot;), and you, the individual contributor (&quot;Contributor&quot;, &quot;you&quot;, &quot;your&quot;),
                        effective as of the date you accept this Agreement by clicking &quot;I Agree&quot; or by submitting your first Contribution.
                    </p>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">2. DEFINITIONS</h4>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li><strong>&quot;Contribution&quot;</strong> means any original content you submit through the Harbor platform, including but not limited to video recordings, audio recordings, photographs, and associated metadata.</li>
                        <li><strong>&quot;Platform&quot;</strong> means the Harbor web application, APIs, and related services available at harborml.com.</li>
                        <li><strong>&quot;AI Training Data&quot;</strong> means datasets compiled from Contributions for the purpose of training, evaluating, or benchmarking artificial intelligence and machine learning models.</li>
                        <li><strong>&quot;Payout&quot;</strong> means the monetary compensation paid to you for approved Contributions.</li>
                    </ul>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">3. LICENSE GRANT</h4>
                    <p className="mb-2">
                        By submitting a Contribution, you grant to Harbor a <strong>worldwide, non-exclusive, perpetual, irrevocable, royalty-free license</strong> to:
                    </p>
                    <ol className="list-[lower-alpha] pl-5 space-y-1.5">
                        <li>Use, reproduce, modify, and distribute the Contribution for the purpose of creating AI Training Data;</li>
                        <li>Sublicense the Contribution to Harbor&apos;s customers and partners for AI model training and evaluation;</li>
                        <li>Create derivative works from the Contribution, including annotations, labels, segmentations, and embeddings;</li>
                        <li>Use thumbnails, anonymized clips, or metadata from the Contribution for platform features and quality assurance.</li>
                    </ol>
                    <p className="mt-2">
                        <strong>You retain non-exclusive authorship rights.</strong> Harbor will not publish your raw Contributions publicly (e.g., on social media, YouTube) without your separate written consent.
                    </p>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">4. YOUR REPRESENTATIONS</h4>
                    <p className="mb-2">By submitting a Contribution, you represent and warrant that:</p>
                    <ol className="list-[lower-alpha] pl-5 space-y-1.5">
                        <li>You are the sole creator of the Contribution or have obtained all necessary permissions;</li>
                        <li>The Contribution does not infringe any third-party intellectual property, privacy, or publicity rights;</li>
                        <li>The Contribution does not contain any illegal, harmful, or copyrighted third-party content (e.g., music, logos, trademarks);</li>
                        <li>You are at least 18 years of age or have parental/guardian consent;</li>
                        <li>No person&apos;s face is identifiable in video Contributions unless you have their written consent.</li>
                    </ol>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">5. COMPENSATION</h4>
                    <ol className="list-[lower-alpha] pl-5 space-y-1.5">
                        <li><strong>Payout Rates.</strong> Payout amounts are determined per Contribution based on category, quality, duration, and current project requirements. Rates are displayed before submission and are subject to change for future submissions.</li>
                        <li><strong>Approval.</strong> Payouts are contingent on Contribution approval by Harbor&apos;s quality review team. Rejected Contributions do not earn Payouts. You may resubmit corrected versions as new Contributions.</li>
                        <li><strong>Payment Schedule.</strong> Approved Payouts are processed monthly. Your first payout is issued within 90 days of your first approved Contribution.</li>
                        <li><strong>Payment Methods.</strong> Payouts are issued via PayPal or Stripe. You are responsible for providing accurate payment details and for any applicable taxes.</li>
                        <li><strong>Minimum Threshold.</strong> Payouts are issued once your balance exceeds $25.00 USD.</li>
                    </ol>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">6. CONTENT STANDARDS</h4>
                    <p>
                        All Contributions must comply with Harbor&apos;s <Link to="/creator/guidelines" className="text-[#2563EB] hover:underline font-medium">Submission Guidelines</Link>.
                        Harbor reserves the right to reject, remove, or request revision of any Contribution that does not meet quality, format, or content standards.
                    </p>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">7. PRIVACY &amp; DATA</h4>
                    <p>
                        Harbor processes your personal data in accordance with our <Link to="/privacy" className="text-[#2563EB] hover:underline font-medium">Privacy Policy</Link>.
                        Contribution metadata (timestamps, file properties) is collected for quality assurance and fraud prevention.
                        Your name and likeness will not be associated with published datasets without your consent.
                    </p>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">8. IDENTITY VERIFICATION</h4>
                    <p>
                        Harbor may require identity verification before processing Payouts exceeding applicable thresholds.
                        Accepted documents include government-issued photo ID (passport, driver&apos;s license, national ID card).
                        Verification data is processed securely and retained only as required by law.
                    </p>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">9. TERMINATION</h4>
                    <ol className="list-[lower-alpha] pl-5 space-y-1.5">
                        <li>You may terminate this Agreement at any time by deleting your account. Outstanding approved Payouts will still be processed.</li>
                        <li>Harbor may terminate or suspend your account for violation of this Agreement, fraudulent activity, or repeated low-quality submissions.</li>
                        <li>The license grant in Section 3 survives termination for Contributions approved prior to termination.</li>
                    </ol>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">10. LIMITATION OF LIABILITY</h4>
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, HARBOR&apos;S TOTAL LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL PAYOUTS MADE TO YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                        HARBOR SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                    </p>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">11. GOVERNING LAW</h4>
                    <p>
                        This Agreement is governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.
                        Any disputes shall be resolved by binding arbitration administered by JAMS in San Francisco, California.
                    </p>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">12. AMENDMENTS</h4>
                    <p>
                        Harbor may update this Agreement by posting the revised version on the Platform with a new effective date.
                        Continued use of the Platform after the effective date constitutes acceptance. Material changes will be communicated via email.
                    </p>
                </section>

                <section className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">13. ACCEPTANCE</h4>
                    <p>
                        By clicking &quot;I Agree&quot;, creating an account, or submitting a Contribution on the Harbor platform, you acknowledge that you have read, understood,
                        and agree to be bound by the terms of this Individual Contributor License Agreement.
                    </p>
                </section>

                <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
                    <p>Harbor ML, Inc. • 548 Market Street, Suite 95879, San Francisco, CA 94104</p>
                    <p className="mt-1">Questions? Contact <a href="mailto:legal@harborml.com" className="text-[#2563EB] hover:underline">legal@harborml.com</a></p>
                </div>
            </div>
        </div>
    );
};

export default CreatorAgreement;
