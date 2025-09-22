export type User = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  availability: 'Available' | 'Busy' | 'On Vacation';
};

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type Task = {
  id: string;
  title: string;
  status: 'To-Do' | 'In Progress' | 'Done' | 'Backlog';
  assigned: User[];
  notes?: string;
  dueDate?: Date;
};

export type Project = {
  id: string;
  name: string;
  dueDate: Date;
  progress: number;
  priority: Priority;
  tasks: Task[];
  members: User[];
  notes?: string;
  mindMap?: string;
  createdAt: Date;
};
