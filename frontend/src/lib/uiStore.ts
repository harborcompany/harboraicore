import { useState, useEffect } from 'react';

export interface UIState {
    isApiDocsOpen: boolean;
    activeApiTab: 'overview' | 'reference' | 'start';
}

const defaultState: UIState = {
    isApiDocsOpen: false,
    activeApiTab: 'overview'
};

// Global state container
let currentState: UIState = defaultState;
let listeners: Array<() => void> = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

export const uiStore = {
    get: (): UIState => currentState,

    openApiDocs: (tab: 'overview' | 'reference' | 'start' = 'overview') => {
        currentState = { ...currentState, isApiDocsOpen: true, activeApiTab: tab };
        notifyListeners();
    },

    closeApiDocs: () => {
        currentState = { ...currentState, isApiDocsOpen: false };
        notifyListeners();
    },

    setApiTab: (tab: 'overview' | 'reference' | 'start') => {
        currentState = { ...currentState, activeApiTab: tab };
        notifyListeners();
    },

    subscribe: (listener: () => void): () => void => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }
};

// React hook
export const useUI = (): UIState => {
    const [state, setState] = useState<UIState>(uiStore.get());

    useEffect(() => {
        const unsubscribe = uiStore.subscribe(() => {
            setState({ ...uiStore.get() }); // Force new object ref
        });
        return unsubscribe;
    }, []);

    return state;
};
