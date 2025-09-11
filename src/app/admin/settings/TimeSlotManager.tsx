// src/app/admin/settings/TimeSlotManager.tsx
"use client";

import { useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, PlusCircle, Trash2 } from 'lucide-react';
import { addTimeSlotAction, deleteTimeSlotAction, type TimeSlotFormState } from './actions';
import { useToast } from '@/hooks/use-toast';

type TimeSlotManagerProps = {
  initialTimeSlots: { id: string; timeSlot: string }[];
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

  const handleDelete = async (id: string) => {
    startDeleteTransition(async () => {
      const result = await deleteTimeSlotAction(id);
      if (result.isSuccess) {
        toast({ title: 'Success', description: result.message });
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Time Slots</CardTitle>
        <CardDescription>Manage the available time slots for the demo booking form.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Current Time Slots</h3>
          {initialTimeSlots.length > 0 ? (
            <div className="space-y-2">
              {initialTimeSlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{slot.timeSlot}</span>
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
            <p className="text-sm text-muted-foreground">No time slots configured.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <form action={addFormAction} className="w-full space-y-4">
            <div>
                <Label htmlFor="timeSlot">Add New Time Slot</Label>
                <div className="flex gap-2 mt-1">
                    <Input
                    id="timeSlot"
                    name="timeSlot"
                    placeholder="e.g., 01:00 PM - 02:00 PM"
                    required
                    />
                    <SubmitButton />
                </div>
                {addState.errors?.timeSlot && <p className="text-sm text-destructive mt-1">{addState.errors.timeSlot.join(', ')}</p>}
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
