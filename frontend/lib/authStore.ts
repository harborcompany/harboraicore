import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// User profile extended with app-specific data
interface UserProfile {
    id: string;
    email: string;
    authenticated: boolean;
    emailVerified: boolean;
    onboardingComplete: boolean;
    intent: 'ai_ml' | 'dataset_licensing' | 'ads' | 'contributor' | 'explore' | null;
    role: 'admin' | 'contributor' | 'viewer' | 'api_only' | null;
    organization: {
        name: string;
        size: string;
        industry: string;
    } | null;
    dataTypes: {
        audio: boolean;
        video: boolean;
        multimodal: boolean;
        videoFormats: string[];
    };
    acceptedTerms: boolean;
    hasDataRights: boolean;
}

const defaultProfile: UserProfile = {
    id: '',
    email: '',
    authenticated: false,
    emailVerified: false,
    onboardingComplete: false,
    intent: null,
    role: null,
    organization: null,
    dataTypes: {
        audio: false,
        video: false,
        multimodal: false,
        videoFormats: []
    },
    acceptedTerms: false,
    hasDataRights: false
};

// Convert Supabase user to our profile
const mapSupabaseUser = (user: SupabaseUser | null): UserProfile => {
    if (!user) return defaultProfile;

    return {
        ...defaultProfile,
        id: user.id,
        email: user.email || '',
        authenticated: true,
        emailVerified: !!user.email_confirmed_at,
    };
};

// Global state
let currentProfile: UserProfile = defaultProfile;
let currentSession: Session | null = null;
let listeners: Array<() => void> = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

export const authStore = {
    getUser: (): UserProfile => currentProfile,
    getSession: (): Session | null => currentSession,

    // Initialize - call this on app mount
    initialize: async (): Promise<void> => {
        const { data: { session } } = await supabase.auth.getSession();
        currentSession = session;
        currentProfile = mapSupabaseUser(session?.user ?? null);
        notifyListeners();

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            currentSession = session;
            currentProfile = mapSupabaseUser(session?.user ?? null);
            notifyListeners();
        });
    },

    // Email/Password Sign Up
    signUp: async (email: string, password: string): Promise<{ error: Error | null }> => {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error ? new Error(error.message) : null };
    },

    // Email/Password Sign In
    signIn: async (email: string, password: string): Promise<{ error: Error | null }> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error ? new Error(error.message) : null };
    },

    // OAuth Sign In
    signInWithOAuth: async (provider: 'google' | 'github'): Promise<{ error: Error | null }> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error: error ? new Error(error.message) : null };
    },

    // Sign Out
    signOut: async (): Promise<void> => {
        await supabase.auth.signOut();
        currentProfile = defaultProfile;
        currentSession = null;
        notifyListeners();
    },

    // Update profile (app-specific data)
    updateProfile: (updates: Partial<UserProfile>): void => {
        currentProfile = { ...currentProfile, ...updates };
        // Optionally persist to Supabase user metadata or a profiles table
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
export const useAuth = (): UserProfile => {
    const [user, setUser] = useState<UserProfile>(authStore.getUser());

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setUser({ ...authStore.getUser() });
        });
        return unsubscribe;
    }, []);

    return user;
};

export type { UserProfile };
