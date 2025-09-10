// src/app/teacher/attendance/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Calendar as CalendarIcon, RefreshCw, Send, CheckCircle, Clock } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { type ClassSession, getClassSessionsAction, addClassSessionAction, updateClassSessionAction } from './actions';
import ClassSessionDialog from './ClassSessionDialog';
import { Badge } from '@/components/ui/badge';

export default function AttendancePage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  const fetchSessions = () => {
    startTransition(async () => {
      const result = await getClassSessionsAction();
      if (result.isSuccess && Array.isArray(result.data)) {
        setSessions(result.data.map(s => ({...s, date: new Date(s.date)})));
      } else {
        toast({ title: "Error", description: "Failed to fetch class sessions.", variant: "destructive" });
      }
    });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const openAddDialog = () => {
    setEditingSession(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (session: ClassSession) => {
    setEditingSession(session);
    setIsDialogOpen(true);
  };

  const selectedDaySessions = sessions.filter(session => selectedDate && isSameDay(session.date, selectedDate));

  const getStatusVariant = (status: ClassSession['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Scheduled': return 'secondary';
        case 'Pending Approval': return 'outline';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2"><CalendarIcon /> Class & Attendance Log</h1>
        <div>
          <Button onClick={fetchSessions} variant="outline" size="icon" className="mr-2" aria-label="Refresh Sessions" disabled={isPending}>
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={openAddDialog} disabled={isPending}><PlusCircle className="mr-2 h-4 w-4" /> Add Class Session</Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <Card>
            <CardHeader><CardTitle>Select Date</CardTitle></CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-0"
                onDayClick={handleDayClick}
                modifiers={{
                    hasSession: sessions.map(s => new Date(s.date))
                }}
                 modifiersStyles={{
                    hasSession: {
                      border: "2px solid hsl(var(--primary))",
                      borderRadius: '100%'
                    }
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sessions for {selectedDate ? format(selectedDate, 'PPP') : '...'}</CardTitle>
              <CardDescription>Click on a session to view or edit details.</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDaySessions.length > 0 ? (
                <div className="space-y-4">
                  {selectedDaySessions.map(session => (
                    <div key={session.id} className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => openEditDialog(session)}>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-foreground">{session.time}</p>
                        <Badge variant={getStatusVariant(session.status)}>{session.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Topic: {session.topicTaught}</p>
                      <p className="text-xs text-muted-foreground mt-2">Attendees: {session.attendees.filter(a => a.present).length} / {session.attendees.length}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No sessions scheduled for this date.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ClassSessionDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        editingSession={editingSession}
        onSave={fetchSessions}
        selectedDate={selectedDate}
      />
    </div>
  );
}
