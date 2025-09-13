// src/app/student/ai-tutor/reading/actions.ts
"use server";

import { z } from "zod";
import { getReadingPassagesAction } from '@/app/admin/site-management/ai-content/readingPassageActions'; // To fetch passage and its questions
import type { ReadingPassage, QuizQuestion } from '@/app/admin/site-management/ai-content/schemas';

export type ReadingQuizResultItem = {
  questionId: string;
  questionText: string;
  options: string[];
  studentAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
  tefSkillTarget?: string;
};

export type ReadingQuizResult = {
  passageId: string;
  passageTopic: string;
  score: number; // Percentage
  totalQuestions: number;
  correctlyAnswered: number;
  results: ReadingQuizResultItem[];
};

export type ReadingQuizFormState = {
  message: string;
  errors?: {
    passageId?: string[];
    studentAnswers?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  quizResult?: ReadingQuizResult;
};

// Schema for student answers (object mapping questionId to selected option string)
const studentAnswersSchema = z.record(z.string().min(1));

export async function submitReadingQuiz(
  passageId: string,
  studentAnswers: Record<string, string> // e.g., { q1_id: "Option A text", q2_id: "Option C text" }
): Promise<ReadingQuizFormState> {
  
  const validatedAnswers = studentAnswersSchema.safeParse(studentAnswers);
  if (!passageId) {
    return { message: "Passage ID is missing.", isSuccess: false };
  }
  if (!validatedAnswers.success) {
    return {
      message: "Invalid answer format.",
      errors: { studentAnswers: validatedAnswers.error.flatten().formErrors },
      isSuccess: false,
    };
  }

  try {
    const passagesResult = await getReadingPassagesAction();
    if (!passagesResult.isSuccess || !Array.isArray(passagesResult.data)) {
      return { message: "Could not retrieve reading passages.", isSuccess: false };
    }
    
    const passage = (passagesResult.data as ReadingPassage[]).find(p => p.id === passageId);

    if (!passage) {
      return { message: "Selected passage not found.", isSuccess: false };
    }
    if (!passage.questions || passage.questions.length === 0) {
      return { message: "Passage has no questions to grade.", isSuccess: false };
    }

    let correctlyAnsweredCount = 0;
    const detailedResults: ReadingQuizResultItem[] = passage.questions.map(question => {
      const studentSelectedOption = studentAnswers[question.id];
      const isCorrect = studentSelectedOption === question.correctAnswer;
      if (isCorrect) {
        correctlyAnsweredCount++;
      }
      return {
        questionId: question.id,
        questionText: question.questionText,
        options: question.options,
        studentAnswer: studentSelectedOption,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        tefSkillTarget: question.tefSkillTarget,
      };
    });

    const scorePercentage = (correctlyAnsweredCount / passage.questions.length) * 100;

    const quizResultData: ReadingQuizResult = {
      passageId: passage.id,
      passageTopic: passage.topic,
      score: Math.round(scorePercentage),
      totalQuestions: passage.questions.length,
      correctlyAnswered: correctlyAnsweredCount,
      results: detailedResults,
    };

    return {
      message: "Quiz graded successfully!",
      isSuccess: true,
      quizResult: quizResultData,
    };

  } catch (error) {
    console.error("Error submitting reading quiz:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `An unexpected error occurred: ${errorMessage}`,
      isSuccess: false,
    };
  }
}
