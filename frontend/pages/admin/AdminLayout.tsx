import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: 'Overview', path: '/admin', icon: <OverviewIcon /> },
    { label: 'Users', path: '/admin/users', icon: <UsersIcon /> },
    { label: 'Content Ingestion', path: '/admin/ingestion', icon: <UploadIcon /> },
    { label: 'Annotation & QA', path: '/admin/annotation', icon: <AnnotationIcon /> },
    { label: 'Datasets', path: '/admin/datasets', icon: <DatasetIcon /> },
    { label: 'Marketplace & Sales', path: '/admin/marketplace', icon: <MarketIcon /> },
    { label: 'Ads & Creative', path: '/admin/ads', icon: <AdsIcon /> },
    { label: 'Revenue & Payouts', path: '/admin/revenue', icon: <RevenueIcon /> },
    { label: 'Infrastructure', path: '/admin/infrastructure', icon: <InfraIcon /> },
    { label: 'Compliance & Audit', path: '/admin/compliance', icon: <AuditIcon /> },
    { label: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
];

export function AdminLayout() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="admin-sidebar-header">
                    <Link to="/admin" className="admin-logo">
                        {!collapsed && <span className="admin-logo-text">HARBOR</span>}
                        <span className="admin-logo-badge">Admin</span>
                    </Link>
                    <button
                        className="admin-collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            {!collapsed && <span className="admin-nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    {!collapsed && (
                        <div className="admin-system-status">
                            <span className="status-dot online"></span>
                            <span>System Online</span>
                        </div>
                    )}
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>

            <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #0a0a0a;
          color: #fafafa;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
        }
        
        .admin-sidebar {
          width: 240px;
          background: #141414;
          border-right: 1px solid #262626;
          display: flex;
          flex-direction: column;
          transition: width 0.2s ease;
        }
        
        .admin-sidebar.collapsed {
          width: 60px;
        }
        
        .admin-sidebar-header {
          padding: 16px;
          border-bottom: 1px solid #262626;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: inherit;
        }
        
        .admin-logo-text {
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 1px;
        }
        
        .admin-logo-badge {
          font-size: 10px;
          padding: 2px 6px;
          background: #3b82f6;
          border-radius: 4px;
          font-weight: 500;
        }
        
        .admin-collapse-btn {
          background: transparent;
          border: 1px solid #262626;
          color: #a3a3a3;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .admin-collapse-btn:hover {
          background: #262626;
          color: #fafafa;
        }
        
        .admin-nav {
          flex: 1;
          padding: 8px;
          overflow-y: auto;
        }
        
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          color: #a3a3a3;
          text-decoration: none;
          border-radius: 6px;
          margin-bottom: 2px;
          transition: all 0.15s ease;
        }
        
        .admin-nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fafafa;
        }
        
        .admin-nav-item.active {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }
        
        .admin-nav-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .admin-nav-label {
          font-size: 13px;
          white-space: nowrap;
        }
        
        .admin-sidebar-footer {
          padding: 16px;
          border-top: 1px solid #262626;
        }
        
        .admin-system-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #a3a3a3;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .status-dot.online {
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
        }
        
        .admin-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }
      `}</style>
        </div>
    );
}

// Icon components
function OverviewIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>; }
function UsersIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function UploadIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>; }
function AnnotationIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>; }
function DatasetIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>; }
function MarketIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>; }
function AdsIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>; }
function RevenueIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>; }
function InfraIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>; }
function AuditIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>; }
function SettingsIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>; }

export default AdminLayout;
