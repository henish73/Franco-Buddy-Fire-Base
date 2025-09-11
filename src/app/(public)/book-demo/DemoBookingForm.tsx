// src/app/(public)/book-demo/DemoBookingForm.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, CalendarCheck } from "lucide-react";
import { submitDemoBookingForm, type DemoBookingFormState } from "./actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: DemoBookingFormState = {
  message: "",
  isSuccess: false,
};

const frenchLevels = ["New Beginner", "A1-A2", "B1-B2", "C1-C2"];
const timelines = ["Immediately", "Within 1 month", "Within 3 months", "Just researching"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? "Submitting..." : <><CalendarCheck className="mr-2 h-4 w-4" /> Book My Free Demo</>}
    </Button>
  );
}

export default function DemoBookingForm() {
  const [state, formAction] = useActionState(submitDemoBookingForm, initialState);

  if (state.isSuccess) {
    return (
        <Card className="w-full max-w-md shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
            <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary mb-2">Thank You!</h3>
                <p className="text-muted-foreground">{state.message}</p>
            </CardContent>
        </Card>
    )
  }


  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardContent className="p-6 md:p-8">
        <form action={formAction} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="Your Name" required />
                    {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
                    {state.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="phone">Phone Number (with country code)</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (123) 456-7890" required/>
                    {state.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="frenchLevel">Your French Level</Label>
                    <Select name="frenchLevel" required>
                        <SelectTrigger><SelectValue placeholder="Select your level" /></SelectTrigger>
                        <SelectContent>
                            {frenchLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {state.errors?.frenchLevel && <p className="text-sm text-destructive mt-1">{state.errors.frenchLevel.join(', ')}</p>}
                </div>
            </div>
             <div>
                <Label htmlFor="timeline">How soon do you want to start?</Label>
                <Select name="timeline" required>
                    <SelectTrigger><SelectValue placeholder="Select your timeline" /></SelectTrigger>
                    <SelectContent>
                        {timelines.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                    </SelectContent>
                </Select>
                 {state.errors?.timeline && <p className="text-sm text-destructive mt-1">{state.errors.timeline.join(', ')}</p>}
            </div>
            <div>
                <Label htmlFor="goals">Your Goals</Label>
                <Textarea id="goals" name="goals" placeholder="e.g., TEF for Express Entry, Improve speaking confidence..." rows={3} required />
                {state.errors?.goals && <p className="text-sm text-destructive mt-1">{state.errors.goals.join(', ')}</p>}
            </div>

            <div className="pt-4">
                <SubmitButton />
                {state.message && !state.isSuccess && (
                    <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
