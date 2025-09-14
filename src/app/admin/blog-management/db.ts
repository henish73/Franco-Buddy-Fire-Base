// src/app/admin/blog-management/db.ts
// Mock database functions for blog management
// In a real application, this would connect to an actual database

import { type BlogPost } from '@/app/(public)/blog/mockBlogPosts';

// Mock database storage
let comments: Array<{
  id: string;
  postId: string;
  postSlug: string;
  authorName: string;
  authorEmail: string;
  text: string;
  date: string;
  authorImage?: string;
  authorImageAiHint?: string;
}> = [];

export async function addComment(
  postId: string,
  postSlug: string,
  authorName: string,
  authorEmail: string,
  text: string
): Promise<{ isSuccess: boolean; message?: string; commentId?: string }> {
  try {
    const newComment = {
      id: Date.now().toString(),
      postId,
      postSlug,
      authorName,
      authorEmail,
      text,
      date: new Date().toISOString(),
      authorImage: `https://placehold.co/40x40.png`,
      authorImageAiHint: "user avatar generic"
    };

    comments.push(newComment);
    
    return {
      isSuccess: true,
      message: "Comment added successfully",
      commentId: newComment.id
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return {
      isSuccess: false,
      message: "Failed to add comment"
    };
  }
}

export async function getCommentsByPostId(postId: string): Promise<{
  isSuccess: boolean;
  data?: Array<{
    id: string;
    postId: string;
    postSlug: string;
    authorName: string;
    authorEmail: string;
    text: string;
    date: string;
    authorImage?: string;
    authorImageAiHint?: string;
  }>;
  message?: string;
}> {
  try {
    const postComments = comments.filter(c => c.postId === postId);
    
    return {
      isSuccess: true,
      data: postComments,
      message: "Comments retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch comments"
    };
  }
}

export async function deleteComment(commentId: string): Promise<{
  isSuccess: boolean;
  message?: string;
}> {
  try {
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) {
      return {
        isSuccess: false,
        message: "Comment not found"
      };
    }

    comments.splice(commentIndex, 1);
    
    return {
      isSuccess: true,
      message: "Comment deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      isSuccess: false,
      message: "Failed to delete comment"
    };
  }
}

export async function getCommentById(commentId: string): Promise<{
  isSuccess: boolean;
  data?: {
    id: string;
    postId: string;
    postSlug: string;
    authorName: string;
    authorEmail: string;
    text: string;
    date: string;
    authorImage?: string;
    authorImageAiHint?: string;
  };
  message?: string;
}> {
  try {
    const comment = comments.find(c => c.id === commentId);
    
    if (!comment) {
      return {
        isSuccess: false,
        message: "Comment not found"
      };
    }
    
    return {
      isSuccess: true,
      data: comment,
      message: "Comment retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching comment:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch comment"
    };
  }
}

// Export all functions as a db object for easier importing
export const db = {
  addComment,
  getCommentsByPostId,
  deleteComment,
  getCommentById
};
