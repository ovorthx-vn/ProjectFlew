"use client"

import * as React from "react"
import { format, differenceInCalendarDays, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, eachMonthOfInterval, getYear } from "date-fns"

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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const { months, totalDays, startDate, totalHeight } = React.useMemo(() => {
    if (projects.length === 0) {
      const now = new Date();
      const start = startOfMonth(now);
      const end = endOfMonth(addMonths(now, 2));
      return {
        months: eachMonthOfInterval({ start, end }),
        totalDays: differenceInCalendarDays(end, start) + 1,
        startDate: start,
        totalHeight: 100,
      };
    }

    const allDates = projects.flatMap(p => [p.startDate, p.dueDate]);
    
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    const start = startOfMonth(minDate);
    const end = endOfMonth(maxDate);
    
    const months = eachMonthOfInterval({ start, end });
    const totalDays = differenceInCalendarDays(end, start) + 1;
    
    const totalHeight = projects.length * (40 + 20);

    return { months, totalDays, startDate: start, totalHeight };
  }, [projects]);
  
  const dayWidth = containerWidth > 0 ? containerWidth / totalDays : 0;
  
  const getPosition = (date: Date) => {
    if (!date) return 0;
    return differenceInCalendarDays(date, startDate) * dayWidth;
  }
  
  const getWidth = (start: Date, end: Date) => {
    if (!start || !end) return 0;
     return (differenceInCalendarDays(end, start) + 1) * dayWidth;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>
          A high-level overview of your project schedules.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-2 overflow-hidden">
        <div ref={containerRef}>
            {containerWidth > 0 && (
                <TooltipProvider>
                <div className="relative" style={{ width: `${containerWidth}px`, height: `${totalHeight}px` }}>
                    {/* Months Header */}
                    <div className="sticky top-0 z-10 flex bg-background/80 backdrop-blur-sm h-10 items-end border-b">
                        {months.map((month, index) => {
                            const daysInMonth = differenceInCalendarDays(endOfMonth(month), startOfMonth(month)) + 1;
                            const monthWidth = daysInMonth * dayWidth;
                            const displayYear = getYear(month) !== getYear(addMonths(month, -1));
                            return (
                                <div 
                                    key={month.toString()} 
                                    className={cn("text-center text-xs font-semibold shrink-0", index < months.length -1 && "border-r")}
                                    style={{ width: `${monthWidth}px` }}
                                >
                                {displayYear ? format(month, 'MMM yyyy') : format(month, 'MMM')}
                                </div>
                            );
                        })}
                    </div>
                    {/* Day grid lines */}
                    <div className="absolute top-10 left-0 w-full h-full">
                        {months.flatMap(month => {
                            const daysInMonth = differenceInCalendarDays(endOfMonth(month), startOfMonth(month)) + 1;
                            const monthWidth = daysInMonth * dayWidth;
                            return (
                                <div key={month.toISOString()} className="absolute top-0 h-full border-r" style={{ left: getPosition(month), width: `${monthWidth}px` }}/>
                            )
                        })}
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

                    {/* Projects */}
                    <div className="relative pt-4">
                    {projects.map((project, index) => {
                        const projectLeft = getPosition(project.startDate);
                        const projectWidth = getWidth(project.startDate, project.dueDate);
                        const projectTop = index * (40 + 20); // 40px height + 20px margin
                        
                        return (
                        <div key={project.id} style={{ top: `${projectTop}px`}} className="absolute w-full group">
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
