import api from './axios';
import type { Task, PaginatedResponse } from '../types';

export const getProjectTasks = async (projectId: number, page = 0, size = 20, sort = 'createdAt,desc') => {
    const response = await api.get<PaginatedResponse<Task>>(`/tasks/project/${projectId}?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
};

export const createTask = async (projectId: number, data: Partial<Task>) => {
    const response = await api.post<Task>(`/tasks/project/${projectId}`, data);
    return response.data;
};

export const updateTaskStatus = async (taskId: number, status: Task['status']) => {
    const response = await api.patch<Task>(`/tasks/${taskId}/status?status=${status}`);
    return response.data;
};

export const getAssignedTasks = async (page = 0, size = 20, sort = 'dueDate,asc') => {
    const response = await api.get<PaginatedResponse<Task>>(`/tasks/assigned?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
};
