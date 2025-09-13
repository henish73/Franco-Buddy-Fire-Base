// src/app/teacher/payroll/page.tsx
"use client";

import { useState, useEffect, useTransition, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import StatCard from "@/components/shared/StatCard";
import { useToast } from "@/hooks/use-toast";
import { getClassSessionsAction } from '../attendance/actions';
import type { ClassSession } from '../attendance/schema';
import { Wallet, Calendar, Clock, RefreshCw, BarChart } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PayrollPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [sessions, setSessions] = useState<ClassSession[]>([]);

  const fetchSessions = () => {
    startTransition(async () => {
      const result = await getClassSessionsAction();
      if (result.isSuccess && Array.isArray(result.data)) {
        setSessions(result.data.map(s => ({ ...s, date: new Date(s.date) })));
      } else {
        toast({ title: "Error", description: "Failed to fetch class sessions.", variant: "destructive" });
      }
    });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const { currentMonthSessions, totalHours, totalCompensation } = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const currentMonthSessions = sessions.filter(session => 
        session.status === 'Completed' &&
        isWithinInterval(session.date, { start: monthStart, end: monthEnd })
    );

    const totalHours = currentMonthSessions.reduce((acc, session) => acc + session.durationHours, 0);
    const totalCompensation = currentMonthSessions.reduce((acc, session) => acc + (session.compensation || 0), 0);

    return { currentMonthSessions, totalHours, totalCompensation };
  }, [sessions]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2"><Wallet /> Payroll</h1>
        <Button onClick={fetchSessions} variant="outline" size="icon" aria-label="Refresh Payroll" disabled={isPending}>
          <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Current Month Summary ({format(new Date(), 'MMMM yyyy')})</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard 
            title="Estimated Earnings" 
            value={`$${totalCompensation.toFixed(2)}`} 
            icon={Wallet} 
            description="From completed classes this month."
          />
          <StatCard 
            title="Total Classes Completed" 
            value={currentMonthSessions.length} 
            icon={Calendar} 
            description="Marked as 'Completed' this month."
          />
          <StatCard 
            title="Total Hours Logged" 
            value={totalHours.toFixed(1)} 
            icon={Clock} 
            description="For completed classes this month."
          />
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Completed Classes This Month</CardTitle>
          <CardDescription>This table shows all your completed and compensated sessions for the current month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead className="text-center">Hours</TableHead>
                  <TableHead className="text-right">Compensation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow><TableCell colSpan={5} className="text-center">Loading data...</TableCell></TableRow>
                ) : currentMonthSessions.length > 0 ? (
                  currentMonthSessions.sort((a,b) => b.date.getTime() - a.date.getTime()).map(session => (
                    <TableRow key={session.id}>
                      <TableCell>{format(session.date, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{session.time}</TableCell>
                      <TableCell>{session.topicTaught}</TableCell>
                      <TableCell className="text-center">{session.durationHours.toFixed(1)}</TableCell>
                      <TableCell className="text-right font-medium text-primary">${(session.compensation || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center">No completed classes this month.</TableCell></TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="font-bold">Total</TableCell>
                    <TableCell className="text-center font-bold">{totalHours.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-bold text-primary">${totalCompensation.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Alert>
        <BarChart className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          This is an estimate of your earnings. Official payment summaries will be sent at the end of each payment cycle.
        </AlertDescription>
      </Alert>
    </div>
  );
}
