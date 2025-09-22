"use client"
import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { QuickNote } from "@/lib/types"

interface NoteDialogProps {
  isOpen: boolean
  onClose: () => void
  note: QuickNote
}

export function NoteDialog({ isOpen, onClose, note }: NoteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
          <DialogDescription>Quick note content.</DialogDescription>
        </DialogHeader>
        <div className="prose dark:prose-invert max-w-full rounded-md border bg-muted/50 p-4 whitespace-pre-wrap">
          {note.content}
        </div>
      </DialogContent>
    </Dialog>
  )
}
