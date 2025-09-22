'use server'

import { suggestTeamAssignments, type SuggestTeamAssignmentsInput } from "@/ai/flows/suggest-team-assignments"

export async function getAiSuggestion(input: SuggestTeamAssignmentsInput) {
  try {
    const result = await suggestTeamAssignments(input)
    return result
  } catch (error) {
    console.error("Error getting AI suggestion:", error)
    throw new Error("Failed to get AI suggestion")
  }
}
