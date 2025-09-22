"use client"

import * as React from "react"
import Image from "next/image"
import {
  Archive,
  Bell,
  CalendarDays,
  LayoutGrid,
  Settings,
  User as UserIcon,
} from "lucide-react"

import { projects as initialProjects, users } from "@/lib/data"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Icons } from "@/components/icons"
import { ProjectsView } from "@/components/dashboard/projects-view"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardPage() {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'tasks' | 'progress'>) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date(),
      tasks: [],
      progress: 0,
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  }

  return (
    <SidebarProvider defaultOpen onOpenChange={(open) => setIsCollapsed(!open)}>
      <Sidebar
        collapsible="icon"
        className="border-r"
        variant="sidebar"
      >
        <SidebarHeader>
          <div className="flex items-center gap-2 font-headline text-lg">
            <Icons.logo className="size-6 text-primary" />
            <span className={cn(isCollapsed && 'hidden')}>ProjectFlow</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" isActive>
                <LayoutGrid />
                Projects
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Archive />
                Archive
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="items-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn("w-full justify-start", isCollapsed && "justify-center size-8 p-0")}>
                        <div className="flex items-center gap-2">
                            <Image
                                src="https://picsum.photos/seed/user-main/40/40"
                                alt="User avatar"
                                width={32}
                                height={32}
                                className="rounded-full"
                                data-ai-hint="person portrait"
                            />
                            <div className={cn("flex flex-col items-start", isCollapsed && 'hidden')}>
                                <span className="font-medium text-sm">Admin</span>
                                <span className="text-xs text-muted-foreground">admin@projectflow.com</span>
                            </div>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Admin</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            admin@projectflow.com
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><UserIcon className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                    <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <SidebarTrigger className="md:hidden"/>
          <div className="flex-1">
            <h1 className="font-headline text-xl font-semibold">Projects</h1>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <CalendarDays className="h-5 w-5" />
                  <span className="sr-only">Open calendar</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="multiple"
                  selected={projects.map(p => p.dueDate)}
                  classNames={{
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                  }}
                />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
            <ProjectsView projects={projects} users={users} onAddProject={addProject} onUpdateProject={updateProject} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
