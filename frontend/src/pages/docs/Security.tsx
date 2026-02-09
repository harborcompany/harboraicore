import React from 'react';
import { Shield, Database, Lock, Eye, Server } from 'lucide-react';

const DocsSecurity: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-medium text-[#111] mb-4">Security & Compliance</h1>
                <p className="text-gray-600 mb-8">Enterprise-grade security for sensitive data operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <Shield className="text-green-600" size={24} />
                        <h3 className="font-semibold text-[#111]">SOC 2 Type II</h3>
                    </div>
                    <p className="text-sm text-gray-600">Annual audits covering security, availability, and confidentiality.</p>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <Database className="text-blue-600" size={24} />
                        <h3 className="font-semibold text-[#111]">GDPR & CCPA</h3>
                    </div>
                    <p className="text-sm text-gray-600">Full compliance with data protection regulations.</p>
                </div>
            </div>

            <div className="prose prose-stone max-w-none">
                <h2 className="text-xl font-semibold text-[#111] mt-8 mb-4">Data Encryption</h2>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                        <Lock className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span><strong>At Rest:</strong> AES-256 encryption for all stored data</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Lock className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span><strong>In Transit:</strong> TLS 1.3 for all connections</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Lock className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span><strong>Key Management:</strong> AWS KMS with customer-managed keys (BYOK)</span>
                    </li>
                </ul>

                <h2 className="text-xl font-semibold text-[#111] mt-8 mb-4">Access Control</h2>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                        <Eye className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span>Role-based access control (RBAC) with granular permissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Eye className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span>SSO integration (SAML 2.0, OIDC)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Eye className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span>API key scoping with IP allowlists</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Eye className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span>Audit logging for all data access events</span>
                    </li>
                </ul>

                <h2 className="text-xl font-semibold text-[#111] mt-8 mb-4">Infrastructure</h2>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                        <Server className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span>VPC isolation with private subnets</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Server className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span>Multi-region redundancy</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Server className="text-gray-400 mt-1 shrink-0" size={16} />
                        <span>99.9% uptime SLA</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DocsSecurity;
