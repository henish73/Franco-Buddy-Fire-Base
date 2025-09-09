// src/app/(public)/ai-course-suggester/AISuggestionForm.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Sparkles, Lightbulb } from "lucide-react";
import { getCourseSuggestion, type AISuggestionFormState } from "./actions";

const initialState: AISuggestionFormState = {
  message: "",
  isSuccess: false,
  suggestion: undefined,
};

const frenchLevels = ["Beginner", "Lower Intermediate", "Upper Intermediate", "Advanced"]; // Consistent with demo form

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Getting Suggestion...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Get My Course Suggestion
        </>
      )}
    </Button>
  );
}

export default function AISuggestionForm() {
  const [state, formAction] = useActionState(getCourseSuggestion, initialState);

  return (
    <div className="w-full max-w-2xl">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">AI-Powered Course Suggester</CardTitle>
          <CardDescription>Let our intelligent assistant recommend the best TEF Canada course for you based on your profile and goals.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="tefGoal">What is your primary goal for taking the TEF Canada exam?</Label>
              <Input id="tefGoal" name="tefGoal" placeholder="e.g., Canadian immigration (Express Entry), Work permit, University admission" required />
              {state.errors?.tefGoal && <p className="text-sm text-destructive mt-1">{state.errors.tefGoal.join(', ')}</p>}
            </div>

            <div>
              <Label htmlFor="frenchLevel">What is your current French language level?</Label>
              <Select name="frenchLevel" required>
                <SelectTrigger id="frenchLevel">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {frenchLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.frenchLevel && <p className="text-sm text-destructive mt-1">{state.errors.frenchLevel.join(', ')}</p>}
            </div>

            <div>
              <Label htmlFor="background">Tell us about your background.</Label>
              <Textarea 
                id="background" 
                name="background" 
                placeholder="Include previous French learning experiences, specific challenges, time availability for study, etc." 
                rows={5} 
                required 
              />
              {state.errors?.background && <p className="text-sm text-destructive mt-1">{state.errors.background.join(', ')}</p>}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state.message && !state.suggestion && (
        <Alert variant={state.isSuccess ? "default" : "destructive"} className="mt-6">
            {state.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{state.isSuccess ? "Information" : "Error!"}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.isSuccess && state.suggestion && (
        <Card className="mt-8 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Sparkles className="h-6 w-6" /> Your Personalized Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg text-foreground">Suggested Course:</h4>
              <p className="text-xl text-accent font-bold">{state.suggestion.suggestedCourse}</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-foreground">Reasoning:</h4>
              <p className="text-muted-foreground leading-relaxed">{state.suggestion.reasoning}</p>
            </div>
          </CardContent>
          <CardFooter>
             <Button asChild variant="default">
                <a href="/courses">Explore Our Courses</a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
