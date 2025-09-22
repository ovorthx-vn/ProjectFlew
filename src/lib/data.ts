import type { Project, User } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Liam Johnson', avatar: 'https://picsum.photos/seed/user1/40/40', role: 'Frontend Developer', availability: 'Available' },
  { id: 'user-2', name: 'Olivia Smith', avatar: 'https://picsum.photos/seed/user2/40/40', role: 'Backend Developer', availability: 'Busy' },
  { id: 'user-3', name: 'Noah Williams', avatar: 'https://picsum.photos/seed/user3/40/40', role: 'UI/UX Designer', availability: 'Available' },
  { id: 'user-4', name: 'Emma Brown', avatar: 'https://picsum.photos/seed/user4/40/40', role: 'Project Manager', availability: 'On Vacation' },
  { id: 'user-5', name: 'Ava Jones', avatar: 'https://picsum.photos/seed/user5/40/40', role: 'QA Tester', availability: 'Available' },
];

const ecommerceMindMap = `- E-commerce Platform
	- User Authentication
		- Login/Register pages
		- Password reset
	- Product Catalog
		- Product page design
		- Search and filtering
		- Categories
	- Shopping Cart
		- Add to cart functionality
		- View cart
	- Checkout
		- Shipping information
		- Payment integration
			- Stripe
			- PayPal
	- Backend
		- Database schema
		- REST APIs`;

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'E-commerce Platform',
    startDate: new Date('2024-03-01'),
    dueDate: new Date('2024-12-15'),
    progress: 75,
    priority: 'High',
    members: [users[0], users[1], users[2]],
    notes: 'Initial notes for the e-commerce platform project.',
    mindMap: ecommerceMindMap,
    tasks: [
      { id: 'task-1-1', title: 'Design product page', status: 'Done', assigned: [users[2]], startDate: new Date('2024-07-15'), dueDate: new Date('2024-07-20'), priority: 'High' },
      { id: 'task-1-2', title: 'Develop authentication API', status: 'In Progress', assigned: [users[1]], startDate: new Date('2024-07-20'), dueDate: new Date('2024-07-28'), priority: 'High' },
      { id: 'task-1-3', title: 'Implement checkout flow UI', status: 'In Progress', assigned: [users[0], users[2]], startDate: new Date('2024-07-25'), dueDate: new Date('2024-08-05'), priority: 'Medium' },
      { id: 'task-1-4', title: 'Setup database schema', status: 'Done', assigned: [users[1]], startDate: new Date('2024-07-10'), dueDate: new Date('2024-07-18'), priority: 'High' },
      { id: 'task-1-5', title: 'Write e2e tests for checkout', status: 'To-Do', assigned: [], priority: 'Medium' },
    ],
  },
  {
    id: 'proj-2',
    name: 'Mobile Banking App',
    startDate: new Date('2024-05-10'),
    dueDate: new Date('2025-02-28'),
    progress: 40,
    priority: 'Urgent',
    members: [users[0], users[3], users[4]],
    notes: 'Focus on security and performance.',
    mindMap: '',
    tasks: [
      { id: 'task-2-1', title: 'User research and wireframing', status: 'Done', assigned: [users[2]], startDate: new Date('2024-07-01'), dueDate: new Date('2024-07-15'), priority: 'Urgent' },
      { id: 'task-2-2', title: 'Create component library', status: 'In Progress', assigned: [users[0]], startDate: new Date('2024-07-16'), dueDate: new Date('2024-07-28'), priority: 'High' },
      { id: 'task-2-3', title: 'Implement fund transfer feature', status: 'To-Do', assigned: [], startDate: new Date('2024-08-01'), dueDate: new Date('2024-08-15'), priority: 'Urgent' },
      { id: 'task-2-4', title: 'Performance testing on Android', status: 'Backlog', assigned: [], priority: 'Medium' },
    ],
  },
  {
    id: 'proj-3',
    name: 'SaaS Analytics Dashboard',
    startDate: new Date('2024-06-20'),
    dueDate: new Date('2025-01-20'),
    progress: 100,
    priority: 'Medium',
    members: [users[1], users[2], users[4]],
    mindMap: '',
    tasks: [
      { id: 'task-3-1', title: 'API for data aggregation', status: 'Done', assigned: [users[1]], priority: 'High' },
      { id: 'task-3-2', title: 'Real-time chart components', status: 'Done', assigned: [users[0]], priority: 'Medium' },
      { id: 'task-3-3', title: 'Dashboard layout design', status: 'Done', assigned: [users[2]], priority: 'Medium' },
    ],
  },
  {
    id: 'proj-4',
    name: 'Internal CRM Tool',
    startDate: new Date('2024-08-01'),
    dueDate: new Date('2024-11-30'),
    progress: 15,
    priority: 'Low',
    members: [users[0], users[4]],
    mindMap: '',
    tasks: [
        { id: 'task-4-1', title: 'Define requirements', status: 'In Progress', assigned: [users[3]], startDate: new Date('2024-07-18'), dueDate: new Date('2024-07-25'), priority: 'Low' }
    ],
  },
];
