"use client"

import * as React from 'react';
import type { Project, User } from '@/lib/types';
import { projects as initialProjects } from "@/lib/data"
import { useUser } from './user-context';

type ProjectContextType = {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'tasks' | 'progress' | 'mindMap'>) => void;
  updateProject: (project: Project) => void;
};

const ProjectContext = React.createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { users } = useUser();
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    if(users && users.length > 0) {
      const projectsWithUsers = initialProjects.map(p => ({
        ...p,
        members: p.members.map(m => users.find(u => u.id === m.id) || m),
        tasks: p.tasks.map(t => ({
          ...t,
          assigned: t.assigned.map(a => users.find(u => u.id === a.id) || a)
        }))
      }));
      setProjects(projectsWithUsers);
    }
  }, [users]);


  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'tasks' | 'progress' | 'mindMap'>) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date(),
      tasks: [],
      progress: 0,
      mindMap: '',
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = React.useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
