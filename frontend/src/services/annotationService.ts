
// Annotation Queue Service
// Manages the professional annotation bin

export interface AnnotationQueueItem {
    id: string;
    uploadId: string;
    filename: string;
    contributorName: string;
    autoScore: number;
    yoloConfidence: number;
    samCoverage: number;
    assignedTo: string | null;
    priority: 'low' | 'normal' | 'high';
    status: 'waiting' | 'assigned' | 'in_progress' | 'completed';
    timeInQueue: string; // e.g. "2h 15m"
    createdAt: string;
}

let ANNOTATION_QUEUE: AnnotationQueueItem[] = [
    {
        id: 'q1',
        uploadId: 'u1',
        filename: 'lego_build_01.mp4',
        contributorName: 'Alex Chen',
        autoScore: 88,
        yoloConfidence: 0.94,
        samCoverage: 0.89,
        assignedTo: null,
        priority: 'high',
        status: 'waiting',
        timeInQueue: '45m',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'q2',
        uploadId: 'u2',
        filename: 'lego_build_02.mp4',
        contributorName: 'Maria G.',
        autoScore: 92,
        yoloConfidence: 0.96,
        samCoverage: 0.91,
        assignedTo: 'Jon Doe',
        priority: 'normal',
        status: 'in_progress',
        timeInQueue: '2h 10m',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
    }
];

export const annotationService = {
    getQueue: (): AnnotationQueueItem[] => {
        return ANNOTATION_QUEUE.sort((a, b) => {
            const priorityMap = { high: 0, normal: 1, low: 2 };
            return priorityMap[a.priority] - priorityMap[b.priority];
        });
    },

    assignJob: (queueId: string, annotatorName: string): void => {
        const item = ANNOTATION_QUEUE.find(q => q.id === queueId);
        if (item) {
            item.assignedTo = annotatorName;
            item.status = 'assigned';
        }
    },

    updatePriority: (queueId: string, priority: 'low' | 'normal' | 'high'): void => {
        const item = ANNOTATION_QUEUE.find(q => q.id === queueId);
        if (item) {
            item.priority = priority;
        }
    },

    updateStatus: (queueId: string, status: AnnotationQueueItem['status']): void => {
        const item = ANNOTATION_QUEUE.find(q => q.id === queueId);
        if (item) {
            item.status = status;
        }
    },

    addToQueue: (upload: any): void => {
        ANNOTATION_QUEUE.push({
            id: `q${Math.random().toString(36).substr(2, 5)}`,
            uploadId: upload.id,
            filename: upload.filename,
            contributorName: upload.uploaderName,
            autoScore: upload.autoScore,
            yoloConfidence: upload.objectConfidence || 0.85,
            samCoverage: upload.blurScore ? (100 - upload.blurScore) / 100 : 0.8,
            assignedTo: null,
            priority: upload.autoScore > 90 ? 'normal' : 'high',
            status: 'waiting',
            timeInQueue: '0m',
            createdAt: new Date().toISOString(),
        });
    }
};
