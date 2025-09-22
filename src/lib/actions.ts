'use server'

import { suggestTeamAssignments, type SuggestTeamAssignmentsInput } from "@/ai/flows/suggest-team-assignments"
import { generateMindMap, type GenerateMindMapInput } from "@/ai/flows/generate-mindmap-flow"

export async function getAiSuggestion(input: SuggestTeamAssignmentsInput) {
  try {
    const result = await suggestTeamAssignments(input)
    return result
  } catch (error) {
    console.error("Error getting AI suggestion:", error)
    throw new Error("Failed to get AI suggestion")
  }
}

export async function generateMindMapAction(input: GenerateMindMapInput): Promise<string> {
    try {
        const result = await generateMindMap(input);
        return result;
    } catch (error) {
        console.error('Error generating mind map:', error);
        throw new Error('Failed to generate mind map');
    }
}
