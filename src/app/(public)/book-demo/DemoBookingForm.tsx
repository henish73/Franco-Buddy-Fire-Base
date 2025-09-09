// src/app/(public)/book-demo/DemoBookingForm.tsx
"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle, AlertCircle, CalendarCheck } from "lucide-react";
import { submitDemoBookingForm, type DemoBookingFormState } from "./actions";
import { addDays, format } from "date-fns";

const initialState: DemoBookingFormState = {
  message: "",
  isSuccess: false,
};

const availableTimeSlots = [
    "09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM", 
    "05:00 PM", "06:30 PM", "08:00 PM", "09:30 PM"
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? "Submitting..." : <><CalendarCheck className="mr-2 h-4 w-4" /> Book My Free Demo</>}
    </Button>
  );
}

export default function DemoBookingForm() {
  const [state, formAction] = useFormState(submitDemoBookingForm, initialState);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  return (
    <Card className="w-full max-w-4xl shadow-xl">
      <CardContent className="p-6 md:p-8">
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="selectedDate" value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""} />
            <input type="hidden" name="selectedTime" value={selectedTime || ""} />

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left Side: Calendar and Time */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">1. Select a Date</h3>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date.getDay() !== 0 && date.getDay() !== 6} // Disable non-weekends
                            fromDate={new Date()}
                            className="rounded-md border p-0"
                        />
                        {state.errors?.selectedDate && <p className="text-sm text-destructive mt-1">{state.errors.selectedDate.join(', ')}</p>}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">2. Select a Time (EST)</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {availableTimeSlots.map(time => (
                                <Button 
                                    key={time} 
                                    type="button"
                                    variant={selectedTime === time ? "default" : "outline"}
                                    onClick={() => setSelectedTime(time)}
                                    disabled={!selectedDate}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                        {state.errors?.selectedTime && <p className="text-sm text-destructive mt-1">{state.errors.selectedTime.join(', ')}</p>}
                    </div>
                </div>

                {/* Right Side: User Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">3. Your Details</h3>
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
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="Your Phone Number" required/>
                        {state.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone.join(', ')}</p>}
                    </div>
                    <div>
                        <Label htmlFor="frenchLevel">Current French Level</Label>
                        <Input id="frenchLevel" name="frenchLevel" placeholder="e.g., Beginner, B1" required />
                        {state.errors?.frenchLevel && <p className="text-sm text-destructive mt-1">{state.errors.frenchLevel.join(', ')}</p>}
                    </div>
                    <div>
                        <Label htmlFor="goals">Your Goals</Label>
                        <Textarea id="goals" name="goals" placeholder="e.g., TEF for Express Entry, Improve speaking confidence..." rows={3} required />
                        {state.errors?.goals && <p className="text-sm text-destructive mt-1">{state.errors.goals.join(', ')}</p>}
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t">
                <SubmitButton />
                {state.message && (
                    <Alert variant={state.isSuccess ? "default" : "destructive"} className="mt-4">
                    {state.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{state.isSuccess ? "Success!" : "Error!"}</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
