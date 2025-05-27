// src/app/(public)/blog/[slug]/CommentForm.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { addCommentAction, type CommentFormState } from "../commentActions";

const initialState: CommentFormState = {
  message: "",
  isSuccess: false,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : <><Send className="mr-2 h-4 w-4" /> Submit Comment</>}
    </Button>
  );
}

type CommentFormProps = {
  postId: string; // Or slug if that's what you use to identify posts for comments
  postSlug: string; // For revalidation
};

export default function CommentForm({ postId, postSlug }: CommentFormProps) {
  const [state, formAction] = useFormState(addCommentAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.isSuccess) {
      formRef.current?.reset(); // Reset form on successful submission
    }
  }, [state.isSuccess]);

  const actionWithPostId = formAction.bind(null, postId, postSlug); // Bind postId and postSlug to the action

  return (
    <form ref={formRef} action={actionWithPostId} className="space-y-6 bg-card p-6 md:p-8 rounded-lg shadow-md">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="commentName">Name</Label>
          <Input id="commentName" name="name" placeholder="Your Name" required />
          {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(", ")}</p>}
        </div>
        <div>
          <Label htmlFor="commentEmail">Email (Optional)</Label>
          <Input id="commentEmail" name="email" type="email" placeholder="your.email@example.com" />
          {state.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email.join(", ")}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="commentMessage">Comment</Label>
        <Textarea id="commentMessage" name="comment" placeholder="Write your comment here..." rows={5} required />
        {state.errors?.comment && <p className="text-sm text-destructive mt-1">{state.errors.comment.join(", ")}</p>}
      </div>
      
      <SubmitButton />

      {state.message && (
        <Alert variant={state.isSuccess ? "default" : "destructive"} className="mt-4">
          {state.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{state.isSuccess ? "Success!" : "Error!"}</AlertTitle>
          <AlertDescription>
            {state.message}
            {!state.isSuccess && state.errors?.form && state.errors.form.join(", ")}
          </AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground">Comments are moderated. Your comment will appear after approval.</p>
    </form>
  );
}
