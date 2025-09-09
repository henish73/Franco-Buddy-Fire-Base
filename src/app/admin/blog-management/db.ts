// src/app/admin/blog-management/db.ts
import { mockBlogPosts, type BlogPost, type BlogCategory, type BlogTag } from "@/app/(public)/blog/mockBlogPosts";

// --- In-memory DB with Singleton Pattern ---
// This ensures that our "database" is initialized only once and persists across requests.

interface InMemoryDb {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
}

// Use a global symbol to store a single instance of the database.
const DB_KEY = Symbol.for("app.blog.db");

const globalWithDb = globalThis as typeof globalThis & {
  [DB_KEY]?: InMemoryDb;
};

function initializeDb(): InMemoryDb {
  const posts = JSON.parse(JSON.stringify(mockBlogPosts)) as BlogPost[];
  
  const categories = posts.reduce((acc, post) => {
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

  const tags = posts.reduce((acc, post) => {
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

  return { posts, categories, tags };
}

// If the db instance doesn't exist on the global object, create it.
// Otherwise, use the existing one.
if (!globalWithDb[DB_KEY]) {
  globalWithDb[DB_KEY] = initializeDb();
}

export const db = globalWithDb[DB_KEY]!;
