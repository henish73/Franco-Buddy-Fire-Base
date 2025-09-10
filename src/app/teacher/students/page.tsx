// src/app/teacher/students/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Mail, MessageSquare } from "lucide-react";
import { getStudentsAction } from '@/app/admin/students/actions';
import type { Student } from '@/app/admin/students/schema';
import { useToast } from '@/hooks/use-toast';

// This page currently uses the same data source as the admin page.
// In a real app, this would be filtered to show only students assigned to the logged-in teacher.

export default function TeacherStudentsPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getStudentsAction();
      if (result.isSuccess && Array.isArray(result.data)) {
        setStudents(result.data);
      } else {
        toast({ title: "Error", description: "Could not fetch student data.", variant: "destructive" });
      }
    });
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2"><Users /> My Students</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Assigned Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Enrolled Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                    <TableRow><TableCell colSpan={4} className="text-center">Loading students...</TableCell></TableRow>
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.enrolledCourse}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === "Active" ? "default" : "outline"}>{student.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button asChild variant="outline" size="icon">
                            <a href={`mailto:${student.email}`} aria-label="Email student"><Mail className="h-4 w-4"/></a>
                        </Button>
                        <Button asChild variant="outline" size="icon">
                            <a href={`https://wa.me/${student.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp student"><MessageSquare className="h-4 w-4"/></a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow><TableCell colSpan={4} className="text-center">No students assigned.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
