import React, { useState } from 'react';
import { PageHeader, Tabs, Button, ChartCard, StatusBadge } from '../../components/admin/AdminComponents';

interface Role {
    id: string;
    name: string;
    permissions: string[];
    users: number;
}

const mockRoles: Role[] = [
    { id: 'role_admin', name: 'Admin', permissions: ['all'], users: 3 },
    { id: 'role_editor', name: 'Editor', permissions: ['read', 'write', 'publish'], users: 8 },
    { id: 'role_viewer', name: 'Viewer', permissions: ['read'], users: 24 },
    { id: 'role_finance', name: 'Finance', permissions: ['read', 'payouts'], users: 2 },
];

export function AdminSettings() {
    const [activeTab, setActiveTab] = useState('roles');

    const tabs = [
        { id: 'roles', label: 'Roles & Permissions' },
        { id: 'annotation', label: 'Annotation Policies' },
        { id: 'payouts', label: 'Payout Rules' },
        { id: 'pricing', label: 'Dataset Pricing' },
        { id: 'models', label: 'Model Routing' },
    ];

    return (
        <div className="admin-settings">
            <PageHeader title="Settings & Admin" subtitle="System configuration and access control" />

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="settings-content" style={{ marginTop: 24 }}>
                {activeTab === 'roles' && (
                    <ChartCard
                        title="Role-Based Access Control"
                        actions={<Button variant="secondary" size="sm">Add Role</Button>}
                    >
                        <div className="roles-list">
                            {mockRoles.map(role => (
                                <div key={role.id} className="role-row">
                                    <div className="role-info">
                                        <span className="role-name">{role.name}</span>
                                        <span className="role-users">{role.users} users</span>
                                    </div>
                                    <div className="role-permissions">
                                        {role.permissions.map(p => (
                                            <StatusBadge key={p} label={p} variant="neutral" />
                                        ))}
                                    </div>
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                )}

                {activeTab === 'annotation' && (
                    <ChartCard title="Annotation Policy Configuration">
                        <div className="config-section">
                            <ConfigRow label="Minimum Confidence Threshold" value="0.75" />
                            <ConfigRow label="Auto-Approve Threshold" value="0.92" />
                            <ConfigRow label="Human Review Required Below" value="0.80" />
                            <ConfigRow label="Max Annotation Versions" value="5" />
                            <ConfigRow label="Inter-Annotator Agreement Target" value="0.85" />
                        </div>
                    </ChartCard>
                )}

                {activeTab === 'payouts' && (
                    <ChartCard title="Payout Rules">
                        <div className="config-section">
                            <ConfigRow label="Lockup Period" value="90 days" />
                            <ConfigRow label="Minimum Payout Amount" value="$50" />
                            <ConfigRow label="Default Revenue Share" value="50%" />
                            <ConfigRow label="Premium Content Bonus" value="+10%" />
                            <ConfigRow label="Fraud Clawback Period" value="180 days" />
                            <ConfigRow label="Supported Methods" value="Bank, Stripe, Crypto" />
                        </div>
                    </ChartCard>
                )}

                {activeTab === 'pricing' && (
                    <ChartCard title="Dataset Pricing Rules">
                        <div className="config-section">
                            <ConfigRow label="Base Price per Hour (Video)" value="$15" />
                            <ConfigRow label="Base Price per Hour (Audio)" value="$8" />
                            <ConfigRow label="Annotation Depth Multiplier" value="1.5x" />
                            <ConfigRow label="Exclusive License Premium" value="3x" />
                            <ConfigRow label="Research License Discount" value="40%" />
                            <ConfigRow label="Bulk Discount (>1000 hrs)" value="20%" />
                        </div>
                    </ChartCard>
                )}

                {activeTab === 'models' && (
                    <ChartCard title="Model Routing Configuration">
                        <div className="config-section">
                            <ConfigRow label="Primary Annotation Model" value="harbor-annotator-v3" />
                            <ConfigRow label="Fallback Model" value="harbor-annotator-v2" />
                            <ConfigRow label="RAG Engine" value="harbor-rag-v2" />
                            <ConfigRow label="Ads Creative Model" value="veo-2" />
                            <ConfigRow label="Speech Recognition" value="whisper-large-v3" />
                            <ConfigRow label="Object Detection" value="yolo-v8" />
                        </div>
                    </ChartCard>
                )}
            </div>

            <style>{`
        .admin-settings { max-width: 1000px; }
        .roles-list { display: flex; flex-direction: column; gap: 12px; }
        .role-row { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #262626; }
        .role-info { flex: 1; }
        .role-name { display: block; font-size: 14px; color: #fafafa; font-weight: 500; }
        .role-users { display: block; font-size: 12px; color: #a3a3a3; }
        .role-permissions { display: flex; gap: 4px; flex: 2; }
        .config-section { display: flex; flex-direction: column; gap: 12px; }
      `}</style>
        </div>
    );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="config-row">
            <span className="config-label">{label}</span>
            <div className="config-value-wrapper">
                <span className="config-value">{value}</span>
                <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <style>{`
        .config-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #262626; }
        .config-label { font-size: 13px; color: #a3a3a3; }
        .config-value-wrapper { display: flex; align-items: center; gap: 12px; }
        .config-value { font-size: 13px; color: #fafafa; font-family: monospace; background: #1a1a1a; padding: 4px 8px; border-radius: 4px; }
      `}</style>
        </div>
    );
}

export default AdminSettings;
