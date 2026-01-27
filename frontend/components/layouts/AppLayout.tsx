
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Database,
    Store,
    Megaphone,
    Upload,
    Key,
    Settings,
    LogOut,
    X
} from 'lucide-react';
import { authStore, useAuth } from '../../lib/authStore';
import { uiStore } from '../../lib/uiStore';
import SmartOnboardingModal from '../onboarding/SmartOnboardingModal';
import ApiDocsDrawer from '../docs/ApiDocsDrawer';

const AppLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAuth();
    const [showBanner, setShowBanner] = React.useState(true);

    const isContributor = user.role === 'contributor' || user.intent === 'contributor';

    const navItems = [
        { path: '/app', icon: LayoutDashboard, label: 'Overview' },
        ...(isContributor ? [
            { path: '/app/contribute', icon: Upload, label: 'Captures' },
            { path: '/app/contributor', icon: Key, label: 'Earnings' },
        ] : [
            // Removed Command
            { path: '/app/datasets', icon: Database, label: 'Builds' },
            { path: '/app/marketplace', icon: Store, label: 'Marketplace' },
            { path: '/app/ads', icon: Megaphone, label: 'Creative' },
            { path: '/app/api', icon: Key, label: 'API' },
        ])
    ];

    // ... (rest of code)

    // Onboarding State
    const [showOnboarding, setShowOnboarding] = React.useState(false);

    React.useEffect(() => {
        // Check if onboarding is complete
        const hasOnboarded = localStorage.getItem('harbor_onboarding_complete');
        // Only show if user is logged in, NOT a contributor intent (they have separate flow), and hasn't onboarded
        if (!hasOnboarded && user.role !== 'contributor' && user.intent !== 'contributor') {
            setShowOnboarding(true);
        }
    }, [user]);

    const handleOnboardingComplete = () => {
        localStorage.setItem('harbor_onboarding_complete', 'true');
        setShowOnboarding(false);
        // Could also trigger a reload or context update here
        setShowBanner(true); // Show the welcome banner after onboarding
    };

    const handleLogout = () => {
        authStore.signOut();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] flex font-sans text-[#111] antialiased selection:bg-black selection:text-white">
            {/* Onboarding Modal Overlay */}
            {showOnboarding && <SmartOnboardingModal onComplete={handleOnboardingComplete} />}

            {/* API Docs Drawer */}
            <ApiDocsDrawer />

            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                {/* Logo */}
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="flex items-center gap-1 text-black">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="6" cy="12" r="5" />
                                <rect x="13" y="7" width="10" height="10" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold tracking-tight uppercase text-black">HARBOR</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/app' && location.pathname.startsWith(item.path));

                        // Special handling for API to open drawer instead of navigate
                        if (item.label === 'API') {
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => uiStore.openApiDocs('overview')}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm text-gray-500 hover:text-[#111] hover:bg-gray-50`}
                                >
                                    <item.icon size={16} strokeWidth={1.5} />
                                    <span className="font-normal tracking-tight">{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${isActive
                                    ? 'bg-black text-white font-medium shadow-sm'
                                    : 'text-gray-500 hover:text-[#111] hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                                <span className={isActive ? 'tracking-tight' : 'font-normal tracking-tight'}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-100">
                    <div className="px-4 py-2 mb-2">
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                        <p className="text-xs font-bold text-gray-800 truncate">{user.email}</p>
                    </div>
                    <Link
                        to="/app/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                        <Settings size={20} />
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-black hover:bg-gray-50 transition-colors mt-1"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-[#F9F9F9] text-[#111] overflow-hidden">
                {/* Welcome Banner (First Session) */}
                {user.onboardingComplete && showBanner && (
                    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="text-xs text-gray-600 font-medium">
                                Welcome to Harbor Command. System operating normally.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowBanner(false)}
                            className="text-gray-400 hover:text-black transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Page Content */}
                <div className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
