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
            { path: '/app/enterprise', icon: Database, label: 'Command' },
            { path: '/app/datasets', icon: Database, label: 'Builds' },
            { path: '/app/marketplace', icon: Store, label: 'Marketplace' },
            { path: '/app/ads', icon: Megaphone, label: 'Creative' },
            { path: '/app/api', icon: Key, label: 'API' },
        ])
    ];

    const handleLogout = () => {
        authStore.signOut(); // Fixed method name
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-stone-200 flex flex-col shadow-sm">
                {/* Logo */}
                <div className="p-6 border-b border-stone-100">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/harbor-logo.png"
                            alt="Harbor"
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/app' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'text-stone-600 hover:text-[#1A1A1A] hover:bg-stone-100'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-stone-100">
                    <div className="px-4 py-2 mb-2">
                        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                        <p className="text-xs font-bold text-zinc-800 truncate">{user.email}</p>
                    </div>
                    <Link
                        to="/app/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:text-[#1A1A1A] hover:bg-stone-100 transition-colors"
                    >
                        <Settings size={20} />
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:text-red-600 hover:bg-red-50 transition-colors mt-1"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Welcome Banner (First Session) */}
                {user.onboardingComplete && showBanner && (
                    <div className="bg-[#4e4637] px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-white">
                            Welcome to Harbor. Start by uploading data, browsing datasets, or requesting API access.
                        </p>
                        <button
                            onClick={() => setShowBanner(false)}
                            className="text-white/60 hover:text-white"
                        >
                            <X size={18} />
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
