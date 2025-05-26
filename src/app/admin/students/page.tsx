// src/app/admin/students/page.tsx
"use client"; // For using react-hook-form and dialogs

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, UserPlus, Edit, Trash2, Eye } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Mock student data type
type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrolledCourse: string; // Manual text field for now
  status: "Active" | "Inactive";
};

// Mock initial students data
const initialStudents: Student[] = [
  { id: "std001", firstName: "Fatima", lastName: "Zahra", email: "fatima@example.com", phone: "555-0011", enrolledCourse: "TEF Pro - CLB 7+", status: "Active" },
  { id: "std002", firstName: "David", lastName: "Lee", email: "david@example.com", phone: "555-0022", enrolledCourse: "TEF Foundation", status: "Inactive" },
];

// Zod schema for form validation
const studentSchema = z.object({
  id: z.string().optional(), // For editing existing student
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')), // Optional for edit, required for new
  enrolledCourse: z.string().min(1, "Enrolled course is required"),
  status: z.enum(["Active", "Inactive"]),
});
type StudentFormData = z.infer<typeof studentSchema>;

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const openAddDialog = () => {
    reset({ password: "", status: "Active" }); // Default values for new student
    setEditingStudent(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    reset({ ...student, password: "" }); // Don't prefill password for edit
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<StudentFormData> = (data) => {
    if (editingStudent) {
      // Update student
      setStudents(students.map(s => s.id === editingStudent.id ? { ...editingStudent, ...data } : s));
      // In real app: call server action to update student in Firestore
      console.log("Updating student:", { ...editingStudent, ...data });
    } else {
      // Add new student
      const newStudent = { ...data, id: `std${Date.now()}` }; // Generate mock ID
      setStudents([...students, newStudent]);
      // In real app: call server action to add student (including password hashing)
      console.log("Adding new student:", newStudent);
    }
    setIsDialogOpen(false);
    reset();
  };
  
  const handleDeactivate = (studentId: string) => {
    // In real app, this would call a server action
    setStudents(students.map(s => s.id === studentId ? {...s, status: s.status === "Active" ? "Inactive" : "Active"} : s));
    console.log(`Toggling status for student ${studentId}`);
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Student Management</h1>
        <Button onClick={openAddDialog}><UserPlus className="mr-2 h-4 w-4" /> Add New Student</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
            <DialogDescription>
              {editingStudent ? "Update the student's details." : "Enter the details for the new student."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">First Name</Label>
              <Input id="firstName" {...register("firstName")} className="col-span-3" />
              {errors.firstName && <p className="col-span-4 text-sm text-destructive text-right">{errors.firstName.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">Last Name</Label>
              <Input id="lastName" {...register("lastName")} className="col-span-3" />
              {errors.lastName && <p className="col-span-4 text-sm text-destructive text-right">{errors.lastName.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" {...register("email")} className="col-span-3" />
              {errors.email && <p className="col-span-4 text-sm text-destructive text-right">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" {...register("phone")} className="col-span-3" />
              {errors.phone && <p className="col-span-4 text-sm text-destructive text-right">{errors.phone.message}</p>}
            </div>
            {!editingStudent && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">Password</Label>
                    <Input id="password" type="password" {...register("password")} className="col-span-3" placeholder="Min. 6 characters" />
                    {errors.password && <p className="col-span-4 text-sm text-destructive text-right">{errors.password.message}</p>}
                </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="enrolledCourse" className="text-right">Enrolled Course</Label>
              <Input id="enrolledCourse" {...register("enrolledCourse")} className="col-span-3" placeholder="e.g., TEF Pro - CLB 7+"/>
              {errors.enrolledCourse && <p className="col-span-4 text-sm text-destructive text-right">{errors.enrolledCourse.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select onValueChange={(value) => setValue("status", value as "Active" | "Inactive")} defaultValue={editingStudent?.status || "Active"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="col-span-4 text-sm text-destructive text-right">{errors.status.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingStudent ? "Save Changes" : "Add Student"}</Button>
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
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
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
                <TableCell className="hidden lg:table-cell">{student.phone}</TableCell>
                <TableCell>{student.enrolledCourse}</TableCell>
                <TableCell>
                  <Badge variant={student.status === "Active" ? "default" : "destructive"}>{student.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(student)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      {/* <DropdownMenuItem> <Eye className="mr-2 h-4 w-4" /> View Profile</DropdownMenuItem> */}
                      <DropdownMenuItem onClick={() => handleDeactivate(student.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> {student.status === "Active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {students.length === 0 && <p className="text-center text-muted-foreground py-8">No students found.</p>}
    </div>
  );
}
