// src/app/admin/student-management/page.tsx
"use client";

import { useState, useEffect, useTransition, FormEvent } from 'react';
import { useActionState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, UserPlus, Edit, Trash2, RefreshCw } from "lucide-react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { getStudentsAction, addStudentAction, updateStudentAction, deleteStudentAction } from './actions';
import { type Student, type StudentFormData, studentFormSchema, type StudentFormState } from './schema';

const initialFormState: StudentFormState = { message: "", isSuccess: false, errors: {} };


export default function AdminStudentsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [students, setStudents] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
  });

  const fetchStudents = () => {
    startTransition(async () => {
      const result = await getStudentsAction();
      if (result.isSuccess && Array.isArray(result.data)) {
        setStudents(result.data);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };
  
  useEffect(() => {
    fetchStudents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddDialog = () => {
    reset({ firstName: "", lastName: "", email: "", phone: "", password: "", status: "Active" });
    setEditingStudent(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    reset({ ...student, password: "" }); // Password is not edited here
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<StudentFormData> = (data) => {
    startTransition(async () => {
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        if (editingStudent) {
            formData.append('id', editingStudent.id);
            const result = await updateStudentAction(initialFormState, formData);
             if (result.isSuccess) {
                toast({ title: "Success", description: result.message });
                setIsDialogOpen(false);
                fetchStudents();
            } else {
                toast({ title: "Error", description: result.message || "Failed to update student", variant: "destructive" });
            }
        } else {
            const studentData = Object.fromEntries(formData) as unknown as Omit<StudentFormData, 'id'>;
            const result = await addStudentAction(studentData);
            if (result.isSuccess) {
                toast({ title: "Success", description: result.message });
                setIsDialogOpen(false);
                fetchStudents();
            } else {
                 toast({ title: "Error", description: result.message || "Failed to add student", variant: "destructive" });
            }
        }
    });
};

  
  const handleDelete = (studentId: string) => {
    startTransition(async () => {
        const result = await deleteStudentAction(studentId);
        if(result.isSuccess) {
            toast({ title: "Success", description: result.message });
            fetchStudents();
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Student Management</h1>
        <div>
          <Button onClick={fetchStudents} variant="outline" size="icon" className="mr-2" aria-label="Refresh Students" disabled={isPending}>
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={openAddDialog} disabled={isPending}><UserPlus className="mr-2 h-4 w-4" /> Add New Student</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" {...register("firstName")} />{errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}</div>
              <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" {...register("lastName")} />{errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}</div>
            </div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} />{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}</div>
            <div><Label htmlFor="phone">Phone</Label><Input id="phone" {...register("phone")} />{errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}</div>
            {!editingStudent && (
                <div><Label htmlFor="password">Password</Label><Input id="password" type="password" {...register("password")} />{errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}</div>
            )}
            <div><Label htmlFor="enrolledCourse">Enrolled Course</Label><Input id="enrolledCourse" {...register("enrolledCourse")} />{errors.enrolledCourse && <p className="text-sm text-destructive">{errors.enrolledCourse.message}</p>}</div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{editingStudent ? "Save Changes" : "Add Student"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Enrolled Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                <TableCell>{student.enrolledCourse}</TableCell>
                <TableCell>
                  <Badge variant={student.status === "Active" ? "default" : "outline"}>{student.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(student)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(student.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {students.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No students found.</p>}
    </div>
  );
}
