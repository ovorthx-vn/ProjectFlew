"use client"

import * as React from "react"
import { format, differenceInDays, startOfMonth, endOfMonth, addMonths, eachMonthOfInterval, getYear } from "date-fns"

import type { Project } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ProjectsTimelineProps {
  projects: Project[]
}

const priorityColorClass: Record<Project['priority'], string> = {
    'Low': 'bg-blue-500',
    'Medium': 'bg-yellow-500',
    'High': 'bg-orange-500',
    'Urgent': 'bg-red-500',
}

export function ProjectsTimeline({ projects }: ProjectsTimelineProps) {
  const { months, totalDays, startDate } = React.useMemo(() => {
    if (projects.length === 0) {
      const now = new Date()
      const start = startOfMonth(now)
      const end = endOfMonth(addMonths(now, 2))
      return {
        months: eachMonthOfInterval({ start, end }),
        totalDays: differenceInDays(end, start) + 1,
        startDate: start,
      }
    }

    const allDates = projects.flatMap(p => [p.createdAt, p.dueDate])
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())))
    
    const start = startOfMonth(minDate)
    const end = endOfMonth(addMonths(maxDate, 1))
    
    const months = eachMonthOfInterval({ start, end })
    const totalDays = differenceInDays(end, start) + 1
    
    return { months, totalDays, startDate: start }
  }, [projects])

  const dayWidth = 4;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>
          A timeline of all projects from start to due date.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
            <TooltipProvider>
            <div className="relative" style={{ minWidth: `${totalDays * dayWidth}px`, height: `${projects.length * 40 + 40}px` }}>
                {/* Months Header */}
                <div className="sticky top-0 z-10 flex bg-background mb-2 h-10 items-end">
                    {months.map((month, i) => {
                        const daysInMonth = differenceInDays(endOfMonth(month), startOfMonth(month)) + 1;
                        const isFirstMonth = i === 0;
                        const displayYear = isFirstMonth || getYear(month) !== getYear(months[i - 1]);
                        return (
                            <div 
                                key={month.toString()} 
                                className="text-center text-sm font-semibold border-r"
                                style={{ width: `${daysInMonth * dayWidth}px` }}
                            >
                            {displayYear ? format(month, 'MMM yyyy') : format(month, 'MMM')}
                            </div>
                        );
                    })}
                </div>

                {/* Projects */}
                <div className="relative">
                {projects.map((project, index) => {
                    const left = differenceInDays(project.createdAt, startDate) * dayWidth
                    const width = (differenceInDays(project.dueDate, project.createdAt) + 1) * dayWidth
                    const top = index * 40;
                    
                    return (
                    <Tooltip key={project.id} delayDuration={100}>
                        <TooltipTrigger asChild>
                        <div
                            className="absolute h-8 rounded-lg flex items-center px-2 cursor-pointer"
                            style={{
                                top: `${top}px`,
                                left: `${left}px`,
                                width: `${width}px`,
                                backgroundColor: `hsl(var(--primary) / 0.2)`,
                                border: `1px solid hsl(var(--primary))`
                            }}
                        >
                            <div className={cn("absolute left-0 top-0 h-full w-1 rounded-l-lg", priorityColorClass[project.priority])} />
                            <span className="text-xs font-medium text-primary-foreground truncate pl-2">{project.name}</span>
                        </div>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p className="font-bold">{project.name}</p>
                        <p>Start: {format(project.createdAt, "MMM d, yyyy")}</p>
                        <p>Due: {format(project.dueDate, "MMM d, yyyy")}</p>
                        <p>Priority: {project.priority}</p>
                        </TooltipContent>
                    </Tooltip>
                    )
                })}
                </div>
            </div>
            </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
