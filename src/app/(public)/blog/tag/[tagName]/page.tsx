// src/app/(public)/blog/tag/[tagName]/page.tsx
import { type BlogPost } from '../mockBlogPosts';
import BlogPostCard from '@/components/shared/BlogPostCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tag as TagIcon, RefreshCw } from 'lucide-react';
import { getPostsByTagSlugAction } from '@/app/admin/blog-management/postActions';

export const revalidate = 0; // Ensure this page is always dynamically rendered

// Helper function to format tag title from slug
function formatTagTitle(slug: string): string {
  return decodeURIComponent(slug)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function BlogTagPage({ params }: { params: { tagName: string } }) {
  const tagSlug = params.tagName;
  const tagTitle = formatTagTitle(tagSlug);

  const result = await getPostsByTagSlugAction(tagSlug);
  const posts = (result.isSuccess && Array.isArray(result.data)) ? result.data as BlogPost[] : [];

  if (!result.isSuccess && result.message) {
     console.error("Error fetching posts for tag:", result.message);
  }

  if (posts.length === 0 && !result.isSuccess) {
     return (
      <div className="container mx-auto px-4 py-16 text-center">
        <TagIcon className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Tag: {tagTitle}</h1>
        <p className="text-lg text-destructive mb-4">
          Could not load posts for this tag. {result.message}
        </p>
        <Button asChild variant="outline">
            <Link href="/blog">Back to All Posts</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <TagIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Tag: {tagTitle}</h1>
          <p className="text-lg text-muted-foreground">
            Showing posts tagged with &quot;{tagTitle}&quot;.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          ) : (
             <div className="text-center text-muted-foreground col-span-full py-10">
                <p className="mb-4">No blog posts found with the tag &quot;{tagTitle}&quot;.</p>
                 <Button asChild variant="outline">
                    <Link href="/blog">Back to All Posts</Link>
                </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}