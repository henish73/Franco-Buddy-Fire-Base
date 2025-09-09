// src/app/admin/blog-management/taxonomyActions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { type BlogCategory, type BlogTag } from "@/app/(public)/blog/mockBlogPosts";
import { db } from "./db"; // Import the persistent in-memory DB

// --- Zod Schemas ---
const categoryActionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Category name is required (min 2 chars)"),
  slug: z.string().min(2, "Slug is required (min 2 chars)").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format (e.g., 'my-category-slug')"),
  description: z.string().optional(),
});
export type CategoryFormData = z.infer<typeof categoryActionSchema>;

const tagActionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Tag name is required (min 2 chars)"),
  slug: z.string().min(2, "Slug is required (min 2 chars)").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format (e.g., 'my-tag-slug')"),
});
export type TagFormData = z.infer<typeof tagActionSchema>;

// --- Form State Type ---
export type TaxonomyFormState = {
  message: string;
  errors?: {
    name?: string[];
    slug?: string[];
    description?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  data?: BlogCategory | BlogTag | BlogCategory[] | BlogTag[];
};

// --- Category Actions ---
export async function getCategoriesAction(): Promise<TaxonomyFormState> {
  try {
    return {
      message: "Categories fetched successfully.",
      isSuccess: true,
      data: [...db.categories].sort((a, b) => a.name.localeCompare(b.name)),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { message: "Failed to fetch categories.", isSuccess: false };
  }
}

export async function addCategoryAction(
  prevState: TaxonomyFormState,
  formData: FormData
): Promise<TaxonomyFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = categoryActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  if (db.categories.some(cat => cat.slug === validatedFields.data.slug)) {
    return {
      message: "Category slug already exists. Please use a unique slug.",
      errors: { slug: ["Slug already exists. Please use a unique slug."] },
      isSuccess: false,
    };
  }

  try {
    const newCategory: BlogCategory = {
      id: `cat-${validatedFields.data.slug}-${Date.now()}`,
      ...validatedFields.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.categories.push(newCategory);
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog", "layout");
    return { message: "Category added successfully!", isSuccess: true, data: newCategory };
  } catch (error) {
    console.error("Error adding category:", error);
    return { message: "Failed to add category.", isSuccess: false };
  }
}

export async function updateCategoryAction(
  prevState: TaxonomyFormState,
  formData: FormData
): Promise<TaxonomyFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = categoryActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  if (!validatedFields.data.id) {
    return { message: "Category ID is missing for update.", isSuccess: false };
  }

  const categoryId = validatedFields.data.id;
  const categoryIndex = db.categories.findIndex(cat => cat.id === categoryId);
  if (categoryIndex === -1) {
    return { message: "Category not found.", isSuccess: false };
  }
  
  if (validatedFields.data.slug !== db.categories[categoryIndex].slug && 
      db.categories.some(cat => cat.slug === validatedFields.data.slug && cat.id !== categoryId)) {
    return {
      message: "Category slug already exists. Please use a unique slug.",
      errors: { slug: ["Slug already exists. Please use a unique slug."] },
      isSuccess: false,
    };
  }

  try {
    const originalCategory = db.categories[categoryIndex];
    const updatedCategoryData = validatedFields.data;

    const updatedCategory: BlogCategory = {
      ...originalCategory,
      ...updatedCategoryData,
      updatedAt: new Date().toISOString(),
    };
    
    db.categories[categoryIndex] = updatedCategory;
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog", "layout");

    return { message: "Category updated successfully!", isSuccess: true, data: updatedCategory };
  } catch (error) {
    console.error("Error updating category:", error);
    return { message: "Failed to update category.", isSuccess: false };
  }
}

export async function deleteCategoryAction(categoryId: string): Promise<TaxonomyFormState> {
  try {
    const initialLength = db.categories.length;
    db.categories = db.categories.filter(cat => cat.id !== categoryId);
    if (db.categories.length === initialLength) {
        return { message: "Category not found or already deleted.", isSuccess: false };
    }
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog", "layout");
    return { message: "Category deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { message: "Failed to delete category.", isSuccess: false };
  }
}

// --- Tag Actions ---
export async function getTagsAction(): Promise<TaxonomyFormState> {
  try {
    return {
      message: "Tags fetched successfully.",
      isSuccess: true,
      data: [...db.tags].sort((a, b) => a.name.localeCompare(b.name)),
    };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { message: "Failed to fetch tags.", isSuccess: false };
  }
}

export async function addTagAction(
  prevState: TaxonomyFormState,
  formData: FormData
): Promise<TaxonomyFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = tagActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }
  if (db.tags.some(tag => tag.slug === validatedFields.data.slug)) {
    return {
      message: "Tag slug already exists. Please use a unique slug.",
      errors: { slug: ["Slug already exists. Please use a unique slug."] },
      isSuccess: false,
    };
  }

  try {
    const newTag: BlogTag = {
      id: `tag-${validatedFields.data.slug}-${Date.now()}`,
      ...validatedFields.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.tags.push(newTag);
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog", "layout");
    return { message: "Tag added successfully!", isSuccess: true, data: newTag };
  } catch (error) {
    console.error("Error adding tag:", error);
    return { message: "Failed to add tag.", isSuccess: false };
  }
}

export async function updateTagAction(
  prevState: TaxonomyFormState,
  formData: FormData
): Promise<TaxonomyFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = tagActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }
  if (!validatedFields.data.id) {
    return { message: "Tag ID is missing for update.", isSuccess: false };
  }
  
  const tagId = validatedFields.data.id;
  const tagIndex = db.tags.findIndex(tag => tag.id === tagId);
  if (tagIndex === -1) {
    return { message: "Tag not found.", isSuccess: false };
  }

  if (validatedFields.data.slug !== db.tags[tagIndex].slug && 
      db.tags.some(tag => tag.slug === validatedFields.data.slug && tag.id !== tagId)) {
    return {
      message: "Tag slug already exists. Please use a unique slug.",
      errors: { slug: ["Slug already exists. Please use a unique slug."] },
      isSuccess: false,
    };
  }

  try {
    const originalTag = db.tags[tagIndex];
    const updatedTagData = validatedFields.data;

    const updatedTag: BlogTag = {
      ...originalTag,
      ...updatedTagData,
      updatedAt: new Date().toISOString(),
    };
    db.tags[tagIndex] = updatedTag;
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog", "layout");
    return { message: "Tag updated successfully!", isSuccess: true, data: updatedTag };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { message: "Failed to update tag.", isSuccess: false };
  }
}

export async function deleteTagAction(tagId: string): Promise<TaxonomyFormState> {
  try {
    const initialLength = db.tags.length;
    db.tags = db.tags.filter(tag => tag.id !== tagId);
     if (db.tags.length === initialLength) {
        return { message: "Tag not found or already deleted.", isSuccess: false };
    }
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog", "layout");
    return { message: "Tag deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { message: "Failed to delete tag.", isSuccess: false };
  }
}