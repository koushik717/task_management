export interface User {
    id: number;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    last: boolean;
    first: boolean;
    numberOfElements: number;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    ownerEmail: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: string;
    assigneeEmail?: string;
    projectId: number;
    parentTaskId?: number;
    createdAt: string;
    updatedAt: string;
}
