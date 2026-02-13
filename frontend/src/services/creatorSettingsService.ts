/**
 * Creator Settings Service
 * Persists profile, payment, identity, and notification state to localStorage.
 * API-ready shape — swap localStorage for real API calls when backend is ready.
 */

// --- Types ---

export type PaymentMethod = 'paypal' | 'stripe' | null;

export interface PaymentConnection {
    method: PaymentMethod;
    paypalEmail: string | null;
    stripeAccountId: string | null;
    stripeOnboarded: boolean;
    connectedAt: string | null;
}

export interface IdentityVerification {
    status: 'not_started' | 'pending' | 'verified' | 'rejected';
    submittedAt: string | null;
    verifiedAt: string | null;
    documentType: 'passport' | 'drivers_license' | 'national_id' | null;
}

export interface NotificationPreferences {
    submissionApproved: boolean;
    revisionRequested: boolean;
    newOpportunity: boolean;
    paymentProcessed: boolean;
    marketing: boolean;
}

export interface CreatorProfile {
    fullName: string;
    email: string;
    country: string;
    bio: string;
}

export interface CreatorSettings {
    profile: CreatorProfile;
    payment: PaymentConnection;
    identity: IdentityVerification;
    notifications: NotificationPreferences;
}

// --- Default Data ---

const DEFAULT_SETTINGS: CreatorSettings = {
    profile: {
        fullName: '',
        email: '',
        country: '',
        bio: '',
    },
    payment: {
        method: null,
        paypalEmail: null,
        stripeAccountId: null,
        stripeOnboarded: false,
        connectedAt: null,
    },
    identity: {
        status: 'not_started',
        submittedAt: null,
        verifiedAt: null,
        documentType: null,
    },
    notifications: {
        submissionApproved: true,
        revisionRequested: true,
        newOpportunity: true,
        paymentProcessed: true,
        marketing: false,
    },
};

const STORAGE_KEY = 'harbor_creator_settings';

// --- Helpers ---

const loadSettings = (): CreatorSettings => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch (e) { /* ignore */ }
    return { ...DEFAULT_SETTINGS };
};

const saveSettings = (settings: CreatorSettings): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// --- Service ---

export const creatorSettingsService = {
    async getSettings(): Promise<CreatorSettings> {
        await delay(200);
        return loadSettings();
    },

    // --- Profile ---
    async updateProfile(updates: Partial<CreatorProfile>): Promise<CreatorProfile> {
        await delay(300);
        const settings = loadSettings();
        settings.profile = { ...settings.profile, ...updates };
        saveSettings(settings);
        return settings.profile;
    },

    // --- Payment ---
    async connectPaypal(email: string): Promise<PaymentConnection> {
        await delay(800); // simulate API call
        const settings = loadSettings();
        settings.payment = {
            method: 'paypal',
            paypalEmail: email,
            stripeAccountId: null,
            stripeOnboarded: false,
            connectedAt: new Date().toISOString(),
        };
        saveSettings(settings);
        return settings.payment;
    },

    async connectStripe(): Promise<{ onboardingUrl: string }> {
        await delay(600);
        // In production, this would call your backend which calls Stripe Connect
        // and returns an onboarding URL. For now, we simulate the flow.
        const settings = loadSettings();
        const mockAccountId = `acct_${Date.now()}`;
        settings.payment = {
            method: 'stripe',
            paypalEmail: null,
            stripeAccountId: mockAccountId,
            stripeOnboarded: false,
            connectedAt: new Date().toISOString(),
        };
        saveSettings(settings);
        // Return a simulated Stripe onboarding URL
        return { onboardingUrl: `https://connect.stripe.com/setup/${mockAccountId}` };
    },

    async completeStripeOnboarding(): Promise<PaymentConnection> {
        await delay(400);
        const settings = loadSettings();
        settings.payment.stripeOnboarded = true;
        saveSettings(settings);
        return settings.payment;
    },

    async disconnectPayment(): Promise<void> {
        await delay(300);
        const settings = loadSettings();
        settings.payment = { ...DEFAULT_SETTINGS.payment };
        saveSettings(settings);
    },

    // --- Identity Verification ---
    async submitIdentityVerification(documentType: 'passport' | 'drivers_license' | 'national_id'): Promise<IdentityVerification> {
        await delay(1000); // simulate upload
        const settings = loadSettings();
        settings.identity = {
            status: 'pending',
            submittedAt: new Date().toISOString(),
            verifiedAt: null,
            documentType,
        };
        saveSettings(settings);

        // Auto-verify after 5 seconds (simulating backend review)
        setTimeout(() => {
            const s = loadSettings();
            s.identity.status = 'verified';
            s.identity.verifiedAt = new Date().toISOString();
            saveSettings(s);
        }, 5000);

        return settings.identity;
    },

    // --- Notifications ---
    async updateNotifications(prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
        await delay(300);
        const settings = loadSettings();
        settings.notifications = { ...settings.notifications, ...prefs };
        saveSettings(settings);
        return settings.notifications;
    },
};
