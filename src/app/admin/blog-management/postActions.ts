// src/app/admin/blog-management/postActions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "./db"; // Import the persistent in-memory DB
import { type BlogPost, type BlogCategory, type BlogTag } from "@/app/(public)/blog/mockBlogPosts";
import { getCategoriesAction, getTagsAction } from "./taxonomyActions";

// --- Zod Schema for Post Actions (CRUD) ---
const blogPostActionSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3, "Slug is required (min 3 chars, e.g., my-first-post)").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format (e.g., 'my-post-slug')"),
  title: z.string().min(5, "Title is required (min 5 chars)"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  author: z.string().min(3, "Author name is required"),
  excerpt: z.string().min(10, "Excerpt is required (min 10 chars)"),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }).optional().or(z.literal('')),
  imageAiHint: z.string().max(50, "AI hint too long (max 50 chars)").optional(),
  content: z.string().min(20, "Content is required (min 20 chars)"),
  categories: z.preprocess(val => typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : [], z.array(z.string())),
  tags: z.preprocess(val => typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : [], z.array(z.string())),
  featured: z.preprocess(val => val === 'on' || val === true, z.boolean().optional().default(false)),
});
export type BlogPostFormData = z.infer<typeof blogPostActionSchema>;


// --- Form State Type ---
export type BlogPostFormState = {
  message: string;
  errors?: {
    slug?: string[];
    title?: string[];
    date?: string[];
    author?: string[];
    excerpt?: string[];
    imageUrl?: string[];
    imageAiHint?: string[];
    content?: string[];
    categories?: string[];
    tags?: string[];
    featured?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  data?: BlogPost | BlogPost[] | null;
};


// --- Server Actions ---

export async function getBlogPostsAction(): Promise<BlogPostFormState> {
  try {
    const postsToReturn = JSON.parse(JSON.stringify(db.posts));
    return {
      message: "Posts fetched successfully.",
      isSuccess: true,
      data: postsToReturn.sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { message: "Failed to fetch posts.", isSuccess: false, data: null };
  }
}

export async function getPostBySlugAction(slug: string): Promise<BlogPostFormState> {
  try {
    const post = db.posts.find(p => p.slug === slug);
    if (post) {
      return {
        message: "Post fetched successfully.",
        isSuccess: true,
        data: JSON.parse(JSON.stringify(post)),
      };
    }
    return { message: "Post not found.", isSuccess: false, data: null };
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    return { message: `Failed to fetch post: ${slug}.`, isSuccess: false, data: null };
  }
}

export async function getPostsByCategorySlugAction(categorySlug: string): Promise<BlogPostFormState> {
  try {
    const categoriesResult = await getCategoriesAction();
    if (!categoriesResult.isSuccess || !categoriesResult.data) {
      return { message: `Could not fetch categories to find slug "${categorySlug}".`, isSuccess: false, data: [] };
    }
    const allCategories = categoriesResult.data as BlogCategory[];
    const category = allCategories.find(c => c.slug === categorySlug);
    
    if (!category) {
      return { message: `Category with slug "${categorySlug}" not found.`, isSuccess: false, data: [] };
    }
    const categoryName = category.name;
    const filteredPosts = db.posts.filter(post => 
      post.categories.map(c => c.toLowerCase()).includes(categoryName.toLowerCase())
    );
    return {
      message: `Posts for category "${categoryName}" fetched successfully.`,
      isSuccess: true,
      data: JSON.parse(JSON.stringify(filteredPosts)),
    };
  } catch (error) {
    console.error(`Error fetching posts for category slug ${categorySlug}:`, error);
    return { message: `Failed to fetch posts for category: ${categorySlug}.`, isSuccess: false, data: [] };
  }
}

export async function getPostsByTagSlugAction(tagSlug: string): Promise<BlogPostFormState> {
  try {
    const tagsResult = await getTagsAction();
    if (!tagsResult.isSuccess || !tagsResult.data) {
      return { message: `Could not fetch tags to find slug "${tagSlug}".`, isSuccess: false, data: [] };
    }
    const allTags = tagsResult.data as BlogTag[];
    const tag = allTags.find(t => t.slug === tagSlug);

    if (!tag) {
      return { message: `Tag with slug "${tagSlug}" not found.`, isSuccess: false, data: [] };
    }
    const tagName = tag.name;
    const filteredPosts = db.posts.filter(post => 
      post.tags.map(t => t.toLowerCase()).includes(tagName.toLowerCase())
    );
    return {
      message: `Posts for tag "${tagName}" fetched successfully.`,
      isSuccess: true,
      data: JSON.parse(JSON.stringify(filteredPosts)),
    };
  } catch (error) {
    console.error(`Error fetching posts for tag slug ${tagSlug}:`, error);
    return { message: `Failed to fetch posts for tag: ${tagSlug}.`, isSuccess: false, data: [] };
  }
}

export async function addBlogPostAction(
  prevState: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = blogPostActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  if (db.posts.some(post => post.slug === validatedFields.data.slug)) {
    return {
      message: "Slug already exists. Please use a unique slug.",
      errors: { slug: ["Slug already exists. Please use a unique slug."] },
      isSuccess: false,
    };
  }

  try {
    const newPostData = validatedFields.data;
    const newPost: BlogPost = {
      ...newPostData,
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      imageUrl: newPostData.imageUrl || undefined,
      imageAiHint: newPostData.imageAiHint || undefined,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.posts.push(newPost);
    
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog", "layout");
    
    return { message: "Blog post added successfully!", isSuccess: true, data: newPost };
  } catch (error) {
    console.error("Error adding blog post:", error);
    return { message: "Failed to add blog post.", isSuccess: false };
  }
}

export async function updateBlogPostAction(
  prevState: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = blogPostActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  const postId = formData.get('id') as string;
  if (!postId) {
    return { message: "Post ID is missing for update.", isSuccess: false };
  }
  
  const postIndex = db.posts.findIndex(p => p.id === postId);
  if (postIndex === -1) {
    return { message: "Post not found for update.", isSuccess: false };
  }

  if (validatedFields.data.slug !== db.posts[postIndex].slug && 
      db.posts.some(post => post.slug === validatedFields.data.slug && post.id !== postId)) {
    return {
      message: "Slug already exists. Please use a unique slug.",
      errors: { slug: ["Slug already exists. Please use a unique slug."] },
      isSuccess: false,
    };
  }

  try {
    const updatedPostData = validatedFields.data;
    const originalPost = db.posts[postIndex];
    const updatedPost: BlogPost = {
      ...originalPost,
      ...updatedPostData,
      imageUrl: updatedPostData.imageUrl || undefined,
      imageAiHint: updatedPostData.imageAiHint || undefined,
      updatedAt: new Date().toISOString(),
    };
    
    db.posts[postIndex] = updatedPost;

    revalidatePath("/admin/blog-management");
    revalidatePath("/blog", "layout");
    
    return { message: "Blog post updated successfully!", isSuccess: true, data: updatedPost };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { message: "Failed to update blog post.", isSuccess: false };
  }
}

export async function deleteBlogPostAction(postId: string): Promise<BlogPostFormState> {
  try {
    const postIndex = db.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return { message: "Post not found for deletion.", isSuccess: false };
    }
    
    db.posts.splice(postIndex, 1);

    revalidatePath("/admin/blog-management");
    revalidatePath("/blog", "layout");
    
    return { message: "Blog post deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { message: "Failed to delete blog post.", isSuccess: false };
  }
}