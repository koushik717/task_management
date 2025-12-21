import React from 'react';
import { useAuth } from '../context/AuthContext';

const Topbar: React.FC = () => {
    const { user } = useAuth();
    const displayName = user?.sub?.split('@')[0] || 'User';

    return (
        <header className="bg-white/80 backdrop-blur-md border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900 italic tracking-tight opacity-50">/ Dashboard</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 leading-none">
                            {displayName}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">
                            Individual Contributor
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 ring-2 ring-white">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
