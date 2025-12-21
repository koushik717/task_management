import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getProjects } from '../api/projects';
import { getAssignedTasks } from '../api/tasks';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const projects = await getProjects();
            const tasks = await getAssignedTasks(0, 100); // Fetch meaningful sample

            const completed = tasks.content.filter(t => t.status === 'DONE').length;
            const pending = tasks.content.filter(t => t.status === 'TODO').length;
            const active = tasks.content.filter(t => t.status === 'IN_PROGRESS').length;

            setStats({
                totalProjects: projects.totalElements,
                activeTasks: active,
                completedTasks: completed,
                pendingTasks: pending
            });
        } catch (error) {
            console.error('Failed to load dashboard stats');
        }
    };

    const data = [
        { name: 'Todo', value: stats.pendingTasks, color: '#94a3b8' },
        { name: 'In Progress', value: stats.activeTasks, color: '#3b82f6' },
        { name: 'Done', value: stats.completedTasks, color: '#22c55e' }
    ];

    const StatCard = ({ icon: Icon, label, value, color }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card group hover:scale-[1.02] transition-all duration-200"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Activity} label="Total Projects" value={stats.totalProjects} color="bg-purple-500" />
                <StatCard icon={AlertCircle} label="Pending Tasks" value={stats.pendingTasks} color="bg-slate-500" />
                <StatCard icon={Clock} label="In Progress" value={stats.activeTasks} color="bg-blue-500" />
                <StatCard icon={CheckCircle} label="Completed" value={stats.completedTasks} color="bg-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Task Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(148, 163, 184, 0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card"
                >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Activity Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.05} stroke="#94a3b8" />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(148, 163, 184, 0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                />
                                <Bar dataKey="value" fill="url(#colorGradient)" radius={[6, 6, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
