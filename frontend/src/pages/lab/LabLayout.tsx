import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Terminal, Activity, Database, Server, Settings, Cpu } from 'lucide-react';

const LabLayout = () => {
    return (
        <div className="flex h-screen bg-[#09090b] text-stone-300 font-sans overflow-hidden">
            {/* Lab Sidebar */}
            <div className="w-16 flex flex-col items-center py-4 border-r border-stone-800 bg-[#0c0c0e]">
                <div className="mb-8 p-2 bg-emerald-900/20 rounded-lg text-emerald-500">
                    <Terminal size={24} />
                </div>

                <nav className="flex-1 flex flex-col gap-6 w-full px-2">
                    <NavLink to="/lab" end className={({ isActive }) => `p-3 rounded-lg flex justify-center hover:bg-stone-800 transition-colors ${isActive ? 'bg-stone-800 text-white' : ''}`}>
                        <Activity size={20} />
                    </NavLink>
                    <NavLink to="/lab/experiments" className={({ isActive }) => `p-3 rounded-lg flex justify-center hover:bg-stone-800 transition-colors ${isActive ? 'bg-stone-800 text-white' : ''}`}>
                        <Database size={20} />
                    </NavLink>
                    <NavLink to="/lab/nodes" className={({ isActive }) => `p-3 rounded-lg flex justify-center hover:bg-stone-800 transition-colors ${isActive ? 'bg-stone-800 text-white' : ''}`}>
                        <Server size={20} />
                    </NavLink>
                </nav>

                <div className="mt-auto flex flex-col gap-6 w-full px-2 mb-4">
                    <button className="p-3 rounded-lg flex justify-center hover:bg-stone-800 transition-colors">
                        <Settings size={20} />
                    </button>
                    <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-xs font-bold ring-2 ring-[#09090b]">
                            JS
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-14 border-b border-stone-800 flex items-center justify-between px-6 bg-[#0c0c0e]">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-500 font-bold">HARBOR</span>
                        <span className="text-stone-600">/</span>
                        <span className="font-semibold text-stone-200">LAB</span>
                        <span className="text-stone-600">/</span>
                        <span className="text-xs font-mono text-stone-500 bg-stone-900 px-2 py-1 rounded">prime-rl-v0.4.2</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span>CLUSTER: ONLINE (4 NODES)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Cpu size={14} />
                            <span>GPU: 12%</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LabLayout;
