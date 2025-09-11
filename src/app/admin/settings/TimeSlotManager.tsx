// src/app/admin/settings/TimeSlotManager.tsx
"use client";

import { useActionState, useTransition, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, PlusCircle, Trash2, CalendarIcon } from 'lucide-react';
import { addTimeSlotAction, deleteTimeSlotAction, type TimeSlotFormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';

type TimeSlotManagerProps = {
  initialTimeSlots: { id: string; dateTime: string; timeSlotText: string }[];
};

const initialFormState: TimeSlotFormState = {
  message: "",
  isSuccess: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? "Adding..." : <><PlusCircle className="mr-2 h-4 w-4" /> Add Slot</>}
    </Button>
  );
}

export default function TimeSlotManager({ initialTimeSlots }: TimeSlotManagerProps) {
  const { toast } = useToast();
  const [addState, addFormAction] = useActionState(addTimeSlotAction, initialFormState);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots.map(slot => ({ ...slot, dateTime: new Date(slot.dateTime) })));

  useEffect(() => {
    // Set initial date on client to avoid hydration mismatch
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    setTimeSlots(initialTimeSlots.map(slot => ({ ...slot, dateTime: new Date(slot.dateTime) })));
  }, [initialTimeSlots]);

  const handleDelete = async (id: string) => {
    startDeleteTransition(async () => {
      const result = await deleteTimeSlotAction(id);
      if (result.isSuccess) {
        toast({ title: 'Success', description: result.message });
        // Manually filter out the deleted slot to update UI instantly
        setTimeSlots(prev => prev.filter(slot => slot.id !== id));
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };
  
  const selectedDateSlots = timeSlots.filter(slot => selectedDate && isSameDay(slot.dateTime, selectedDate));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Availability</CardTitle>
        <CardDescription>Manage available dates and times for the demo booking form.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <h3 className="font-medium mb-2">1. Select a Date</h3>
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                    available: timeSlots.map(slot => slot.dateTime),
                }}
                 modifiersStyles={{
                    available: {
                      border: "2px solid hsl(var(--primary))",
                      borderRadius: '100%'
                    }
                }}
              />
        </div>
        <div>
          <h3 className="font-medium mb-2">2. View & Manage Slots for {selectedDate ? format(selectedDate, 'PPP') : '...'}</h3>
          {selectedDateSlots.length > 0 ? (
            <div className="space-y-2">
              {selectedDateSlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{slot.timeSlotText}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(slot.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No time slots configured for this date.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <form action={addFormAction} className="w-full space-y-4">
            <input type="hidden" name="date" value={selectedDate?.toISOString()} />
            <div>
                <Label htmlFor="timeSlotText">3. Add New Time Slot for {selectedDate ? format(selectedDate, 'PPP') : '...'}</Label>
                <div className="flex gap-2 mt-1">
                    <Input
                    id="timeSlotText"
                    name="timeSlotText"
                    placeholder="e.g., 01:00 PM"
                    required
                    />
                    <SubmitButton />
                </div>
                {addState.errors?.timeSlotText && <p className="text-sm text-destructive mt-1">{addState.errors.timeSlotText.join(', ')}</p>}
            </div>
          {addState.message && (
            <Alert variant={addState.isSuccess ? 'default' : 'destructive'}>
              {addState.isSuccess ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{addState.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardFooter>
    </Card>
  );
}
