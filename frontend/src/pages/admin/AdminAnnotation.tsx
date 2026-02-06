import React, { useState } from 'react';
import { PageHeader, DataTable, Tabs, StatusBadge, ChartCard, KPICard } from '../../components/admin/AdminComponents';

interface Annotation {
    id: string;
    assetId: string;
    assetName: string;
    type: string;
    confidence: number;
    stage: 'auto' | 'human_review' | 'approved' | 'rejected';
    annotator: string;
    version: number;
    createdAt: string;
}

const mockAnnotations: Annotation[] = [
    { id: 'ann_001', assetId: 'ast_001', assetName: 'driving_scene_001.mp4', type: 'scene', confidence: 0.92, stage: 'approved', annotator: 'model_v3', version: 2, createdAt: '2 min ago' },
    { id: 'ann_002', assetId: 'ast_002', assetName: 'podcast_ep_42.wav', type: 'speech', confidence: 0.85, stage: 'human_review', annotator: 'model_v3', version: 1, createdAt: '8 min ago' },
    { id: 'ann_003', assetId: 'ast_003', assetName: 'street_batch_099.zip', type: 'object', confidence: 0.67, stage: 'human_review', annotator: 'model_v2', version: 1, createdAt: '15 min ago' },
    { id: 'ann_004', assetId: 'ast_004', assetName: 'interview_raw.mp4', type: 'action', confidence: 0.94, stage: 'auto', annotator: 'model_v3', version: 1, createdAt: '22 min ago' },
    { id: 'ann_005', assetId: 'ast_005', assetName: 'nature_sounds.wav', type: 'emotion', confidence: 0.78, stage: 'approved', annotator: 'alice@qa.com', version: 3, createdAt: '30 min ago' },
];

export function AdminAnnotation() {
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'All', count: mockAnnotations.length },
        { id: 'auto', label: 'Auto-Annotation', count: mockAnnotations.filter(a => a.stage === 'auto').length },
        { id: 'review', label: 'Human Review', count: mockAnnotations.filter(a => a.stage === 'human_review').length },
        { id: 'approved', label: 'Approved', count: mockAnnotations.filter(a => a.stage === 'approved').length },
    ];

    const columns = [
        { key: 'assetName', label: 'Asset', sortable: true },
        { key: 'type', label: 'Label Type' },
        {
            key: 'confidence',
            label: 'Confidence',
            render: (ann: Annotation) => (
                <div className="confidence-bar-wrapper">
                    <div className="confidence-bar" style={{ width: `${ann.confidence * 100}%`, background: ann.confidence > 0.8 ? '#22c55e' : ann.confidence > 0.6 ? '#f59e0b' : '#ef4444' }} />
                    <span>{(ann.confidence * 100).toFixed(0)}%</span>
                </div>
            )
        },
        {
            key: 'stage',
            label: 'Stage',
            render: (ann: Annotation) => (
                <StatusBadge
                    label={ann.stage.replace('_', ' ')}
                    variant={ann.stage === 'approved' ? 'success' : ann.stage === 'rejected' ? 'error' : 'warning'}
                />
            )
        },
        { key: 'annotator', label: 'Annotator' },
        { key: 'version', label: 'Version', render: (ann: Annotation) => `v${ann.version}` },
        { key: 'createdAt', label: 'Created' },
    ];

    const filteredAnnotations = mockAnnotations.filter(ann => {
        if (activeTab === 'auto') return ann.stage === 'auto';
        if (activeTab === 'review') return ann.stage === 'human_review';
        if (activeTab === 'approved') return ann.stage === 'approved';
        return true;
    });

    return (
        <div className="admin-annotation">
            <PageHeader
                title="Annotation & QA"
                subtitle="Annotation pipeline and quality assurance"
            />

            {/* Metrics Row */}
            <div className="metrics-row">
                <KPICard label="Avg Confidence" value="87.2" suffix="%" />
                <KPICard label="Human Review Rate" value="24.3" suffix="%" />
                <KPICard label="Throughput (24h)" value="1,247" suffix=" min" />
                <KPICard label="Rework Rate" value="3.1" suffix="%" />
            </div>

            {/* Pipeline Visualization */}
            <div className="pipeline-section">
                <ChartCard title="Annotation Pipeline">
                    <div className="pipeline">
                        <PipelineStage label="Auto-Annotation" count={342} color="#3b82f6" />
                        <PipelineArrow />
                        <PipelineStage label="Confidence Scoring" count={285} color="#6366f1" />
                        <PipelineArrow />
                        <PipelineStage label="Human Review" count={67} color="#f59e0b" />
                        <PipelineArrow />
                        <PipelineStage label="Version Lock" count={1847} color="#22c55e" />
                    </div>
                </ChartCard>
            </div>

            <div className="annotation-toolbar">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <DataTable
                columns={columns}
                data={filteredAnnotations}
            />

            <style>{`
        .admin-annotation { max-width: 1400px; }
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .pipeline-section { margin-bottom: 24px; }
        .pipeline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
        }
        .annotation-toolbar { margin-bottom: 16px; }
        .confidence-bar-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .confidence-bar {
          height: 6px;
          border-radius: 3px;
          min-width: 20px;
        }
      `}</style>
        </div>
    );
}

function PipelineStage({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <div className="pipeline-stage">
            <div className="stage-box" style={{ borderColor: color }}>
                <span className="stage-count" style={{ color }}>{count.toLocaleString()}</span>
                <span className="stage-label">{label}</span>
            </div>
            <style>{`
        .pipeline-stage { flex: 1; max-width: 180px; }
        .stage-box {
          border: 2px solid;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          background: rgba(255,255,255,0.02);
        }
        .stage-count { display: block; font-size: 24px; font-weight: 600; }
        .stage-label { display: block; font-size: 12px; color: #a3a3a3; margin-top: 4px; }
      `}</style>
        </div>
    );
}

function PipelineArrow() {
    return (
        <div className="pipeline-arrow">→
            <style>{`.pipeline-arrow { color: #525252; font-size: 24px; padding: 0 8px; }`}</style>
        </div>
    );
}

export default AdminAnnotation;
