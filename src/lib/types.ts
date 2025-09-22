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
  startDate?: Date;
  dueDate?: Date;
  priority: Priority;
};

export type Project = {
  id: string;
  name: string;
  startDate: Date;
  dueDate: Date;
  progress: number;
  priority: Priority;
  tasks: Task[];
  members: User[];
  notes?: string;
  mindMap?: string;
};
