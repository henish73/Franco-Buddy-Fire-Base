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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, PlusCircle, Edit3, Trash2, Mic, MessageSquareText, RefreshCw, FileAudio, FileQuestion, BookOpen } from "lucide-react";
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

import {
  getWritingPromptsAction,
  addWritingPromptAction,
  updateWritingPromptAction,
  deleteWritingPromptAction,
} from './writingPromptActions';
import { 
  writingPromptSchema, 
  type WritingPromptFormData, 
  type WritingPromptFormState, 
  type WritingPrompt 
} from './writingPromptSchemas';

import {
  getReadingPassagesAction,
  addReadingPassageAction,
  updateReadingPassageAction,
  deleteReadingPassageAction,
} from './readingPassageActions';
import { 
  readingPassageSchema, 
  type ReadingPassageFormData, 
  type ReadingPassageFormState, 
  type ReadingPassage 
} from './readingPassageSchemas';

import {
  getListeningAudioAction,
  addListeningAudioAction,
  updateListeningAudioAction,
  deleteListeningAudioAction,
} from './listeningAudioActions';
import { 
  listeningAudioSchema, 
  type ListeningAudioFormData, 
  type ListeningAudioFormState, 
  type ListeningAudio 
} from './listeningAudioSchemas';


const initialSpeakingPromptFormState: SpeakingPromptFormState = { message: "", isSuccess: false, errors: {} };
const initialWritingPromptFormState: WritingPromptFormState = { message: "", isSuccess: false, errors: {} };
const initialReadingPassageFormState: ReadingPassageFormState = { message: "", isSuccess: false, errors: {} };
const initialListeningAudioFormState: ListeningAudioFormState = { message: "", isSuccess: false, errors: {} };

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

  // --- Writing Prompts State & Forms ---
  const [writingPrompts, setWritingPrompts] = useState<WritingPrompt[]>([]);
  const [isWritingPromptDialogOpen, setIsWritingPromptDialogOpen] = useState(false);
  const [editingWritingPrompt, setEditingWritingPrompt] = useState<WritingPrompt | null>(null);

  const writingPromptForm = useForm<WritingPromptFormData>({
    resolver: zodResolver(writingPromptSchema),
    defaultValues: { topic: "", taskType: "", promptText: "", sampleResponse: "" }
  });
  const [writingPromptServerState, writingPromptFormAction] = useFormState(
    editingWritingPrompt ? updateWritingPromptAction : addWritingPromptAction,
    initialWritingPromptFormState
  );

  // --- Reading Passages State & Forms ---
  const [readingPassages, setReadingPassages] = useState<ReadingPassage[]>([]);
  const [isReadingPassageDialogOpen, setIsReadingPassageDialogOpen] = useState(false);
  const [editingReadingPassage, setEditingReadingPassage] = useState<ReadingPassage | null>(null);
  
  const readingPassageForm = useForm<ReadingPassageFormData>({
    resolver: zodResolver(readingPassageSchema),
    defaultValues: { topic: "", passageText: "" }
  });
  const [readingPassageServerState, readingPassageFormAction] = useFormState(
    editingReadingPassage ? updateReadingPassageAction : addReadingPassageAction,
    initialReadingPassageFormState
  );

  // --- Listening Audio State & Forms ---
  const [listeningAudioItems, setListeningAudioItems] = useState<ListeningAudio[]>([]);
  const [isListeningAudioDialogOpen, setIsListeningAudioDialogOpen] = useState(false);
  const [editingListeningAudio, setEditingListeningAudio] = useState<ListeningAudio | null>(null);

  const listeningAudioForm = useForm<ListeningAudioFormData>({
    resolver: zodResolver(listeningAudioSchema),
    defaultValues: { topic: "", audioFileUrlOrName: "", transcript: "" }
  });
  const [listeningAudioServerState, listeningAudioFormAction] = useFormState(
    editingListeningAudio ? updateListeningAudioAction : addListeningAudioAction,
    initialListeningAudioFormState
  );


  // --- Data Fetching Effects ---
  const fetchData = (type: 'speaking' | 'writing' | 'reading' | 'listening') => {
    startTransition(async () => {
      let result;
      switch (type) {
        case 'speaking':
          result = await getSpeakingPromptsAction();
          if (result.isSuccess && result.data) setSpeakingPrompts(result.data as SpeakingPrompt[]);
          break;
        case 'writing':
          result = await getWritingPromptsAction();
          if (result.isSuccess && result.data) setWritingPrompts(result.data as WritingPrompt[]);
          break;
        case 'reading':
          result = await getReadingPassagesAction();
          if (result.isSuccess && result.data) setReadingPassages(result.data as ReadingPassage[]);
          break;
        case 'listening':
          result = await getListeningAudioAction();
          if (result.isSuccess && result.data) setListeningAudioItems(result.data as ListeningAudio[]);
          break;
      }
      if (result && !result.isSuccess) {
        toast({ title: "Error", description: result.message || `Failed to fetch ${type} content.`, variant: "destructive" });
      }
    });
  };

  useEffect(() => {
    fetchData('speaking');
    fetchData('writing');
    fetchData('reading');
    fetchData('listening');
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
    if (editingSpeakingPrompt && editingSpeakingPrompt.id) formData.append('id', editingSpeakingPrompt.id);
    speakingPromptForm.handleSubmit(async () => {
      startTransition(async () => {
        const result = await (editingSpeakingPrompt ? updateSpeakingPromptAction(initialSpeakingPromptFormState, formData) : addSpeakingPromptAction(initialSpeakingPromptFormState, formData));
        if (result.isSuccess) { toast({ title: "Success", description: result.message }); setIsSpeakingPromptDialogOpen(false); fetchData('speaking'); } 
        else { toast({ title: "Error", description: result.message || "Failed to save.", variant: "destructive" }); }
      });
    })(event);
  };
  const handleDeleteSpeakingPrompt = (id: string) => {
    startTransition(async () => {
      const result = await deleteSpeakingPromptAction(id);
      if (result.isSuccess) { toast({ title: "Success", description: result.message }); fetchData('speaking'); }
      else { toast({ title: "Error", description: result.message || "Failed to delete.", variant: "destructive" }); }
    });
  };

  // --- Writing Prompt Management ---
  const openAddWritingPromptDialog = () => {
    writingPromptForm.reset({ topic: "", taskType: "", promptText: "", sampleResponse: "" });
    setEditingWritingPrompt(null);
    setIsWritingPromptDialogOpen(true);
  };
  const openEditWritingPromptDialog = (prompt: WritingPrompt) => {
    setEditingWritingPrompt(prompt);
    writingPromptForm.reset(prompt);
    setIsWritingPromptDialogOpen(true);
  };
  const handleWritingPromptFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (editingWritingPrompt && editingWritingPrompt.id) formData.append('id', editingWritingPrompt.id);
    writingPromptForm.handleSubmit(async () => {
      startTransition(async () => {
        const result = await (editingWritingPrompt ? updateWritingPromptAction(initialWritingPromptFormState, formData) : addWritingPromptAction(initialWritingPromptFormState, formData));
        if (result.isSuccess) { toast({ title: "Success", description: result.message }); setIsWritingPromptDialogOpen(false); fetchData('writing'); }
        else { toast({ title: "Error", description: result.message || "Failed to save.", variant: "destructive" }); }
      });
    })(event);
  };
  const handleDeleteWritingPrompt = (id: string) => {
    startTransition(async () => {
      const result = await deleteWritingPromptAction(id);
      if (result.isSuccess) { toast({ title: "Success", description: result.message }); fetchData('writing'); }
      else { toast({ title: "Error", description: result.message || "Failed to delete.", variant: "destructive" }); }
    });
  };

  // --- Reading Passage Management ---
  const openAddReadingPassageDialog = () => {
    readingPassageForm.reset({ topic: "", passageText: "" });
    setEditingReadingPassage(null);
    setIsReadingPassageDialogOpen(true);
  };
  const openEditReadingPassageDialog = (passage: ReadingPassage) => {
    setEditingReadingPassage(passage);
    readingPassageForm.reset(passage);
    setIsReadingPassageDialogOpen(true);
  };
  const handleReadingPassageFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (editingReadingPassage && editingReadingPassage.id) formData.append('id', editingReadingPassage.id);
    readingPassageForm.handleSubmit(async () => {
      startTransition(async () => {
        const result = await (editingReadingPassage ? updateReadingPassageAction(initialReadingPassageFormState, formData) : addReadingPassageAction(initialReadingPassageFormState, formData));
        if (result.isSuccess) { toast({ title: "Success", description: result.message }); setIsReadingPassageDialogOpen(false); fetchData('reading'); }
        else { toast({ title: "Error", description: result.message || "Failed to save.", variant: "destructive" }); }
      });
    })(event);
  };
  const handleDeleteReadingPassage = (id: string) => {
    startTransition(async () => {
      const result = await deleteReadingPassageAction(id);
      if (result.isSuccess) { toast({ title: "Success", description: result.message }); fetchData('reading'); }
      else { toast({ title: "Error", description: result.message || "Failed to delete.", variant: "destructive" }); }
    });
  };

  // --- Listening Audio Management ---
  const openAddListeningAudioDialog = () => {
    listeningAudioForm.reset({ topic: "", audioFileUrlOrName: "", transcript: "" });
    setEditingListeningAudio(null);
    setIsListeningAudioDialogOpen(true);
  };
  const openEditListeningAudioDialog = (item: ListeningAudio) => {
    setEditingListeningAudio(item);
    listeningAudioForm.reset(item);
    setIsListeningAudioDialogOpen(true);
  };
  const handleListeningAudioFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (editingListeningAudio && editingListeningAudio.id) formData.append('id', editingListeningAudio.id);
    listeningAudioForm.handleSubmit(async () => {
      startTransition(async () => {
        const result = await (editingListeningAudio ? updateListeningAudioAction(initialListeningAudioFormState, formData) : addListeningAudioAction(initialListeningAudioFormState, formData));
        if (result.isSuccess) { toast({ title: "Success", description: result.message }); setIsListeningAudioDialogOpen(false); fetchData('listening'); }
        else { toast({ title: "Error", description: result.message || "Failed to save.", variant: "destructive" }); }
      });
    })(event);
  };
  const handleDeleteListeningAudio = (id: string) => {
    startTransition(async () => {
      const result = await deleteListeningAudioAction(id);
      if (result.isSuccess) { toast({ title: "Success", description: result.message }); fetchData('listening'); }
      else { toast({ title: "Error", description: result.message || "Failed to delete.", variant: "destructive" }); }
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">AI Tutor Content Management</h1>

      <Tabs defaultValue="speaking_prompts">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 md:max-w-2xl">
          <TabsTrigger value="speaking_prompts"><Mic className="mr-2 h-4 w-4" />Speaking Prompts</TabsTrigger>
          <TabsTrigger value="writing_prompts"><MessageSquareText className="mr-2 h-4 w-4" />Writing Prompts</TabsTrigger>
          <TabsTrigger value="reading_passages"><BookOpen className="mr-2 h-4 w-4" />Reading Passages</TabsTrigger>
          <TabsTrigger value="listening_audio"><FileAudio className="mr-2 h-4 w-4" />Listening Audio</TabsTrigger>
        </TabsList>

        {/* Speaking Prompts Tab Content */}
        <TabsContent value="speaking_prompts" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Speaking Prompts</h2>
            <div>
              <Button onClick={() => fetchData('speaking')} variant="outline" size="icon" className="mr-2" aria-label="Refresh Speaking Prompts" disabled={isPending}>
                <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={openAddSpeakingPromptDialog} disabled={isPending}><PlusCircle className="mr-2 h-4 w-4" /> Add New Speaking Prompt</Button>
            </div>
          </div>
          <Dialog open={isSpeakingPromptDialogOpen} onOpenChange={setIsSpeakingPromptDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingSpeakingPrompt ? "Edit Speaking Prompt" : "Add New Speaking Prompt"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSpeakingPromptFormSubmit} id="speakingPromptForm" className="grid gap-4 py-4">
                <div><Label htmlFor="topic_spk">Topic</Label><Input id="topic_spk" {...speakingPromptForm.register("topic")} />{speakingPromptForm.formState.errors.topic && <p className="text-sm text-destructive mt-1">{speakingPromptForm.formState.errors.topic.message}</p>}</div>
                <div><Label htmlFor="promptText_spk">Prompt Text</Label><Textarea id="promptText_spk" {...speakingPromptForm.register("promptText")} rows={4} />{speakingPromptForm.formState.errors.promptText && <p className="text-sm text-destructive mt-1">{speakingPromptForm.formState.errors.promptText.message}</p>}</div>
                <div><Label htmlFor="expectedKeywords_spk">Keywords</Label><Input id="expectedKeywords_spk" {...speakingPromptForm.register("expectedKeywords")} placeholder="Comma-separated" />{speakingPromptForm.formState.errors.expectedKeywords && <p className="text-sm text-destructive mt-1">{speakingPromptForm.formState.errors.expectedKeywords.message}</p>}</div>
              </form>
              <DialogFooter><Button variant="outline" onClick={() => setIsSpeakingPromptDialogOpen(false)}>Cancel</Button><Button type="submit" form="speakingPromptForm">{editingSpeakingPrompt ? "Save" : "Add"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table><TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Prompt (Snippet)</TableHead><TableHead className="hidden md:table-cell">Keywords</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {speakingPrompts.map((p) => (<TableRow key={p.id}><TableCell>{p.topic}</TableCell><TableCell className="max-w-xs truncate">{p.promptText}</TableCell><TableCell className="hidden md:table-cell max-w-sm truncate">{Array.isArray(p.expectedKeywords) ? p.expectedKeywords.join(', ') : 'N/A'}</TableCell>
                  <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal/></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={()=>openEditSpeakingPromptDialog(p)}>Edit</DropdownMenuItem><DropdownMenuItem onClick={()=>handleDeleteSpeakingPrompt(p.id!)} className="text-destructive">Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}
              </TableBody></Table>
             {speakingPrompts.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No speaking prompts.</p>}
          </div>
        </TabsContent>

        {/* Writing Prompts Tab Content */}
        <TabsContent value="writing_prompts" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Writing Prompts</h2>
            <div><Button onClick={() => fetchData('writing')} variant="outline" size="icon" className="mr-2" disabled={isPending}><RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin':''}`}/></Button><Button onClick={openAddWritingPromptDialog} disabled={isPending}><PlusCircle className="mr-2 h-4 w-4"/>Add New Writing Prompt</Button></div>
          </div>
           <Dialog open={isWritingPromptDialogOpen} onOpenChange={setIsWritingPromptDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>{editingWritingPrompt ? "Edit Writing Prompt" : "Add New Writing Prompt"}</DialogTitle></DialogHeader>
              <form onSubmit={handleWritingPromptFormSubmit} id="writingPromptForm" className="grid gap-4 py-4">
                <div><Label htmlFor="topic_wp">Topic</Label><Input id="topic_wp" {...writingPromptForm.register("topic")} />{writingPromptForm.formState.errors.topic && <p className="text-sm text-destructive mt-1">{writingPromptForm.formState.errors.topic.message}</p>}</div>
                <div><Label htmlFor="taskType_wp">Task Type</Label><Input id="taskType_wp" {...writingPromptForm.register("taskType")} placeholder="e.g., Formal Letter, Opinion Essay"/>{writingPromptForm.formState.errors.taskType && <p className="text-sm text-destructive mt-1">{writingPromptForm.formState.errors.taskType.message}</p>}</div>
                <div><Label htmlFor="promptText_wp">Prompt Text</Label><Textarea id="promptText_wp" {...writingPromptForm.register("promptText")} rows={4}/>{writingPromptForm.formState.errors.promptText && <p className="text-sm text-destructive mt-1">{writingPromptForm.formState.errors.promptText.message}</p>}</div>
                <div><Label htmlFor="sampleResponse_wp">Sample Response (Optional)</Label><Textarea id="sampleResponse_wp" {...writingPromptForm.register("sampleResponse")} rows={4}/>{writingPromptForm.formState.errors.sampleResponse && <p className="text-sm text-destructive mt-1">{writingPromptForm.formState.errors.sampleResponse.message}</p>}</div>
              </form>
              <DialogFooter><Button variant="outline" onClick={()=>setIsWritingPromptDialogOpen(false)}>Cancel</Button><Button type="submit" form="writingPromptForm">{editingWritingPrompt ? "Save" : "Add"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table><TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Task Type</TableHead><TableHead>Prompt (Snippet)</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {writingPrompts.map((p)=>(<TableRow key={p.id}><TableCell>{p.topic}</TableCell><TableCell>{p.taskType}</TableCell><TableCell className="max-w-xs truncate">{p.promptText}</TableCell>
              <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal/></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={()=>openEditWritingPromptDialog(p)}>Edit</DropdownMenuItem><DropdownMenuItem onClick={()=>handleDeleteWritingPrompt(p.id!)} className="text-destructive">Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}
            </TableBody></Table>
            {writingPrompts.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No writing prompts.</p>}
          </div>
        </TabsContent>
        
        {/* Reading Passages Tab Content */}
        <TabsContent value="reading_passages" className="mt-6 space-y-6">
           <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Reading Passages</h2>
            <div><Button onClick={() => fetchData('reading')} variant="outline" size="icon" className="mr-2" disabled={isPending}><RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin':''}`}/></Button><Button onClick={openAddReadingPassageDialog} disabled={isPending}><PlusCircle className="mr-2 h-4 w-4"/>Add New Reading Passage</Button></div>
          </div>
          <Dialog open={isReadingPassageDialogOpen} onOpenChange={setIsReadingPassageDialogOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader><DialogTitle>{editingReadingPassage ? "Edit Reading Passage" : "Add New Reading Passage"}</DialogTitle></DialogHeader>
              <form onSubmit={handleReadingPassageFormSubmit} id="readingPassageForm" className="grid gap-4 py-4">
                <div><Label htmlFor="topic_rp">Topic</Label><Input id="topic_rp" {...readingPassageForm.register("topic")} />{readingPassageForm.formState.errors.topic && <p className="text-sm text-destructive mt-1">{readingPassageForm.formState.errors.topic.message}</p>}</div>
                <div><Label htmlFor="passageText_rp">Passage Text</Label><Textarea id="passageText_rp" {...readingPassageForm.register("passageText")} rows={10}/>{readingPassageForm.formState.errors.passageText && <p className="text-sm text-destructive mt-1">{readingPassageForm.formState.errors.passageText.message}</p>}</div>
              </form>
              <DialogFooter><Button variant="outline" onClick={()=>setIsReadingPassageDialogOpen(false)}>Cancel</Button><Button type="submit" form="readingPassageForm">{editingReadingPassage ? "Save" : "Add"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table><TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Passage (Snippet)</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {readingPassages.map((p)=>(<TableRow key={p.id}><TableCell>{p.topic}</TableCell><TableCell className="max-w-md truncate">{p.passageText}</TableCell>
              <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal/></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={()=>openEditReadingPassageDialog(p)}>Edit</DropdownMenuItem><DropdownMenuItem onClick={()=>handleDeleteReadingPassage(p.id!)} className="text-destructive">Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}
            </TableBody></Table>
            {readingPassages.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No reading passages.</p>}
          </div>
        </TabsContent>
        
        {/* Listening Audio Tab Content */}
        <TabsContent value="listening_audio" className="mt-6 space-y-6">
           <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Listening Audio</h2>
            <div><Button onClick={() => fetchData('listening')} variant="outline" size="icon" className="mr-2" disabled={isPending}><RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin':''}`}/></Button><Button onClick={openAddListeningAudioDialog} disabled={isPending}><PlusCircle className="mr-2 h-4 w-4"/>Add New Listening Audio</Button></div>
          </div>
          <Dialog open={isListeningAudioDialogOpen} onOpenChange={setIsListeningAudioDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>{editingListeningAudio ? "Edit Listening Audio" : "Add New Listening Audio"}</DialogTitle></DialogHeader>
              <form onSubmit={handleListeningAudioFormSubmit} id="listeningAudioForm" className="grid gap-4 py-4">
                <div><Label htmlFor="topic_la">Topic</Label><Input id="topic_la" {...listeningAudioForm.register("topic")} />{listeningAudioForm.formState.errors.topic && <p className="text-sm text-destructive mt-1">{listeningAudioForm.formState.errors.topic.message}</p>}</div>
                <div><Label htmlFor="audioFileUrlOrName_la">Audio File URL/Name</Label><Input id="audioFileUrlOrName_la" {...listeningAudioForm.register("audioFileUrlOrName")} placeholder="e.g., audio/interview_job.mp3 or full URL"/>{listeningAudioForm.formState.errors.audioFileUrlOrName && <p className="text-sm text-destructive mt-1">{listeningAudioForm.formState.errors.audioFileUrlOrName.message}</p>}</div>
                <div><Label htmlFor="transcript_la">Transcript (Optional)</Label><Textarea id="transcript_la" {...listeningAudioForm.register("transcript")} rows={6}/>{listeningAudioForm.formState.errors.transcript && <p className="text-sm text-destructive mt-1">{listeningAudioForm.formState.errors.transcript.message}</p>}</div>
              </form>
              <DialogFooter><Button variant="outline" onClick={()=>setIsListeningAudioDialogOpen(false)}>Cancel</Button><Button type="submit" form="listeningAudioForm">{editingListeningAudio ? "Save" : "Add"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table><TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Audio File/URL</TableHead><TableHead>Transcript (Snippet)</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {listeningAudioItems.map((item)=>(<TableRow key={item.id}><TableCell>{item.topic}</TableCell><TableCell>{item.audioFileUrlOrName}</TableCell><TableCell className="max-w-xs truncate">{item.transcript || "N/A"}</TableCell>
              <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal/></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={()=>openEditListeningAudioDialog(item)}>Edit</DropdownMenuItem><DropdownMenuItem onClick={()=>handleDeleteListeningAudio(item.id!)} className="text-destructive">Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}
            </TableBody></Table>
            {listeningAudioItems.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No listening audio items.</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
