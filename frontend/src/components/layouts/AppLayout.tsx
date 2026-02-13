
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
    Menu,
    X,
    Mail,
    MessageSquare
} from 'lucide-react';
import { authStore, useAuth } from '../../lib/authStore';
import { uiStore } from '../../lib/uiStore';
import { messagingService } from '../../services/messagingService';
import SmartOnboardingModal from '../onboarding/SmartOnboardingModal';
import ApiDocsDrawer from '../docs/ApiDocsDrawer';

const AppLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAuth();
    const [showBanner, setShowBanner] = React.useState(true);
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);

    const isContributor = user.role === 'contributor' || user.intent === 'contributor';

    const navItems = [
        { path: '/app', icon: LayoutDashboard, label: 'Overview' },
        ...(isContributor ? [
            { path: '/app/contribute', icon: Upload, label: 'Captures' },
            { path: '/app/contributor', icon: Key, label: 'Earnings' },
            { path: '/app/messages', icon: MessageSquare, label: 'Messages' },
        ] : [
            // Removed Command
            { path: '/app/inbox', icon: Mail, label: 'Inbox' },
            { path: '/app/datasets', icon: Database, label: 'Builds' },
            { path: '/app/marketplace', icon: Store, label: 'Marketplace' },
            { path: '/app/ads', icon: Megaphone, label: 'Creative' },
            { path: '/app/api', icon: Key, label: 'API' },
        ])
    ];

    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
        if (user.authenticated) {
            setUnreadCount(messagingService.getUnreadCount(user.id));
            const interval = setInterval(() => {
                setUnreadCount(messagingService.getUnreadCount(user.id));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [user.id, user.authenticated]);

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
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col md:flex-row font-sans text-[#111] antialiased selection:bg-black selection:text-white">
            {/* Onboarding Modal Overlay */}
            {showOnboarding && <SmartOnboardingModal onComplete={handleOnboardingComplete} />}

            {/* API Docs Drawer */}
            <ApiDocsDrawer />

            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-black">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="6" cy="12" r="5" />
                            <rect x="13" y="7" width="10" height="10" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold tracking-tight uppercase text-black">HARBOR</span>
                </Link>
                <button
                    onClick={() => setShowMobileMenu(true)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
                        onClick={() => setShowMobileMenu(false)}
                    />
                    <aside className="absolute top-0 bottom-0 left-0 w-72 bg-white border-r border-gray-200 flex flex-col shadow-xl animate-in slide-in-from-left duration-300">
                        <div className="p-4 flex items-center justify-between border-b border-gray-100">
                            <Link to="/" className="flex items-center gap-2 group" onClick={() => setShowMobileMenu(false)}>
                                <div className="flex items-center gap-1 text-black">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="6" cy="12" r="5" />
                                        <rect x="13" y="7" width="10" height="10" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold tracking-tight uppercase text-black">HARBOR</span>
                            </Link>
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Copy */}
                        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path ||
                                    (item.path !== '/app' && location.pathname.startsWith(item.path));

                                if (item.label === 'API') {
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => {
                                                uiStore.openApiDocs('overview');
                                                setShowMobileMenu(false);
                                            }}
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
                                        onClick={() => setShowMobileMenu(false)}
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

                        {/* User Section Copy */}
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black text-white flex items-center justify-center font-medium shadow-sm">
                                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    to="/app/settings"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-medium"
                                >
                                    <Settings size={16} />
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all text-xs font-medium"
                                >
                                    <LogOut size={16} />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col shadow-sm">
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

                        if (item.label === 'API') {
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        uiStore.openApiDocs('overview');
                                        setShowMobileMenu(false);
                                    }}
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
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm relative ${isActive
                                    ? 'bg-black text-white font-medium shadow-sm'
                                    : 'text-gray-500 hover:text-[#111] hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                                <span className={isActive ? 'tracking-tight' : 'font-normal tracking-tight'}>{item.label}</span>
                                {item.label === 'Messages' && unreadCount > 0 && (
                                    <span className="absolute right-3 top-2.5 w-4 h-4 bg-blue-600 text-white text-[10px] flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black text-white flex items-center justify-center font-medium shadow-sm">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            to="/app/settings"
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-xs font-medium"
                        >
                            <Settings size={16} />
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all text-xs font-medium"
                        >
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
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
                                Welcome to Harbor. System operating normally.
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
                <div className="flex-1 p-8 overflow-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
