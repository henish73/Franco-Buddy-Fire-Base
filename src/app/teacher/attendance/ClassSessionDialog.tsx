// src/app/teacher/attendance/ClassSessionDialog.tsx
import { useEffect, useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { type ClassSession, type Attendee, classSessionSchema, type ClassSessionFormData } from './schema';
import { addClassSessionAction, updateClassSessionAction } from './actions';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

// Mock student list for the dropdown
const mockStudents: Omit<Attendee, 'present'>[] = [
    { studentId: 'std1', studentName: 'Aisha K.' },
    { studentId: 'std2', studentName: 'John Doe' },
    { studentId: 'std3', studentName: 'Jane Smith' },
    { studentId: 'std4', studentName: 'Peter Jones' },
];

type ClassSessionDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingSession: ClassSession | null;
  onSave: () => void;
  selectedDate?: Date;
};

export default function ClassSessionDialog({ isOpen, setIsOpen, editingSession, onSave, selectedDate }: ClassSessionDialogProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<ClassSessionFormData>({
    resolver: zodResolver(classSessionSchema),
    defaultValues: {
        date: selectedDate || new Date(),
        time: '',
        durationHours: 1,
        topicTaught: '',
        notes: '',
        attendees: [],
        status: 'Pending Approval',
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (editingSession) {
        reset({ ...editingSession, date: new Date(editingSession.date) });
      } else {
        reset({
          date: selectedDate || new Date(),
          time: '',
          durationHours: 1,
          topicTaught: '',
          notes: '',
          attendees: mockStudents.map(s => ({...s, present: false})), // Pre-populate with all students
          status: 'Pending Approval',
        });
      }
    }
  }, [isOpen, editingSession, reset, selectedDate]);
  
  const attendees = watch('attendees');

  const onSubmit = (data: ClassSessionFormData) => {
    startTransition(async () => {
      const action = editingSession ? updateClassSessionAction : addClassSessionAction;
      const result = await action(data);

      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
        onSave();
        setIsOpen(false);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingSession ? 'Edit' : 'Add'} Class Session</DialogTitle>
          <DialogDescription>
            {editingSession ? 'Update the details for this class session.' : `Log a new class session for ${selectedDate ? format(selectedDate, 'PPP') : 'the selected date'}.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Time Slot</Label>
              <Input id="time" {...register('time')} placeholder="e.g., 18:00 - 19:30" />
              {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
            </div>
             <div>
              <Label htmlFor="durationHours">Duration (in hours)</Label>
              <Input id="durationHours" type="number" step="0.5" {...register('durationHours')} />
              {errors.durationHours && <p className="text-sm text-destructive mt-1">{errors.durationHours.message}</p>}
            </div>
            <div>
                <Label>Status</Label>
                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                />
            </div>
          </div>
          <div>
            <Label htmlFor="topicTaught">Topic Taught</Label>
            <Input id="topicTaught" {...register('topicTaught')} />
            {errors.topicTaught && <p className="text-sm text-destructive mt-1">{errors.topicTaught.message}</p>}
          </div>
          <div>
            <Label>Attendance</Label>
            <Card className="p-4 mt-1 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                 {attendees.map((attendee, index) => (
                    <div key={attendee.studentId} className="flex items-center space-x-2">
                         <Controller
                            name={`attendees.${index}.present`}
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id={`att-${index}`}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label htmlFor={`att-${index}`} className="font-normal">{attendee.studentName}</Label>
                    </div>
                ))}
                </div>
            </Card>
          </div>
           <div>
            <Label htmlFor="notes">Notes/Comments</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Any comments about the class or student performance..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : (editingSession ? 'Save Changes' : 'Submit for Approval')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
