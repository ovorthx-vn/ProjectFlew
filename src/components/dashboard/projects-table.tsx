"use client"
import * as React from "react"
import Image from "next/image"
import { format } from "date-fns"
import { ChevronDown, ChevronRight, FolderKanban, MoreHorizontal } from "lucide-react"

import type { Project, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MindMapDialog } from "./mind-map-dialog"
import { NotesPopover } from "./notes-popover"
import { TasksList } from "./tasks-list"
import { Badge } from "../ui/badge"

interface ProjectsTableProps {
  projects: Project[]
  users: User[]
  onUpdateProject: (project: Project) => void
}

export function ProjectsTable({ projects, users, onUpdateProject }: ProjectsTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())
  const [activeMindMap, setActiveMindMap] = React.useState<Project | null>(null)

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedRows(newSet)
  }

  const handleNoteSave = (project: Project, newNotes: string) => {
    onUpdateProject({ ...project, notes: newNotes });
  }

  const handleTaskUpdate = (projectId: string, updatedTasks: Project['tasks']) => {
    const projectToUpdate = projects.find(p => p.id === projectId);
    if(projectToUpdate) {
        const newProgress = Math.round((updatedTasks.filter(t => t.status === 'Done').length / updatedTasks.length) * 100) || 0;
        onUpdateProject({ ...projectToUpdate, tasks: updatedTasks, progress: newProgress });
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-[150px]">Progress</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No projects found.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <React.Fragment key={project.id}>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRow(project.id)}
                          className="h-8 w-8"
                        >
                          {expandedRows.has(project.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {project.members.map((member) => (
                            <Tooltip key={member.id}>
                              <TooltipTrigger asChild>
                                <Image
                                  src={member.avatar}
                                  alt={member.name}
                                  width={24}
                                  height={24}
                                  className="rounded-full border-2 border-card"
                                />
                              </TooltipTrigger>
                              <TooltipContent>{member.name}</TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{format(project.dueDate, "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Progress value={project.progress} className="h-2" />
                           <span className="text-sm text-muted-foreground">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <NotesPopover 
                            title={`Notes for ${project.name}`} 
                            notes={project.notes} 
                            onSave={(newNotes) => handleNoteSave(project, newNotes)}
                        />
                        {project.mindMapUrl && 
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveMindMap(project)}>
                                <FolderKanban className="h-4 w-4" />
                            </Button>
                        }
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(project.id) && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="p-4 bg-muted/50 rounded-md">
                            <TasksList 
                              tasks={project.tasks} 
                              users={users} 
                              projectUsers={project.members}
                              onTasksUpdate={(updatedTasks) => handleTaskUpdate(project.id, updatedTasks)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
       {activeMindMap && (
        <MindMapDialog
          isOpen={!!activeMindMap}
          onClose={() => setActiveMindMap(null)}
          projectName={activeMindMap.name}
          mindMapUrl={activeMindMap.mindMapUrl}
        />
      )}
    </Card>
  )
}
