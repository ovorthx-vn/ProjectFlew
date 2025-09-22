import type { Project, User } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Liam Johnson', avatar: 'https://picsum.photos/seed/user1/40/40', role: 'Frontend Developer', availability: 'Available' },
  { id: 'user-2', name: 'Olivia Smith', avatar: 'https://picsum.photos/seed/user2/40/40', role: 'Backend Developer', availability: 'Busy' },
  { id: 'user-3', name: 'Noah Williams', avatar: 'https://picsum.photos/seed/user3/40/40', role: 'UI/UX Designer', availability: 'Available' },
  { id: 'user-4', name: 'Emma Brown', avatar: 'https://picsum.photos/seed/user4/40/40', role: 'Project Manager', availability: 'On Vacation' },
  { id: 'user-5', name: 'Ava Jones', avatar: 'https://picsum.photos/seed/user5/40/40', role: 'QA Tester', availability: 'Available' },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'E-commerce Platform',
    dueDate: new Date('2024-12-15'),
    progress: 75,
    members: [users[0], users[1], users[2]],
    notes: 'Initial notes for the e-commerce platform project.',
    mindMapUrl: 'https://picsum.photos/seed/mindmap1/800/600',
    createdAt: new Date('2024-03-01'),
    tasks: [
      { id: 'task-1-1', title: 'Design product page', status: 'Done', assigned: [users[2]], dueDate: new Date('2024-07-20') },
      { id: 'task-1-2', title: 'Develop authentication API', status: 'In Progress', assigned: [users[1]], dueDate: new Date('2024-07-25') },
      { id: 'task-1-3', title: 'Implement checkout flow UI', status: 'In Progress', assigned: [users[0], users[2]], dueDate: new Date('2024-08-01') },
      { id: 'task-1-4', title: 'Setup database schema', status: 'Done', assigned: [users[1]] },
      { id: 'task-1-5', title: 'Write e2e tests for checkout', status: 'To-Do', assigned: [] },
    ],
  },
  {
    id: 'proj-2',
    name: 'Mobile Banking App',
    dueDate: new Date('2025-02-28'),
    progress: 40,
    members: [users[0], users[3], users[4]],
    createdAt: new Date('2024-05-10'),
    notes: 'Focus on security and performance.',
    tasks: [
      { id: 'task-2-1', title: 'User research and wireframing', status: 'Done', assigned: [users[2]] },
      { id: 'task-2-2', title: 'Create component library', status: 'In Progress', assigned: [users[0]], dueDate: new Date('2024-07-22') },
      { id: 'task-2-3', title: 'Implement fund transfer feature', status: 'To-Do', assigned: [], dueDate: new Date('2024-08-10') },
      { id: 'task-2-4', title: 'Performance testing on Android', status: 'Backlog', assigned: [] },
    ],
  },
  {
    id: 'proj-3',
    name: 'SaaS Analytics Dashboard',
    dueDate: new Date('2025-01-20'),
    progress: 100,
    members: [users[1], users[2], users[4]],
    createdAt: new Date('2024-06-20'),
    mindMapUrl: 'https://picsum.photos/seed/mindmap1/800/600',
    tasks: [
      { id: 'task-3-1', title: 'API for data aggregation', status: 'Done', assigned: [users[1]] },
      { id: 'task-3-2', title: 'Real-time chart components', status: 'Done', assigned: [users[0]] },
      { id: 'task-3-3', title: 'Dashboard layout design', status: 'Done', assigned: [users[2]] },
    ],
  },
  {
    id: 'proj-4',
    name: 'Internal CRM Tool',
    dueDate: new Date('2024-11-30'),
    progress: 15,
    members: [users[0], users[4]],
    createdAt: new Date('2024-08-01'),
    tasks: [
        { id: 'task-4-1', title: 'Define requirements', status: 'In Progress', assigned: [users[3]], dueDate: new Date('2024-07-22') }
    ],
  },
];
