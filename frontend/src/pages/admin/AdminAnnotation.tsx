import React, { useState, useEffect, useCallback } from 'react';

// ============================================
// TYPES
// ============================================

interface Submission {
    id: string;
    contributorName: string;
    contributorEmail: string;
    uploadDate: string;
    duration: string;
    durationSeconds: number;
    setPieceEstimate: number;
    status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'partial';
    resolution: string;
    device: string;
    lightingCondition: string;
    locationTag: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    annotations: AnnotationItem[];
    confidenceScore: ConfidenceScore;
    metadata: SubmissionMetadata;
}

interface AnnotationItem {
    id: string;
    frameTimestamp: number;
    brickType: string;
    boundingBox: [number, number, number, number];
    confidenceScore: number;
    source: 'auto' | 'crowd' | 'uploader';
    status: 'pending' | 'approved' | 'rejected';
    metaTags: string[];
    contextQuality: {
        blur: number;
        lighting: string;
        occlusion: number;
    };
}

interface ConfidenceScore {
    overall: number;
    modelAgreement: number;
    crossUserAgreement: number;
    contextQuality: number;
    userReliability: number;
}

interface SubmissionMetadata {
    totalFrames: number;
    fps: number;
    totalAnnotations: number;
    autoAnnotations: number;
    humanAnnotations: number;
    modelVersions: string[];
}

interface FilterState {
    status: string;
    creator: string;
    dateRange: string;
    minConfidence: number;
}

// ============================================
// MOCK DATA (wired to real API shape)
// ============================================

const MOCK_SUBMISSIONS: Submission[] = [
    {
        id: 'sub_001', contributorName: 'John D.', contributorEmail: 'john@example.com',
        uploadDate: '2026-02-09T14:30:00Z', duration: '30:12', durationSeconds: 1812,
        setPieceEstimate: 350, status: 'pending', resolution: '1920x1080', device: 'iPhone 15 Pro',
        lightingCondition: 'Day — Natural', locationTag: 'Living Room',
        thumbnailUrl: '', videoUrl: '',
        annotations: [
            { id: 'ann_001', frameTimestamp: 12.5, brickType: '2x4 Red', boundingBox: [120, 80, 200, 160], confidenceScore: 0.94, source: 'auto', status: 'pending', metaTags: ['hand_present'], contextQuality: { blur: 0.05, lighting: 'good', occlusion: 0.1 } },
            { id: 'ann_002', frameTimestamp: 24.1, brickType: '1x2 Blue', boundingBox: [340, 220, 380, 260], confidenceScore: 0.87, source: 'auto', status: 'pending', metaTags: ['edge_occlusion'], contextQuality: { blur: 0.12, lighting: 'good', occlusion: 0.3 } },
            { id: 'ann_003', frameTimestamp: 45.7, brickType: '2x2 Yellow', boundingBox: [200, 150, 260, 210], confidenceScore: 0.72, source: 'auto', status: 'pending', metaTags: ['partial_lighting'], contextQuality: { blur: 0.2, lighting: 'moderate', occlusion: 0.15 } },
            { id: 'ann_004', frameTimestamp: 67.3, brickType: '1x4 Green', boundingBox: [80, 300, 160, 340], confidenceScore: 0.96, source: 'crowd', status: 'approved', metaTags: ['hand_present', 'clear_view'], contextQuality: { blur: 0.02, lighting: 'good', occlusion: 0.05 } },
        ],
        confidenceScore: { overall: 87, modelAgreement: 92, crossUserAgreement: 85, contextQuality: 78, userReliability: 90 },
        metadata: { totalFrames: 54360, fps: 30, totalAnnotations: 847, autoAnnotations: 720, humanAnnotations: 127, modelVersions: ['YOLOv8', 'SAM3', 'MediaPipe'] },
    },
    {
        id: 'sub_002', contributorName: 'Sarah L.', contributorEmail: 'sarah@example.com',
        uploadDate: '2026-02-09T11:15:00Z', duration: '19:45', durationSeconds: 1185,
        setPieceEstimate: 220, status: 'in_review', resolution: '3840x2160', device: 'Samsung Galaxy S24',
        lightingCondition: 'Indoor — LED', locationTag: 'Workshop',
        thumbnailUrl: '', videoUrl: '',
        annotations: [
            { id: 'ann_005', frameTimestamp: 5.2, brickType: '2x4 White', boundingBox: [100, 100, 180, 160], confidenceScore: 0.91, source: 'auto', status: 'approved', metaTags: ['clear_view'], contextQuality: { blur: 0.03, lighting: 'good', occlusion: 0.08 } },
            { id: 'ann_006', frameTimestamp: 18.9, brickType: '1x1 Black', boundingBox: [420, 190, 440, 210], confidenceScore: 0.65, source: 'auto', status: 'pending', metaTags: ['small_object', 'edge_occlusion'], contextQuality: { blur: 0.15, lighting: 'moderate', occlusion: 0.4 } },
        ],
        confidenceScore: { overall: 72, modelAgreement: 78, crossUserAgreement: 68, contextQuality: 65, userReliability: 82 },
        metadata: { totalFrames: 35550, fps: 30, totalAnnotations: 412, autoAnnotations: 380, humanAnnotations: 32, modelVersions: ['YOLOv8', 'MediaPipe'] },
    },
    {
        id: 'sub_003', contributorName: 'Mark T.', contributorEmail: 'mark@example.com',
        uploadDate: '2026-02-08T22:00:00Z', duration: '52:18', durationSeconds: 3138,
        setPieceEstimate: 480, status: 'approved', resolution: '1920x1080', device: 'Logitech C920',
        lightingCondition: 'Day — Diffused', locationTag: 'Office Desk',
        thumbnailUrl: '', videoUrl: '',
        annotations: [
            { id: 'ann_007', frameTimestamp: 10.0, brickType: '2x6 Red', boundingBox: [150, 90, 280, 170], confidenceScore: 0.98, source: 'auto', status: 'approved', metaTags: ['hand_present', 'clear_view'], contextQuality: { blur: 0.01, lighting: 'good', occlusion: 0.02 } },
        ],
        confidenceScore: { overall: 95, modelAgreement: 97, crossUserAgreement: 94, contextQuality: 91, userReliability: 96 },
        metadata: { totalFrames: 94140, fps: 30, totalAnnotations: 1842, autoAnnotations: 1600, humanAnnotations: 242, modelVersions: ['YOLOv8', 'SAM3', 'MediaPipe', 'Whisper'] },
    },
    {
        id: 'sub_004', contributorName: 'Emily R.', contributorEmail: 'emily@example.com',
        uploadDate: '2026-02-08T16:30:00Z', duration: '15:22', durationSeconds: 922,
        setPieceEstimate: 150, status: 'rejected', resolution: '1280x720', device: 'iPad Air',
        lightingCondition: 'Night — Lamp', locationTag: 'Kitchen Table',
        thumbnailUrl: '', videoUrl: '',
        annotations: [],
        confidenceScore: { overall: 34, modelAgreement: 40, crossUserAgreement: 0, contextQuality: 28, userReliability: 45 },
        metadata: { totalFrames: 27660, fps: 30, totalAnnotations: 89, autoAnnotations: 89, humanAnnotations: 0, modelVersions: ['YOLOv8'] },
    },
    {
        id: 'sub_005', contributorName: 'Alex K.', contributorEmail: 'alex@example.com',
        uploadDate: '2026-02-09T08:45:00Z', duration: '28:03', durationSeconds: 1683,
        setPieceEstimate: 310, status: 'pending', resolution: '3840x2160', device: 'iPhone 15 Pro Max',
        lightingCondition: 'Day — Natural', locationTag: 'Patio',
        thumbnailUrl: '', videoUrl: '',
        annotations: [
            { id: 'ann_008', frameTimestamp: 3.1, brickType: '2x4 Blue', boundingBox: [200, 120, 300, 200], confidenceScore: 0.89, source: 'auto', status: 'pending', metaTags: ['hand_present'], contextQuality: { blur: 0.08, lighting: 'good', occlusion: 0.1 } },
        ],
        confidenceScore: { overall: 81, modelAgreement: 85, crossUserAgreement: 80, contextQuality: 74, userReliability: 88 },
        metadata: { totalFrames: 50490, fps: 30, totalAnnotations: 623, autoAnnotations: 540, humanAnnotations: 83, modelVersions: ['YOLOv8', 'SAM3', 'MediaPipe'] },
    },
];

// ============================================
// HELPER COMPONENTS
// ============================================

function getStatusColor(status: string): string {
    switch (status) {
        case 'approved': return '#22c55e';
        case 'rejected': return '#ef4444';
        case 'in_review': return '#6366f1';
        case 'pending': return '#f59e0b';
        case 'partial': return '#f97316';
        default: return '#a3a3a3';
    }
}

function getConfidenceColor(score: number): string {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AdminAnnotation() {
    const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
    const [selectedId, setSelectedId] = useState<string>(MOCK_SUBMISSIONS[0]?.id || '');
    const [filters, setFilters] = useState<FilterState>({ status: 'all', creator: '', dateRange: 'all', minConfidence: 0 });
    const [activeTab, setActiveTab] = useState<'annotations' | 'metadata' | 'confidence' | 'actions'>('annotations');
    const [timelinePosition, setTimelinePosition] = useState(0);

    const selected = submissions.find(s => s.id === selectedId) || null;

    const filtered = submissions.filter(s => {
        if (filters.status !== 'all' && s.status !== filters.status) return false;
        if (filters.creator && !s.contributorName.toLowerCase().includes(filters.creator.toLowerCase())) return false;
        if (filters.minConfidence > 0 && s.confidenceScore.overall < filters.minConfidence) return false;
        return true;
    });

    // Stats
    const stats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'pending').length,
        approved: submissions.filter(s => s.status === 'approved').length,
        rejected: submissions.filter(s => s.status === 'rejected').length,
        avgConfidence: Math.round(submissions.reduce((sum, s) => sum + s.confidenceScore.overall, 0) / submissions.length),
        totalAnnotations: submissions.reduce((sum, s) => sum + s.metadata.totalAnnotations, 0),
    };

    const handleAction = useCallback((action: string) => {
        if (!selected) return;
        setSubmissions(prev => prev.map(s =>
            s.id === selected.id ? { ...s, status: action as Submission['status'] } : s
        ));
    }, [selected]);

    return (
        <div style={styles.container}>
            {/* ─── TOP BAR ─── */}
            <div style={styles.topBar}>
                <div>
                    <h1 style={styles.title}>Reviewer Dashboard</h1>
                    <p style={styles.subtitle}>Annotation QA &middot; Confidence Scoring &middot; Dataset Curation</p>
                </div>
                <div style={styles.statsRow}>
                    <StatPill label="Total" value={stats.total} color="#6366f1" />
                    <StatPill label="Pending" value={stats.pending} color="#f59e0b" />
                    <StatPill label="Approved" value={stats.approved} color="#22c55e" />
                    <StatPill label="Rejected" value={stats.rejected} color="#ef4444" />
                    <StatPill label="Avg Confidence" value={`${stats.avgConfidence}%`} color={getConfidenceColor(stats.avgConfidence)} />
                    <StatPill label="Annotations" value={stats.totalAnnotations.toLocaleString()} color="#3b82f6" />
                </div>
            </div>

            {/* ─── FILTERS ─── */}
            <div style={styles.filterBar}>
                <select style={styles.select} value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
                <input style={styles.searchInput} placeholder="Search creator..."
                    value={filters.creator} onChange={e => setFilters(f => ({ ...f, creator: e.target.value }))} />
                <select style={styles.select} value={filters.dateRange} onChange={e => setFilters(f => ({ ...f, dateRange: e.target.value }))}>
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </select>
                <div style={styles.confidenceFilter}>
                    <span style={{ fontSize: 12, color: '#a3a3a3' }}>Min Confidence</span>
                    <input type="range" min={0} max={100} value={filters.minConfidence}
                        onChange={e => setFilters(f => ({ ...f, minConfidence: Number(e.target.value) }))}
                        style={styles.slider} />
                    <span style={{ fontSize: 12, color: '#e5e5e5', width: 36, textAlign: 'right' }}>{filters.minConfidence}%</span>
                </div>
            </div>

            {/* ─── MAIN SPLIT ─── */}
            <div style={styles.mainGrid}>
                {/* LEFT: Video List */}
                <div style={styles.videoList}>
                    <div style={styles.panelHeader}>
                        <span style={styles.panelTitle}>Submissions</span>
                        <span style={styles.panelCount}>{filtered.length}</span>
                    </div>
                    {filtered.map(sub => (
                        <div
                            key={sub.id}
                            style={{
                                ...styles.videoCard,
                                borderColor: selectedId === sub.id ? '#6366f1' : 'transparent',
                                background: selectedId === sub.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                            }}
                            onClick={() => setSelectedId(sub.id)}
                        >
                            {/* Thumbnail placeholder */}
                            <div style={styles.thumbnail}>
                                <div style={{ ...styles.statusDot, background: getStatusColor(sub.status) }} />
                                <span style={styles.durationBadge}>{sub.duration}</span>
                            </div>
                            <div style={styles.videoInfo}>
                                <div style={styles.videoName}>{sub.contributorName}</div>
                                <div style={styles.videoMeta}>
                                    {sub.setPieceEstimate}pcs &middot; {sub.resolution} &middot; {formatDate(sub.uploadDate)}
                                </div>
                                <div style={styles.videoConfRow}>
                                    <div style={styles.miniBar}>
                                        <div style={{ ...styles.miniBarFill, width: `${sub.confidenceScore.overall}%`, background: getConfidenceColor(sub.confidenceScore.overall) }} />
                                    </div>
                                    <span style={{ fontSize: 11, color: getConfidenceColor(sub.confidenceScore.overall), fontWeight: 600 }}>{sub.confidenceScore.overall}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT: Detail Panels */}
                <div style={styles.detailArea}>
                    {selected ? (
                        <>
                            {/* Video Preview */}
                            <div style={styles.videoPreview}>
                                <div style={styles.previewPlaceholder}>
                                    <div style={styles.playIcon}>▶</div>
                                    <div style={styles.previewOverlay}>
                                        <span>{selected.contributorName} &middot; {selected.duration} &middot; {selected.resolution}</span>
                                    </div>
                                </div>
                                {/* Timeline */}
                                <div style={styles.timeline}>
                                    <div style={styles.timelineTrack}>
                                        {selected.annotations.map(ann => (
                                            <div
                                                key={ann.id}
                                                style={{
                                                    ...styles.timelineMarker,
                                                    left: `${(ann.frameTimestamp / selected.durationSeconds) * 100}%`,
                                                    background: ann.status === 'approved' ? '#22c55e' : ann.status === 'rejected' ? '#ef4444' : '#f59e0b',
                                                }}
                                                title={`${ann.brickType} @ ${ann.frameTimestamp.toFixed(1)}s — ${(ann.confidenceScore * 100).toFixed(0)}%`}
                                            />
                                        ))}
                                        <div style={{ ...styles.timelinePlayhead, left: `${timelinePosition}%` }} />
                                    </div>
                                    <div style={styles.timelineLabels}>
                                        <span>0:00</span>
                                        <span>{selected.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tab Bar */}
                            <div style={styles.tabBar}>
                                {(['annotations', 'metadata', 'confidence', 'actions'] as const).map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}>
                                        {tab === 'annotations' ? `Annotations (${selected.annotations.length})` :
                                            tab === 'metadata' ? 'Metadata' :
                                                tab === 'confidence' ? 'Confidence Scores' : 'Actions'}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div style={styles.tabContent}>
                                {activeTab === 'annotations' && <AnnotationsPanel submission={selected} />}
                                {activeTab === 'metadata' && <MetadataPanel submission={selected} />}
                                {activeTab === 'confidence' && <ConfidencePanel submission={selected} />}
                                {activeTab === 'actions' && <ActionsPanel submission={selected} onAction={handleAction} />}
                            </div>
                        </>
                    ) : (
                        <div style={styles.emptyState}>Select a submission to review</div>
                    )}
                </div>
            </div>

            {/* ─── ML Pipeline Status ─── */}
            <div style={styles.pipelineBar}>
                <div style={styles.panelHeader}>
                    <span style={styles.panelTitle}>ML Pipeline</span>
                </div>
                <div style={styles.pipelineGrid}>
                    <PipelineCard name="YOLOv8" status="active" version="8.0.0" description="Object detection — bricks, hands, tools" accuracy={94.2} />
                    <PipelineCard name="SAM3" status="active" version="3.0" description="Instance segmentation — pixel-level masks" accuracy={91.8} />
                    <PipelineCard name="MediaPipe" status="active" version="0.10.7" description="Hand pose estimation — 21 keypoints" accuracy={96.1} />
                    <PipelineCard name="Whisper" status="active" version="large-v3" description="Speech-to-text transcription" accuracy={92.5} />
                    <PipelineCard name="Cognee" status="standby" version="2.0" description="Graph RAG — knowledge extraction" accuracy={0} />
                    <PipelineCard name="Confidence Scorer" status="active" version="1.0.0" description="4-component annotation quality scoring" accuracy={0} />
                </div>
            </div>
        </div>
    );
}

// ============================================
// PANEL COMPONENTS
// ============================================

function AnnotationsPanel({ submission }: { submission: Submission }) {
    return (
        <div>
            {submission.annotations.length === 0 ? (
                <div style={styles.emptyState}>No annotations found. Run auto-annotation pipeline first.</div>
            ) : (
                <div style={styles.annotationList}>
                    <div style={styles.annotationHeader}>
                        <span style={{ flex: 1 }}>Brick Type</span>
                        <span style={{ width: 80 }}>Time</span>
                        <span style={{ width: 80 }}>Confidence</span>
                        <span style={{ width: 80 }}>Source</span>
                        <span style={{ width: 80 }}>Status</span>
                        <span style={{ width: 120 }}>Tags</span>
                        <span style={{ width: 100 }}>Actions</span>
                    </div>
                    {submission.annotations.map(ann => (
                        <div key={ann.id} style={styles.annotationRow}>
                            <span style={{ flex: 1, fontWeight: 500, color: '#e5e5e5' }}>{ann.brickType}</span>
                            <span style={{ width: 80, color: '#a3a3a3', fontFamily: 'monospace', fontSize: 12 }}>{ann.frameTimestamp.toFixed(1)}s</span>
                            <span style={{ width: 80 }}>
                                <span style={{ color: getConfidenceColor(ann.confidenceScore * 100), fontWeight: 600, fontSize: 13 }}>
                                    {(ann.confidenceScore * 100).toFixed(0)}%
                                </span>
                            </span>
                            <span style={{ width: 80 }}>
                                <span style={{ ...styles.sourceBadge, background: ann.source === 'auto' ? 'rgba(99,102,241,0.15)' : ann.source === 'crowd' ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.15)', color: ann.source === 'auto' ? '#818cf8' : ann.source === 'crowd' ? '#4ade80' : '#fb923c' }}>
                                    {ann.source}
                                </span>
                            </span>
                            <span style={{ width: 80 }}>
                                <span style={{ ...styles.statusBadge, background: `${getStatusColor(ann.status)}20`, color: getStatusColor(ann.status) }}>
                                    {ann.status}
                                </span>
                            </span>
                            <span style={{ width: 120, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {ann.metaTags.slice(0, 2).map(tag => (
                                    <span key={tag} style={styles.tag}>{tag}</span>
                                ))}
                            </span>
                            <span style={{ width: 100, display: 'flex', gap: 4 }}>
                                <button style={styles.approveBtn} title="Approve">✓</button>
                                <button style={styles.rejectBtn} title="Reject">✗</button>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MetadataPanel({ submission }: { submission: Submission }) {
    return (
        <div style={styles.metadataGrid}>
            <MetaRow label="Creator" value={`${submission.contributorName} (${submission.contributorEmail})`} />
            <MetaRow label="Upload Date" value={new Date(submission.uploadDate).toLocaleString()} />
            <MetaRow label="Duration" value={submission.duration} />
            <MetaRow label="Resolution" value={submission.resolution} />
            <MetaRow label="Device" value={submission.device} />
            <MetaRow label="Set Piece Estimate" value={`${submission.setPieceEstimate} pieces`} />
            <MetaRow label="Lighting Condition" value={submission.lightingCondition} />
            <MetaRow label="Location" value={submission.locationTag} />
            <MetaRow label="Total Frames" value={submission.metadata.totalFrames.toLocaleString()} />
            <MetaRow label="FPS" value={String(submission.metadata.fps)} />
            <MetaRow label="Total Annotations" value={submission.metadata.totalAnnotations.toLocaleString()} />
            <MetaRow label="Auto Annotations" value={submission.metadata.autoAnnotations.toLocaleString()} />
            <MetaRow label="Human Annotations" value={submission.metadata.humanAnnotations.toLocaleString()} />
            <MetaRow label="ML Models Used" value={submission.metadata.modelVersions.join(', ')} />
        </div>
    );
}

function ConfidencePanel({ submission }: { submission: Submission }) {
    const cs = submission.confidenceScore;
    return (
        <div style={styles.confidenceGrid}>
            {/* Overall */}
            <div style={styles.overallScore}>
                <div style={styles.scoreCircle}>
                    <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
                        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                        <circle cx="60" cy="60" r="52" fill="none" stroke={getConfidenceColor(cs.overall)} strokeWidth="8"
                            strokeDasharray={`${(cs.overall / 100) * 327} 327`} strokeLinecap="round"
                            transform="rotate(-90 60 60)" />
                    </svg>
                    <div style={styles.scoreText}>
                        <span style={{ fontSize: 32, fontWeight: 700, color: getConfidenceColor(cs.overall) }}>{cs.overall}</span>
                        <span style={{ fontSize: 12, color: '#a3a3a3' }}>Overall</span>
                    </div>
                </div>
            </div>

            {/* Breakdown */}
            <div style={styles.breakdownList}>
                <ConfidenceBar label="Model Agreement" value={cs.modelAgreement} weight="40%" description="User labels vs auto-annotation predictions" />
                <ConfidenceBar label="Cross-User Agreement" value={cs.crossUserAgreement} weight="30%" description="Consensus across multiple annotators" />
                <ConfidenceBar label="User Reliability" value={cs.userReliability} weight="20%" description="Historical accuracy of this contributor" />
                <ConfidenceBar label="Context Quality" value={cs.contextQuality} weight="10%" description="Image clarity, stability, and occlusion levels" />
            </div>

            {/* Formula */}
            <div style={styles.formulaBox}>
                <code style={styles.formula}>
                    confidence = 0.4 × model_agreement + 0.3 × cross_user + 0.2 × reliability + 0.1 × context
                </code>
            </div>
        </div>
    );
}

function ActionsPanel({ submission, onAction }: { submission: Submission; onAction: (action: string) => void }) {
    return (
        <div style={styles.actionsGrid}>
            <ActionButton label="Approve" icon="✓" description="Mark all annotations as approved and add to training set" color="#22c55e" onClick={() => onAction('approved')} />
            <ActionButton label="Request Re-submission" icon="↺" description="Ask contributor to re-record with better quality" color="#f59e0b" onClick={() => onAction('pending')} />
            <ActionButton label="Partial Approve" icon="≈" description="Approve some annotations, flag others for review" color="#6366f1" onClick={() => onAction('partial')} />
            <ActionButton label="Reject" icon="✗" description="Reject submission — does not meet quality standards" color="#ef4444" onClick={() => onAction('rejected')} />

            <div style={styles.actionDivider} />

            <div style={styles.exportSection}>
                <h4 style={{ color: '#e5e5e5', margin: '0 0 8px', fontSize: 14 }}>Dataset Export</h4>
                <p style={{ color: '#a3a3a3', fontSize: 12, margin: '0 0 12px' }}>Package approved annotations for licensing</p>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button style={styles.exportBtn}>Export COCO JSON</button>
                    <button style={styles.exportBtn}>Export YOLO Format</button>
                    <button style={styles.exportBtn}>Export CSV</button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MICRO COMPONENTS
// ============================================

function StatPill({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div style={styles.statPill}>
            <span style={{ fontSize: 11, color: '#a3a3a3', textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{label}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color }}>{value}</span>
        </div>
    );
}

function MetaRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={styles.metaRow}>
            <span style={styles.metaLabel}>{label}</span>
            <span style={styles.metaValue}>{value}</span>
        </div>
    );
}

function ConfidenceBar({ label, value, weight, description }: { label: string; value: number; weight: string; description: string }) {
    return (
        <div style={styles.confBar}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#e5e5e5', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 13, color: getConfidenceColor(value), fontWeight: 600 }}>{value}%</span>
            </div>
            <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${value}%`, background: getConfidenceColor(value) }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <span style={{ fontSize: 11, color: '#737373' }}>{description}</span>
                <span style={{ fontSize: 11, color: '#525252' }}>Weight: {weight}</span>
            </div>
        </div>
    );
}

function ActionButton({ label, icon, description, color, onClick }: { label: string; icon: string; description: string; color: string; onClick: () => void }) {
    return (
        <button style={{ ...styles.actionButton, borderColor: `${color}30` }} onClick={onClick}>
            <span style={{ fontSize: 20, color }}>{icon}</span>
            <div>
                <span style={{ fontWeight: 600, color: '#e5e5e5', display: 'block', fontSize: 14 }}>{label}</span>
                <span style={{ color: '#737373', fontSize: 12 }}>{description}</span>
            </div>
        </button>
    );
}

function PipelineCard({ name, status, version, description, accuracy }: { name: string; status: 'active' | 'standby' | 'error'; version: string; description: string; accuracy: number }) {
    const statusColor = status === 'active' ? '#22c55e' : status === 'standby' ? '#f59e0b' : '#ef4444';
    return (
        <div style={styles.pipelineCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
                <span style={{ fontWeight: 600, color: '#e5e5e5', fontSize: 14 }}>{name}</span>
                <span style={{ fontSize: 11, color: '#525252', marginLeft: 'auto' }}>v{version}</span>
            </div>
            <p style={{ color: '#a3a3a3', fontSize: 12, margin: '0 0 4px' }}>{description}</p>
            {accuracy > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ ...styles.miniBar, flex: 1 }}>
                        <div style={{ ...styles.miniBarFill, width: `${accuracy}%`, background: '#22c55e' }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>{accuracy}%</span>
                </div>
            )}
        </div>
    );
}

// ============================================
// STYLES
// ============================================

const styles: Record<string, React.CSSProperties> = {
    container: { maxWidth: 1600, margin: '0 auto', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
    title: { fontSize: 28, fontWeight: 700, color: '#e5e5e5', margin: 0 },
    subtitle: { fontSize: 14, color: '#737373', margin: '4px 0 0' },
    statsRow: { display: 'flex', gap: 12, flexWrap: 'wrap' as const },
    statPill: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', minWidth: 80 },

    filterBar: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' as const, alignItems: 'center' },
    select: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', color: '#e5e5e5', fontSize: 13, outline: 'none', cursor: 'pointer' },
    searchInput: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', color: '#e5e5e5', fontSize: 13, outline: 'none', width: 200 },
    confidenceFilter: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' },
    slider: { width: 100, accentColor: '#6366f1' },

    mainGrid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 24 },
    videoList: { background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', maxHeight: 700, overflowY: 'auto' as const },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    panelTitle: { fontSize: 13, fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase' as const, letterSpacing: 1 },
    panelCount: { fontSize: 12, color: '#6366f1', fontWeight: 600, background: 'rgba(99,102,241,0.12)', padding: '2px 8px', borderRadius: 10 },

    videoCard: { display: 'flex', gap: 12, padding: '12px 16px', cursor: 'pointer', borderLeft: '3px solid transparent', transition: 'all 0.15s ease' },
    thumbnail: { width: 64, height: 48, borderRadius: 6, background: 'rgba(255,255,255,0.06)', position: 'relative' as const, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statusDot: { width: 8, height: 8, borderRadius: '50%', position: 'absolute' as const, top: 4, right: 4 },
    durationBadge: { fontSize: 10, color: '#a3a3a3', fontFamily: 'monospace' },
    videoInfo: { flex: 1, minWidth: 0 },
    videoName: { fontSize: 14, fontWeight: 500, color: '#e5e5e5', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' },
    videoMeta: { fontSize: 11, color: '#737373', marginTop: 2 },
    videoConfRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 },
    miniBar: { height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', flex: 1 },
    miniBarFill: { height: '100%', borderRadius: 2, transition: 'width 0.3s ease' },

    detailArea: { background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' },
    videoPreview: { borderBottom: '1px solid rgba(255,255,255,0.06)' },
    previewPlaceholder: { height: 280, background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(59,130,246,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' as const },
    playIcon: { width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#e5e5e5', backdropFilter: 'blur(10px)' },
    previewOverlay: { position: 'absolute' as const, bottom: 12, left: 16, fontSize: 12, color: '#a3a3a3' },

    timeline: { padding: '12px 16px' },
    timelineTrack: { height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, position: 'relative' as const },
    timelineMarker: { position: 'absolute' as const, width: 10, height: 10, borderRadius: '50%', top: -2, border: '2px solid rgba(0,0,0,0.4)', cursor: 'pointer' },
    timelinePlayhead: { position: 'absolute' as const, width: 2, height: 14, background: '#e5e5e5', top: -4, borderRadius: 1 },
    timelineLabels: { display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: '#525252' },

    tabBar: { display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    tab: { flex: 1, padding: '10px 16px', background: 'none', border: 'none', color: '#737373', fontSize: 13, cursor: 'pointer', fontWeight: 500, borderBottom: '2px solid transparent', transition: 'all 0.15s ease' },
    tabActive: { color: '#e5e5e5', borderBottomColor: '#6366f1' },
    tabContent: { padding: 16, maxHeight: 320, overflowY: 'auto' as const },

    annotationList: {},
    annotationHeader: { display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 11, color: '#525252', textTransform: 'uppercase' as const, letterSpacing: 0.5, fontWeight: 600 },
    annotationRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' },
    sourceBadge: { padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500 },
    statusBadge: { padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, textTransform: 'capitalize' as const },
    tag: { padding: '1px 6px', borderRadius: 4, fontSize: 10, background: 'rgba(255,255,255,0.06)', color: '#a3a3a3' },
    approveBtn: { width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', cursor: 'pointer', fontSize: 14 },
    rejectBtn: { width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: 14 },

    metadataGrid: {},
    metaRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' },
    metaLabel: { fontSize: 13, color: '#737373' },
    metaValue: { fontSize: 13, color: '#e5e5e5', fontWeight: 500 },

    confidenceGrid: { display: 'grid', gridTemplateColumns: '140px 1fr', gap: 24, alignItems: 'start' },
    overallScore: { display: 'flex', justifyContent: 'center', paddingTop: 8 },
    scoreCircle: { position: 'relative' as const },
    scoreText: { position: 'absolute' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center' },
    breakdownList: { display: 'flex', flexDirection: 'column' as const, gap: 16 },
    confBar: {},
    barTrack: { height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' },
    barFill: { height: '100%', borderRadius: 3, transition: 'width 0.5s ease' },
    formulaBox: { gridColumn: 'span 2', background: 'rgba(99,102,241,0.06)', borderRadius: 8, padding: '10px 16px', marginTop: 8 },
    formula: { fontSize: 12, color: '#818cf8', fontFamily: "'SF Mono', 'Fira Code', monospace" },

    actionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
    actionButton: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid', borderRadius: 10, cursor: 'pointer', textAlign: 'left' as const, transition: 'all 0.15s ease' },
    actionDivider: { gridColumn: 'span 2', height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' },
    exportSection: { gridColumn: 'span 2', padding: '8px 0' },
    exportBtn: { padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', color: '#818cf8', fontSize: 12, fontWeight: 500, cursor: 'pointer' },

    pipelineBar: { background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 24 },
    pipelineGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, padding: '12px 16px' },
    pipelineCard: { padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' },

    emptyState: { padding: 32, textAlign: 'center' as const, color: '#525252', fontSize: 14 },
};

export default AdminAnnotation;
