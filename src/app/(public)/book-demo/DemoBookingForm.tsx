// src/app/(public)/book-demo/DemoBookingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, CalendarCheck, Clock, User, Mail, Phone, ExternalLink, Download } from "lucide-react";
import { submitDemoBookingForm, type DemoBookingFormState, type DemoBookingData } from "./actions";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { isSameDay, format } from 'date-fns';

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

function generateCalendarLinks(details: DemoBookingData & { googleMeetLink: string }) {
    const { name, selectedDate, selectedTime, googleMeetLink } = details;
    if (!selectedDate || !selectedTime) return { googleLink: '#', icsLink: '#' };

    // Parse time and create start/end Date objects in UTC
    const [startTime] = selectedTime.split(' - ');
    const [time, period] = startTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const startDate = new Date(selectedDate);
    // Adjust for timezone differences by treating the date as local
    const timezoneOffset = startDate.getTimezoneOffset() * 60000;
    const localDate = new Date(startDate.getTime() + timezoneOffset);

    localDate.setUTCHours(hours, minutes, 0, 0);
    const endDate = new Date(localDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const title = encodeURIComponent("FrancoBuddy TEF Demo Class");
    const description = encodeURIComponent(`Your personalized TEF Canada demo class with a FrancoBuddy expert.\n\nJoin here: ${googleMeetLink}`);

    const googleFormat = (date: Date) => date.toISOString().replace(/[-:.]/g, '').slice(0, -1) + 'Z';
    const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${googleFormat(localDate)}/${googleFormat(endDate)}&details=${description}&location=${encodeURIComponent(googleMeetLink)}`;

    const icsContent = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
        `DTSTART:${googleFormat(localDate)}`,
        `DTEND:${googleFormat(endDate)}`,
        `SUMMARY:${name}'s FrancoBuddy Demo`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        `LOCATION:${googleMeetLink}`,
        "END:VEVENT", "END:VCALENDAR"
    ].join("\n");
    const icsLink = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

    return { googleLink, icsLink };
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
    if (availableDates.length > 0) {
      setDate(availableDates[0]);
    } else {
        setDate(new Date());
    }
  }, [availableDates]);

  if (state.isSuccess && state.bookingDetails) {
    const { googleLink, icsLink } = generateCalendarLinks(state.bookingDetails);
    return (
        <Card className="w-full max-w-lg mx-auto shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
            <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-primary">Demo Booked Successfully!</CardTitle>
                <CardDescription>{state.message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                 <div className="p-4 bg-background/50 rounded-md">
                    <p><strong>Date:</strong> {format(new Date(state.bookingDetails.selectedDate), 'PPP')}</p>
                    <p><strong>Time:</strong> {state.bookingDetails.selectedTime} (EST)</p>
                    <p><strong>Link:</strong> <a href={state.bookingDetails.googleMeetLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">{state.bookingDetails.googleMeetLink}</a></p>
                 </div>
                 <p className="font-semibold">Add to your calendar:</p>
                 <div className="flex justify-center gap-4">
                     <Button asChild>
                         <a href={googleLink} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2"/> Google Calendar</a>
                     </Button>
                      <Button asChild variant="secondary" download="francobuddy_demo.ics">
                         <a href={icsLink}><Download className="mr-2"/> Other Calendar (.ics)</a>
                     </Button>
                 </div>
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground mx-auto">A confirmation has NOT been sent to your email. Please ensure you add this event to your calendar.</p>
            </CardFooter>
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
