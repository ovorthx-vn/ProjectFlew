"use client"

import * as React from 'react';
import type { Workspace } from '@/lib/types';
import { workspaces as initialWorkspaces } from "@/lib/data"

type WorkspaceContextType = {
  workspaces: Workspace[];
  addWorkspace: (workspace: Omit<Workspace, 'id' | 'mainNote' | 'quickNotes' | 'documentLinks'>) => void;
  updateWorkspace: (workspace: Workspace) => void;
};

const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(initialWorkspaces);

  const addWorkspace = (workspace: Omit<Workspace, 'id' | 'mainNote' | 'quickNotes' | 'documentLinks'>) => {
    const newIdSuffix = workspaces.length + 1;
    const newWorkspace: Workspace = {
      ...workspace,
      id: `ws-${newIdSuffix}`,
      mainNote: `Start your notes here for ${workspace.subject}...`,
      quickNotes: [
        { id: `qn-${newIdSuffix}-1`, title: 'Key Topics', content: '- Topic 1\n- Topic 2\n- Topic 3' },
        { id: `qn-${newIdSuffix}-2`, title: 'Resources', content: '- Book/Chapter\n- Website URL' },
        { id: `qn-${newIdSuffix}-3`, title: 'Action Items', content: '- [ ] Read chapter 5\n- [ ] Review lecture notes' },
      ],
      documentLinks: [],
      youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
    };
    setWorkspaces(prev => [newWorkspace, ...prev]);
  };

  const updateWorkspace = (updatedWorkspace: Workspace) => {
    setWorkspaces(prev => prev.map(w => w.id === updatedWorkspace.id ? updatedWorkspace : w));
  };

  return (
    <WorkspaceContext.Provider value={{ workspaces, addWorkspace, updateWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = React.useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
