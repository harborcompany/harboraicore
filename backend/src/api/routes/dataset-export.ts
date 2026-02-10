/**
 * Dataset Export API
 * Packages approved annotations for licensing in COCO, YOLO, or CSV format
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';

export const datasetExportRouter = Router();

/**
 * GET /api/datasets/:id/export
 * Export a dataset's annotations in a specified format
 */
datasetExportRouter.get('/:id/export', async (req: Request, res: Response) => {
    const { id } = req.params;
    const format = (req.query.format as string) || 'coco';

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id },
            include: {
                submissions: {
                    include: {
                        files: {
                            include: {
                                asset: {
                                    include: {
                                        objectDetections: true,
                                        userAnnotations: {
                                            where: { confidence: { gte: 0.6 } },
                                            orderBy: { confidence: 'desc' }
                                        },
                                        compositeQualityScore: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!dataset) {
            return res.status(404).json({ error: 'Dataset not found' });
        }

        // Collect all annotations
        const allAnnotations: any[] = [];
        const allImages: any[] = [];
        let imageId = 0;
        let annotationId = 0;

        for (const submission of dataset.submissions) {
            for (const file of submission.files) {
                const asset = file.asset;
                if (!asset) continue;

                imageId++;
                allImages.push({
                    id: imageId,
                    file_name: asset.fileName || `${asset.id}.mp4`,
                    width: asset.width || 1920,
                    height: asset.height || 1080,
                });

                // Merge object detections + user annotations
                for (const det of asset.objectDetections) {
                    annotationId++;
                    allAnnotations.push({
                        id: annotationId,
                        image_id: imageId,
                        category: det.objectType,
                        bbox: [det.boundingBoxX, det.boundingBoxY, det.boundingBoxWidth, det.boundingBoxHeight],
                        confidence: det.confidence,
                        source: 'auto',
                        model: det.modelName,
                    });
                }

                for (const ann of asset.userAnnotations) {
                    annotationId++;
                    allAnnotations.push({
                        id: annotationId,
                        image_id: imageId,
                        category: ann.labelType,
                        labels: ann.labels,
                        confidence: ann.confidence,
                        source: 'human',
                        user_id: ann.userId,
                    });
                }
            }
        }

        if (format === 'coco') {
            res.json({
                info: {
                    description: `${dataset.name} - Harbor ML Dataset`,
                    version: '1.0',
                    year: new Date().getFullYear(),
                    contributor: 'Harbor ML',
                    date_created: dataset.createdAt,
                },
                images: allImages,
                annotations: allAnnotations,
                categories: [...new Set(allAnnotations.map(a => a.category))].map((cat, i) => ({
                    id: i + 1,
                    name: cat,
                    supercategory: 'object',
                })),
            });
        } else if (format === 'yolo') {
            // YOLO format: one text file per image
            const yoloLines: string[] = [];
            for (const ann of allAnnotations) {
                const img = allImages.find(i => i.id === ann.image_id);
                if (!img || !ann.bbox) continue;
                const [x, y, w, h] = ann.bbox;
                const cx = (x + w / 2) / img.width;
                const cy = (y + h / 2) / img.height;
                const nw = w / img.width;
                const nh = h / img.height;
                yoloLines.push(`0 ${cx.toFixed(6)} ${cy.toFixed(6)} ${nw.toFixed(6)} ${nh.toFixed(6)}`);
            }
            res.type('text/plain').send(yoloLines.join('\n'));
        } else if (format === 'csv') {
            const header = 'annotation_id,image_id,category,confidence,source,bbox_x,bbox_y,bbox_w,bbox_h';
            const rows = allAnnotations.map(a =>
                `${a.id},${a.image_id},${a.category},${a.confidence || ''},${a.source},${(a.bbox || []).join(',')}`
            );
            res.type('text/csv').send([header, ...rows].join('\n'));
        } else {
            res.status(400).json({ error: `Unsupported format: ${format}` });
        }
    } catch (error) {
        console.error('[DatasetExport] Export failed:', error);
        res.status(500).json({ error: 'Export failed' });
    }
});

/**
 * GET /api/datasets/:id/readme
 * Generate a README.md for a dataset
 */
datasetExportRouter.get('/:id/readme', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id },
            include: { _count: { select: { submissions: true } } }
        });

        if (!dataset) {
            return res.status(404).json({ error: 'Dataset not found' });
        }

        const readme = `# ${dataset.name}

## Overview
${dataset.description || 'This dataset contains annotated LEGO build videos captured from real users in natural environments.'}

## Contents
- \`videos/\`: Raw video data
- \`annotations/\`: JSON annotations with bounding boxes and confidence scores
- \`metadata.csv\`: Per-video metadata

## Statistics
- **Submissions:** ${dataset._count.submissions}
- **Created:** ${dataset.createdAt.toISOString().split('T')[0]}
- **Format:** COCO JSON, YOLO, CSV

## Annotation Schema
\`\`\`json
{
  "annotation_id": "uuid",
  "video_id": "uuid",
  "frame_timestamp": "float",
  "brick_type": "string",
  "bounding_box": [x1, y1, x2, y2],
  "confidence_score": "float",
  "context_quality": {
    "blur": "float",
    "lighting": "string",
    "occlusion": "float"
  },
  "user_reliability_score": "float",
  "cross_user_agreement": "float",
  "model_agreement_score": "float",
  "meta_tags": ["hand_present", "edge_occlusion", "partial_lighting"],
  "annotation_source": "uploader | crowd | auto",
  "timestamp_created": "datetime"
}
\`\`\`

## Usage
Suitable for training computer vision models for small object detection, cluttered scene interpretation, and human-object interaction tasks.

## License
Licensed under the Harbor ML Commercial License. See LICENSE.txt for details.

### Licensing Options
- **Commercial License** — Training and deployment in proprietary products
- **Research License** — Lower cost, non-production usage only
- **Enterprise License** — Extended rights, SLA, and updates
`;

        res.type('text/markdown').send(readme);
    } catch (error) {
        console.error('[DatasetExport] README generation failed:', error);
        res.status(500).json({ error: 'README generation failed' });
    }
});
