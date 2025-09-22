"use client"

import * as React from "react"
import Image from "next/image"
import { format, differenceInCalendarDays, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, eachMonthOfInterval, getYear } from "date-fns"

import type { Project, Task, User } from "@/lib/types"
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

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

interface ItemLayout {
  id: string
  level: number
  top: number
  startDate: Date
  dueDate: Date
}

// Function to calculate the vertical layout of tasks to avoid overlaps
function calculateLayout(tasks: Task[]): Map<string, ItemLayout> {
  const layout = new Map<string, ItemLayout>();
  const levels: Date[] = []; // Stores the end date of the last task in each level

  const sortedTasks = tasks
    .filter(t => t.startDate && t.dueDate)
    .sort((a, b) => a.startDate!.getTime() - b.startDate!.getTime());

  sortedTasks.forEach(task => {
    let assignedLevel = -1;

    // Find the first level where this task can fit
    for (let i = 0; i < levels.length; i++) {
      if (levels[i] < task.startDate!) {
        assignedLevel = i;
        break;
      }
    }

    // If no level found, create a new one
    if (assignedLevel === -1) {
      assignedLevel = levels.length;
      levels.push(task.dueDate!);
    } else {
        // Update the level's end date
        levels[assignedLevel] = task.dueDate!;
    }
    
    layout.set(task.id, {
      id: task.id,
      level: assignedLevel,
      top: assignedLevel * 36, // 36px per level (28px for bar + 8px margin)
      startDate: task.startDate!,
      dueDate: task.dueDate!,
    });
  });
  
  return layout;
}


export function ProjectsTimeline({ projects }: ProjectsTimelineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { months, totalDays, startDate, endDate, projectLayouts, totalHeight } = React.useMemo(() => {
    if (projects.length === 0) {
      const now = new Date();
      const start = startOfMonth(now);
      const end = endOfMonth(addMonths(now, 2));
      return {
        months: eachMonthOfInterval({ start, end }),
        totalDays: differenceInCalendarDays(end, start) + 1,
        startDate: start,
        endDate: end,
        projectLayouts: [],
        totalHeight: 100,
      };
    }

    let allDates = projects.flatMap(p => [
        p.startDate, p.dueDate
    ]);

    const allTaskDates = projects.flatMap(p => p.tasks.flatMap(t => [t.startDate, t.dueDate])).filter(Boolean) as Date[]
    if (allTaskDates.length > 0) {
        allDates = [...allDates, ...allTaskDates]
    }
    
    if (allDates.length === 0) {
      const now = new Date();
      const start = startOfMonth(now);
      const end = endOfMonth(addMonths(now, 2));
      return {
        months: eachMonthOfInterval({ start, end }),
        totalDays: differenceInCalendarDays(end, start) + 1,
        startDate: start,
        endDate: end,
        projectLayouts: [],
        totalHeight: 100,
      };
    }

    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    const start = startOfMonth(minDate);
    const end = endOfMonth(maxDate);
    
    const months = eachMonthOfInterval({ start, end });
    const totalDays = differenceInCalendarDays(end, start) + 1;
    
    let currentTop = 0;
    const projectLayouts = projects.map(project => {
        const taskLayout = calculateLayout(project.tasks);
        const maxLevel = Math.max(-1, ...Array.from(taskLayout.values()).map(l => l.level));
        const projectHeight = 40 + (maxLevel >= 0 ? (maxLevel + 1) * 36 : 0);

        const layout = { 
            ...project, 
            top: currentTop, 
            height: projectHeight, 
            taskLayout 
        };
        currentTop += projectHeight + 20; // 20px margin between projects
        return layout;
    });

    const totalHeight = currentTop;

    return { months, totalDays, startDate: start, endDate: end, projectLayouts, totalHeight };
  }, [projects]);
  
  const dayWidth = 18; // Fixed width for each day
  const containerWidth = totalDays * dayWidth;
  
  const getPosition = (date: Date) => {
    return differenceInCalendarDays(date, startDate) * dayWidth;
  }
  
  const getWidth = (start: Date, end: Date) => {
     return (differenceInCalendarDays(end, start) + 1) * dayWidth;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>
          A Gantt-style overview of your projects and their tasks.
        </CardDescription>
      </CardHeader>
      <CardContent ref={containerRef} className="p-6 pt-2 overflow-x-auto">
        <TooltipProvider>
        <div className="relative" style={{ width: `${containerWidth}px`, height: `${totalHeight}px` }}>
            {/* Months Header & Grid Lines */}
            <div className="sticky top-0 z-10 flex bg-background/80 backdrop-blur-sm h-10 items-end border-b">
                {months.map((month, index) => {
                    const daysInMonth = differenceInCalendarDays(endOfMonth(month), startOfMonth(month)) + 1;
                    const displayYear = getYear(month) !== getYear(addMonths(month, -1));
                    return (
                        <div 
                            key={month.toString()} 
                            className={cn("text-center text-xs font-semibold", index < months.length -1 && "border-r")}
                            style={{ width: `${daysInMonth * dayWidth}px` }}
                        >
                        {displayYear ? format(month, 'MMM yyyy') : format(month, 'MMM')}
                        </div>
                    );
                })}
            </div>
            {/* Day grid lines */}
            <div className="absolute top-10 left-0 w-full h-full">
                {Array.from({ length: totalDays }).map((_, i) => (
                    <div
                    key={i}
                    className="absolute top-0 h-full border-r border-border/20"
                    style={{ left: `${(i + 1) * dayWidth}px` }}
                    />
                ))}
            </div>

            {/* Today marker */}
            <div className="absolute top-0 h-full" style={{ left: `${getPosition(new Date())}px`}}>
                <div className="w-px h-full bg-primary" />
                <div className="absolute -top-1 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    Today
                    </div>
                </div>
            </div>

            {/* Projects and Tasks */}
            <div className="relative pt-4">
            {projectLayouts.map((project) => {
                const projectLeft = getPosition(project.startDate);
                const projectWidth = getWidth(project.startDate, project.dueDate);
                
                return (
                <div key={project.id} style={{ top: `${project.top}px`}} className="absolute w-full group">
                    {/* Project Bar */}
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                        <div
                            className="absolute h-8 rounded-lg flex items-center px-2 cursor-pointer"
                            style={{
                                left: `${projectLeft}px`,
                                width: `${Math.max(projectWidth, 0)}px`,
                                backgroundColor: `hsl(var(--primary) / 0.1)`,
                                border: `1px solid hsl(var(--primary) / 0.5)`
                            }}
                        >
                            <div className={cn("absolute left-0 top-0 h-full w-1 rounded-l-lg", priorityColorClass[project.priority])} />
                            <span className="text-sm font-bold text-primary truncate pl-2">{project.name}</span>
                        </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-bold">{project.name}</p>
                            <p>Start: {format(project.startDate, "MMM d, yyyy")}</p>
                            <p>Due: {format(project.dueDate, "MMM d, yyyy")}</p>
                            <p>Priority: {project.priority}</p>
                        </TooltipContent>
                    </Tooltip>

                        {/* Dependency Lines */}
                        {project.tasks.map(task => {
                        const taskLayout = project.taskLayout.get(task.id);
                        if (!taskLayout) return null;
                        
                        return (task.dependencies || []).map(depId => {
                            const depLayout = project.taskLayout.get(depId);
                            if (!depLayout) return null;
                            
                            const fromX = getPosition(depLayout.dueDate) + getWidth(depLayout.startDate, depLayout.dueDate) / 2;
                            const fromY = 40 + depLayout.top + 28; // Bottom of the task bar
                            const toX = getPosition(taskLayout.startDate) + getWidth(taskLayout.startDate, taskLayout.dueDate) / 2;
                            const toY = 40 + taskLayout.top; // Top of the task bar

                            const isBelow = fromY < toY;
                            const curveY = isBelow ? fromY + 15 : fromY - 15;
                            const path = `M ${fromX} ${fromY} C ${fromX} ${curveY}, ${toX} ${curveY}, ${toX} ${toY}`;

                            return (
                                <svg key={`${task.id}-${depId}`} className="absolute" style={{ top: 0, left: 0, width: '100%', height: project.height, pointerEvents: 'none' }}>
                                <path 
                                    d={path}
                                    stroke="hsl(var(--muted-foreground) / 0.6)" 
                                    strokeWidth="1.5" 
                                    fill="none" 
                                />
                                {/* Arrowhead */}
                                <path d={`M ${toX - 4} ${toY - 4} L ${toX} ${toY} L ${toX + 4} ${toY - 4}`} stroke="hsl(var(--muted-foreground) / 0.6)" strokeWidth="1.5" fill="none" />
                                </svg>
                            );
                        });
                        })}

                    {/* Tasks */}
                    {Array.from(project.taskLayout.values()).map((taskLayout) => {
                        const task = project.tasks.find(t => t.id === taskLayout.id)!;
                        const taskLeft = getPosition(taskLayout.startDate);
                        const taskWidth = getWidth(taskLayout.startDate, taskLayout.dueDate);
                        
                        return (
                            <Tooltip key={task.id} delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <div
                                        className="absolute h-7 rounded-md flex items-center cursor-pointer group/task"
                                        style={{
                                            top: `${40 + taskLayout.top}px`,
                                            left: `${taskLeft}px`,
                                            width: `${Math.max(taskWidth -2, 2)}px`, // -2 for margin
                                            marginLeft: '1px',
                                            backgroundColor: `hsl(var(--secondary))`
                                        }}
                                    >
                                        <div className={cn("absolute left-0 top-0 h-full w-1 rounded-l-md", taskPriorityColorClass[task.priority])} />
                                        <span className="text-xs text-secondary-foreground font-medium truncate ml-2">
                                            {task.title}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-bold">{task.title}</p>
                                    <p>Start: {format(task.startDate!, "MMM d, yyyy")}</p>
                                    <p>Due: {format(task.dueDate!, "MMM d, yyyy")}</p>
                                    <p>Status: {task.status}</p>
                                    <p>Priority: {task.priority}</p>
                                    {task.assigned.length > 0 && <p>Assigned: {task.assigned.map(u=>u.name).join(', ')}</p>}
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </div>
                )
            })}
            </div>
        </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
