'use server';

/**
 * @fileOverview A flow to suggest team assignments for a task based on roles and availability.
 *
 * - suggestTeamAssignments - A function that suggests team members for a given task.
 * - SuggestTeamAssignmentsInput - The input type for the suggestTeamAssignments function.
 * - SuggestTeamAssignmentsOutput - The return type for the suggestTeamAssignments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTeamAssignmentsInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  availableTeamMembers: z
    .array(
      z.object({
        name: z.string().describe('The name of the team member.'),
        role: z.string().describe('The role of the team member.'),
        availability: z.string().describe('The availability of the team member.'),
      })
    )
    .describe('A list of available team members with their roles and availability.'),
});
export type SuggestTeamAssignmentsInput = z.infer<typeof SuggestTeamAssignmentsInputSchema>;

const SuggestTeamAssignmentsOutputSchema = z.object({
  suggestedTeamMembers: z
    .array(z.string())
    .describe('A list of suggested team members for the task.'),
  reasoning: z.string().describe('The reasoning behind the team member suggestions.'),
});
export type SuggestTeamAssignmentsOutput = z.infer<typeof SuggestTeamAssignmentsOutputSchema>;

export async function suggestTeamAssignments(
  input: SuggestTeamAssignmentsInput
): Promise<SuggestTeamAssignmentsOutput> {
  return suggestTeamAssignmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTeamAssignmentsPrompt',
  input: {schema: SuggestTeamAssignmentsInputSchema},
  output: {schema: SuggestTeamAssignmentsOutputSchema},
  prompt: `You are an AI assistant that helps project managers suggest team members for a given task.

  Given the task description and the available team members with their roles and availability, suggest the best team members for the task.

  Task Description: {{{taskDescription}}}

  Available Team Members:
  {{#each availableTeamMembers}}
  - Name: {{name}}, Role: {{role}}, Availability: {{availability}}
  {{/each}}

  Please provide a list of suggested team members and the reasoning behind your suggestions.
  `,
});

const suggestTeamAssignmentsFlow = ai.defineFlow(
  {
    name: 'suggestTeamAssignmentsFlow',
    inputSchema: SuggestTeamAssignmentsInputSchema,
    outputSchema: SuggestTeamAssignmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
