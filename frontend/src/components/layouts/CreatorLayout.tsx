import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Upload,
    FileText,
    DollarSign,
    Target,
    BookOpen,
    Users,
    Bell,
    HelpCircle,
    Settings,
    LogOut,
    Menu,
    X,
    MessageSquare,
} from 'lucide-react';
import { authStore, useAuth } from '../../lib/authStore';
import { messagingService } from '../../services/messagingService';

const CreatorLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAuth();
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
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

    const primaryNav = [
        { path: '/creator', icon: Home, label: 'Home', exact: true },
        { path: '/creator/upload', icon: Upload, label: 'Upload' },
        { path: '/creator/submissions', icon: FileText, label: 'My Submissions' },
        { path: '/creator/messages', icon: MessageSquare, label: 'Messages' },
        { path: '/creator/earnings', icon: DollarSign, label: 'Earnings' },
        { path: '/creator/opportunities', icon: Target, label: 'Opportunities' },
        { path: '/creator/guidelines', icon: BookOpen, label: 'Guidelines' },
        { path: '/creator/referrals', icon: Users, label: 'Referrals' },
    ];

    const secondaryNav = [
        { path: '/creator/notifications', icon: Bell, label: 'Notifications' },
        { path: '/creator/support', icon: HelpCircle, label: 'Support' },
        { path: '/creator/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = () => {
        authStore.signOut();
        navigate('/auth');
    };

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const NavLink = ({ item, onClick }: { item: typeof primaryNav[0]; onClick?: () => void }) => {
        const active = isActive(item.path, (item as any).exact);
        return (
            <Link
                to={item.path}
                onClick={onClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm relative ${active
                    ? 'bg-[#2563EB] text-white font-medium shadow-sm shadow-blue-200'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
            >
                <item.icon size={18} strokeWidth={active ? 2 : 1.5} />
                <span className="tracking-tight flex-1">{item.label}</span>
                {item.label === 'Messages' && unreadCount > 0 && (
                    <span className="absolute left-6 top-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                )}
            </Link>
        );
    };

    const UserAvatar = () => (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-['Inter',system-ui,sans-serif] text-gray-900 antialiased">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <Link to="/" className="flex items-center gap-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="6" cy="12" r="5" />
                        <rect x="13" y="7" width="10" height="10" />
                    </svg>
                    <span className="text-sm font-bold tracking-tight uppercase">HARBOR</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        to="/creator/upload"
                        className="bg-[#2563EB] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Upload
                    </Link>
                    <button
                        onClick={() => setShowMobileMenu(true)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowMobileMenu(false)}
                    />
                    <aside className="absolute top-0 bottom-0 left-0 w-72 bg-white flex flex-col shadow-2xl">
                        <div className="p-4 flex items-center justify-between border-b border-gray-100">
                            <Link to="/" className="flex items-center gap-2" onClick={() => setShowMobileMenu(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="6" cy="12" r="5" />
                                    <rect x="13" y="7" width="10" height="10" />
                                </svg>
                                <span className="text-sm font-bold tracking-tight uppercase">HARBOR</span>
                            </Link>
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="p-2 text-gray-400 hover:text-black rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                            {primaryNav.map(item => (
                                <NavLink key={item.path} item={item} onClick={() => setShowMobileMenu(false)} />
                            ))}
                            <div className="h-px bg-gray-100 my-3" />
                            {secondaryNav.map(item => (
                                <NavLink key={item.path} item={item} onClick={() => setShowMobileMenu(false)} />
                            ))}
                        </nav>
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <UserAvatar />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{user.name || 'Creator'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-medium"
                            >
                                <LogOut size={14} />
                                Sign out
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-60 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen">
                {/* Logo */}
                <div className="px-5 py-5 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="6" cy="12" r="5" />
                            <rect x="13" y="7" width="10" height="10" />
                        </svg>
                        <span className="text-sm font-bold tracking-tight uppercase">HARBOR</span>
                    </Link>
                </div>

                {/* Primary Navigation */}
                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {primaryNav.map(item => (
                        <NavLink key={item.path} item={item} />
                    ))}

                    <div className="h-px bg-gray-100 my-3" />

                    {secondaryNav.map(item => (
                        <NavLink key={item.path} item={item} />
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F7F7F8] border border-gray-100">
                        <UserAvatar />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user.name || 'Creator'}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-medium"
                    >
                        <LogOut size={14} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white overflow-auto">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CreatorLayout;
