"use client"
import * as React from "react"
import { StickyNote } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"

interface NotesPopoverProps {
  notes?: string
  onSave: (newNotes: string) => void
  title: string
}

export function NotesPopover({ notes = "", onSave, title }: NotesPopoverProps) {
  const [currentNotes, setCurrentNotes] = React.useState(notes)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setCurrentNotes(notes);
  }, [notes, isOpen]);

  const handleSave = () => {
    onSave(currentNotes);
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <StickyNote className="h-4 w-4" />
          <span className="sr-only">Open Notes</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <p className="text-sm text-muted-foreground">
              Add or edit notes below.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes" className="sr-only">Notes</Label>
            <Textarea
              id="notes"
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              placeholder="Type your notes here."
              className="h-32"
            />
          </div>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
