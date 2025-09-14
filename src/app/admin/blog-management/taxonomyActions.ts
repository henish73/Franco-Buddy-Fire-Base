// src/app/admin/blog-management/taxonomyActions.ts
"use server";

import { type BlogCategory, type BlogTag } from '@/app/(public)/blog/mockBlogPosts';

// Mock data for categories and tags
const categories: BlogCategory[] = [
  { id: "1", name: "TEF Canada", slug: "tef-canada", description: "Articles about TEF Canada exam preparation", postCount: 5 },
  { id: "2", name: "TCF", slug: "tcf", description: "TCF exam tips and strategies", postCount: 3 },
  { id: "3", name: "Study Tips", slug: "study-tips", description: "General French learning study tips", postCount: 8 },
  { id: "4", name: "Immigration", slug: "immigration", description: "Canadian immigration and language requirements", postCount: 6 },
  { id: "5", name: "Success Stories", slug: "success-stories", description: "Student success stories and testimonials", postCount: 4 }
];

const tags: BlogTag[] = [
  { id: "1", name: "TEF", slug: "tef", postCount: 5 },
  { id: "2", name: "TCF", slug: "tcf", postCount: 3 },
  { id: "3", name: "French", slug: "french", postCount: 12 },
  { id: "4", name: "Canada", slug: "canada", postCount: 8 },
  { id: "5", name: "Immigration", slug: "immigration", postCount: 6 },
  { id: "6", name: "Study Guide", slug: "study-guide", postCount: 7 },
  { id: "7", name: "Exam Tips", slug: "exam-tips", postCount: 9 },
  { id: "8", name: "Language Learning", slug: "language-learning", postCount: 10 },
  { id: "9", name: "CLB", slug: "clb", postCount: 4 },
  { id: "10", name: "Express Entry", slug: "express-entry", postCount: 5 }
];

export async function getCategoriesAction(): Promise<{ isSuccess: boolean; data?: BlogCategory[]; message?: string }> {
  try {
    return {
      isSuccess: true,
      data: categories,
      message: "Categories retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch categories"
    };
  }
}

export async function getTagsAction(): Promise<{ isSuccess: boolean; data?: BlogTag[]; message?: string }> {
  try {
    return {
      isSuccess: true,
      data: tags,
      message: "Tags retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch tags"
    };
  }
}

export async function getCategoryBySlugAction(slug: string): Promise<{ isSuccess: boolean; data?: BlogCategory; message?: string }> {
  try {
    const category = categories.find(c => c.slug === slug);
    
    if (!category) {
      return {
        isSuccess: false,
        message: "Category not found"
      };
    }
    
    return {
      isSuccess: true,
      data: category,
      message: "Category retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch category"
    };
  }
}

export async function getTagBySlugAction(slug: string): Promise<{ isSuccess: boolean; data?: BlogTag; message?: string }> {
  try {
    const tag = tags.find(t => t.slug === slug);
    
    if (!tag) {
      return {
        isSuccess: false,
        message: "Tag not found"
      };
    }
    
    return {
      isSuccess: true,
      data: tag,
      message: "Tag retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching tag by slug:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch tag"
    };
  }
}
