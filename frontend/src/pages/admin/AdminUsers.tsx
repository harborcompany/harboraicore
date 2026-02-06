import React, { useState } from 'react';
import { PageHeader, DataTable, Tabs, StatusBadge, Button } from '../../components/admin/AdminComponents';

interface User {
    id: string;
    email: string;
    name: string;
    accountType: string;
    role: string;
    verified: boolean;
    riskScore: number;
    totalUploads: number;
    approvedAssets: number;
    totalEarnings: number;
    createdAt: string;
}

const mockUsers: User[] = [
    { id: '1', email: 'alice@studio.com', name: 'Alice Chen', accountType: 'enterprise', role: 'CONTRIBUTOR', verified: true, riskScore: 0.02, totalUploads: 1247, approvedAssets: 1189, totalEarnings: 24500, createdAt: '2024-08-15' },
    { id: '2', email: 'bob@creator.net', name: 'Bob Martinez', accountType: 'individual', role: 'CONTRIBUTOR', verified: true, riskScore: 0.05, totalUploads: 892, approvedAssets: 845, totalEarnings: 18200, createdAt: '2024-09-22' },
    { id: '3', email: 'carol@media.io', name: 'Carol Davis', accountType: 'individual', role: 'CONTRIBUTOR', verified: false, riskScore: 0.35, totalUploads: 234, approvedAssets: 156, totalEarnings: 3100, createdAt: '2024-11-05' },
    { id: '4', email: 'dave@studio.co', name: 'Dave Wilson', accountType: 'enterprise', role: 'ENTERPRISE', verified: true, riskScore: 0.01, totalUploads: 0, approvedAssets: 0, totalEarnings: 0, createdAt: '2024-10-18' },
    { id: '5', email: 'eve@content.tv', name: 'Eve Thompson', accountType: 'individual', role: 'CONTRIBUTOR', verified: true, riskScore: 0.72, totalUploads: 567, approvedAssets: 312, totalEarnings: 6800, createdAt: '2024-07-30' },
];

export function AdminUsers() {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const tabs = [
        { id: 'all', label: 'All Users', count: mockUsers.length },
        { id: 'contributors', label: 'Contributors', count: mockUsers.filter(u => u.role === 'CONTRIBUTOR').length },
        { id: 'enterprise', label: 'Enterprise', count: mockUsers.filter(u => u.role === 'ENTERPRISE').length },
        { id: 'flagged', label: 'Flagged', count: mockUsers.filter(u => u.riskScore > 0.5).length },
    ];

    const filteredUsers = mockUsers.filter(user => {
        if (activeTab === 'contributors') return user.role === 'CONTRIBUTOR';
        if (activeTab === 'enterprise') return user.role === 'ENTERPRISE';
        if (activeTab === 'flagged') return user.riskScore > 0.5;
        return true;
    });

    const columns = [
        {
            key: 'email',
            label: 'User',
            sortable: true,
            render: (user: User) => (
                <div className="user-cell">
                    <span className="user-email">{user.email}</span>
                    <span className="user-name">{user.name}</span>
                </div>
            )
        },
        {
            key: 'accountType',
            label: 'Type',
            render: (user: User) => (
                <StatusBadge
                    label={user.accountType}
                    variant={user.accountType === 'enterprise' ? 'info' : 'neutral'}
                />
            )
        },
        {
            key: 'verified',
            label: 'Status',
            render: (user: User) => (
                <StatusBadge
                    label={user.verified ? 'Verified' : 'Pending'}
                    variant={user.verified ? 'success' : 'warning'}
                />
            )
        },
        { key: 'totalUploads', label: 'Uploads', sortable: true },
        { key: 'approvedAssets', label: 'Approved', sortable: true },
        {
            key: 'totalEarnings',
            label: 'Earnings',
            sortable: true,
            render: (user: User) => `$${user.totalEarnings.toLocaleString()}`
        },
        {
            key: 'riskScore',
            label: 'Risk',
            sortable: true,
            render: (user: User) => (
                <span className={`risk-score ${user.riskScore > 0.5 ? 'high' : user.riskScore > 0.2 ? 'medium' : 'low'}`}>
                    {(user.riskScore * 100).toFixed(0)}%
                </span>
            )
        },
    ];

    return (
        <div className="admin-users">
            <PageHeader
                title="Users"
                subtitle="Manage contributors and enterprise accounts"
                actions={
                    <Button variant="primary">Export CSV</Button>
                }
            />

            <div className="users-toolbar">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                <div className="search-box">
                    <input type="text" placeholder="Search users..." />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredUsers}
                onRowClick={(user) => setSelectedUser(user)}
            />

            {/* User Detail Drawer */}
            {selectedUser && (
                <div className="user-drawer">
                    <div className="drawer-overlay" onClick={() => setSelectedUser(null)} />
                    <div className="drawer-content">
                        <div className="drawer-header">
                            <h2>{selectedUser.name}</h2>
                            <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
                        </div>
                        <div className="drawer-body">
                            <div className="detail-section">
                                <h3>Profile & Verification</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{selectedUser.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Account Type</span>
                                    <StatusBadge label={selectedUser.accountType} variant="info" />
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Verification</span>
                                    <StatusBadge
                                        label={selectedUser.verified ? 'Verified' : 'Pending'}
                                        variant={selectedUser.verified ? 'success' : 'warning'}
                                    />
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Risk Score</span>
                                    <span className={`risk-score ${selectedUser.riskScore > 0.5 ? 'high' : 'low'}`}>
                                        {(selectedUser.riskScore * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Performance</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Total Uploads</span>
                                    <span className="detail-value">{selectedUser.totalUploads.toLocaleString()}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Approved Assets</span>
                                    <span className="detail-value">{selectedUser.approvedAssets.toLocaleString()}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Approval Rate</span>
                                    <span className="detail-value">
                                        {selectedUser.totalUploads > 0
                                            ? ((selectedUser.approvedAssets / selectedUser.totalUploads) * 100).toFixed(1)
                                            : 0}%
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Total Earnings</span>
                                    <span className="detail-value">${selectedUser.totalEarnings.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Admin Actions</h3>
                                <div className="action-buttons">
                                    <Button variant="secondary">Verify User</Button>
                                    <Button variant="secondary">Adjust Risk Score</Button>
                                    <Button variant="ghost" style={{ color: '#ef4444' }}>Suspend Account</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .admin-users { max-width: 1400px; }
        .users-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .search-box input {
          background: #141414;
          border: 1px solid #262626;
          border-radius: 6px;
          padding: 8px 16px;
          color: #fafafa;
          font-size: 13px;
          width: 240px;
        }
        .search-box input::placeholder { color: #525252; }
        .user-cell {
          display: flex;
          flex-direction: column;
        }
        .user-email { color: #fafafa; }
        .user-name { color: #a3a3a3; font-size: 12px; }
        .risk-score {
          font-weight: 500;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .risk-score.high { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .risk-score.medium { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .risk-score.low { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
        
        /* Drawer */
        .user-drawer {
          position: fixed;
          inset: 0;
          z-index: 100;
        }
        .drawer-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        .drawer-content {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 400px;
          background: #141414;
          border-left: 1px solid #262626;
          display: flex;
          flex-direction: column;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #262626;
        }
        .drawer-header h2 { margin: 0; font-size: 18px; }
        .close-btn {
          background: none;
          border: none;
          color: #a3a3a3;
          font-size: 24px;
          cursor: pointer;
        }
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        .detail-section {
          margin-bottom: 24px;
        }
        .detail-section h3 {
          font-size: 12px;
          color: #a3a3a3;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #262626;
        }
        .detail-label { color: #a3a3a3; font-size: 13px; }
        .detail-value { color: #fafafa; font-size: 13px; }
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
        </div>
    );
}

export default AdminUsers;
