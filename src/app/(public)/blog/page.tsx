// src/app/(public)/blog/page.tsx
"use client"; // Add "use client" for useState and useEffect

import { useState, useEffect, useMemo } from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import BlogPostCard from '@/components/shared/BlogPostCard';
import { mockBlogPosts, type BlogPost } from './mockBlogPosts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Function to get categories and tags for sidebar
const getSidebarData = () => {
  const categories = new Set<string>();
  const tags = new Set<string>();
  mockBlogPosts.forEach(post => {
    post.categories.forEach(cat => categories.add(cat));
    post.tags.forEach(tag => tags.add(tag));
  });
  return {
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
    recentPosts: mockBlogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map(p => ({ title: p.title, slug: p.slug })),
    popularPosts: mockBlogPosts.filter(p => p.featured).slice(0,3).map(p => ({ title: p.title, slug: p.slug })),
  };
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(mockBlogPosts);

  const sidebarData = useMemo(() => getSidebarData(), []);

  useEffect(() => {
    if (searchTerm === '') {
      setDisplayedPosts(mockBlogPosts);
    } else {
      const filtered = mockBlogPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedPosts(filtered);
    }
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Blog Posts Area */}
            <div className="lg:col-span-8 space-y-10">
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))
              ) : (
                <p className="text-center text-muted-foreground col-span-full py-10">
                  No blog posts found matching your search criteria. Try a different term or clear the search.
                </p>
              )}
              {/* Pagination placeholder */}
              {displayedPosts.length > 5 && mockBlogPosts.length > 5 && (
                <div className="mt-12 text-center">
                  <Button variant="outline">Load More Posts (Placeholder)</Button>
                </div>
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
                      <li key={category}>
                        <Link href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-muted-foreground hover:text-primary transition-colors">
                          {category}
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
                        <Button key={tag} variant="outline" size="sm" asChild>
                            <Link href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>{tag}</Link>
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
        </div>
      </section>
    </>
  );
}
