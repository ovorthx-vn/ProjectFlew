"use client"

import * as React from "react"
import { format, differenceInDays, startOfMonth, endOfMonth, addMonths, eachMonthOfInterval, getYear, differenceInCalendarDays, eachDayOfInterval } from "date-fns"

import type { Project, Task } from "@/lib/types"
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

const taskPriorityColorClass: Record<Task['priority'], string> = {
    'Low': 'bg-blue-400',
    'Medium': 'bg-yellow-400',
    'High': 'bg-orange-400',
    'Urgent': 'bg-red-400',
}


export function ProjectsTimeline({ projects }: ProjectsTimelineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  const { months, totalDays, startDate, endDate, projectLayouts } = React.useMemo(() => {
    if (projects.length === 0) {
      const now = new Date()
      const start = startOfMonth(now)
      const end = endOfMonth(addMonths(now, 2))
      return {
        months: eachMonthOfInterval({ start, end }),
        totalDays: differenceInCalendarDays(end, start) + 1,
        startDate: start,
        endDate: end,
        projectLayouts: [],
      }
    }

    const allDates = projects.flatMap(p => [p.startDate, p.dueDate, ...p.tasks.map(t => t.dueDate).filter(Boolean) as Date[]])
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())))
    
    const start = startOfMonth(minDate)
    const end = endOfMonth(addMonths(maxDate, 1))
    
    const months = eachMonthOfInterval({ start, end })
    const totalDays = differenceInCalendarDays(end, start) + 1
    
    let currentTop = 0;
    const projectLayouts = projects.map(project => {
        const top = currentTop;
        const tasksWithDueDate = project.tasks.filter(t => t.dueDate);
        const height = 40 + (tasksWithDueDate.length * 32);
        currentTop += height + 20; // 20 for margin
        return { ...project, top, height, tasksWithDueDate };
    });

    return { months, totalDays, startDate: start, endDate: end, projectLayouts }
  }, [projects])

  React.useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(entries => {
        if (entries[0]) {
          setContainerWidth(entries[0].contentRect.width);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const dayWidth = containerWidth > 0 ? containerWidth / totalDays : 0;
  const totalHeight = projectLayouts.reduce((acc, p) => acc + p.height + 20, 40);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>
          A timeline of all projects from start to due date, including tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-2 overflow-x-auto">
        <div ref={containerRef} className="w-full min-w-[800px]">
            {containerWidth > 0 && (
                <TooltipProvider>
                <div className="relative" style={{ height: `${totalHeight}px` }}>
                    {/* Months Header */}
                    <div className="sticky top-0 z-10 flex bg-background mb-2 h-10 items-end">
                        {months.map((month, i) => {
                            const monthStart = startOfMonth(month);
                            const monthEnd = endOfMonth(month);
                            const daysInMonth = differenceInCalendarDays(monthEnd, monthStart) + 1;
                            const isFirstMonth = i === 0;
                            const displayYear = isFirstMonth || getYear(month) !== getYear(months[i - 1]);
                            return (
                                <div 
                                    key={month.toString()} 
                                    className="text-center text-xs font-semibold border-r"
                                    style={{ width: `${daysInMonth * dayWidth}px` }}
                                >
                                {displayYear ? format(month, 'MMM yyyy') : format(month, 'MMM')}
                                </div>
                            );
                        })}
                    </div>

                    {/* Projects and Tasks */}
                    <div className="relative">
                    {projectLayouts.map((project) => {
                        const projectLeft = differenceInCalendarDays(project.startDate, startDate) * dayWidth
                        const projectWidth = (differenceInCalendarDays(project.dueDate, project.startDate) + 1) * dayWidth
                        
                        return (
                        <div key={project.id} style={{ top: `${project.top}px`}} className="absolute w-full">
                            {/* Project Bar */}
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                <div
                                    className="absolute h-8 rounded-lg flex items-center px-2 cursor-pointer"
                                    style={{
                                        left: `${projectLeft}px`,
                                        width: `${Math.max(projectWidth, 0)}px`,
                                        backgroundColor: `hsl(var(--primary) / 0.2)`,
                                        border: `1px solid hsl(var(--primary))`
                                    }}
                                >
                                    <div className={cn("absolute left-0 top-0 h-full w-1 rounded-l-lg", priorityColorClass[project.priority])} />
                                    <span className="text-xs font-medium text-foreground truncate pl-2">{project.name}</span>
                                </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-bold">{project.name}</p>
                                    <p>Start: {format(project.startDate, "MMM d, yyyy")}</p>
                                    <p>Due: {format(project.dueDate, "MMM d, yyyy")}</p>
                                    <p>Priority: {project.priority}</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Tasks */}
                            {project.tasksWithDueDate.map((task, taskIndex) => {
                                const taskLeft = differenceInCalendarDays(task.dueDate!, startDate) * dayWidth;
                                const taskTop = 40 + taskIndex * 32;

                                return (
                                    <React.Fragment key={task.id}>
                                         {/* Connecting lines */}
                                        <div 
                                            className="absolute bg-border" 
                                            style={{
                                                left: `${projectLeft + 10}px`,
                                                top: '28px',
                                                width: '1px',
                                                height: `${taskTop - 28}px`,
                                            }}
                                        />
                                         <div 
                                            className="absolute bg-border" 
                                            style={{
                                                left: `${projectLeft + 10}px`,
                                                top: `${taskTop + 4}px`,
                                                width: `${taskLeft - (projectLeft + 10)}px`,
                                                height: '1px',
                                            }}
                                        />

                                        <Tooltip delayDuration={100}>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className="absolute h-6 rounded-md flex items-center px-2 cursor-pointer"
                                                    style={{
                                                        top: `${taskTop}px`,
                                                        left: `${taskLeft}px`,
                                                        width: `100px`,
                                                        backgroundColor: `hsl(var(--secondary))`
                                                    }}
                                                >
                                                    <div className={cn("absolute left-0 top-0 h-full w-1 rounded-l-md", taskPriorityColorClass[task.priority])} />
                                                    <span className="text-xs text-muted-foreground truncate pl-1">{task.title}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="font-bold">{task.title}</p>
                                                <p>Due: {format(task.dueDate!, "MMM d, yyyy")}</p>
                                                <p>Status: {task.status}</p>
                                                <p>Priority: {task.priority}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </React.Fragment>
                                )
                            })}
                        </div>
                        )
                    })}
                    </div>
                </div>
                </TooltipProvider>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
