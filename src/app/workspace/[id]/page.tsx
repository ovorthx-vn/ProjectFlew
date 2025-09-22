"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Archive,
  LayoutGrid,
  Briefcase,
  User as UserIcon,
  Users as UsersIcon,
  BookOpen,
  Calendar,
  User,
  Music,
  StickyNote
} from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { workspaces } from "@/lib/data"
import type { Workspace, QuickNote } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { NoteDialog } from "@/components/workspace/note-dialog"

export default function WorkspaceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [workspace, setWorkspace] = React.useState<Workspace | null>(null);
  const [selectedNote, setSelectedNote] = React.useState<QuickNote | null>(null)

  React.useEffect(() => {
    const foundWorkspace = workspaces.find(ws => ws.id === id);
    setWorkspace(foundWorkspace || null);
  }, [id]);

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Workspace not found.</p>
      </div>
    );
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
              <SidebarMenuButton href="/">
                <LayoutGrid />
                Projects
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/workspace" isActive>
                <Briefcase />
                Workspace
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/team">
                <UsersIcon />
                Team
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/archive">
                <Archive />
                Archive
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
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="font-headline text-xl font-semibold flex items-center gap-3">
              <BookOpen className="text-primary"/> 
              {workspace.subject}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
             <div className="flex items-center gap-2 text-muted-foreground">
                <User />
                <span>Tutor: <strong>{workspace.tutor}</strong></span>
             </div>
             <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar />
                <span>Due: <strong>{format(workspace.dueDate, "PPP")}</strong></span>
             </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Music /> Spotify</CardTitle>
                        <CardDescription>Your study playlist.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">Spotify player placeholder</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><StickyNote /> Quick Notes</CardTitle>
                        <CardDescription>Click to view a note.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                          {workspace.quickNotes.map(note => (
                            <li key={note.id}>
                              <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedNote(note)}>
                                {note.title}
                              </Button>
                            </li>
                          ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                        <CardDescription>Your main area for taking notes for {workspace.subject}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea className="h-[60vh]" placeholder="Start typing your notes here..."/>
                    </CardContent>
                </Card>
            </div>
        </main>
      </SidebarInset>

      {selectedNote && (
        <NoteDialog
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          note={selectedNote}
        />
      )}
    </SidebarProvider>
  )
}
