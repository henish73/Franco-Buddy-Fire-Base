// src/ai/flows/course-suggestion.ts
'use server';

/**
 * @fileOverview AI-powered course suggestion tool for prospective students.
 *
 * - suggestCourse - A function that suggests the best TEF Canada course based on user goals and background.
 * - CourseSuggestionInput - The input type for the suggestCourse function.
 * - CourseSuggestionOutput - The return type for the suggestCourse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseSuggestionInputSchema = z.object({
  tefGoal: z
    .string()
    .describe(
      'The prospective student\'s goal for taking the TEF Canada exam (e.g., Canadian immigration, work permit).'
    ),
  frenchLevel: z
    .string()
    .describe(
      'The prospective student\'s current French language level (e.g., beginner, intermediate, advanced).'
    ),
  background: z
    .string()
    .describe(
      'The prospective student\'s background, including previous French learning experiences and any relevant information.'
    ),
});
export type CourseSuggestionInput = z.infer<typeof CourseSuggestionInputSchema>;

const CourseSuggestionOutputSchema = z.object({
  suggestedCourse: z.string().describe('The name of the suggested course.'),
  reasoning: z.string().describe('The reasoning behind the course suggestion.'),
});
export type CourseSuggestionOutput = z.infer<typeof CourseSuggestionOutputSchema>;

export async function suggestCourse(
  input: CourseSuggestionInput
): Promise<CourseSuggestionOutput> {
  return suggestCourseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseSuggestionPrompt',
  input: {schema: CourseSuggestionInputSchema},
  output: {schema: CourseSuggestionOutputSchema},
  prompt: `You are an expert advisor on TEF Canada courses.

  Based on the prospective student's goals, current French level, and background, suggest the most appropriate TEF Canada course.
  Explain your reasoning for the suggestion.

  TEF Goal: {{{tefGoal}}}
  French Level: {{{frenchLevel}}}
  Background: {{{background}}}
  `,
});

const suggestCourseFlow = ai.defineFlow(
  {
    name: 'suggestCourseFlow',
    inputSchema: CourseSuggestionInputSchema,
    outputSchema: CourseSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
