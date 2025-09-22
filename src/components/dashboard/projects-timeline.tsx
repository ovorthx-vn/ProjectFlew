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
        totalDays: differenceInDays(end, start),
        startDate: start,
      }
    }

    const allDates = projects.flatMap(p => [p.createdAt, p.dueDate])
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())))
    
    const start = startOfMonth(minDate)
    const end = endOfMonth(maxDate)
    
    const months = eachMonthOfInterval({ start, end })
    const totalDays = differenceInDays(end, start)
    
    return { months, totalDays, startDate: start }
  }, [projects])

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
            <div className="relative" style={{ minWidth: `${totalDays * 3}px` }}>
                {/* Months Header */}
                <div className="sticky top-0 z-10 flex bg-background mb-2">
                    {months.map((month, i) => {
                        const daysInMonth = differenceInDays(endOfMonth(month), startOfMonth(month)) + 1;
                        const isFirstMonth = i === 0;
                        const displayYear = isFirstMonth || getYear(month) !== getYear(months[i - 1]);
                        return (
                            <div 
                                key={month.toString()} 
                                className="text-center text-sm font-semibold border-r"
                                style={{ width: `${daysInMonth * 3}px` }}
                            >
                            {displayYear ? format(month, 'MMM yyyy') : format(month, 'MMM')}
                            </div>
                        );
                    })}
                </div>

                {/* Projects */}
                <div className="space-y-2">
                {projects.map((project, index) => {
                    const left = differenceInDays(project.createdAt, startDate) * 3
                    const width = differenceInDays(project.dueDate, project.createdAt) * 3
                    
                    return (
                    <Tooltip key={project.id} delayDuration={100}>
                        <TooltipTrigger asChild>
                        <div
                            className="relative h-8 rounded-lg flex items-center px-2 cursor-pointer"
                            style={{
                            position: "absolute",
                            top: `${index * 40}px`,
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
                <div style={{ height: `${projects.length * 40}px` }}></div>
            </div>
            </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
