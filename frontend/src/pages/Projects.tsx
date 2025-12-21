import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject } from '../api/projects';
import type { Project } from '../types';
import { Plus, Folder } from 'lucide-react';
import { ProjectCardSkeleton } from '../components/Skeleton';

import { useToast } from '../context/ToastContext';

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const { showToast } = useToast();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data.content);
        } catch (error) {
            console.error('Failed to load projects', error);
            showToast('Failed to load projects', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();

        // Optimistic UI Update
        const optimisticProject: Project = {
            id: Date.now(), // Temporary ID
            name: newProject.name,
            description: newProject.description,
            ownerEmail: '', // Placeholder
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setProjects(prev => [optimisticProject, ...prev]);
        setIsModalOpen(false);
        const tempName = newProject.name;
        const tempDesc = newProject.description;
        setNewProject({ name: '', description: '' });

        try {
            await createProject(tempName, tempDesc);
            loadProjects(); // Reload to get real ID and data
            showToast('Project created successfully!', 'success');
        } catch (error) {
            console.error('Failed to create project', error);
            // Rollback optimistic update
            setProjects(prev => prev.filter(p => p.id !== optimisticProject.id));
            showToast('Failed to create project. Please try again.', 'error');
        }
    };

    const navigate = useNavigate();

    const handleProjectClick = (id: number) => {
        navigate(`/tasks?projectId=${id}`);
    };

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <button disabled className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg opacity-50">
                        <Plus size={20} />
                        <span>New Project</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((_, i) => <ProjectCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                    <Plus size={20} />
                    <span>New Project</span>
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-4">
                        <Folder size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">No projects yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm text-center">
                        Create your first project to start organizing your work and tracking progress.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary"
                    >
                        <Plus size={20} />
                        <span>Create Project</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => handleProjectClick(project.id)}
                            className="card group cursor-pointer hover:border-blue-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Folder size={24} />
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                        <form onSubmit={handleCreateProject}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newProject.name}
                                        onChange={(e) =>
                                            setNewProject({ ...newProject, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        value={newProject.description}
                                        onChange={(e) =>
                                            setNewProject({ ...newProject, description: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
