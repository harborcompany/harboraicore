import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/index.js';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const modelId = 'gemini-2.0-flash-exp'; // Using the latest flash model for speed/spatial

export interface BoundingBox2D {
    label: string;
    box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
}

export interface BoundingBox3D {
    label: string;
    box_3d: [number, number, number, number, number, number, number, number, number];
    // [cx, cy, cz, w, h, d, rx, ry, rz]
}

export interface SegmentationMask {
    label: string;
    box_2d: [number, number, number, number];
    mask: string; // Base64 encoded mask
}

export const spatialService = {
    /**
     * Detect objects with 2D bounding boxes
     */
    async detect2D(imageBuffer: Buffer, classes: string[]): Promise<BoundingBox2D[]> {
        const model = genAI.getGenerativeModel({ model: modelId });

        const prompt = `Detect ${classes.join(', ')}, with no more than 20 items. Output a json list where each entry contains the 2D bounding box in "box_2d" and a text label in "label".`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: 'image/png' // Assuming PNG for now, need to handle others
                }
            }
        ]);

        const responseText = result.response.text();
        return this.parseJSON(responseText);
    },

    /**
     * Detect objects with 3D bounding boxes (9-DOF)
     */
    async detect3D(imageBuffer: Buffer, classes: string[]): Promise<BoundingBox3D[]> {
        const model = genAI.getGenerativeModel({ model: modelId });

        const prompt = `Detect ${classes.join(', ')} with 3D bounding boxes. Return a JSON list with key "box_3d" containing 9 numbers [cx, cy, cz, w, h, d, rx, ry, rz] and "label". The camera is at origin. Coordinates are in meters.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: 'image/png'
                }
            }
        ]);

        const responseText = result.response.text();
        return this.parseJSON(responseText);
    },

    /**
     * Helper to parse JSON from Gemini markdown response
     */
    parseJSON(text: string): any {
        try {
            let cleanText = text;
            if (cleanText.includes('```json')) {
                cleanText = cleanText.split('```json')[1].split('```')[0];
            } else if (cleanText.includes('```')) {
                cleanText = cleanText.split('```')[1].split('```')[0];
            }
            return JSON.parse(cleanText.trim());
        } catch (files) {
            console.error('Failed to parse Gemini JSON:', text);
            throw new Error('Invalid JSON response from AI');
        }
    }
};
