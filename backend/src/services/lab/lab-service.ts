import { prisma } from '../../lib/prisma.js';

export class LabService {

    async listDatasets() {
        return prisma.labDataset.findMany({
            include: {
                videos: {
                    select: { id: true, status: true } // summary
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getDataset(id: string) {
        return prisma.labDataset.findUnique({
            where: { id },
            include: {
                videos: {
                    include: {
                        annotations: {
                            take: 10 // preview
                        }
                    }
                }
            }
        });
    }

    async createDataset(title: string, category: string, price: number) {
        return prisma.labDataset.create({
            data: {
                title,
                category,
                price,
                description: "Auto-generated dataset from lab pipeline",
            }
        });
    }

    /**
     * MOCK Video Processor
     * Simulates chopping a 5-minute video into VLM annotations
     */
    async processVideoUpload(datasetId: string, filename: string, totalSeconds: number = 300) {
        // 1. Create Video Record
        const video = await prisma.labeledVideo.create({
            data: {
                datasetId,
                filename,
                url: `gs://harbor-lab-data/${filename}`, // Mock storage URL
                duration: totalSeconds,
                status: 'PROCESSING'
            }
        });

        // 2. Simulate Async Processing (Fire & Forget)
        this.runMockInference(video.id, totalSeconds).catch(err => {
            console.error("Mock inference failed", err);
            prisma.labeledVideo.update({
                where: { id: video.id },
                data: { status: 'FAILED' }
            });
        });

        return video;
    }

    private async runMockInference(videoId: string, duration: number) {
        console.log(`[LabService] Starting inference on video ${videoId} (${duration}s)`);

        const labels = ["Red 2x4 Brick", "Blue 1x2 Plate", "Technic Axle", "Minifigure Head", "Wheel Rim"];
        const actions = ["Pickup", "Install", "Rotate", "Inspect", "Sort"];

        const annotations = [];

        // Generate ~1 annotation per second
        for (let t = 0; t < duration; t++) {
            if (Math.random() > 0.3) { // 70% chance of annotation per sec
                const label = labels[Math.floor(Math.random() * labels.length)];
                const action = actions[Math.floor(Math.random() * actions.length)];

                annotations.push({
                    videoId,
                    timestamp: parseFloat(t.toFixed(1)),
                    label,
                    action,
                    confidence: 0.85 + (Math.random() * 0.14), // 0.85 - 0.99
                    boundingBox: {
                        x: Math.floor(Math.random() * 1000),
                        y: Math.floor(Math.random() * 800),
                        w: 100,
                        h: 100
                    }
                });
            }
        }

        // Batch insert
        await prisma.videoAnnotation.createMany({
            data: annotations
        });

        await prisma.labeledVideo.update({
            where: { id: videoId },
            data: { status: 'COMPLETED' }
        });

        console.log(`[LabService] Finished processing video ${videoId}. Generated ${annotations.length} annotations.`);
    }
}

export const labService = new LabService();
