import React from 'react';
import { Layers } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[100px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl mb-4 shadow-lg shadow-purple-500/30">
                        <Layers className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-gray-400 text-center">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
