/**
 * Dataset Certification Engine
 * Deterministic certification logic for versioning datasets.
 */

export type DatasetStatus = 'building' | 'ready_for_certification' | 'certified' | 'published';

export interface Dataset {
    id: string;
    name: string;
    type: 'lego' | 'voice';
    version: string;
    status: DatasetStatus;
    stats: {
        totalHours: number;
        contributorCount: number;
        avgQaScore: number;
        annotationAgreement: number;
        rejectionRate: number;
        metadataCompleteness: number; // 0-100
    };
    certifiedAt?: string;
    qaReportUrl?: string;
}

export interface CertificationResult {
    success: boolean;
    errors: string[];
    dataset?: Dataset;
}

const STORAGE_KEY = 'harbor_datasets';

// --- Certification Criteria (LEGO v0.1) ---
const LEGO_V01_CRITERIA = {
    minHours: 6,
    minContributors: 10,
    minQaScore: 90,
    minAgreement: 88,
    maxRejectionRate: 10,
    minMetadata: 100
};

export const datasetCertificationService = {
    async getDatasets(): Promise<Dataset[]> {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    },

    async certifyDataset(datasetId: string): Promise<CertificationResult> {
        const datasets = await this.getDatasets();
        const dataset = datasets.find(d => d.id === datasetId);

        if (!dataset) return { success: false, errors: ['Dataset not found'] };
        if (dataset.status === 'certified') return { success: false, errors: ['Already certified'] };

        const errors: string[] = [];
        const { stats } = dataset;

        if (stats.totalHours < LEGO_V01_CRITERIA.minHours) errors.push(`Insufficient hours: ${stats.totalHours} < ${LEGO_V01_CRITERIA.minHours}`);
        if (stats.contributorCount < LEGO_V01_CRITERIA.minContributors) errors.push(`Low diversity: ${stats.contributorCount} < ${LEGO_V01_CRITERIA.minContributors} contributors`);
        if (stats.avgQaScore < LEGO_V01_CRITERIA.minQaScore) errors.push(`Low quality: Avg QA score ${stats.avgQaScore}% < ${LEGO_V01_CRITERIA.minQaScore}%`);
        if (stats.annotationAgreement < LEGO_V01_CRITERIA.minAgreement) errors.push(`Low agreement: ${stats.annotationAgreement}% < ${LEGO_V01_CRITERIA.minAgreement}%`);
        if (stats.rejectionRate > LEGO_V01_CRITERIA.maxRejectionRate) errors.push(`High rejection rate: ${stats.rejectionRate}% > ${LEGO_V01_CRITERIA.maxRejectionRate}%`);
        if (stats.minMetadata < LEGO_V01_CRITERIA.minMetadata) errors.push('Metadata incomplete');

        if (errors.length > 0) return { success: false, errors };

        // Success: Transition state
        const updated = datasets.map(d => {
            if (d.id === datasetId) {
                return {
                    ...d,
                    status: 'certified' as DatasetStatus,
                    certifiedAt: new Date().toISOString(),
                    qaReportUrl: `/reports/qa_${d.id}.pdf`
                };
            }
            return d;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return { success: true, errors: [], dataset: updated.find(d => d.id === datasetId) };
    }
};
