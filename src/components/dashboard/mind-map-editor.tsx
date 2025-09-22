"use client"

import type { Project } from "@/lib/types"

interface MindMapEditorProps {
    project: Project
}

export function MindMapEditor({ project }: MindMapEditorProps) {
    return (
        <div className="w-full h-full rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center">
            <div className="text-center text-muted-foreground">
                <h3 className="text-lg font-semibold">Mind Map Editor</h3>
                <p className="text-sm">A full mind map editor can be implemented here.</p>
                <p className="text-xs mt-2">(This is currently a placeholder)</p>
            </div>
        </div>
    )
}
