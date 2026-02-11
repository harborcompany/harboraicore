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
                // Real XHR Upload
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append('file', file);

                // Add token if auth is needed (using localStorage for simplicity if authStore isn't directly handy in hook without context)
                // const token = localStorage.getItem('auth_token'); 

                xhr.open('POST', '/api/storage/upload'); // Relative path uses Vite proxy to backend
                // if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        setState(prev => ({ ...prev, progress: percentComplete }));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const response = JSON.parse(xhr.responseText);
                        setState(prev => ({
                            ...prev,
                            progress: 100,
                            status: 'success'
                        }));
                        options.onSuccess?.(response.data);
                    } else {
                        throw new Error(`Upload failed with status ${xhr.status}`);
                    }
                };

                xhr.onerror = () => {
                    throw new Error('Network error during upload');
                };

                xhr.send(formData);

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
