// src/app/(public)/blog/page.tsx
import SectionTitle from '@/components/shared/SectionTitle';
import BlogPostCard from '@/components/shared/BlogPostCard';
import { mockBlogPosts, type BlogPost } from './mockBlogPosts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Function to get categories and tags for sidebar (simulated)
const getSidebarData = () => {
  const categories = new Set<string>();
  const tags = new Set<string>();
  mockBlogPosts.forEach(post => {
    post.categories.forEach(cat => categories.add(cat));
    post.tags.forEach(tag => tags.add(tag));
  });
  return {
    categories: Array.from(categories),
    tags: Array.from(tags),
    recentPosts: mockBlogPosts.slice(0, 5).map(p => ({ title: p.title, slug: p.slug })),
    // Popular posts would need view tracking in a real app
    popularPosts: mockBlogPosts.filter(p => p.featured).slice(0,3).map(p => ({ title: p.title, slug: p.slug })),
  };
};


export default function BlogPage() {
  // In a real app, fetch posts, implement pagination, search, etc.
  const posts = mockBlogPosts; 
  const sidebarData = getSidebarData();

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
              {posts.length > 0 ? (
                posts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))
              ) : (
                <p className="text-center text-muted-foreground col-span-full">No blog posts available yet. Check back soon!</p>
              )}
              {/* Pagination placeholder */}
              {posts.length > 5 && (
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
                  <Input type="search" placeholder="Search articles..." className="flex-grow" />
                  <Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-primary mb-4">Categories</h3>
                <ul className="space-y-2">
                  {sidebarData.categories.map(category => (
                    <li key={category}>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">{category}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Recent Posts */}
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-primary mb-4">Recent Posts</h3>
                <ul className="space-y-3">
                  {sidebarData.recentPosts.map(post => (
                    <li key={post.slug}>
                      <a href={`/blog/${post.slug}`} className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors line-clamp-2">{post.title}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Posts (Placeholder logic) */}
               <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-primary mb-4">Popular Posts</h3>
                <ul className="space-y-3">
                  {sidebarData.popularPosts.map(post => (
                    <li key={post.slug}>
                      <a href={`/blog/${post.slug}`} className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors line-clamp-2">{post.title}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags Placeholder */}
              {sidebarData.tags.length > 0 && (
                 <div className="bg-card p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-primary mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                    {sidebarData.tags.map(tag => (
                        <Button key={tag} variant="outline" size="sm" asChild>
                            <a href="#">{tag}</a>
                        </Button>
                    ))}
                    </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
