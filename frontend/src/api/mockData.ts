export const MOCK_USER = {
    id: 1,
    firstname: 'Demo',
    lastname: 'User',
    email: 'demo@enterprise.com',
    role: 'USER',
};

export const MOCK_PROJECTS = [
    {
        id: 101,
        name: 'Website Redesign',
        description: 'Overhaul the corporate website with new branding.',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        status: 'IN_PROGRESS',
        progress: 65,
    },
    {
        id: 102,
        name: 'Mobile App Launch',
        description: 'Launch the new iOS and Android apps.',
        startDate: '2025-02-15',
        endDate: '2025-06-30',
        status: 'PLANNING',
        progress: 20,
    },
    {
        id: 103,
        name: 'Q3 Marketing Campaign',
        description: 'Execute the global marketing strategy for Q3.',
        startDate: '2025-07-01',
        endDate: '2025-09-30',
        status: 'COMPLETED',
        progress: 100,
    },
];

export const MOCK_TASKS = [
    {
        id: 1001,
        title: 'Design Landing Page',
        description: 'Create high-fidelity mockups for the new homepage.',
        status: 'DONE',
        priority: 'HIGH',
        projectId: 101,
        assigneeId: 1,
        dueDate: '2025-01-15',
    },
    {
        id: 1002,
        title: 'Develop API Integration',
        description: 'Connect frontend to the new backend API endpoints.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        projectId: 101,
        assigneeId: 1,
        dueDate: '2025-02-01',
    },
    {
        id: 1003,
        title: 'User Testing',
        description: 'Conduct usability sessions with 5 beta users.',
        status: 'TODO',
        priority: 'HIGH',
        projectId: 102,
        assigneeId: 1,
        dueDate: '2025-03-01',
    },
    {
        id: 1004,
        title: 'Write Documentation',
        description: 'Document the new feature set for the release.',
        status: 'TODO',
        priority: 'LOW',
        projectId: 102,
        assigneeId: 1,
        dueDate: '2025-06-15',
    },
];

export const MOCK_STATS = {
    totalProjects: 12,
    activeProjects: 4,
    completedProjects: 8,
    totalTasks: 45,
    pendingTasks: 18,
    completedTasks: 27,
};
