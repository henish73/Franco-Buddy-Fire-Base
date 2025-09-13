// src/app/student/ai-tutor/reading/ReadingAssessmentClient.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, RefreshCw, Sparkles, Send, BookOpen, ChevronsUpDown } from "lucide-react";
import type { ReadingPassage, QuizQuestion } from '@/app/admin/site-management/ai-content/readingPassageSchemas';
import { submitReadingQuiz, type ReadingQuizFormState, type ReadingQuizResult } from "./actions";

type ReadingAssessmentClientProps = {
  passages: ReadingPassage[];
};

const initialQuizState: ReadingQuizFormState = {
  message: "",
  isSuccess: false,
  quizResult: undefined,
};

export default function ReadingAssessmentClient({ passages }: ReadingAssessmentClientProps) {
  const { toast } = useToast();
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({}); // { questionId: selectedOptionText }
  
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [quizState, setQuizState] = useState<ReadingQuizFormState>(initialQuizState);

  useEffect(() => {
    // Pre-select the first passage if available
    if (passages.length > 0 && !selectedPassage) {
      setSelectedPassage(passages[0]);
    }
  }, [passages, selectedPassage]);

  const handlePassageChange = (passageId: string) => {
    const passage = passages.find(p => p.id === passageId);
    setSelectedPassage(passage || null);
    setStudentAnswers({}); 
    setQuizState(initialQuizState);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setStudentAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedPassage || !selectedPassage.questions || selectedPassage.questions.length === 0) {
      toast({ title: "No Questions", description: "This passage has no questions to answer.", variant: "destructive" });
      return;
    }
    if (Object.keys(studentAnswers).length !== selectedPassage.questions.length) {
       toast({ title: "Incomplete", description: "Please answer all questions before submitting.", variant: "destructive" });
      return;
    }

    startSubmitTransition(async () => {
      const result = await submitReadingQuiz(selectedPassage.id, studentAnswers);
      setQuizState(result);
      if (result.isSuccess && result.quizResult) {
        toast({ title: "Quiz Submitted!", description: `You scored ${result.quizResult.score}%` });
      } else {
        toast({ title: "Submission Failed", description: result.message || "Could not process your quiz.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>1. Select a Reading Passage</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="passage-select-reading">Choose a passage to read:</Label>
          <Select
            onValueChange={handlePassageChange}
            defaultValue={selectedPassage?.id}
            disabled={isSubmitting}
          >
            <SelectTrigger id="passage-select-reading" className="w-full mt-1">
              <SelectValue placeholder="Select a passage" />
            </SelectTrigger>
            <SelectContent>
              {passages.map(passage => (
                <SelectItem key={passage.id} value={passage.id}>
                  {passage.topic} ({passage.difficultyLevel || 'N/A'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPassage && (
            <Card className="mt-4 bg-muted/50 max-h-96 overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-lg text-primary">{selectedPassage.topic}</CardTitle>
                <CardDescription>TEF Section: {selectedPassage.tefSection || 'N/A'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{selectedPassage.passageText}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {selectedPassage && selectedPassage.questions && selectedPassage.questions.length > 0 && !quizState.isSuccess && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>2. Answer the Questions</CardTitle>
            <CardDescription>Read each question carefully and select the best answer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedPassage.questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-md bg-background">
                <p className="font-medium text-foreground mb-1">Question {index + 1}: {question.questionText}</p>
                {question.tefSkillTarget && <p className="text-xs text-muted-foreground mb-3">Skill: {question.tefSkillTarget}</p>}
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                  value={studentAnswers[question.id]}
                  disabled={isSubmitting}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-option-${optionIndex}`} />
                      <Label htmlFor={`${question.id}-option-${optionIndex}`} className="font-normal text-sm">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || Object.keys(studentAnswers).length !== selectedPassage.questions.length} 
              className="w-full"
            >
              {isSubmitting ? (
                <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Submitting Quiz...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Submit Quiz</>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {selectedPassage && (!selectedPassage.questions || selectedPassage.questions.length === 0) && !isSubmitting && (
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertTitle>No Questions Available</AlertTitle>
            <AlertDescription>
              This reading passage does not have any questions associated with it yet.
            </AlertDescription>
          </Alert>
      )}

      {quizState.message && !quizState.isSuccess && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{quizState.message}</AlertDescription>
        </Alert>
      )}

      {quizState.isSuccess && quizState.quizResult && (
        <Card className="shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Sparkles className="h-6 w-6" /> Reading Quiz Results
            </CardTitle>
            <CardDescription>Passage: {quizState.quizResult.passageTopic}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Overall Score: <span className="text-accent font-bold">{quizState.quizResult.score}%</span> 
                <span className="text-base text-muted-foreground"> ({quizState.quizResult.correctlyAnswered} / {quizState.quizResult.totalQuestions} correct)</span>
              </h3>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-foreground">Detailed Results:</h4>
              {quizState.quizResult.results.map((result, index) => (
                <Card key={result.questionId} className={`border-l-4 ${result.isCorrect ? 'border-green-500' : 'border-red-500'} bg-background/70`}>
                  <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-foreground">Q{index + 1}: {result.questionText}</p>
                    <p className="text-sm">
                      Your Answer: <span className={result.isCorrect ? 'text-green-700' : 'text-red-700'}>{result.studentAnswer || "No answer"}</span>
                      {!result.isCorrect && <span className="text-green-700 ml-2">(Correct: {result.correctAnswer})</span>}
                    </p>
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 inline-block mr-1" /> 
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 inline-block mr-1" />
                    )}
                    <span className={`font-semibold ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={() => {
                setSelectedPassage(null); // Or reset to the first passage
                setStudentAnswers({});
                setQuizState(initialQuizState);
                setTimeout(() => { // Allow state to reset before potentially re-selecting
                  if (passages.length > 0) setSelectedPassage(passages[0]);
                }, 0);
              }}
              variant="outline"
            >
              Try Another Passage <ChevronsUpDown className="ml-2 h-4 w-4"/>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
