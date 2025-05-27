// src/app/(public)/blog/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { mockBlogPosts, type BlogPost } from '../mockBlogPosts';
import SectionTitle from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle, Tag, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Function to fetch a single blog post by slug (simulated)
async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return mockBlogPosts.find(post => post.slug === slug);
}

export default async function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <SectionTitle title="Post Not Found" subtitle="The blog post you are looking for does not exist or has been moved." />
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  // Estimate read time (simple version)
  const wordsPerMinute = 200;
  const textLength = post.content.replace(/<[^>]+>/g, '').split(/\s+/).length; // Strip HTML for word count
  const readTime = Math.ceil(textLength / wordsPerMinute);

  return (
    <>
      {/* Breadcrumbs (simplified) */}
      <div className="bg-muted/50 py-4">
        <div className="container mx-auto px-4 text-sm">
          <Link href="/blog" className="text-primary hover:underline">Blog</Link>
          <span className="text-muted-foreground"> / {post.title}</span>
        </div>
      </div>

      {/* Post Header */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="mb-4">
            {post.categories.map(category => (
              <Link key={category} href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-primary hover:underline text-sm font-medium mr-2">
                {category}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">{post.title}</h1>
          <div className="flex justify-center items-center gap-4 text-muted-foreground text-sm">
            <span className="flex items-center gap-1"><UserCircle className="h-4 w-4" /> {post.author}</span>
            <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>{readTime} min read</span>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.imageUrl && (
        <div className="container mx-auto px-4 max-w-4xl mb-8 md:mb-12">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1200}
            height={600}
            className="rounded-lg shadow-lg object-cover w-full aspect-[16/9]"
            data-ai-hint={post.imageAiHint || "blog article visual"}
            priority
          />
        </div>
      )}
      
      {/* Post Content & Sidebar Layout */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Content */}
          <article className="lg:col-span-8 prose prose-lg dark:prose-invert max-w-none text-foreground/90">
             {/* Use prose classes for nice typography: https://tailwindcss.com/docs/typography-plugin */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Sidebar (Author Bio, Related Posts - Placeholder) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">About the Author</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                 <Image src="https://placehold.co/100x100.png" alt={post.author} width={80} height={80} className="rounded-full mx-auto mb-3" data-ai-hint="author portrait" />
                <h4 className="font-semibold text-foreground">{post.author}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.author === "Henish Patel" ? "Founder of French.GTA, CS Student & AI Enthusiast." : "Expert TEF Canada Instructor at French.GTA."}
                </p>
                {/* Add social links if available */}
              </CardContent>
            </Card>
            
            {post.tags && post.tags.length > 0 && (
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-primary">Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                        <Button key={tag} variant="outline" size="sm" asChild className="text-xs">
                            <Link href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>{tag}</Link>
                        </Button>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Related Posts (Placeholder) */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Related Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockBlogPosts.filter(p => p.slug !== post.slug && p.categories.some(cat => post.categories.includes(cat))).slice(0,3).map(relatedPost => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="block group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{relatedPost.title}</h4>
                    <p className="text-xs text-muted-foreground">{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Comments Section Placeholder */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Leave a Comment</h2>
          <form className="space-y-6 bg-card p-6 md:p-8 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="commentName">Name</Label>
                <Input id="commentName" name="commentName" placeholder="Your Name" required />
              </div>
              <div>
                <Label htmlFor="commentEmail">Email (Optional)</Label>
                <Input id="commentEmail" name="commentEmail" type="email" placeholder="your.email@example.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="commentMessage">Comment</Label>
              <Textarea id="commentMessage" name="commentMessage" placeholder="Write your comment here..." rows={5} required />
            </div>
            <Button type="submit" disabled>Submit Comment (Coming Soon)</Button>
            <p className="text-xs text-muted-foreground">Comments are moderated. Real-time updates for new comments coming soon.</p>
          </form>
          {/* Placeholder for displaying comments */}
          <div className="mt-12">
             <h3 className="text-xl font-semibold text-foreground mb-6">Comments (0)</h3>
             <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
             {/* Example Comment Structure (when implemented)
             <div className="border-t pt-6 mt-6">
                <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-foreground">John Doe <span className="text-xs text-muted-foreground ml-2">July 22, 2024</span></p>
                        <p className="text-sm text-muted-foreground mt-1">This is a great article, very insightful!</p>
                    </div>
                </div>
             </div>
             */}
          </div>
        </div>
      </section>

       {/* CTA Section */}
       <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Boost Your TEF Score?</h2>
            <p className="text-primary-foreground/80 mb-8">
              Our targeted courses and AI Tutor can help you achieve your Canadian dream.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/courses">Explore Courses</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link href="/ai-course-suggester">Try AI Course Suggester</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Function to generate static paths for all blog posts (optional, for SSG)
// export async function generateStaticParams() {
//   return mockBlogPosts.map((post) => ({
//     slug: post.slug,
//   }));
// }
