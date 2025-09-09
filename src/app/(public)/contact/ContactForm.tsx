// src/app/(public)/contact/ContactForm.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { submitContactForm, type ContactFormState } from "./actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: ContactFormState = {
  message: "",
  isSuccess: false,
};

const frenchLevels = ["New Beginner", "A1-A2", "B1-B2", "C1-C2"];
const inquiryTypes = ["General Question", "TEF Canada Course", "Beginner Course", "Pricing", "Partnership"];
const timelines = ["Immediately", "Within 1 month", "Within 3 months", "Just researching"];


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
      {pending ? "Sending..." : "Send Message via WhatsApp"}
    </Button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  return (
    <Card className="w-full max-w-3xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-secondary">Send us a Message</CardTitle>
        <CardDescription>We'll get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
              {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              {state.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email.join(', ')}</p>}
            </div>
             <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="(123) 456-7890" required/>
              {state.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone.join(', ')}</p>}
            </div>
             <div>
                <Label htmlFor="inquiryType">Inquiry Type</Label>
                <Select name="inquiryType" required>
                    <SelectTrigger><SelectValue placeholder="Select inquiry type" /></SelectTrigger>
                    <SelectContent>
                        {inquiryTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                </Select>
                {state.errors?.inquiryType && <p className="text-sm text-destructive mt-1">{state.errors.inquiryType.join(', ')}</p>}
            </div>
            <div>
                <Label htmlFor="frenchLevel">Your French Level</Label>
                <Select name="frenchLevel">
                    <SelectTrigger><SelectValue placeholder="Select your level" /></SelectTrigger>
                    <SelectContent>
                        {frenchLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                    </SelectContent>
                </Select>
                 {state.errors?.frenchLevel && <p className="text-sm text-destructive mt-1">{state.errors.frenchLevel.join(', ')}</p>}
            </div>
            <div>
                <Label htmlFor="timeline">Your Timeline</Label>
                <Select name="timeline">
                    <SelectTrigger><SelectValue placeholder="Select your timeline" /></SelectTrigger>
                    <SelectContent>
                        {timelines.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                    </SelectContent>
                </Select>
                 {state.errors?.timeline && <p className="text-sm text-destructive mt-1">{state.errors.timeline.join(', ')}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Your message here..." rows={5} required />
            {state.errors?.message && <p className="text-sm text-destructive mt-1">{state.errors.message.join(', ')}</p>}
          </div>
          
          <SubmitButton />

          {state.message && (
            <Alert variant={state.isSuccess ? "default" : "destructive"} className="mt-4">
              {state.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{state.isSuccess ? "Success!" : "Error!"}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
