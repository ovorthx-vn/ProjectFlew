"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Sparkles, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { Task, User } from "@/lib/types"
import { getAiSuggestion } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "../ui/badge"

const assignTeamFormSchema = z.object({
  members: z.array(z.string()),
})

type AssignTeamFormValues = z.infer<typeof assignTeamFormSchema>

interface AssignTeamDialogProps {
  isOpen: boolean
  onClose: () => void
  onAssignTeam: (members: User[]) => void
  task: Task | null
  projectUsers: User[]
}

export function AssignTeamDialog({
  isOpen,
  onClose,
  onAssignTeam,
  task,
  projectUsers,
}: AssignTeamDialogProps) {
  const { toast } = useToast()
  const [isSuggesting, setIsSuggesting] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("");

  const form = useForm<AssignTeamFormValues>({
    resolver: zodResolver(assignTeamFormSchema),
    defaultValues: {
      members: [],
    },
  })

  React.useEffect(() => {
    if (task) {
      form.reset({
        members: task.assigned.map(u => u.id),
      })
    }
  }, [task, form])

  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen])

  if (!task) return null

  const handleSuggestion = async () => {
    setIsSuggesting(true)
    try {
      const result = await getAiSuggestion({
        taskDescription: task.title,
        availableTeamMembers: projectUsers.map(u => ({
          name: u.name,
          role: u.role,
          availability: u.availability,
        })),
      })
      
      const suggestedMemberNames = result.suggestedTeamMembers
      const suggestedMemberIds = projectUsers
        .filter(u => suggestedMemberNames.includes(u.name))
        .map(u => u.id)

      form.setValue('members', suggestedMemberIds)
      
      toast({
        title: "AI Suggestion ✨",
        description: (
          <div>
            <p className="font-bold">Suggested Team:</p>
            <ul className="list-disc pl-5">
              {suggestedMemberNames.map(name => <li key={name}>{name}</li>)}
            </ul>
            <p className="mt-2 font-bold">Reasoning:</p>
            <p>{result.reasoning}</p>
          </div>
        )
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI suggestions. Please try again.",
      })
    } finally {
      setIsSuggesting(false)
    }
  }

  function onSubmit(data: AssignTeamFormValues) {
    const selectedMembers = projectUsers.filter(user => data.members.includes(user.id));
    onAssignTeam(selectedMembers)
    onClose()
  }

  const filteredUsers = projectUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Team for: {task.title}</DialogTitle>
          <DialogDescription>
            Select team members for this task. Use the AI suggestion for help.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="members"
                render={() => (
                    <FormItem>
                        <div className="mb-2 flex justify-between items-center">
                            <FormLabel className="text-base">Team Members</FormLabel>
                             <Button type="button" size="sm" onClick={handleSuggestion} disabled={isSuggesting}>
                                {isSuggesting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4" />
                                )}
                                Suggest Team
                            </Button>
                        </div>
                        <div className="relative mb-2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search members..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="space-y-3 rounded-md border p-4 max-h-60 overflow-y-auto">
                            {filteredUsers.length > 0 ? filteredUsers.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="members"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <Label className="font-normal flex items-center gap-2 w-full">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={item.avatar} alt={item.name} />
                                                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-grow">
                                                        {item.name}
                                                        <p className="text-muted-foreground text-xs">{item.role}</p>
                                                    </div>
                                                    <Badge 
                                                        variant={item.availability === 'Available' ? 'secondary' : 'default'}
                                                        className={item.availability === 'Available' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : item.availability === 'Busy' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}
                                                    >
                                                        {item.availability}
                                                    </Badge>
                                                </Label>
                                            </FormItem>
                                        )
                                    }}
                                />
                            )) : (
                               <p className="text-center text-sm text-muted-foreground">No members found.</p>
                            )}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Assign</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
