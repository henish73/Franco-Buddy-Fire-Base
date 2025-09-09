// src/components/shared/BlogPostCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { type BlogPost } from '@/app/(public)/blog/mockBlogPosts'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CalendarDays, UserCircle } from 'lucide-react';

type BlogPostCardProps = {
  post: BlogPost;
};

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // Specify UTC to prevent hydration mismatch
  });

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      {post.imageUrl && (
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative w-full h-60"> {/* Fixed height for consistency */}
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={post.imageAiHint || "blog article abstract"}
            />
          </div>
        </Link>
      )}
      <CardHeader className="pb-4">
        <div className="mb-2">
          {post.categories.slice(0, 2).map(category => (
             <Link key={category} href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`} 
                   className="text-xs text-primary hover:underline font-medium mr-2 uppercase tracking-wider">
                {category}
            </Link>
          ))}
        </div>
        <CardTitle className="text-2xl text-primary hover:text-primary/80 transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><UserCircle className="h-3 w-3" /> {post.author}</span>
            <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3 text-base">{post.excerpt}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="group">
          <Link href={`/blog/${post.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
