"use client"
import * as React from "react"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface MindMapDialogProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  mindMapUrl?: string
}

export function MindMapDialog({ isOpen, onClose, projectName, mindMapUrl }: MindMapDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Mind Map: {projectName}</DialogTitle>
          <DialogDescription>
            Visual representation of the project structure and ideas.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            {mindMapUrl ? (
                <AspectRatio ratio={16 / 9}>
                    <Image 
                        src={mindMapUrl} 
                        alt={`Mind map for ${projectName}`} 
                        className="rounded-md object-cover"
                        data-ai-hint="abstract diagram"
                        fill
                    />
                </AspectRatio>
            ) : (
                <div className="flex items-center justify-center h-60 rounded-md border border-dashed text-muted-foreground">
                    No mind map available for this project.
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
