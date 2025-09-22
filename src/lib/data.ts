import type { Project, User, Workspace } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Liam Johnson', avatar: 'https://picsum.photos/seed/user1/40/40', role: 'Frontend Developer', availability: 'Available' },
  { id: 'user-2', name: 'Olivia Smith', avatar: 'https://picsum.photos/seed/user2/40/40', role: 'Backend Developer', availability: 'Busy' },
  { id: 'user-3', name: 'Noah Williams', avatar: 'https://picsum.photos/seed/user3/40/40', role: 'UI/UX Designer', availability: 'Available' },
  { id: 'user-4', name: 'Emma Brown', avatar: 'https://picsum.photos/seed/user4/40/40', role: 'Project Manager', availability: 'Available' },
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
    completionNote: '',
    tasks: [
      { id: 'task-1-4', title: 'Setup database schema', status: 'Done', assigned: [users[1]], startDate: new Date('2024-07-10'), dueDate: new Date('2024-07-18'), dependencies: [] },
      { id: 'task-1-1', title: 'Design product page', status: 'Done', assigned: [users[2]], startDate: new Date('2024-07-15'), dueDate: new Date('2024-07-20'), dependencies: [] },
      { id: 'task-1-2', title: 'Develop authentication API', status: 'In Progress', assigned: [users[1]], startDate: new Date('2024-07-20'), dueDate: new Date('2024-07-28'), dependencies: ['task-1-4'] },
      { id: 'task-1-3', title: 'Implement checkout flow UI', status: 'In Progress', assigned: [users[0], users[2]], startDate: new Date('2024-07-25'), dueDate: new Date('2024-08-05'), dependencies: ['task-1-1', 'task-1-2'] },
      { id: 'task-1-5', title: 'Write e2e tests for checkout', status: 'To-Do', assigned: [], startDate: new Date('2024-08-06'), dueDate: new Date('2024-08-12'), dependencies: ['task-1-3'] },
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
    completionNote: '',
    tasks: [
      { id: 'task-2-1', title: 'User research and wireframing', status: 'Done', assigned: [users[2]], startDate: new Date('2024-07-01'), dueDate: new Date('2024-07-15'), dependencies: [] },
      { id: 'task-2-2', title: 'Create component library', status: 'In Progress', assigned: [users[0]], startDate: new Date('2024-07-16'), dueDate: new  Date('2024-07-28'), dependencies: ['task-2-1'] },
      { id: 'task-2-3', title: 'Implement fund transfer feature', status: 'To-Do', assigned: [], startDate: new Date('204-08-01'), dueDate: new Date('2024-08-15'), dependencies: ['task-2-2'] },
      { id: 'task-2-4', title: 'Performance testing on Android', status: 'Backlog', assigned: [], dependencies: ['task-2-3'] },
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
    completionNote: 'The project was a great success. The team delivered on time and the client was very happy with the final product. Key learning: real-time chart library performance needs to be monitored closely.',
    tasks: [
      { id: 'task-3-1', title: 'API for data aggregation', status: 'Done', assigned: [users[1]] },
      { id: 'task-3-2', title: 'Real-time chart components', status: 'Done', assigned: [users[0]] },
      { id: 'task-3-3', title: 'Dashboard layout design', status: 'Done', assigned: [users[2]] },
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
    completionNote: '',
    tasks: [
        { id: 'task-4-1', title: 'Define requirements', status: 'In Progress', assigned: [users[3]], startDate: new Date('2024-07-18'), dueDate: new Date('2024-07-25') }
    ],
  },
];

export const workspaces: Workspace[] = [
  {
    id: 'ws-1',
    subject: 'History of Ancient Rome',
    tutor: 'Dr. Eleanor Vance',
    dueDate: new Date('2024-10-15'),
    mainNote: '',
    quickNotes: [
      { id: 'qn-1-1', title: 'Key Emperors', content: 'Augustus, Trajan, Marcus Aurelius, Constantine.' },
      { id: 'qn-1-2', title: 'Punic Wars Summary', content: 'Series of three wars fought between Rome and Carthage.' },
      { id: 'qn-1-3', title: 'Fall of the Republic', content: 'Internal turmoil, civil wars, and the rise of Julius Caesar.' },
    ],
    documentLinks: [
      { id: 'doc-1-1', title: 'Syllabus', url: 'https://example.com/syllabus.pdf' },
      { id: 'doc-1-2', title: 'Lecture Slides', url: 'https://example.com/slides' },
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=lP5zbQEdAIk&list=RDlP5zbQEdAIk&start_radio=1',
  },
  {
    id: 'ws-2',
    subject: 'Quantum Physics I',
    tutor: 'Prof. Alistair Finch',
    dueDate: new Date('2024-11-05'),
    mainNote: '',
    quickNotes: [
      { id: 'qn-2-1', title: 'Schrödinger Equation', content: 'Describes how the quantum state of a quantum system changes with time.' },
      { id: 'qn-2-2', title: 'Heisenberg Uncertainty', content: 'A fundamental limit to the precision with which certain pairs of physical properties can be known.' },
    ],
    documentLinks: [
      { id: 'doc-2-1', title: 'Course Notes', url: 'https://example.com/notes.pdf' },
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=lP5zbQEdAIk&list=RDlP5zbQEdAIk&start_radio=1',
  },
];
