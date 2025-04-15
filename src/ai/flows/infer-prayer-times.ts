// src/ai/flows/infer-prayer-times.ts
'use server';
/**
 * @fileOverview Infers the next prayer times based on the given azan time, type of namaz, location, and school of thought.
 *
 * - inferPrayerTimes - A function that handles the prayer time inference process.
 * - InferPrayerTimesInput - The input type for the inferPrayerTimes function.
 * - InferPrayerTimesOutput - The return type for the inferPrayerTimes function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const InferPrayerTimesInputSchema = z.object({
  azanTime: z.string().describe('The time of the most recent azan (prayer call).'),
  namazType: z.enum(['fajr', 'duhur', 'asr', 'maghrib', 'isha']).describe('The type of namaz (prayer) that the azan was for.'),
  location: z.string().describe('The location where the azan was heard.'),
  schoolOfThought: z.enum(['shia', 'sunni']).describe('The school of thought followed by the user.'),
});
export type InferPrayerTimesInput = z.infer<typeof InferPrayerTimesInputSchema>;

const InferPrayerTimesOutputSchema = z.object({
  nextPrayerTimes: z.object({
    fajr: z.string().optional().describe('The predicted time for Fajr prayer.'),
    duhur: z.string().optional().describe('The predicted time for Duhur prayer.'),
    asr: z.string().optional().describe('The predicted time for Asr prayer.'),
    maghrib: z.string().optional().describe('The predicted time for Maghrib prayer.'),
    isha: z.string().optional().describe('The predicted time for Isha prayer.'),
  }).describe('The predicted times for the next prayers.'),
});
export type InferPrayerTimesOutput = z.infer<typeof InferPrayerTimesOutputSchema>;

export async function inferPrayerTimes(input: InferPrayerTimesInput): Promise<InferPrayerTimesOutput> {
  return inferPrayerTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inferPrayerTimesPrompt',
  input: {
    schema: z.object({
      azanTime: z.string().describe('The time of the most recent azan (prayer call).'),
      namazType: z.string().describe('The type of namaz (prayer) that the azan was for.'),
      location: z.string().describe('The location where the azan was heard.'),
      schoolOfThought: z.string().describe('The school of thought followed by the user.'),
    }),
  },
  output: {
    schema: z.object({
      nextPrayerTimes: z.object({
        fajr: z.string().optional().describe('The predicted time for Fajr prayer.'),
        duhur: z.string().optional().describe('The predicted time for Duhur prayer.'),
        asr: z.string().optional().describe('The predicted time for Asr prayer.'),
        maghrib: z.string().optional().describe('The predicted time for Maghrib prayer.'),
        isha: z.string().optional().describe('The predicted time for Isha prayer.'),
      }).describe('The predicted times for the next prayers.'),
    }),
  },
  prompt: `Based on the azan time which was {{{azanTime}}} for {{{namazType}}} prayer, and the location being {{{location}}}, and the user following the {{{schoolOfThought}}} school of thought, what would be the next prayer times? Please provide the times for all prayers. If the prayer has already occurred today, then return null for that prayer. Return a JSON object with prayer names as keys and prayer times as values.
`,
});

const inferPrayerTimesFlow = ai.defineFlow<
  typeof InferPrayerTimesInputSchema,
  typeof InferPrayerTimesOutputSchema
>({
  name: 'inferPrayerTimesFlow',
  inputSchema: InferPrayerTimesInputSchema,
  outputSchema: InferPrayerTimesOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
