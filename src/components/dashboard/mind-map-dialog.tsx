"use client"
import * as React from "react"
import type { Project } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MindMapEditor } from "./mind-map-editor"

interface MindMapDialogProps {
  isOpen: boolean
  onClose: () => void
  project: Project
}

export function MindMapDialog({ isOpen, onClose, project }: MindMapDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Mind Map: {project.name}</DialogTitle>
          <DialogDescription>
            Create and organize your project ideas visually.
          </DialogDescription>
        </DialogHeader>
        <div className="h-full py-4">
            <MindMapEditor project={project} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
