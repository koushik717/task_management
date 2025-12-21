import React from 'react';
import { Layout, CheckSquare, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: Layout, label: 'Dashboard', path: '/' },
        { icon: CheckSquare, label: 'My Tasks', path: '/tasks' },
        { icon: Layout, label: 'Projects', path: '/projects' }, // Changed path to /projects
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="h-full w-64 bg-[#0F172A]/95 dark:bg-slate-900/80 backdrop-blur-xl text-white flex flex-col border border-white/10 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/20 transition-all duration-300">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
                        T
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white/90">TaskFlow</h1>
                        <p className="text-[10px] text-blue-200/60 uppercase tracking-widest font-semibold">Enterprise Platform</p>
                    </div>
                </div>
            </div>

            <div className="px-4 mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/25"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 -z-10" />
                                )}
                                <item.icon size={20} className={cn("transition-colors duration-300", isActive ? "text-white" : "group-hover:text-blue-400")} />
                                <span className="text-[14px]">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 mb-4 border border-white/5 backdrop-blur-md">
                    <p className="text-xs text-slate-300 mb-2 font-medium">Need assistance?</p>
                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group">
                        Documentation <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
                >
                    <LogOut size={18} />
                    <span className="text-[14px] font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
