"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { QuickNote } from "@/lib/types"
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
import { Textarea } from "../ui/textarea"

const editNoteFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  content: z.string(),
})

type EditNoteFormValues = z.infer<typeof editNoteFormSchema>

interface EditNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: QuickNote) => void
  note: QuickNote
}

export function EditNoteDialog({
  isOpen,
  onClose,
  onSave,
  note
}: EditNoteDialogProps) {
  const form = useForm<EditNoteFormValues>({
    resolver: zodResolver(editNoteFormSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
    },
  })
  
  React.useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
      });
    }
  }, [note, form]);


  function onSubmit(data: EditNoteFormValues) {
    onSave({ ...note, ...data });
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Quick Note</DialogTitle>
          <DialogDescription>
            Update the title or content for your note.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea className="h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
