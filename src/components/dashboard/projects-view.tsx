"use client"

import * as React from "react"
import { PlusCircle } from "lucide-react"

import type { Project, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateProjectDialog } from "./create-project-dialog"
import { ProjectsTable } from "./projects-table"
import { ProjectsTimeline } from "./projects-timeline"

interface ProjectsViewProps {
  projects: Project[]
  users: User[]
  onAddProject: (project: Omit<Project, 'id' | 'tasks' | 'progress' | 'mindMap'>) => void
  onUpdateProject: (project: Project) => void;
}

export function ProjectsView({ projects, users, onAddProject, onUpdateProject }: ProjectsViewProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
           <h2 className="text-2xl font-headline tracking-tight">Your Projects</h2>
           <p className="text-muted-foreground">An overview of all your ongoing projects.</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2" />
          New Project
        </Button>
      </div>
      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onAddProject={onAddProject}
        users={users}
      />
      <Tabs defaultValue="table" className="pt-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <ProjectsTable projects={projects} users={users} onUpdateProject={onUpdateProject} />
        </TabsContent>
        <TabsContent value="timeline" className="overflow-x-auto">
          <ProjectsTimeline projects={projects} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

    