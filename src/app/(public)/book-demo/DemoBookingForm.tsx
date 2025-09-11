// src/app/(public)/book-demo/DemoBookingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, CalendarCheck, Clock, User, Mail, Phone } from "lucide-react";
import { submitDemoBookingForm, type DemoBookingFormState } from "./actions";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { isSameDay } from 'date-fns';

const initialState: DemoBookingFormState = {
  message: "",
  isSuccess: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? "Submitting..." : <><CalendarCheck className="mr-2 h-4 w-4" /> Book My Free Demo</>}
    </Button>
  );
}

type DemoBookingFormProps = {
    timeSlots: { id: string, dateTime: string, timeSlotText: string }[];
    availableDates: Date[];
}

export default function DemoBookingForm({ timeSlots = [], availableDates = [] }: DemoBookingFormProps) {
  const [state, formAction] = useActionState(submitDemoBookingForm, initialState);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    // Set initial date on client to avoid hydration mismatch
    if (availableDates.length > 0) {
      setDate(availableDates[0]);
    } else {
        setDate(new Date());
    }
  }, [availableDates]);


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

  const timeSlotsForSelectedDate = date
    ? timeSlots.filter(slot => isSameDay(new Date(slot.dateTime), date))
    : [];


  return (
    <Card className="w-full max-w-4xl shadow-xl">
      <CardContent className="p-6 md:p-8">
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="selectedDate" value={date ? date.toISOString().split('T')[0] : ""} />
            <input type="hidden" name="selectedTime" value={selectedTime} />
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
                 <div className="space-y-2">
                     <Label className="flex items-center gap-2 mb-2 text-lg"><CalendarCheck /> Select a Date</Label>
                     <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border bg-card"
                        disabled={(day) => !availableDates.some(d => isSameDay(d, day))}
                    />
                    {state.errors?.selectedDate && <p className="text-sm text-destructive mt-1">{state.errors.selectedDate.join(', ')}</p>}
                </div>
                <div className="space-y-6">
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
                    <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 mb-2"><Phone /> Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+1 (123) 456-7890" required/>
                        {state.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone.join(', ')}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label className="flex items-center gap-2 mb-2 text-lg"><Clock /> Select a Time (EST)</Label>
                        {timeSlotsForSelectedDate.length > 0 ? (
                             <RadioGroup 
                                name="time-selection-visual"
                                value={selectedTime}
                                onValueChange={setSelectedTime}
                                className="space-y-2"
                            >
                            {timeSlotsForSelectedDate.map(slot => (
                                <div key={slot.id} className="flex items-center p-3 rounded-md hover:bg-muted transition-colors border">
                                <RadioGroupItem value={slot.timeSlotText} id={slot.id} />
                                <Label htmlFor={slot.id} className="pl-3 font-normal cursor-pointer flex-grow">{slot.timeSlotText}</Label>
                                </div>
                            ))}
                            </RadioGroup>
                        ) : (
                            <p className="text-sm text-muted-foreground">{date ? "No time slots available for this date. Please select another date." : "Please select a date to see available times."}</p>
                        )}
                       
                        {state.errors?.selectedTime && <p className="text-sm text-destructive mt-1">{state.errors.selectedTime.join(', ')}</p>}
                    </div>
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
