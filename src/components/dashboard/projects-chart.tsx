"use client"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, startOfMonth } from 'date-fns'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Project } from "@/lib/types"

interface ProjectsChartProps {
  projects: Project[]
}

export function ProjectsChart({ projects }: ProjectsChartProps) {
    const projectsByMonth = projects.reduce((acc, project) => {
        const month = format(startOfMonth(project.createdAt), 'MMM yyyy');
        if (!acc[month]) {
            acc[month] = { month, count: 0 };
        }
        acc[month].count++;
        return acc;
    }, {} as Record<string, { month: string; count: number }>);
    
    const chartData = Object.values(projectsByMonth).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const chartConfig = {
    count: {
      label: "Projects",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Projects Over Time</CardTitle>
        <CardDescription>
          A line graph showing the number of new projects created each month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
