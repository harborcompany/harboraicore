import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// User profile extended with app-specific data
export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
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
    legoProfile?: {
        level: string;
        themes: string[];
        filmsBuilds: boolean | null;
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
    legoProfile: undefined,
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
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatarUrl: user.user_metadata?.avatar_url,
        authenticated: true,
        emailVerified: !!user.email_confirmed_at,
        onboardingComplete: !!user.user_metadata?.onboardingComplete,
        intent: user.user_metadata?.intent || null,
        role: user.user_metadata?.role || null,
        organization: user.user_metadata?.organization || null,
        dataTypes: user.user_metadata?.dataTypes || defaultProfile.dataTypes,
        acceptedTerms: !!user.user_metadata?.acceptedTerms,
        hasDataRights: !!user.user_metadata?.hasDataRights
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

        // check for dev mode persistence
        const isDevMode = localStorage.getItem('harbor_dev_mode') === 'true';

        if (!session && isDevMode) {
            // restore dev session
            await authStore.devLogin();
        } else {
            currentSession = session;
            currentProfile = mapSupabaseUser(session?.user ?? null);
            notifyListeners();
        }

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

    // Alias for signIn to match component usage
    login: async (email: string): Promise<void> => {
        // Just a stub or usage of signIn if we had password
        console.log("Login requested for", email);
        // In a real app we'd need the password here, but for "verify email" flow it might be different
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

    // Reset Password Email
    resetPasswordForEmail: async (email: string): Promise<{ error: Error | null }> => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset`,
        });
        return { error: error ? new Error(error.message) : null };
    },

    // Update User Password
    updatePassword: async (password: string): Promise<{ error: Error | null }> => {
        const { error } = await supabase.auth.updateUser({ password });
        return { error: error ? new Error(error.message) : null };
    },

    // Resend Confirmation Email
    resendConfirmationEmail: async (email: string): Promise<{ error: Error | null }> => {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${window.location.origin}/app`
            }
        });
        return { error: error ? new Error(error.message) : null };
    },

    // Sign Out
    signOut: async (): Promise<void> => {
        await supabase.auth.signOut();
        localStorage.removeItem('harbor_dev_mode');
        localStorage.removeItem('harbor_onboarding_complete');
        currentProfile = defaultProfile;
        currentSession = null;
        notifyListeners();
    },

    // Update profile (app-specific data)
    updateProfile: (updates: Partial<UserProfile>): void => {
        currentProfile = { ...currentProfile, ...updates };
        notifyListeners();
    },

    // Missing methods implementation (Stubs/State setters)
    setEmail: (email: string) => {
        currentProfile = { ...currentProfile, email };
        notifyListeners();
    },

    setIntent: (intent: any) => {
        currentProfile = { ...currentProfile, intent };
        notifyListeners();
    },

    setOrganization: (organization: any) => {
        currentProfile = { ...currentProfile, organization };
        notifyListeners();
    },

    setDataTypes: (dataTypes: any) => {
        currentProfile = { ...currentProfile, dataTypes };
        notifyListeners();
    },

    setLegoProfile: (legoProfile: any) => {
        currentProfile = { ...currentProfile, legoProfile };
        notifyListeners();
    },

    verifyEmail: async () => {
        // Stub
        console.log("verifyEmail called");
    },

    acceptConsent: () => {
        currentProfile = { ...currentProfile, acceptedTerms: true };
        notifyListeners();
    },

    completeOnboarding: async () => {
        // Optimistic update
        currentProfile = { ...currentProfile, onboardingComplete: true };
        notifyListeners();

        // Persist to Supabase
        await supabase.auth.updateUser({
            data: { onboardingComplete: true }
        });
    },

    subscribe: (listener: () => void): () => void => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },

    // Dev Login (Bypass)
    devLogin: async (): Promise<void> => {
        // Mock a session
        const mockUser: SupabaseUser = {
            id: 'dev-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'dev@harbor.ai',
            email_confirmed_at: new Date().toISOString(),
            phone: '',
            confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            app_metadata: { provider: 'email' },
            user_metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            identities: []
        };

        const mockSession: Session = {
            access_token: 'mock-token',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'mock-refresh',
            user: mockUser
        };

        currentSession = mockSession;
        currentProfile = {
            ...defaultProfile,
            id: mockUser.id,
            email: mockUser.email || '',
            name: 'Dev Admin',
            authenticated: true,
            emailVerified: true,
            onboardingComplete: true, // Bypass onboarding
            intent: 'ai_ml',
            role: 'admin',
            organization: {
                name: 'Dev Corp',
                size: '100-500',
                industry: 'Technology'
            },
            dataTypes: {
                audio: true,
                video: true,
                multimodal: true,
                videoFormats: ['mp4']
            },
            acceptedTerms: true,
            hasDataRights: true
        };

        // Fix: Set localStorage to prevent AppLayout modal from showing
        localStorage.setItem('harbor_onboarding_complete', 'true');
        // Fix: Persist dev mode
        localStorage.setItem('harbor_dev_mode', 'true');

        notifyListeners();
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
