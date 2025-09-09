// src/app/(public)/blog/page.tsx
import SectionTitle from '@/components/shared/SectionTitle';
import { type BlogPost, type BlogCategory, type BlogTag } from './mockBlogPosts';
import { getBlogPostsAction } from '@/app/admin/blog-management/postActions';
import { getCategoriesAction, getTagsAction } from '@/app/admin/blog-management/taxonomyActions';
import BlogList from './BlogList'; // New component for client-side logic
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const revalidate = 0; // Ensure this page is always dynamically rendered

async function getBlogData() {
  const [postsResult, categoriesResult, tagsResult] = await Promise.all([
    getBlogPostsAction(),
    getCategoriesAction(),
    getTagsAction()
  ]);

  const posts = (postsResult.isSuccess && Array.isArray(postsResult.data)) ? postsResult.data as BlogPost[] : [];
  const categories = (categoriesResult.isSuccess && Array.isArray(categoriesResult.data)) ? categoriesResult.data as BlogCategory[] : [];
  const tags = (tagsResult.isSuccess && Array.isArray(tagsResult.data)) ? tagsResult.data as BlogTag[] : [];

  const errorMessages = [
    !postsResult.isSuccess ? postsResult.message : null,
    !categoriesResult.isSuccess ? categoriesResult.message : null,
    !tagsResult.isSuccess ? tagsResult.message : null,
  ].filter(Boolean);

  return { posts, categories, tags, error: errorMessages.join(' ') || null };
}


export default async function BlogPage() {
  const { posts, categories, tags, error } = await getBlogData();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Blog Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">French.GTA Blog</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Insights, tips, and strategies for your TEF Canada success and Canadian journey.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
           {/* Pass all data to the client component */}
           <BlogList
            initialPosts={posts}
            allCategories={categories}
            allTags={tags}
          />
        </div>
      </section>
    </>
  );
}