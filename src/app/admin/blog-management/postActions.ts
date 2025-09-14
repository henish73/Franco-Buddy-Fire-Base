// src/app/admin/blog-management/postActions.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { type BlogPost } from '@/app/(public)/blog/mockBlogPosts';

// Mock database - in a real app, this would be a database
let blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Mastering TEF Canada: Your Complete Guide to Success",
    slug: "mastering-tef-canada-complete-guide",
    content: `
      <p>The Test d'Évaluation de Français (TEF) Canada is a crucial step for many immigrants looking to prove their French language proficiency for Canadian Permanent Residency applications. This comprehensive guide will walk you through everything you need to know to succeed.</p>
      
      <h2>Understanding the TEF Canada Format</h2>
      <p>The TEF Canada consists of four main components:</p>
      <ul>
        <li><strong>Compréhension de l'écrit (Reading):</strong> 60 minutes, 50 questions</li>
        <li><strong>Compréhension de l'oral (Listening):</strong> 40 minutes, 60 questions</li>
        <li><strong>Expression écrite (Writing):</strong> 60 minutes, 2 tasks</li>
        <li><strong>Expression orale (Speaking):</strong> 15 minutes, 2 tasks</li>
      </ul>
      
      <h2>Scoring System</h2>
      <p>Each section is scored on a scale of 0-699 points, which corresponds to Canadian Language Benchmark (CLB) levels:</p>
      <ul>
        <li>CLB 4: 226-270 points</li>
        <li>CLB 5: 271-309 points</li>
        <li>CLB 6: 310-348 points</li>
        <li>CLB 7: 349-406 points</li>
        <li>CLB 8: 407-450 points</li>
        <li>CLB 9: 451-500 points</li>
        <li>CLB 10: 501-699 points</li>
      </ul>
      
      <h2>Preparation Strategies</h2>
      <p>Success in TEF Canada requires a strategic approach:</p>
      <ol>
        <li><strong>Assess Your Current Level:</strong> Take practice tests to identify your strengths and weaknesses</li>
        <li><strong>Focus on Weak Areas:</strong> Allocate more study time to sections where you need improvement</li>
        <li><strong>Practice Regularly:</strong> Consistent daily practice is more effective than cramming</li>
        <li><strong>Use Official Materials:</strong> Practice with authentic TEF materials and sample tests</li>
        <li><strong>Time Management:</strong> Practice under timed conditions to build speed and accuracy</li>
      </ol>
      
      <h2>Common Mistakes to Avoid</h2>
      <p>Many candidates make these common errors:</p>
      <ul>
        <li>Not reading instructions carefully</li>
        <li>Spending too much time on difficult questions</li>
        <li>Not practicing speaking aloud regularly</li>
        <li>Neglecting to review and learn from mistakes</li>
        <li>Underestimating the importance of time management</li>
      </ul>
      
      <h2>Final Tips for Success</h2>
      <p>On test day, remember to:</p>
      <ul>
        <li>Arrive early and bring required identification</li>
        <li>Stay calm and focused throughout the test</li>
        <li>Read all questions carefully before answering</li>
        <li>Use your time wisely - don't get stuck on difficult questions</li>
        <li>Trust your preparation and stay confident</li>
      </ul>
      
      <p>With proper preparation and the right mindset, you can achieve your target CLB level and take a significant step toward your Canadian dream. Good luck!</p>
    `,
    excerpt: "A comprehensive guide to mastering the TEF Canada exam, including format, scoring, preparation strategies, and common mistakes to avoid.",
    author: "Henish Patel",
    date: "2024-01-15T00:00:00.000Z",
    imageUrl: "https://picsum.photos/800/400",
    imageAiHint: "TEF Canada exam preparation study materials",
    categories: ["TEF Canada", "Study Tips", "Immigration"],
    tags: ["TEF", "French", "Canada", "Immigration", "Study Guide"],
    comments: []
  },
  {
    id: "2",
    title: "TCF vs TEF: Which French Test Should You Choose?",
    slug: "tcf-vs-tef-which-french-test-choose",
    content: `
      <p>When applying for Canadian immigration, choosing the right French language test can significantly impact your success. Both TCF (Test de Connaissance du Français) and TEF (Test d'Évaluation de Français) are accepted by Immigration, Refugees and Citizenship Canada (IRCC), but they have distinct characteristics.</p>
      
      <h2>Key Differences</h2>
      
      <h3>Test Format</h3>
      <p><strong>TCF Canada:</strong></p>
      <ul>
        <li>Adaptive computer-based test</li>
        <li>Questions adjust based on your performance</li>
        <li>Shorter overall duration</li>
        <li>Results available immediately</li>
      </ul>
      
      <p><strong>TEF Canada:</strong></p>
      <ul>
        <li>Fixed-format test</li>
        <li>Same questions for all candidates</li>
        <li>Longer duration but more predictable</li>
        <li>Results available within 4-6 weeks</li>
      </ul>
      
      <h3>Scoring System</h3>
      <p>Both tests use the Canadian Language Benchmark (CLB) system, but their scoring scales differ:</p>
      <ul>
        <li><strong>TCF:</strong> 0-699 points per section</li>
        <li><strong>TEF:</strong> 0-699 points per section</li>
      </ul>
      
      <h2>Which Test Should You Choose?</h2>
      
      <h3>Choose TCF if:</h3>
      <ul>
        <li>You prefer adaptive testing</li>
        <li>You want faster results</li>
        <li>You're comfortable with computer-based testing</li>
        <li>You have limited time for preparation</li>
      </ul>
      
      <h3>Choose TEF if:</h3>
      <ul>
        <li>You prefer traditional test formats</li>
        <li>You want more time to think through questions</li>
        <li>You're more comfortable with paper-based practice</li>
        <li>You have more time for preparation</li>
      </ul>
      
      <h2>Preparation Considerations</h2>
      <p>Both tests require similar preparation strategies, but there are some differences:</p>
      <ul>
        <li><strong>TCF:</strong> Focus on quick decision-making and computer navigation</li>
        <li><strong>TEF:</strong> Emphasize thorough reading and careful analysis</li>
      </ul>
      
      <h2>Cost and Availability</h2>
      <p>Both tests are similarly priced and widely available across Canada. Check with your local testing center for specific dates and costs.</p>
      
      <p>Ultimately, the choice between TCF and TEF depends on your personal preferences, learning style, and timeline. Both tests are equally valid for Canadian immigration purposes.</p>
    `,
    excerpt: "Compare TCF and TEF Canada tests to determine which French language proficiency exam is right for your Canadian immigration journey.",
    author: "Sarah Johnson",
    date: "2024-01-10T00:00:00.000Z",
    imageUrl: "https://picsum.photos/800/400",
    imageAiHint: "French language test comparison chart",
    categories: ["TEF Canada", "TCF", "Immigration"],
    tags: ["TEF", "TCF", "French", "Canada", "Comparison"],
    comments: []
  }
];

export async function getBlogPostsAction(): Promise<{ isSuccess: boolean; data?: BlogPost[]; message?: string }> {
  try {
    return {
      isSuccess: true,
      data: blogPosts,
      message: "Blog posts retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch blog posts"
    };
  }
}

export async function getPostBySlugAction(slug: string): Promise<{ isSuccess: boolean; data?: BlogPost; message?: string }> {
  try {
    const post = blogPosts.find(p => p.slug === slug);
    
    if (!post) {
      return {
        isSuccess: false,
        message: "Post not found"
      };
    }
    
    return {
      isSuccess: true,
      data: post,
      message: "Post retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch post"
    };
  }
}

export async function createPostAction(formData: FormData): Promise<{ isSuccess: boolean; message?: string; errors?: Record<string, string[]> }> {
  try {
    const postSchema = z.object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
      excerpt: z.string().min(1, "Excerpt is required"),
      author: z.string().min(1, "Author is required"),
      categories: z.string().min(1, "Categories are required"),
      tags: z.string().min(1, "Tags are required"),
    });

    const rawData = Object.fromEntries(formData.entries());
    const validatedData = postSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        isSuccess: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Validation failed"
      };
    }

    const { title, content, excerpt, author, categories, tags } = validatedData.data;
    
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content,
      excerpt,
      author,
      date: new Date().toISOString(),
      imageUrl: "https://picsum.photos/800/400",
      imageAiHint: "blog post image",
      categories: categories.split(',').map(c => c.trim()),
      tags: tags.split(',').map(t => t.trim()),
      comments: []
    };

    blogPosts.unshift(newPost);
    revalidatePath('/blog');
    
    return {
      isSuccess: true,
      message: "Post created successfully"
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      isSuccess: false,
      message: "Failed to create post"
    };
  }
}

export async function updatePostAction(id: string, formData: FormData): Promise<{ isSuccess: boolean; message?: string; errors?: Record<string, string[]> }> {
  try {
    const postSchema = z.object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
      excerpt: z.string().min(1, "Excerpt is required"),
      author: z.string().min(1, "Author is required"),
      categories: z.string().min(1, "Categories are required"),
      tags: z.string().min(1, "Tags are required"),
    });

    const rawData = Object.fromEntries(formData.entries());
    const validatedData = postSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        isSuccess: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Validation failed"
      };
    }

    const { title, content, excerpt, author, categories, tags } = validatedData.data;
    const postIndex = blogPosts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return {
        isSuccess: false,
        message: "Post not found"
      };
    }

    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      title,
      content,
      excerpt,
      author,
      categories: categories.split(',').map(c => c.trim()),
      tags: tags.split(',').map(t => t.trim()),
    };

    revalidatePath('/blog');
    revalidatePath(`/blog/${blogPosts[postIndex].slug}`);
    
    return {
      isSuccess: true,
      message: "Post updated successfully"
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      isSuccess: false,
      message: "Failed to update post"
    };
  }
}

export async function deletePostAction(id: string): Promise<{ isSuccess: boolean; message?: string }> {
  try {
    const postIndex = blogPosts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return {
        isSuccess: false,
        message: "Post not found"
      };
    }

    blogPosts.splice(postIndex, 1);
    revalidatePath('/blog');
    
    return {
      isSuccess: true,
      message: "Post deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      isSuccess: false,
      message: "Failed to delete post"
    };
  }
}

export async function getPostsByCategorySlugAction(slug: string): Promise<{ isSuccess: boolean; data?: BlogPost[]; message?: string }> {
  try {
    const filteredPosts = blogPosts.filter(post => 
      Array.isArray(post.categories) && 
      post.categories.some(cat => cat.toLowerCase().replace(/\s+/g, '-') === slug)
    );
    
    return {
      isSuccess: true,
      data: filteredPosts,
      message: "Posts retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch posts"
    };
  }
}

export async function getPostsByTagSlugAction(slug: string): Promise<{ isSuccess: boolean; data?: BlogPost[]; message?: string }> {
  try {
    const filteredPosts = blogPosts.filter(post => 
      Array.isArray(post.tags) && 
      post.tags.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === slug)
    );
    
    return {
      isSuccess: true,
      data: filteredPosts,
      message: "Posts retrieved successfully"
    };
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch posts"
    };
  }
}
