// src/app/admin/blog-management/taxonomyActions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { type BlogCategory, type BlogTag, mockBlogPosts } from "@/app/(public)/blog/mockBlogPosts"; // Import types

// --- Simulated Database for Categories & Tags ---
// In a real app, this would be Firestore.

// Initialize with reduce and store in internal temporary const variables
const _initialSimulatedCategoriesDb: BlogCategory[] = mockBlogPosts.reduce((acc, post) => {
  post.categories.forEach(catName => {
    if (!acc.find(c => c.name === catName)) {
      const slug = catName.toLowerCase().replace(/\s+/g, '-');
      acc.push({ 
        id: `cat-${slug}-${Math.random().toString(36).substring(7)}`, 
        name: catName, 
        slug: slug, 
        description: `Description for ${catName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  });
  return acc;
}, [] as BlogCategory[]);

const _initialSimulatedTagsDb: BlogTag[] = mockBlogPosts.reduce((acc, post) => {
  post.tags.forEach(tagName => {
    if (!acc.find(t => t.name === tagName)) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-');
      acc.push({ 
        id: `tag-${slug}-${Math.random().toString(36).substring(7)}`, 
        name: tagName, 
        slug: slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  });
  return acc;
}, [] as BlogTag[]);

// These are module-local and NOT exported directly.
let simulatedCategoriesDb: BlogCategory[] = [..._initialSimulatedCategoriesDb];
let simulatedTagsDb: BlogTag[] = [..._initialSimulatedTagsDb];


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
    form?: string[]; // For general form errors
  };
  isSuccess: boolean;
  data?: BlogCategory | BlogTag | BlogCategory[] | BlogTag[];
};

// --- Category Actions ---
export async function getCategoriesAction(): Promise<TaxonomyFormState> {
  try {
    // In a real app: await db.collection('blog_categories').orderBy('name').get();
    console.log("[Server Action] Fetching categories from simulated DB.");
    return {
      message: "Categories fetched successfully.",
      isSuccess: true,
      data: [...simulatedCategoriesDb].sort((a, b) => a.name.localeCompare(b.name)),
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
   // Check for duplicate slug before adding
  if (simulatedCategoriesDb.some(cat => cat.slug === validatedFields.data.slug)) {
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
    // In a real app: await db.collection('blog_categories').add(newCategory);
    simulatedCategoriesDb.push(newCategory);
    console.log("[Server Action] Added new category to simulated DB:", newCategory);
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog");
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
  const categoryIndex = simulatedCategoriesDb.findIndex(cat => cat.id === categoryId);
  if (categoryIndex === -1) {
    return { message: "Category not found.", isSuccess: false };
  }
  
  // Check for duplicate slug if it's being changed
  if (validatedFields.data.slug !== simulatedCategoriesDb[categoryIndex].slug && 
      simulatedCategoriesDb.some(cat => cat.slug === validatedFields.data.slug && cat.id !== categoryId)) {
    return {
      message: "Category slug already exists. Please use a unique slug.",
      errors: { slug: ["Slug already exists. Please use a unique slug."] },
      isSuccess: false,
    };
  }

  try {
    const originalCategory = simulatedCategoriesDb[categoryIndex];
    const updatedCategoryData = validatedFields.data;

    const updatedCategory: BlogCategory = {
      ...originalCategory,
      ...updatedCategoryData,
      updatedAt: new Date().toISOString(),
    };
    
    simulatedCategoriesDb[categoryIndex] = updatedCategory;
    console.log("[Server Action] Updated category in simulated DB:", updatedCategory);
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog");
    revalidatePath(`/blog/category/${updatedCategory.slug}`);
    if (originalCategory.slug !== updatedCategory.slug) {
      revalidatePath(`/blog/category/${originalCategory.slug}`);
    }
    return { message: "Category updated successfully!", isSuccess: true, data: updatedCategory };
  } catch (error) {
    console.error("Error updating category:", error);
    return { message: "Failed to update category.", isSuccess: false };
  }
}

export async function deleteCategoryAction(categoryId: string): Promise<TaxonomyFormState> {
  try {
    const initialLength = simulatedCategoriesDb.length;
    const deletedCategory = simulatedCategoriesDb.find(cat => cat.id === categoryId);
    simulatedCategoriesDb = simulatedCategoriesDb.filter(cat => cat.id !== categoryId);
    if (!deletedCategory || simulatedCategoriesDb.length === initialLength) {
        return { message: "Category not found or already deleted.", isSuccess: false };
    }
    console.log(`[Server Action] Deleted category ${categoryId} from simulated DB.`);
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog");
    revalidatePath(`/blog/category/${deletedCategory.slug}`);
    return { message: "Category deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { message: "Failed to delete category.", isSuccess: false };
  }
}


// --- Tag Actions ---
export async function getTagsAction(): Promise<TaxonomyFormState> {
  try {
    console.log("[Server Action] Fetching tags from simulated DB.");
    return {
      message: "Tags fetched successfully.",
      isSuccess: true,
      data: [...simulatedTagsDb].sort((a, b) => a.name.localeCompare(b.name)),
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
  // Check for duplicate slug before adding
  if (simulatedTagsDb.some(tag => tag.slug === validatedFields.data.slug)) {
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
    simulatedTagsDb.push(newTag);
    console.log("[Server Action] Added new tag to simulated DB:", newTag);
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog");
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
  const tagIndex = simulatedTagsDb.findIndex(tag => tag.id === tagId);
  if (tagIndex === -1) {
    return { message: "Tag not found.", isSuccess: false };
  }

  // Check for duplicate slug if it's being changed
  if (validatedFields.data.slug !== simulatedTagsDb[tagIndex].slug && 
      simulatedTagsDb.some(tag => tag.slug === validatedFields.data.slug && tag.id !== tagId)) {
    return {
      message: "Tag slug already exists. Please use a unique slug.",
      errors: { slug: ["Slug already exists. Please use a unique slug."] },
      isSuccess: false,
    };
  }

  try {
    const originalTag = simulatedTagsDb[tagIndex];
    const updatedTagData = validatedFields.data;

    const updatedTag: BlogTag = {
      ...originalTag,
      ...updatedTagData,
      updatedAt: new Date().toISOString(),
    };
    simulatedTagsDb[tagIndex] = updatedTag;
    console.log("[Server Action] Updated tag in simulated DB:", updatedTag);
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog");
    revalidatePath(`/blog/tag/${updatedTag.slug}`);
    if (originalTag.slug !== updatedTag.slug) {
      revalidatePath(`/blog/tag/${originalTag.slug}`);
    }
    return { message: "Tag updated successfully!", isSuccess: true, data: updatedTag };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { message: "Failed to update tag.", isSuccess: false };
  }
}

export async function deleteTagAction(tagId: string): Promise<TaxonomyFormState> {
  try {
    const initialLength = simulatedTagsDb.length;
    const deletedTag = simulatedTagsDb.find(tag => tag.id === tagId);
    simulatedTagsDb = simulatedTagsDb.filter(tag => tag.id !== tagId);
     if (!deletedTag || simulatedTagsDb.length === initialLength) {
        return { message: "Tag not found or already deleted.", isSuccess: false };
    }
    console.log(`[Server Action] Deleted tag ${tagId} from simulated DB.`);
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog");
    revalidatePath(`/blog/tag/${deletedTag.slug}`);
    return { message: "Tag deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { message: "Failed to delete tag.", isSuccess: false };
  }
}

