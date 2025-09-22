"use client"
import * as React from "react"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CompletionNoteDialogProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  onSave: (note: string) => void
}

export function CompletionNoteDialog({ project, isOpen, onClose, onSave }: CompletionNoteDialogProps) {
  const { toast } = useToast()
  const [note, setNote] = React.useState("")

  const handleSave = () => {
    onSave(note)
    toast({
      title: "🎉 Project Completed!",
      description: `The project "${project.name}" has been marked as complete and will now appear in the archive.`,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Completed: {project.name}</DialogTitle>
          <DialogDescription>
            Congratulations on completing the project! Add any final notes or a summary for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="completion-note">Completion Note</Label>
          <Textarea
            id="completion-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Summary of project outcomes, lessons learned, or next steps."
            className="h-32"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Skip
          </Button>
          <Button onClick={handleSave}>Save Note & Archive</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
