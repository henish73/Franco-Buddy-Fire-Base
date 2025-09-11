// src/app/(public)/book-demo/DemoBookingForm.tsx
"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, CalendarCheck, Clock, User, Mail, Phone, Target } from "lucide-react";
import { submitDemoBookingForm, type DemoBookingFormState } from "./actions";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SectionTitle from "@/components/shared/SectionTitle";

const initialState: DemoBookingFormState = {
  message: "",
  isSuccess: false,
};

const timeSlots = ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "2:00 PM - 3:00 PM", "4:00 PM - 5:00 PM"];

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');

  if (state.isSuccess) {
    return (
        <Card className="w-full max-w-md mx-auto shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
            <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary mb-2">Thank You!</h3>
                <p className="text-muted-foreground">{state.message}</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl shadow-xl">
      <CardContent className="p-6 md:p-8">
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="selectedDate" value={date ? date.toISOString().split('T')[0] : ""} />
            <input type="hidden" name="selectedTime" value={selectedTime} />
            
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2"><User /> Full Name</Label>
                    <Input id="name" name="name" placeholder="Your Name" required />
                    {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2"><Mail /> Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
                    {state.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email.join(', ')}</p>}
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2"><Phone /> Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (123) 456-7890" required/>
                    {state.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone.join(', ')}</p>}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start border-t pt-8">
                <div className="space-y-2">
                     <Label className="flex items-center gap-2 mb-2 text-lg"><CalendarCheck /> Select a Date</Label>
                     <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border bg-card"
                        disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                    {state.errors?.selectedDate && <p className="text-sm text-destructive mt-1">{state.errors.selectedDate.join(', ')}</p>}
                </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2 mb-2 text-lg"><Clock /> Select a Time (EST)</Label>
                     <RadioGroup 
                        name="time-selection-visual"
                        value={selectedTime}
                        onValueChange={setSelectedTime}
                        className="space-y-2"
                    >
                      {timeSlots.map(slot => (
                        <div key={slot} className="flex items-center p-3 rounded-md hover:bg-muted transition-colors border">
                          <RadioGroupItem value={slot} id={slot} />
                          <Label htmlFor={slot} className="pl-3 font-normal cursor-pointer flex-grow">{slot}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {state.errors?.selectedTime && <p className="text-sm text-destructive mt-1">{state.errors.selectedTime.join(', ')}</p>}
                </div>
            </div>

            <div className="pt-4 border-t">
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