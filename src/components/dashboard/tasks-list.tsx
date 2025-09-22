"use client"
import * as React from "react"
import { Plus, UserPlus } from "lucide-react"
import Image from "next/image"

import type { Task, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AssignTeamDialog } from "./assign-team-dialog"
import { NotesPopover } from "./notes-popover"
import { useToast } from "@/hooks/use-toast"

interface TasksListProps {
  tasks: Task[]
  users: User[]
  projectUsers: User[]
  onTasksUpdate: (tasks: Task[]) => void
}

const statusOptions: Task['status'][] = ['To-Do', 'In Progress', 'Done', 'Backlog'];

export function TasksList({ tasks, projectUsers, onTasksUpdate }: TasksListProps) {
  const { toast } = useToast()
  const [newTaskTitle, setNewTaskTitle] = React.useState("")
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Task title cannot be empty.",
        });
        return;
    }
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      status: 'To-Do',
      assigned: [],
    }
    onTasksUpdate([...tasks, newTask])
    setNewTaskTitle("")
  }
  
  const handleUpdateTaskStatus = (taskId: string, status: Task['status']) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    );
    onTasksUpdate(updatedTasks);
  }

  const handleAssignTeam = (assignedUsers: User[]) => {
    if (!editingTask) return;
    const updatedTasks = tasks.map(task =>
        task.id === editingTask.id ? { ...task, assigned: assignedUsers } : task
    );
    onTasksUpdate(updatedTasks);
  }

  const handleSaveNote = (taskId: string, notes: string) => {
     const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, notes } : task
    );
    onTasksUpdate(updatedTasks);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Tasks</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      <div className="rounded-md border">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Select
                      value={task.status}
                      onValueChange={(value: Task['status']) => handleUpdateTaskStatus(task.id, value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {task.assigned.map((member) => (
                          <Tooltip key={member.id} delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Image
                                src={member.avatar}
                                alt={member.name}
                                width={24}
                                height={24}
                                className="rounded-full border-2 border-card"
                              />
                            </TooltipTrigger>
                            <TooltipContent>{member.name}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setEditingTask(task)}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                   <TableCell className="text-right">
                    <NotesPopover 
                        title={`Notes for ${task.title}`} 
                        notes={task.notes} 
                        onSave={(newNotes) => handleSaveNote(task.id, newNotes)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>

       <AssignTeamDialog
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onAssignTeam={handleAssignTeam}
        task={editingTask}
        projectUsers={projectUsers}
      />
    </div>
  )
}
