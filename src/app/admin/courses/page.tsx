// src/app/admin/courses/page.tsx
"use client";

import { useState, useEffect, useTransition, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, BookPlus, Edit, Trash2, RefreshCw, Users, Award, Video, FileText, Brain, ClipboardCheck, Target, MessageSquare, MessageCircle, Clock } from "lucide-react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { getCoursesAction, addCourseAction, updateCourseAction, deleteCourseAction, type CourseFormState } from './actions';
import type { Course } from '@/components/shared/CourseCard';
import { courseFormSchema, type CourseFormData } from './schema';

const initialFormState: CourseFormState = { message: "", isSuccess: false, errors: {} };

const iconMap = {
    Users, Award, Video, FileText, Brain, ClipboardCheck, Target, MessageSquare, MessageCircle, Clock
};

export default function AdminCoursesPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
  });

  const fetchCourses = async () => {
    startTransition(async () => {
      const result = await getCoursesAction();
      if (result.isSuccess && Array.isArray(result.data)) {
        setCourses(result.data);
      } else {
        toast({ title: "Error", description: result.message || "Failed to fetch courses.", variant: "destructive" });
      }
    });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAddDialog = () => {
    reset({ title: "", shortDescription: "", price1on1: 0, price1on3: 0, targetCLB: "", format: "", status: "Draft" });
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    reset({
      ...course,
      isForYou: course.isForYou?.join('\n') || '',
      whatsIncluded: course.whatsIncluded ? JSON.stringify(course.whatsIncluded.map(item => ({ text: item.text, icon: (item.icon as any).displayName || 'Users' })), null, 2) : '[]',
      modules: course.modules ? JSON.stringify(course.modules, null, 2) : '[]',
    });
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<CourseFormData> = (data) => {
    startTransition(async () => {
      const actionToCall = editingCourse ? updateCourseAction : addCourseAction;
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
              if (typeof value === 'object') {
                  formData.append(key, JSON.stringify(value));
              } else {
                 formData.append(key, String(value));
              }
          }
      });
      if (editingCourse) formData.append('id', editingCourse.id);
      
      const result = await actionToCall(initialFormState, formData);

      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
        setIsDialogOpen(false);
        fetchCourses();
      } else {
        toast({ title: "Error", description: result.message || "Failed to save course.", variant: "destructive" });
      }
    });
  };

  const handleDelete = (courseId: string) => {
    startTransition(async () => {
      const result = await deleteCourseAction(courseId);
      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
        fetchCourses();
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Course Management</h1>
        <div>
           <Button onClick={fetchCourses} variant="outline" size="icon" className="mr-2" aria-label="Refresh Courses" disabled={isPending}>
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={openAddDialog} disabled={isPending}><BookPlus className="mr-2 h-4 w-4" /> Add New Course</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 flex-grow overflow-y-auto pr-4">
            {/* Form fields as before, using react-hook-form's register */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" {...register("title")} className="col-span-3" />
              {errors.title && <p className="col-span-4 text-sm text-destructive text-right">{errors.title.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortDescription" className="text-right">Short Desc</Label>
              <Textarea id="shortDescription" {...register("shortDescription")} className="col-span-3" />
              {errors.shortDescription && <p className="col-span-4 text-sm text-destructive text-right">{errors.shortDescription.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="detailedDescription" className="text-right">Detailed Desc</Label>
              <Textarea id="detailedDescription" {...register("detailedDescription")} className="col-span-3" rows={5} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="price1on1">Price (1:1)</Label><Input id="price1on1" type="number" {...register("price1on1")} /></div>
                <div><Label htmlFor="price1on3">Price (1:3)</Label><Input id="price1on3" type="number" {...register("price1on3")} /></div>
                <div><Label htmlFor="targetCLB">Target CLB</Label><Input id="targetCLB" {...register("targetCLB")} /></div>
                <div><Label htmlFor="format">Format</Label><Input id="format" {...register("format")} /></div>
                <div><Label htmlFor="duration">Duration</Label><Input id="duration" {...register("duration")} /></div>
                 <div><Label htmlFor="status">Status</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Draft">Draft</SelectItem></SelectContent>
                      </Select>
                    )}
                  />
                </div>
            </div>
            <div>
              <Label htmlFor="isForYou">"Is For You" (one per line)</Label>
              <Textarea id="isForYou" {...register("isForYou")} rows={3} />
            </div>
            <div>
              <Label htmlFor="whatsIncluded">"What's Included" (JSON)</Label>
              <Textarea id="whatsIncluded" {...register("whatsIncluded")} rows={5} placeholder='[{"text": "Live Classes", "icon": "Users"}, ...]'/>
              {errors.whatsIncluded && <p className="text-sm text-destructive">{errors.whatsIncluded.message}</p>}
            </div>
            <div>
              <Label htmlFor="modules">Syllabus Modules (JSON)</Label>
              <Textarea id="modules" {...register("modules")} rows={8} placeholder="Enter full modules array as JSON..." />
              {errors.modules && <p className="text-sm text-destructive">{errors.modules.message}</p>}
            </div>
           
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{editingCourse ? "Save Changes" : "Add Course"}</Button>
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
                      <DropdownMenuItem onClick={() => openEditDialog(course)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(course.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {courses.length === 0 && <p className="text-center text-muted-foreground py-8">No courses found. {isPending && "Loading..."}</p>}
    </div>
  );
}
