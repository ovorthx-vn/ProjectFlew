"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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

const saveNoteFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
})

type SaveNoteFormValues = z.infer<typeof saveNoteFormSchema>

interface SaveNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (title: string) => void
}

export function SaveNoteDialog({
  isOpen,
  onClose,
  onSave,
}: SaveNoteDialogProps) {
  const form = useForm<SaveNoteFormValues>({
    resolver: zodResolver(saveNoteFormSchema),
    defaultValues: {
      title: "",
    },
  })

  function onSubmit(data: SaveNoteFormValues) {
    onSave(data.title);
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save as Quick Note</DialogTitle>
          <DialogDescription>
            Enter a title for your new quick note.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Important Concepts" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Note</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
