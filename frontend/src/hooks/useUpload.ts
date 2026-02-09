import { useState, useCallback } from 'react';
import { datasetService } from '../services/datasetService'; // Or mock
import { mockDatasetService } from '../services/mockDatasetService';

// Use mock for now as backend might not be ready, but structure it for easy switch
const service = mockDatasetService;

interface UseUploadOptions {
    maxSizeMB?: number; // default 500MB
    acceptedTypes?: string[]; // e.g., ['video/mp4', 'audio/wav']
    onSuccess?: (result: any) => void;
    onError?: (error: Error) => void;
}

interface UploadState {
    progress: number;
    status: 'idle' | 'selecting' | 'uploading' | 'processing' | 'success' | 'error';
    error: Error | null;
    fileName: string | null;
    fileSize: number | null;
}

export const useUpload = (options: UseUploadOptions = {}) => {
    const [state, setState] = useState<UploadState>({
        progress: 0,
        status: 'idle',
        error: null,
        fileName: null,
        fileSize: null
    });

    const selectFile = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = options.acceptedTypes?.join(',') || '*/*';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            // Validation
            const maxSize = (options.maxSizeMB || 500) * 1024 * 1024;
            if (file.size > maxSize) {
                const error = new Error(`File too large. Max size is ${options.maxSizeMB || 500}MB.`);
                setState(prev => ({ ...prev, error, status: 'error' }));
                options.onError?.(error);
                return;
            }

            setState({
                progress: 0,
                status: 'uploading',
                error: null,
                fileName: file.name,
                fileSize: file.size
            });

            try {
                // Simulate precise progress if the service doesn't support ProgressEvents yet
                // intended to be replaced by XHR progress if available
                const progressInterval = setInterval(() => {
                    setState(prev => {
                        if (prev.status !== 'uploading') return prev;
                        // Logarithmic-ish progress curve
                        const remaining = 100 - prev.progress;
                        const inc = Math.max(0.5, remaining / 20);
                        if (prev.progress >= 95) return prev; // Wait for final completion
                        return { ...prev, progress: prev.progress + inc };
                    });
                }, 200);

                // Perform Upload
                // In reality, we'd pass an onProgress callback here
                const result = await service.ingestAsset('temp-dataset-id', file);

                clearInterval(progressInterval);

                setState(prev => ({
                    ...prev,
                    progress: 100,
                    status: 'processing' // Service returns, but usually some processing follows
                }));

                // Fake processing delay for UX (if needed) or immediate success
                setTimeout(() => {
                    setState(prev => ({ ...prev, status: 'success' }));
                    options.onSuccess?.(result);
                }, 1500);

            } catch (err) {
                const error = err instanceof Error ? err : new Error('Upload failed');
                setState(prev => ({ ...prev, status: 'error', error }));
                options.onError?.(error);
            }
        };

        input.click();
    }, [options]);

    const reset = useCallback(() => {
        setState({
            progress: 0,
            status: 'idle',
            error: null,
            fileName: null,
            fileSize: null
        });
    }, []);

    return {
        ...state,
        selectFile,
        reset
    };
};
