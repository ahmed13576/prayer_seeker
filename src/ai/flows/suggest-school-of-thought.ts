'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting the most likely Islamic school of thought.
 *
 * - suggestSchoolOfThought - A function that suggests the school of thought.
 * - SuggestSchoolOfThoughtInput - The input type for suggestSchoolOfThought function.
 * - SuggestSchoolOfThoughtOutput - The output type for suggestSchoolOfThought function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestSchoolOfThoughtInputSchema = z.object({
  azanTime: z.string().describe('The time of the most recent azan.'),
  location: z.string().describe('The location where the azan was heard.'),
});
export type SuggestSchoolOfThoughtInput = z.infer<typeof SuggestSchoolOfThoughtInputSchema>;

const SuggestSchoolOfThoughtOutputSchema = z.object({
  schoolOfThought: z.string().describe('The suggested Islamic school of thought (e.g., Shia, Sunni Hanafi, Sunni Hanbali, Sunni Shafi, Sunni Maliki).'),
  confidence: z.number().describe('A confidence score (0-1) indicating the certainty of the suggestion.'),
});
export type SuggestSchoolOfThoughtOutput = z.infer<typeof SuggestSchoolOfThoughtOutputSchema>;

export async function suggestSchoolOfThought(input: SuggestSchoolOfThoughtInput): Promise<SuggestSchoolOfThoughtOutput> {
  return suggestSchoolOfThoughtFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSchoolOfThoughtPrompt',
  input: {
    schema: z.object({
      azanTime: z.string().describe('The time of the most recent azan.'),
      location: z.string().describe('The location where the azan was heard.'),
    }),
  },
  output: {
    schema: z.object({
      schoolOfThought: z.string().describe('The suggested Islamic school of thought (e.g., Shia, Sunni Hanafi, Sunni Hanbali, Sunni Shafi, Sunni Maliki).'),
      confidence: z.number().describe('A confidence score (0-1) indicating the certainty of the suggestion.'),
    }),
  },
  prompt: `Based on the azan time of {{{azanTime}}} in {{{location}}}, suggest the most likely Islamic school of thought.  Include a confidence score between 0 and 1.

School of Thought: 
Confidence: `,
});

const suggestSchoolOfThoughtFlow = ai.defineFlow<
  typeof SuggestSchoolOfThoughtInputSchema,
  typeof SuggestSchoolOfThoughtOutputSchema
>(
  {
    name: 'suggestSchoolOfThoughtFlow',
    inputSchema: SuggestSchoolOfThoughtInputSchema,
    outputSchema: SuggestSchoolOfThoughtOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
