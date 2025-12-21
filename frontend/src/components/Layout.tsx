import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
            {/* Ambient Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] mix-blend-multiply filter pointer-events-none animate-blob" />
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] mix-blend-multiply filter pointer-events-none animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] mix-blend-multiply filter pointer-events-none animate-blob animation-delay-4000" />

            {/* Desktop Sidebar */}
            <div className="z-20 p-4 hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-64 z-50 md:hidden p-4"
                        >
                            <Sidebar />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 z-10 relative">
                {/* Mobile Menu Button */}
                <div className="md:hidden absolute top-4 left-4 z-30">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-slate-800 dark:text-white shadow-lg"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <Topbar />
                <main className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth pt-16 md:pt-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
