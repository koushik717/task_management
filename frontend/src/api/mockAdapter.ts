import type { AxiosInstance } from 'axios';
import { MOCK_USER, MOCK_PROJECTS, MOCK_TASKS, MOCK_STATS } from './mockData';

export const setupMockAdapter = (api: AxiosInstance) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Stateful storage for the session
    let innerProjects = [...MOCK_PROJECTS];
    let innerTasks = [...MOCK_TASKS];
    let innerStats = { ...MOCK_STATS };

    const originalGet = api.get;
    const originalPost = api.post;

    // Override GET
    api.get = (async (url: string, config?: any) => {
        console.log(`[MOCK API] GET ${url}`);
        await delay(400); // Simulate network latency

        if (url.includes('/auth/profile') || url.includes('/users/me')) {
            return { data: MOCK_USER, status: 200 };
        }

        // Login Endpoint
        if (url.includes('/auth/authenticate') || url.includes('/auth/login')) {
            return {
                data: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vQGVudGVycHJpc2UuY29tIiwibmFtZSI6IkRlbW8gVXNlciIsInJvbGUiOiJVU0VSIiwiZXhwIjo0MDk5NjgwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', // Valid JWT exp 2099
                    ...MOCK_USER
                },
                status: 200
            };
        }
        if (url.includes('/projects/stats')) {
            return { data: MOCK_STATS, status: 200 };
        }
        if (url.includes('/projects')) {
            return {
                data: {
                    content: innerProjects,
                    totalElements: innerProjects.length,
                    totalPages: 1,
                    size: 10,
                    number: 0
                },
                status: 200
            };
        }
        // Specific Project Tasks
        if (url.match(/\/tasks\/project\/\d+/)) {
            const projectId = parseInt(url.split('/').pop()?.split('?')[0] || '0');
            const projectTasks = innerTasks.filter(t => t.projectId === projectId || (url.includes('assigned') && t.assigneeId === 1));
            return {
                data: {
                    content: projectTasks,
                    totalElements: projectTasks.length,
                    totalPages: 1,
                    size: 10,
                    number: 0
                },
                status: 200
            };
        }
        if (url.includes('/tasks') || url.includes('/tasks/assigned')) {
            return {
                data: {
                    content: innerTasks,
                    totalElements: innerTasks.length,
                    totalPages: 1,
                    size: 10,
                    number: 0
                },
                status: 200
            };
        }

        // Fallback to real API if no mock match (optional)
        return originalGet(url, config);
    }) as any;

    // Override POST
    api.post = (async (url: string, data?: any, config?: any) => {
        console.log(`[MOCK API] POST ${url}`, data);
        await delay(600);

        if (url.includes('/auth/authenticate') || url.includes('/auth/login')) {
            return {
                data: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vQGVudGVycHJpc2UuY29tIiwibmFtZSI6IkRlbW8gVXNlciIsInJvbGUiOiJVU0VSIiwiZXhwIjo0MDk5NjgwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                    user: MOCK_USER,
                },
                status: 200,
            };
        }
        if (url.includes('/auth/register')) {
            return {
                data: {
                    token: 'mock-jwt-token-registered',
                    user: MOCK_USER,
                },
                status: 200,
            };
        }

        // Optimistic create for projects/tasks (ephemeral)
        if (url.includes('/projects')) {
            const newProject = {
                ...data,
                id: Math.floor(Math.random() * 10000) + 200, // Random ID > 200
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'PLANNING',
                progress: 0
            };
            innerProjects.unshift(newProject);
            innerStats.totalProjects++;
            innerStats.activeProjects++;
            return { data: newProject, status: 201 };
        }

        // Match /tasks/project/:projectId
        if (url.match(/\/tasks\/project\/\d+/)) {
            const projectId = parseInt(url.split('/').pop() || '0');
            const newTask = {
                ...data,
                id: Math.floor(Math.random() * 10000) + 2000,
                status: 'TODO',
                projectId: projectId,
                assigneeId: 1,
                dueDate: new Date().toISOString()
            };
            innerTasks.unshift(newTask);
            innerStats.totalTasks++;
            innerStats.pendingTasks++;
            return { data: newTask, status: 201 };
        }

        // PATCH Task Status
        if (url.match(/\/tasks\/\d+\/status/)) {
            // Extract Status from query param
            const statusMatch = url.match(/status=([^&]+)/);
            const status = statusMatch ? statusMatch[1] : 'TODO';
            const taskIdMatch = url.match(/\/tasks\/(\d+)\/status/);
            if (taskIdMatch && taskIdMatch[1]) {
                const tId = parseInt(taskIdMatch[1]);
                const task = innerTasks.find(t => t.id === tId);
                if (task) task.status = status;
            }
            return { data: { status }, status: 200 };
        }

        if (url.includes('/tasks')) {
            const newTask = {
                ...data,
                id: Math.floor(Math.random() * 10000) + 2000,
                status: 'TODO'
            };
            innerTasks.unshift(newTask);
            innerStats.totalTasks++;
            innerStats.pendingTasks++;
            return { data: newTask, status: 201 };
        }

        return originalPost(url, data, config);
    }) as any;

    // Add PUT/DELETE if needed, for now mainly read-only demo
    console.log('✨ MOCK API ADAPTER ENABLED ✨');
};
