// src/app/student/ai-tutor/report/actions.ts
"use server";

import type { SpeakingAssessmentOutput } from "@/ai/flows/speakingAssessmentSchemas";
import type { WritingAssessmentOutput } from "@/ai/flows/writingAssessmentSchemas";
import type { ReadingAssessmentOutput } from "@/ai/flows/readingAssessmentSchemas";
import type { ListeningAssessmentOutput } from "@/ai/flows/listeningAssessmentSchemas";

export type HistoricalAssessment = {
  id: string;
  studentId: string; // In a real app
  assessmentType: "Speaking" | "Writing" | "Reading" | "Listening";
  promptTopicOrId: string; // Could be the topic or an ID of the prompt/passage
  timestamp: string;
  score: number;
  // Details specific to each assessment type
  details: Partial<SpeakingAssessmentOutput | WritingAssessmentOutput | ReadingAssessmentOutput | ListeningAssessmentOutput>;
};

// Simulate fetching a student's assessment history
export async function getAssessmentHistoryAction(): Promise<HistoricalAssessment[]> {
  console.log("Simulating fetch of AI Tutor assessment history.");

  // For now, return a mix of hardcoded mock assessment results.
  // In a real app, this would query Firestore for the student_assessment_results collection.
  const mockHistory: HistoricalAssessment[] = [
    // Speaking
    {
      id: "sassess_1",
      studentId: "student123",
      assessmentType: "Speaking",
      promptTopicOrId: "Daily Routine",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      score: 75,
      details: {
        transcription: "J'ai parlé de ma routine...",
        feedback: { fluency: "Good", pronunciation: "Okay", grammar: "Few errors", vocabulary: "Adequate", coherence: "Clear", tefSectionContext: "Section A" },
        suggestionsForImprovement: ["Work on 'r' sound.", "Review verb tenses."],
      } as SpeakingAssessmentOutput,
    },
    {
      id: "sassess_2",
      studentId: "student123",
      assessmentType: "Speaking",
      promptTopicOrId: "Hobbies",
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
      score: 68,
      details: {
        transcription: "Mes passe-temps sont...",
        feedback: { fluency: "Hesitant", pronunciation: "Needs work", grammar: "Several errors", vocabulary: "Limited", coherence: "Good", tefSectionContext: "Section B" },
        suggestionsForImprovement: ["Practice speaking more slowly.", "Expand vocabulary related to hobbies."],
      } as SpeakingAssessmentOutput,
    },
    // Writing
    {
      id: "wassess_1",
      studentId: "student123",
      assessmentType: "Writing",
      promptTopicOrId: "Work Experience Letter",
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
      score: 82,
      details: {
        feedback: { grammar: "Excellent", vocabulary: "Rich", structure: "Well-organized", coherence: "Very good", taskAchievement: "Fully addressed" },
        suggestionsForImprovement: ["Consider using more varied sentence openers."],
      } as WritingAssessmentOutput,
    },
    // Reading
    {
      id: "rassess_1",
      studentId: "student123",
      assessmentType: "Reading",
      promptTopicOrId: "Le Télétravail",
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      score: 70,
      details: {
        feedback: { understanding: "Good grasp of main ideas", clarity: "Response was clear", languageUse: "Adequate", relevanceToPassage: "Relevant" },
        suggestionsForImprovement: ["Pay closer attention to specific details in the passage."],
      } as ReadingAssessmentOutput,
    },
    // Listening
    {
      id: "lassess_1",
      studentId: "student123",
      assessmentType: "Listening",
      promptTopicOrId: "Annonce à la Gare",
      timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
      score: 65,
      details: {
        feedback: { comprehension: "Understood main points", clarity: "Response clear", languageUse: "Some errors", relevanceToTranscript: "Mostly relevant" },
        suggestionsForImprovement: ["Listen for specific numbers and times more carefully."],
      } as ListeningAssessmentOutput,
    },
  ];

  return mockHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}