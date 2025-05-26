// src/app/admin/courses/page.tsx
"use client"; // For using react-hook-form and dialogs

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, BookPlus, Edit, Trash2 } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Course } from '@/components/shared/CourseCard'; // Import the full Course type

// Mock initial courses data - use the main Course type
// In a real app, this data would be fetched from Firestore
const initialCourses: Course[] = [
  { id: "crs001", title: "TEF Foundation", shortDescription: "Fundamentals for TEF Canada.", price1on1: 500, price1on3: 300, status: "Active", targetCLB: "4-6", format: "1:1 / 1:3", detailedDescription: "Detailed overview...", isForYou: ["Beginners"], structure: "Weekly classes...", tefFocus: "Foundational skills..." },
  { id: "crs002", title: "TEF Pro - CLB 7+", shortDescription: "Intensive training for CLB 7+.", price1on1: 800, price1on3: 550, status: "Active", targetCLB: "7+", format: "1:1 / 1:3", detailedDescription: "Advanced strategies...", isForYou: ["Intermediate learners"], structure: "Mock tests...", tefFocus: "CLB 7+ strategies..." },
  { id: "crs003", title: "TEF Advanced Workshop", shortDescription: "Focus on specific skills.", price1on1: 250, price1on3: 150, status: "Draft", targetCLB: "7-9", format: "1:1 Workshop", detailedDescription: "Skill refinement...", isForYou: ["Advanced learners wanting polish"], structure: "Focused sessions...", tefFocus: "Specific TEF sections..." },
];

// Zod schema for form validation (subset of full Course type for form editing)
const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Course name is required (min 3 chars)"),
  shortDescription: z.string().min(10, "Short description is required (min 10 chars)"),
  price1on1: z.coerce.number().min(0, "Price must be a positive number").optional(),
  price1on3: z.coerce.number().min(0, "Price must be a positive number").optional(),
  targetCLB: z.string().min(1, "Target CLB is required"),
  format: z.string().min(3, "Format is required"),
  status: z.enum(["Active", "Draft"]),
  detailedDescription: z.string().optional(),
  isForYou: z.string().optional(), // For Textarea, admin enters one per line
  structure: z.string().optional(),
  tefFocus: z.string().optional(),
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
    reset({ status: "Draft", price1on1: 0, price1on3: 0, targetCLB: "", format: "" }); // Default values for new course
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    // Convert isForYou array to string for textarea
    const formData = {
      ...course,
      isForYou: course.isForYou?.join('\n') || '',
    };
    reset(formData);
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<CourseFormData> = (data) => {
    // Convert isForYou string back to array if needed for storage
    const courseDataToSave = {
      ...data,
      isForYou: data.isForYou?.split('\n').filter(line => line.trim() !== '') || [],
    };

    if (editingCourse) {
      // Update course
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...editingCourse, ...courseDataToSave } : c));
      console.log("Updating course:", { ...editingCourse, ...courseDataToSave });
    } else {
      // Add new course
      const newCourse = { ...courseDataToSave, id: `crs${Date.now()}` }; // Generate mock ID
      setCourses([...courses, newCourse as Course]); // Cast to Course for state
      console.log("Adding new course:", newCourse);
    }
    setIsDialogOpen(false);
    reset();
  };
  
  const handleToggleStatus = (courseId: string) => {
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
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
            <DialogDescription>
              {editingCourse ? "Update the course details." : "Enter the details for the new course."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Course Name</Label>
              <Input id="title" {...register("title")} className="col-span-3" />
              {errors.title && <p className="col-span-4 text-sm text-destructive text-right">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="shortDescription" className="text-right pt-2">Short Description</Label>
              <Textarea id="shortDescription" {...register("shortDescription")} className="col-span-3" rows={2} />
              {errors.shortDescription && <p className="col-span-4 text-sm text-destructive text-right">{errors.shortDescription.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="detailedDescription" className="text-right pt-2">Detailed Overview</Label>
              <Textarea id="detailedDescription" {...register("detailedDescription")} className="col-span-3" rows={4} />
              {errors.detailedDescription && <p className="col-span-4 text-sm text-destructive text-right">{errors.detailedDescription.message}</p>}
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
              <Label htmlFor="targetCLB" className="text-right">Target CLB</Label>
              <Input id="targetCLB" {...register("targetCLB")} className="col-span-3" placeholder="e.g., 4-6 or 7+"/>
              {errors.targetCLB && <p className="col-span-4 text-sm text-destructive text-right">{errors.targetCLB.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">Format</Label>
              <Input id="format" {...register("format")} className="col-span-3" placeholder="e.g., 1:1 Personal Coaching / 1:3 Small Group"/>
              {errors.format && <p className="col-span-4 text-sm text-destructive text-right">{errors.format.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="isForYou" className="text-right pt-2">"Is This Course For You?"</Label>
              <Textarea id="isForYou" {...register("isForYou")} className="col-span-3" rows={3} placeholder="Enter one point per line"/>
              {errors.isForYou && <p className="col-span-4 text-sm text-destructive text-right">{errors.isForYou.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="structure" className="text-right pt-2">Course Structure</Label>
              <Textarea id="structure" {...register("structure")} className="col-span-3" rows={3} />
              {errors.structure && <p className="col-span-4 text-sm text-destructive text-right">{errors.structure.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="tefFocus" className="text-right pt-2">TEF Canada Focus</Label>
              <Textarea id="tefFocus" {...register("tefFocus")} className="col-span-3" rows={3} />
              {errors.tefFocus && <p className="col-span-4 text-sm text-destructive text-right">{errors.tefFocus.message}</p>}
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
              <TableHead className="hidden md:table-cell">Target CLB</TableHead>
              <TableHead className="hidden md:table-cell">Price (1:1)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell className="hidden md:table-cell">{course.targetCLB}</TableCell>
                <TableCell className="hidden md:table-cell">${course.price1on1?.toFixed(2) ?? 'N/A'}</TableCell>
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
                      <DropdownMenuItem onClick={() => openEditDialog(course)}><Edit className="mr-2 h-4 w-4" /> Edit Details</DropdownMenuItem>
                      {/* <DropdownMenuItem>Manage Modules/Lessons (Coming Soon)</DropdownMenuItem> */}
                      <DropdownMenuItem onClick={() => handleToggleStatus(course.id)}>
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
