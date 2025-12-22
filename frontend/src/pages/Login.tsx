import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { LogIn, Loader2, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/authenticate', { email, password });
            login(response.data.token);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Invalid credentials');
            } else {
                setError('Login failed. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async (role: 'ADMIN' | 'USER') => {
        const demoEmail = role === 'ADMIN' ? 'admin_demo@taskflow.com' : 'user_demo@taskflow.com';
        const demoPass = 'Demo@1234';

        setEmail(demoEmail);
        setPassword(demoPass);

        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 600));
            const response = await api.post('/auth/authenticate', { email: demoEmail, password: demoPass });
            login(response.data.token);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError('Demo login failed. Please retry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your account to continue"
        >
            <div className="bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 p-3 rounded-lg mb-6 text-center text-sm font-semibold shadow-lg shadow-indigo-500/10">
                🚀 Try demo in 10 seconds. No signup needed.
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => handleDemoLogin('ADMIN')}
                    type="button"
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex flex-col items-center gap-2 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                        <LogIn className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-medium text-white">Admin Demo</div>
                        <div className="text-[10px] text-gray-400">Full Access</div>
                    </div>
                </button>
                <button
                    onClick={() => handleDemoLogin('USER')}
                    type="button"
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex flex-col items-center gap-2 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <LogIn className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-medium text-white">User Demo</div>
                        <div className="text-[10px] text-gray-400">Limited Access</div>
                    </div>
                </button>
            </div>

            <div className="text-center my-4 text-xs text-gray-400 uppercase">Or sign in with email</div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-gray-300 text-sm font-medium">Password</label>
                        <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</a>
                    </div>
                    <input
                        type="password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><LogIn className="w-5 h-5" /> Sign In</>}
                </button>
            </form>
            <div className="mt-8 text-center text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 hover:underline">
                    Sign up <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;
