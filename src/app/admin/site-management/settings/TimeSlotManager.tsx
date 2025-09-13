// src/app/admin/site-management/settings/TimeSlotManager.tsx
"use client";

import { useState, useTransition, useEffect } from 'react';
import { useForm, type SubmitHandler, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const timeSlotSchema = z.object({
  id: z.string(),
  dateTime: z.string(),
  timeSlotText: z.string().min(1, "Time slot cannot be empty."),
});

const timeSlotsFormSchema = z.object({
  slots: z.array(timeSlotSchema),
});

type TimeSlotsFormData = z.infer<typeof timeSlotsFormSchema>;

const timeOptions = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
  "07:00 PM - 08:00 PM",
  "08:00 PM - 09:00 PM",
];


type TimeSlotManagerProps = {
  initialTimeSlots: TimeSlot[];
};

export default function TimeSlotManager({ initialTimeSlots }: TimeSlotManagerProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

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
  
  const handleDateSelectAndAdd = (date: Date | undefined) => {
    if (date) {
      append({
        id: `slot_${Date.now()}`,
        dateTime: date.toISOString(),
        timeSlotText: "12:00 PM - 01:00 PM" // Default placeholder text
      });
      toast({ title: "Slot Added", description: `New slot added for ${format(date, 'PPP')}. Edit the time and save.` });
    }
  };

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
                
                <Controller
                  control={control}
                  name={`slots.${index}.timeSlotText`}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="flex-grow">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
                <Button variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Slot Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  onSelect={handleDateSelectAndAdd}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save All Time Slots"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
