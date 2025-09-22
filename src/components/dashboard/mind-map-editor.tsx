"use client"

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MindMapEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function MindMapEditor({ value, onChange }: MindMapEditorProps) {
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <Label htmlFor="mindmap-editor" className="text-sm font-medium">Editor</Label>
            <Textarea
                id="mindmap-editor"
                placeholder="Start your mind map here...&#10;- Main Idea&#10;&#9;- Sub Idea 1&#10;&#9;&#9;- Detail A&#10;&#9;- Sub Idea 2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full flex-grow rounded-lg border-2 border-dashed border-muted-foreground p-4 h-48"
            />
        </div>
    )
}
