// src/app/student/dashboard/actions.ts
"use server";

import type { SpeakingAssessmentOutput } from "@/ai/flows/speakingAssessmentSchemas";
import type { WritingAssessmentOutput } from "@/ai/flows/writingAssessmentSchemas";
import type { ReadingAssessmentOutput } from "@/ai/flows/readingAssessmentSchemas";
import type { ListeningAssessmentOutput } from "@/ai/flows/listeningAssessmentSchemas";

// Simplified structure for the dashboard snippet
export type RecentFeedbackSnippet = {
  assessmentType: "Speaking" | "Writing" | "Reading" | "Listening" | "N/A";
  promptTopic?: string; // Topic of the prompt/passage/audio
  score?: number;
  keyFeedback?: string; // A single, concise piece of feedback or the first suggestion
  timestamp?: string;
};

// Simulate fetching the most recent AI tutor feedback for a student
// In a real app, this would query Firestore for the latest record in 'student_assessment_results' for the logged-in student.
export async function getMostRecentAiTutorFeedbackAction(): Promise<RecentFeedbackSnippet | null> {
  // Simulate fetching the latest assessment.
  // For now, let's return a hardcoded example.
  // This would be dynamic based on actual student assessment results.
  console.log("Simulating fetch of most recent AI tutor feedback.");

  // Example: Let's say the last assessment was a Speaking assessment
  const mockLastSpeakingAssessment: SpeakingAssessmentOutput = {
    transcription: "Bonjour, je voudrais parler de mes vacances. C'était magnifique...",
    feedback: {
      fluency: "Good flow overall, but some hesitations on complex sentences.",
      pronunciation: "Generally clear, work on the 'r' sound.",
      grammar: "Minor errors with verb conjugation in passé composé.",
      vocabulary: "Good range of vocabulary used.",
      coherence: "Ideas were well-connected and easy to follow.",
      tefSectionContext: "Good attempt for a general conversation topic."
    },
    score: 78,
    suggestionsForImprovement: [
      "Practice 'r' sound with minimal pairs.",
      "Review passé composé conjugation for irregular verbs.",
      "Try to use more varied sentence structures."
    ],
  };

  if (mockLastSpeakingAssessment) {
    return {
      assessmentType: "Speaking",
      promptTopic: "Vacation Experience (Simulated)", // This would come from the prompt data
      score: mockLastSpeakingAssessment.score,
      keyFeedback: mockLastSpeakingAssessment.suggestionsForImprovement?.[0] || "Keep practicing!",
      timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(), // Simulated: 12 hours ago
    };
  }

  // If no assessments found, return null or a default state
  return null;
}
