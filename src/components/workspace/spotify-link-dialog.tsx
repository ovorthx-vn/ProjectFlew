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

const spotifyLinkFormSchema = z.object({
  url: z.string().url("Please enter a valid URL.").refine(
    (url) => url.includes("open.spotify.com/playlist/"),
    "Please enter a valid Spotify playlist URL."
  ),
})

type SpotifyLinkFormValues = z.infer<typeof spotifyLinkFormSchema>

interface SpotifyLinkDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (url: string) => void
  currentUrl?: string
}

export function SpotifyLinkDialog({
  isOpen,
  onClose,
  onSave,
  currentUrl,
}: SpotifyLinkDialogProps) {
    const { toast } = useToast()

  const form = useForm<SpotifyLinkFormValues>({
    resolver: zodResolver(spotifyLinkFormSchema),
    defaultValues: {
      url: currentUrl || "",
    },
  })

  React.useEffect(() => {
    if(isOpen) {
        form.reset({ url: currentUrl || "" });
    }
  }, [isOpen, currentUrl, form])

  function onSubmit(data: SpotifyLinkFormValues) {
    onSave(data.url);
    toast({
        title: "Playlist updated!",
        description: "Your study playlist has been changed."
    })
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Spotify Playlist</DialogTitle>
          <DialogDescription>
            Paste the URL of a Spotify playlist to embed it in your workspace.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playlist URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://open.spotify.com/playlist/..." {...field} />
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
