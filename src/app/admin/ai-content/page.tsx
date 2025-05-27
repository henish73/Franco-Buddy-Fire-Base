// src/app/admin/ai-content/page.tsx
"use client";

import { useState, useEffect, useTransition, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, PlusCircle, Edit3, Trash2, Mic, MessageSquareText, RefreshCw, FileAudio, FileQuestion } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFormState } from 'react-dom';

import {
  getSpeakingPromptsAction,
  addSpeakingPromptAction,
  updateSpeakingPromptAction,
  deleteSpeakingPromptAction,
} from './speakingPromptActions';
import { 
  speakingPromptSchema, 
  type SpeakingPromptFormData, 
  type SpeakingPromptFormState, 
  type SpeakingPrompt 
} from './speakingPromptSchemas';


const initialSpeakingPromptFormState: SpeakingPromptFormState = { message: "", isSuccess: false, errors: {} };

export default function AdminAIContentPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // --- Speaking Prompts State & Forms ---
  const [speakingPrompts, setSpeakingPrompts] = useState<SpeakingPrompt[]>([]);
  const [isSpeakingPromptDialogOpen, setIsSpeakingPromptDialogOpen] = useState(false);
  const [editingSpeakingPrompt, setEditingSpeakingPrompt] = useState<SpeakingPrompt | null>(null);

  const speakingPromptForm = useForm<SpeakingPromptFormData>({
    resolver: zodResolver(speakingPromptSchema), 
    defaultValues: { topic: "", promptText: "", expectedKeywords: "" }
  });
  const [speakingPromptServerState, speakingPromptFormAction] = useFormState(
    editingSpeakingPrompt ? updateSpeakingPromptAction : addSpeakingPromptAction,
    initialSpeakingPromptFormState
  );

  // --- Data Fetching Effects ---
  const fetchSpeakingPrompts = async () => {
    startTransition(async () => {
      const result = await getSpeakingPromptsAction();
      if (result.isSuccess && result.data) {
        setSpeakingPrompts(result.data as SpeakingPrompt[]);
      } else {
        toast({ title: "Error", description: result.message || "Failed to fetch speaking prompts.", variant: "destructive" });
      }
    });
  };

  useEffect(() => {
    fetchSpeakingPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Speaking Prompt Management ---
  const openAddSpeakingPromptDialog = () => {
    speakingPromptForm.reset({ topic: "", promptText: "", expectedKeywords: "" });
    setEditingSpeakingPrompt(null);
    setIsSpeakingPromptDialogOpen(true);
  };

  const openEditSpeakingPromptDialog = (prompt: SpeakingPrompt) => {
    setEditingSpeakingPrompt(prompt);
    speakingPromptForm.reset({
      ...prompt,
      expectedKeywords: Array.isArray(prompt.expectedKeywords) ? prompt.expectedKeywords.join(', ') : '',
    });
    setIsSpeakingPromptDialogOpen(true);
  };

  const handleSpeakingPromptFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (editingSpeakingPrompt && editingSpeakingPrompt.id) {
      formData.append('id', editingSpeakingPrompt.id);
    }

    speakingPromptForm.handleSubmit(async (data) => {
      startTransition(async () => {
        const actionToCall = editingSpeakingPrompt ? updateSpeakingPromptAction : addSpeakingPromptAction;
        const result = await actionToCall(initialSpeakingPromptFormState, formData); 
        if (result.isSuccess) {
          toast({ title: "Success", description: result.message });
          setIsSpeakingPromptDialogOpen(false);
          fetchSpeakingPrompts();
        } else {
          toast({ title: "Error", description: result.message || "Failed to save speaking prompt.", variant: "destructive" });
          if (result.errors) { 
            (Object.keys(result.errors) as Array<keyof SpeakingPromptFormData>).forEach(key => {
               if (result.errors && result.errors[key]) {
                 speakingPromptForm.setError(key, { type: 'server', message: result.errors[key]![0] });
               }
            });
          }
        }
      });
    })(event);
  };

  const handleDeleteSpeakingPrompt = (promptId: string) => {
    startTransition(async () => {
      const result = await deleteSpeakingPromptAction(promptId);
      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
        fetchSpeakingPrompts();
      } else {
        toast({ title: "Error", description: result.message || "Failed to delete speaking prompt.", variant: "destructive" });
      }
    });
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">AI Tutor Content Management</h1>

      <Tabs defaultValue="speaking_prompts">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 md:max-w-2xl">
          <TabsTrigger value="speaking_prompts"><Mic className="mr-2 h-4 w-4" />Speaking Prompts</TabsTrigger>
          <TabsTrigger value="writing_prompts"><MessageSquareText className="mr-2 h-4 w-4" />Writing Prompts</TabsTrigger>
          <TabsTrigger value="reading_passages"><FileQuestion className="mr-2 h-4 w-4" />Reading Passages</TabsTrigger>
          <TabsTrigger value="listening_audio"><FileAudio className="mr-2 h-4 w-4" />Listening Audio</TabsTrigger>
        </TabsList>

        {/* Speaking Prompts Tab Content */}
        <TabsContent value="speaking_prompts" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Speaking Prompts</h2>
            <div>
              <Button onClick={fetchSpeakingPrompts} variant="outline" size="icon" className="mr-2" aria-label="Refresh Speaking Prompts" disabled={isPending}>
                <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={openAddSpeakingPromptDialog} disabled={isPending}><PlusCircle className="mr-2 h-4 w-4" /> Add New Speaking Prompt</Button>
            </div>
          </div>
          <Dialog open={isSpeakingPromptDialogOpen} onOpenChange={setIsSpeakingPromptDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingSpeakingPrompt ? "Edit Speaking Prompt" : "Add New Speaking Prompt"}</DialogTitle>
                <DialogDescription>
                  {editingSpeakingPrompt ? "Update the details of this speaking prompt." : "Enter the details for the new speaking prompt."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSpeakingPromptFormSubmit} id="speakingPromptForm" className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="topic">Topic / Category</Label>
                  <Input id="topic" {...speakingPromptForm.register("topic")} placeholder="e.g., Daily Life, Opinions" />
                  {speakingPromptForm.formState.errors.topic && <p className="text-sm text-destructive mt-1">{speakingPromptForm.formState.errors.topic.message}</p>}
                  {speakingPromptServerState.errors?.topic && !speakingPromptForm.formState.errors.topic && <p className="text-sm text-destructive mt-1">{speakingPromptServerState.errors.topic[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="promptText">Prompt Text</Label>
                  <Textarea id="promptText" {...speakingPromptForm.register("promptText")} placeholder="Enter the full speaking prompt text here..." rows={4} />
                  {speakingPromptForm.formState.errors.promptText && <p className="text-sm text-destructive mt-1">{speakingPromptForm.formState.errors.promptText.message}</p>}
                  {speakingPromptServerState.errors?.promptText && !speakingPromptForm.formState.errors.promptText && <p className="text-sm text-destructive mt-1">{speakingPromptServerState.errors.promptText[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="expectedKeywords">Expected Keywords (Optional)</Label>
                  <Input id="expectedKeywords" {...speakingPromptForm.register("expectedKeywords")} placeholder="Comma-separated, e.g., bonjour, merci, s'il vous plaît" />
                  {speakingPromptForm.formState.errors.expectedKeywords && <p className="text-sm text-destructive mt-1">{speakingPromptForm.formState.errors.expectedKeywords.message}</p>}
                  {speakingPromptServerState.errors?.expectedKeywords && !speakingPromptForm.formState.errors.expectedKeywords && <p className="text-sm text-destructive mt-1">{speakingPromptServerState.errors.expectedKeywords[0]}</p>}
                </div>
                {/* Add more fields like audioExampleUrl, difficultyLevel, associatedCourseModule in future iterations */}
                {speakingPromptServerState.message && !speakingPromptServerState.isSuccess && (
                    <p className="text-sm text-destructive text-center">{speakingPromptServerState.message}</p>
                 )}
              </form>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsSpeakingPromptDialogOpen(false)} disabled={isPending}>Cancel</Button>
                <Button type="submit" form="speakingPromptForm" disabled={isPending || speakingPromptForm.formState.isSubmitting}>{isPending ? "Saving..." : (editingSpeakingPrompt ? "Save Changes" : "Add Prompt")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Prompt Text (Snippet)</TableHead>
                  <TableHead className="hidden md:table-cell">Keywords</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {speakingPrompts.map((prompt) => (
                  <TableRow key={prompt.id}>
                    <TableCell className="font-medium">{prompt.topic}</TableCell>
                    <TableCell className="max-w-xs truncate">{prompt.promptText}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-sm truncate">
                      {Array.isArray(prompt.expectedKeywords) ? prompt.expectedKeywords.join(', ') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditSpeakingPromptDialog(prompt)}><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteSpeakingPrompt(prompt.id!)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {speakingPrompts.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No speaking prompts found.</p>}
          {isPending && <p className="text-center text-muted-foreground py-8">Loading prompts...</p>}
        </TabsContent>

        {/* Writing Prompts Tab Content */}
        <TabsContent value="writing_prompts" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquareText className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Writing Prompt Management</h2>
            <p>This section is coming soon! You will be able to manage prompts for AI-powered writing assessments here.</p>
          </div>
        </TabsContent>
        
        {/* Reading Passages Tab Content */}
        <TabsContent value="reading_passages" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            <FileQuestion className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Reading Passage Management</h2>
            <p>This section is coming soon! You will be able to manage reading passages and questions for AI-powered reading comprehension exercises.</p>
          </div>
        </TabsContent>
        
        {/* Listening Audio Tab Content */}
        <TabsContent value="listening_audio" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            <FileAudio className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Listening Audio Management</h2>
            <p>This section is coming soon! You will be able to manage audio clips and questions for AI-powered listening comprehension exercises.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
