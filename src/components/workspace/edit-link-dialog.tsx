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
import type { DocumentLink } from "@/lib/types"

const editLinkFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  url: z.string().url("Please enter a valid URL."),
})

type EditLinkFormValues = z.infer<typeof editLinkFormSchema>

interface EditLinkDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (link: DocumentLink) => void
  link: DocumentLink
}

export function EditLinkDialog({
  isOpen,
  onClose,
  onSave,
  link,
}: EditLinkDialogProps) {
  const form = useForm<EditLinkFormValues>({
    resolver: zodResolver(editLinkFormSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  })

  React.useEffect(() => {
    if (link) {
      form.reset({
        title: link.title,
        url: link.url,
      })
    }
  }, [link, form])

  function onSubmit(data: EditLinkFormValues) {
    onSave({ ...link, ...data })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document Link</DialogTitle>
          <DialogDescription>
            Update the title and URL for your document or link.
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
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
