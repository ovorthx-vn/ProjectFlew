"use client"
import * as React from "react"
import Image from "next/image"
import { format } from "date-fns"
import { StickyNote } from "lucide-react"

import type { Project } from "@/lib/types"
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
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ArchivedProjectsTableProps {
  projects: Project[]
}

export function ArchivedProjectsTable({ projects }: ArchivedProjectsTableProps) {
  const [selectedNote, setSelectedNote] = React.useState<{title: string, note: string} | null>(null);

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Completion Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No archived projects found.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id} className="hover:bg-muted/50">
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
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    Completed
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {project.completionNote && (
                     <Dialog>
                      <DialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                            <StickyNote className="h-4 w-4" />
                            <span className="sr-only">View Completion Note</span>
                          </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Completion Note: {project.name}</DialogTitle>
                           <DialogDescription>
                            This note was added upon project completion.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="prose dark:prose-invert max-w-full rounded-md border bg-muted/50 p-4 whitespace-pre-wrap">
                          {project.completionNote}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}
