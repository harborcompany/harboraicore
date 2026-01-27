import React from 'react';
import { Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export type StatusType = 'active' | 'pending' | 'completed' | 'error' | 'processing';

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
    className?: string;
}

const config: Record<StatusType, { icon: any; color: string; bg: string; text: string }> = {
    active: {
        icon: Circle,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700'
    },
    processing: {
        icon: Clock,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700'
    },
    pending: {
        icon: Circle,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        text: 'text-amber-700'
    },
    completed: {
        icon: CheckCircle2,
        color: 'text-stone-500',
        bg: 'bg-stone-100',
        text: 'text-stone-700'
    },
    error: {
        icon: AlertCircle,
        color: 'text-red-500',
        bg: 'bg-red-50',
        text: 'text-red-700'
    }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
    const style = config[status] || config.pending;
    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${style.bg} ${style.text} ${className}`}>
            <Icon size={12} className={style.color} strokeWidth={3} />
            {label || status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};
