
// src/app/admin/blog-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, PlusCircle, Edit3, Trash2, Tags, FolderTree } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockBlogPosts, type BlogPost } from '@/app/(public)/blog/mockBlogPosts'; // Using existing mock data
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Zod schema for blog post form validation
const blogPostSchema = z.object({
  id: z.string().optional(), // For editing
  slug: z.string().min(3, "Slug is required (min 3 chars, e.g., my-first-post)").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format (e.g., 'my-post-slug')"),
  title: z.string().min(5, "Title is required (min 5 chars)"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  author: z.string().min(3, "Author name is required"),
  excerpt: z.string().min(10, "Excerpt is required (min 10 chars)"),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }).optional().or(z.literal('')),
  imageAiHint: z.string().optional(),
  content: z.string().min(20, "Content is required (min 20 chars)"),
  categories: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  tags: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  featured: z.boolean().optional(),
});
type BlogPostFormData = z.infer<typeof blogPostSchema>;

// Category Type and Schema
export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};
const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Category name is required (min 2 chars)"),
  slug: z.string().min(2, "Slug is required (min 2 chars)").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().optional(),
});
type CategoryFormData = z.infer<typeof categorySchema>;

// Tag Type and Schema
export type BlogTag = {
  id: string;
  name: string;
  slug: string;
};
const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Tag name is required (min 2 chars)"),
  slug: z.string().min(2, "Slug is required (min 2 chars)").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});
type TagFormData = z.infer<typeof tagSchema>;

// Mock initial categories and tags - In a real app, fetch from Firestore
const initialCategories: BlogCategory[] = [
  { id: "cat1", name: "TEF Speaking", slug: "tef-speaking", description: "Tips for the TEF speaking section." },
  { id: "cat2", name: "Exam Strategies", slug: "exam-strategies", description: "General TEF exam strategies." },
];
const initialTags: BlogTag[] = [
  { id: "tag1", name: "TEF Tips", slug: "tef-tips" },
  { id: "tag2", name: "French Grammar", slug: "french-grammar" },
];


export default function AdminBlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);

  const [tags, setTags] = useState<BlogTag[]>(initialTags);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  
  // Initialize posts with mock data
  useEffect(() => {
    setPosts(mockBlogPosts.map(p => ({...p, id: p.slug }))); // Use slug as ID for mock posts
  }, []);

  const postForm = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { featured: false, categories: [], tags: [] }
  });

  const categoryForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const tagForm = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
  });

  // --- Post Management ---
  const openAddPostDialog = () => {
    postForm.reset({ 
      title: "", slug: "", date: new Date().toISOString().split('T')[0], 
      author: "Admin", excerpt: "", imageUrl: "", imageAiHint: "",
      content: "", categories: [], tags: [], featured: false,
    });
    setEditingPost(null);
    setIsPostDialogOpen(true);
  };

  const openEditPostDialog = (post: BlogPost) => {
    setEditingPost(post);
    postForm.reset({
      ...post,
      categories: post.categories.join(', '),
      tags: post.tags.join(', '),
    });
    setIsPostDialogOpen(true);
  };

  const onPostSubmit: SubmitHandler<BlogPostFormData> = (data) => {
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? { ...editingPost, ...data, id: editingPost.id } : p));
      console.log("Updating post:", { ...editingPost, ...data, id: editingPost.id });
    } else {
      const newPost = { ...data, id: data.slug }; // Use slug as ID
      setPosts([newPost as BlogPost, ...posts]);
      console.log("Adding new post:", newPost);
    }
    setIsPostDialogOpen(false);
    postForm.reset();
  };
  
  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    console.log(`Deleting post ${postId}`);
  };

  // --- Category Management ---
  const openAddCategoryDialog = () => {
    categoryForm.reset({ name: "", slug: "", description: "" });
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (category: BlogCategory) => {
    setEditingCategory(category);
    categoryForm.reset(category);
    setIsCategoryDialogOpen(true);
  };

  const onCategorySubmit: SubmitHandler<CategoryFormData> = (data) => {
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...editingCategory, ...data } : c));
      console.log("Updating category:", { ...editingCategory, ...data });
    } else {
      const newCategory = { ...data, id: `cat${Date.now()}` };
      setCategories([newCategory, ...categories]);
      console.log("Adding new category:", newCategory);
    }
    setIsCategoryDialogOpen(false);
    categoryForm.reset();
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
    console.log(`Deleting category ${categoryId}`);
  };

  // --- Tag Management ---
  const openAddTagDialog = () => {
    tagForm.reset({ name: "", slug: "" });
    setEditingTag(null);
    setIsTagDialogOpen(true);
  };

  const openEditTagDialog = (tag: BlogTag) => {
    setEditingTag(tag);
    tagForm.reset(tag);
    setIsTagDialogOpen(true);
  };

  const onTagSubmit: SubmitHandler<TagFormData> = (data) => {
    if (editingTag) {
      setTags(tags.map(t => t.id === editingTag.id ? { ...editingTag, ...data } : t));
      console.log("Updating tag:", { ...editingTag, ...data });
    } else {
      const newTag = { ...data, id: `tag${Date.now()}` };
      setTags([newTag, ...tags]);
      console.log("Adding new tag:", newTag);
    }
    setIsTagDialogOpen(false);
    tagForm.reset();
  };

  const handleDeleteTag = (tagId: string) => {
    setTags(tags.filter(t => t.id !== tagId));
    console.log(`Deleting tag ${tagId}`);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Blog Content Management</h1>

      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-3 md:max-w-md">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        {/* Posts Tab Content */}
        <TabsContent value="posts" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Posts</h2>
            <Button onClick={openAddPostDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add New Post</Button>
          </div>
          <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
            <DialogContent className="sm:max-w-[725px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>{editingPost ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
                <DialogDescription>
                  {editingPost ? "Update the details of this blog post." : "Enter the details for the new blog post."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={postForm.handleSubmit(onPostSubmit)} id="blogPostForm" className="grid gap-4 py-4 flex-grow overflow-y-auto pr-2">
                {/* Post Form Fields from previous implementation */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" {...postForm.register("title")} className="col-span-3" />
                  {postForm.formState.errors.title && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.title.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">Slug</Label>
                  <Input id="slug" {...postForm.register("slug")} className="col-span-3" placeholder="e.g., my-first-post" />
                  {postForm.formState.errors.slug && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.slug.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Input id="date" type="date" {...postForm.register("date")} className="col-span-3" />
                  {postForm.formState.errors.date && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.date.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">Author</Label>
                  <Input id="author" {...postForm.register("author")} className="col-span-3" />
                  {postForm.formState.errors.author && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.author.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="excerpt" className="text-right pt-2">Excerpt</Label>
                  <Textarea id="excerpt" {...postForm.register("excerpt")} className="col-span-3" rows={3} />
                  {postForm.formState.errors.excerpt && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.excerpt.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content" className="text-right pt-2">Content (Markdown/HTML)</Label>
                  <Textarea id="content" {...postForm.register("content")} className="col-span-3" rows={8} />
                  {postForm.formState.errors.content && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.content.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                  <Input id="imageUrl" {...postForm.register("imageUrl")} className="col-span-3" placeholder="https://placehold.co/800x400.png"/>
                  {postForm.formState.errors.imageUrl && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.imageUrl.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageAiHint" className="text-right">Image AI Hint</Label>
                  <Input id="imageAiHint" {...postForm.register("imageAiHint")} className="col-span-3" placeholder="e.g., student learning french"/>
                  {postForm.formState.errors.imageAiHint && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.imageAiHint.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categories_post" className="text-right">Categories</Label>
                  <Input id="categories_post" {...postForm.register("categories")} className="col-span-3" placeholder="Comma-separated, e.g., TEF Speaking, Exam Tips" />
                  {postForm.formState.errors.categories && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.categories.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags_post" className="text-right">Tags</Label>
                  <Input id="tags_post" {...postForm.register("tags")} className="col-span-3" placeholder="Comma-separated, e.g., TEF, French, Canada" />
                  {postForm.formState.errors.tags && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.tags.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="featured" className="text-right">Featured Post</Label>
                    <div className="col-span-3 flex items-center">
                        <Input type="checkbox" id="featured" {...postForm.register("featured")} className="h-4 w-4 mr-2"/>
                        <Label htmlFor="featured" className="font-normal">Mark as featured</Label>
                    </div>
                    {postForm.formState.errors.featured && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.featured.message}</p>}
                </div>
              </form>
              <DialogFooter className="mt-auto pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsPostDialogOpen(false)}>Cancel</Button>
                <Button type="submit" form="blogPostForm">{editingPost ? "Save Changes" : "Add Post"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Categories</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                    <TableCell className="hidden lg:table-cell">{new Date(post.date).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.categories.join(', ')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditPostDialog(post)}><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeletePost(post.id!)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {posts.length === 0 && <p className="text-center text-muted-foreground py-8">No blog posts found.</p>}
        </TabsContent>

        {/* Categories Tab Content */}
        <TabsContent value="categories" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Categories</h2>
            <Button onClick={openAddCategoryDialog}><FolderTree className="mr-2 h-4 w-4" /> Add New Category</Button>
          </div>
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} id="categoryForm" className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoryName">Name</Label>
                  <Input id="categoryName" {...categoryForm.register("name")} />
                  {categoryForm.formState.errors.name && <p className="text-sm text-destructive">{categoryForm.formState.errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categorySlug">Slug</Label>
                  <Input id="categorySlug" {...categoryForm.register("slug")} placeholder="e.g., exam-tips" />
                  {categoryForm.formState.errors.slug && <p className="text-sm text-destructive">{categoryForm.formState.errors.slug.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoryDescription">Description (Optional)</Label>
                  <Textarea id="categoryDescription" {...categoryForm.register("description")} rows={3} />
                </div>
              </form>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                <Button type="submit" form="categoryForm">{editingCategory ? "Save Changes" : "Add Category"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="hidden md:table-cell">{category.description}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditCategoryDialog(category)}><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {categories.length === 0 && <p className="text-center text-muted-foreground py-8">No categories found.</p>}
        </TabsContent>

        {/* Tags Tab Content */}
        <TabsContent value="tags" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Tags</h2>
            <Button onClick={openAddTagDialog}><Tags className="mr-2 h-4 w-4" /> Add New Tag</Button>
          </div>
          <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={tagForm.handleSubmit(onTagSubmit)} id="tagForm" className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="tagName">Name</Label>
                  <Input id="tagName" {...tagForm.register("name")} />
                  {tagForm.formState.errors.name && <p className="text-sm text-destructive">{tagForm.formState.errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tagSlug">Slug</Label>
                  <Input id="tagSlug" {...tagForm.register("slug")} placeholder="e.g., tef-canada" />
                  {tagForm.formState.errors.slug && <p className="text-sm text-destructive">{tagForm.formState.errors.slug.message}</p>}
                </div>
              </form>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsTagDialogOpen(false)}>Cancel</Button>
                <Button type="submit" form="tagForm">{editingTag ? "Save Changes" : "Add Tag"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell>{tag.slug}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditTagDialog(tag)}><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {tags.length === 0 && <p className="text-center text-muted-foreground py-8">No tags found.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

