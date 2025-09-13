// src/app/admin/site-management/settings/TimeSlotManager.tsx
"use client";

import { useState, useTransition, useEffect } from 'react';
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { updateTimeSlotsAction, type TimeSlot } from "./actions";
import { Trash2, PlusCircle } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const timeSlotSchema = z.object({
  id: z.string(),
  dateTime: z.string(),
  timeSlotText: z.string(),
});

const timeSlotsFormSchema = z.object({
  slots: z.array(timeSlotSchema),
});

type TimeSlotsFormData = z.infer<typeof timeSlotsFormSchema>;

type TimeSlotManagerProps = {
  initialTimeSlots: TimeSlot[];
};

export default function TimeSlotManager({ initialTimeSlots }: TimeSlotManagerProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);


  const { control, register, handleSubmit, watch, setValue } = useForm<TimeSlotsFormData>({
    resolver: zodResolver(timeSlotsFormSchema),
    defaultValues: { slots: initialTimeSlots },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots",
  });

  const onSubmit: SubmitHandler<TimeSlotsFormData> = (data) => {
    startTransition(async () => {
      const result = await updateTimeSlotsAction(data.slots);
      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };
  
  const handleAddNewSlot = () => {
    if(selectedDate) {
        const newSlotDateTime = selectedDate.toISOString();
        append({
            id: `slot_${Date.now()}`,
            dateTime: newSlotDateTime,
            timeSlotText: "New Slot - Edit Me"
        });
    } else {
        toast({ title: "Select a Date", description: "Please select a date before adding a new slot.", variant: "destructive" });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Demo Booking Time Slots</CardTitle>
        <CardDescription>Manage available time slots for the public "Book a Demo" page.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn("w-[240px] justify-start text-left font-normal", !watch(`slots.${index}.dateTime`) && "text-muted-foreground")}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch(`slots.${index}.dateTime`) ? format(new Date(watch(`slots.${index}.dateTime`)), "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={new Date(watch(`slots.${index}.dateTime`))}
                        onSelect={(date) => setValue(`slots.${index}.dateTime`, date?.toISOString() || '')}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Input
                  {...register(`slots.${index}.timeSlotText`)}
                  placeholder="e.g., 10:00 AM - 10:30 AM"
                  className="flex-grow"
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline"><CalendarIcon className="mr-2 h-4 w-4"/>Add Slot for Date</Button>
                </PopoverTrigger>
                 <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus/>
                 </PopoverContent>
            </Popover>
             <Button type="button" variant="secondary" onClick={handleAddNewSlot}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save All Time Slots"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
