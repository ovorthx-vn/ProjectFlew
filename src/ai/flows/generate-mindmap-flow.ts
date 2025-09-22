'use server';
/**
 * @fileOverview A flow to generate a mind map image for a project.
 *
 * - generateMindMap - A function that generates a mind map.
 * - GenerateMindMapInput - The input type for the generateMindMap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMindMapInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectDescription: z.string().describe('The description of the project.'),
  tasks: z.array(z.string()).describe('A list of tasks in the project.'),
});
export type GenerateMindMapInput = z.infer<typeof GenerateMindMapInputSchema>;

export async function generateMindMap(input: GenerateMindMapInput): Promise<string> {
    return generateMindMapFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateMindMapPrompt',
    input: { schema: GenerateMindMapInputSchema },
    prompt: `
Generate a mind map visualization based on the provided project details.
The mind map should be visually appealing, clear, and structured.
The project name should be the central node.
The project description should inform the main branches.
The tasks should be sub-branches or nodes connected to the relevant main branches.
Use a modern and clean design aesthetic. Use curved lines and organic shapes.
The output should be just the image, with no additional text or explanations.

Project Name: {{{projectName}}}
Description: {{{projectDescription}}}

Tasks:
{{#each tasks}}
- {{{this}}}
{{/each}}
`});

const generateMindMapFlow = ai.defineFlow(
  {
    name: 'generateMindMapFlow',
    inputSchema: GenerateMindMapInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: await prompt(input),
    });
    if (!media.url) {
      throw new Error('Image generation failed to produce a URL.');
    }
    return media.url;
  }
);
