"use client"

import * as React from "react"
import Image from "next/image"
import {
  Archive,
  LayoutGrid,
  Briefcase,
  User as UserIcon,
  Users as UsersIcon,
  BookOpen,
  Calendar,
  User,
  Youtube,
  StickyNote,
  MoreHorizontal,
  PlusCircle,
  Pencil,
  Link as LinkIcon
} from "lucide-react"
import Link from "next/link"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { Workspace, QuickNote, DocumentLink } from "@/lib/types"
import { NoteDialog } from "@/components/workspace/note-dialog"
import { useWorkspace } from "@/context/workspace-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SaveNoteDialog } from "@/components/workspace/save-note-dialog"
import { YouTubeLinkDialog } from "@/components/workspace/youtube-link-dialog"
import { AddDocumentLinkDialog } from "@/components/workspace/add-document-link-dialog"

function WorkspaceDetail({ id }: { id: string }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const { workspaces, updateWorkspace } = useWorkspace();
  const [workspace, setWorkspace] = React.useState<Workspace | null>(null);
  const [selectedNote, setSelectedNote] = React.useState<QuickNote | null>(null)
  const [mainNote, setMainNote] = React.useState('');
  const [isSaveNoteDialogOpen, setIsSaveNoteDialogOpen] = React.useState(false);
  const [isYouTubeLinkDialogOpen, setIsYouTubeLinkDialogOpen] = React.useState(false);
  const [isAddDocumentLinkDialogOpen, setIsAddDocumentLinkDialogOpen] = React.useState(false);


  React.useEffect(() => {
    const foundWorkspace = workspaces.find(ws => ws.id === id);
    setWorkspace(foundWorkspace || null);
    if (foundWorkspace) {
      setMainNote(foundWorkspace.mainNote);
    }
  }, [id, workspaces]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMainNote(e.target.value);
  }

  const handleBlurNote = () => {
    if (workspace && mainNote !== workspace.mainNote) {
      updateWorkspace({ ...workspace, mainNote });
    }
  }
  
  const handleSaveAsQuickNote = (title: string) => {
    if(workspace) {
        const newQuickNote: QuickNote = {
            id: `qn-${Date.now()}`,
            title,
            content: mainNote
        }
        const updatedWorkspace = {
            ...workspace,
            quickNotes: [...workspace.quickNotes, newQuickNote]
        }
        updateWorkspace(updatedWorkspace);
    }
  }

  const handleSaveYouTubeLink = (link: string) => {
    if (workspace) {
      updateWorkspace({ ...workspace, youtubeUrl: link });
    }
  };

  const handleAddDocumentLink = (title: string, url: string) => {
    if(workspace) {
        const newLink: DocumentLink = {
            id: `doc-${Date.now()}`,
            title,
            url
        }
        const updatedWorkspace = {
            ...workspace,
            documentLinks: [...(workspace.documentLinks || []), newLink]
        }
        updateWorkspace(updatedWorkspace);
    }
  }

 const getYouTubeEmbedUrl = (url: string | undefined): string => {
    if (!url) {
      return "https://www.youtube.com/embed/jfKfPfyJRdk"; // Default video
    }

    let videoId: string | null = null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        if (urlObj.pathname === '/watch') {
          videoId = urlObj.searchParams.get('v');
        } else if (urlObj.pathname.startsWith('/embed/')) {
          videoId = urlObj.pathname.split('/')[2];
        } else if (urlObj.pathname.startsWith('/live/')) {
          videoId = urlObj.pathname.split('/')[2];
        }
      }
    } catch (error) {
       return "https://www.youtube.com/embed/jfKfPfyJRdk";
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return "https://www.youtube.com/embed/jfKfPfyJRdk";
  };


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
        <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-60px)]">
            <ScrollArea className="h-full">
                <div className="lg:col-span-1 space-y-6 pr-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2"><Youtube /> YouTube</CardTitle>
                                <CardDescription>Your study video/playlist.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsYouTubeLinkDialogOpen(true)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                             <iframe 
                                className="w-full aspect-video rounded-lg"
                                src={getYouTubeEmbedUrl(workspace.youtubeUrl)}
                                title="YouTube video player"
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen>
                            </iframe>
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
                                <li key={note.id} className="flex items-center gap-2">
                                <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedNote(note)}>
                                    {note.title}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </li>
                            ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2"><LinkIcon /> Documents</CardTitle>
                                <CardDescription>Relevant links and documents.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsAddDocumentLinkDialogOpen(true)}>
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                            {(workspace.documentLinks || []).map(link => (
                                <li key={link.id} className="flex items-center gap-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={link.url} target="_blank">
                                        {link.title}
                                    </Link>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </li>
                            ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
            <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                        <CardDescription>Your main area for taking notes for {workspace.subject}. Changes are saved automatically.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                        <Textarea 
                            className="h-full flex-grow" 
                            placeholder="Start typing your notes here..." 
                            value={mainNote}
                            onChange={handleNoteChange}
                            onBlur={handleBlurNote}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button className="ml-auto" onClick={() => setIsSaveNoteDialogOpen(true)}>
                            <PlusCircle className="mr-2" />
                           Save as Quick Note
                        </Button>
                    </CardFooter>
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
      <SaveNoteDialog
          isOpen={isSaveNoteDialogOpen}
          onClose={() => setIsSaveNoteDialogOpen(false)}
          onSave={handleSaveAsQuickNote}
      />
      <YouTubeLinkDialog
        isOpen={isYouTubeLinkDialogOpen}
        onClose={() => setIsYouTubeLinkDialogOpen(false)}
        onSave={handleSaveYouTubeLink}
        currentUrl={workspace.youtubeUrl}
      />
      <AddDocumentLinkDialog
        isOpen={isAddDocumentLinkDialogOpen}
        onClose={() => setIsAddDocumentLinkDialogOpen(false)}
        onSave={handleAddDocumentLink}
      />
    </SidebarProvider>
  )
}

export default function WorkspaceDetailPage({ params }: { params: { id: string } }) {
  const [id, setId] = React.useState<string>('');
  
  React.useEffect(() => {
    if (params) {
        setId(params.id);
    }
  }, [params]);

  if (!id) {
    // You can render a loading state here
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading workspace...</p>
        </div>
    );
  }

  return <WorkspaceDetail id={id} />
}
