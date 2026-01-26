import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Upload, Tag, Search, FileText, MonitorPlay } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/' },
        { icon: Database, label: 'Datasets', path: '/datasets' },
        { icon: Upload, label: 'Ingestion', path: '/ingestion' },
        { icon: Tag, label: 'Annotation', path: '/annotation' },
        { icon: Search, label: 'RAG / Search', path: '/rag' },
        { icon: FileText, label: 'Licensing', path: '/licensing' },
        { icon: MonitorPlay, label: 'Ad Production', path: '/ads' },
    ];

    return (
        <aside className="w-64 fixed h-screen bg-[#0A0A0A] border-r border-white/10 flex flex-col p-6">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg">
                    <span className="text-xl">⚓</span>
                </div>
                <span className="text-xl font-serif text-white tracking-wide">HARBOR</span>
            </div>

            <nav className="space-y-1 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-white text-black'
                                : 'text-stone-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-stone-500 mb-1">STORAGE USED</p>
                    <div className="flex justify-between text-sm text-stone-300 mb-2">
                        <span>2.4 PB</span>
                        <span>87%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[87%] bg-rose-500"></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
