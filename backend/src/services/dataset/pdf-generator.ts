/**
 * Harbor ML - Dataset PDF Module Generator
 * HITL Quality Pipeline: Stage 4 - Generate Lab-Ready PDF
 */

import puppeteer from 'puppeteer';
import { prisma } from '../../lib/prisma.js';
import fs from 'fs';
import path from 'path';

export interface DatasetModuleConfig {
    stagingEntryId: string;
    outputPath?: string;
}

export interface ModuleMetadata {
    datasetName: string;
    version: string;
    createdAt: Date;
    totalVideos: number;
    totalDuration: number;
    annotationTypes: string[];
    objectClasses: string[];
    highlights: string[];
}

/**
 * PDF Module Generator Service
 */
export class PDFModuleGenerator {

    /**
     * Generate a complete dataset module PDF
     */
    async generateModule(config: DatasetModuleConfig): Promise<string> {
        const { stagingEntryId } = config;

        // Fetch all data
        const entry = await prisma.stagingBinEntry.findUnique({
            where: { id: stagingEntryId },
            include: {
                mediaAsset: {
                    include: {
                        handPoseDetections: { take: 100 },
                        objectDetections: { take: 100 },
                        sceneSegments: true,
                        transcriptSegments: true,
                    },
                },
            },
        });

        if (!entry || !entry.mediaAsset) {
            throw new Error(`Staging entry ${stagingEntryId} not found`);
        }

        // Build module metadata
        const metadata = await this.buildMetadata(entry);

        // Generate HTML
        const html = this.generateHTML(metadata, entry);

        // Convert to PDF
        const pdfPath = config.outputPath || `/tmp/module_${stagingEntryId}.pdf`;
        await this.htmlToPDF(html, pdfPath);

        console.log(`[PDFModuleGenerator] Generated PDF: ${pdfPath}`);
        return pdfPath;
    }

    /**
     * Build metadata summary from annotations
     */
    private async buildMetadata(entry: any): Promise<ModuleMetadata> {
        const asset = entry.mediaAsset;

        // Extract unique object classes from detections
        const objectClasses = new Set<string>();
        asset.objectDetections?.forEach((det: any) => {
            objectClasses.add(det.label);
        });

        // Determine annotation types present
        const annotationTypes: string[] = [];
        if (asset.handPoseDetections?.length > 0) annotationTypes.push('Hand Pose (MediaPipe)');
        if (asset.objectDetections?.length > 0) annotationTypes.push('Object Detection (YOLOv8)');
        if (asset.sceneSegments?.length > 0) annotationTypes.push('Scene Segmentation');
        if (asset.transcriptSegments?.length > 0) annotationTypes.push('Transcription (Whisper)');

        // Generate highlights
        const highlights: string[] = [];
        if (asset.handPoseDetections?.length > 0) {
            highlights.push(`${asset.handPoseDetections.length} hand pose detections with 21 keypoints each`);
        }
        if (asset.objectDetections?.length > 0) {
            highlights.push(`${asset.objectDetections.length} object detections across ${objectClasses.size} classes`);
        }
        if (asset.sceneSegments?.length > 0) {
            highlights.push(`${asset.sceneSegments.length} scene segments identified`);
        }

        return {
            datasetName: `Harbor ML Dataset Module`,
            version: '1.0.0',
            createdAt: new Date(),
            totalVideos: 1,
            totalDuration: asset.duration || 0,
            annotationTypes,
            objectClasses: Array.from(objectClasses),
            highlights,
        };
    }

    /**
     * Generate HTML template for PDF
     */
    private generateHTML(metadata: ModuleMetadata, entry: any): string {
        const asset = entry.mediaAsset;

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${metadata.datasetName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1a1a2e;
            padding: 40px;
        }
        .cover {
            text-align: center;
            padding: 80px 0;
            border-bottom: 3px solid #6366f1;
            margin-bottom: 40px;
        }
        .logo {
            font-size: 48px;
            font-weight: 800;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }
        .subtitle {
            font-size: 24px;
            color: #64748b;
            margin-bottom: 40px;
        }
        .meta-info {
            display: flex;
            justify-content: center;
            gap: 40px;
            font-size: 14px;
            color: #64748b;
        }
        h2 {
            font-size: 24px;
            margin: 40px 0 20px;
            color: #1e293b;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }
        h3 {
            font-size: 18px;
            margin: 30px 0 15px;
            color: #334155;
        }
        p, li {
            color: #475569;
            margin-bottom: 10px;
        }
        ul {
            padding-left: 25px;
        }
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #6366f1;
        }
        .stat-label {
            font-size: 14px;
            color: #64748b;
            margin-top: 5px;
        }
        .annotation-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .annotation-table th, .annotation-table td {
            border: 1px solid #e2e8f0;
            padding: 12px;
            text-align: left;
        }
        .annotation-table th {
            background: #f1f5f9;
            font-weight: 600;
        }
        .file-manifest {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            font-family: monospace;
            font-size: 13px;
        }
        .checksum {
            color: #64748b;
            font-size: 11px;
        }
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="cover">
        <div class="logo">Harbor ML</div>
        <div class="subtitle">Dataset Module</div>
        <h1 style="font-size: 32px; margin-bottom: 20px;">${asset.filename}</h1>
        <div class="meta-info">
            <span>Version: ${metadata.version}</span>
            <span>Generated: ${metadata.createdAt.toISOString().split('T')[0]}</span>
            <span>Duration: ${metadata.totalDuration.toFixed(1)}s</span>
        </div>
    </div>

    <!-- Introduction -->
    <h2>1. Introduction</h2>
    <p>
        This dataset module contains fully annotated video data prepared for AI/ML training.
        All annotations have been generated using production-grade models and validated through
        Harbor ML's Human-in-the-Loop quality pipeline.
    </p>

    <!-- Dataset Summary -->
    <h2>2. Dataset Summary</h2>
    
    <div class="stat-grid">
        <div class="stat-card">
            <div class="stat-value">${metadata.totalVideos}</div>
            <div class="stat-label">Videos</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${metadata.totalDuration.toFixed(1)}s</div>
            <div class="stat-label">Total Duration</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${metadata.annotationTypes.length}</div>
            <div class="stat-label">Annotation Types</div>
        </div>
    </div>

    <h3>Annotation Types Included</h3>
    <ul>
        ${metadata.annotationTypes.map(t => `<li>${t}</li>`).join('\n        ')}
    </ul>

    <h3>Key Highlights</h3>
    <ul>
        ${metadata.highlights.map(h => `<li>${h}</li>`).join('\n        ')}
    </ul>

    ${metadata.objectClasses.length > 0 ? `
    <h3>Object Classes Detected</h3>
    <ul>
        ${metadata.objectClasses.map(c => `<li>${c}</li>`).join('\n        ')}
    </ul>
    ` : ''}

    <!-- Schema Documentation -->
    <h2>3. Schema Documentation</h2>
    
    <p>All annotations follow the <strong>Harbor Lab Schema v2</strong> format:</p>
    
    <table class="annotation-table">
        <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>frame_id</td>
            <td>integer</td>
            <td>Frame number in video sequence</td>
        </tr>
        <tr>
            <td>timestamp_ms</td>
            <td>float</td>
            <td>Timestamp in milliseconds</td>
        </tr>
        <tr>
            <td>confidence</td>
            <td>float [0-1]</td>
            <td>Model confidence score</td>
        </tr>
        <tr>
            <td>model_name</td>
            <td>string</td>
            <td>Annotator model identifier</td>
        </tr>
        <tr>
            <td>model_version</td>
            <td>string</td>
            <td>Model version for reproducibility</td>
        </tr>
        <tr>
            <td>data</td>
            <td>object</td>
            <td>Type-specific annotation payload</td>
        </tr>
    </table>

    <!-- File Manifest -->
    <h2>4. File Manifest</h2>
    
    <div class="file-manifest">
        <p><strong>Primary Asset:</strong></p>
        <p>📹 ${asset.filename}</p>
        <p class="checksum">SHA-256: ${asset.checksum || 'Not available'}</p>
        <br>
        <p><strong>Annotation Files:</strong></p>
        <p>📄 annotations.json (Lab Schema v2)</p>
        <p>📄 hand_pose_detections.jsonl</p>
        <p>📄 object_detections.jsonl</p>
        <p>📄 scene_segments.jsonl</p>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Generated by Harbor ML • Human-in-the-Loop Quality Pipeline</p>
        <p>© ${new Date().getFullYear()} Harbor AI. All rights reserved.</p>
    </div>
</body>
</html>
        `;
    }

    /**
     * Convert HTML to PDF using Puppeteer
     */
    private async htmlToPDF(html: string, outputPath: string): Promise<void> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '20mm',
                    bottom: '20mm',
                    left: '20mm',
                },
            });
        } finally {
            await browser.close();
        }
    }
}

export const pdfModuleGenerator = new PDFModuleGenerator();
