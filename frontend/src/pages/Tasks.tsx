import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import { getProjectTasks, updateTaskStatus, getAssignedTasks } from '../api/tasks';
import { getProjects } from '../api/projects';
import type { Task, Project } from '../types';
import { Plus, MoreVertical } from 'lucide-react';
import { cn } from '../utils/cn';
import TaskModal from '../components/TaskModal';
import { TaskCardSkeleton } from '../components/Skeleton';
import { CSS } from '@dnd-kit/utilities';

const DraggableTaskCard = ({ task, status }: { task: Task; status: string }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id.toString(),
        data: { task, status }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow group cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    task.priority === 'HIGH' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        task.priority === 'MEDIUM' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                )}>
                    {task.priority}
                </span>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={14} />
                </button>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 leading-snug">{task.title}</h4>
            <div className="flex justify-between items-center mt-4">
                <div className="text-[10px] text-slate-400 font-medium">
                    {new Date(task.dueDate).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

const DroppableColumn = ({ status, tasks, children }: any) => {
    const { setNodeRef, isOver } = useDroppable({
        id: status
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "bg-slate-100 dark:bg-slate-900/50 rounded-xl p-4 flex flex-col border border-slate-200 dark:border-slate-800 h-full transition-colors",
                isOver && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            )}
        >
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        status === 'TODO' ? "bg-slate-400" : status === 'IN_PROGRESS' ? "bg-blue-500" : "bg-green-500"
                    )} />
                    {status.replace('_', ' ')}
                </span>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs">
                    {tasks.length}
                </span>
            </h3>
            <div className="flex-1 overflow-auto space-y-3 pr-1 custom-scrollbar min-h-[100px]">
                {children}
                {tasks.length === 0 && (
                    <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 dark:text-slate-500">
                        <p className="text-xs">Drop items here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Tasks: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const projectIdParam = searchParams.get('projectId');

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (projects.length > 0 && projectIdParam) {
            const id = parseInt(projectIdParam);
            if (!isNaN(id)) {
                setSelectedProjectId(id);
            }
        }
    }, [projects, projectIdParam]);

    useEffect(() => {
        if (selectedProjectId) {
            loadTasks(selectedProjectId);
            setSearchParams({ projectId: selectedProjectId.toString() });
        } else {
            loadTasks(null); // Load global tasks if no project
        }
    }, [selectedProjectId]);

    const loadProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data.content);
        } catch (error) {
            console.error('Failed to load projects', error);
        }
    };

    const loadTasks = async (id: number | null) => {
        setLoading(true);
        try {
            let data;
            if (id) {
                data = await getProjectTasks(id);
            } else {
                data = await getAssignedTasks();
            }
            setTasks(data.content);
        } catch (error) {
            console.error('Failed to load tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const taskId = parseInt(active.id);
        const newStatus = over.id as Task['status'];
        const currentTask = tasks.find(t => t.id === taskId);

        if (currentTask && currentTask.status !== newStatus) {
            // Optimistic update
            const originalTasks = [...tasks];
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

            try {
                await updateTaskStatus(taskId, newStatus);
            } catch (error) {
                console.error('Failed to update task status', error);
                setTasks(originalTasks);
            }
        }

        setActiveId(null);
    };

    const columns: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE'];

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
                    <select
                        className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={selectedProjectId || ''}
                        onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                    >
                        <option value="">All My Tasks</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all font-medium"
                    disabled={!selectedProjectId}
                >
                    <Plus size={20} />
                    <span>New Task</span>
                </button>
            </div>

            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-0">
                    {columns.map(status => (
                        <DroppableColumn key={status} status={status} tasks={tasks.filter(t => t.status === status)}>
                            {loading ? (
                                [1, 2, 3].map(i => <TaskCardSkeleton key={i} />)
                            ) : (
                                tasks
                                    .filter(t => t.status === status)
                                    .map(task => (
                                        <DraggableTaskCard key={task.id} task={task} status={status} />
                                    ))
                            )}
                        </DroppableColumn>
                    ))}
                </div>
                <DragOverlay>
                    {activeId ? (
                        <div className="opacity-90 rotate-2 scale-105 cursor-grabbing z-50">
                            {/* Render a static version of the card for the overlay */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border border-blue-500/50 ring-2 ring-blue-500/20 backdrop-blur-sm">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{tasks.find(t => t.id.toString() === activeId)?.title}</h4>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={selectedProjectId}
                onTaskCreated={() => selectedProjectId ? loadTasks(selectedProjectId) : loadTasks(null)}
            />
        </div>
    );
};

export default Tasks;
