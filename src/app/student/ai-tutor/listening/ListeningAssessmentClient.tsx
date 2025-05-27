
// src/app/student/ai-tutor/listening/ListeningAssessmentClient.tsx
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, RefreshCw, Sparkles, Send, Headphones, Play, Pause, Volume2 } from "lucide-react";
import type { ListeningAudio } from '@/app/admin/ai-content/listeningAudioSchemas';
import { submitListeningAssessment, type ListeningAssessmentFormState } from "./actions";

type ListeningAssessmentClientProps = {
  audioItems: ListeningAudio[];
};

const initialAssessmentState: ListeningAssessmentFormState = {
  message: "",
  isSuccess: false,
  assessmentResult: undefined,
};

export default function ListeningAssessmentClient({ audioItems }: ListeningAssessmentClientProps) {
  const { toast } = useToast();
  const [selectedAudioItem, setSelectedAudioItem] = useState<ListeningAudio | null>(audioItems[0] || null);
  const [studentResponse, setStudentResponse] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [assessmentState, setAssessmentState] = useState<ListeningAssessmentFormState>(initialAssessmentState);

  const handleAudioItemChange = (itemId: string) => {
    const item = audioItems.find(i => i.id === itemId);
    setSelectedAudioItem(item || null);
    setStudentResponse(""); 
    setAssessmentState(initialAssessmentState);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      }
      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', () => setIsPlaying(false));

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', () => setIsPlaying(false));
      }
    }
  }, [selectedAudioItem]);


  const handleSubmit = async () => {
    if (!selectedAudioItem || !studentResponse.trim()) {
      toast({ title: "Missing Information", description: "Please select an audio item and write a response.", variant: "destructive" });
      return;
    }
    if (!selectedAudioItem.transcript) {
      toast({ title: "Missing Transcript", description: "This audio item does not have a transcript for assessment.", variant: "destructive" });
      return;
    }

    startSubmitTransition(async () => {
      const result = await submitListeningAssessment(selectedAudioItem.transcript!, studentResponse);
      setAssessmentState(result);
      if (result.isSuccess) {
        toast({ title: "Assessment Complete!", description: "Your listening feedback is ready below." });
      } else {
        toast({ title: "Assessment Failed", description: result.message || "Could not process your assessment.", variant: "destructive" });
      }
    });
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>1. Select an Audio Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="audio-select-listening">Choose an audio exercise:</Label>
          <Select
            onValueChange={handleAudioItemChange}
            defaultValue={selectedAudioItem?.id}
            disabled={isSubmitting}
          >
            <SelectTrigger id="audio-select-listening" className="w-full mt-1">
              <SelectValue placeholder="Select an audio exercise" />
            </SelectTrigger>
            <SelectContent>
              {audioItems.map(item => (
                <SelectItem key={item.id} value={item.id}>
                  {item.topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAudioItem && (
            <Card className="mt-4 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg text-primary">{selectedAudioItem.topic}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAudioItem.audioFileUrlOrName ? (
                  <div className="space-y-2">
                    <audio ref={audioRef} src={selectedAudioItem.audioFileUrlOrName} className="hidden" preload="metadata"></audio>
                    <div className="flex items-center gap-2">
                      <Button onClick={togglePlayPause} size="icon" variant="outline">
                        {isPlaying ? <Pause className="h-5 w-5"/> : <Play className="h-5 w-5"/>}
                      </Button>
                      <input 
                        type="range" 
                        min="0" 
                        max={duration || 0} 
                        value={currentTime} 
                        onChange={(e) => {
                          if(audioRef.current) audioRef.current.currentTime = Number(e.target.value);
                        }}
                        className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-xs text-muted-foreground">{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>
                    {/* Basic Volume control placeholder - full component would be more complex */}
                    {/* <div className="flex items-center gap-1"><Volume2 className="h-4 w-4"/> <input type="range" min="0" max="1" step="0.1" defaultValue="1" onChange={e => {if(audioRef.current) audioRef.current.volume = Number(e.target.value)}}/></div> */}
                    
                  </div>
                ) : (
                  <p className="text-muted-foreground">No audio file linked. Reading transcript instead.</p>
                )}
                {selectedAudioItem.transcript && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-primary">View Transcript</summary>
                    <div className="mt-1 p-3 bg-background/30 rounded max-h-60 overflow-y-auto">
                        <p className="text-foreground/80 whitespace-pre-wrap">{selectedAudioItem.transcript}</p>
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>2. Your Response</CardTitle>
          <CardDescription>After listening to the audio (or reading the transcript), please write your response below (e.g., summarize, answer specific questions if provided, or as instructed).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={studentResponse}
            onChange={(e) => setStudentResponse(e.target.value)}
            placeholder="Write your summary or answers here..."
            rows={10}
            disabled={!selectedAudioItem || isSubmitting}
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={!selectedAudioItem || !studentResponse.trim() || isSubmitting || !selectedAudioItem.transcript} className="w-full">
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
              <Sparkles className="h-6 w-6" /> Your AI Listening Feedback
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
