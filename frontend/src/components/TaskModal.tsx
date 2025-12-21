import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createTask } from '../api/tasks';
import type { Task } from '../types';
import { X } from 'lucide-react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: number | null;
    onTaskCreated: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, projectId, onTaskCreated }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [assigneeEmail, setAssigneeEmail] = useState(user?.sub || '');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) return;

        try {
            await createTask(projectId, {
                title,
                description,
                priority,
                dueDate: new Date(dueDate).toISOString(),
                assigneeEmail,
            } as any);

            // Note: casting to any above because Partial<Task> doesn't include assigneeEmail which is on the DTO.
            // A better way would be to define CreateTaskRequest type.

            onTaskCreated();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setDueDate('');
        setAssigneeEmail(user?.sub || '');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">Create New Task</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assignee Email</label>
                        <input
                            type="email"
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={assigneeEmail}
                            onChange={(e) => setAssigneeEmail(e.target.value)}
                            placeholder="user@example.com"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
