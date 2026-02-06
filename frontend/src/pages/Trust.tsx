import React from 'react';
import { Shield, Lock, Eye, FileCheck, Server, Globe, CheckCircle, Award } from 'lucide-react';
import SeoHead from '../components/SeoHead';

const Trust: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            <SeoHead
                title="Trust & Compliance | Harbor"
                description="Harbor's commitment to security, privacy, and regulatory compliance. SOC 2, GDPR, CCPA, and enterprise-grade data protection."
            />

            {/* Hero Section */}
            <div className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-[1000px] mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
                        <Shield size={16} />
                        Enterprise-Grade Security
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#111] mb-6">
                        Trust & Compliance
                    </h1>
                    <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
                        Security isn't an afterthought—it's foundational to everything we build.
                        Harbor is designed to meet the most stringent enterprise requirements.
                    </p>
                </div>
            </div>

            {/* Certifications Grid */}
            <div className="py-16 px-6 md:px-12 border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="text-2xl font-medium text-[#111] mb-8 text-center">Certifications & Standards</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="p-6 border border-gray-200 rounded-xl text-center hover:border-gray-300 transition-colors">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Award className="text-blue-600" size={24} />
                            </div>
                            <h3 className="font-medium text-[#111] mb-1">SOC 2 Type II</h3>
                            <p className="text-sm text-gray-500">Annual audit</p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl text-center hover:border-gray-300 transition-colors">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Globe className="text-purple-600" size={24} />
                            </div>
                            <h3 className="font-medium text-[#111] mb-1">GDPR</h3>
                            <p className="text-sm text-gray-500">EU compliant</p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl text-center hover:border-gray-300 transition-colors">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <FileCheck className="text-green-600" size={24} />
                            </div>
                            <h3 className="font-medium text-[#111] mb-1">CCPA</h3>
                            <p className="text-sm text-gray-500">California compliant</p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl text-center hover:border-gray-300 transition-colors">
                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Lock className="text-orange-600" size={24} />
                            </div>
                            <h3 className="font-medium text-[#111] mb-1">ISO 27001</h3>
                            <p className="text-sm text-gray-500">In progress</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[900px] mx-auto px-6 md:px-12 py-16">

                {/* Data Security */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Lock className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-2xl font-medium text-[#111]">Data Security</h2>
                    </div>
                    <div className="prose prose-stone max-w-none text-gray-600 font-light leading-relaxed">
                        <p className="text-lg mb-6">
                            All data processed through Harbor is encrypted in transit and at rest using industry-standard protocols.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <span><strong>Encryption in Transit:</strong> TLS 1.3 for all API communications and data transfers</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <span><strong>Encryption at Rest:</strong> AES-256 encryption for all stored data and backups</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <span><strong>Key Management:</strong> Customer-managed encryption keys (BYOK) available for Enterprise plans</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <span><strong>Network Security:</strong> Private VPC deployment, IP allowlisting, and dedicated tenancy options</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Infrastructure */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Server className="text-purple-600" size={20} />
                        </div>
                        <h2 className="text-2xl font-medium text-[#111]">Infrastructure Security</h2>
                    </div>
                    <div className="prose prose-stone max-w-none text-gray-600 font-light leading-relaxed">
                        <p className="text-lg mb-6">
                            Harbor runs on enterprise-grade cloud infrastructure with multiple layers of protection.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-5 bg-gray-50 rounded-xl">
                                <h4 className="font-medium text-[#111] mb-2">Cloud Providers</h4>
                                <p className="text-sm">Hosted on AWS and GCP with SOC 2 and ISO 27001 certified data centers across multiple regions.</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-xl">
                                <h4 className="font-medium text-[#111] mb-2">Availability</h4>
                                <p className="text-sm">99.9% uptime SLA with automatic failover, redundant systems, and real-time monitoring.</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-xl">
                                <h4 className="font-medium text-[#111] mb-2">Data Residency</h4>
                                <p className="text-sm">Choose your data region: US, EU, or APAC. Data never leaves your selected region without explicit consent.</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-xl">
                                <h4 className="font-medium text-[#111] mb-2">Disaster Recovery</h4>
                                <p className="text-sm">Automated backups every 6 hours, point-in-time recovery, and cross-region replication.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Access Control */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Eye className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-2xl font-medium text-[#111]">Access Control & Authentication</h2>
                    </div>
                    <div className="prose prose-stone max-w-none text-gray-600 font-light leading-relaxed">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <span><strong>Single Sign-On (SSO):</strong> SAML 2.0 and OAuth 2.0 integration with Okta, Azure AD, Google Workspace</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <span><strong>Multi-Factor Authentication:</strong> Enforced MFA with TOTP, WebAuthn, and hardware key support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <span><strong>Role-Based Access Control:</strong> Granular permissions with custom roles and team hierarchies</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <span><strong>Audit Logs:</strong> Complete activity logging with 90-day retention, exportable to your SIEM</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                <span><strong>API Security:</strong> Scoped API keys, rate limiting, and automatic key rotation</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Privacy & Compliance */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Shield className="text-orange-600" size={20} />
                        </div>
                        <h2 className="text-2xl font-medium text-[#111]">Privacy & Regulatory Compliance</h2>
                    </div>
                    <div className="prose prose-stone max-w-none text-gray-600 font-light leading-relaxed">
                        <h4 className="text-[#111] font-medium mt-6 mb-3">GDPR Compliance</h4>
                        <p>
                            Harbor is fully compliant with the General Data Protection Regulation (GDPR). We act as a data processor and provide Data Processing Agreements (DPAs) to all customers. Key provisions include:
                        </p>
                        <ul className="mb-6">
                            <li>Right to access, rectification, and erasure of personal data</li>
                            <li>Data portability in machine-readable formats</li>
                            <li>72-hour breach notification</li>
                            <li>Privacy-by-design architecture</li>
                        </ul>

                        <h4 className="text-[#111] font-medium mt-6 mb-3">CCPA Compliance</h4>
                        <p>
                            For California residents, Harbor provides full CCPA compliance including:
                        </p>
                        <ul className="mb-6">
                            <li>Disclosure of data collection practices</li>
                            <li>Right to opt-out of data sales (Harbor does not sell personal data)</li>
                            <li>Right to deletion upon request</li>
                            <li>Non-discrimination for exercising privacy rights</li>
                        </ul>

                        <h4 className="text-[#111] font-medium mt-6 mb-3">AI-Specific Compliance</h4>
                        <p>
                            As an AI data platform, we maintain additional safeguards:
                        </p>
                        <ul>
                            <li>Consent verification for all contributor data</li>
                            <li>Model training data provenance tracking</li>
                            <li>Bias monitoring and fairness auditing tools</li>
                            <li>EU AI Act readiness assessments</li>
                        </ul>
                    </div>
                </section>

                {/* Vendor Security */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <FileCheck className="text-indigo-600" size={20} />
                        </div>
                        <h2 className="text-2xl font-medium text-[#111]">Vendor & Third-Party Security</h2>
                    </div>
                    <div className="prose prose-stone max-w-none text-gray-600 font-light leading-relaxed">
                        <p>
                            All third-party vendors undergo security assessments before integration. We maintain a vendor risk management program that includes:
                        </p>
                        <ul>
                            <li>SOC 2 or equivalent certification requirements</li>
                            <li>Regular security questionnaire reviews</li>
                            <li>Contractual security obligations and DPAs</li>
                            <li>Continuous monitoring for vendor security incidents</li>
                        </ul>
                    </div>
                </section>

                {/* Security Practices */}
                <section className="mb-16">
                    <h2 className="text-2xl font-medium text-[#111] mb-6">Security Practices</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <h4 className="font-medium text-[#111] mb-3">Penetration Testing</h4>
                            <p className="text-sm text-gray-600">Annual third-party penetration tests with remediation SLAs. Critical findings addressed within 24 hours.</p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <h4 className="font-medium text-[#111] mb-3">Vulnerability Management</h4>
                            <p className="text-sm text-gray-600">Continuous scanning with automated patching for critical CVEs within 48 hours.</p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <h4 className="font-medium text-[#111] mb-3">Security Training</h4>
                            <p className="text-sm text-gray-600">Mandatory security awareness training for all employees. Phishing simulations and incident response drills.</p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <h4 className="font-medium text-[#111] mb-3">Bug Bounty Program</h4>
                            <p className="text-sm text-gray-600">Private security researcher program. Contact security@harborml.com for details.</p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="p-8 bg-gray-50 rounded-2xl text-center">
                    <h3 className="text-xl font-medium text-[#111] mb-3">Need Security Documentation?</h3>
                    <p className="text-gray-600 mb-6">
                        Enterprise customers can request our SOC 2 Type II report, penetration test executive summary,
                        and completed security questionnaires.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-lg font-medium hover:bg-black transition-colors"
                    >
                        Contact Security Team
                    </a>
                </section>

                <p className="mt-12 text-sm text-gray-400 text-center">
                    Last updated: February 6, 2026
                </p>
            </div>
        </div>
    );
};

export default Trust;
