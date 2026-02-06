import React from 'react';
import { DataGrid } from '../shared/DataGrid';
import { StatusBadge, StatusType } from '../shared/StatusBadge';
import { MoreHorizontal } from 'lucide-react';

interface Project {
    id: string;
    name: string;
    type: 'Annotation' | 'RAG Evaluation' | 'Data Generation';
    progress: number;
    status: StatusType;
    lastUpdated: string;
    items: number;
}

const mockProjects: Project[] = [
    { id: '1', name: 'Maritime Vessel Classification - Batch A', type: 'Annotation', progress: 100, status: 'completed', lastUpdated: '2 hours ago', items: 1250 },
    { id: '2', name: 'RAG Knowledge Base - Q1 Financials', type: 'RAG Evaluation', progress: 45, status: 'active', lastUpdated: '5 mins ago', items: 500 },
    { id: '3', name: 'Synthetic Drone Footage Gen', type: 'Data Generation', progress: 12, status: 'processing', lastUpdated: '1 min ago', items: 10000 },
    { id: '4', name: 'Customer Support Chat RLHF', type: 'Annotation', progress: 0, status: 'pending', lastUpdated: '1 day ago', items: 2500 },
];

export const ProjectList: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#1A1A1A]">Active Projects</h3>
                <button className="text-sm text-stone-500 hover:text-[#1A1A1A]">View all</button>
            </div>

            <DataGrid
                data={mockProjects}
                columns={[
                    {
                        header: 'Project Name',
                        accessor: (item) => (
                            <div>
                                <div className="font-medium text-[#1A1A1A]">{item.name}</div>
                                <div className="text-xs text-stone-500">{item.type}</div>
                            </div>
                        )
                    },
                    {
                        header: 'Status',
                        accessor: (item) => <StatusBadge status={item.status} />
                    },
                    {
                        header: 'Progress',
                        accessor: (item) => (
                            <div className="w-full max-w-[140px] flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#1A1A1A] rounded-full transition-all duration-500"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-stone-500 w-8 text-right">{item.progress}%</span>
                            </div>
                        )
                    },
                    {
                        header: 'Items',
                        accessor: (item) => item.items.toLocaleString(),
                        className: 'text-right'
                    },
                    {
                        header: 'Last Updated',
                        accessor: 'lastUpdated'
                    },
                    {
                        header: '',
                        accessor: () => (
                            <button className="p-1 hover:bg-stone-100 rounded-md text-stone-400 hover:text-stone-600">
                                <MoreHorizontal size={16} />
                            </button>
                        ),
                        className: 'w-10'
                    }
                ]}
            />
        </div>
    );
};
