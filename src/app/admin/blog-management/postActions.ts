// src/app/admin/blog-management/postActions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { mockBlogPosts, type BlogPost } from "@/app/(public)/blog/mockBlogPosts"; // Import types
import { simulatedCategoriesDb, simulatedTagsDb } from "./taxonomyActions"; // For lookups if needed

// --- Simulated Database for Posts ---
// In a real app, this would be Firestore.
// Initialize with a deep copy of mockBlogPosts to avoid modifying the original import
let simulatedBlogPostsDb: BlogPost[] = JSON.parse(JSON.stringify(mockBlogPosts));


// --- Zod Schema for Post Actions (CRUD) ---
// This schema should align with what the form provides and what the DB expects.
const blogPostActionSchema = z.object({
  id: z.string().optional(), // Present for updates, absent for creates
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
    form?: string[]; // For general form errors
  };
  isSuccess: boolean;
  data?: BlogPost | BlogPost[] | null; // Can hold single post, array of posts, or null
};

const initialFormState: BlogPostFormState = { message: "", isSuccess: false, data: null };


// --- Server Actions ---

export async function getBlogPostsAction(): Promise<BlogPostFormState> {
  try {
    // In a real app: await db.collection('blog_posts').orderBy('date', 'desc').get();
    // Make sure to return a deep copy to prevent direct modification of the "DB"
    const postsToReturn = JSON.parse(JSON.stringify(simulatedBlogPostsDb));
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
    const post = simulatedBlogPostsDb.find(p => p.slug === slug);
    if (post) {
      return {
        message: "Post fetched successfully.",
        isSuccess: true,
        data: JSON.parse(JSON.stringify(post)), // Return a copy
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
    // Find the category name from the slug
    const category = simulatedCategoriesDb.find(c => c.slug === categorySlug);
    if (!category) {
      return { message: `Category with slug "${categorySlug}" not found.`, isSuccess: false, data: [] };
    }
    const categoryName = category.name;
    const filteredPosts = simulatedBlogPostsDb.filter(post => 
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
    // Find the tag name from the slug
    const tag = simulatedTagsDb.find(t => t.slug === tagSlug);
    if (!tag) {
      return { message: `Tag with slug "${tagSlug}" not found.`, isSuccess: false, data: [] };
    }
    const tagName = tag.name;
    const filteredPosts = simulatedBlogPostsDb.filter(post => 
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

  // Check for duplicate slug before adding
  if (simulatedBlogPostsDb.some(post => post.slug === validatedFields.data.slug)) {
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
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Generate a unique ID
      imageUrl: newPostData.imageUrl || undefined, // Ensure empty string becomes undefined
      imageAiHint: newPostData.imageAiHint || undefined,
      comments: [], // Initialize with empty comments array
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app: await db.collection('blog_posts').add(newPost);
    simulatedBlogPostsDb.push(newPost);
    console.log("[Server Action] Added new post to simulated DB:", newPost);
    
    revalidatePath("/admin/blog-management");
    revalidatePath("/blog"); // Revalidate blog listing
    revalidatePath(`/blog/${newPost.slug}`); // Revalidate the new post's page
    
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

  const postId = formData.get('id') as string; // ID should be passed in form for updates
  if (!postId) {
    return { message: "Post ID is missing for update.", isSuccess: false };
  }
  
  const postIndex = simulatedBlogPostsDb.findIndex(p => p.id === postId);
  if (postIndex === -1) {
    return { message: "Post not found for update.", isSuccess: false };
  }

  // Check for duplicate slug if it's being changed
  if (validatedFields.data.slug !== simulatedBlogPostsDb[postIndex].slug && 
      simulatedBlogPostsDb.some(post => post.slug === validatedFields.data.slug && post.id !== postId)) {
    return {
      message: "Slug already exists. Please use a unique slug.",
      errors: { slug: ["Slug already exists. Please use a unique slug."] },
      isSuccess: false,
    };
  }

  try {
    const updatedPostData = validatedFields.data;
    const originalPost = simulatedBlogPostsDb[postIndex];
    const updatedPost: BlogPost = {
      ...originalPost, // Preserve existing fields like comments, createdAt
      ...updatedPostData,
      imageUrl: updatedPostData.imageUrl || undefined,
      imageAiHint: updatedPostData.imageAiHint || undefined,
      updatedAt: new Date().toISOString(),
    };
    
    // In a real app: await db.collection('blog_posts').doc(postId).update(updatedPost);
    simulatedBlogPostsDb[postIndex] = updatedPost;
    console.log("[Server Action] Updated post in simulated DB:", updatedPost);

    revalidatePath("/admin/blog-management");
    revalidatePath("/blog");
    revalidatePath(`/blog/${updatedPost.slug}`);
    if (originalPost.slug !== updatedPost.slug) { // Revalidate old slug path if changed
        revalidatePath(`/blog/${originalPost.slug}`);
    }
    
    return { message: "Blog post updated successfully!", isSuccess: true, data: updatedPost };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { message: "Failed to update blog post.", isSuccess: false };
  }
}

export async function deleteBlogPostAction(postId: string): Promise<BlogPostFormState> {
  try {
    const postIndex = simulatedBlogPostsDb.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return { message: "Post not found for deletion.", isSuccess: false };
    }
    const deletedPost = simulatedBlogPostsDb[postIndex];
    
    // In a real app: await db.collection('blog_posts').doc(postId).delete();
    simulatedBlogPostsDb.splice(postIndex, 1);
    console.log(`[Server Action] Deleted post ${postId} from simulated DB.`);

    revalidatePath("/admin/blog-management");
    revalidatePath("/blog");
    revalidatePath(`/blog/${deletedPost.slug}`); // Revalidate the deleted post's page
    
    return { message: "Blog post deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { message: "Failed to delete blog post.", isSuccess: false };
  }
}
