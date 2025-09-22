"use client"

import * as React from "react"
import Image from "next/image"
import {
  Archive,
  LayoutGrid,
  Settings,
  User as UserIcon,
  Users as UsersIcon,
  MoreHorizontal,
  PlusCircle
} from "lucide-react"

import type { User } from "@/lib/types"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditMemberDialog } from "@/components/team/edit-member-dialog"
import { CreateMemberDialog } from "@/components/settings/create-member-dialog"

interface TeamPageProps {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
}

export default function TeamPage({ users, addUser, updateUser }: TeamPageProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [isCreateMemberOpen, setIsCreateMemberOpen] = React.useState(false)

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = (updatedUser: User) => {
    updateUser(updatedUser);
  };
  
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
              <SidebarMenuButton href="/team" isActive>
                <UsersIcon />
                Team
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Archive />
                Archive
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/settings">
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
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="font-headline text-xl font-semibold">Team</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreateMemberOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Member
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team members.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {user.name}
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                           <Badge 
                                variant={user.availability === 'Available' ? 'secondary' : 'default'}
                                className={cn(
                                    user.availability === 'Available' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 
                                    user.availability === 'Busy' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' : 
                                    'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                )}
                            >
                                {user.availability}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        </main>
      </SidebarInset>

      <CreateMemberDialog isOpen={isCreateMemberOpen} onClose={() => setIsCreateMemberOpen(false)} onAddMember={(newUserData) => addUser({...newUserData, avatar: `https://picsum.photos/seed/user${Date.now()}/40/40`})} />

      {editingUser && (
        <EditMemberDialog
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onUpdateMember={handleUpdateUser}
          user={editingUser}
        />
      )}
    </SidebarProvider>
  )
}
