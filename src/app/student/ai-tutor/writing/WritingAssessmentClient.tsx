// src/app/student/ai-tutor/writing/WritingAssessmentClient.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, RefreshCw, Sparkles, Send } from "lucide-react";
import type { WritingPrompt } from '@/app/admin/ai-content/writingPromptSchemas';
import { submitWritingAssessment, type WritingAssessmentFormState } from "./actions";

type WritingAssessmentClientProps = {
  prompts: WritingPrompt[];
};

const initialAssessmentState: WritingAssessmentFormState = {
  message: "",
  isSuccess: false,
  assessmentResult: undefined,
};

export default function WritingAssessmentClient({ prompts }: WritingAssessmentClientProps) {
  const { toast } = useToast();
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(prompts[0] || null);
  const [studentResponse, setStudentResponse] = useState<string>("");
  
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [assessmentState, setAssessmentState] = useState<WritingAssessmentFormState>(initialAssessmentState);

  const handlePromptChange = (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    setSelectedPrompt(prompt || null);
    setStudentResponse(""); // Clear response when prompt changes
    setAssessmentState(initialAssessmentState); // Reset assessment
  };

  const handleSubmit = async () => {
    if (!selectedPrompt || !studentResponse.trim()) {
      toast({ title: "Missing Information", description: "Please select a prompt and write a response.", variant: "destructive" });
      return;
    }

    startSubmitTransition(async () => {
      const result = await submitWritingAssessment({
        promptText: selectedPrompt.promptText,
        studentResponseText: studentResponse,
        tefSection: selectedPrompt.tefSection,
        difficultyLevel: selectedPrompt.difficultyLevel
      });
      setAssessmentState(result);
      if (result.isSuccess) {
        toast({ title: "Assessment Complete!", description: "Your feedback is ready below." });
      } else {
        toast({ title: "Assessment Failed", description: result.message || "Could not process your assessment.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>1. Select a Writing Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="prompt-select-writing">Choose a topic to write about:</Label>
          <Select
            onValueChange={handlePromptChange}
            defaultValue={selectedPrompt?.id}
            disabled={isSubmitting}
          >
            <SelectTrigger id="prompt-select-writing" className="w-full mt-1">
              <SelectValue placeholder="Select a prompt" />
            </SelectTrigger>
            <SelectContent>
              {prompts.map(prompt => (
                <SelectItem key={prompt.id} value={prompt.id}>
                  {prompt.topic} - ({prompt.taskType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPrompt && (
            <Card className="mt-4 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg text-primary">{selectedPrompt.topic} ({selectedPrompt.taskType})</CardTitle>
                 <CardDescription>
                   {selectedPrompt.tefSection} - {selectedPrompt.difficultyLevel}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{selectedPrompt.promptText}</p>
                {selectedPrompt.sampleResponse && (
                    <details className="mt-3 text-sm">
                        <summary className="cursor-pointer text-muted-foreground hover:text-primary">View Sample Response (Spoiler)</summary>
                        <p className="mt-1 p-2 bg-background/30 rounded text-foreground/80 whitespace-pre-wrap">{selectedPrompt.sampleResponse}</p>
                    </details>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>2. Write Your Response</CardTitle>
          <CardDescription>Compose your response in the text area below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={studentResponse}
            onChange={(e) => setStudentResponse(e.target.value)}
            placeholder="Start writing your response here..."
            rows={10}
            disabled={!selectedPrompt || isSubmitting}
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={!selectedPrompt || !studentResponse.trim() || isSubmitting} className="w-full">
            {isSubmitting ? (
              <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Submitting for Assessment...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Submit for Assessment</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {assessmentState.message && !assessmentState.isSuccess && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{assessmentState.message}</AlertDescription>
        </Alert>
      )}

      {assessmentState.isSuccess && assessmentState.assessmentResult && (
        <Card className="shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Sparkles className="h-6 w-6" /> Your AI Writing Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Overall Score: <span className="text-accent font-bold">{assessmentState.assessmentResult.score}/100</span></h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                {Object.entries(assessmentState.assessmentResult.feedback).map(([key, value]) => (
                    <div key={key}>
                        <h5 className="font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</h5>
                        <p className="text-sm text-muted-foreground">{value as string}</p>
                    </div>
                ))}
            </div>
            
            {assessmentState.assessmentResult.suggestionsForImprovement && assessmentState.assessmentResult.suggestionsForImprovement.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg text-foreground">Suggestions for Improvement:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-4">
                  {assessmentState.assessmentResult.suggestionsForImprovement.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
