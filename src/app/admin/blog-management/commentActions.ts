// src/app/(public)/blog/commentActions.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from './db'; // Import the persistent in-memory DB
import { type BlogComment } from '@/app/(public)/blog/mockBlogPosts';

const commentSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  comment: z.string().min(5, { message: "Comment must be at least 5 characters." }),
});

export type CommentFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    comment?: string[];
    form?: string[]; // General form errors
  };
  isSuccess: boolean;
};

const initialState: CommentFormState = {
  message: "",
  isSuccess: false,
  errors: {},
};

export async function addCommentAction(
  postId: string,
  postSlug: string,
  prevState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const rawFormData = {
    name: formData.get('name'),
    email: formData.get('email'),
    comment: formData.get('comment'),
  };

  const validatedFields = commentSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const postIndex = db.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return { message: "Blog post not found.", isSuccess: false };
    }

    const newComment: BlogComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      authorName: validatedFields.data.name,
      authorEmail: validatedFields.data.email || undefined,
      date: new Date().toISOString(),
      text: validatedFields.data.comment,
    };

    if (!db.posts[postIndex].comments) {
      db.posts[postIndex].comments = [];
    }
    db.posts[postIndex].comments!.push(newComment);
    
    revalidatePath(`/blog/${postSlug}`);

    return {
      message: "Comment submitted successfully! It will appear after moderation.",
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error submitting comment:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}