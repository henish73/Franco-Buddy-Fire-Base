// src/app/(public)/blog/page.tsx
"use client"; 

import { useState, useEffect, useMemo } from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import BlogPostCard from '@/components/shared/BlogPostCard';
import { type BlogPost, type BlogCategory, type BlogTag } from './mockBlogPosts'; // Using type from mock for structure
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getBlogPostsAction, type BlogPostFormState } from '@/app/admin/blog-management/postActions';
import { getCategoriesAction, getTagsAction, type TaxonomyFormState } from '@/app/admin/blog-management/taxonomyActions';
import { useToast } from "@/hooks/use-toast";

export default function BlogPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogData = async () => {
    setIsLoading(true);
    try {
      const [postsResult, categoriesResult, tagsResult] = await Promise.all([
        getBlogPostsAction(),
        getCategoriesAction(),
        getTagsAction()
      ]);

      if (postsResult.isSuccess && postsResult.data) {
        const fetchedPosts = postsResult.data as BlogPost[];
        setAllPosts(fetchedPosts);
        setDisplayedPosts(fetchedPosts);
      } else {
        toast({ title: "Error fetching posts", description: postsResult.message, variant: "destructive" });
        setAllPosts([]);
        setDisplayedPosts([]);
      }

      if (categoriesResult.isSuccess && categoriesResult.data) {
        setCategories(categoriesResult.data as BlogCategory[]);
      } else {
        toast({ title: "Error fetching categories", description: categoriesResult.message, variant: "destructive" });
        setCategories([]);
      }

      if (tagsResult.isSuccess && tagsResult.data) {
        setTags(tagsResult.data as BlogTag[]);
      } else {
        toast({ title: "Error fetching tags", description: tagsResult.message, variant: "destructive" });
        setTags([]);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load blog data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sidebarData = useMemo(() => {
    return {
      categories: categories.sort((a,b) => a.name.localeCompare(b.name)),
      tags: tags.sort((a,b) => a.name.localeCompare(b.name)),
      recentPosts: allPosts.slice(0, 5).map(p => ({ title: p.title, slug: p.slug })), // Already sorted by date in getBlogPostsAction
      popularPosts: allPosts.filter(p => p.featured).slice(0,3).map(p => ({ title: p.title, slug: p.slug })),
    };
  }, [allPosts, categories, tags]);

  useEffect(() => {
    if (searchTerm === '') {
      setDisplayedPosts(allPosts);
    } else {
      const filtered = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(post.categories) && post.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setDisplayedPosts(filtered);
    }
  }, [searchTerm, allPosts]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading blog posts...</p>
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
              {/* Pagination placeholder */}
              {/* {allPosts.length > 5 && (
                <div className="mt-12 text-center">
                  <Button variant="outline">Load More Posts (Placeholder)</Button>
                </div>
              )} */}
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
        </div>
      </section>
    </>
  );
}
