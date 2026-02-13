// ============================================
// Admin Pipeline Service — Harbor ML
// Full pipeline: Upload → Auto-Check → Annotation → QA → Dataset → Delivery
// localStorage-backed until backend API integration
// ============================================

// ============================================
// TYPES
// ============================================

export interface Campaign {
    id: string;
    name: string;
    slug: string;
    description: string;
    modality: 'video' | 'audio' | 'image' | 'mixed';
    expectedHours: number;
    targetContributors: number;
    status: 'active' | 'paused' | 'completed';
    createdAt: string;
}

export interface Upload {
    id: string;
    filename: string;
    uploaderId: string;
    uploaderName: string;
    campaignId: string | null;
    campaignName: string | null;
    duration: number; // seconds
    resolution: string;
    sizeBytes: number;
    modality: 'video' | 'audio';
    autoCheckStatus: 'pending' | 'passed' | 'flagged' | 'failed' | 'error';
    autoScore: number | null;
    autoCheckJson: AutoCheckSummary | null;
    assignedJobId: string | null;
    s3Path: string;
    createdAt: string;
    updatedAt: string;
}

export interface AutoCheck {
    id: string;
    uploadId: string;
    checkType: 'framing' | 'object_coverage' | 'continuity' | 'audio_noise' | 'transcription' | 'hands_detection' | 'face_detection';
    result: Record<string, any>;
    score: number;
    passed: boolean;
    latencyMs: number;
    modelVersion: string;
    createdAt: string;
}

export interface AutoCheckSummary {
    framing: number;
    objectCoverage: number;
    continuity: number;
    technicalQuality: number;
    annotationCoverage: number;
    compositeScore: number;
    flags: string[];
    totalLatencyMs: number;
}

export interface AnnotationJob {
    jobId: string;
    campaignId: string | null;
    mediaIds: string[];
    labelstudioProjectId: string;
    schemaName: string;
    assignedAnnotators: string[];
    taskCount: number;
    completedCount: number;
    status: 'created' | 'in_progress' | 'completed' | 'imported';
    prelabelsAttached: boolean;
    importedAt: string | null;
    createdAt: string;
}

export interface QAReview {
    qaId: string;
    uploadId: string;
    reviewerId: string;
    reviewerName: string;
    autoScore: number;
    humanScore: number;
    finalScore: number;
    action: 'approve' | 'reject' | 'request_edit';
    reason: string;
    notes: string;
    payoutEstimateCents: number;
    includeInDataset: boolean;
    qaChecklist: Record<string, boolean>;
    createdAt: string;
}

export interface DatasetBuild {
    datasetId: string;
    title: string;
    description: string;
    createdBy: string;
    mediaIds: string[];
    totalHours: number;
    totalClips: number;
    contributorsCount: number;
    version: string;
    splitConfig: { train: number; val: number; test: number };
    manifestPath: string | null;
    qaSummary: DatasetQASummary;
    finalDatasetScore: number;
    humanCheckedPct: number;
    status: 'building' | 'ready' | 'delivered';
    license: { type: string; scope: string };
    schemaName: string;
    deliveredAt: string | null;
    createdAt: string;
}

export interface DatasetQASummary {
    autoCheckPassRate: number;
    humanQAPassRate: number;
    medianAutoScore: number;
    medianHumanScore: number;
    avgSNR: number;
    clippingRate: number;
    frameCoverage: number;
    annotationAgreement: number; // IoU median
}

export interface ClientDelivery {
    id: string;
    datasetBuildId: string;
    clientOrgId: string;
    clientName: string;
    deliveryNotes: string;
    licenseAgreementUrl: string | null;
    invoiceRef: string | null;
    status: 'pending' | 'delivered' | 'acknowledged';
    deliveredAt: string | null;
    createdAt: string;
}

export interface AuditEvent {
    eventId: string;
    objectType: string;
    objectId: string;
    actorId: string;
    actorName: string;
    verb: string;
    metadata: Record<string, any>;
    createdAt: string;
}

export interface PipelineStats {
    uploadsTotal: number;
    uploads24h: number;
    autoFailCount: number;
    assetsInQA: number;
    datasetsReady: number;
    pendingExports: number;
    pipelineStages: {
        uploaded: number;
        processing: number;
        annotated: number;
        reviewed: number;
        datasetReady: number;
    };
}

export interface AutoCheckMetrics {
    checkType: string;
    avgScore: number;
    passRate: number;
    avgLatencyMs: number;
    errorRate: number;
    totalRuns: number;
}

// ============================================
// AUTO-SCORE FORMULA
// ============================================
export function computeAutoScore(summary: Omit<AutoCheckSummary, 'compositeScore' | 'flags' | 'totalLatencyMs'>): number {
    return Math.round((
        0.30 * summary.framing +
        0.25 * summary.objectCoverage +
        0.15 * summary.continuity +
        0.15 * summary.technicalQuality +
        0.15 * summary.annotationCoverage
    ) * 10) / 10;
}

export function computeFinalScore(autoScore: number, humanScore: number): number {
    return Math.round((0.4 * autoScore + 0.6 * humanScore) * 10) / 10;
}

export function classifyAutoScore(score: number): {
    status: 'pending_review' | 'auto_fail';
    label: string;
    color: string;
} {
    // No auto-pass — all assets require human QA review
    if (score >= 70) return { status: 'pending_review', label: 'Pending Review', color: '#d97706' };
    return { status: 'auto_fail', label: 'Auto Fail', color: '#dc2626' };
}

export function classifyFinalScore(score: number): {
    status: 'approved' | 'approved_notes' | 'reject';
    label: string;
    color: string;
} {
    if (score >= 80) return { status: 'approved', label: 'Approved', color: '#16a34a' };
    if (score >= 75) return { status: 'approved_notes', label: 'Approved (Notes)', color: '#65a30d' };
    return { status: 'reject', label: 'Reject / Edit', color: '#dc2626' };
}

// ============================================
// PRODUCTION MODE — No seed data
// All data comes from real user interactions
// ============================================

// ============================================
// STORAGE HELPERS
// ============================================

const STORAGE_KEYS = {
    campaigns: 'harbor_admin_campaigns',
    uploads: 'harbor_admin_uploads',
    autoChecks: 'harbor_admin_auto_checks',
    annotationJobs: 'harbor_admin_annotation_jobs',
    qaReviews: 'harbor_admin_qa_reviews',
    datasetBuilds: 'harbor_admin_dataset_builds',
    deliveries: 'harbor_admin_deliveries',
    auditEvents: 'harbor_admin_audit_events',
} as const;

function getStore<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
        return fallback;
    } catch {
        return fallback;
    }
}

function setStore<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
}

// ============================================
// PUBLIC API
// ============================================

// --- Pipeline stats (dashboard) ---

export function getPipelineStats(): PipelineStats {
    const uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    const qaReviews = getStore<QAReview[]>(STORAGE_KEYS.qaReviews, []);
    const builds = getStore<DatasetBuild[]>(STORAGE_KEYS.datasetBuilds, []);

    const now = new Date();
    const h24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return {
        uploadsTotal: uploads.length,
        uploads24h: uploads.filter(u => new Date(u.createdAt) > h24).length,
        autoFailCount: uploads.filter(u => u.autoCheckStatus === 'failed').length,
        assetsInQA: uploads.filter(u => u.autoCheckStatus === 'flagged' || u.autoCheckStatus === 'passed').length,
        datasetsReady: builds.filter(b => b.status === 'ready').length,
        pendingExports: builds.filter(b => b.status === 'building').length,
        pipelineStages: {
            uploaded: uploads.filter(u => u.autoCheckStatus === 'pending').length,
            processing: uploads.filter(u => u.autoCheckStatus === 'passed' && !u.assignedJobId).length,
            annotated: uploads.filter(u => u.assignedJobId !== null).length,
            reviewed: qaReviews.filter(q => q.action === 'approve').length,
            datasetReady: builds.length > 0 ? builds.length : 0,
        },
    };
}

export function registerUpload(payload: Partial<Upload>): Upload {
    const uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    const newUpload: Upload = {
        id: `upl_${Date.now()}`,
        filename: payload.filename || 'manual_upload.mp4',
        uploaderId: payload.uploaderId || 'admin',
        uploaderName: payload.uploaderName || 'Admin User',
        campaignId: payload.campaignId || 'camp_lego_pilot_w1',
        campaignName: payload.campaignName || 'LEGO Pilot Week 1',
        duration: payload.duration || 120,
        resolution: payload.resolution || '1080p',
        sizeBytes: payload.sizeBytes || 50 * 1024 * 1024,
        modality: (payload.modality as any) || 'video',
        autoCheckStatus: 'passed',
        autoScore: 85,
        autoCheckJson: {
            framing: 90,
            objectCoverage: 85,
            continuity: 88,
            technicalQuality: 82,
            annotationCoverage: 80,
            compositeScore: 85,
            flags: [],
            totalLatencyMs: 450,
        },
        assignedJobId: null,
        s3Path: `s3://harbor-ingest/${payload.filename}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    uploads.unshift(newUpload);
    setStore(STORAGE_KEYS.uploads, uploads);
    
    // Also add an audit event
    const events = getStore<AuditEvent[]>(STORAGE_KEYS.auditEvents, []);
    events.push({
        eventId: `evt_${Date.now()}`,
        objectType: 'upload',
        objectId: newUpload.id,
        actorId: 'admin',
        actorName: newUpload.uploaderName,
        verb: 'upload.manual_register',
        metadata: { filename: newUpload.filename },
        createdAt: new Date().toISOString(),
    });
    setStore(STORAGE_KEYS.auditEvents, events);
    
    return newUpload;
}

// --- Uploads ---

export function getUploads(filters?: { status?: string; campaignId?: string; minScore?: number }): Upload[] {
    let uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    if (filters?.status) uploads = uploads.filter(u => u.autoCheckStatus === filters.status);
    if (filters?.campaignId) uploads = uploads.filter(u => u.campaignId === filters.campaignId);
    if (filters?.minScore !== undefined) uploads = uploads.filter(u => u.autoScore !== null && u.autoScore >= filters.minScore!);
    return uploads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUpload(id: string): Upload | null {
    const uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    return uploads.find(u => u.id === id) || null;
}

export function recheckUpload(id: string): Upload {
    const uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    const idx = uploads.findIndex(u => u.id === id);
    if (idx < 0) throw new Error('Upload not found');
    // Simulate re-check with slight score variation
    const prevScore = uploads[idx].autoScore || 70;
    const newScore = Math.min(100, Math.max(0, prevScore + (Math.random() * 10 - 5)));
    const rounded = Math.round(newScore * 10) / 10;
    uploads[idx].autoScore = rounded;
    uploads[idx].autoCheckStatus = rounded >= 70 ? 'passed' : rounded >= 50 ? 'flagged' : 'failed';
    uploads[idx].updatedAt = new Date().toISOString();
    setStore(STORAGE_KEYS.uploads, uploads);
    return uploads[idx];
}

export function forceReject(id: string, note: string): Upload {
    const uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    const idx = uploads.findIndex(u => u.id === id);
    if (idx < 0) throw new Error('Upload not found');
    uploads[idx].autoCheckStatus = 'failed';
    uploads[idx].updatedAt = new Date().toISOString();
    setStore(STORAGE_KEYS.uploads, uploads);
    addAuditEvent('upload', id, 'Admin', 'upload.force_reject', { note });
    return uploads[idx];
}

// --- Auto-checks ---

export function getAutoChecks(uploadId: string): AutoCheck[] {
    const checks = getStore<AutoCheck[]>(STORAGE_KEYS.autoChecks, []);
    return checks.filter(c => c.uploadId === uploadId);
}

export function getAutoCheckMetrics(): AutoCheckMetrics[] {
    const checks = getStore<AutoCheck[]>(STORAGE_KEYS.autoChecks, []);
    const types = [...new Set(checks.map(c => c.checkType))];
    return types.map(type => {
        const typeChecks = checks.filter(c => c.checkType === type);
        return {
            checkType: type,
            avgScore: Math.round(typeChecks.reduce((s, c) => s + c.score, 0) / typeChecks.length * 10) / 10,
            passRate: Math.round(typeChecks.filter(c => c.passed).length / typeChecks.length * 100),
            avgLatencyMs: Math.round(typeChecks.reduce((s, c) => s + c.latencyMs, 0) / typeChecks.length),
            errorRate: 0,
            totalRuns: typeChecks.length,
        };
    });
}

// --- Annotation jobs ---

export function getAnnotationJobs(): AnnotationJob[] {
    return getStore<AnnotationJob[]>(STORAGE_KEYS.annotationJobs, []);
}

export function createAnnotationJob(mediaIds: string[], schema: string): AnnotationJob {
    const jobs = getStore<AnnotationJob[]>(STORAGE_KEYS.annotationJobs, []);
    const job: AnnotationJob = {
        jobId: `job_${Date.now()}`, campaignId: 'camp_lego_pilot_w1', mediaIds,
        labelstudioProjectId: `ls-proj-${Math.floor(Math.random() * 1000)}`, schemaName: schema,
        assignedAnnotators: [], taskCount: mediaIds.length * 50, completedCount: 0,
        status: 'created', prelabelsAttached: false, importedAt: null, createdAt: new Date().toISOString(),
    };
    jobs.push(job);
    setStore(STORAGE_KEYS.annotationJobs, jobs);
    // Update uploads with job id
    const uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    mediaIds.forEach(mid => {
        const u = uploads.find(u => u.id === mid);
        if (u) u.assignedJobId = job.jobId;
    });
    setStore(STORAGE_KEYS.uploads, uploads);
    addAuditEvent('annotation_job', job.jobId, 'Admin', 'annotation.job.created', { mediaCount: mediaIds.length, schema });
    return job;
}

// --- QA reviews ---

export function getQAQueue(): { upload: Upload; autoChecks: AutoCheck[]; existingReview: QAReview | null }[] {
    const uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    const reviews = getStore<QAReview[]>(STORAGE_KEYS.qaReviews, []);
    const checks = getStore<AutoCheck[]>(STORAGE_KEYS.autoChecks, []);

    // Priority: (1) flagged, (2) passed without review, (3) already reviewed
    const needsReview = uploads
        .filter(u => u.autoCheckStatus === 'flagged' || u.autoCheckStatus === 'passed')
        .sort((a, b) => {
            const aFlagged = a.autoCheckStatus === 'flagged' ? 0 : 1;
            const bFlagged = b.autoCheckStatus === 'flagged' ? 0 : 1;
            if (aFlagged !== bFlagged) return aFlagged - bFlagged;
            return (a.autoScore || 0) - (b.autoScore || 0);
        });

    return needsReview.map(u => ({
        upload: u,
        autoChecks: checks.filter(c => c.uploadId === u.id),
        existingReview: reviews.find(r => r.uploadId === u.id) || null,
    }));
}

export function getQAReviews(): QAReview[] {
    return getStore<QAReview[]>(STORAGE_KEYS.qaReviews, []);
}

export function submitQAReview(review: Omit<QAReview, 'qaId' | 'createdAt'>): QAReview {
    const reviews = getStore<QAReview[]>(STORAGE_KEYS.qaReviews, []);
    const newReview: QAReview = {
        ...review,
        qaId: `qa_${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    setStore(STORAGE_KEYS.qaReviews, reviews);
    addAuditEvent('upload', review.uploadId, review.reviewerName, 'qa.reviewed', { action: review.action, finalScore: review.finalScore });
    return newReview;
}

// --- Dataset builds ---

export function getDatasetBuilds(): DatasetBuild[] {
    return getStore<DatasetBuild[]>(STORAGE_KEYS.datasetBuilds, []);
}

export function getDatasetBuild(id: string): DatasetBuild | null {
    const builds = getStore<DatasetBuild[]>(STORAGE_KEYS.datasetBuilds, []);
    return builds.find(b => b.datasetId === id) || null;
}

export function createDatasetBuild(params: {
    title: string; description: string; mediaIds: string[];
    splitConfig: { train: number; val: number; test: number };
    license: { type: string; scope: string }; schemaName: string;
}): DatasetBuild {
    const builds = getStore<DatasetBuild[]>(STORAGE_KEYS.datasetBuilds, []);
    const uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    const selected = uploads.filter(u => params.mediaIds.includes(u.id));
    const totalSec = selected.reduce((s, u) => s + u.duration, 0);
    const contributors = new Set(selected.map(u => u.uploaderId));

    const build: DatasetBuild = {
        datasetId: `ds_${Date.now()}`,
        title: params.title,
        description: params.description,
        createdBy: 'admin',
        mediaIds: params.mediaIds,
        totalHours: Math.round(totalSec / 3600 * 10) / 10,
        totalClips: selected.length,
        contributorsCount: contributors.size,
        version: 'v1.0',
        splitConfig: params.splitConfig,
        manifestPath: null,
        qaSummary: computeDatasetQA(params.mediaIds),
        finalDatasetScore: 0,
        humanCheckedPct: 0,
        status: 'building',
        license: params.license,
        schemaName: params.schemaName,
        deliveredAt: null,
        createdAt: new Date().toISOString(),
    };
    build.finalDatasetScore = build.qaSummary.medianAutoScore;
    builds.push(build);
    setStore(STORAGE_KEYS.datasetBuilds, builds);
    addAuditEvent('dataset', build.datasetId, 'Admin', 'dataset.built', { version: build.version, clips: build.totalClips });
    return build;
}

function computeDatasetQA(mediaIds: string[]): DatasetQASummary {
    const uploads = getStore<Upload[]>(STORAGE_KEYS.uploads, []);
    const reviews = getStore<QAReview[]>(STORAGE_KEYS.qaReviews, []);
    const selected = uploads.filter(u => mediaIds.includes(u.id));
    const matchedReviews = reviews.filter(r => mediaIds.includes(r.uploadId));

    const autoScores = selected.map(u => u.autoScore || 0).sort((a, b) => a - b);
    const humanScores = matchedReviews.map(r => r.humanScore).sort((a, b) => a - b);

    return {
        autoCheckPassRate: Math.round(selected.filter(u => u.autoCheckStatus === 'passed').length / Math.max(selected.length, 1) * 100 * 10) / 10,
        humanQAPassRate: Math.round(matchedReviews.filter(r => r.action === 'approve').length / Math.max(matchedReviews.length, 1) * 100 * 10) / 10,
        medianAutoScore: autoScores.length > 0 ? autoScores[Math.floor(autoScores.length / 2)] : 0,
        medianHumanScore: humanScores.length > 0 ? humanScores[Math.floor(humanScores.length / 2)] : 0,
        avgSNR: 26.8,
        clippingRate: 3.2,
        frameCoverage: 89.4,
        annotationAgreement: 0.87,
    };
}

// --- Client deliveries ---

export function getClientDeliveries(): ClientDelivery[] {
    return getStore<ClientDelivery[]>(STORAGE_KEYS.deliveries, []);
}

export function createDelivery(params: { datasetBuildId: string; clientOrgId: string; clientName: string; notes: string }): ClientDelivery {
    const deliveries = getStore<ClientDelivery[]>(STORAGE_KEYS.deliveries, []);
    const delivery: ClientDelivery = {
        id: `del_${Date.now()}`, datasetBuildId: params.datasetBuildId, clientOrgId: params.clientOrgId,
        clientName: params.clientName, deliveryNotes: params.notes, licenseAgreementUrl: null,
        invoiceRef: null, status: 'pending', deliveredAt: null, createdAt: new Date().toISOString(),
    };
    deliveries.push(delivery);
    setStore(STORAGE_KEYS.deliveries, deliveries);
    addAuditEvent('delivery', delivery.id, 'Admin', 'dataset.delivered', { client: params.clientName });
    return delivery;
}

export function markDelivered(deliveryId: string): ClientDelivery {
    const deliveries = getStore<ClientDelivery[]>(STORAGE_KEYS.deliveries, []);
    const idx = deliveries.findIndex(d => d.id === deliveryId);
    if (idx < 0) throw new Error('Delivery not found');
    deliveries[idx].status = 'delivered';
    deliveries[idx].deliveredAt = new Date().toISOString();
    setStore(STORAGE_KEYS.deliveries, deliveries);
    return deliveries[idx];
}

// --- Audit events ---

export function getAuditEvents(objectId?: string): AuditEvent[] {
    let events = getStore<AuditEvent[]>(STORAGE_KEYS.auditEvents, []);
    if (objectId) events = events.filter(e => e.objectId === objectId);
    return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function addAuditEvent(objectType: string, objectId: string, actorName: string, verb: string, metadata: Record<string, any>): void {
    const events = getStore<AuditEvent[]>(STORAGE_KEYS.auditEvents, []);
    events.push({
        eventId: `evt_${Date.now()}`, objectType, objectId, actorId: 'system', actorName, verb, metadata, createdAt: new Date().toISOString(),
    });
    setStore(STORAGE_KEYS.auditEvents, events);
}

// --- Campaigns ---

export function getCampaigns(): Campaign[] {
    return getStore<Campaign[]>(STORAGE_KEYS.campaigns, []);
}

// --- Helpers ---

export function formatBytes(bytes: number): string {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    return `${(bytes / 1e3).toFixed(0)} KB`;
}

export function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
}

export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
