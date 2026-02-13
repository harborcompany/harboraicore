import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    User, CreditCard, Shield, Bell, Trash2, ChevronRight, CheckCircle,
    AlertCircle, ExternalLink, Loader2, XCircle, FileText, Mail,
    Globe, Upload as UploadIcon
} from 'lucide-react';
import { useAuth, authStore } from '../../lib/authStore';
import {
    creatorSettingsService,
    type CreatorSettings as SettingsData,
    type PaymentConnection,
    type IdentityVerification,
    type NotificationPreferences,
} from '../../services/creatorSettingsService';

const CreatorSettings: React.FC = () => {
    const user = useAuth();
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<SettingsData | null>(null);

    // Form state
    const [profileName, setProfileName] = useState('');
    const [profileCountry, setProfileCountry] = useState('');
    const [profileBio, setProfileBio] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    // Payment state
    const [paypalEmail, setPaypalEmail] = useState('');
    const [showPaypalForm, setShowPaypalForm] = useState(false);
    const [connectingPayment, setConnectingPayment] = useState(false);

    // Identity state
    const [selectedDocType, setSelectedDocType] = useState<'passport' | 'drivers_license' | 'national_id' | null>(null);
    const [verifying, setVerifying] = useState(false);

    // Notification state
    const [notifications, setNotifications] = useState<NotificationPreferences>({
        submissionApproved: true,
        revisionRequested: true,
        newOpportunity: true,
        paymentProcessed: true,
        marketing: false,
    });

    useEffect(() => {
        creatorSettingsService.getSettings().then(s => {
            setSettings(s);
            setProfileName(prev => prev || s.profile.fullName || user.name || '');
            setProfileCountry(prev => prev || s.profile.country || '');
            setProfileBio(prev => prev || s.profile.bio || '');
            setNotifications(s.notifications);
            setLoading(false);
        });
    }, []); // Only load once on mount

    // Poll identity status if pending
    useEffect(() => {
        if (settings?.identity.status === 'pending') {
            const interval = setInterval(async () => {
                const updated = await creatorSettingsService.getSettings();
                if (updated.identity.status !== 'pending') {
                    setSettings(updated);
                    clearInterval(interval);
                }
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [settings?.identity.status]);

    const showSaveSuccess = (msg: string) => {
        setSaveSuccess(msg);
        setTimeout(() => setSaveSuccess(null), 3000);
    };

    // --- Profile ---
    const handleSaveProfile = async () => {
        setSaving(true);
        await creatorSettingsService.updateProfile({
            fullName: profileName,
            email: user.email,
            country: profileCountry,
            bio: profileBio,
        });
        authStore.updateProfile({ name: profileName });
        setSaving(false);
        showSaveSuccess('Profile saved');
    };

    // --- Payment ---
    const handleConnectPaypal = async () => {
        if (!paypalEmail || !paypalEmail.includes('@')) return;
        setConnectingPayment(true);
        const payment = await creatorSettingsService.connectPaypal(paypalEmail);
        setSettings(prev => prev ? { ...prev, payment } : prev);
        setConnectingPayment(false);
        setShowPaypalForm(false);
        showSaveSuccess('PayPal connected');
    };

    const handleConnectStripe = async () => {
        setConnectingPayment(true);
        const { onboardingUrl } = await creatorSettingsService.connectStripe();
        // In production, this would open the real Stripe Connect onboarding page
        // For now, we simulate completion after showing the URL
        window.open(onboardingUrl, '_blank');
        // Simulate onboarding completion
        setTimeout(async () => {
            const payment = await creatorSettingsService.completeStripeOnboarding();
            setSettings(prev => prev ? { ...prev, payment } : prev);
            setConnectingPayment(false);
            showSaveSuccess('Stripe connected');
        }, 2000);
    };

    const handleDisconnectPayment = async () => {
        await creatorSettingsService.disconnectPayment();
        setSettings(prev => prev ? {
            ...prev,
            payment: { method: null, paypalEmail: null, stripeAccountId: null, stripeOnboarded: false, connectedAt: null }
        } : prev);
        showSaveSuccess('Payment method disconnected');
    };

    // --- Identity ---
    const handleSubmitVerification = async () => {
        if (!selectedDocType) return;
        setVerifying(true);
        const identity = await creatorSettingsService.submitIdentityVerification(selectedDocType);
        setSettings(prev => prev ? { ...prev, identity } : prev);
        setVerifying(false);
    };

    // --- Notifications ---
    const handleSaveNotifications = async () => {
        setSaving(true);
        const updated = await creatorSettingsService.updateNotifications(notifications);
        setSettings(prev => prev ? { ...prev, notifications: updated } : prev);
        setSaving(false);
        showSaveSuccess('Notification preferences saved');
    };

    if (loading || !settings) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
            </div>
        );
    }

    const sections = [
        {
            id: 'profile',
            icon: User,
            title: 'Profile',
            desc: 'Name, email, and account details',
            content: (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={profileName}
                            onChange={e => setProfileName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support if needed.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                        <select
                            value={profileCountry}
                            onChange={e => setProfileCountry(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                        >
                            <option value="">Select your country</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="AU">Australia</option>
                            <option value="IN">India</option>
                            <option value="NG">Nigeria</option>
                            <option value="BR">Brazil</option>
                            <option value="JP">Japan</option>
                            <option value="KR">South Korea</option>
                            <option value="MX">Mexico</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                        <textarea
                            value={profileBio}
                            onChange={e => setProfileBio(e.target.value)}
                            placeholder="Tell us a bit about yourself"
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
                        />
                    </div>
                    <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            ),
        },
        {
            id: 'payment',
            icon: CreditCard,
            title: 'Payment Method',
            desc: settings.payment.method
                ? `${settings.payment.method === 'paypal' ? 'PayPal' : 'Stripe'} connected`
                : 'Connect PayPal or bank account for payouts',
            content: (
                <div className="space-y-4">
                    {/* Connected Payment Display */}
                    {settings.payment.method === 'paypal' && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={18} className="text-green-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">PayPal Connected</p>
                                        <p className="text-xs text-gray-500">{settings.payment.paypalEmail}</p>
                                        {settings.payment.connectedAt && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Connected {new Date(settings.payment.connectedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleDisconnectPayment}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    )}

                    {settings.payment.method === 'stripe' && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={18} className="text-green-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Stripe Connected</p>
                                        <p className="text-xs text-gray-500">Account: {settings.payment.stripeAccountId}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Status: {settings.payment.stripeOnboarded ? 'Fully onboarded' : 'Onboarding in progress'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDisconnectPayment}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Connect Options — only show if no payment is connected */}
                    {!settings.payment.method && (
                        <>
                            <p className="text-sm text-gray-600">Choose how you'd like to receive payouts:</p>

                            {/* PayPal Option */}
                            <div className="border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <Mail size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">PayPal</p>
                                            <p className="text-xs text-gray-500">Receive payouts to your PayPal account</p>
                                        </div>
                                    </div>
                                    {!showPaypalForm && (
                                        <button
                                            onClick={() => setShowPaypalForm(true)}
                                            className="text-sm font-medium text-[#2563EB] hover:text-blue-700"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>
                                {showPaypalForm && (
                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">PayPal Email Address</label>
                                            <input
                                                type="email"
                                                value={paypalEmail}
                                                onChange={e => setPaypalEmail(e.target.value)}
                                                placeholder="your@paypal-email.com"
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleConnectPaypal}
                                                disabled={connectingPayment || !paypalEmail}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {connectingPayment ? <Loader2 size={14} className="animate-spin" /> : null}
                                                {connectingPayment ? 'Connecting...' : 'Connect PayPal'}
                                            </button>
                                            <button
                                                onClick={() => { setShowPaypalForm(false); setPaypalEmail(''); }}
                                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stripe Option */}
                            <div className="border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                            <CreditCard size={18} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Bank Account via Stripe</p>
                                            <p className="text-xs text-gray-500">Direct bank transfer — available in 40+ countries</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleConnectStripe}
                                        disabled={connectingPayment}
                                        className="flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:text-blue-700 disabled:opacity-50"
                                    >
                                        {connectingPayment ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                                        {connectingPayment ? 'Connecting...' : 'Connect'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
                        <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-700">
                            Payouts are issued monthly once your balance exceeds $25. First payout is processed within 90 days of your first approved submission.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 'identity',
            icon: Shield,
            title: 'Identity Verification',
            desc: settings.identity.status === 'verified'
                ? 'Verified'
                : settings.identity.status === 'pending'
                    ? 'Verification in progress'
                    : 'Required before receiving payouts',
            content: (
                <div className="space-y-4">
                    {settings.identity.status === 'verified' && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <CheckCircle size={18} className="text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Identity Verified</p>
                                <p className="text-xs text-gray-500">
                                    Verified on {settings.identity.verifiedAt
                                        ? new Date(settings.identity.verifiedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                        : 'N/A'
                                    }
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Document: {settings.identity.documentType === 'passport' ? 'Passport' : settings.identity.documentType === 'drivers_license' ? "Driver's License" : 'National ID'}
                                </p>
                            </div>
                        </div>
                    )}

                    {settings.identity.status === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                            <Loader2 size={18} className="text-yellow-600 animate-spin" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Verification In Progress</p>
                                <p className="text-xs text-gray-500">
                                    Submitted on {settings.identity.submittedAt
                                        ? new Date(settings.identity.submittedAt).toLocaleDateString()
                                        : 'just now'
                                    }. Usually takes 1–2 business days.
                                </p>
                            </div>
                        </div>
                    )}

                    {settings.identity.status === 'rejected' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                            <XCircle size={18} className="text-red-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Verification Rejected</p>
                                <p className="text-xs text-gray-500">Please resubmit with a clearer document.</p>
                            </div>
                        </div>
                    )}

                    {(settings.identity.status === 'not_started' || settings.identity.status === 'rejected') && (
                        <>
                            <p className="text-sm text-gray-600">
                                Upload a government-issued photo ID to verify your identity. This is required before receiving payouts.
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {([
                                        { value: 'passport' as const, label: 'Passport' },
                                        { value: 'drivers_license' as const, label: "Driver's License" },
                                        { value: 'national_id' as const, label: 'National ID' },
                                    ]).map(doc => (
                                        <button
                                            key={doc.value}
                                            onClick={() => setSelectedDocType(doc.value)}
                                            className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors ${selectedDocType === doc.value
                                                ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            {doc.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedDocType && (
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#2563EB] transition-colors">
                                    <UploadIcon size={24} className="text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-700">Upload front of document</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 10MB</p>
                                </div>
                            )}

                            <button
                                onClick={handleSubmitVerification}
                                disabled={!selectedDocType || verifying}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {verifying ? <Loader2 size={14} className="animate-spin" /> : null}
                                {verifying ? 'Submitting...' : 'Submit Verification'}
                            </button>
                        </>
                    )}

                    <p className="text-xs text-gray-400">
                        Your document is processed securely and retained only as required by law. See our{' '}
                        <Link to="/privacy" className="text-[#2563EB] hover:underline">Privacy Policy</Link> for details.
                    </p>
                </div>
            ),
        },
        {
            id: 'notifications',
            icon: Bell,
            title: 'Notifications',
            desc: 'Email and push notification preferences',
            content: (
                <div className="space-y-4">
                    {([
                        { key: 'submissionApproved' as const, label: 'Submission approved', desc: 'When your submission passes review' },
                        { key: 'revisionRequested' as const, label: 'Revision requested', desc: 'When a reviewer asks for changes' },
                        { key: 'newOpportunity' as const, label: 'New opportunity available', desc: 'When new paid projects are posted' },
                        { key: 'paymentProcessed' as const, label: 'Payment processed', desc: 'When a payout is sent to your account' },
                        { key: 'marketing' as const, label: 'Tips & updates', desc: 'Creator tips, platform news, and feature updates' },
                    ]).map(item => (
                        <label key={item.key} className="flex items-center justify-between py-2 group cursor-pointer">
                            <div>
                                <span className="text-sm text-gray-800 font-medium">{item.label}</span>
                                <p className="text-xs text-gray-400">{item.desc}</p>
                            </div>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={notifications[item.key]}
                                    onChange={e => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-[#2563EB] transition-colors" />
                                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                            </div>
                        </label>
                    ))}
                    <button
                        onClick={handleSaveNotifications}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
            </div>

            {/* Success Toast */}
            {saveSuccess && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200">
                    <CheckCircle size={16} />
                    {saveSuccess}
                </div>
            )}

            {/* Settings Sections */}
            <div className="space-y-3">
                {sections.map(section => (
                    <div key={section.id} className="bg-[#F7F7F8] rounded-2xl border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                            className="w-full flex items-center gap-4 p-5 hover:bg-gray-100/50 transition-colors text-left"
                        >
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                <section.icon size={18} className="text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">{section.title}</p>
                                <p className="text-xs text-gray-500 truncate">{section.desc}</p>
                            </div>
                            <ChevronRight
                                size={16}
                                className={`text-gray-400 transition-transform flex-shrink-0 ${activeSection === section.id ? 'rotate-90' : ''}`}
                            />
                        </button>
                        {activeSection === section.id && (
                            <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                                <div className="pt-4">{section.content}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Contributor Agreement */}
            <div className="bg-[#F7F7F8] rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText size={18} className="text-gray-500" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Contributor Agreement</p>
                            <p className="text-xs text-gray-500">View the full terms of your contributor license.</p>
                        </div>
                    </div>
                    <Link
                        to="/creator/agreement"
                        className="text-sm font-medium text-[#2563EB] hover:text-blue-700 flex items-center gap-1"
                    >
                        View Agreement <ExternalLink size={14} />
                    </Link>
                </div>
            </div>

            {/* Delete Account */}
            <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Trash2 size={18} className="text-red-400" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Delete Account</p>
                            <p className="text-xs text-gray-500">Permanently remove your account and all data.</p>
                        </div>
                    </div>
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            Delete
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button className="text-sm font-medium text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700">
                                Confirm Delete
                            </button>
                        </div>
                    )}
                </div>
                {showDeleteConfirm && (
                    <p className="text-xs text-red-600 mt-3 flex items-center gap-1.5">
                        <AlertCircle size={12} />
                        This action cannot be undone. Outstanding earnings will still be processed.
                    </p>
                )}
            </div>
        </div>
    );
};

export default CreatorSettings;
