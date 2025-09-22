"use client"
import * as React from "react"
import type { Project } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MindMapEditor } from "./mind-map-editor"
import { MindMapDisplay } from "./mind-map-display"
import { useProject } from "@/context/project-context"

interface MindMapDialogProps {
  isOpen: boolean
  onClose: () => void
  project: Project
}

export function MindMapDialog({ isOpen, onClose, project }: MindMapDialogProps) {
    const { updateProject } = useProject();
    const [mindMapText, setMindMapText] = React.useState(project.mindMap || '');

    const handleSave = () => {
        updateProject({ ...project, mindMap: mindMapText });
        onClose();
    }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            // Reset text if dialog is closed without saving
            setMindMapText(project.mindMap || '');
        }
        onClose();
    }}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Mind Map: {project.name}</DialogTitle>
          <DialogDescription>
            Create and organize your project ideas visually. Use tabs for indentation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow min-h-0 rounded-lg border bg-muted/50 p-4 overflow-y-auto">
            <MindMapDisplay mindMapText={project.mindMap || ''} />
        </div>
        <div className="flex-shrink-0 pt-4">
            <MindMapEditor value={mindMapText} onChange={setMindMapText} />
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Mind Map</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
