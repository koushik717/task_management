import axios, { AxiosError } from 'axios';
import { setupMockAdapter } from './mockAdapter';

interface ApiErrorResponse {
    message: string;
    status: number;
    timestamp: string;
    path: string;
    requestId: string;
    errors?: Record<string, string>;
}

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Initialize Mock Adapter only if explicitly requested
if (import.meta.env.VITE_USE_MOCKS === 'true') {
    setupMockAdapter(api);
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        // console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
            const { status, data } = error.response;
            console.error(`[API Error] ${status} ${error.config?.url}:`, data?.message || error.message);

            if (status === 401) {
                localStorage.removeItem('token');
                // Dispatch event for AuthContext to handle redirect/state clear
                window.dispatchEvent(new Event('auth-unauthorized'));
            }
        } else if (error.request) {
            console.error('[API Network Error]: No response received');
        } else {
            console.error('[API Error]:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
