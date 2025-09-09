// src/app/(public)/blog/BlogList.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import BlogPostCard from '@/components/shared/BlogPostCard';
import { type BlogPost, type BlogCategory, type BlogTag } from './mockBlogPosts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type BlogListProps = {
  initialPosts: BlogPost[];
  allCategories: BlogCategory[];
  allTags: BlogTag[];
};

export default function BlogList({ initialPosts, allCategories, allTags }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(initialPosts);

  // Update displayed posts when initialPosts changes (e.g., on revalidation)
  useEffect(() => {
    setDisplayedPosts(initialPosts);
  }, [initialPosts]);

  const sidebarData = useMemo(() => {
    return {
      categories: allCategories.sort((a, b) => a.name.localeCompare(b.name)),
      tags: allTags.sort((a, b) => a.name.localeCompare(b.name)),
      recentPosts: initialPosts.slice(0, 5).map(p => ({ title: p.title, slug: p.slug })),
      popularPosts: initialPosts.filter(p => p.featured).slice(0, 3).map(p => ({ title: p.title, slug: p.slug })),
    };
  }, [initialPosts, allCategories, allTags]);

  useEffect(() => {
    if (searchTerm === '') {
      setDisplayedPosts(initialPosts);
    } else {
      const filtered = initialPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(post.categories) && post.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setDisplayedPosts(filtered);
    }
  }, [searchTerm, initialPosts]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      {/* Blog Posts Area */}
      <div className="lg:col-span-8 space-y-10">
        {displayedPosts.length > 0 ? (
          displayedPosts.map((post) => (
            <BlogPostCard key={post.id || post.slug} post={post} />
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full py-10">
            No blog posts found matching your search criteria. Try a different term or clear the search.
          </p>
        )}
      </div>

      {/* Sidebar Area */}
      <aside className="lg:col-span-4 space-y-8 sticky top-24">
        {/* Search Bar */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-primary mb-4">Search Blog</h3>
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search articles..."
              className="flex-grow"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="outline" size="icon" aria-label="Search"><Search className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Categories */}
        {sidebarData.categories.length > 0 && (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-4">Categories</h3>
            <ul className="space-y-2">
              {sidebarData.categories.map(category => (
                <li key={category.id || category.slug}>
                  <Link href={`/blog/category/${category.slug}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Posts */}
        {sidebarData.recentPosts.length > 0 && (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-4">Recent Posts</h3>
            <ul className="space-y-3">
              {sidebarData.recentPosts.map(post => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors line-clamp-2">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Popular Posts (Featured) */}
        {sidebarData.popularPosts.length > 0 && (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-4">Popular Posts</h3>
            <ul className="space-y-3">
              {sidebarData.popularPosts.map(post => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors line-clamp-2">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {sidebarData.tags.length > 0 && (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {sidebarData.tags.map(tag => (
                <Button key={tag.id || tag.slug} variant="outline" size="sm" asChild>
                  <Link href={`/blog/tag/${tag.slug}`}>{tag.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        )}

         {/* CTA: Subscribe to Newsletter (Placeholder) */}
         <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">Subscribe for latest TEF updates!</p>
            <Button variant="default" className="w-full" disabled>
                Subscribe (Coming Soon) <ExternalLink className="ml-2 h-4 w-4"/>
            </Button>
          </div>
      </aside>
    </div>
  );
}
