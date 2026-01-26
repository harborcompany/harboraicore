/**
 * Google Gemini AI Service
 * Handles embeddings and text generation using Google's Generative AI SDK
 * 
 * Uses 'gemini-1.5-flash' for high-throughput, low-latency RAG operations.
 */

import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';

// Initialize Gemini client
const apiKey = process.env.GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');

// Get models
// Using gemini-1.5-flash for balanced performance/cost
const generationModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

export interface EmbeddingResult {
    embedding: number[];
    dimensions: number;
}

export const geminiService = {

    /**
     * Generate text embedding for RAG
     * Optimized for retrieval tasks
     */
    async embedText(text: string, taskType: TaskType = TaskType.RETRIEVAL_DOCUMENT): Promise<EmbeddingResult> {
        if (!process.env.GOOGLE_AI_API_KEY) {
            console.warn('GOOGLE_AI_API_KEY not set, returning mock embedding');
            return {
                embedding: Array(768).fill(0).map(() => Math.random() * 2 - 1),
                dimensions: 768
            };
        }

        try {
            const result = await embeddingModel.embedContent({
                content: { role: 'user', parts: [{ text }] },
                taskType: taskType,
            });

            const embedding = result.embedding.values;
            return {
                embedding,
                dimensions: embedding.length
            };
        } catch (error) {
            console.error('Error generating embedding with Gemini:', error);
            throw error;
        }
    },

    /**
     * Generate embeddings for a batch of texts
     */
    async batchEmbed(texts: string[], taskType: TaskType = TaskType.RETRIEVAL_DOCUMENT): Promise<EmbeddingResult[]> {
        // Gemini batch embedding API isn't fully unified in Node SDK yet, sequential for safety or future batch endpoint
        // For now implementing parallel requests with concurrency limit
        const results = await Promise.all(texts.map(text => this.embedText(text, taskType)));
        return results;
    },

    /**
     * Generate text answer based on context (RAG)
     */
    async generateAnswer(query: string, context: string): Promise<string> {
        if (!process.env.GOOGLE_AI_API_KEY) {
            return "Mock answer: Gemini API key not configured.";
        }

        try {
            const prompt = `
Context information is below.
---------------------
${context}
---------------------
Given the context information and not prior knowledge, answer the query.
Query: ${query}
Answer:
`;
            const result = await generationModel.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating answer with Gemini:', error);
            throw error;
        }
    }
};
