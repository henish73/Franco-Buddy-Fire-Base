// src/app/admin/teacher-management/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
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
import { getTeachersAction, addTeacherAction, updateTeacherAction, deleteTeacherAction } from './actions';
import { type Teacher, type TeacherFormData, teacherFormSchema, type TeacherFormState } from './schema';

const initialFormState: TeacherFormState = { message: "", isSuccess: false, errors: {} };

export default function AdminTeachersPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherFormSchema),
  });

  const fetchTeachers = () => {
    startTransition(async () => {
      const result = await getTeachersAction();
      if (result.isSuccess && Array.isArray(result.data)) {
        setTeachers(result.data);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };
  
  useEffect(() => {
    fetchTeachers();
  }, []);

  const openAddDialog = () => {
    reset({ name: "", email: "", phone: "", password: "", status: "Active" });
    setEditingTeacher(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    reset({ ...teacher, password: "" }); // Password is not edited here
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<TeacherFormData> = (data) => {
    startTransition(async () => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        if (editingTeacher) {
            formData.append('id', editingTeacher.id);
            const result = await updateTeacherAction(initialFormState, formData);
             if (result.isSuccess) {
                toast({ title: "Success", description: result.message });
                setIsDialogOpen(false);
                fetchTeachers();
            } else {
                toast({ title: "Error", description: result.message || "Failed to update teacher.", variant: "destructive" });
            }
        } else {
            const teacherData = Object.fromEntries(formData) as unknown as Omit<TeacherFormData, 'id'>;
            const result = await addTeacherAction(teacherData);
            if (result.isSuccess) {
                toast({ title: "Success", description: result.message });
                setIsDialogOpen(false);
                fetchTeachers();
            } else {
                 toast({ title: "Error", description: result.message || "Failed to add teacher.", variant: "destructive" });
            }
        }
    });
};

  
  const handleDelete = (teacherId: string) => {
    startTransition(async () => {
        const result = await deleteTeacherAction(teacherId);
        if(result.isSuccess) {
            toast({ title: "Success", description: result.message });
            fetchTeachers();
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Teacher Management</h1>
        <div>
          <Button onClick={fetchTeachers} variant="outline" size="icon" className="mr-2" aria-label="Refresh Teachers" disabled={isPending}>
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={openAddDialog} disabled={isPending}><UserPlus className="mr-2 h-4 w-4" /> Add New Teacher</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div><Label htmlFor="name">Full Name</Label><Input id="name" {...register("name")} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} />{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}</div>
            <div><Label htmlFor="phone">Phone</Label><Input id="phone" {...register("phone")} />{errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}</div>
            {!editingTeacher && (
                <div><Label htmlFor="password">Password</Label><Input id="password" type="password" {...register("password")} />{errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}</div>
            )}
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
              <Button type="submit" disabled={isPending}>{editingTeacher ? "Save Changes" : "Add Teacher"}</Button>
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
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.name}</TableCell>
                <TableCell className="hidden md:table-cell">{teacher.email}</TableCell>
                <TableCell>
                  <Badge variant={teacher.status === "Active" ? "default" : "outline"}>{teacher.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(teacher)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(teacher.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {teachers.length === 0 && !isPending && <p className="text-center text-muted-foreground py-8">No teachers found.</p>}
    </div>
  );
}
