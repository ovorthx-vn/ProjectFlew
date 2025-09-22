"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"

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

const youtubeLinkFormSchema = z.object({
  url: z.string().url("Please enter a valid URL.").refine(
    (url) => url.includes("youtube.com/") || url.includes("youtu.be/"),
    "Please enter a valid YouTube URL."
  ),
})

type YouTubeLinkFormValues = z.infer<typeof youtubeLinkFormSchema>

interface YouTubeLinkDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (url: string) => void
  currentUrl?: string
}

export function YouTubeLinkDialog({
  isOpen,
  onClose,
  onSave,
  currentUrl,
}: YouTubeLinkDialogProps) {
    const { toast } = useToast()

  const form = useForm<YouTubeLinkFormValues>({
    resolver: zodResolver(youtubeLinkFormSchema),
    defaultValues: {
      url: currentUrl || "",
    },
  })

  React.useEffect(() => {
    if(isOpen) {
        form.reset({ url: currentUrl || "" });
    }
  }, [isOpen, currentUrl, form])

  function onSubmit(data: YouTubeLinkFormValues) {
    onSave(data.url);
    toast({
        title: "YouTube video updated!",
        description: "Your study video has been changed."
    })
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set YouTube Video/Playlist</DialogTitle>
          <DialogDescription>
            Paste the URL of a YouTube video or playlist to embed it in your workspace.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
