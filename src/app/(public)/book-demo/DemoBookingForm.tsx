// src/app/(public)/book-demo/DemoBookingForm.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { submitDemoBookingForm, type DemoBookingFormState } from "./actions";

const initialState: DemoBookingFormState = {
  message: "",
  isSuccess: false,
};

const frenchLevels = ["Beginner", "Lower Intermediate", "Upper Intermediate", "Advanced"];
const availabilityOptions = [
  { id: "weekdayMornings", label: "Weekday Mornings", value: "Weekday Mornings" },
  { id: "weekdayAfternoons", label: "Weekday Afternoons", value: "Weekday Afternoons" },
  { id: "weekdayEvenings", label: "Weekday Evenings", value: "Weekday Evenings" },
  { id: "weekendMornings", label: "Weekend Mornings", value: "Weekend Mornings" },
  { id: "weekendAfternoons", label: "Weekend Afternoons", value: "Weekend Afternoons" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? "Submitting..." : "Book My Free Demo"}
    </Button>
  );
}

export default function DemoBookingForm() {
  const [state, formAction] = useFormState(submitDemoBookingForm, initialState);

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl text-primary">Book Your FREE Demo Class</CardTitle>
        <CardDescription>Take the first step towards TEF Canada success. Tell us a bit about yourself and your goals.</CardDescription>
      </CardHeader>
      <CardContent>
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
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="Your Phone Number" />
            {state.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="tefGoal">Your TEF Canada Goal</Label>
            <Input id="tefGoal" name="tefGoal" placeholder="e.g., Express Entry, Work Permit, CLB 7+" required />
            {state.errors?.tefGoal && <p className="text-sm text-destructive mt-1">{state.errors.tefGoal.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="frenchLevel">Current French Level</Label>
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
            <Label htmlFor="background">Background & Previous Learning</Label>
            <Textarea id="background" name="background" placeholder="Briefly describe your French learning experience, challenges, etc." rows={4} required />
            {state.errors?.background && <p className="text-sm text-destructive mt-1">{state.errors.background.join(', ')}</p>}
          </div>

          <div>
            <Label>Preferred Availability for Demo</Label>
            <div className="space-y-2 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {availabilityOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox id={option.id} name="availability" value={option.value} />
                  <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                </div>
              ))}
            </div>
            {state.errors?.availability && <p className="text-sm text-destructive mt-1">{state.errors.availability.join(', ')}</p>}
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
