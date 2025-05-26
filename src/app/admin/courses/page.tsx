// src/app/admin/courses/page.tsx
"use client"; // For using react-hook-form and dialogs

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, BookPlus, Edit, Trash2 } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Mock course data type (simplified for Part 1)
type Course = {
  id: string;
  name: string;
  shortDescription: string;
  price1on1: number;
  price1on3: number;
  status: "Active" | "Draft";
};

// Mock initial courses data
const initialCourses: Course[] = [
  { id: "crs001", name: "TEF Foundation", shortDescription: "Fundamentals for TEF Canada.", price1on1: 500, price1on3: 300, status: "Active" },
  { id: "crs002", name: "TEF Pro - CLB 7+", shortDescription: "Intensive training for CLB 7+.", price1on1: 800, price1on3: 550, status: "Active" },
  { id: "crs003", name: "TEF Advanced Workshop", shortDescription: "Focus on specific skills.", price1on1: 250, price1on3: 150, status: "Draft" },
];

// Zod schema for form validation
const courseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Course name is required (min 3 chars)"),
  shortDescription: z.string().min(10, "Short description is required (min 10 chars)"),
  price1on1: z.coerce.number().min(0, "Price must be a positive number"),
  price1on3: z.coerce.number().min(0, "Price must be a positive number"),
  status: z.enum(["Active", "Draft"]),
});
type CourseFormData = z.infer<typeof courseSchema>;


export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  const openAddDialog = () => {
    reset({ status: "Draft", price1on1: 0, price1on3: 0 }); // Default values for new course
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    reset(course);
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<CourseFormData> = (data) => {
    if (editingCourse) {
      // Update course
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...editingCourse, ...data } : c));
      // In real app: call server action to update course in Firestore
      console.log("Updating course:", { ...editingCourse, ...data });
    } else {
      // Add new course
      const newCourse = { ...data, id: `crs${Date.now()}` }; // Generate mock ID
      setCourses([...courses, newCourse]);
      // In real app: call server action to add course
      console.log("Adding new course:", newCourse);
    }
    setIsDialogOpen(false);
    reset();
  };
  
  const handleDeactivate = (courseId: string) => {
    // In real app, this would call a server action
    setCourses(courses.map(c => c.id === courseId ? {...c, status: c.status === "Active" ? "Draft" : "Active"} : c));
    console.log(`Toggling status for course ${courseId}`);
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Course Management</h1>
        <Button onClick={openAddDialog}><BookPlus className="mr-2 h-4 w-4" /> Add New Course</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
            <DialogDescription>
              {editingCourse ? "Update the course details." : "Enter the details for the new course."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Course Name</Label>
              <Input id="name" {...register("name")} className="col-span-3" />
              {errors.name && <p className="col-span-4 text-sm text-destructive text-right">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="shortDescription" className="text-right pt-2">Short Description</Label>
              <Textarea id="shortDescription" {...register("shortDescription")} className="col-span-3" rows={3} />
              {errors.shortDescription && <p className="col-span-4 text-sm text-destructive text-right">{errors.shortDescription.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price1on1" className="text-right">Price (1:1)</Label>
              <Input id="price1on1" type="number" {...register("price1on1")} className="col-span-3" />
              {errors.price1on1 && <p className="col-span-4 text-sm text-destructive text-right">{errors.price1on1.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price1on3" className="text-right">Price (1:3)</Label>
              <Input id="price1on3" type="number" {...register("price1on3")} className="col-span-3" />
              {errors.price1on3 && <p className="col-span-4 text-sm text-destructive text-right">{errors.price1on3.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select onValueChange={(value) => setValue("status", value as "Active" | "Draft")} defaultValue={editingCourse?.status || "Draft"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="col-span-4 text-sm text-destructive text-right">{errors.status.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingCourse ? "Save Changes" : "Add Course"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Price (1:1)</TableHead>
              <TableHead className="hidden md:table-cell">Price (1:3)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell className="hidden md:table-cell">${course.price1on1.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">${course.price1on3.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={course.status === "Active" ? "default" : "outline"}>{course.status}</Badge>
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
                      <DropdownMenuItem onClick={() => openEditDialog(course)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeactivate(course.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> {course.status === "Active" ? "Set to Draft" : "Set to Active"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {courses.length === 0 && <p className="text-center text-muted-foreground py-8">No courses found.</p>}
    </div>
  );
}
