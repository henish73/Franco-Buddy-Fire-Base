// src/app/(public)/blog/tag/[tagName]/page.tsx
import { mockBlogPosts, type BlogPost } from '../mockBlogPosts';
import BlogPostCard from '@/components/shared/BlogPostCard';
import SectionTitle from '@/components/shared/SectionTitle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

// This is a placeholder. In a real app, you'd fetch filtered posts.
async function getPostsByTag(tagName: string): Promise<BlogPost[]> {
  const decodedTagName = decodeURIComponent(tagName).replace(/-/g, ' ');
  return mockBlogPosts.filter(post => 
    post.tags.some(tag => tag.toLowerCase() === decodedTagName.toLowerCase())
  );
}

export default async function BlogTagPage({ params }: { params: { tagName: string } }) {
  const posts = await getPostsByTag(params.tagName);
  const tagTitle = decodeURIComponent(params.tagName).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <>
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <Tag className="h-12 w-12 text-primary mx-auto mb-4" />
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
                <BlogPostCard key={post.slug} post={post} />
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

// Optional: Generate static paths if you have a known list of tags
// export async function generateStaticParams() {
//   const tags = new Set<string>();
//   mockBlogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag.toLowerCase().replace(/\s+/g, '-'))));
//   return Array.from(tags).map(tagName => ({ tagName }));
// }
