// src/app/(public)/blog/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { type BlogPost } from '../mockBlogPosts';
import SectionTitle from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle, Tag, ChevronRight, Send, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPostBySlugAction, getBlogPostsAction } from '@/app/admin/blog-management/postActions';
import CommentForm from './CommentForm'; // Create this component

export default async function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const postResult = await getPostBySlugAction(params.slug);
  
  if (!postResult.isSuccess || !postResult.data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <SectionTitle title="Post Not Found" subtitle={postResult.message || "The blog post you are looking for does not exist or has been moved."} />
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }
  const post = postResult.data as BlogPost;

  // Fetch all posts for related posts section (can be optimized later)
  const allPostsResult = await getBlogPostsAction();
  const allPosts = (allPostsResult.isSuccess && Array.isArray(allPostsResult.data)) ? allPostsResult.data as BlogPost[] : [];
  
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && Array.isArray(p.categories) && Array.isArray(post.categories) && p.categories.some(cat => post.categories.includes(cat)))
    .slice(0, 3);

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
            {Array.isArray(post.categories) && post.categories.map(category => (
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
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Sidebar */}
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
              </CardContent>
            </Card>
            
            {Array.isArray(post.tags) && post.tags.length > 0 && (
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

            {relatedPosts.length > 0 && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Related Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedPosts.map(relatedPost => (
                    <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="block group">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{relatedPost.title}</h4>
                      <p className="text-xs text-muted-foreground">{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>

      {/* Comments Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Leave a Comment</h2>
          <CommentForm postId={post.id!} postSlug={post.slug} />
          
          <div className="mt-12">
             <h3 className="text-xl font-semibold text-foreground mb-6">Comments ({post.comments?.length || 0})</h3>
             {post.comments && post.comments.length > 0 ? (
                <div className="space-y-6">
                    {post.comments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(comment => (
                         <div key={comment.id} className="border-t pt-6">
                            <div className="flex items-start gap-3">
                                <Avatar>
                                    <AvatarImage src={comment.authorImage || "https://placehold.co/40x40.png"} alt={comment.authorName} data-ai-hint={comment.authorImageAiHint || "user avatar generic"}/>
                                    <AvatarFallback>{comment.authorName.substring(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-foreground">{comment.authorName} <span className="text-xs text-muted-foreground ml-2">{new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></p>
                                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{comment.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             ) : (
                <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
             )}
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
