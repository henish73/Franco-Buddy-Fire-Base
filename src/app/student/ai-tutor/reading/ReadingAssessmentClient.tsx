
// src/app/student/ai-tutor/reading/ReadingAssessmentClient.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, RefreshCw, Sparkles, Send, BookOpen } from "lucide-react";
import type { ReadingPassage } from '@/app/admin/ai-content/readingPassageSchemas';
import { submitReadingAssessment, type ReadingAssessmentFormState } from "./actions";

type ReadingAssessmentClientProps = {
  passages: ReadingPassage[];
};

const initialAssessmentState: ReadingAssessmentFormState = {
  message: "",
  isSuccess: false,
  assessmentResult: undefined,
};

export default function ReadingAssessmentClient({ passages }: ReadingAssessmentClientProps) {
  const { toast } = useToast();
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(passages[0] || null);
  const [studentResponse, setStudentResponse] = useState<string>("");
  
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [assessmentState, setAssessmentState] = useState<ReadingAssessmentFormState>(initialAssessmentState);

  const handlePassageChange = (passageId: string) => {
    const passage = passages.find(p => p.id === passageId);
    setSelectedPassage(passage || null);
    setStudentResponse(""); 
    setAssessmentState(initialAssessmentState);
  };

  const handleSubmit = async () => {
    if (!selectedPassage || !studentResponse.trim()) {
      toast({ title: "Missing Information", description: "Please select a passage and write a response.", variant: "destructive" });
      return;
    }

    startSubmitTransition(async () => {
      const result = await submitReadingAssessment(selectedPassage.passageText, studentResponse);
      setAssessmentState(result);
      if (result.isSuccess) {
        toast({ title: "Assessment Complete!", description: "Your reading feedback is ready below." });
      } else {
        toast({ title: "Assessment Failed", description: result.message || "Could not process your assessment.", variant: "destructive" });
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
                  {passage.topic} - {passage.passageText.substring(0, 70)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPassage && (
            <Card className="mt-4 bg-muted/50 max-h-96 overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-lg text-primary">{selectedPassage.topic}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{selectedPassage.passageText}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>2. Your Response</CardTitle>
          <CardDescription>After reading the passage, please write your response below (e.g., summarize, answer specific questions if provided in passage, or as instructed by your teacher).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={studentResponse}
            onChange={(e) => setStudentResponse(e.target.value)}
            placeholder="Write your summary or answers here..."
            rows={10}
            disabled={!selectedPassage || isSubmitting}
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={!selectedPassage || !studentResponse.trim() || isSubmitting} className="w-full">
            {isSubmitting ? (
              <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Submitting for Assessment...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Submit for Assessment</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {assessmentState.message && !assessmentState.isSuccess && ( // Only show general error messages here if not successful
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
              <Sparkles className="h-6 w-6" /> Your AI Reading Feedback
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
