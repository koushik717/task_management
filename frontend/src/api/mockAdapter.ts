import { AxiosInstance } from 'axios';
import { MOCK_USER, MOCK_PROJECTS, MOCK_TASKS, MOCK_STATS } from './mockData';

export const setupMockAdapter = (api: AxiosInstance) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const originalGet = api.get;
    const originalPost = api.post;

    // Override GET
    api.get = async (url: string, config?: any) => {
        console.log(`[MOCK API] GET ${url}`);
        await delay(400); // Simulate network latency

        if (url.includes('/auth/profile') || url.includes('/users/me')) {
            return { data: MOCK_USER, status: 200 };
        }
        if (url.includes('/projects/stats')) {
            return { data: MOCK_STATS, status: 200 };
        }
        if (url.includes('/projects')) {
            return { data: MOCK_PROJECTS, status: 200 };
        }
        if (url.includes('/tasks')) {
            return { data: MOCK_TASKS, status: 200 };
        }

        // Fallback to real API if no mock match (optional)
        return originalGet(url, config);
    };

    // Override POST
    api.post = async (url: string, data?: any, config?: any) => {
        console.log(`[MOCK API] POST ${url}`, data);
        await delay(600);

        if (url.includes('/auth/authenticate') || url.includes('/auth/login')) {
            return {
                data: {
                    token: 'mock-jwt-token-for-demo-mode',
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
            return { data: { ...data, id: Math.floor(Math.random() * 1000) }, status: 201 };
        }
        if (url.includes('/tasks')) {
            return { data: { ...data, id: Math.floor(Math.random() * 1000) }, status: 201 };
        }

        return originalPost(url, data, config);
    };

    // Add PUT/DELETE if needed, for now mainly read-only demo
    console.log('✨ MOCK API ADAPTER ENABLED ✨');
};
