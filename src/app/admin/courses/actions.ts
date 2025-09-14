// src/app/admin/courses/actions.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { type Course } from '@/components/shared/CourseCard';

// Mock courses data
let courses: Course[] = [
  {
    id: "1",
    title: "TEF Canada Complete Preparation",
    description: "Comprehensive TEF Canada preparation course covering all four language skills with personalized feedback and practice tests.",
    price: 249,
    duration: "12 weeks",
    level: "All Levels",
    imageUrl: "https://picsum.photos/400/300",
    imageAiHint: "French language learning classroom",
    instructor: "Sarah Johnson",
    rating: 4.9,
    studentsCount: 156,
    modules: [
      {
        id: "1",
        title: "Reading Comprehension",
        lessons: [
          { id: "1", title: "Understanding Text Types", duration: "45 min" },
          { id: "2", title: "Reading Strategies", duration: "60 min" },
          { id: "3", title: "Practice Tests", duration: "90 min" }
        ]
      },
      {
        id: "2", 
        title: "Listening Comprehension",
        lessons: [
          { id: "1", title: "Audio Types and Formats", duration: "45 min" },
          { id: "2", title: "Note-taking Techniques", duration: "60 min" },
          { id: "3", title: "Practice Tests", duration: "90 min" }
        ]
      }
    ],
    whatsIncluded: [
      { icon: "Users", text: "Small group classes (max 5 students)" },
      { icon: "Award", text: "Official practice materials" },
      { icon: "Video", text: "Recorded sessions for review" },
      { icon: "FileText", text: "Comprehensive study guide" },
      { icon: "Brain", text: "AI-powered practice sessions" },
      { icon: "ClipboardCheck", text: "Mock exams and assessments" }
    ],
    features: [
      "Personalized feedback on all assignments",
      "24/7 access to AI tutor",
      "Flexible scheduling options",
      "Money-back guarantee"
    ],
    requirements: [
      "Basic computer skills",
      "Internet connection",
      "Dedication to practice daily"
    ]
  },
  {
    id: "2",
    title: "TCF Intensive Course",
    description: "Fast-track TCF preparation designed for busy professionals who need to achieve their target score quickly.",
    price: 399,
    duration: "8 weeks",
    level: "Intermediate to Advanced",
    imageUrl: "https://picsum.photos/400/300",
    imageAiHint: "Professional French language training",
    instructor: "Marie Dubois",
    rating: 4.8,
    studentsCount: 89,
    modules: [
      {
        id: "1",
        title: "Speaking Skills",
        lessons: [
          { id: "1", title: "Pronunciation Mastery", duration: "60 min" },
          { id: "2", title: "Conversation Practice", duration: "90 min" },
          { id: "3", title: "Presentation Skills", duration: "75 min" }
        ]
      }
    ],
    whatsIncluded: [
      { icon: "Users", text: "1-on-1 coaching sessions" },
      { icon: "Award", text: "Official TCF materials" },
      { icon: "Video", text: "Personalized video feedback" },
      { icon: "FileText", text: "Custom study plan" },
      { icon: "Brain", text: "AI conversation partner" },
      { icon: "ClipboardCheck", text: "Weekly progress assessments" }
    ],
    features: [
      "Individual attention and feedback",
      "Flexible scheduling",
      "Real-time practice with AI",
      "Guaranteed score improvement"
    ],
    requirements: [
      "Intermediate French level (A2+)",
      "Commitment to daily practice",
      "Computer with microphone"
    ]
  }
];

export async function getCoursesAction(): Promise<{ isSuccess: boolean; data?: Course[]; message?: string }> {
  try {
    return {
      isSuccess: true,
      data: courses,
      message: "Courses retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch courses"
    };
  }
}

export async function getCourseByIdAction(id: string): Promise<{ isSuccess: boolean; data?: Course; message?: string }> {
  try {
    const course = courses.find(c => c.id === id);
    
    if (!course) {
      return {
        isSuccess: false,
        message: "Course not found"
      };
    }
    
    return {
      isSuccess: true,
      data: course,
      message: "Course retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch course"
    };
  }
}

export async function createCourseAction(formData: FormData): Promise<{ isSuccess: boolean; message?: string; errors?: Record<string, string[]> }> {
  try {
    const courseSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      price: z.coerce.number().min(0, "Price must be positive"),
      duration: z.string().min(1, "Duration is required"),
      level: z.string().min(1, "Level is required"),
      instructor: z.string().min(1, "Instructor is required"),
    });

    const rawData = Object.fromEntries(formData.entries());
    const validatedData = courseSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        isSuccess: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Validation failed"
      };
    }

    const { title, description, price, duration, level, instructor } = validatedData.data;
    
    const newCourse: Course = {
      id: Date.now().toString(),
      title,
      description,
      price,
      duration,
      level,
      imageUrl: "https://picsum.photos/400/300",
      imageAiHint: "course image",
      instructor,
      rating: 0,
      studentsCount: 0,
      modules: [],
      whatsIncluded: [],
      features: [],
      requirements: []
    };

    courses.push(newCourse);
    revalidatePath('/courses');
    
    return {
      isSuccess: true,
      message: "Course created successfully"
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      isSuccess: false,
      message: "Failed to create course"
    };
  }
}

export async function updateCourseAction(id: string, formData: FormData): Promise<{ isSuccess: boolean; message?: string; errors?: Record<string, string[]> }> {
  try {
    const courseSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      price: z.coerce.number().min(0, "Price must be positive"),
      duration: z.string().min(1, "Duration is required"),
      level: z.string().min(1, "Level is required"),
      instructor: z.string().min(1, "Instructor is required"),
    });

    const rawData = Object.fromEntries(formData.entries());
    const validatedData = courseSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        isSuccess: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Validation failed"
      };
    }

    const { title, description, price, duration, level, instructor } = validatedData.data;
    const courseIndex = courses.findIndex(c => c.id === id);
    
    if (courseIndex === -1) {
      return {
        isSuccess: false,
        message: "Course not found"
      };
    }

    courses[courseIndex] = {
      ...courses[courseIndex],
      title,
      description,
      price,
      duration,
      level,
      instructor,
    };

    revalidatePath('/courses');
    revalidatePath(`/courses/${id}`);
    
    return {
      isSuccess: true,
      message: "Course updated successfully"
    };
  } catch (error) {
    console.error("Error updating course:", error);
    return {
      isSuccess: false,
      message: "Failed to update course"
    };
  }
}

export async function deleteCourseAction(id: string): Promise<{ isSuccess: boolean; message?: string }> {
  try {
    const courseIndex = courses.findIndex(c => c.id === id);
    
    if (courseIndex === -1) {
      return {
        isSuccess: false,
        message: "Course not found"
      };
    }

    courses.splice(courseIndex, 1);
    revalidatePath('/courses');
    
    return {
      isSuccess: true,
      message: "Course deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      isSuccess: false,
      message: "Failed to delete course"
    };
  }
}
