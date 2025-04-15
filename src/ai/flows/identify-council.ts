'use server';
/**
 * @fileOverview Identifies the council that aligns with the provided azan time.
 *
 * - identifyCouncil - A function that identifies the council.
 * - IdentifyCouncilInput - The input type for the identifyCouncil function.
 * - IdentifyCouncilOutput - The return type for the identifyCouncil function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const IdentifyCouncilInputSchema = z.object({
  azanTime: z.string().describe('The most recent azan time (e.g., 05:00 AM).'),
  namazType: z.enum(['fajr', 'duhur', 'asr', 'maghrib', 'isha']).describe('The type of namaz (prayer).'),
  place: z.string().describe('The name of the location.'),
});
export type IdentifyCouncilInput = z.infer<typeof IdentifyCouncilInputSchema>;

const IdentifyCouncilOutputSchema = z.object({
  council: z.string().describe('The name of the council that the azan time aligns with.'),
  confidence: z.number().describe('A confidence score (0-1) indicating the certainty of the identification.'),
});
export type IdentifyCouncilOutput = z.infer<typeof IdentifyCouncilOutputSchema>;

export async function identifyCouncil(input: IdentifyCouncilInput): Promise<IdentifyCouncilOutput> {
  return identifyCouncilFlow(input);
}

const identifyCouncilPrompt = ai.definePrompt({
  name: 'identifyCouncilPrompt',
  input: {
    schema: z.object({
      azanTime: z.string().describe('The most recent azan time (e.g., 05:00 AM).'),
      namazType: z.string().describe('The type of namaz (prayer).'),
      place: z.string().describe('The name of the location.'),
    }),
  },
  output: {
    schema: z.object({
      council: z.string().describe('The name of the council that the azan time aligns with.'),
      confidence: z.number().describe('A confidence score (0-1) indicating the certainty of the identification.'),
    }),
  },
  prompt: `Given the azan time of {{azanTime}} for {{namazType}} prayer in {{place}}, identify the council that most likely determined this prayer time. Also, provide a confidence score between 0 and 1 for your identification.\n\nOutput (in JSON format):`,
});

const identifyCouncilFlow = ai.defineFlow<
  typeof IdentifyCouncilInputSchema,
  typeof IdentifyCouncilOutputSchema
>(
  {
    name: 'identifyCouncilFlow',
    inputSchema: IdentifyCouncilInputSchema,
    outputSchema: IdentifyCouncilOutputSchema,
  },
  async input => {
    const {output} = await identifyCouncilPrompt(input);
    return output!;
  }
);
