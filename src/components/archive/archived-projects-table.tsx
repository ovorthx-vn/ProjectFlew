"use client"
import * as React from "react"
import Image from "next/image"
import { format } from "date-fns"

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

interface ArchivedProjectsTableProps {
  projects: Project[]
}

export function ArchivedProjectsTable({ projects }: ArchivedProjectsTableProps) {
  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Completion Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
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
                <TableCell className="text-right">
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    Completed
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}
