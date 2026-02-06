import React from 'react';

// ==========================================
// KPI CARD - Dense metric display
// ==========================================

interface KPICardProps {
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    prefix?: string;
    suffix?: string;
}

export function KPICard({ label, value, change, trend, prefix, suffix }: KPICardProps) {
    return (
        <div className="kpi-card">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">
                {prefix && <span className="kpi-prefix">{prefix}</span>}
                {typeof value === 'number' ? value.toLocaleString() : value}
                {suffix && <span className="kpi-suffix">{suffix}</span>}
            </div>
            {change !== undefined && (
                <div className={`kpi-change ${trend || 'neutral'}`}>
                    {trend === 'up' && '↑'}
                    {trend === 'down' && '↓'}
                    {Math.abs(change)}%
                </div>
            )}
            <style>{`
        .kpi-card {
          background: #141414;
          border: 1px solid #262626;
          border-radius: 8px;
          padding: 16px 20px;
        }
        .kpi-label {
          font-size: 12px;
          color: #a3a3a3;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .kpi-value {
          font-size: 28px;
          font-weight: 600;
          color: #fafafa;
        }
        .kpi-prefix, .kpi-suffix {
          font-size: 18px;
          color: #a3a3a3;
        }
        .kpi-change {
          font-size: 12px;
          margin-top: 4px;
        }
        .kpi-change.up { color: #22c55e; }
        .kpi-change.down { color: #ef4444; }
        .kpi-change.neutral { color: #a3a3a3; }
      `}</style>
        </div>
    );
}

// ==========================================
// STATUS BADGE
// ==========================================

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
    label: string;
    variant?: BadgeVariant;
}

export function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
    const colors: Record<BadgeVariant, { bg: string; text: string }> = {
        success: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
        warning: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
        error: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
        info: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
        neutral: { bg: 'rgba(163, 163, 163, 0.15)', text: '#a3a3a3' },
    };

    return (
        <span
            className="status-badge"
            style={{
                background: colors[variant].bg,
                color: colors[variant].text
            }}
        >
            {label}
            <style>{`
        .status-badge {
          display: inline-flex;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
        </span>
    );
}

// ==========================================
// DATA TABLE - Dense sortable table
// ==========================================

interface Column<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
    loading?: boolean;
    emptyMessage?: string;
}

export function DataTable<T extends { id?: string }>({
    columns,
    data,
    onRowClick,
    loading,
    emptyMessage = 'No data available'
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = React.useState<string | null>(null);
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedData = React.useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a, b) => {
            const aVal = (a as any)[sortKey];
            const bVal = (b as any)[sortKey];
            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortKey, sortOrder]);

    return (
        <div className="data-table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key as string}
                                style={{ width: col.width }}
                                className={col.sortable ? 'sortable' : ''}
                                onClick={() => col.sortable && handleSort(col.key as string)}
                            >
                                {col.label}
                                {col.sortable && sortKey === col.key && (
                                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={columns.length} className="loading-row">Loading...</td></tr>
                    ) : sortedData.length === 0 ? (
                        <tr><td colSpan={columns.length} className="empty-row">{emptyMessage}</td></tr>
                    ) : (
                        sortedData.map((row, i) => (
                            <tr
                                key={row.id || i}
                                onClick={() => onRowClick?.(row)}
                                className={onRowClick ? 'clickable' : ''}
                            >
                                {columns.map((col) => (
                                    <td key={col.key as string}>
                                        {col.render ? col.render(row) : (row as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <style>{`
        .data-table-wrapper {
          overflow-x: auto;
          background: #141414;
          border: 1px solid #262626;
          border-radius: 8px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table th {
          text-align: left;
          padding: 12px 16px;
          background: #1a1a1a;
          color: #a3a3a3;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #262626;
        }
        .data-table th.sortable {
          cursor: pointer;
        }
        .data-table th.sortable:hover {
          color: #fafafa;
        }
        .sort-indicator {
          margin-left: 4px;
        }
        .data-table td {
          padding: 12px 16px;
          color: #fafafa;
          font-size: 13px;
          border-bottom: 1px solid #262626;
        }
        .data-table tr.clickable {
          cursor: pointer;
        }
        .data-table tr.clickable:hover td {
          background: rgba(255, 255, 255, 0.03);
        }
        .loading-row, .empty-row {
          text-align: center;
          color: #a3a3a3;
          padding: 40px !important;
        }
      `}</style>
        </div>
    );
}

// ==========================================
// CHART CARD - Wrapper for charts
// ==========================================

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export function ChartCard({ title, subtitle, children, actions }: ChartCardProps) {
    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <div>
                    <h3 className="chart-card-title">{title}</h3>
                    {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
                </div>
                {actions && <div className="chart-card-actions">{actions}</div>}
            </div>
            <div className="chart-card-content">
                {children}
            </div>
            <style>{`
        .chart-card {
          background: #141414;
          border: 1px solid #262626;
          border-radius: 8px;
        }
        .chart-card-header {
          padding: 16px 20px;
          border-bottom: 1px solid #262626;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chart-card-title {
          font-size: 14px;
          font-weight: 500;
          color: #fafafa;
          margin: 0;
        }
        .chart-card-subtitle {
          font-size: 12px;
          color: #a3a3a3;
          margin: 4px 0 0 0;
        }
        .chart-card-actions {
          display: flex;
          gap: 8px;
        }
        .chart-card-content {
          padding: 20px;
        }
      `}</style>
        </div>
    );
}

// ==========================================
// PAGE HEADER
// ==========================================

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
    return (
        <div className="page-header">
            <div>
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-actions">{actions}</div>}
            <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 24px;
          font-weight: 600;
          color: #fafafa;
          margin: 0;
        }
        .page-subtitle {
          font-size: 14px;
          color: #a3a3a3;
          margin: 4px 0 0 0;
        }
        .page-actions {
          display: flex;
          gap: 12px;
        }
      `}</style>
        </div>
    );
}

// ==========================================
// BUTTON
// ==========================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    return (
        <button className={`admin-btn ${variant} ${size} ${className}`} {...props}>
            {children}
            <style>{`
        .admin-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
        }
        .admin-btn.sm { padding: 6px 12px; font-size: 12px; }
        .admin-btn.md { padding: 8px 16px; font-size: 13px; }
        .admin-btn.lg { padding: 12px 24px; font-size: 14px; }
        .admin-btn.primary {
          background: #3b82f6;
          color: #fff;
        }
        .admin-btn.primary:hover { background: #2563eb; }
        .admin-btn.secondary {
          background: #262626;
          color: #fafafa;
          border: 1px solid #404040;
        }
        .admin-btn.secondary:hover { background: #333; }
        .admin-btn.ghost {
          background: transparent;
          color: #a3a3a3;
        }
        .admin-btn.ghost:hover { color: #fafafa; background: rgba(255,255,255,0.05); }
        .admin-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </button>
    );
}

// ==========================================
// TABS
// ==========================================

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    return (
        <div className="admin-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className="admin-tab-count">{tab.count}</span>
                    )}
                </button>
            ))}
            <style>{`
        .admin-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: #1a1a1a;
          border-radius: 8px;
          width: fit-content;
        }
        .admin-tab {
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: #a3a3a3;
          font-size: 13px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s ease;
        }
        .admin-tab:hover {
          color: #fafafa;
        }
        .admin-tab.active {
          background: #262626;
          color: #fafafa;
        }
        .admin-tab-count {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
        }
      `}</style>
        </div>
    );
}
