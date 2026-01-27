import React from 'react';
import { DataGrid } from '../shared/DataGrid';
import { StatusBadge } from '../shared/StatusBadge';
import { Play } from 'lucide-react';

interface Task {
    id: string;
    type: 'Annotation' | 'Review' | 'Audio Transcription';
    reward: string;
    priority: 'high' | 'normal' | 'low';
    expiresIn: string;
}

const mockTasks: Task[] = [];

export const TaskQueue: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#1A1A1A]">Available Tasks</h3>
                <div className="flex gap-2">
                    <StatusBadge status="active" label="Queue Open" />
                </div>
            </div>

            <DataGrid
                data={mockTasks}
                columns={[
                    {
                        header: 'Task Type',
                        accessor: (item) => (
                            <div className="font-medium text-[#1A1A1A]">{item.type}</div>
                        )
                    },
                    {
                        header: 'Reward',
                        accessor: (item) => <span className="text-emerald-600 font-bold">{item.reward}</span>
                    },
                    {
                        header: 'Priority',
                        accessor: (item) => (
                            <span className={`text-xs font-bold uppercase tracking-wide ${item.priority === 'high' ? 'text-red-500' :
                                item.priority === 'normal' ? 'text-blue-500' : 'text-stone-400'
                                }`}>
                                {item.priority}
                            </span>
                        )
                    },
                    {
                        header: 'Expires In',
                        accessor: 'expiresIn'
                    },
                    {
                        header: '',
                        accessor: () => (
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] text-white text-xs font-medium rounded-lg hover:bg-black transition-colors">
                                <Play size={12} fill="currentColor" />
                                Start
                            </button>
                        ),
                        className: 'w-20'
                    }
                ]}
            />
        </div>
    );
};
