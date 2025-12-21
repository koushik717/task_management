import api from './axios';
import type { Project, PaginatedResponse } from '../types';

export const getProjects = async (page = 0, size = 10, sort = 'createdAt,desc') => {
    const response = await api.get<PaginatedResponse<Project>>(`/projects?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
};

export const createProject = async (name: string, description: string) => {
    const response = await api.post<Project>('/projects', { name, description });
    return response.data;
};
