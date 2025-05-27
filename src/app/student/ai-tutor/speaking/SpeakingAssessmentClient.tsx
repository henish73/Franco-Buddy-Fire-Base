
// src/app/student/ai-tutor/speaking/SpeakingAssessmentClient.tsx
"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Mic, StopCircle, Play, AlertCircle, CheckCircle, RefreshCw, Sparkles, Send } from "lucide-react";
import type { SpeakingPrompt } from "@/app/admin/ai-content/page";
import { submitSpeakingAssessment, type SpeakingAssessmentFormState } from "./actions";
import type { SpeakingAssessmentOutput } from "@/ai/flows/speakingAssessmentFlow";

type SpeakingAssessmentClientProps = {
  prompts: SpeakingPrompt[];
};

const initialAssessmentState: SpeakingAssessmentFormState = {
  message: "",
  isSuccess: false,
  assessmentResult: undefined,
};

export default function SpeakingAssessmentClient({ prompts }: SpeakingAssessmentClientProps) {
  const { toast } = useToast();
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt | null>(prompts[0] || null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null); // null: not checked, true: granted, false: denied
  
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [assessmentState, setAssessmentState] = useState<SpeakingAssessmentFormState>(initialAssessmentState);

  useEffect(() => {
    // Check for microphone permission on component mount
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasMicPermission(true))
      .catch(() => setHasMicPermission(false));
  }, []);

  const handlePromptChange = (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    setSelectedPrompt(prompt || null);
    setAudioBlob(null);
    setAudioUrl(null);
    setAssessmentState(initialAssessmentState); // Reset assessment when prompt changes
  };

  const startRecording = async () => {
    if (!selectedPrompt) {
      toast({ title: "Select a Prompt", description: "Please select a speaking prompt first.", variant: "destructive" });
      return;
    }
    if (hasMicPermission === false) {
      toast({ title: "Microphone Access Denied", description: "Please enable microphone access in your browser settings.", variant: "destructive" });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Standard webm
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop()); // Release microphone
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioBlob(null);
      setAudioUrl(null);
      setAssessmentState(initialAssessmentState);
      toast({ title: "Recording Started", description: "Speak clearly into your microphone." });
    } catch (err) {
      console.error("Error starting recording:", err);
      setHasMicPermission(false);
      toast({ title: "Microphone Error", description: "Could not start recording. Please check microphone permissions and try again.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: "Recording Stopped", description: "Your audio has been recorded." });
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob || !selectedPrompt) {
      toast({ title: "Missing Information", description: "Please record audio for the selected prompt.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64Audio = reader.result as string;
      startSubmitTransition(async () => {
        const result = await submitSpeakingAssessment(selectedPrompt.promptText, base64Audio);
        setAssessmentState(result);
        if (result.isSuccess) {
          toast({ title: "Assessment Complete!", description: "Your feedback is ready below." });
        } else {
          toast({ title: "Assessment Failed", description: result.message || "Could not process your assessment.", variant: "destructive" });
        }
      });
    };
  };

  return (
    <div className="space-y-6">
      {hasMicPermission === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Microphone Access Required</AlertTitle>
          <AlertDescription>
            This feature requires microphone access. Please enable it in your browser settings and refresh the page.
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>1. Select a Speaking Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="prompt-select">Choose a topic to speak about:</Label>
          <Select
            onValueChange={handlePromptChange}
            defaultValue={selectedPrompt?.id}
            disabled={isRecording || isSubmitting}
          >
            <SelectTrigger id="prompt-select" className="w-full mt-1">
              <SelectValue placeholder="Select a prompt" />
            </SelectTrigger>
            <SelectContent>
              {prompts.map(prompt => (
                <SelectItem key={prompt.id} value={prompt.id}>
                  {prompt.topic} - {prompt.promptText.substring(0, 50)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPrompt && (
            <Card className="mt-4 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg text-primary">{selectedPrompt.topic}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{selectedPrompt.promptText}</p>
                {selectedPrompt.expectedKeywords && selectedPrompt.expectedKeywords.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try to include keywords like: {selectedPrompt.expectedKeywords.join(', ')}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>2. Record Your Response</CardTitle>
          <CardDescription>Click "Start Recording" and speak clearly. Click "Stop Recording" when finished.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {!isRecording ? (
              <Button onClick={startRecording} disabled={!selectedPrompt || hasMicPermission === false || isSubmitting} className="w-full sm:w-auto">
                <Mic className="mr-2 h-4 w-4" /> Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="destructive" className="w-full sm:w-auto">
                <StopCircle className="mr-2 h-4 w-4" /> Stop Recording
              </Button>
            )}
            {isRecording && <p className="text-primary animate-pulse font-medium">Recording...</p>}
          </div>
          {audioUrl && (
            <div className="space-y-2">
              <Label>Your Recording:</Label>
              <audio src={audioUrl} controls className="w-full" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={!audioBlob || isSubmitting || isRecording} className="w-full">
            {isSubmitting ? (
              <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Submit for Assessment</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {assessmentState.message && (
        <Alert variant={assessmentState.isSuccess ? "default" : "destructive"}>
          {assessmentState.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{assessmentState.isSuccess ? "Assessment Feedback" : "Error"}</AlertTitle>
          <AlertDescription>{assessmentState.message}</AlertDescription>
        </Alert>
      )}

      {assessmentState.isSuccess && assessmentState.assessmentResult && (
        <Card className="shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Sparkles className="h-6 w-6" /> Your AI Speaking Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Overall Score: <span className="text-accent font-bold">{assessmentState.assessmentResult.score}/100</span></h3>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-foreground">Transcription:</h4>
              <p className="text-muted-foreground bg-background/50 p-3 rounded-md whitespace-pre-wrap">{assessmentState.assessmentResult.transcription}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
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
