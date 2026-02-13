import React, { useState, useEffect } from 'react';
import {
    Search, Filter, MoreHorizontal, User,
    ArrowUpCircle, AlertCircle, Clock, CheckCircle,
    LayoutGrid, List as ListIcon, Calendar
} from 'lucide-react';
import { annotationService, type AnnotationQueueItem } from '../../services/annotationService';
import { StatusBadge, PageHeader, DataTable, Button } from '../../components/admin/AdminComponents';
import { AnnotationDetail } from './AnnotationDetail';

export function AdminAnnotation() {
    const [queue, setQueue] = useState<AnnotationQueueItem[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<AnnotationQueueItem | null>(null);

    useEffect(() => {
        setQueue(annotationService.getQueue());
    }, []);

    const handleAssign = (id: string) => {
        annotationService.assignJob(id, 'Current Admin');
        const updatedQueue = annotationService.getQueue();
        setQueue(updatedQueue);
        const item = updatedQueue.find(q => q.id === id);
        if (item) setSelectedItem(item);
    };

    const handleComplete = (id: string, labels: any) => {
        annotationService.updateStatus(id, 'completed');
        setQueue(annotationService.getQueue());
        setSelectedItem(null);
    };

    const handleEscalate = (id: string) => {
        annotationService.updatePriority(id, 'high');
        setQueue(annotationService.getQueue());
    };

    const columns = [
        {
            key: 'filename', label: 'Media', render: (item: AnnotationQueueItem) => (
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setSelectedItem(item)}
                >
                    <div className="w-8 h-8 bg-[#1a1a1a] rounded flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                        <LayoutGrid size={14} className="text-[#525252] group-hover:text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-medium group-hover:text-blue-400 transition-colors">{item.filename}</div>
                        <div className="text-[10px] text-[#525252] font-mono">{item.uploadId}</div>
                    </div>
                </div>
            )
        },
        // ... (remaining columns remain same)
        {
            key: 'contributor', label: 'Contributor', render: (item: AnnotationQueueItem) => (
                <span className="text-sm text-[#737373]">{item.contributorName}</span>
            )
        },
        {
            key: 'metrics', label: 'QA Metrics', render: (item: AnnotationQueueItem) => (
                <div className="flex items-center gap-4">
                    <div title="Auto Score">
                        <span className="text-[10px] text-[#525252] block uppercase tracking-wider">Auto</span>
                        <span className={`text-sm font-semibold ${item.autoScore > 80 ? 'text-green-500' : 'text-amber-500'}`}>{item.autoScore}</span>
                    </div>
                    <div title="YOLO Confidence">
                        <span className="text-[10px] text-[#525252] block uppercase tracking-wider">YOLO</span>
                        <span className="text-sm text-[#a3a3a3]">{(item.yoloConfidence * 100).toFixed(0)}%</span>
                    </div>
                    <div title="SAM Coverage">
                        <span className="text-[10px] text-[#525252] block uppercase tracking-wider">SAM</span>
                        <span className="text-sm text-[#a3a3a3]">{(item.samCoverage * 100).toFixed(0)}%</span>
                    </div>
                </div>
            )
        },
        {
            key: 'assigned', label: 'Assigned To', render: (item: AnnotationQueueItem) => (
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#111] flex items-center justify-center border border-[#262626]">
                        <User size={10} className="text-[#525252]" />
                    </div>
                    <span className="text-xs text-[#a3a3a3]">{item.assignedTo || 'Unassigned'}</span>
                </div>
            )
        },
        {
            key: 'priority', label: 'Priority', render: (item: AnnotationQueueItem) => (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${item.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                    item.priority === 'normal' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-gray-500/10 text-gray-500'
                    }`}>
                    {item.priority}
                </span>
            )
        },
        {
            key: 'status', label: 'Status', render: (item: AnnotationQueueItem) => (
                <StatusBadge
                    label={item.status.replace('_', ' ')}
                    variant={
                        item.status === 'completed' ? 'success' :
                            item.status === 'in_progress' ? 'info' :
                                item.status === 'assigned' ? 'warning' : 'info'
                    }
                />
            )
        },
        {
            key: 'queue_time', label: 'In Queue', render: (item: AnnotationQueueItem) => (
                <div className="flex items-center gap-1.5 text-xs text-[#525252]">
                    <Clock size={12} />
                    {item.timeInQueue}
                </div>
            )
        },
        {
            key: 'actions', label: '', render: (item: AnnotationQueueItem) => (
                <div className="flex gap-2">
                    {!item.assignedTo && (
                        <button
                            onClick={() => handleAssign(item.id)}
                            className="px-2 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                        >
                            ASSIGN
                        </button>
                    )}
                    {item.assignedTo && item.status !== 'completed' && (
                        <button
                            onClick={() => setSelectedItem(item)}
                            className="px-2 py-1 text-[10px] font-bold bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
                        >
                            LABELS
                        </button>
                    )}
                    {item.priority !== 'high' && (
                        <button
                            onClick={() => handleEscalate(item.id)}
                            className="p-1 text-[#525252] hover:text-red-500 transition-colors"
                            title="Escalate Priority"
                        >
                            <ArrowUpCircle size={16} />
                        </button>
                    )}
                </div>
            )
        },
    ];

    return (
        <div className="p-6 text-white max-w-[1500px]">
            {selectedItem && (
                <AnnotationDetail
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onComplete={handleComplete}
                />
            )}
            <div className="flex items-start justify-between mb-8">
                {/* ... (Header content) */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Annotation Bin</h1>
                    <p className="text-[#737373] mt-1 text-sm tracking-wide uppercase">Stage 3 — Human-in-the-loop Labeling Queue</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-[#141414] border border-[#262626] rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-[#262626] text-white' : 'text-[#525252]'}`}
                        >
                            <ListIcon size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#262626] text-white' : 'text-[#525252]'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                    <Button variant="primary">Export Labels</Button>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252]" />
                    <input
                        type="text"
                        placeholder="Filter queue by filename, contributor, or annotator..."
                        className="w-full bg-[#0a0a0a] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#141414] border border-[#262626] rounded-xl text-sm text-[#a3a3a3] hover:text-white transition-colors">
                    <Filter size={16} />
                    Filters
                </button>
                <div className="flex items-center gap-6 px-6 bg-[#141414] border border-[#262626] rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[#a3a3a3]">High Priority: <span className="text-white font-bold">{queue.filter(q => q.priority === 'high').length}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[#a3a3a3]">In Progress: <span className="text-white font-bold">{queue.filter(q => q.status === 'in_progress').length}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[#a3a3a3]">Avg Throughput: <span className="text-white font-bold">14.2m/item</span></span>
                    </div>
                </div>
            </div>

            <div className="border border-[#262626] rounded-2xl overflow-hidden bg-[#0a0a0a] shadow-2xl">
                <DataTable
                    columns={columns}
                    data={queue.filter(q => q.filename.toLowerCase().includes(searchQuery.toLowerCase()))}
                />
            </div>
        </div>
    );
}

export default AdminAnnotation;

