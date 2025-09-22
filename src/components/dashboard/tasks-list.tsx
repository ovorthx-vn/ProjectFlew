"use client"
import * as React from "react"
import { Plus, UserPlus, Calendar as CalendarIcon, Link2 } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"

import type { Task, User, Priority } from "@/lib/types"
import { cn } from "@/lib/utils"
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

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
      dependencies: [],
    }
    onTasksUpdate([...tasks, newTask])
    setNewTaskTitle("")
  }
  
  const handleUpdateTask = (taskId: string, newValues: Partial<Task>) => {
    onTasksUpdate(tasks.map(task => 
      task.id === taskId ? { ...task, ...newValues } : task
    ));
  }

  const handleAssignTeam = (assignedUsers: User[]) => {
    if (!editingTask) return;
    onTasksUpdate(tasks.map(task =>
        task.id === editingTask.id ? { ...task, assigned: assignedUsers } : task
    ));
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
                <TableHead className="w-[150px]">Start Date</TableHead>
                <TableHead className="w-[150px]">Due Date</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead className="w-[130px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Select
                      value={task.status}
                      onValueChange={(value: Task['status']) => handleUpdateTask(task.id, { status: value })}
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
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal h-8",
                                !task.startDate && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {task.startDate ? format(task.startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={task.startDate}
                            onSelect={(date) => handleUpdateTask(task.id, { startDate: date })}
                            disabled={(date) =>
                                (task.dueDate ? date > task.dueDate : false) || date < new Date("1900-01-01")
                            }
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal h-8",
                                !task.dueDate && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {task.dueDate ? format(task.dueDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={task.dueDate}
                            onSelect={(date) => handleUpdateTask(task.id, { dueDate: date })}
                            disabled={(date) =>
                                (task.startDate ? date < task.startDate : false) || date < new Date("1900-01-01")
                            }
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
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
                   <TableCell className="text-right space-x-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="space-y-2">
                            <h4 className="font-medium">Dependencies</h4>
                            <p className="text-sm text-muted-foreground">Select tasks that must be completed before this one.</p>
                            <div className="space-y-2">
                                {tasks.filter(t => t.id !== task.id).map(dependencyTask => (
                                    <div key={dependencyTask.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`dep-${task.id}-${dependencyTask.id}`}
                                            checked={(task.dependencies || []).includes(dependencyTask.id)}
                                            onCheckedChange={(checked) => {
                                                const currentDeps = task.dependencies || [];
                                                const newDeps = checked
                                                    ? [...currentDeps, dependencyTask.id]
                                                    : currentDeps.filter(id => id !== dependencyTask.id);
                                                handleUpdateTask(task.id, { dependencies: newDeps });
                                            }}
                                        />
                                        <Label htmlFor={`dep-${task.id}-${dependencyTask.id}`} className="font-normal text-sm">
                                            {dependencyTask.title}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <NotesPopover 
                        title={`Notes for ${task.title}`} 
                        notes={task.notes} 
                        onSave={(newNotes) => handleUpdateTask(task.id, { notes: newNotes })}
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
